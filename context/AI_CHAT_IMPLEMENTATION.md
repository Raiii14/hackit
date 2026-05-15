# AI Chat Implementation

Minimal guest AI that explains the **already-computed** loan verdict. Not a lender, not financial advice.

## Architecture

```text
Frontend (LoanWiseChat) → POST /functions/v1/chat → Vertex AI (Gemini)
```

| Piece | Location |
|-------|----------|
| UI | `Frontend/src/app/components/LoanWiseChat.tsx` |
| Client | `Frontend/src/app/utils/loanwiseChat.ts` |
| Edge function | `supabase/functions/chat/index.ts` |
| Google credential (local only) | `loanwise-ai.json` (gitignored) |
| Vertex secrets | Supabase project secrets |

**Reference pattern:** Same stack as `D:\Documents\ClearStack` (Supabase Edge Function + Vertex + service account JSON in secrets).

## Env vars

**Frontend** (`Frontend/.env.local`):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` — must be the **legacy anon JWT** (`eyJ...`), not `sb_publishable_`
- `VITE_CHAT_API_URL` — optional; defaults to `{SUPABASE_URL}/functions/v1/chat`

**Supabase secrets** (set separately):

- `GOOGLE_SERVICE_ACCOUNT_JSON` — full service account JSON only
- `VERTEX_PROJECT_ID` — `loanwise-ai-496419`
- `VERTEX_LOCATION` — `us-central1` (ClearStack default; works here)
- `VERTEX_MODEL` — `gemini-2.5-flash`

## Deploy (one-time)

```powershell
# Google JSON only — see supabase/functions/chat/README.md
supabase secrets set --env-file supabase/functions/secrets.vertex.env --project-ref puoaptudxlejbloijhvu
supabase functions deploy chat --project-ref puoaptudxlejbloijhvu
```

## Decisions

| Decision | Rationale |
|----------|-----------|
| Edge function holds Google credentials | Browser must never see service account JSON |
| Guest calls with anon JWT | No login required for demo; matches hackathon guest flow |
| AI explains `loanContext` only | AI must not invent rates or approve loans (`TEAM_INTERNAL.md`) |
| `us-central1` + explicit `VERTEX_PROJECT_ID` | Matches working ClearStack setup; `global` was untested end-to-end |
| `gemini-2.5-flash` | Team choice after enabling Vertex on GCP |
| `verify_jwt = true` | Standard Supabase guard; requires JWT anon key |

## Mistakes / errors (and fixes)

| Symptom | Cause | Fix |
|---------|-------|-----|
| `Invalid JWT` | Used `sb_publishable_` key | Use legacy anon JWT in `Frontend/.env.local` |
| `JSON.parse` at position ~2335 in `parseServiceAccount` | `GOOGLE_SERVICE_ACCOUNT_JSON` secret included trailing `VERTEX_LOCATION=...` from a single-line `.env.local` | Set Google secret from `loanwise-ai.json` alone; use `secrets.vertex.env` for Vertex vars |
| `Invalid secret pair: PRIVATE` | PowerShell expanded `$json` inline | Use `--env-file` with minified JSON, not `secrets set GOOGLE...="$json"` |
| `Invalid JSON body` (400) | Broken PowerShell `curl` escaping | Use app or `Invoke-RestMethod`; frontend `JSON.stringify` is fine |
| `404 function not found` | Function not deployed | `supabase functions deploy chat` |
| Reply **cuts off mid-sentence** | Output token cap too low | `maxOutputTokens` raised to `1200` in `supabase/functions/chat/index.ts`; redeploy required before hosted function changes |

## Alternatives considered

| Alternative | Why not used |
|-------------|--------------|
| Call Vertex from browser | Exposes credentials |
| OpenAI / other API | Team already had GCP + ClearStack Vertex pattern |
| `supabase login` browser only | Access token CLI works (`SUPABASE_ACCESS_TOKEN` or `supabase login --token`) |
| Root `.env` for Frontend | Vite reads `Frontend/.env.local` only |
| `VERTEX_LOCATION=global` | Switched to `us-central1` to align with ClearStack after auth/secret issues |

## Request / response

**POST** `{ message, history, loanContext: { inputs, result } }`  
**200** `{ reply: "..." }`

Guardrails in system prompt: prototype disclaimer, no loan approval, use only provided numbers.

## Known gap

- If replies still truncate after redeploy, keep the answer shorter in the system prompt before raising the token cap again. Higher caps increase latency and cost.

## Security

- Never commit `loanwise-ai.json`, `.env.local`, or tokens.
- Anon key is public in the browser; edge function is not abuse-proof without rate limits.
