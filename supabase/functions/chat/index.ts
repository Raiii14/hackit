import { corsHeaders } from "../_shared/cors.ts";

type ChatRole = "user" | "assistant";
type RiskStatus = "green" | "yellow" | "red";

interface ChatRequest {
  message?: string;
  history?: Array<{ role?: ChatRole; content?: string }>;
  loanContext?: {
    inputs?: Record<string, unknown>;
    result?: Record<string, unknown> & { healthStatus?: RiskStatus };
  };
}

interface ServiceAccount {
  project_id?: string;
  client_email: string;
  private_key: string;
}

const vertexProjectId = Deno.env.get("VERTEX_PROJECT_ID");
const vertexLocation = Deno.env.get("VERTEX_LOCATION") ?? "us-central1";
const vertexModel = Deno.env.get("VERTEX_MODEL") ?? "gemini-2.5-flash";
const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
const maxOutputTokens = 1200;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return jsonResponse({ ok: true });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Use POST for chat requests." }, 405);
  }

  try {
    let body: ChatRequest;
    try {
      body = (await req.json()) as ChatRequest;
    } catch {
      return jsonResponse({ error: "Invalid JSON body. Send application/json with message, history, loanContext." }, 400);
    }

    const message = body.message?.trim();

    if (!message) {
      return jsonResponse({ error: "Missing message." }, 400);
    }

    if (!serviceAccountJson || !vertexModel) {
      return jsonResponse({ error: "LoanWise AI is not configured." }, 500);
    }

    const reply = await askVertexAi({
      message,
      history: body.history ?? [],
      loanContext: body.loanContext ?? {},
    });

    return jsonResponse({ reply });
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: "Chat request failed." }, 500);
  }
});

async function askVertexAi(input: {
  message: string;
  history: Array<{ role?: ChatRole; content?: string }>;
  loanContext: Record<string, unknown>;
}): Promise<string> {
  const serviceAccount = parseServiceAccount();
  const projectId = vertexProjectId ?? serviceAccount.project_id;

  if (!projectId) {
    throw new Error("Missing Vertex project id.");
  }

  const accessToken = await getGoogleAccessToken(serviceAccount);
  const modelPath = `projects/${projectId}/locations/${vertexLocation}/publishers/google/models/${vertexModel}`;
  const vertexHost =
    vertexLocation === "global"
      ? "aiplatform.googleapis.com"
      : `${vertexLocation}-aiplatform.googleapis.com`;
  const url = `https://${vertexHost}/v1/${modelPath}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: buildSystemInstruction() }],
      },
      contents: buildVertexContents(input),
      generationConfig: {
        temperature: 0.25,
        maxOutputTokens,
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Vertex AI error:", response.status, detail);
    throw new Error("Vertex AI request failed.");
  }

  const payload = await response.json();
  const reply = payload?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text ?? "")
    .join("")
    .trim();

  if (!reply) {
    throw new Error("Vertex AI returned an empty reply.");
  }

  return reply;
}

function buildSystemInstruction(): string {
  return [
    "You are LoanWise's result explainer for a hackathon prototype in the Philippines.",
    "Your job is to explain the already-computed loan result in plain English or light Taglish when useful.",
    "Use only the provided inputs and EvaluationResult. Do not invent fees, rates, approvals, lender options, or hidden formulas.",
    "Do not act as a lender, financial advisor, credit bureau, or approval tool.",
    "Do not tell the user to take a loan. Explain risk, buffer, shortfall, true cost, and safer questions to ask.",
    "If the result is red, be direct about the cash gap. If yellow, explain the thin buffer. If green, still mention stress risk.",
    "Keep answers short: 3 to 6 bullets or short paragraphs.",
    "Always include that this is a prototype and not financial advice.",
  ].join(" ");
}

function buildVertexContents(input: {
  message: string;
  history: Array<{ role?: ChatRole; content?: string }>;
  loanContext: Record<string, unknown>;
}) {
  const history = input.history
    .filter((item) => item.role && item.content?.trim())
    .slice(-8)
    .map((item) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [{ text: item.content!.trim() }],
    }));

  while (history[0]?.role === "model") {
    history.shift();
  }

  return [
    ...history,
    {
      role: "user",
      parts: [
        {
          text: [
            `LoanWise computed context:\n${JSON.stringify(input.loanContext, null, 2)}`,
            `User question:\n${input.message}`,
          ].join("\n\n"),
        },
      ],
    },
  ];
}

function parseServiceAccount(): ServiceAccount {
  const raw = serviceAccountJson?.trim() ?? "";
  // Secrets set from a combined .env line can append VERTEX_* after the JSON.
  const jsonEnd = raw.lastIndexOf("}");
  const json = jsonEnd === -1 ? raw : raw.slice(0, jsonEnd + 1);
  return JSON.parse(json) as ServiceAccount;
}

async function getGoogleAccessToken(serviceAccount: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const jwtHeader = { alg: "RS256", typ: "JWT" };
  const jwtClaim = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const unsignedJwt = `${base64UrlEncode(JSON.stringify(jwtHeader))}.${base64UrlEncode(
    JSON.stringify(jwtClaim),
  )}`;
  const signature = await signJwt(unsignedJwt, serviceAccount.private_key);
  const jwt = `${unsignedJwt}.${signature}`;

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!tokenResponse.ok) {
    const detail = await tokenResponse.text();
    console.error("Google token error:", tokenResponse.status, detail);
    throw new Error("Could not get Google access token.");
  }

  const tokenPayload = await tokenResponse.json();
  if (!tokenPayload.access_token) {
    throw new Error("Google token response did not include an access token.");
  }

  return tokenPayload.access_token;
}

async function signJwt(unsignedJwt: string, privateKeyPem: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(privateKeyPem),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsignedJwt),
  );
  return base64UrlEncode(signature);
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const base64 = pem
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes.buffer;
}

function base64UrlEncode(value: string | ArrayBuffer): string {
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : new Uint8Array(value);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
