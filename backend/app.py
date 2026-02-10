
import os
import requests
from flask import request, jsonify
from app import create_app

app = create_app()

# Configuration (defaults can be overridden by env vars)
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# AI logic moved to app/routes/ai.py for better organization



if __name__ == "__main__":
    # Running on port 5001 as requested
    app.run(host="0.0.0.0", port=5001, debug=True)
