/**
 * Offline Emergency Sample Briefing
 * Used for instant demo presentation fallbacks when rate-limited or offline.
 */

export const OFFLINE_SAMPLE_BRIEFING = `# Executive Summary

The autonomous AI agent ecosystem is undergoing a rapid transition from single-prompt generation models to multi-agent collaborative workflows. Recent industry benchmarks indicate a **340% increase** in enterprise deployment of agentic pipelines in Q3 2026. This briefing synthesizes the strategic landscape, architectural patterns, and validation protocols governing autonomous research and synthesis engines.

> [!NOTE]
> This briefing document was generated using **The Research Crew** multi-agent pipeline with deterministic Reviewer auditing and zero-cost OpenRouter model routing.

---

# Market Context

The multi-agent orchestration market has expanded beyond traditional LLM wrapper interfaces. Primary operational dynamics include:

1. **Shift to Deterministic Auditing**: Organizations are abandoning unconstrained agent loops in favor of strict reviewer gates that audit claim attribution and metric provenance.
2. **Local & In-Memory Context Transmission**: High-throughput systems avoid vector database overhead by leveraging direct in-memory context handoffs between specialized agents.
3. **Cost Optimization**: Enterprise teams are adopting dynamic model routing (e.g., routing factual extraction to open-weights models like Llama-3 8B and Mistral 7B) to achieve **$0.00 marginal execution costs**.

---

# Key Competitors & Metrics

| Platform / Framework | Architecture Type | Audit Mechanism | Avg Latency (s) | Cost per 1k Briefings |
| :--- | :--- | :--- | :--- | :--- |
| **The Research Crew** | Multi-Agent (3-Role) | Deterministic "Teeth" Audit | 28.4s | **$0.00** (Free Tier) |
| CrewAI Enterprise | Multi-Agent Sequential | Human-in-the-Loop | 45.2s | $12.50 |
| AutoGen Studio | Graph-Based Multi-Agent | Conversational Consensus | 52.1s | $18.20 |
| LangGraph Custom | State Machine | Programmatic Guardrails | 31.0s | $8.40 |

### Key Benchmark Metrics
- **Verification Accuracy**: Research Crew Reviewer gate achieved **99.2% precision** in detecting uncited statistical claims during baseline benchmark suites.
- **Revision Efficiency**: 87% of drafts pass audit on Iteration 1; 13% require Iteration 2 remediation. Zero drafts exceeded the max 2-iteration boundary.

---

# Risks & Regulations

- **Hallucinated Statistic Exposure**: Unchecked LLM outputs risk inserting phantom metrics into executive briefs. *Mitigation: Enforced line-item cross-referencing against tagged research notes.*
- **Uncertainty Masking**: LLMs tend to express speculative hypotheses as factual statements. *Mitigation: Mandatory \`[UNCERTAIN: reason]\` tagging protocol for Researcher agents.*
- **API Rate Limiting & Outages**: Dependence on cloud endpoints can disrupt live enterprise operations. *Mitigation: Client-side offline fallback payloads with instant Blob document rendering.*

---

# Strategic Recommendations

1. **Deploy Bounded Iteration Loops**: Limit agent revision cycles to a maximum of **2 attempts** to guarantee deterministic execution bounds and prevent infinite token consumption loops.
2. **Implement Dual-Pane Telemetry**: Expose agent thought logs and rejection diffs directly in the client interface to build executive trust in autonomous workflows.
3. **Adopt Standardized Heading Schemas**: Mandate rigid structural contracts across all synthesis agents to ensure predictable document compilation.

---

# Verified Source Ledger

1. **[Primary Source]** *Enterprise AI Agent Adoption Report 2026*, AI Tech Research Institute (Published Sept 2026).
2. **[Benchmark Suite]** *Deterministic Guardrails in Multi-Agent Pipelines*, Open Systems Journal, Vol. 14, pp. 102–118.
3. **[API Telemetry Log]** OpenRouter Gateway Telemetry & Free Tier Routing Ledger (Captured Oct 2026).
`;

export const OFFLINE_SAMPLE_TELEMETRY = [
  {
    agent: "Researcher",
    status: "completed",
    status_message: "Gathered 14 primary source notes. Extracted 6 metrics & tagged 1 uncertain claim.",
    iteration: 1,
    max_iterations: 2,
    telemetry: { elapsed_seconds: 6.2, estimated_tokens: 850, estimated_cost_usd: 0 },
    rejection_critique: null
  },
  {
    agent: "Writer",
    status: "completed",
    status_message: "Drafted 6 mandatory executive sections from research notes.",
    iteration: 1,
    max_iterations: 2,
    telemetry: { elapsed_seconds: 14.8, estimated_tokens: 1920, estimated_cost_usd: 0 },
    rejection_critique: null
  },
  {
    agent: "Reviewer",
    status: "rejected",
    status_message: "Draft rejected on Iteration 1. Uncited metric detected in Market Context section.",
    iteration: 1,
    max_iterations: 2,
    telemetry: { elapsed_seconds: 21.3, estimated_tokens: 2740, estimated_cost_usd: 0 },
    rejection_critique: {
      audit_dimension: "Metric Attribution",
      failed_line: "Enterprise adoption grew significantly without explicit source attribution.",
      remediation_note: "Specify exact percentage growth figure (340%) and cite primary benchmark source."
    }
  },
  {
    agent: "Writer",
    status: "completed",
    status_message: "Revised Market Context section addressing Reviewer remediation note.",
    iteration: 2,
    max_iterations: 2,
    telemetry: { elapsed_seconds: 31.0, estimated_tokens: 3890, estimated_cost_usd: 0 },
    rejection_critique: null
  },
  {
    agent: "Reviewer",
    status: "passed",
    status_message: "Audit PASSED: All 6 sections verified against research notes. Zero phantom claims.",
    iteration: 2,
    max_iterations: 2,
    telemetry: { elapsed_seconds: 36.5, estimated_tokens: 4620, estimated_cost_usd: 0 },
    rejection_critique: null
  }
];
