import logging
from app.audit.validation import audit_engine

logger = logging.getLogger("research_crew.reviewer")

class ReviewerAgent:
    async def run(self, draft_markdown: str, research_notes: str, iteration: int) -> dict:
        logger.info(f"Reviewer Agent auditing draft (Iteration {iteration})")
        
        # Apply deterministic audit rules ("The Teeth")
        audit_result = audit_engine.audit_draft(draft_markdown, research_notes, iteration)
        return audit_result

reviewer_agent = ReviewerAgent()
