
import os
import requests
from flask import request, jsonify
from app import create_app

app = create_app()

# Configuration (defaults can be overridden by env vars)
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

@app.route('/api/clinical-insight', methods=['POST'])
def generate_insight():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Extract patient data
        symptoms = data.get("symptoms", "Not specified")
        history = data.get("history", "None")
        medications = data.get("medications", "None")

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

        # Get API key from environment
        api_key = os.environ.get("OPENROUTER_API_KEY")
        if not api_key:
            return jsonify({"error": "Server configuration error: OPENROUTER_API_KEY not found"}), 500

        # List of free models to try in order of preference
        # If the environment variable OPENROUTER_MODEL is set, try that first.
        env_model = os.environ.get("OPENROUTER_MODEL")
        
        models_to_try = [
            "meta-llama/llama-3.2-3b-instruct:free",
            "meta-llama/llama-3.3-70b-instruct:free",
            "nousresearch/hermes-3-llama-3.1-405b:free",
            "openrouter/free"
        ]
        
        if env_model and env_model not in models_to_try:
            models_to_try.insert(0, env_model)
        elif env_model:
            # Move env model to front if it's already in the list
            models_to_try.remove(env_model)
            models_to_try.insert(0, env_model)

        last_error = None
        last_status = 500

        for model in models_to_try:
            print(f"Attempting to generate insight using model: {model}") # Debug log
            
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://medical-crm.local",
                "X-Title": "Medical CRM"
            }

            payload = {
                "model": model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": 0.2, 
                "max_tokens": 500
            }

            try:
                response = requests.post(OPENROUTER_URL, headers=headers, json=payload, timeout=30)
                
                if response.status_code == 200:
                    result = response.json()
                    if 'choices' in result and len(result['choices']) > 0:
                        content = result['choices'][0]['message']['content']
                        return jsonify({"insight": content, "model_used": model})
                
                # If we get here, the request failed (non-200 or invalid format)
                last_status = response.status_code
                if response.text.strip().startswith("<"):
                    last_error = f"Model {model} unavailable (Provider Error)"
                else:
                    try:
                        err_json = response.json()
                        last_error = err_json.get('error', {}).get('message', response.text)
                    except:
                        last_error = response.text
                
                print(f"Model {model} failed: {last_error}") # Debug log
                continue # Try next model

            except Exception as e:
                print(f"Exception with model {model}: {str(e)}")
                last_error = str(e)
                continue

        # If all models fail
        return jsonify({
            "error": "All free AI models are currently unavailable. Please try again later.",
            "details": last_error
        }), last_status

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Running on port 5001 as requested
    app.run(host="0.0.0.0", port=5001, debug=True)
