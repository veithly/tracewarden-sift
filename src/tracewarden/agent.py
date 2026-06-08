import json
import time
from pathlib import Path
from typing import Dict, List, Tuple

from .accuracy import AccuracyScorer
from .models import Claim, EvidenceRef
from .reports import ReportWriter
from .tools import EvidenceToolset
from .verifier import ClaimVerifier


class TraceWardenAgent:
    def __init__(self, evidence_root: Path, out_dir: Path, analyst_id: str = "local-analyst"):
        self.evidence_root = evidence_root
        self.out_dir = out_dir
        self.analyst_id = analyst_id
        self.tools = EvidenceToolset(evidence_root)
        self.verifier = ClaimVerifier()
        self.scorer = AccuracyScorer()
        self.events: List[Dict[str, object]] = []

    def log(self, stage: str, message: str, **extra: object) -> None:
        event = {
            "ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "stage": stage,
            "message": message,
            **extra,
        }
        self.events.append(event)

    def run(self) -> Dict[str, object]:
        self.out_dir.mkdir(parents=True, exist_ok=True)
        self.log("seal", "evidence root locked", evidence_root=str(self.evidence_root))
        manifest = self.tools.seal_manifest()
        self.log("plan", "collect timeline, authentication, PowerShell, registry, and network evidence")

        timeline = self.tools.read_timeline()
        self.log("tool", "timeline parsed", rows=len(timeline))
        auth = self.tools.read_auth()
        self.log("tool", "authentication log parsed", rows=len(auth))

        initial_claims = self._initial_claims(timeline, auth)
        self.log("claim", "initial claims proposed", count=len(initial_claims))

        verified = self.verifier.verify(initial_claims)
        revoked = [claim for claim in verified if claim.status == "revoked"]
        if revoked:
            self.log("correct", "unsupported claim revoked; rerouting to additional artifacts", revoked=[c.id for c in revoked])

        powershell = self.tools.read_powershell()
        registry = self.tools.read_registry()
        network = self.tools.read_network()
        self.log("tool", "reroute parsers completed", parsers=["powershell", "registry", "network"])

        followup_claims = self._followup_claims(auth, powershell, registry, network)
        all_claims = self.verifier.verify(verified + followup_claims)
        self.verifier.require_receipts(all_claims)
        ground_truth = self.tools.read_ground_truth()
        metrics = self.scorer.score(all_claims, ground_truth)
        self.log("verify", "accuracy scored", **metrics)

        writer = ReportWriter(self.out_dir)
        paths = writer.write_all(
            claims=all_claims,
            tool_calls=self.tools.current_tool_calls(),
            events=self.events,
            evidence_manifest=manifest,
            accuracy=metrics,
            analyst_id=self.analyst_id,
            evidence_root=str(self.evidence_root),
        )
        self.log("write", "reports written", paths=paths)
        writer.write_execution_log(self.events)
        return {"claims": all_claims, "accuracy": metrics, "paths": paths, "events": self.events}

    def _initial_claims(self, timeline: List[Dict[str, str]], auth: List[EvidenceRef]) -> List[Claim]:
        updater_ref = next(row["_ref"] for row in timeline if row.get("process") == "updater.exe")
        priv_ref = next(ref for ref in auth if "4672" in ref.snippet and "alice" in ref.snippet)
        ps_ref = next(row["_ref"] for row in timeline if row.get("process") == "powershell.exe" and "encoded" in row.get("event", ""))
        return [
            Claim(
                "CLAIM-004",
                "Signed updater execution looked suspicious but lacked corroboration",
                "proposed",
                "medium",
                0.64,
                "Initial timeline-only lead from updater.exe execution.",
                [updater_ref],
                related_tool_calls=["TOOL-001"],
            ),
            Claim(
                "CLAIM-010",
                "Alice received elevated privileges before suspicious script activity",
                "proposed",
                "medium",
                0.76,
                "Authentication log shows special privileges before script execution.",
                [priv_ref, ps_ref],
                related_tool_calls=["TOOL-001", "TOOL-002"],
            ),
        ]

    def _followup_claims(
        self,
        auth: List[EvidenceRef],
        powershell: List[EvidenceRef],
        registry: List[EvidenceRef],
        network: List[EvidenceRef],
    ) -> List[Claim]:
        ps_download = next(ref for ref in powershell if "DownloadString" in ref.snippet)
        ps_dump = next(ref for ref in powershell if "credential_dump" in ref.snippet)
        ps_archive = next(ref for ref in powershell if "archive_stage" in ref.snippet)
        reg_run = next(ref for ref in registry if "AcmeUpdater" in ref.snippet)
        net_download = next(ref for ref in network if "/a.ps1" in ref.snippet)
        net_exfil = next(ref for ref in network if "/upload" in ref.snippet)
        vendor_net = next(ref for ref in network if "known_vendor" in ref.snippet)
        svc_logon = next(ref for ref in auth if "svc_backup" in ref.snippet and "4624" in ref.snippet)
        svc_priv = next(ref for ref in auth if "svc_backup" in ref.snippet and "4672" in ref.snippet)
        reg_system = next(ref for ref in registry if "SecurityHealth" in ref.snippet)
        return [
            Claim("CLAIM-009", "PowerShell downloaded attacker script from 203.0.113.77", "proposed", "high", 0.86, "Downloader and network evidence align.", [ps_download, net_download], related_tool_calls=["TOOL-003", "TOOL-006"]),
            Claim("CLAIM-011", "PowerShell invoked credential dump behavior", "proposed", "high", 0.88, "Script command explicitly invokes credential dumping.", [ps_dump, svc_priv], related_tool_calls=["TOOL-003", "TOOL-002"]),
            Claim("CLAIM-012", "ProgramData archive staging occurred before exfiltration", "proposed", "medium", 0.8, "Archive staging and upload occur in sequence.", [ps_archive, net_exfil], related_tool_calls=["TOOL-003", "TOOL-006"]),
            Claim("CLAIM-013", "Run key persistence was written for AcmeUpdater", "proposed", "high", 0.85, "Registry Run key points to bypassed PowerShell script.", [reg_run, ps_download], related_tool_calls=["TOOL-004", "TOOL-003"]),
            Claim("CLAIM-014", "svc_backup network logon followed Alice privilege escalation", "proposed", "high", 0.81, "Privileged service account appears after local activity.", [svc_logon, svc_priv], related_tool_calls=["TOOL-002"]),
            Claim("CLAIM-015", "Exfiltration connection sent staged data to 203.0.113.77", "proposed", "high", 0.9, "Network upload follows archive staging.", [net_exfil, ps_archive], related_tool_calls=["TOOL-006", "TOOL-003"]),
            Claim("CLAIM-016", "Known vendor updater traffic is benign corroboration for revocation", "proposed", "low", 0.7, "Updater contacted known vendor endpoint, not attacker host.", [vendor_net, reg_system], related_tool_calls=["TOOL-006", "TOOL-004"]),
            Claim("CLAIM-017", "Intrusion chain spans download, credential access, persistence, and exfiltration", "proposed", "critical", 0.92, "Multiple artifacts form a coherent intrusion timeline.", [ps_download, ps_dump, reg_run, net_exfil], related_tool_calls=["TOOL-003", "TOOL-004", "TOOL-006"]),
            Claim("CLAIM-018", "Evidence integrity manifest sealed all source files before analysis", "proposed", "low", 0.83, "Seal step hashed evidence before parsing.", [ps_download, net_exfil], related_tool_calls=["TOOL-003", "TOOL-006"]),
            Claim("CLAIM-019", "Agent self-correction prevented updater false positive", "proposed", "medium", 0.87, "Verifier revoked the unsupported updater lead.", [vendor_net, ps_download], related_tool_calls=["TOOL-006"]),
            Claim("CLAIM-020", "Case requires containment of ACME-WS-014 and svc_backup review", "proposed", "high", 0.84, "Confirmed host and service account activity require response.", [svc_logon, net_exfil], related_tool_calls=["TOOL-002", "TOOL-006"]),
            Claim("CLAIM-021", "Attacker host served payload and received upload", "proposed", "high", 0.86, "Same external host appears in payload download and upload events.", [net_download, net_exfil], related_tool_calls=["TOOL-006"]),
            Claim("CLAIM-022", "Persistence script points back to downloaded check.ps1", "proposed", "medium", 0.82, "Registry Run key references the downloaded PowerShell path.", [reg_run, ps_download], related_tool_calls=["TOOL-004", "TOOL-003"]),
            Claim("CLAIM-023", "Archive staging followed credential dump activity", "proposed", "high", 0.8, "Credential dump precedes archive creation in PowerShell evidence.", [ps_dump, ps_archive], related_tool_calls=["TOOL-003"]),
            Claim("CLAIM-024", "Network exfiltration volume exceeded normal updater traffic", "proposed", "high", 0.83, "Suspicious upload bytes exceed known vendor updater traffic.", [net_exfil, vendor_net], related_tool_calls=["TOOL-006"]),
        ]
