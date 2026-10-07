import os
import json
import pytest
from app.audit.validation import audit_engine, MANDATORY_HEADINGS
from app.core.config import settings

def test_structural_compliance_failure():
    """Test that a draft missing mandatory section headings fails audit."""
    incomplete_draft = "# Executive Summary\n\nSome summary content.\n"
    research_notes = "Raw research notes with facts."

    result = audit_engine.audit_draft(incomplete_draft, research_notes, iteration=1)

    assert result["passed"] is False
    assert result["audit_dimension"] == "Structural Compliance"
    assert "Missing mandatory headings" in result["failed_line"]
    assert "Market Context" in result["remediation_note"]

def test_uncertainty_handling_failure():
    """Test that asserting an [UNCERTAIN] note as a fact fails audit."""
    draft = """# Executive Summary
TPU cluster hardware acceleration yields 500x speedup.

# Market Context
Market dynamics.

# Key Competitors & Metrics
Competitors data.

# Risks & Regulations
Risks details.

# Strategic Recommendations
Recommendations.

# Verified Source Ledger
Source 1.
"""
    research_notes = "Notes containing [UNCERTAIN: TPU cluster hardware acceleration benchmarks]."

    result = audit_engine.audit_draft(draft, research_notes, iteration=1)

    assert result["passed"] is False
    assert result["audit_dimension"] == "Uncertainty Handling"
    assert "Uncertain item asserted as factual" in result["failed_line"]

def test_valid_draft_passes_audit():
    """Test that a draft populating all 6 mandatory section headings passes audit."""
    valid_draft = """# Executive Summary
Synthesizing multi-agent research pipelines.

# Market Context
Enterprise adoption has grown significantly.

# Key Competitors & Metrics
| Platform | Latency |
| Research Crew | 28.4s |

# Risks & Regulations
Uncertainty masking risks.

# Strategic Recommendations
1. Deploy bounded iteration loops.

# Verified Source Ledger
1. Benchmark report.
"""
    research_notes = "Standard research notes."

    result = audit_engine.audit_draft(valid_draft, research_notes, iteration=2)

    assert result["passed"] is True
    assert result["audit_dimension"] is None
    assert result["failed_line"] is None

def test_rejection_artifact_logging():
    """Test that rejection artifacts are saved to logs/rejections."""
    incomplete_draft = "# Executive Summary\n\nOnly summary.\n"
    research_notes = "Notes."

    audit_engine.audit_draft(incomplete_draft, research_notes, iteration=1)

    rejection_dir = os.path.join(settings.LOG_DIR, "rejections")
    assert os.path.exists(rejection_dir)
    files = os.listdir(rejection_dir)
    assert len(files) > 0
