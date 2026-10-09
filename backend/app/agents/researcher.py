import logging
from app.core.llm_client import llm_client

logger = logging.getLogger("research_crew.researcher")

SYSTEM_PROMPT = """You are Agent 1: The Researcher in a 3-Agent Collaborative Research Crew.

YOUR RESPONSIBILITIES:
1. Conduct comprehensive factual analysis and metric extraction on the requested briefing topic.
2. Gather detailed market dynamics, competitive entity profiles, technical benchmarks, risk vectors, regulatory standards, and strategic recommendations.
3. Extract exact quantitative metrics, percentages, financial figures, unit economics, and operational timelines.
4. Provide verified primary source citations (including report names, publishing bodies, dates, and reference badges).
5. MANDATORY CONSTRAINT: Tag any speculative, ambiguous, or unverified data points explicitly using the syntax: [UNCERTAIN: reason for uncertainty].
6. Never resolve ambiguities by guessing or inventing unbacked metrics.

OUTPUT FORMAT:
Return structured Markdown research notes with comprehensive factual data, quantitative metric tables/matrices, citation references, and mandatory [UNCERTAIN: reason] tags where applicable.
"""

class ResearcherAgent:
    async def run(self, topic: str) -> str:
        logger.info(f"Researcher Agent executing for topic: '{topic}'")

        user_prompt = f"""Conduct targeted research on the following topic and output structured research notes:

Topic: {topic}

Remember:
- Include exact quantitative metrics, statistics, and industry benchmarks where available.
- Tag any speculative or unverified assertion with [UNCERTAIN: reason].
"""

        notes = await llm_client.generate_completion(SYSTEM_PROMPT, user_prompt, temperature=0.2)
        return notes

researcher_agent = ResearcherAgent()
