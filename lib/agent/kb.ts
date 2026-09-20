import type { KbEntry } from "../support-kit/types";
export type { KbEntry };

export const KB: KbEntry[] = [
  {
    id: "what",
    title: "What AgentAegis does",
    keywords: ["AgentAegis", "agentguard", "what", "product", "about", "Put guardrails on your agents inputs and outputs"],
    body: "Put guardrails on your agents inputs and outputs. AgentAegis reviews an agent's prompt and tool list, rates the risk of each tool call, and suggests input/output filters plus an EU AI Act mapping - so an agent cannot silently exfiltrate data or take an unguarded action.",
    source: "AgentAegis product definition",
    tags: [],
  },
  {
    id: "features",
    title: "AgentAegis features",
    keywords: ["features", "feature", "can", "does", "Deterministic tool-risk checklist (rulesetVersion)", "Tool-call risk rating", "Input/output filters", "EU AI Act mapping", "Blocklist suggestions"],
    body: "AgentAegis includes: Deterministic tool-risk checklist (rulesetVersion); Tool-call risk rating; Input/output filters; EU AI Act mapping; Blocklist suggestions. It does not add capabilities that are not listed here.",
    source: "AgentAegis feature list",
    tags: [],
  },
  {
    id: "pricing",
    title: "AgentAegis pricing",
    keywords: ["price", "pricing", "plan", "cost", "billing", "subscription", "monthly", "yearly"],
    body: "Listed prices for AgentAegis: $29/month and $290/year. Checkout uses the in-app checkout route. This assistant cannot change a subscription or issue a refund.",
    source: "AgentAegis pricing fields",
    tags: [],
  },
  {
    id: "howto",
    title: "How to use AgentAegis",
    keywords: ["how", "start", "use", "tool", "run", "Guardrail your agent"],
    body: "Open AgentAegis and use Guardrail your agent. The form asks for: Paste your agent system prompt; List the tools the agent can call; Risk appetite.",
    source: "AgentAegis tool fields",
    tags: [],
  },
  {
    id: "faq-1",
    title: "What risks does AgentAegis catch?",
    keywords: ["What", "risks", "does", "AgentAegis", "catch?"],
    body: "Secret leakage in prompts, prompt-injection patterns, and unsafe tool or function calls, mapped to the OWASP Top 10 for LLM Applications.",
    source: "AgentAegis FAQ",
    tags: [],
  },
  {
    id: "faq-2",
    title: "Does it run live AI?",
    keywords: ["Does", "it", "run", "live", "AI?"],
    body: "Pro uses the platform LLM key under fair use; Free and demo mode return a realistic mock report without live calls.",
    source: "AgentAegis FAQ",
    tags: [],
  },
  {
    id: "faq-3",
    title: "How does it map to OWASP LLM Top 10?",
    keywords: ["How", "does", "it", "map", "to", "OWASP"],
    body: "Findings reference LLM01 (prompt injection), LLM02 (data exfiltration), and LLM06 (over-reliance) where relevant.",
    source: "AgentAegis FAQ",
    tags: [],
  },
  {
    id: "honesty",
    title: "What this assistant will not claim",
    keywords: ["legal", "advice", "guarantee", "demo", "human", "refund", "support"],
    body: "Answers about AgentAegis are decision support only, not legal, tax, accessibility-certification, or compliance sign-off. This assistant does not invent integrations, SSO, CSV export, or Slack connections unless they are already in the product description. If live AI is unavailable, the product must not pretend a demo result is live. Say you want a human and leave an email if you need a person.",
    source: "AgentAegis support policy",
    tags: ["compliance"],
  },
];

function normalize(s: string): string {
  return (s || "").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ");
}
function toWords(s: string): string[] {
  return normalize(s).split(/\s+/).map((w) => w.trim()).filter(Boolean);
}
function cjkBigrams(s: string): string[] {
  const grams: string[] = [];
  const han = /[\u4e00-\u9fff]/;
  for (const w of toWords(s)) {
    if (han.test(w) && w.length >= 2) {
      for (let i = 0; i < w.length - 1; i++) grams.push(w.slice(i, i + 2));
    }
  }
  return grams;
}
function scoreEntry(entry: KbEntry, query: string): number {
  const q = normalize(query);
  const qWords = new Set(toWords(q));
  const qGrams = new Set(cjkBigrams(q));
  let s = 0;
  for (const kw of entry.keywords) {
    const k = kw.toLowerCase();
    if (q.includes(k)) s += 3;
  }
  for (const tw of toWords(entry.title)) {
    if (qWords.has(tw)) s += 2;
  }
  const idx = normalize(entry.keywords.join(" ") + " " + entry.title + " " + entry.body.slice(0, 400));
  for (const g of qGrams) if (idx.includes(g)) s += 0.5;
  return s;
}

export interface RetrieveResult {
  entries: KbEntry[];
  topScore: number;
}

export function retrieve(query: string, topK = 4, entries: KbEntry[] = KB): RetrieveResult {
  const scored = entries
    .map((e) => ({ e, s: scoreEntry(e, query) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, topK);
  return { entries: scored.map((x) => x.e), topScore: scored.length ? scored[0].s : 0 };
}

export function isComplianceRelated(entries: KbEntry[]): boolean {
  return entries.some((e) => e.tags.includes("compliance"));
}
