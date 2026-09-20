import React from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import { PRODUCT } from '../lib/product'

const steps = [
  { n: "1", t: "Paste", d: "Provide the agent system prompt, tool list, and risk appetite." },
  { n: "2", t: "Rate", d: "Score tool-call risk and propose input/output filters." },
  { n: "3", t: "Apply", d: "Adopt blocklists and export the guardrail report." },
]

export default function HowItWorksPage() {
  return (
    <Layout>
      <Head>
        <title>{`${PRODUCT.name} — How it works`}</title>
        <meta name="description" content={`How ${PRODUCT.name} works in three steps.`} />
      </Head>
      <div className="max-w-4xl">
        <div className="text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3">How it works</div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">From input to result in 3 steps</h1>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {steps.map((s) => (
            <div key={s.n} className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white grid place-items-center font-black mb-4">{s.n}</div>
              <h3 className="font-bold text-lg mb-2 text-slate-900">{s.t}</h3>
              <p className="text-slate-600 text-sm">{s.d}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a href="/#signup" className="px-6 py-3 rounded-full bg-indigo-600 text-white font-bold inline-block">Start free trial</a>
        </div>
      </div>
    </Layout>
  )
}
