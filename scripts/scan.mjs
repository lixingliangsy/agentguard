// scan.mjs — agentguard Agentic AI 运行时护栏审计（真实实现，T1 审计模板契约驱动）
// 领域：Agentic AI Safety / OWASP LLM Top 10（2025）。审计 Agent 运行时是否配置了必要的护栏。
// 幂等：同输入同输出、无副作用、可重入。返回 { items:[{id,...}], metrics:{...} }
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DATA = path.join(ROOT, '.data')
const AUDIT = path.join(DATA, 'audit')

async function fetchText(url) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 12000)
  try {
    const r = await fetch(url, { signal: ctrl.signal, redirect: 'follow', headers: { 'user-agent': 't1-audit-bot/1.0 (+https://lxsai.com)' } })
    if (!r.ok) throw new Error('HTTP ' + r.status)
    return await r.text()
  } finally { clearTimeout(t) }
}

async function loadTargets(targets) {
  const docs = []
  for (const t of targets) {
    try {
      if (/^https?:\/\//i.test(t)) { docs.push(await fetchText(t)); continue }
        const p = path.isAbsolute(t) ? t : path.join(AUDIT, t)
      docs.push(fs.readFileSync(p, 'utf8'))
    } catch (e) { console.warn('[scan] target load failed:', t, e.message) }
  }
  return docs
}

export async function scan(ctx) {
  const cfg = JSON.parse(fs.readFileSync(path.join(DATA, 'config.json'), 'utf8'))
  const targets = (cfg.scan && cfg.scan.targets) || [path.join(AUDIT, 'agentguard-sample.json')]
  const docs = await loadTargets(targets)
  let cfgObj = {}
  try { cfgObj = JSON.parse(docs.join('\n')) } catch (e) { console.warn('[scan] parse failed', e.message) }

  const items = []
  // [fixture字段, item id, category, severity, title, detail]
  const checks = [
    ['tool_call_allowlist', 'agentguard:tool-allowlist-missing', 'security', 'high', 'No tool-call allowlist', '缺少工具调用白名单，Agent 可能执行任意危险工具（如删除/外发/支付）'],
    ['human_in_the_loop', 'agentguard:hitl-missing', 'safety', 'high', 'No human-in-the-loop', '对高风险动作缺少人工确认环节，无法拦截越权操作'],
    ['pii_redaction', 'agentguard:pii-redaction-missing', 'privacy', 'medium', 'No PII redaction', '输入/输出未做 PII 脱敏，易泄露个人数据（GDPR/CCPA 风险）'],
    ['secrets_detection', 'agentguard:secrets-missing', 'security', 'medium', 'No secrets detection', '未检测密钥/凭证外泄，存在凭据泄露风险'],
    ['prompt_injection_defense', 'agentguard:prompt-injection-missing', 'security', 'medium', 'No prompt-injection defense', '未配置对抗提示注入（LLM01 OWASP）防护，Agent 易被越权操纵'],
    ['rate_limiting', 'agentguard:rate-limit-missing', 'reliability', 'medium', 'No rate limiting', '缺少速率限制/滥用节流，易被刷量或资源耗尽'],
    ['audit_logging', 'agentguard:audit-log-missing', 'governance', 'medium', 'No audit logging', '未记录 Agent 动作审计日志，事件不可追溯'],
    ['input_validation', 'agentguard:input-validation-missing', 'security', 'low', 'No input validation', '缺少输入校验，脏输入可能触发异常或注入'],
    ['output_filtering', 'agentguard:output-filter-missing', 'safety', 'low', 'No output filtering', '缺少输出过滤/内容策略执行'],
    ['content_policy_enforcement', 'agentguard:content-policy-missing', 'safety', 'low', 'No content policy', '未执行内容安全策略']
  ]
  const present = {}
  for (const [key, id, category, severity, title, detail] of checks) {
    const ok = cfgObj[key] === true
    present[key] = ok
    if (!ok) items.push({ id, category, severity, title, detail, present: false })
  }

  const weights = { high: 18, medium: 10, low: 5 }
  const bySeverity = { high: 0, medium: 0, low: 0 }
  let penalty = 0
  for (const it of items) { penalty += weights[it.severity] || 0; bySeverity[it.severity]++ }
  const score = Math.max(0, 100 - penalty)

  const metrics = {
    guardrail_score: score,
    total_checks: checks.length,
    passed: checks.length - items.length,
    by_severity: bySeverity,
    ...present
  }
  return { items, metrics }
}
