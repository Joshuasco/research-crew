import logging
from app.core.llm_client import llm_client

logger = logging.getLogger("research_crew.researcher")

SYSTEM_PROMPT = """You are Agent 1: The Researcher in a 3-Agent Collaborative Research Crew.

YOUR RESPONSIBILITIES:
1. Conduct factual analysis and metric extraction on the requested briefing topic.
2. Extract concrete quantitative statistics, percentages, market figures, and benchmark metrics.
3. Structure raw research notes clearly with distinct sections and bullet points.
4. MANDATORY CONSTRAINT: Tag any speculative, ambiguous, or unverified data points explicitly using the syntax: [UNCERTAIN: reason for uncertainty].
5. Never resolve ambiguities by guessing or inventing unbacked metrics.

OUTPUT FORMAT:
Return structured Markdown research notes with quantitative data points and any mandatory [UNCERTAIN: reason] tags.
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
