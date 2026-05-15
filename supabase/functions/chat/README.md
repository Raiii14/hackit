# LoanWise Chat Edge Function

Minimal backend path:

1. Frontend sends `{ message, history, loanContext }` to `/functions/v1/chat`.
2. This function calls Vertex AI using a Google service account stored as a Supabase secret.
3. This function returns `{ "reply": "..." }`.

Required Supabase secrets:

```txt
GOOGLE_SERVICE_ACCOUNT_JSON=
VERTEX_LOCATION=global
VERTEX_MODEL=gemini-2.5-flash
```

`VERTEX_PROJECT_ID` is optional when the service account JSON includes `project_id`.

Set secrets from the repo root without committing the credential:

```powershell
# Google JSON only (never put VERTEX_* on the same line as the JSON)
$json = Get-Content .\loanwise-ai.json -Raw | ConvertFrom-Json | ConvertTo-Json -Compress -Depth 10
$path = "supabase\.temp\google-only.env"
[System.IO.File]::WriteAllText("$PWD\$path", "GOOGLE_SERVICE_ACCOUNT_JSON=$json")
supabase secrets set --env-file $path --project-ref YOUR_PROJECT_REF
Remove-Item $path

supabase secrets set --env-file supabase/functions/secrets.vertex.env --project-ref YOUR_PROJECT_REF
```

Deploy:

```powershell
supabase functions deploy chat
```

Guest users call the function with the Supabase anon key as the bearer token. This keeps login optional, but it is not abuse-proof because the anon key is public in the browser.
