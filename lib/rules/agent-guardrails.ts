export const RULESET_VERSION = 'agent-guardrails@2026-07-19'

export type GuardRule = {
  id: string
  title: string
  severity: 'low' | 'medium' | 'high'
  check: (ctx: { prompt: string; tools: string; appetite: string }) => boolean
  remediation: string
  ref?: string
}

export const GUARD_RULES: GuardRule[] = [
  {
    id: 'AG-01',
    title: 'Unscoped SQL / data tool present',
    severity: 'high',
    check: ({ tools }) => /sql|database|db_|query|delete_record/i.test(tools),
    remediation: 'Require read-only roles, row caps, and human approval for writes/deletes.',
    ref: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
  },
  {
    id: 'AG-02',
    title: 'Outbound HTTP / email without allowlist signal',
    severity: 'medium',
    check: ({ tools }) => /http|fetch|send_email|webhook/i.test(tools),
    remediation: 'Add domain/recipient allowlists and rate limits before tool execution.',
    ref: 'https://owasp.org/www-community/vulnerabilities/Server_Side_Request_Forgery',
  },
  {
    id: 'AG-03',
    title: 'System prompt lacks tool-use boundaries',
    severity: 'medium',
    check: ({ prompt }) => !/never|must not|only|allowlist|human approval/i.test(prompt),
    remediation: 'State explicit deny-by-default tool policy in the system prompt.',
    ref: 'https://www.nist.gov/itl/ai-risk-management-framework',
  },
  {
    id: 'AG-04',
    title: 'Destructive action without confirmation gate',
    severity: 'high',
    check: ({ tools }) => /delete|drop|refund|transfer|execute/i.test(tools),
    remediation: 'Gate destructive tools behind human_confirm and dual-control.',
    ref: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
  },
  {
    id: 'AG-05',
    title: 'Permissive appetite with high-power tools',
    severity: 'low',
    check: ({ tools, appetite }) =>
      /permissive/i.test(appetite) && /sql|delete|http|email/i.test(tools),
    remediation: 'Tighten risk appetite or reduce tool surface before production.',
    ref: 'https://www.nist.gov/itl/ai-risk-management-framework',
  },
]

export function runDeterministicChecks(inputs: Record<string, string>) {
  const ctx = {
    prompt: String(inputs.agent_prompt || inputs.topic || ''),
    tools: String(inputs.tools || ''),
    appetite: String(inputs.risk_appetite || 'Balanced'),
  }
  const hits = GUARD_RULES.filter((r) => r.check(ctx)).map((r) => ({
    id: r.id,
    title: r.title,
    severity: r.severity,
    remediation: r.remediation,
    ref: r.ref,
    source: 'Rule-based' as const,
  }))
  return { rulesetVersion: RULESET_VERSION, hits }
}
