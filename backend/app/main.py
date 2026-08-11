import os
import shutil
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from app.database import engine, Base, get_db
from app import models, schemas, crud
from app.batch import process_resume_batch

app = FastAPI(title="AI Resume Screening API")

FRONTEND_URL = os.environ.get("FRONTEND_URL", "*")
CORS_ORIGINS = [FRONTEND_URL] if FRONTEND_URL != "*" else ["*"]
# Add localhost for dev
if "http://localhost:5173" not in CORS_ORIGINS:
    CORS_ORIGINS.extend(["http://localhost:5173", "http://127.0.0.1:5173"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "*")],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

UPLOAD_FOLDER = Path(os.environ.get("UPLOAD_DIR", "../uploads"))
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

@app.get("/")
def home():
    return {"message": "AI Resume Screening API is running"}

# --- JOBS ---

@app.post("/jobs", response_model=schemas.JobResponse)
def create_job(job: schemas.JobCreate, db: Session = Depends(get_db)):
    return crud.create_job(db=db, job=job)

@app.get("/jobs", response_model=List[schemas.JobResponse])
def get_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_jobs(db, skip=skip, limit=limit)

@app.get("/jobs/{job_id}", response_model=schemas.JobResponse)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = crud.get_job(db, job_id=job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@app.delete("/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = crud.delete_job(db, job_id=job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"message": "Job deleted"}

# --- BATCH UPLOAD & PROCESSING ---

@app.post("/jobs/{job_id}/upload")
async def upload_resumes(
    job_id: int, 
    background_tasks: BackgroundTasks, 
    files: List[UploadFile] = File(...), 
    db: Session = Depends(get_db)
):
    job = crud.get_job(db, job_id=job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    saved_files = []
    filenames = []
    
    for file in files:
        if file.content_type != "application/pdf":
            continue # skip non-pdf
            
        file_path = UPLOAD_FOLDER / file.filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        saved_files.append(str(file_path))
        filenames.append(file.filename)
        
    if not saved_files:
        raise HTTPException(status_code=400, detail="No valid PDF files provided")
        
    batch = crud.create_batch(db, job_id, total_resumes=len(saved_files))
    
    # Send to background processing
    background_tasks.add_task(process_resume_batch, batch.id, job_id, saved_files, filenames)
    
    return {"message": f"Batch {batch.id} started", "batch_id": batch.id, "total": len(saved_files)}

@app.get("/batches/{batch_id}", response_model=schemas.BatchResponse)
def get_batch_status(batch_id: int, db: Session = Depends(get_db)):
    batch = crud.get_batch(db, batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    return batch

# --- CANDIDATES ---

@app.get("/jobs/{job_id}/candidates", response_model=List[schemas.CandidateResponse])
def get_candidates_for_job(job_id: int, db: Session = Depends(get_db)):
    return crud.get_candidates(db, job_id=job_id)

@app.get("/candidates/{candidate_id}", response_model=schemas.CandidateResponse)
def get_candidate(candidate_id: int, db: Session = Depends(get_db)):
    candidate = crud.get_candidate(db, candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate

@app.put("/candidates/{candidate_id}/status")
def update_candidate_status(candidate_id: int, status: str, db: Session = Depends(get_db)):
    # status should be sent in request body typically, but for simplicity here we assume query or form param
    # Wait, better to take a small Pydantic model, but let's use a path param or query param for now, actually query param `status`
    valid_statuses = ["Pending", "Shortlisted", "Rejected", "Review"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    candidate = crud.update_candidate_status(db, candidate_id, status)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate

# --- ANALYTICS ---

@app.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    total_jobs = db.query(models.Job).count()
    total_candidates = db.query(models.Candidate).count()
    shortlisted = db.query(models.Candidate).filter(models.Candidate.status == "Shortlisted").count()
    rejected = db.query(models.Candidate).filter(models.Candidate.status == "Rejected").count()
    
    return {
        "total_jobs": total_jobs,
        "total_candidates": total_candidates,
        "shortlisted": shortlisted,
        "rejected": rejected
    }