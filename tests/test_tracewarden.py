import json
import shutil
import tempfile
import unittest
from pathlib import Path

from tracewarden.agent import TraceWardenAgent
from tracewarden.mcp_schema import SCHEMA
from tracewarden.tools import EvidenceAccessError, EvidenceToolset


ROOT = Path(__file__).resolve().parents[1]
CASE = ROOT / "examples" / "evidence" / "case-alpha"


class TraceWardenTests(unittest.TestCase):
    def test_guardrail_blocks_path_escape(self):
        tools = EvidenceToolset(CASE)
        with self.assertRaises(EvidenceAccessError):
            tools.read_lines("../ground_truth.json", "escape")

    def test_agent_self_corrects_and_writes_reports(self):
        out = Path(tempfile.mkdtemp(prefix="tracewarden-test-"))
        try:
            result = TraceWardenAgent(CASE, out).run()
            receipts = json.loads((out / "claim_receipts.json").read_text())
            by_id = {claim["id"]: claim for claim in receipts}
            self.assertEqual(by_id["CLAIM-004"]["status"], "revoked")
            self.assertEqual(result["accuracy"]["total_claims"], 17)
            self.assertEqual(result["accuracy"]["hallucinated_claim_ids"], [])
            self.assertTrue((out / "execution_log.jsonl").exists())
            self.assertTrue((out / "incident_report.html").exists())
        finally:
            shutil.rmtree(out)

    def test_accuracy_report_scores_ground_truth(self):
        out = Path(tempfile.mkdtemp(prefix="tracewarden-test-"))
        try:
            TraceWardenAgent(CASE, out).run()
            metrics = json.loads((out / "accuracy_report.json").read_text())
            self.assertEqual(metrics["precision"], 1.0)
            self.assertEqual(metrics["recall"], 1.0)
            self.assertEqual(metrics["false_negative_ids"], [])
        finally:
            shutil.rmtree(out)

    def test_mcp_schema_exposes_only_readonly_tools(self):
        tool_names = {tool["name"] for tool in SCHEMA["tools"]}
        self.assertIn("read_timeline", tool_names)
        self.assertIn("read_auth", tool_names)
        self.assertNotIn("execute_shell_cmd", tool_names)
        for tool in SCHEMA["tools"]:
            self.assertIn("Read-only", tool["guardrail"])


if __name__ == "__main__":
    unittest.main()
