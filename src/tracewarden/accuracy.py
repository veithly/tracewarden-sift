from typing import Dict, Iterable, List, Set

from .models import Claim


class AccuracyScorer:
    def score(self, claims: Iterable[Claim], ground_truth: Dict[str, object]) -> Dict[str, object]:
        claim_list = list(claims)
        expected: Set[str] = set(ground_truth.get("positive_claim_ids", []))
        confirmed: Set[str] = {claim.id for claim in claim_list if claim.status == "confirmed"}
        revoked: Set[str] = {claim.id for claim in claim_list if claim.status == "revoked"}
        tp = len(confirmed & expected)
        fp_ids = sorted(confirmed - expected)
        fn_ids = sorted(expected - confirmed)
        hallucinated = [
            claim.id
            for claim in claim_list
            if claim.status == "confirmed" and not claim.evidence
        ]
        precision = tp / len(confirmed) if confirmed else 0.0
        recall = tp / len(expected) if expected else 0.0
        f1 = (2 * precision * recall / (precision + recall)) if precision + recall else 0.0
        return {
            "total_claims": len(claim_list),
            "confirmed": len(confirmed),
            "revoked": len(revoked),
            "true_positives": tp,
            "false_positive_ids": fp_ids,
            "false_negatives": len(fn_ids),
            "false_negative_ids": fn_ids,
            "hallucinated_claim_ids": hallucinated,
            "precision": round(precision, 3),
            "recall": round(recall, 3),
            "f1": round(f1, 3),
        }
