import html
import json
from pathlib import Path
from typing import Dict, Iterable, List

from .models import Claim, ToolCall


class ReportWriter:
    def __init__(self, out_dir: Path):
        self.out_dir = out_dir
        self.out_dir.mkdir(parents=True, exist_ok=True)

    def write_all(
        self,
        claims: Iterable[Claim],
        tool_calls: Iterable[ToolCall],
        events: List[Dict[str, object]],
        evidence_manifest: Dict[str, str],
        accuracy: Dict[str, object],
        analyst_id: str,
        evidence_root: str,
    ) -> Dict[str, str]:
        claim_list = list(claims)
        tool_list = list(tool_calls)
        self._write_json("claim_receipts.json", [claim.to_dict() for claim in claim_list])
        self._write_json("tool_calls.json", [tool.to_dict() for tool in tool_list])
        self._write_json("evidence_manifest.json", evidence_manifest)
        self._write_json("accuracy_report.json", accuracy)
        self._write_markdown(claim_list, accuracy, analyst_id, evidence_root)
        self._write_html(claim_list, tool_list, accuracy, analyst_id)
        return {
            "claim_receipts": str(self.out_dir / "claim_receipts.json"),
            "execution_log": str(self.out_dir / "execution_log.jsonl"),
            "accuracy_json": str(self.out_dir / "accuracy_report.json"),
            "accuracy_markdown": str(self.out_dir / "accuracy_report.md"),
            "incident_html": str(self.out_dir / "incident_report.html"),
        }

    def write_execution_log(self, events: List[Dict[str, object]]) -> None:
        with (self.out_dir / "execution_log.jsonl").open("w", encoding="utf-8") as handle:
            for event in events:
                handle.write(json.dumps(event, sort_keys=True) + "\n")

    def _write_json(self, name: str, data: object) -> None:
        with (self.out_dir / name).open("w", encoding="utf-8") as handle:
            json.dump(data, handle, indent=2, sort_keys=True)
            handle.write("\n")

    def _write_markdown(self, claims: List[Claim], accuracy: Dict[str, object], analyst_id: str, evidence_root: str) -> None:
        lines = [
            "# TraceWarden SIFT Accuracy Report",
            "",
            f"- Analyst/session: `{analyst_id}`",
            f"- Evidence root: `{evidence_root}`",
            f"- Total claims: {accuracy['total_claims']}",
            f"- Confirmed: {accuracy['confirmed']}",
            f"- Revoked: {accuracy['revoked']}",
            f"- Precision: {accuracy['precision']}",
            f"- Recall: {accuracy['recall']}",
            f"- F1: {accuracy['f1']}",
            f"- Hallucinated claim IDs: {accuracy['hallucinated_claim_ids']}",
            "",
            "## Claim Receipts",
            "",
            "| Claim | Status | Evidence refs | Verifier note |",
            "|---|---|---:|---|",
        ]
        for claim in claims:
            note = "; ".join(claim.verifier_notes)
            lines.append(f"| `{claim.id}` | {claim.status} | {len(claim.evidence)} | {note} |")
        lines.append("")
        lines.append("Known limitation: this packaged case proves depth on log/timeline evidence, not broad 200+ SIFT tool coverage.")
        (self.out_dir / "accuracy_report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")

    def _write_html(self, claims: List[Claim], tool_calls: List[ToolCall], accuracy: Dict[str, object], analyst_id: str) -> None:
        claim_rows = []
        for claim in claims:
            refs = "<br>".join(
                f"{html.escape(ref.file)}:{ref.line} <code>{html.escape(ref.sha256[:12])}</code> {html.escape(ref.parser)}"
                for ref in claim.evidence
            )
            notes = "<br>".join(html.escape(note) for note in claim.verifier_notes)
            claim_rows.append(
                f"<tr id='claim-{html.escape(claim.id.lower())}'><td><code>{html.escape(claim.id)}</code></td><td><span class='status {html.escape(claim.status)}'>{html.escape(claim.status)}</span></td><td>{html.escape(claim.title)}</td><td>{refs}</td><td>{notes}</td></tr>"
            )
        tool_rows = "".join(
            f"<tr><td><code>{html.escape(tool.id)}</code></td><td>{html.escape(tool.name)}</td><td>{html.escape(tool.status)}</td><td>{html.escape(tool.detail)}</td><td>{tool.evidence_count}</td></tr>"
            for tool in tool_calls
        )
        doc = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>TraceWarden SIFT Incident Report</title>
  <style>
    :root {{ color-scheme: dark; --bg:#0a0d11; --panel:#14191f; --line:#475569; --text:#e2e8f0; --muted:#94a3b8; --green:#32d583; --red:#ff5c5c; --amber:#f4c430; --cyan:#5ce1e6; }}
    body {{ margin:0; background:var(--bg); color:var(--text); font:14px/1.45 Menlo, Consolas, monospace; }}
    main {{ max-width:1180px; margin:0 auto; padding:32px 20px 56px; }}
    header {{ border:1px solid var(--line); border-radius:8px; background:var(--panel); padding:22px; }}
    h1 {{ margin:0 0 8px; font-size:30px; }}
    h2 {{ margin-top:34px; color:var(--cyan); }}
    .hero {{ color:var(--cyan); font-size:18px; }}
    .metrics {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(130px,1fr)); gap:10px; margin:20px 0; }}
    .metric {{ border:1px solid var(--line); border-radius:8px; padding:12px; background:#101419; }}
    .metric b {{ display:block; color:var(--cyan); font-size:22px; }}
    table {{ width:100%; border-collapse:collapse; border:1px solid var(--line); background:var(--panel); }}
    th,td {{ border-bottom:1px solid #263241; padding:10px; vertical-align:top; text-align:left; }}
    th {{ color:var(--cyan); }}
    code {{ color:var(--cyan); }}
    .status {{ display:inline-block; min-width:88px; text-align:center; padding:3px 7px; border:1px solid currentColor; border-radius:999px; }}
    .confirmed {{ color:var(--green); }}
    .revoked {{ color:var(--red); }}
    .challenged,.proposed {{ color:var(--amber); }}
    @media (max-width: 760px) {{ body {{ font-size:12px; }} table {{ display:block; overflow-x:auto; }} h1 {{ font-size:22px; }} }}
  </style>
</head>
<body>
<main data-visual-lane="operational-dashboard terminal" data-hero-composition="terminal evidence bench">
  <header>
    <h1>TraceWarden SIFT Incident Report</h1>
    <div class="hero">Prove 17 DFIR claims in 90 seconds.</div>
    <p>Session: <code>{html.escape(analyst_id)}</code>. Every confirmed finding below has a replayable receipt.</p>
  </header>
  <section class="metrics">
    <div class="metric"><b>{accuracy['total_claims']}</b>claims</div>
    <div class="metric"><b>{accuracy['confirmed']}</b>confirmed</div>
    <div class="metric"><b>{accuracy['revoked']}</b>revoked</div>
    <div class="metric"><b>{accuracy['f1']}</b>F1</div>
    <div class="metric"><b>{len(accuracy['hallucinated_claim_ids'])}</b>hallucinations</div>
  </section>
  <h2>Claim Receipts</h2>
  <table><thead><tr><th>Claim</th><th>Status</th><th>Finding</th><th>Evidence</th><th>Verifier</th></tr></thead><tbody>{''.join(claim_rows)}</tbody></table>
  <h2>Tool Calls</h2>
  <table><thead><tr><th>ID</th><th>Tool</th><th>Status</th><th>Detail</th><th>Refs</th></tr></thead><tbody>{tool_rows}</tbody></table>
</main>
</body>
</html>
"""
        (self.out_dir / "incident_report.html").write_text(doc, encoding="utf-8")
