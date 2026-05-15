import type { EvaluationResult, LoanInputs } from "../App";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatApiResponse {
  reply?: string;
  message?: string;
  content?: string;
  text?: string;
  error?: string;
}

const chatApiUrl =
  import.meta.env.VITE_CHAT_API_URL?.trim().replace(/\/+$/, "") ||
  (import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/+$/, "")
    ? `${import.meta.env.VITE_SUPABASE_URL.trim().replace(/\/+$/, "")}/functions/v1/chat`
    : "");
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isLoanWiseChatConfigured = Boolean(chatApiUrl && supabaseAnonKey);

function extractReply(payload: ChatApiResponse): string | null {
  const candidates = [payload.reply, payload.message, payload.content, payload.text];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return null;
}

export async function askLoanWiseAi({
  message,
  history,
  inputs,
  result,
}: {
  message: string;
  history: ChatMessage[];
  inputs: LoanInputs;
  result: EvaluationResult;
}): Promise<string> {
  if (!isLoanWiseChatConfigured) {
    throw new Error("LoanWise AI is not configured.");
  }

  const response = await fetch(chatApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey!,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({
      message: message.trim(),
      history,
      loanContext: {
        inputs,
        result,
      },
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as ChatApiResponse;

  if (!response.ok) {
    throw new Error(payload.error || "AI request failed.");
  }

  const reply = extractReply(payload);
  if (!reply) {
    throw new Error("AI returned an empty reply.");
  }

  return reply;
}
