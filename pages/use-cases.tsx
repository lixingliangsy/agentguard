import React from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import { PRODUCT } from '../lib/product'

const segments = [
  {
    name: "Tool-using agents",
    pain: "Email/SQL/HTTP tools can take irreversible actions.",
    how: "Rate each tool, propose I/O filters, suggest blocklists.",
  },
  {
    name: "EU-bound agents",
    pain: "Need high-level EU AI Act mapping for oversight.",
    how: "Map highest-risk actions to relevant obligations (decision-support).",
  },
  {
    name: "Risk appetite tuning",
    pain: "Strict vs permissive policies differ by product.",
    how: "Respect stated appetite in recommendations.",
  },
  {
    name: "Platform security",
    pain: "Need explainable guardrail reports for reviews.",
    how: "Deterministic tool-risk checklist with rulesetVersion.",
  },
]

export default function UseCasesPage() {
  return (
    <Layout>
      <Head>
        <title>{`${PRODUCT.name} — Use Cases`}</title>
        <meta name="description" content={`How ${PRODUCT.name} helps ${PRODUCT.tagline}`} />
      </Head>
      <div className="max-w-4xl">
        <div className="text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3">Use Cases</div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Built for agent builders and compliance leads</h1>
        <p className="text-lg text-slate-600 mb-10">Pick your segment to see the workflows that matter most.</p>

        <div className="space-y-5">
          {segments.map((s) => (
            <div key={s.name} className="rounded-2xl border border-slate-200 p-6 bg-white">
              <h2 className="text-xl font-bold mb-2 text-slate-900">{s.name}</h2>
              <p className="text-sm text-slate-600 mb-2"><span className="font-semibold text-slate-900">Pain: </span>{s.pain}</p>
              <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">How {PRODUCT.name} helps: </span>{s.how}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-8">refs: OWASP Top 10 for AI Agents · EU AI Act (Reg. 2024/1689) · OWASP LLM01</p>
      </div>
    </Layout>
  )
}
