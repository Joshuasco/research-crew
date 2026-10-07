import json
import asyncio
import logging
from typing import AsyncGenerator
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse

from app.core.config import settings
from app.core.telemetry import TelemetryTracker
from app.agents.researcher import researcher_agent
from app.agents.writer import writer_agent
from app.agents.reviewer import reviewer_agent

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("research_crew.main")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Autonomous Multi-Agent Research & Synthesis Engine with Deterministic Audit Loops",
    version="1.0.0"
)

# Configure CORS Middleware for Frontend Alignment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "streaming_endpoint": "/api/briefing/stream?topic={topic}"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/briefing/stream")
async def stream_briefing(topic: str = Query(..., description="Briefing topic prompt")):
    """
    Server-Sent Events (SSE) streaming endpoint executing the 3-agent pipeline:
    1. Researcher -> 2. Writer -> 3. Reviewer ("The Teeth" audit gate)
    Enforces maximum 2 revision iterations boundary rule.
    """
    if not topic.strip():
        raise HTTPException(status_code=400, detail="Topic prompt cannot be empty.")

    async def event_generator() -> AsyncGenerator[dict, None]:
        telemetry = TelemetryTracker()
        iteration = 1
        max_iterations = settings.MAX_REVISION_ITERATIONS
        last_critique = None
        draft_markdown = ""

        try:
            # -------------------------------------------------------------
            # STEP 1: Agent 1 - The Researcher
            # -------------------------------------------------------------
            yield {
                "event": "agent_telemetry",
                "data": json.dumps({
                    "agent": "Researcher",
                    "status": "in_progress",
                    "status_message": "Querying live web sources, aggregating quantitative metrics & tagging uncertain assertions...",
                    "iteration": iteration,
                    "max_iterations": max_iterations,
                    "telemetry": telemetry.to_dict(),
                    "rejection_critique": None
                })
            }
            await asyncio.sleep(0.5)

            research_notes = await researcher_agent.run(topic)
            telemetry.estimate_tokens_from_text(research_notes)

            yield {
                "event": "agent_telemetry",
                "data": json.dumps({
                    "agent": "Researcher",
                    "status": "completed",
                    "status_message": "Gathered research notes, extracted quantitative metrics & tagged uncertain claims.",
                    "iteration": iteration,
                    "max_iterations": max_iterations,
                    "telemetry": telemetry.to_dict(),
                    "rejection_critique": None
                })
            }
            await asyncio.sleep(0.5)

            # -------------------------------------------------------------
            # STEP 2 & 3: Revision Loop (Max 2 Attempts)
            # -------------------------------------------------------------
            while iteration <= max_iterations:
                # Agent 2: The Writer
                yield {
                    "event": "agent_telemetry",
                    "data": json.dumps({
                        "agent": "Writer",
                        "status": "in_progress",
                        "status_message": f"Drafting 6 mandatory executive sections (Iteration {iteration})...",
                        "iteration": iteration,
                        "max_iterations": max_iterations,
                        "telemetry": telemetry.to_dict(),
                        "rejection_critique": None
                    })
                }
                await asyncio.sleep(0.5)

                draft_markdown = await writer_agent.run(
                    topic=topic,
                    research_notes=research_notes,
                    critique=last_critique,
                    iteration=iteration
                )
                telemetry.estimate_tokens_from_text(draft_markdown)

                yield {
                    "event": "agent_telemetry",
                    "data": json.dumps({
                        "agent": "Writer",
                        "status": "completed",
                        "status_message": f"Executive draft synthesized (Iteration {iteration}). Passing to Reviewer gate.",
                        "iteration": iteration,
                        "max_iterations": max_iterations,
                        "telemetry": telemetry.to_dict(),
                        "rejection_critique": None
                    })
                }
                await asyncio.sleep(0.5)

                # Agent 3: The Reviewer ("The Teeth")
                yield {
                    "event": "agent_telemetry",
                    "data": json.dumps({
                        "agent": "Reviewer",
                        "status": "in_progress",
                        "status_message": f"Cross-referencing draft assertions against research notes (Iteration {iteration})...",
                        "iteration": iteration,
                        "max_iterations": max_iterations,
                        "telemetry": telemetry.to_dict(),
                        "rejection_critique": None
                    })
                }
                await asyncio.sleep(0.5)

                audit_result = await reviewer_agent.run(
                    draft_markdown=draft_markdown,
                    research_notes=research_notes,
                    iteration=iteration
                )

                if not audit_result["passed"]:
                    last_critique = audit_result
                    yield {
                        "event": "reviewer_rejection",
                        "data": json.dumps({
                            "agent": "Reviewer",
                            "status": "rejected",
                            "status_message": f"Draft rejected on Iteration {iteration}. Audit Failure: {audit_result.get('audit_dimension')}",
                            "iteration": iteration,
                            "max_iterations": max_iterations,
                            "telemetry": telemetry.to_dict(),
                            "rejection_critique": {
                                "audit_dimension": audit_result.get("audit_dimension"),
                                "failed_line": audit_result.get("failed_line"),
                                "remediation_note": audit_result.get("remediation_note")
                            }
                        })
                    }
                    await asyncio.sleep(0.8)
                    iteration += 1
                else:
                    yield {
                        "event": "agent_telemetry",
                        "data": json.dumps({
                            "agent": "Reviewer",
                            "status": "passed",
                            "status_message": f"Audit PASSED on Iteration {iteration}: All 6 sections verified. Zero phantom claims.",
                            "iteration": iteration,
                            "max_iterations": max_iterations,
                            "telemetry": telemetry.to_dict(),
                            "rejection_critique": None
                        })
                    }
                    await asyncio.sleep(0.5)
                    break

            # -------------------------------------------------------------
            # STEP 4: Final Delivery
            # -------------------------------------------------------------
            final_telemetry = telemetry.to_dict()
            yield {
                "event": "final_delivery",
                "data": json.dumps({
                    "status": "completed",
                    "iteration_count": min(iteration, max_iterations),
                    "total_elapsed_seconds": final_telemetry["elapsed_seconds"],
                    "total_tokens": final_telemetry["estimated_tokens"],
                    "total_cost_usd": final_telemetry["estimated_cost_usd"],
                    "markdown_content": draft_markdown
                })
            }

        except Exception as e:
            logger.exception("Error during briefing stream execution:")
            yield {
                "event": "agent_telemetry",
                "data": json.dumps({
                    "agent": "System",
                    "status": "error",
                    "status_message": f"Execution Error: {str(e)}",
                    "iteration": iteration,
                    "max_iterations": max_iterations,
                    "telemetry": telemetry.to_dict(),
                    "rejection_critique": None
                })
            }

    return EventSourceResponse(event_generator())
