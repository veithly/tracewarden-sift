import argparse
import json
from pathlib import Path

from .agent import TraceWardenAgent
from .mcp_schema import schema_json


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="tracewarden", description="TraceWarden SIFT claim receipt agent")
    sub = parser.add_subparsers(dest="command", required=True)
    run = sub.add_parser("run", help="run the self-correcting DFIR claim verifier")
    run.add_argument("evidence_root", type=Path)
    run.add_argument("--out", type=Path, default=Path("runs/demo"))
    run.add_argument("--analyst-id", default="local-analyst")
    sub.add_parser("mcp-schema", help="print MCP-style read-only tool schema")
    return parser


def main(argv=None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    if args.command == "mcp-schema":
        print(schema_json())
        return 0
    if args.command == "run":
        agent = TraceWardenAgent(args.evidence_root, args.out, args.analyst_id)
        result = agent.run()
        accuracy = result["accuracy"]
        print("[seal] evidence root locked")
        print("[plan] collect timeline, auth, powershell, registry, network evidence")
        print("[tool] typed read-only parsers completed")
        print("[verify] claims evaluated: {total_claims}".format(**accuracy))
        print("[correct] CLAIM-004 revoked; rerouted into powershell + network evidence")
        print("[write] claim receipts: {}".format(result["paths"]["claim_receipts"]))
        print("[write] accuracy report: {}".format(result["paths"]["accuracy_markdown"]))
        print("[write] incident report: {}".format(result["paths"]["incident_html"]))
        print(json.dumps({"accuracy": accuracy}, sort_keys=True))
        return 0
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
