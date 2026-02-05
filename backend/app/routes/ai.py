import os
import requests
from flask import Blueprint, request, jsonify

# Create a blueprint for AI routes
ai_bp = Blueprint('ai', __name__)

# Configuration
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openai/gpt-oss-20b:free")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

@ai_bp.route('/clinical-insight', methods=['POST'])
def generate_insight():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Extract patient data
        symptoms = data.get("symptoms", "Not specified")
        history = data.get("history", "None")
        medications = data.get("medications", "None")

        if not OPENROUTER_API_KEY:
            return jsonify({"error": "OPENROUTER_API_KEY not configured"}), 500

        # Construct the system prompt to enforce the specific format
        system_prompt = """You are an expert medical AI assistant. Your task is to analyze patient data and provide a structured clinical insight.
        
        Output format MUST be exactly as follows (strict formatting):
        
        🧠 AI Clinical Insights (auto-generated)
        ---------------------------------------------------
        • Reported symptoms: [List symptoms]
        • Relevant history: [List history]
        • Past medications: [List medications]
        • Possible conditions (non-diagnostic):
          – [Condition 1]
          – [Condition 2]
        • Suggested next checks:
          – [Check 1]
          – [Check 2]
        • Risk flags:
          – [Flag 1]

        Keep it concise, professional, and strictly adhere to the bullet points and structure above. Do not include markdown code blocks like ```. Just raw text."""

        user_prompt = f"""
        Patient Data:
        - Symptoms: {symptoms}
        - Medical History: {history}
        - Current/Past Medications: {medications}
        
        Generate the clinical insight."""

        # Call OpenRouter API
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://yonder-crm.local", # Corrected referer for consistency
            "X-Title": "Hospital CRM"
        }

        payload = {
            "model": OPENROUTER_MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.2, # Low temperature for consistent formatting
            "max_tokens": 500
        }

        response = requests.post(OPENROUTER_URL, headers=headers, json=payload)
        
        if response.status_code == 200:
            result = response.json()
            # Extract content
            if 'choices' in result and len(result['choices']) > 0:
                content = result['choices'][0]['message']['content']
                return jsonify({"insight": content})
            else:
                return jsonify({"error": "Invalid response from AI provider"}), 500
        else:
            return jsonify({"error": f"Provider Error: {response.text}"}), response.status_code

    except Exception as e:
        return jsonify({"error": str(e)}), 500
