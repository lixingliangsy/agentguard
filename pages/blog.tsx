import React from 'react'
import Head from 'next/head'
import { buildFaqJsonLd, buildHowToJsonLd } from '../lib/schema'
import Layout from '../components/Layout'
import { PRODUCT } from '../lib/product'
import { geoPosts } from '../data/geoPosts'

const AIACT = 'https://artificialintelligenceact.eu/'
const EURLEX = 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj'
const EC = 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai'

const posts = [
  {
    slug: 'what-is-agent-guardrails',
    title: 'What are agent guardrails? Input/output controls for AI agents',
    type: 'Definitional · FAQPage',
    query: 'what are agent guardrails ai',
    body: 'Agent guardrails are the input and output controls that stop an autonomous AI agent from taking an unguarded action — exfiltrating data through a tool call, running a destructive command, or leaking PII in a reply. They sit between the model and the tools: rate each tool call by risk, filter prompts and responses, and map high-risk actions to the EU AI Act obligations that apply to the deploying organization.',
    refs: [AIACT, EURLEX, EC],
  },
  {
    slug: 'eu-ai-act-agent-obligations',
    title: 'What are the EU AI Act obligations for AI agents (Annex III, Art. 9–17)?',
    type: 'Definitional + examples',
    query: 'eu ai act obligations ai agents',
    body: 'If your agent falls under an Annex III high-risk use (e.g. recruitment, credit, or safety-related), the Act requires risk management (Art. 9), data governance (Art. 10), technical documentation (Art. 11), human oversight (Art. 14), and accuracy/robustness (Art. 15). Many obligations land on the deployer, not the model. A guardrail layer is decision-support that helps you evidence those controls — it is not a compliance certificate.',
    refs: [AIACT, EURLEX, EC],
  },
  {
    slug: 'tool-call-risk-rating',
    title: 'What is Tool-call risk rating: a practical framework?',
    type: 'How-to · HowTo',
    query: 'tool call risk rating ai agent',
    body: 'Rate every tool an agent can invoke as low / medium / high: a read-only lookup is low, an outbound HTTP request is medium, and delete_record or run_sql is high. Then attach a control to each tier — rate-limit and allowlist for medium, human approval for high. The rating is a heuristic view of exposure, not a guarantee that nothing will go wrong.',
    refs: [AIACT, EC],
  },
  {
    slug: 'input-output-filter-best-practices',
    title: 'What are input/output filter best practices for agents?',
    type: 'Definitional + examples',
    query: 'input output filter best practices ai agent',
    body: 'Strip PII from responses, cap payload size, block outbound calls to non-allowlist domains, and require approval before any irreversible tool fires. Filters are the cheapest guardrail to add and the one most teams skip — until an agent emails a customer list to the wrong address. Treat filters as defense-in-depth, not a silver bullet.',
    refs: [AIACT, EURLEX],
  },
  {
    slug: 'prevent-agent-data-exfiltration',
    title: 'How do you prevent agent data exfiltration?',
    type: 'How-to · HowTo',
    query: 'prevent agent data exfiltration',
    body: 'Exfiltration usually happens through a tool the agent is allowed to call — send_email, an HTTP POST, or a database export. The fix is a tool-risk allowlist plus output filters that redact secrets and PII before anything leaves the boundary. Log every high-risk call so you can prove what did (and did not) go out.',
    refs: [AIACT, EC],
  },
]

const faqs = [
  {
    "question": "What are agent guardrails?",
    "answer": "Agent guardrails are input and output controls — tool-call risk ratings, prompt/response filters, and an allowlist/blocklist — that stop an autonomous agent from taking an unguarded action like exfiltrating data or running a destructive command. They are decision-support, not a guarantee that the agent is safe."
  },
  {
    "question": "Does the EU AI Act apply to my AI agent?",
    "answer": "It depends on the use case. Agents used in an Annex III high-risk area (recruitment, credit scoring, safety systems, etc.) trigger obligations like risk management (Art. 9), data governance (Art. 10), and human oversight (Art. 14). Most duties fall on the deployer. Note: the Digital Omnibus has delayed several high-risk obligations — verify the current effective date (Annex III extensions currently track toward 2 December 2027) before relying on a timeline."
  },
  {
    "question": "What is a tool-call risk rating?",
    "answer": "A heuristic that labels each tool an agent can call as low, medium, or high risk — a read-only lookup is low, an outbound HTTP request is medium, delete_record or run_sql is high. Each tier gets a matching control: allowlist for medium, human approval for high. It is a view of exposure, not a promise of zero incidents."
  },
  {
    "question": "Can guardrails guarantee my agent is compliant?",
    "answer": "No. A guardrail layer helps you evidence controls and reduce obvious failure modes, but it is not a legal opinion, a certification, or a guarantee of compliance. EU AI Act conformity is the deployer's responsibility and depends on the full system, not one tool."
  },
  {
    "question": "What is the difference between guardrails and red-teaming?",
    "answer": "Guardrails are preventive controls that run on every request; red-teaming is an adversarial test that probes for what slips through. They are complementary — guardrails reduce the blast radius, red-teaming tells you where the guardrails are weak. AgentAegis focuses on the preventive layer."
  },
  {
    "question": "Does AgentAegis replace professional judgment?",
    "answer": "No. AgentAegis drafts structured output for review. You remain responsible for final decisions."
  }
] as { question: string; answer: string }[]

const howToBlocks = [
  {
    "name": "Tool-call risk rating: a practical framework",
    "steps": [
      {
        "name": "Overview",
        "text": "Rate every tool an agent can invoke as low / medium / high: a read-only lookup is low, an outbound HTTP request is medium, and delete_record or run_sql is high. Then attach a control to each tier — rate-limit and allowlist for medium, human approval for high. The rating is a heuristic view of exposure, not a guarantee that nothing will go wrong."
      }
    ]
  },
  {
    "name": "Input/output filter best practices for agents",
    "steps": [
      {
        "name": "Overview",
        "text": "Strip PII from responses, cap payload size, block outbound calls to non-allowlist domains, and require approval before any irreversible tool fires. Filters are the cheapest guardrail to add and the one most teams skip — until an agent emails a customer list to the wrong address. Treat filters as defense-in-depth, not a silver bullet."
      }
    ]
  },
  {
    "name": "Preventing agent data exfiltration",
    "steps": [
      {
        "name": "Overview",
        "text": "Exfiltration usually happens through a tool the agent is allowed to call — send_email, an HTTP POST, or a database export. The fix is a tool-risk allowlist plus output filters that redact secrets and PII before anything leaves the boundary. Log every high-risk call so you can prove what did (and did not) go out."
      }
    ]
  }
] as { name: string; steps: { name: string; text: string }[] }[]

const NAME = PRODUCT.name

export default function BlogPage() {
  return (
    <Layout>
      <Head>
        <link rel="canonical" href="https://agentguard.lxsaihub.com/blog" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(faqs)) }}
        />
        {howToBlocks.map((block, i) => (
          <script
            key={`howto-${i}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(buildHowToJsonLd(block.name, block.steps)),
            }}
          />
        ))}

        
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900">What does this product include at a glance?</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc pl-5">
            <li>Plain-language definition, FAQ, and references for answer engines</li>
            <li>3 reviewable workflow steps (input → generate → review)</li>
            <li>Decision-support output — you stay in the loop; no fabricated user counts</li>
          </ul>
        </section>

          {posts.map((p, i) => (
          <script
            key={`article-${i}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: p.title,
                description: p.body,
                inLanguage: "en",
              }),
            }}
          />
        ))}

        <title>{`${PRODUCT.name} — Blog`}</title>
        <meta name="description" content="Definitional and how-to posts on AI agent guardrails, EU AI Act obligations, tool-call risk rating, and data-exfiltration prevention — the questions teams ask before they let an agent call tools." />
      </Head>
      <div className="max-w-3xl">
        <div className="text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3">Blog · GEO</div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Agent guardrails, explained</h1>
        <p className="text-lg text-slate-600 mb-10">Own the definitional queries teams ask before they let an agent call tools.</p>

        <div className="space-y-8">
          {posts.map((p) => (
            <article key={p.slug} className="border-b border-slate-200 pb-8">
              <div className="text-xs font-semibold text-indigo-600 mb-1">{p.type}</div>
              <h2 className="text-2xl font-bold mb-2 text-slate-900">{p.title}</h2>
              <p className="text-sm text-slate-600 mb-2"><span className="font-semibold">Target query:</span> {p.query}</p>
              <p className="text-slate-700 leading-relaxed">{p.body}</p>
              <p className="text-xs text-slate-400 mt-3">refs: {p.refs.join(' · ')}</p>
            </article>
          ))}
        </div>

        <h2 className="text-2xl font-bold mt-14 mb-2 text-slate-900">Which GEO deep-dives should you read first?</h2>
        <p className="text-sm text-slate-500 mb-6">Long-form, cited explainers. Each carries 3+ authoritative EU AI Act / AI-governance sources and a decision-support disclaimer.</p>
        <div className="space-y-5">
          {geoPosts.map((p) => (
            <div key={p.slug} className="border-b border-slate-200 pb-5">
              <h3 className="text-xl font-semibold">
                <a href={`/blog/${p.slug}`} className="text-indigo-700 hover:underline">{p.title}</a>
              </h3>
              <p className="text-sm text-slate-600 mt-1">{p.description}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-400 mt-8">Publish + syndicate per gtm-launch (IH + GEO indexes). Each post carries 3 authoritative refs.</p>
      </div>
    </Layout>
  )
}
