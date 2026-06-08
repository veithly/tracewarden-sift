# TraceWarden SIFT Best-Solution PRD + UIUX Spec

You are helping produce the final build plan for the FIND EVIL! Devpost hackathon.

Selected concept: TraceWarden SIFT.

Hero: Prove 17 DFIR claims in 90 seconds.

Rumor: It revokes bad forensic claims before judges blink.

Core mechanism:
- Linux terminal/SIFT-native autonomous DFIR agent.
- Typed read-only MCP-style evidence tools parse packaged evidence and SIFT-style artifacts.
- Planner proposes forensic claims.
- Independent verifier replays claim evidence references.
- Unsupported or contradictory claims are challenged/revoked.
- Agent reroutes into missing parsers without human intervention.
- Outputs claim receipts, execution log, incident report, accuracy report, architecture proof, and dataset docs.

Find Evil requirements:
- Run on/integrate with SANS SIFT Workstation using Claude Code/OpenClaw or comparable agentic architecture.
- Demonstrate self-correction.
- Validate accuracy and trace every finding to artifacts/files/offsets/log entries.
- Distinguish architectural guardrails from prompt guardrails.
- Provide structured execution logs.
- Demo must be a live terminal screencast under 5 minutes.

Inputs:
- `pitch/concept_lock.md`
- `pitch/hero.md`
- `pitch/user_cases.md`
- `pitch/judge_magnet.md`
- `pitch/idea_tournament.md`
- `pitch/deep_research_10x10.md`

Produce:
1. A detailed PRD with exactly 14 sections:
   1. Project background
   2. Problem definition
   3. Target users
   4. User pain points
   5. Core requirements & priority
   6. Solution overview
   7. User flows
   8. User Cases (>= 2)
   9. Demo critical path & Hero Moment
   10. Pages / modules plan (>= 3 interactive surfaces)
   11. Visual direction & UI principles
   12. Technical constraints
   13. Success metrics
   14. Risks & cut list
2. A detailed UIUX interaction plan for terminal, HTML report, receipt ledger, accuracy report, architecture page, and mobile screenshot/frame.
3. A scope cut list with exactly 2-3 P0 demo must-haves and explicit non-goals.
4. Risk mitigation and live-demo fallback.
5. A traceability matrix from each P0/P1 requirement to module/API/data/state/test/deploy evidence.

Be implementation-specific. Assume Python stdlib for the terminal agent, no external API key, packaged evidence data, optional SIFT adapters, and static HTML report output.
