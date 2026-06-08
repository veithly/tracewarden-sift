# Deep Research 10x10

Local synthesis note: GPT Pro Deep Research was attempted but extraction failed after the connector reported completion. This file is the replacement synthesis required by the failure policy, using live Devpost extraction, current HackathonHunter 2026 reference corpus, and official/product sources listed below.

## Completed Hackathons

| ID | Event | Date | Source URL | Usable winner evidence | Notable projects | Transfer lesson | Clone trap |
|---|---|---|---|---|---|---|---|
| HACK-01 | FIND EVIL! | 2026 | https://findevil.devpost.com/ | Current rules, resources, indexed submissions, and required artifacts are visible. | EvidenceLoop SIFT, SIFT.Glass, Sentinel-MCP style indexed submissions. | Judges want terminal proof, self-correction, traceability, accuracy report, and architectural guardrails. | Do not ship another hypothesis ledger, attack graph, or prompt-only Protocol SIFT wrapper. |
| HACK-02 | Google Cloud Multi-Agent Hackathon | 2025 | https://googlecloudmultiagents.devpost.com/updates/35783-and-the-winners-are | Official winners update and sponsor context. | Multi-agent orchestration entries. | Make handoffs visible and logged; role separation must create a proof artifact. | Multi-agent theater with no deterministic termination or audit trail. |
| HACK-03 | GitLab AI Hackathon 2026 | 2026 | https://about.gitlab.com/blog/gitlab-ai-hackathon-2026-meet-the-winners/ | Official winner blog. | DevSecOps agent workflows. | Developer/security AI wins when it lives inside repo/CI/security flow and leaves a reviewable artifact. | Standalone chat for security questions. |
| HACK-04 | GenAI Genesis 2026 | 2026 | https://genai-genesis-2026.devpost.com/project-gallery | Devpost gallery with winner cards. | QA sandboxes, financial fraud, agentic genomics, CSV-to-production ML. | Fresh AI winners are evaluators, simulators, proxies, or workflow compilers. | Generic assistant or dashboard with AI labels. |
| HACK-05 | TreeHacks 2026 | 2026 | https://treehacks-2026.devpost.com/project-gallery | Devpost gallery with stage-visible projects. | Shadow-network security, wildfire containment copilot, code-to-spreadsheet compiler. | Hard primitives beat generic helpers: compiler, containment plan, security layer. | A pretty UI that hides no hard mechanism. |
| HACK-06 | World's Largest Hackathon by Bolt | 2025 | https://worldslargesthackathon.devpost.com/ | Devpost event plus official winner recap. | Video timeline editing, grocery scanning, API key lifecycle, LLM evaluation. | Large online winners feel launched and complete one sharp automation quickly. | Thin public URL with no end-to-end proof. |
| HACK-07 | MCP and A2A Hackathon, AWS Edition | 2025 | https://mcp-and-a2a-hackathon.devpost.com/ | Event page and project patterns. | Multi-tool agent projects. | Tool chaining must be legible, typed, and necessary to the user outcome. | Raw shell access as "agentic" magic. |
| HACK-08 | Code with Kiro Hackathon | 2025 | https://kiro.devpost.com/ | Devpost event/gallery patterns. | Spec-driven developer-tool projects. | Devtools should leave specs, hooks, diffs, or traceable artifacts. | "AI wrote code" without a durable reviewer object. |
| HACK-09 | NASA Space Apps 2025 | 2025 | https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-announces-2025-international-space-apps-challenge-global-winners/ | Official NASA global winner announcement. | Official-data science/storytelling projects. | Domain credibility comes from traceable official data and clear decisions. | Science/data chatbot without inspectable data lineage. |
| HACK-10 | ETHGlobal Prague / Cannes Showcases | 2025 | https://ethglobal.com/showcase | Official showcase pages. | Attestation, identity, receipt, proof, and automation projects. | Trust primitives win when the proof surface is visible in the first minute. | Explorer/read-only dashboard with no state-changing receipt. |

## Mature Products

| ID | Product | Official URL | Mature product loop | Structural move to borrow | Do not clone | Demo primitive |
|---|---|---|---|---|---|---|
| PROD-01 | SANS SIFT Workstation | https://www.sans.org/tools/sift-workstation | Evidence artifacts are examined through a large terminal toolkit. | Treat terminal/SIFT as the primary product surface. | Web dashboard that ignores SIFT. | Live terminal run with typed parsers and evidence hashes. |
| PROD-02 | Protocol SIFT | https://github.com/teamdfir/protocol-sift | AI agents call SIFT tools through MCP. | Expose read-only typed DFIR tools instead of raw shell. | Prompt-only "do not modify evidence" instructions. | MCP-shaped typed tool server with deny-by-construction guardrails. |
| PROD-03 | TheHive | https://thehive-project.org/ | Incidents become cases, tasks, observables, and analyst decisions. | Turn findings into reviewable case objects. | Case dashboard without autonomous verification. | Claim receipts with owner, status, evidence refs, and review notes. |
| PROD-04 | Velociraptor | https://www.velociraptor.app/ | Hunt artifacts across endpoints with declarative queries and notebooks. | Make evidence collection reproducible and parameterized. | Broad remote hunting without a focused case. | Read-only artifact collectors and replayable command transcript. |
| PROD-05 | Autopsy | https://www.autopsy.com/ | Disk artifacts become timelines, files, and reports. | Deep artifact traceability matters more than breadth. | Shallow support for many artifact types. | File/line/offset pointers for every claim. |
| PROD-06 | Timesketch | https://timesketch.org/ | Timelines support investigation, tagging, stories, and collaboration. | Timeline claims should be challengeable and explainable. | Timeline viewer only. | Contradiction-aware timeline claim verifier. |
| PROD-07 | Splunk SOAR | https://www.splunk.com/en_us/products/splunk-security-orchestration-and-automation.html | Playbooks automate triage and response with audit logs. | Autonomous steps need durable run logs and playbook-like limits. | Black-box automation. | Max-iteration planner with logged failure and reroute. |
| PROD-08 | Microsoft Sentinel | https://azure.microsoft.com/products/microsoft-sentinel | Incidents, workbooks, playbooks, and analytics rules. | Separate alert, evidence, and action surfaces. | SIEM clone. | Compact incident report with claim-state transitions. |
| PROD-09 | CrowdStrike Falcon | https://www.crowdstrike.com/platform/ | Endpoint telemetry supports detection, triage, and response. | Speed story must be concrete: minutes and automated triage. | Marketing "AI defender" copy. | 90-second local case triage with accuracy metrics. |
| PROD-10 | GitHub Copilot Coding Agent | https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent | Agent work is scoped by issue and ends in a reviewable artifact. | Autonomous work should end in a replayable diff/report. | Chat answer with no review object. | Incident report plus JSON receipts plus accuracy score. |
| PROD-11 | OpenTelemetry | https://opentelemetry.io/ | Traces connect operations across services. | Treat agent reasoning and tool calls as trace spans. | Plain logs that cannot reconstruct causality. | JSONL execution log with parent/child step IDs. |

## Synthesis For Find Evil

- Project families to generate: evaluator/deploy gate for forensic claims; typed MCP guardrail server; self-correcting DFIR planner; accuracy benchmark harness; evidence trace flight recorder.
- Mature-product loops to adapt: TheHive case objects, Timesketch timeline review, Splunk SOAR playbook audit, Protocol SIFT MCP tool calling, OpenTelemetry trace spans.
- Host surfaces to prefer: Linux terminal, SIFT filesystem paths, JSONL execution logs, Markdown/HTML incident reports, MCP stdio server.
- Proof artifacts to require: claim receipts, evidence hash manifest, execution log, accuracy report, architecture diagram, dataset/ground-truth documentation.
- Clone traps to forbid: graph-only attack visualizer, generic hypothesis ledger, raw shell wrapper, chat-first assistant, broad artifact support with shallow traceability, prompt-based read-only promises.
- Evidence gaps: no local SIFT VM is available in this workspace; implementation must include adapters and documented SIFT install path while proving the core loop on packaged log/timeline evidence.
