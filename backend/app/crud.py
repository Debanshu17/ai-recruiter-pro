from sqlalchemy.orm import Session
from app import models, schemas

def get_jobs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Job).offset(skip).limit(limit).all()

def get_job(db: Session, job_id: int):
    return db.query(models.Job).filter(models.Job.id == job_id).first()

def create_job(db: Session, job: schemas.JobCreate):
    db_job = models.Job(**job.model_dump())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

def delete_job(db: Session, job_id: int):
    db_job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if db_job:
        db.delete(db_job)
        db.commit()
    return db_job

def create_batch(db: Session, job_id: int, total_resumes: int):
    batch = models.ScreeningBatch(job_id=job_id, total_resumes=total_resumes)
    db.add(batch)
    db.commit()
    db.refresh(batch)
    return batch

def update_batch_progress(db: Session, batch_id: int, processed: int = 0, failed: int = 0):
    batch = db.query(models.ScreeningBatch).filter(models.ScreeningBatch.id == batch_id).first()
    if batch:
        batch.processed += processed
        batch.failed += failed
        if batch.processed + batch.failed >= batch.total_resumes:
            batch.status = "Completed"
        db.commit()
        db.refresh(batch)
    return batch

def get_batch(db: Session, batch_id: int):
    return db.query(models.ScreeningBatch).filter(models.ScreeningBatch.id == batch_id).first()

def create_candidate(db: Session, job_id: int, name: str, email: str, phone: str, overall_score: int, status: str):
    candidate = models.Candidate(
        job_id=job_id, name=name, email=email, phone=phone,
        overall_score=overall_score, status=status
    )
    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    return candidate

def get_candidates(db: Session, job_id: int):
    return db.query(models.Candidate).filter(models.Candidate.job_id == job_id).order_by(models.Candidate.overall_score.desc()).all()

def get_candidate(db: Session, candidate_id: int):
    return db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()

def update_candidate_status(db: Session, candidate_id: int, status: str):
    candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()
    if candidate:
        candidate.status = status
        db.commit()
        db.refresh(candidate)
    return candidate

def save_analysis(
    db: Session, candidate_id: int, file_name: str, 
    match_percentage: int, required_skills_score: int,
    experience_score: int, projects_score: int, education_score: int,
    mandatory_requirements_met: bool, mandatory_failed_reason: str,
    matched_skills: list, missing_skills: list, ai_analysis: dict
):
    analysis = models.ResumeAnalysis(
        candidate_id=candidate_id,
        file_name=file_name,
        match_percentage=match_percentage,
        required_skills_score=required_skills_score,
        experience_score=experience_score,
        projects_score=projects_score,
        education_score=education_score,
        mandatory_requirements_met=mandatory_requirements_met,
        mandatory_failed_reason=mandatory_failed_reason,
        matched_skills=", ".join(matched_skills),
        missing_skills=", ".join(missing_skills),
        summary=ai_analysis.get("summary", ""),
        strengths=", ".join(ai_analysis.get("strengths", [])),
        weaknesses=", ".join(ai_analysis.get("weaknesses", [])),
        suggestions=", ".join(ai_analysis.get("suggestions", []))
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return analysis