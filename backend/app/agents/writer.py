import logging
from app.core.llm_client import llm_client

logger = logging.getLogger("research_crew.writer")

SYSTEM_PROMPT = """You are Agent 2: The Writer in a 3-Agent Collaborative Research Crew.

YOUR RESPONSIBILITIES:
1. Synthesize structured research notes into a polished Executive Briefing Document.
2. Mandatory Structural Constraint: You MUST populate all 6 exact section headings:
   # Executive Summary
   # Market Context
   # Key Competitors & Metrics
   # Risks & Regulations
   # Strategic Recommendations
   # Verified Source Ledger

3. Precision Constraint:
   - Ensure every factual assertion and statistic maps to the provided research notes.
   - If research notes contain [UNCERTAIN: reason] tags, frame those topics conservatively as unverified/speculative. Do NOT state them as settled facts.

4. Revision Constraint:
   - If handling a rejected draft with Reviewer remediation instructions, address every single line-item critique explicitly.

OUTPUT FORMAT:
Return complete Markdown document text starting with '# Executive Summary'.
"""

class WriterAgent:
    async def run(self, topic: str, research_notes: str, critique: dict = None, iteration: int = 1) -> str:
        logger.info(f"Writer Agent executing (Iteration {iteration}) for topic: '{topic}'")

        if critique and not critique.get('passed', True):
            user_prompt = f"""REVISION CYCLE (Iteration {iteration})

Topic: {topic}

RAW RESEARCH NOTES:
{research_notes}

REVIEWER AUDIT REJECTION CRITIQUE (Iteration {iteration - 1}):
- Failed Dimension: {critique.get('audit_dimension')}
- Rejected Line: {critique.get('failed_line')}
- Remediation Note: {critique.get('remediation_note')}

Please revise the executive draft to strictly fix the above audit critique while preserving all 6 mandatory section headings.
"""
        else:
            user_prompt = f"""INITIAL DRAFT CREATION (Iteration 1)

Topic: {topic}

RAW RESEARCH NOTES:
{research_notes}

Draft an executive briefing populating all 6 mandatory section headings:
1. # Executive Summary
2. # Market Context
3. # Key Competitors & Metrics
4. # Risks & Regulations
5. # Strategic Recommendations
6. # Verified Source Ledger
"""

        draft = await llm_client.generate_completion(SYSTEM_PROMPT, user_prompt, temperature=0.3)
        return draft

writer_agent = WriterAgent()
