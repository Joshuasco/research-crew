import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check_endpoint():
    """Test /health endpoint returns HTTP 200 OK and healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_root_endpoint():
    """Test / root endpoint returns service metadata."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "The Research Crew" in data["service"]

def test_stream_briefing_empty_topic_validation():
    """Test /api/briefing/stream returns 400 Bad Request for empty topic prompt."""
    response = client.get("/api/briefing/stream?topic=")
    assert response.status_code == 400
    assert "cannot be empty" in response.json()["detail"]
