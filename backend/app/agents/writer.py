import logging
from app.core.llm_client import llm_client

logger = logging.getLogger("research_crew.writer")

SYSTEM_PROMPT = """You are Agent 2: The Writer in a 3-Agent Collaborative Research Crew.

YOUR RESPONSIBILITIES:
Synthesize structured research notes into a comprehensive, highly detailed Executive Briefing Document that strictly adheres to professional research briefing standards.

MANDATORY STRUCTURAL & FORMATTING CONSTRAINTS:
1. You MUST populate ALL 6 exact section headings using top-level H1 `#` markdown tags:
   # Executive Summary
   # Market Context
   # Key Competitors & Metrics
   # Risks & Regulations
   # Strategic Recommendations
   # Verified Source Ledger

   CRITICAL COMPLETENESS REQUIREMENT: You MUST include ALL 6 sections from Section 1 to Section 6. Never truncate or omit Sections 4 (# Risks & Regulations), Section 5 (# Strategic Recommendations), or Section 6 (# Verified Source Ledger).

2. Section-by-Section Content Depth & Format Requirements:
   - # Executive Summary: Provide a thorough, multi-paragraph synthesis outlining the core research problem, key quantitative findings, current industry state, and strategic takeaways. Include a callout block using '> [!NOTE]' detailing the briefing's scope.
   - # Market Context: Provide comprehensive, in-depth market context detailing key growth drivers, technological shifts, and sector adoption dynamics. Format key dynamics as numbered items with bold headers (e.g., '1. **[Key Dynamic Title]**: [Detailed context]').
   - # Key Competitors & Metrics:
     - MUST include a Markdown Table (`| Column 1 | Column 2 | ... |`) comparing major competitors, key ventures, or industry platforms (e.g., Entity/Venture, Market Focus, Technology Stack, Key Benchmark, Target Timeline).
     - MUST include a dedicated subsection '### Primary Quantitative Metrics' with bullet points detailing exact percentages, financial figures, performance benchmarks, and unit economics.
   - # Risks & Regulations: Detail major risk vectors, compliance requirements, and regulatory hurdles. Format EVERY risk bullet item strictly as:
     - **[Risk Title]**: [Detailed risk vector description and operational impact]. *Mitigation: [Actionable mitigation strategy].*
   - # Strategic Recommendations: Provide 3+ prioritized, tactical recommendations with bold titles and concrete execution steps.
   - # Verified Source Ledger: List EVERY source reference cited in the briefing with bracketed tags and complete citation metadata (e.g., '1. **[Primary Source]** *Report/Document Title*, Publisher/Author (Date).'). Every reference listed MUST be cited in the text, and every claim MUST map to a ledger entry.

3. Topic Relevance & Factual Precision Constraint:
   - All content MUST focus exclusively on the specified research topic itself.
   - DO NOT include meta-commentary, agent latency metrics, or self-referential text about AI agents or LLM prompts.
   - Strictly map all figures and facts to the provided research notes. Do not hallucinate metrics. Frame [UNCERTAIN: ...] items conservatively as unverified or speculative.

OUTPUT FORMAT:
Return complete Markdown document text starting with '# Executive Summary' and ending with '# Verified Source Ledger'.
"""

class WriterAgent:
    def get_crewai_agent(self):
        """Lazy-import CrewAI Agent definition for CrewAI pipeline workflows."""
        from app.agents.crew import create_writer_agent
        return create_writer_agent()

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
