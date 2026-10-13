import pytest
from app.core.telemetry import TelemetryTracker

SAMPLE_RESEARCH_NOTES = """# RAW RESEARCH NOTES
Topic: Quantum Computing Optimization
- Source: IEEE Quantum Survey 2026 (https://ieee.org/quantum)
- Source: ACM Computing Metrics (https://acm.org/metrics)
- Ref: Nature Computing Journal Vol 24
- Key Findings: 45.2% latency reduction achieved across superconducting nodes.
- Energy consumption optimized by $35M in enterprise pilot benchmarks.
- Market adoption grew by 280% YoY across top 10 financial sector pilots.
- [UNCERTAIN: Error mitigation scaling beyond 1000 qubits remains unbenchmarked].
"""

SAMPLE_DRAFT_MD = """# Executive Summary
Quantum computing benchmarks demonstrate major scaling progress.

# Market Context
Enterprise adoption has expanded by 280% YoY across pilot programs.

# Key Competitors & Metrics
| Platform | Metric |
| IBM System | 45.2% speedup |
### Primary Quantitative Metrics
- Latency reduction: 45.2%
- Pilot savings: $35M

# Risks & Regulations
- **Hardware Coherence**: High decoherence rates. *Mitigation: Active cryogenic shielding.*

# Strategic Recommendations
1. Deploy hybrid quantum-classical algorithms.

# Verified Source Ledger
1. IEEE Quantum Survey 2026 (https://ieee.org/quantum).
2. ACM Computing Metrics (https://acm.org/metrics).
"""

def test_telemetry_benchmark_constant():
    tracker = TelemetryTracker()
    assert tracker.BENCHMARK_CONFIDENCE == 85.0
    payload = tracker.to_dict()
    assert payload["benchmark_confidence"] == 85.0

def test_reviewer_rejection_stays_below_benchmark():
    tracker = TelemetryTracker(max_iterations=2)
    tracker.update_from_research(SAMPLE_RESEARCH_NOTES)
    tracker.update_from_draft(SAMPLE_DRAFT_MD, iteration=1)

    # Rejection on Iteration 1
    critique_iter1 = {
        "passed": False,
        "audit_dimension": "Metric Attribution",
        "failed_line": "Uncited statistic detected: '280%'",
        "remediation_note": "Specify primary benchmark source for 280% figure."
    }
    tracker.update_from_audit(critique_iter1, iteration=1)

    data = tracker.to_dict()
    assert data["research_confidence"] < 85.0
    assert data["verification_precision"] < 85.0
    assert tracker.trajectory_points[-1]["confidence"] < 85.0
    assert tracker.trajectory_points[-1]["isRejection"] is True

    # Rejection on Iteration 2 (Max iteration reached)
    critique_iter2 = {
        "passed": False,
        "audit_dimension": "Structural Compliance",
        "failed_line": "Missing mandatory headings: Risks & Regulations",
        "remediation_note": "Ensure section exists."
    }
    tracker.update_from_audit(critique_iter2, iteration=2)

    data2 = tracker.to_dict()
    assert data2["research_confidence"] < 85.0
    assert data2["verification_precision"] < 85.0
    assert "below 85.0% benchmark" in tracker.trajectory_points[-1]["description"]

def test_reviewer_pass_gives_high_confidence_at_iteration_1():
    tracker = TelemetryTracker(max_iterations=2)
    tracker.update_from_research(SAMPLE_RESEARCH_NOTES)
    tracker.update_from_draft(SAMPLE_DRAFT_MD, iteration=1)

    pass_result = {
        "passed": True,
        "audit_dimension": None,
        "failed_line": None,
        "remediation_note": None
    }
    tracker.update_from_audit(pass_result, iteration=1)

    data = tracker.to_dict()
    assert data["research_confidence"] >= 85.0
    assert data["verification_precision"] >= 85.0
    assert tracker.trajectory_points[-1]["isPassed"] is True
    assert tracker.trajectory_points[-1]["confidence"] >= 85.0
    assert "Exceeded 85.0% benchmark" in tracker.trajectory_points[-1]["description"]

def test_reviewer_pass_gives_high_confidence_at_later_iterations():
    tracker = TelemetryTracker(max_iterations=4)
    tracker.update_from_research(SAMPLE_RESEARCH_NOTES)

    # Iteration 1 fails
    tracker.update_from_draft(SAMPLE_DRAFT_MD, iteration=1)
    tracker.update_from_audit({"passed": False, "audit_dimension": "Metric Attribution"}, iteration=1)
    assert tracker.to_dict()["research_confidence"] < 85.0

    # Iteration 2 fails
    tracker.update_from_draft(SAMPLE_DRAFT_MD, iteration=2)
    tracker.update_from_audit({"passed": False, "audit_dimension": "Uncertainty Handling"}, iteration=2)
    assert tracker.to_dict()["research_confidence"] < 85.0

    # Iteration 3 passes
    tracker.update_from_draft(SAMPLE_DRAFT_MD, iteration=3)
    tracker.update_from_audit({"passed": True, "audit_dimension": None}, iteration=3)

    data = tracker.to_dict()
    # High pass score must be awarded regardless of which iteration it passed
    assert data["research_confidence"] >= 85.0
    assert data["verification_precision"] >= 85.0
    assert tracker.trajectory_points[-1]["isPassed"] is True
    assert tracker.trajectory_points[-1]["confidence"] >= 85.0

def test_confidence_is_calculated_dynamically_from_content():
    tracker_deep = TelemetryTracker()
    tracker_deep.update_from_research(SAMPLE_RESEARCH_NOTES)
    tracker_deep.update_from_draft(SAMPLE_DRAFT_MD, iteration=1)
    tracker_deep.update_from_audit({"passed": True}, iteration=1)

    # Minimal notes with sparse sources
    sparse_notes = "# Notes\nBrief overview."
    sparse_draft = "# Executive Summary\nBrief.\n# Market Context\n# Key Competitors & Metrics\n# Risks & Regulations\n# Strategic Recommendations\n# Verified Source Ledger"
    tracker_sparse = TelemetryTracker()
    tracker_sparse.update_from_research(sparse_notes)
    tracker_sparse.update_from_draft(sparse_draft, iteration=1)
    tracker_sparse.update_from_audit({"passed": True}, iteration=1)

    # Deep research with multiple sources and metrics must have higher realistic confidence than sparse
    assert tracker_deep.research_confidence > tracker_sparse.research_confidence
    assert tracker_deep.verification_precision > tracker_sparse.verification_precision
