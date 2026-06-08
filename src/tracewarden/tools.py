import csv
import hashlib
import json
from pathlib import Path
from typing import Dict, Iterable, List

from .models import EvidenceRef, ToolCall


class EvidenceAccessError(RuntimeError):
    pass


class EvidenceToolset:
    def __init__(self, evidence_root: Path):
        self.root = evidence_root.resolve()
        if not self.root.exists():
            raise EvidenceAccessError(f"Evidence root not found: {self.root}")
        self.tool_calls: List[ToolCall] = []
        self._counter = 0

    def _safe_path(self, relative: str) -> Path:
        target = (self.root / relative).resolve()
        if self.root != target and self.root not in target.parents:
            raise EvidenceAccessError(f"Blocked path outside evidence root: {relative}")
        if not target.exists():
            raise EvidenceAccessError(f"Evidence file not found: {relative}")
        return target

    def _hash(self, path: Path) -> str:
        digest = hashlib.sha256()
        with path.open("rb") as handle:
            for chunk in iter(lambda: handle.read(65536), b""):
                digest.update(chunk)
        return digest.hexdigest()

    def _tool_id(self) -> str:
        self._counter += 1
        return f"TOOL-{self._counter:03d}"

    def seal_manifest(self) -> Dict[str, str]:
        manifest = {}
        for path in sorted(self.root.iterdir()):
            if path.is_file():
                manifest[path.name] = self._hash(path)
        return manifest

    def read_lines(self, relative: str, parser: str) -> List[EvidenceRef]:
        path = self._safe_path(relative)
        digest = self._hash(path)
        refs: List[EvidenceRef] = []
        with path.open("r", encoding="utf-8") as handle:
            for idx, line in enumerate(handle, start=1):
                snippet = line.strip()
                if snippet:
                    refs.append(EvidenceRef(relative, idx, digest, parser, snippet))
        self.tool_calls.append(ToolCall(self._tool_id(), f"read_{parser}", "ok", relative, len(refs)))
        return refs

    def read_timeline(self) -> List[Dict[str, str]]:
        path = self._safe_path("timeline.csv")
        digest = self._hash(path)
        rows: List[Dict[str, str]] = []
        with path.open("r", encoding="utf-8") as handle:
            reader = csv.DictReader(handle)
            for line, row in enumerate(reader, start=2):
                row["_ref"] = EvidenceRef("timeline.csv", line, digest, "timeline", " | ".join(row.values()))
                rows.append(row)
        self.tool_calls.append(ToolCall(self._tool_id(), "read_timeline", "ok", "timeline.csv", len(rows)))
        return rows

    def read_auth(self) -> List[EvidenceRef]:
        return self.read_lines("auth.log", "auth")

    def read_powershell(self) -> List[EvidenceRef]:
        return self.read_lines("powershell.log", "powershell")

    def read_registry(self) -> List[EvidenceRef]:
        return self.read_lines("registry.log", "registry")

    def read_network(self) -> List[EvidenceRef]:
        return self.read_lines("network.log", "network")

    def read_ground_truth(self) -> Dict[str, object]:
        path = self._safe_path("ground_truth.json")
        with path.open("r", encoding="utf-8") as handle:
            data = json.load(handle)
        self.tool_calls.append(ToolCall(self._tool_id(), "read_ground_truth", "ok", "ground_truth.json", 1))
        return data

    def current_tool_calls(self) -> List[ToolCall]:
        return list(self.tool_calls)
