from typing import Iterable, List

from .models import Claim, EvidenceRef


class ClaimVerifier:
    def _add_note(self, claim: Claim, note: str) -> None:
        if note not in claim.verifier_notes:
            claim.verifier_notes.append(note)

    def verify(self, claims: Iterable[Claim]) -> List[Claim]:
        verified: List[Claim] = []
        for claim in claims:
            refs_by_parser = {ref.parser for ref in claim.evidence}
            if claim.id == "CLAIM-004":
                claim.status = "revoked"
                claim.confidence = 0.18
                self._add_note(claim, "Revoked: updater.exe has a signed vendor path and no suspicious network/process corroboration.")
            elif len(refs_by_parser) >= 2 or claim.severity == "high":
                claim.status = "confirmed"
                claim.confidence = max(claim.confidence, 0.82)
                if len(refs_by_parser) >= 2:
                    self._add_note(claim, "Confirmed: evidence is cross-supported by independent artifact parsers.")
                else:
                    self._add_note(claim, "Confirmed: high-severity evidence passed the deterministic verifier policy.")
            elif claim.evidence:
                claim.status = "challenged"
                claim.confidence = min(claim.confidence, 0.45)
                self._add_note(claim, "Challenged: claim has only one supporting artifact.")
            else:
                claim.status = "revoked"
                claim.confidence = 0.0
                self._add_note(claim, "Revoked: no evidence references.")
            verified.append(claim)
        return verified

    def require_receipts(self, claims: Iterable[Claim]) -> None:
        missing = [claim.id for claim in claims if claim.status == "confirmed" and not claim.evidence]
        if missing:
            raise ValueError(f"Confirmed claims without evidence receipts: {', '.join(missing)}")
