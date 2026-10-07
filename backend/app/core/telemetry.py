import time

class TelemetryTracker:
    def __init__(self):
        self.start_time = time.time()
        self.total_tokens = 0
        self.total_cost_usd = 0.0

    def get_elapsed_seconds(self) -> float:
        return round(time.time() - self.start_time, 1)

    def add_tokens(self, token_count: int):
        self.total_tokens += token_count

    def estimate_tokens_from_text(self, text: str) -> int:
        # Approximate ~4 characters per token
        tokens = max(1, len(text) // 4)
        self.add_tokens(tokens)
        return tokens

    def to_dict(self) -> dict:
        return {
            "elapsed_seconds": self.get_elapsed_seconds(),
            "estimated_tokens": self.total_tokens,
            "estimated_cost_usd": 0.00  # Always $0.00 via OpenRouter Free Tier
        }
