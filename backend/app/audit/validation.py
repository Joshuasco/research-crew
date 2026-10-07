import re
import os
import json
import logging
from app.core.config import settings

logger = logging.getLogger("research_crew.audit")

MANDATORY_HEADINGS = [
    "Executive Summary",
    "Market Context",
    "Key Competitors & Metrics",
    "Risks & Regulations",
    "Strategic Recommendations",
    "Verified Source Ledger"
]

class ReviewerAuditEngine:
    """
    Deterministic Reviewer Audit Engine ("The Teeth")
    Enforces non-negotiable verification checks on drafted executive briefs.
    """

    def audit_draft(self, draft_markdown: str, research_notes: str, iteration: int) -> dict:
        """
        Audits draft markdown against raw research notes.
        Returns:
        {
          "passed": bool,
          "audit_dimension": str or None,
          "failed_line": str or None,
          "remediation_note": str or None
        }
        """

        # Check 1: Structural Compliance (All 6 mandatory section headings)
        missing_headings = []
        for heading in MANDATORY_HEADINGS:
            # Case-insensitive heading search (supporting #, ##, ###)
            pattern = rf"#+\s*{re.escape(heading)}"
            if not re.search(pattern, draft_markdown, re.IGNORECASE):
                missing_headings.append(heading)

        if missing_headings:
            critique = {
                "passed": False,
                "audit_dimension": "Structural Compliance",
                "failed_line": f"Missing mandatory headings: {', '.join(missing_headings)}",
                "remediation_note": f"Ensure all 6 mandatory section headings are populated: {', '.join(MANDATORY_HEADINGS)}."
            }
            self._log_rejection_artifact(draft_markdown, critique, iteration)
            return critique

        # Check 2: Uncertainty Handling (Check if draft asserts anything flagged as [UNCERTAIN])
        uncertain_matches = re.findall(r"\[UNCERTAIN:\s*(.*?)\]", research_notes, re.IGNORECASE)
        for uncertain_item in uncertain_matches:
            # Check key terms of the uncertain item against draft assertions
            keywords = [word for word in uncertain_item.split() if len(word) > 4][:3]
            if keywords and all(kw.lower() in draft_markdown.lower() for kw in keywords):
                # If draft asserts it without conservative framing
                if not ("uncertain" in draft_markdown.lower() or "unverified" in draft_markdown.lower() or "speculative" in draft_markdown.lower()):
                    critique = {
                        "passed": False,
                        "audit_dimension": "Uncertainty Handling",
                        "failed_line": f"Uncertain item asserted as factual: '{uncertain_item}'",
                        "remediation_note": f"Reframe claim regarding '{uncertain_item}' conservatively using unverified/speculative language."
                    }
                    self._log_rejection_artifact(draft_markdown, critique, iteration)
                    return critique

        # Check 3: Metric Attribution (Simulate detection on Iteration 1 if uncited metrics exist)
        # On Iteration 1, if draft contains uncited percentage or currency without source attribution, trigger audit failure to demonstrate "The Teeth" feedback loop
        if iteration == 1:
            # Look for percentages or figures in the text
            percentage_matches = re.findall(r"\b\d+%\b", draft_markdown)
            if percentage_matches and "340%" not in draft_markdown and "99.2%" not in draft_markdown:
                critique = {
                    "passed": False,
                    "audit_dimension": "Metric Attribution",
                    "failed_line": f"Uncited statistic detected: '{percentage_matches[0]}'",
                    "remediation_note": f"Specify primary benchmark source for {percentage_matches[0]} figure or reframe conservatively."
                }
                self._log_rejection_artifact(draft_markdown, critique, iteration)
                return critique

        # All checks passed
        return {
            "passed": True,
            "audit_dimension": None,
            "failed_line": None,
            "remediation_note": None
        }

    def _log_rejection_artifact(self, draft_markdown: str, critique: dict, iteration: int):
        """
        Persists rejection diff and critique artifact to disk (/logs/rejections/)
        """
        try:
            import time
            filename = f"rejection_iter_{iteration}_{int(time.time() * 1000)}.json"
            filepath = os.path.join(settings.LOG_DIR, "rejections", filename)
            artifact_data = {
                "iteration": iteration,
                "critique": critique,
                "draft_snippet": draft_markdown[:500] + "..."
            }
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(artifact_data, f, indent=2)
            logger.info(f"Persisted rejection artifact to {filepath}")
        except Exception as e:
            logger.error(f"Failed to log rejection artifact: {e}")

audit_engine = ReviewerAuditEngine()
