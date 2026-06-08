# TraceWarden SIFT Architecture

TraceWarden SIFT uses architectural guardrails instead of prompt-only restrictions.

1. The evidence root is sealed with SHA-256 hashes before parsing.
2. The agent calls typed read-only artifact tools. It does not receive `execute_shell_cmd`.
3. The planner proposes claims and can reroute when the verifier challenges a lead.
4. The verifier requires evidence references and cross-source support before a claim can survive.
5. The output pipeline writes claim receipts, structured execution logs, accuracy reports, and an HTML incident report.

See `docs/architecture/tracewarden-architecture.svg`.
