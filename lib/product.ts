export interface InputField {
  key: string
  label: string
  type: 'input' | 'textarea' | 'select'
  placeholder?: string
  options?: string[]
}

export const PRODUCT = {
  priceMonthly: 29,
  priceYearly: 290,
  name: "AgentAegis",
  slug: "agentguard",
  pipelineId: "agent-guard-v1",
  rulesetId: "agent-guardrails@2026-07-19",
  productId: "PROD_3wrrygyAVOOsgAyIpXEU9v",
  yearlyProductId: "PROD_6GN3zjuHwKsUH9C9hNt3Ou",
  checkoutUrl: "/api/checkout",
  tagline: "Put guardrails on your agents inputs and outputs",
  description: "AgentAegis reviews an agent's prompt and tool list, rates the risk of each tool call, and suggests input/output filters plus an EU AI Act mapping - so an agent cannot silently exfiltrate data or take an unguarded action.",
  toolTitle: "Guardrail your agent",
  resultLabel: "Guardrail report",
  ctaLabel: "Check guards",
  definitionLead: `AgentAegis is an AI-agent guardrail layer that scores system prompts and tool calls for security risks - secret leakage, prompt injection, and unsafe tool use - using rule-based checks plus a model-assisted filter, and returns a cited guardrail report.`,
  geoFaq: [
    { q: "What risks does AgentAegis catch?", a: "Secret leakage in prompts, prompt-injection patterns, and unsafe tool or function calls, mapped to the OWASP Top 10 for LLM Applications." },
    { q: "Does it run live AI?", a: "Pro uses the platform LLM key under fair use; Free and demo mode return a realistic mock report without live calls." },
    { q: "How does it map to OWASP LLM Top 10?", a: "Findings reference LLM01 (prompt injection), LLM02 (data exfiltration), and LLM06 (over-reliance) where relevant." },
    { q: "Can I export the guardrail report?", a: "Yes - Pro exports a report with runId and ruleset version for audit." },
    { q: "Is it a WAF?", a: "No. It is a pre-deployment review layer for agent builders, not a network firewall." },
    { q: "Which agent frameworks are supported?", a: "Any agent that exposes a system prompt and tool list (LangChain, AutoGen, or a custom stack)." }
  ],

  features: [
  "Deterministic tool-risk checklist (rulesetVersion)",
  "Tool-call risk rating",
  "Input/output filters",
  "EU AI Act mapping",
  "Blocklist suggestions"
],
  inputs: [
  {
    "key": "agent_prompt",
    "label": "Paste your agent system prompt",
    "type": "textarea",
    "placeholder": "You are a support agent with access to email, a SQL DB, and an HTTP tool..."
  },
  {
    "key": "tools",
    "label": "List the tools the agent can call",
    "type": "textarea",
    "placeholder": "send_email, run_sql, http_request, delete_record"
  },
  {
    "key": "risk_appetite",
    "label": "Risk appetite",
    "type": "select",
    "options": [
      "Strict",
      "Balanced",
      "Permissive"
    ]
  }
] as InputField[],
  systemPrompt: "You are an AI agent security engineer. Given an agent system prompt and its tool list, rate the risk of each tool call (low/medium/high), propose concrete input and output filters, map the highest-risk actions to EU AI Act obligations where relevant, and suggest a blocklist of dangerous operations. Respect the stated risk appetite.",
  pricing: [
    {
      "tier": "Free",
      "price": "$0",
      "desc": "1 workflow run / day · watermarked export"
    },
    {
      "tier": "Pro",
      "price": "$29/mo",
      "desc": "300 workflow runs / mo · audit log · export"
    },
    {
      "tier": "Enterprise",
      "price": "Custom",
      "desc": "BYOK · shared rulesets · higher caps · SSO (roadmap)"
    }
  ],
  mock: (inputs: Record<string, string>): string => {
  const prompt = (inputs['agent_prompt'] || '').trim()
  const tools = (inputs['tools'] || '').trim()
  const appetite = inputs['risk_appetite'] || 'Balanced'
  if (!tools) return 'List the tools the agent can call to get a guardrail report.'
  let out = `AGENT GUARDRAILS (` + appetite + `)

TOOL RISK:
  send_email - MEDIUM (rate-limit + recipient allowlist)
  run_sql - HIGH (read-only role + row cap)
  http_request - MEDIUM (domain allowlist)
  delete_record - HIGH (require human approval)

FILTERS: strip PII from outputs; cap payload size; block outbound to non-allowlist domains
EU AI ACT: delete_record and run_sql map to high-risk obligation articles - log every call

--- (Mock report. Pro adds live pre/post filters and an audit trail.)`
  return out
}
}
