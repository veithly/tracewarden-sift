from dataclasses import dataclass, field, asdict
from typing import Any, Dict, List


@dataclass
class EvidenceRef:
    file: str
    line: int
    sha256: str
    parser: str
    snippet: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class ToolCall:
    id: str
    name: str
    status: str
    detail: str
    evidence_count: int = 0

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class Claim:
    id: str
    title: str
    status: str
    severity: str
    confidence: float
    rationale: str
    evidence: List[EvidenceRef] = field(default_factory=list)
    verifier_notes: List[str] = field(default_factory=list)
    related_tool_calls: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        data = asdict(self)
        data["evidence"] = [ref.to_dict() for ref in self.evidence]
        return data
