#!/usr/bin/env bash
# ==============================================================================
# The Research Crew - Backend Launcher & QA Helper Script
# ==============================================================================

PORT=${PORT:-8000}

echo "🔍 Checking for existing processes on port $PORT..."
PID=$(lsof -t -i:$PORT 2>/dev/null)
if [ -n "$PID" ]; then
  echo "⚠️ Killing existing process $PID on port $PORT to prevent [Errno 98]..."
  kill -9 $PID 2>/dev/null
  sleep 1
fi

echo "🚀 Launching FastAPI server on http://127.0.0.1:$PORT..."
exec venv/bin/uvicorn app.main:app --host 127.0.0.1 --port $PORT --reload
