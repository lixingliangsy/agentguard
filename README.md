# AgentAegis

> Put guardrails on your agents inputs and outputs
>
> AgentAegis reviews an agent's prompt and tool list, rates the risk of each tool call, and suggests input/output filters plus an EU AI Act mapping - so an agent cannot silently exfiltrate data or take an unguarded action.

AI-powered micro-SaaS — part of the OPC product factory. Web-first (Next.js 14),
deployable to Vercel, subscription-ready.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional: add OPENAI_API_KEY for real AI
npm run dev                  # http://localhost:3000
```

Without an API key the app runs in **Mock mode** (returns a demo output).

## Build & deploy (Vercel)

```bash
# SAFEGUARD ⑥: use system Node 24.12.0 toolchain (the managed Node 22 npm is broken).
# Build needs the sandbox disabled to rewrite .next cache: vercel build must run with dangerouslyDisableSandbox.
npm run build
# Vercel: import repo, set framework = Next.js, root = 12_Micro_SaaS出海/agentguard
```

## Payments (subscription)

Wire checkout via `pages/api/checkout` (template included): it redirects server-side to
`WAFFO_STORE_URL` — never hardcode a `cs_*` session link (Waffo Sessions expire ~45min).
Web-first checkout keeps fees at 2–5% and avoids the 30% app-store cut.

> SAFEGUARD ⑤ (environment isolation): keep TEST key + test card `4576 7500 0000 0110` in test mode;
> only flip to production after Waffo Dashboard shows `Approved for production payments` (KYC done).
> Never mix TEST/PROD keys, and never list the same slug in both environments.

## Config

All product-specific text lives in `lib/product.ts` (name, inputs, system prompt,
pricing, mock). To clone a new product, copy this folder and edit `lib/product.ts`.

## Related
A directory of 100+ vertical AI micro-SaaS tools I built: [lxsaihub.com](https://lxsaihub.com)
— includes AIActRadar (EU AI Act risk mapping) and AgentRedTeam (AI agent red-teaming).
