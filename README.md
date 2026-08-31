# AI Recruiter Pro 🚀

An advanced, AI-powered B2B Recruiting Platform designed to automate candidate screening, score resumes against job descriptions, and instantly shortlist top talent using Google Gemini's advanced LLM capabilities.

## 🌟 Key Features

- **Automated AI Screening**: Upload hundreds of candidate PDFs at once. The AI extracts text, analyzes skills, and generates an overall match score against the job description.
- **Strict Thresholds & Mandatory Skills**: Automatically shortlist or reject candidates based on your custom percentage thresholds and mandatory skill checks.
- **Smart Candidate Review**: Get detailed AI-generated remarks explaining exactly *why* a candidate was rejected (e.g. missing mandatory skills, lack of experience) with strengths and weaknesses highlighted.
- **Interactive Dashboards**: Seamlessly manage jobs and compare candidates side-by-side using the intuitive React frontend.

## 💻 Tech Stack

### Frontend
- **React.js (Vite)**: Lightning-fast frontend framework for a smooth Single Page Application (SPA) experience.
- **React Router**: For seamless navigation between Jobs, Candidates, and Review dashboards.
- **Lucide Icons**: Clean, modern iconography.
- **Vanilla CSS**: Custom-built, responsive UI components featuring glassmorphism and modern design aesthetics.

### Backend
- **Python (FastAPI)**: High-performance backend API to handle concurrent batch processing.
- **SQLite (SQLAlchemy)**: Lightweight, robust database to securely store Jobs, Candidates, and AI analyses.
- **Google Gemini 1.5 Flash**: State-of-the-art Large Language Model used to deeply understand and score resumes.
- **pdfminer.six**: To accurately extract textual data from PDF resumes.

### Infrastructure & Deployment
- **Render**: Fully automated CI/CD pipeline. Pushing to the `main` branch automatically triggers zero-downtime deployments for both frontend and backend services.

## 🚀 Getting Started

The platform is fully deployed and accessible via the web. No local installation is required for general usage.

**Live Application**: [AI Recruiter Pro](https://ai-resume-frontend-5tv6.onrender.com)

### Local Development Setup

If you wish to run the project locally for development:

**1. Clone the repository**
```bash
git clone https://github.com/Debanshu17/ai-recruiter-pro.git
cd ai-recruiter-pro
```

**2. Setup Backend**
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # On Windows
pip install -r requirements.txt
# Set your GEMINI_API_KEY environment variable
uvicorn app.main:app --reload
```

**3. Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

## 🔐 Security
The API routes are protected and communicate securely. Ensure that your `GEMINI_API_KEY` is kept secret in your Render environment variables and never committed to version control.