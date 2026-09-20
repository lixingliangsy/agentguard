import fs from 'fs'
import path from 'path'

export type AuditEntry = {
  ts: string
  runId: string
  step: string
  model?: string
  quota?: Record<string, unknown>
  event: string
  detail?: string
}

function auditPath(slug: string) {
  const dir = path.join(process.cwd(), '.data', 'audit')
  try { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }) } catch (e) { /* read-only FS (serverless): best effort */ }
  return path.join(dir, `${slug}.jsonl`)
}

export function appendAudit(slug: string, entry: AuditEntry) {
  try { fs.appendFileSync(auditPath(slug), JSON.stringify(entry) + '\n', 'utf8') } catch (e) { /* read-only FS (serverless): best effort */ }
}
