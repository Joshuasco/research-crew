import { useState, useRef, useCallback } from 'react';
import {
  OFFLINE_SAMPLE_TELEMETRY,
  getBriefingForTopic
} from '../utils/offlineSample';

export function useBriefingStream() {
  const [topic, setTopic] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null); // 'Researcher' | 'Writer' | 'Reviewer' | null
  const [agentStatus, setAgentStatus] = useState('idle'); // 'idle' | 'in_progress' | 'passed' | 'rejected' | 'completed' | 'error'
  const [statusMessage, setStatusMessage] = useState('');
  const [iteration, setIteration] = useState(1);
  const [maxIterations, setMaxIterations] = useState(2);
  const [telemetry, setTelemetry] = useState({
    elapsed_seconds: 0,
    estimated_tokens: 0,
    estimated_cost_usd: 0
  });
  const [logs, setLogs] = useState([]);
  const [rejections, setRejections] = useState([]);
  const [markdownContent, setMarkdownContent] = useState('');
  const [error, setError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const eventSourceRef = useRef(null);
  const timerRef = useRef(null);
  const demoTimeoutsRef = useRef([]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const clearDemoTimeouts = useCallback(() => {
    if (demoTimeoutsRef.current) {
      demoTimeoutsRef.current.forEach((id) => clearTimeout(id));
      demoTimeoutsRef.current = [];
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      setTelemetry((prev) => ({
        ...prev,
        elapsed_seconds: parseFloat(((Date.now() - startTime) / 1000).toFixed(1))
      }));
    }, 100);
  }, [stopTimer]);

  const resetState = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    clearDemoTimeouts();
    stopTimer();
    setIsStreaming(false);
    setCurrentAgent(null);
    setAgentStatus('idle');
    setStatusMessage('');
    setIteration(1);
    setMaxIterations(2);
    setTelemetry({ elapsed_seconds: 0, estimated_tokens: 0, estimated_cost_usd: 0 });
    setLogs([]);
    setRejections([]);
    setMarkdownContent('');
    setError(null);
    setIsDemoMode(false);
  }, [clearDemoTimeouts, stopTimer]);

  const handleTelemetryEvent = useCallback((payload) => {
    const data = payload.data || payload;
    if (data.agent) setCurrentAgent(data.agent);
    if (data.status) setAgentStatus(data.status);
    if (data.status_message) setStatusMessage(data.status_message);
    if (data.iteration) setIteration(data.iteration);
    if (data.max_iterations) setMaxIterations(data.max_iterations);

    if (data.telemetry) {
      setTelemetry((prev) => ({
        ...prev,
        ...data.telemetry
      }));
    }

    if (data.status_message) {
      setLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          agent: data.agent || 'System',
          message: data.status_message,
          iteration: data.iteration || 1,
          status: data.status || 'info'
        }
      ]);
    }
  }, []);

  const handleRejectionEvent = useCallback((payload) => {
    const data = payload.data || payload;
    setCurrentAgent('Reviewer');
    setAgentStatus('rejected');
    setStatusMessage(data.status_message || `Draft rejected on Iteration ${data.iteration || 1}. Uncited metric/claim detected.`);

    if (data.rejection_critique) {
      setRejections((prev) => [
        ...prev,
        {
          iteration: data.iteration || 1,
          timestamp: new Date().toLocaleTimeString(),
          ...data.rejection_critique
        }
      ]);
    }

    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString(),
        agent: 'Reviewer',
        message: `❌ REJECTED (Iter ${data.iteration}): ${data.rejection_critique?.audit_dimension || 'Audit Check Failed'}`,
        iteration: data.iteration || 1,
        status: 'rejected'
      }
    ]);
  }, []);

  const handleFinalDelivery = useCallback((payload) => {
    const data = payload.data || payload;
    stopTimer();
    setIsStreaming(false);
    setCurrentAgent('Reviewer');
    setAgentStatus('passed');
    setStatusMessage('Audit PASSED: Briefing verified and ready for export!');

    if (data.markdown_content) {
      setMarkdownContent(data.markdown_content);
    }

    if (data.telemetry) {
      setTelemetry((prev) => ({
        ...prev,
        ...data.telemetry
      }));
    } else if (data.total_elapsed_seconds) {
      setTelemetry((prev) => ({
        ...prev,
        elapsed_seconds: data.total_elapsed_seconds,
        estimated_tokens: data.total_tokens || prev.estimated_tokens,
        estimated_cost_usd: data.total_cost_usd || 0
      }));
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, [stopTimer]);

  const handleStreamEvent = useCallback((payload) => {
    if (payload.event === 'agent_telemetry') handleTelemetryEvent(payload);
    else if (payload.event === 'reviewer_rejection') handleRejectionEvent(payload);
    else if (payload.event === 'final_delivery') handleFinalDelivery(payload);
  }, [handleTelemetryEvent, handleRejectionEvent, handleFinalDelivery]);

  const startStream = useCallback((inputTopic, backendUrl = 'http://localhost:8000/api/briefing/stream') => {
    resetState();
    setTopic(inputTopic);
    setIsStreaming(true);
    setCurrentAgent('Researcher');
    setAgentStatus('in_progress');
    setStatusMessage('Initiating agentic workflow research crew...');
    startTimer();

    const url = `${backendUrl}?topic=${encodeURIComponent(inputTopic)}`;

    try {
      const es = new EventSource(url);
      eventSourceRef.current = es;

      es.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);
          handleStreamEvent(payload);
        } catch (err) {
          console.error('Failed to parse SSE payload:', err, e.data);
        }
      };

      es.addEventListener('agent_telemetry', (e) => {
        try {
          const payload = JSON.parse(e.data);
          handleTelemetryEvent(payload);
        } catch (err) {
          console.error('Error parsing agent_telemetry:', err);
        }
      });

      es.addEventListener('reviewer_rejection', (e) => {
        try {
          const payload = JSON.parse(e.data);
          handleRejectionEvent(payload);
        } catch (err) {
          console.error('Error parsing reviewer_rejection:', err);
        }
      });

      es.addEventListener('final_delivery', (e) => {
        try {
          const payload = JSON.parse(e.data);
          handleFinalDelivery(payload);
        } catch (err) {
          console.error('Error parsing final_delivery:', err);
        }
      });

      es.onerror = (err) => {
        console.warn('SSE stream interrupted or failed:', err);
        es.close();
        eventSourceRef.current = null;
        setError("Connection to backend server unavailable. Use '⚡ Run Interactive Demo' or '⚡ Load Demo Briefing' to present the full workflow.");
        setIsStreaming(false);
        stopTimer();
      };
    } catch (err) {
      setError(`Failed to connect to backend: ${err.message}`);
      setIsStreaming(false);
      stopTimer();
    }
  }, [resetState, startTimer, stopTimer, handleStreamEvent, handleTelemetryEvent, handleRejectionEvent, handleFinalDelivery]);

  /**
   * Run realistic interactive presentation demo simulating multi-agent progression
   */
  const runInteractiveDemo = useCallback((inputTopic) => {
    resetState();
    const targetTopic = inputTopic || 'Commercial Fusion Energy Reactor Benchmarks & Timeline';
    setTopic(targetTopic);
    setIsDemoMode(true);
    setIsStreaming(true);
    setCurrentAgent('Researcher');
    setAgentStatus('in_progress');
    setStatusMessage('Researcher querying primary source evidence & extracting quantitative metrics...');
    setIteration(1);
    setMaxIterations(2);
    setTelemetry({ elapsed_seconds: 0.8, estimated_tokens: 580, estimated_cost_usd: 0.00 });
    startTimer();

    const timestamp = () => new Date().toLocaleTimeString();

    // Stage 1 initial log
    setLogs([
      {
        timestamp: timestamp(),
        agent: 'Researcher',
        message: `Querying primary source evidence for: "${targetTopic}"`,
        iteration: 1,
        status: 'info'
      }
    ]);

    // Stage 2: Researcher finishes, Writer starts (~1.2s)
    const t1 = setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        {
          timestamp: timestamp(),
          agent: 'Researcher',
          message: 'Retrieved 14 primary source notes. Extracted 6 metrics & tagged 1 uncertainty.',
          iteration: 1,
          status: 'completed'
        },
        {
          timestamp: timestamp(),
          agent: 'Writer',
          message: 'Synthesizing evidence: drafting 6 mandatory executive sections...',
          iteration: 1,
          status: 'info'
        }
      ]);
      setCurrentAgent('Writer');
      setStatusMessage('Writer compiling executive draft from verified research notes...');
      setTelemetry((prev) => ({ ...prev, estimated_tokens: 1940 }));
    }, 1200);

    // Stage 3: Writer finishes, Reviewer rejects on Iter 1 (~2.5s)
    const t2 = setTimeout(() => {
      const critique = {
        audit_dimension: 'Metric Attribution',
        failed_line: 'Capital investment and adoption scale expanded without explicit citation.',
        remediation_note: 'Specify verified figure ($8.4B across 45 ventures) and cite primary benchmark.'
      };
      setRejections([
        {
          iteration: 1,
          timestamp: timestamp(),
          ...critique
        }
      ]);
      setLogs((prev) => [
        ...prev,
        {
          timestamp: timestamp(),
          agent: 'Reviewer',
          message: '❌ REJECTED (Iter 1): Uncited metric detected in Market Context section.',
          iteration: 1,
          status: 'rejected'
        }
      ]);
      setCurrentAgent('Reviewer');
      setAgentStatus('rejected');
      setStatusMessage('Reviewer gate triggered: Uncited claim rejected. Routing back to Writer for remediation.');
      setTelemetry((prev) => ({ ...prev, estimated_tokens: 2840 }));
    }, 2500);

    // Stage 4: Writer remediates (~3.7s)
    const t3 = setTimeout(() => {
      setIteration(2);
      setCurrentAgent('Writer');
      setAgentStatus('in_progress');
      setStatusMessage('Writer remediating draft: injecting tagged citations & verified metrics...');
      setLogs((prev) => [
        ...prev,
        {
          timestamp: timestamp(),
          agent: 'Writer',
          message: 'Revised draft: attributed quantitative metrics directly to primary source ledger.',
          iteration: 2,
          status: 'completed'
        }
      ]);
      setTelemetry((prev) => ({ ...prev, estimated_tokens: 3950 }));
    }, 3700);

    // Stage 5: Reviewer verifies & approves (~4.9s)
    const t4 = setTimeout(() => {
      stopTimer();
      setCurrentAgent('Reviewer');
      setAgentStatus('passed');
      setStatusMessage('Audit PASSED: All 6 mandatory sections verified against research notes. Zero phantom claims.');
      setLogs((prev) => [
        ...prev,
        {
          timestamp: timestamp(),
          agent: 'Reviewer',
          message: '✓ Audit passed — 6 sections verified against notes. Deterministic gate approved.',
          iteration: 2,
          status: 'passed'
        }
      ]);
      setTelemetry({
        elapsed_seconds: 28.4,
        estimated_tokens: 4620,
        estimated_cost_usd: 0.00,
        verified_sources_count: 14,
        key_findings_count: 6,
        major_risks_count: 3,
        research_confidence: 98.4,
        verification_precision: 99.2
      });
      const briefing = getBriefingForTopic(targetTopic);
      setMarkdownContent(briefing);
      setIsStreaming(false);
    }, 4900);

    demoTimeoutsRef.current = [t1, t2, t3, t4];
  }, [resetState, startTimer, stopTimer]);

  /**
   * Instantly load cached demo briefing without waiting
   */
  const loadDemoBriefing = useCallback((customTopic) => {
    resetState();
    const targetTopic = customTopic || 'Autonomous Multi-Agent Systems & Deterministic Audit Engines';
    setIsDemoMode(true);
    setTopic(targetTopic);
    const content = getBriefingForTopic(targetTopic);
    setMarkdownContent(content);
    setCurrentAgent('Reviewer');
    setAgentStatus('passed');
    setStatusMessage('⚡ Demo Briefing Loaded');
    setIteration(2);
    setMaxIterations(2);
    setTelemetry({
      elapsed_seconds: 28.4,
      estimated_tokens: 4620,
      estimated_cost_usd: 0.00,
      verified_sources_count: 14,
      key_findings_count: 6,
      major_risks_count: 3,
      research_confidence: 98.4,
      verification_precision: 99.2
    });

    setLogs(OFFLINE_SAMPLE_TELEMETRY.map((item) => ({
      timestamp: '11:00:00 AM',
      agent: item.agent,
      message: item.status_message,
      iteration: item.iteration,
      status: item.status
    })));

    setRejections([
      {
        iteration: 1,
        timestamp: '11:00:21 AM',
        audit_dimension: 'Metric Attribution',
        failed_line: 'Enterprise adoption grew significantly without explicit source attribution.',
        remediation_note: 'Specify exact percentage growth figure (340%) and cite primary benchmark source.'
      }
    ]);
  }, [resetState]);

  return {
    topic,
    isStreaming,
    currentAgent,
    agentStatus,
    statusMessage,
    iteration,
    maxIterations,
    telemetry,
    logs,
    rejections,
    markdownContent,
    error,
    isDemoMode,
    startStream,
    resetState,
    loadDemoBriefing,
    runInteractiveDemo
  };
}
