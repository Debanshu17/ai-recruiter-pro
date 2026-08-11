# AI Recruiter Pro 🚀

AI Recruiter Pro is a full-stack, B2B SaaS platform designed to automate and optimize the candidate screening process. By leveraging the power of Google's Gemini Large Language Model (LLM), this platform instantly analyzes, scores, and ranks hundreds of resumes against specific job descriptions and mandatory technical requirements.

## 🌟 Key Features

*   **Intelligent AI Scoring**: Extracts skills, experience, and projects from candidate resumes and scores them against the job description using advanced semantic understanding.
*   **Explainable AI**: No black boxes. Every candidate receives a detailed summary explaining exactly *why* they were scored the way they were, highlighting specific strengths and missing requirements.
*   **Mandatory Requirement Filters**: Instantly flags and rejects candidates who do not meet hard requirements (e.g., specific programming languages or degrees).
*   **Bulk Background Processing**: Upload dozens of resumes at once. The Python backend processes them asynchronously so the frontend remains fast and responsive.
*   **Modern Premium UI**: A highly responsive, editorial-style dashboard built with React, Tailwind CSS, and custom micro-animations.

## 🛠️ Tech Stack

**Frontend:**
*   React 19 (Vite)
*   Tailwind CSS v4 (Custom Design System)
*   React Router DOM
*   Lucide Icons

**Backend:**
*   Python 3 & FastAPI
*   SQLite (Database)
*   Google Gemini Pro API (AI Processing)
*   Uvicorn (ASGI Server)

**Infrastructure:**
*   Deployed on Render (Web Services & Static Sites)
*   Automated CI/CD using Render Blueprints (`render.yaml`)

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/Debanshu17/ai-recruiter-pro.git
cd ai-recruiter-pro
```

### 2. Start the Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt

# Create a .env file and add your Gemini API Key
echo "GEMINI_API_KEY=your_api_key_here" > .env

uvicorn app.main:app --reload
```
The backend will be running at `http://localhost:8000`.

### 3. Start the Frontend (React)
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The frontend will be running at `http://localhost:5173`.

## ☁️ Deployment (Render)

This project includes a `render.yaml` Blueprint for 1-click deployment.
1. Connect your GitHub repository to Render.
2. Click **New +** > **Blueprint**.
3. Select this repository.
4. Provide your `GEMINI_API_KEY` when prompted.
5. Render will automatically build and link both the frontend and backend services.