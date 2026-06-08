# Prove 17 DFIR claims in 90 seconds.

TraceWarden SIFT is a terminal-native guardrail for Protocol SIFT agents. It makes every autonomous incident-response finding earn a receipt before it reaches the report.

In the demo case, the agent starts with a plausible updater lead, challenges it, revokes it, reroutes into PowerShell and network evidence, then writes claim receipts, an execution log, and an accuracy report.

## Quick Start

```bash
PYTHONPATH=src python3 -m tracewarden run examples/evidence/case-alpha --out runs/demo
```

Open the proof:

```bash
open runs/demo/incident_report.html
cat runs/demo/accuracy_report.md
sed -n '1,12p' runs/demo/execution_log.jsonl
```

Run tests:

```bash
PYTHONPATH=src python3 -m unittest discover -s tests -v
```

## What It Does

- Seals the evidence root with SHA-256 hashes before analysis.
- Gives the agent typed read-only artifact tools, not raw shell.
- Proposes DFIR claims from timeline, auth, PowerShell, registry, and network evidence.
- Verifies each claim against evidence references.
- Revokes unsupported claims and reroutes without human intervention.
- Writes `claim_receipts.json`, `execution_log.jsonl`, `accuracy_report.md`, and `incident_report.html`.

## Demo Proof

The packaged sample run lives in `artifacts/sample-run`.

Current local result:

| Metric | Value |
|---|---:|
| Claims evaluated | 17 |
| Confirmed claims | 16 |
| Revoked claims | 1 |
| Precision | 1.0 |
| Recall | 1.0 |
| Hallucinated claims | 0 |

`CLAIM-004` is the required self-correction sequence. The agent first treats `updater.exe` as suspicious because it appears in the timeline. The verifier finds a signed vendor path and benign updater network traffic, revokes the claim, then reroutes into PowerShell and network evidence.

## Architecture

TraceWarden uses architectural guardrails:

- `EvidenceToolset` blocks path escape and reads only files under the sealed evidence root.
- `mcp-schema` prints a Protocol SIFT-compatible read-only tool surface.
- `ClaimVerifier` controls claim state transitions.
- `AccuracyScorer` compares confirmed claims with `ground_truth.json`.
- `ReportWriter` writes judge-facing proof files.

See `docs/architecture.md` and `docs/architecture/tracewarden-architecture.svg`.

## Evidence Dataset

The repo includes a public synthetic case at `examples/evidence/case-alpha`. It contains timeline, auth, PowerShell, registry, network, and ground-truth files. See `docs/evidence-dataset.md`.

## Protocol SIFT Fit

FIND EVIL asks for autonomous execution, IR accuracy, security/reliability guardrails, and traceability.

TraceWarden maps those criteria to files judges can inspect:

| Criterion | Proof |
|---|---|
| Autonomous execution | `execution_log.jsonl` shows plan, tool, verify, correct, and write steps. |
| IR accuracy | `accuracy_report.md` and `accuracy_report.json` score against ground truth. |
| Guardrails | `tests/test_tracewarden.py` checks path escape and schema excludes raw shell. |
| Traceability | `claim_receipts.json` maps each finding to file, line, parser, hash, and tool call. |

## SIFT Workstation Notes

The core demo runs anywhere with Python 3.9+ because the packaged evidence is already normalized. On a SIFT Workstation, Protocol SIFT or OpenClaw can call the same typed tool surface and map SIFT parser output into the `EvidenceRef` schema.

Print the MCP-style schema:

```bash
PYTHONPATH=src python3 -m tracewarden mcp-schema
```

## Limitations

- This submission proves depth on one log/timeline case, not broad coverage of all SIFT tools.
- It uses deterministic local agent rules for reproducibility. A future Protocol SIFT integration can place an LLM planner in front of the same verifier.
- It does not modify evidence or perform endpoint response.

## Fresh Work and Tooling

This repository was created for FIND EVIL. Codex and the HackathonHunter workflow helped produce the project plan, code, tests, and submission artifacts. The novel contribution is the claim receipt verifier, self-correction loop, evidence dataset, and report pipeline.

## License

MIT. See `LICENSE`.
