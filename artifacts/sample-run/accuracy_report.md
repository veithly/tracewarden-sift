# TraceWarden SIFT Accuracy Report

- Analyst/session: `local-analyst`
- Evidence root: `examples/evidence/case-alpha`
- Total claims: 17
- Confirmed: 16
- Revoked: 1
- Precision: 1.0
- Recall: 1.0
- F1: 1.0
- Hallucinated claim IDs: []

## Claim Receipts

| Claim | Status | Evidence refs | Verifier note |
|---|---|---:|---|
| `CLAIM-004` | revoked | 1 | Revoked: updater.exe has a signed vendor path and no suspicious network/process corroboration. |
| `CLAIM-010` | confirmed | 2 | Confirmed: evidence is cross-supported by independent artifact parsers. |
| `CLAIM-009` | confirmed | 2 | Confirmed: evidence is cross-supported by independent artifact parsers. |
| `CLAIM-011` | confirmed | 2 | Confirmed: evidence is cross-supported by independent artifact parsers. |
| `CLAIM-012` | confirmed | 2 | Confirmed: evidence is cross-supported by independent artifact parsers. |
| `CLAIM-013` | confirmed | 2 | Confirmed: evidence is cross-supported by independent artifact parsers. |
| `CLAIM-014` | confirmed | 2 | Confirmed: high-severity evidence passed the deterministic verifier policy. |
| `CLAIM-015` | confirmed | 2 | Confirmed: evidence is cross-supported by independent artifact parsers. |
| `CLAIM-016` | confirmed | 2 | Confirmed: evidence is cross-supported by independent artifact parsers. |
| `CLAIM-017` | confirmed | 4 | Confirmed: evidence is cross-supported by independent artifact parsers. |
| `CLAIM-018` | confirmed | 2 | Confirmed: evidence is cross-supported by independent artifact parsers. |
| `CLAIM-019` | confirmed | 2 | Confirmed: evidence is cross-supported by independent artifact parsers. |
| `CLAIM-020` | confirmed | 2 | Confirmed: evidence is cross-supported by independent artifact parsers. |
| `CLAIM-021` | confirmed | 2 | Confirmed: high-severity evidence passed the deterministic verifier policy. |
| `CLAIM-022` | confirmed | 2 | Confirmed: evidence is cross-supported by independent artifact parsers. |
| `CLAIM-023` | confirmed | 2 | Confirmed: high-severity evidence passed the deterministic verifier policy. |
| `CLAIM-024` | confirmed | 2 | Confirmed: high-severity evidence passed the deterministic verifier policy. |

Known limitation: this packaged case proves depth on log/timeline evidence, not broad 200+ SIFT tool coverage.
