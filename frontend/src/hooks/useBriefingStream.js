import { useState, useRef, useCallback } from 'react';
import { OFFLINE_SAMPLE_BRIEFING, OFFLINE_SAMPLE_TELEMETRY } from '../utils/offlineSample';

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

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
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
  }, [stopTimer]);

  const startStream = useCallback((inputTopic, backendUrl = 'http://localhost:8000/api/briefing/stream') => {
    resetState();
    setTopic(inputTopic);
    setIsStreaming(true);
    setCurrentAgent('Researcher');
    setAgentStatus('in_progress');
    setStatusMessage('Initiating agentic workflow research crew...');
    startTimer();

    // Construct request URL or EventSource
    const url = `${backendUrl}?topic=${encodeURIComponent(inputTopic)}`;

    try {
      const es = new EventSource(url);
      eventSourceRef.current = es;

      es.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);
          handleStreamEvent(payload);
        } catch (err) {
          console.error("Failed to parse SSE payload:", err, e.data);
        }
      };

      es.addEventListener('agent_telemetry', (e) => {
        try {
          const payload = JSON.parse(e.data);
          handleTelemetryEvent(payload);
        } catch (err) {
          console.error("Error parsing agent_telemetry:", err);
        }
      });

      es.addEventListener('reviewer_rejection', (e) => {
        try {
          const payload = JSON.parse(e.data);
          handleRejectionEvent(payload);
        } catch (err) {
          console.error("Error parsing reviewer_rejection:", err);
        }
      });

      es.addEventListener('final_delivery', (e) => {
        try {
          const payload = JSON.parse(e.data);
          handleFinalDelivery(payload);
        } catch (err) {
          console.error("Error parsing final_delivery:", err);
        }
      });

      es.onerror = (err) => {
        console.warn("SSE stream interrupted or failed:", err);
        es.close();
        eventSourceRef.current = null;
        
        // If no markdown content yet, suggest emergency demo fallback mode
        setError("Connection to FastAPI server lost. Make sure backend is running on http://localhost:8000 or click '⚡ Load Demo Briefing'.");
        setIsStreaming(false);
        stopTimer();
      };
    } catch (err) {
      setError(`Failed to connect to backend: ${err.message}`);
      setIsStreaming(false);
      stopTimer();
    }
  }, [resetState, startTimer, stopTimer]);

  const handleTelemetryEvent = (payload) => {
    const data = payload.data || payload;
    if (data.agent) setCurrentAgent(data.agent);
    if (data.status) setAgentStatus(data.status);
    if (data.status_message) setStatusMessage(data.status_message);
    if (data.iteration) setIteration(data.iteration);
    if (data.max_iterations) setMaxIterations(data.max_iterations);

    if (data.telemetry) {
      setTelemetry((prev) => ({
        elapsed_seconds: data.telemetry.elapsed_seconds ?? prev.elapsed_seconds,
        estimated_tokens: data.telemetry.estimated_tokens ?? prev.estimated_tokens,
        estimated_cost_usd: data.telemetry.estimated_cost_usd ?? 0
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
  };

  const handleRejectionEvent = (payload) => {
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
  };

  const handleFinalDelivery = (payload) => {
    const data = payload.data || payload;
    stopTimer();
    setIsStreaming(false);
    setCurrentAgent('Reviewer');
    setAgentStatus('passed');
    setStatusMessage("Audit PASSED: Briefing verified and ready for export!");

    if (data.markdown_content) {
      setMarkdownContent(data.markdown_content);
    }
    if (data.total_elapsed_seconds) {
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
  };

  const loadDemoBriefing = useCallback(() => {
    resetState();
    setIsDemoMode(true);
    setTopic("Autonomous Multi-Agent Systems & Deterministic Audit Engines");
    setMarkdownContent(OFFLINE_SAMPLE_BRIEFING);
    setCurrentAgent('Reviewer');
    setAgentStatus('passed');
    setStatusMessage("⚡ Emergency Demo Briefing Loaded");
    setIteration(2);
    setMaxIterations(2);
    setTelemetry({
      elapsed_seconds: 36.5,
      estimated_tokens: 4620,
      estimated_cost_usd: 0.00
    });
    
    // Populate demo log telemetry & rejections
    setLogs(OFFLINE_SAMPLE_TELEMETRY.map(item => ({
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
        audit_dimension: "Metric Attribution",
        failed_line: "Enterprise adoption grew significantly without explicit source attribution.",
        remediation_note: "Specify exact percentage growth figure (340%) and cite primary benchmark source."
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
    loadDemoBriefing
  };
}
