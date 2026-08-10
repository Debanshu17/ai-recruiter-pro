import json
import os
import google.generativeai as genai
import requests

gemini_api_key = os.environ.get("GEMINI_API_KEY", "")
if gemini_api_key:
    genai.configure(api_key=gemini_api_key)
    
ai_provider = os.environ.get("AI_PROVIDER", "gemini").lower()
ollama_url = os.environ.get("OLLAMA_URL", "http://localhost:11434/api/generate")
ollama_model = os.environ.get("OLLAMA_MODEL", "llama3")

def analyze_resume_with_ai(resume_text, job_description):
    prompt = f"""
You are an expert technical HR recruiter.
Analyze the following resume against the given job description.

Resume:
{resume_text[:4000]}

Job Description:
{job_description}

Provide an evaluation strictly in JSON format.
Calculate a score from 0 to 100 for:
1. experience_score: How well their years of experience and past roles match the job.
2. projects_score: Relevance and complexity of their projects.
3. education_score: Relevance of their education/degrees.

Also provide:
- summary: A short paragraph explaining "Why this candidate?" (or why not).
- strengths: list of 3 key strengths.
- weaknesses: list of 3 potential concerns or missing areas.
- suggestions: list of 2 actionable suggestions for the recruiter or candidate.

Do NOT write explanations outside the JSON. Return ONLY the JSON object.

Format:
{{
    "experience_score": 85,
    "projects_score": 90,
    "education_score": 80,
    "summary": "...",
    "strengths": ["...", "..."],
    "weaknesses": ["...", "..."],
    "suggestions": ["...", "..."]
}}
"""

    if ai_provider == "ollama":
        try:
            response = requests.post(ollama_url, json={
                "model": ollama_model,
                "prompt": prompt,
                "stream": False,
                "format": "json"
            })
            if response.status_code == 200:
                return json.loads(response.json()["response"])
            else:
                raise Exception(f"Ollama returned {response.status_code}")
        except Exception as e:
            print(f"Ollama API Error: {e}")
            return default_error_response(str(e))
    else:
        # Gemini fallback
        if not gemini_api_key:
            return default_error_response("GEMINI_API_KEY not set and AI_PROVIDER is not ollama")
        try:
            model = genai.GenerativeModel('gemini-2.5-flash')
            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    response_mime_type="application/json",
                ),
            )
            content = response.text.strip()
            # Clean markdown if present
            if content.startswith("```json"): content = content.replace("```json", "", 1)
            if content.startswith("```"): content = content.replace("```", "", 1)
            if content.endswith("```"): content = content[:-3]
            return json.loads(content.strip())
        except Exception as e:
            print(f"Gemini API Error: {e}")
            return default_error_response(str(e))

def default_error_response(error_msg):
    return {
        "experience_score": 0,
        "projects_score": 0,
        "education_score": 0,
        "summary": f"Failed to analyze with AI: {error_msg}",
        "strengths": [],
        "weaknesses": [],
        "suggestions": []
    }