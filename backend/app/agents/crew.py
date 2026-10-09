import logging
from crewai import Agent, Task, Crew, Process, LLM
from app.core.config import settings

logger = logging.getLogger("research_crew.crewai")

def get_crewai_llm():
    """
    Returns a CrewAI compatible LLM object configured for OpenRouter.
    """
    model_name = settings.FREE_MODELS[0] if settings.FREE_MODELS else "google/gemma-4-26b-a4b-it:free"
    return LLM(
        model=f"openrouter/{model_name}",
        api_key=settings.OPENROUTER_API_KEY,
        base_url=settings.OPENROUTER_BASE_URL
    )

def create_researcher_agent(llm=None) -> Agent:
    return Agent(
        role="Senior Fact & Metric Researcher",
        goal="Conduct comprehensive factual analysis, quantitative metric extraction, and citation mapping on the requested research topic.",
        backstory="""You are Agent 1 in a 3-agent collaborative research crew. 
You gather detailed market dynamics, competitive entity profiles, technical benchmarks, risk vectors, regulatory standards, and verified primary source citations.
MANDATORY CONSTRAINT: You must explicitly tag any speculative, ambiguous, or unverified data points using [UNCERTAIN: reason for uncertainty].""",
        verbose=True,
        allow_delegation=False,
        llm=llm or get_crewai_llm()
    )

def create_writer_agent(llm=None) -> Agent:
    return Agent(
        role="Executive Briefing Synthesis Writer",
        goal="Synthesize structured research notes into a complete 6-section Executive Briefing Document.",
        backstory="""You are Agent 2 in a 3-agent collaborative research crew.
You construct executive briefings that MUST contain all 6 mandatory top-level H1 section headings:
# Executive Summary
# Market Context
# Key Competitors & Metrics
# Risks & Regulations
# Strategic Recommendations
# Verified Source Ledger

All content MUST focus exclusively on the research topic, including tabular data comparisons and bulleted risk vectors with mitigations.""",
        verbose=True,
        allow_delegation=False,
        llm=llm or get_crewai_llm()
    )

def create_reviewer_agent(llm=None) -> Agent:
    return Agent(
        role="Compliance & Quality Audit Reviewer",
        goal="Audit executive briefing drafts against mandatory structural dimensions and source attribution standards.",
        backstory="""You are Agent 3 ('The Teeth') in a 3-agent research crew enforcing quality control.
You verify that all 6 mandatory sections are fully present and that every metric maps cleanly to primary source notes without hallucination.""",
        verbose=True,
        allow_delegation=False,
        llm=llm or get_crewai_llm()
    )

class ResearchCrewWorkflow:
    def __init__(self, llm=None):
        self.llm = llm or get_crewai_llm()
        self.researcher = create_researcher_agent(self.llm)
        self.writer = create_writer_agent(self.llm)
        self.reviewer = create_reviewer_agent(self.llm)

    def create_crew(self, topic: str) -> Crew:
        research_task = Task(
            description=f"Conduct factual research and metric extraction for topic: '{topic}'",
            expected_output="Structured research notes with quantitative metrics, citations, and [UNCERTAIN: ...] tags.",
            agent=self.researcher
        )

        writing_task = Task(
            description=f"Draft an executive briefing for topic: '{topic}' using the research notes.",
            expected_output="Complete 6-section Executive Briefing Document starting with '# Executive Summary' and ending with '# Verified Source Ledger'.",
            agent=self.writer
        )

        review_task = Task(
            description="Audit the drafted executive briefing for 6 mandatory sections and source citations.",
            expected_output="Final audited executive briefing or audit critique report.",
            agent=self.reviewer
        )

        return Crew(
            agents=[self.researcher, self.writer, self.reviewer],
            tasks=[research_task, writing_task, review_task],
            process=Process.sequential,
            verbose=True
        )

research_crew_workflow = ResearchCrewWorkflow()
