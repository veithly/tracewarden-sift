# Winner Research

## Search Log

| Query / URL | Why inspected | Result | Used? |
|---|---|---|---|
| https://findevil.devpost.com/ | Current challenge brief. | Captured mission, deadline, architecture options, and demo expectations. | Yes |
| https://findevil.devpost.com/rules | Official legal/submission requirements. | Captured required artifacts and judging criteria. | Yes |
| https://findevil.devpost.com/resources | Protocol SIFT resource list. | Captured SIFT, Protocol SIFT, NotebookLM, Valhuntir, SANS blog, GTG-1002 references. | Yes |
| https://github.com/teamdfir/protocol-sift | Sponsor primitive. | Confirms Protocol SIFT is MCP-based SIFT agent integration. | Yes |
| `site:devpost.com/software "FIND EVIL" "Protocol SIFT"` | Current competitor scan. | Indexed submissions emphasize evidence loops, graphs, and MCP wrappers. | Yes |
| HackathonHunter 2026 corpus | Recent winner-shape baseline. | Extracted evaluator, compiler, ops-router, and proof-artifact patterns. | Yes |

## Current Hackathon Brief

- Rules/prizes: FIND EVIL! runs April 15 to June 15, 2026, with $22,000+ in prizes and English submission materials required.
- Tracks: no separate data-type track; quality of autonomous execution defines competitiveness.
- Judging criteria: autonomous execution quality, IR accuracy, security/reliability/guardrails, traceability.
- Demo/submission requirements: repository, live URL or local run instructions, under-5-minute terminal screencast with narration, architecture diagram, evidence dataset docs, accuracy report, structured execution logs.
- Sponsor primitives: SANS SIFT Workstation, Protocol SIFT, MCP, Claude Code/OpenClaw-style agentic execution, Linux terminal.

## Comparable Events

| Event | Platform | Why comparable | Winners/gallery URL | Portable lesson |
|---|---|---|---|---|
| Google Cloud Multi-Agent Hackathon | Devpost | Multi-agent orchestration judged in sponsor context. | https://googlecloudmultiagents.devpost.com/updates/35783-and-the-winners-are | Show handoffs and termination, not just agent names. |
| GitLab AI Hackathon 2026 | Official blog | DevSecOps agent workflows. | https://about.gitlab.com/blog/gitlab-ai-hackathon-2026-meet-the-winners/ | Embed AI inside security workflow and leave reviewable artifacts. |
| GenAI Genesis 2026 | Devpost | Recent broad AI winner patterns. | https://genai-genesis-2026.devpost.com/project-gallery | Evaluators, sandboxes, and infrastructure primitives feel fresher than assistants. |
| NASA Space Apps 2025 | Official NASA | Domain-data credibility and judge comprehension. | https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-announces-2025-international-space-apps-challenge-global-winners/ | Traceable data and story beat generic tech claims. |

## Winner Autopsies

### Winner Autopsy 1: Recent Multi-Agent Winners
- event_date: 2025-2026
- recency_class: primary
- why_still_relevant: Find Evil judges explicitly care about agent sequencing, failures, and logs.
- portable_pattern: make each agent/tool handoff visible, bounded, and auditable.
- what_not_to_copy: naming agents without showing deterministic state transitions.

### Winner Autopsy 2: Recent AI Evaluator / QA Sandbox Winners
- event_date: 2026
- recency_class: primary
- why_still_relevant: Find Evil needs accuracy validation and hallucination detection.
- portable_pattern: AI wins when it evaluates, blocks, or certifies another AI/system output.
- what_not_to_copy: score-only detectors without a forced correction or proof receipt.

### Winner Autopsy 3: DevSecOps Agent Winners
- event_date: 2026
- recency_class: primary
- why_still_relevant: DFIR is an operational security workflow, not a generic chat use case.
- portable_pattern: integrate into terminal/repo/workflow, produce reviewable artifacts, and document security boundaries.
- what_not_to_copy: a web dashboard that cannot be run by a practitioner on the target platform.

## Novelty Brief

- New constraints or technologies since older examples: MCP tool servers, Claude Code/OpenClaw agent loops, Protocol SIFT, and accelerated AI adversary operations make agent guardrails and traceability first-class.
- User behavior shifts: responders will not trust black-box autonomous DFIR; they need receipts they can replay under pressure.
- Sponsor/platform primitives newly possible: SIFT tools can be wrapped as typed read-only functions through MCP, preventing destructive commands by architecture.
- Tired winner shapes to avoid: AI dashboard, hypothesis ledger, graph visualizer, raw-shell copilot, upload-summary evidence report.
- Fresh demo surfaces available now: terminal claim verifier, evidence receipt ledger, accuracy harness, self-correction trace, MCP stdio tool boundary.

## Portable Patterns

- Evaluation gate: findings cannot ship until an independent verifier replays evidence references.
- Typed tool wall: the agent receives safe artifact functions, not arbitrary shell.
- Flight recorder: every plan, tool call, failure, correction, and claim status becomes JSONL trace.
- Case object compiler: messy evidence becomes claim receipts, report, and benchmark score.
- Self-correction as visible state transition: show a bad lead being revoked and replaced, not a paragraph saying "I corrected myself."

## Clone Traps

- EvidenceLoop-style generic hypothesis ledger without typed replay receipts.
- SIFT.Glass-style real-time graph as primary value.
- Sentinel-MCP-style tool wrapper without a judging-visible accuracy loop.
- Chatbot for incident response.
- Broad SIFT integration that claims many tools but proves shallow traceability.

## Inputs For GPT Pro Idea Tournament

- Winner patterns to feed: evaluator/deploy gate, typed tool boundary, trace flight recorder, workflow compiler, case object.
- Sponsor/domain primitives to feed: SIFT, Protocol SIFT, MCP, Linux terminal, Claude Code/OpenClaw, read-only evidence.
- Project shapes to forbid: dashboard, chat, graph-only, raw shell wrapper, no accuracy benchmark.
- Evidence gaps: no SIFT VM in workspace, so the project must include SIFT-compatible adapters and prove the core on packaged evidence.
