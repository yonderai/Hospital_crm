import os
import requests
from flask import Blueprint, request, jsonify

# Create a blueprint for AI routes
ai_bp = Blueprint('ai', __name__)

# Configuration
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.2-3b-instruct:free")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

def get_mock_insight(symptoms, history, medications):
    """Fallback mock generator for when API key is missing"""
    return f"""🧠 AI Clinical Insights (Simulated)
---------------------------------------------------
• Reported symptoms: {symptoms}
• Relevant history: {history}
• Past medications: {medications}

• Possible conditions (non-diagnostic):
  – Acute Presentation of {symptoms.split(',')[0] if ',' in symptoms else symptoms}
  – Secondary systemic stress related to reported history

• Suggested next checks:
  – Comprehensive metabolic panel (CMP)
  – Review of historical vitals baseline

• Risk flags:
  – Moderate priority based on initial profile assessment
"""

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
            print("[AI] No API Key found, using mock fallback.")
            return jsonify({
                "insight": get_mock_insight(symptoms, history, medications),
                "model_used": "mock-fallback"
            })

        # Construct the system prompt
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

        Keep it concise, professional, and strictly adhere to the bullet points and structure above. Do not include markdown code blocks."""

        user_prompt = f"Patient Data:\n- Symptoms: {symptoms}\n- Medical History: {history}\n- Current/Past Medications: {medications}\n\nGenerate the clinical insight."

        # Models to try
        models = [OPENROUTER_MODEL, "meta-llama/llama-3.2-3b-instruct:free", "meta-llama/llama-3.1-8b-instruct:free", "google/gemma-2-9b-it:free"]
        
        last_error = None
        for model in models:
            try:
                print(f"[AI] Attempting with model: {model}")
                response = requests.post(
                    OPENROUTER_URL,
                    headers={
                        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                        "Content-Type": "application/json",
                        "HTTP-Referer": "https://yonder-crm.local",
                        "X-Title": "Hospital CRM"
                    },
                    json={
                        "model": model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        "temperature": 0.2,
                        "max_tokens": 500
                    },
                    timeout=15
                )
                
                if response.status_code == 200:
                    result = response.json()
                    if 'choices' in result and len(result['choices']) > 0:
                        return jsonify({
                            "insight": result['choices'][0]['message']['content'],
                            "model_used": model
                        })
                
                last_error = response.text
                print(f"[AI] Model {model} failed: {last_error}")
            except Exception as e:
                last_error = str(e)
                print(f"[AI] Exception with {model}: {last_error}")

        # If all models fail, use mock fallback
        print("[AI] All models failed, using mock fallback.")
        return jsonify({
            "insight": get_mock_insight(symptoms, history, medications),
            "model_used": "mock-fallback-after-error",
            "details": last_error
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
