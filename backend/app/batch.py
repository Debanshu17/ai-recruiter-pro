import traceback
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.parser import extract_text_from_pdf
from app.matcher import extract_skills, compare_skills
from app.ai import analyze_resume_with_ai
from app import crud
import os

def process_resume_batch(batch_id: int, job_id: int, file_paths: list[str], filenames: list[str]):
    db = SessionLocal()
    try:
        job = crud.get_job(db, job_id)
        if not job:
            return
            
        jd_skills = [s.strip() for s in job.required_skills.split(",")] if job.required_skills else []
        mandatory_skills = [s.strip() for s in job.mandatory_requirements.split(",")] if job.mandatory_requirements else []
        
        for i, file_path in enumerate(file_paths):
            filename = filenames[i]
            candidate_name = filename.replace(".pdf", "").replace("_", " ").title()
            
            try:
                # 1. Extract text
                resume_text = extract_text_from_pdf(file_path)
                
                # 2. Extract and match skills
                resume_skills = extract_skills(resume_text)
                match_result = compare_skills(resume_skills, jd_skills, mandatory_skills)
                
                # 3. AI Analysis
                ai_result = analyze_resume_with_ai(resume_text, job.description)
                
                # 4. Calculate weighted score
                req_score = match_result.get("required_skills_score", 0)
                exp_score = ai_result.get("experience_score", 0)
                proj_score = ai_result.get("projects_score", 0)
                edu_score = ai_result.get("education_score", 0)
                
                overall_score = round((req_score * 0.4) + (exp_score * 0.3) + (proj_score * 0.2) + (edu_score * 0.1))
                
                # Status based on threshold and mandatory requirements
                status = "Shortlisted" if overall_score >= job.threshold and match_result["mandatory_met"] else "Rejected"
                
                # 5. Save Candidate
                candidate = crud.create_candidate(
                    db=db,
                    job_id=job_id,
                    name=candidate_name,
                    email="unknown@example.com",
                    phone="Unknown",
                    overall_score=overall_score,
                    status=status
                )
                
                # 6. Save Analysis
                crud.save_analysis(
                    db=db,
                    candidate_id=candidate.id,
                    file_name=filename,
                    match_percentage=overall_score,
                    required_skills_score=req_score,
                    experience_score=exp_score,
                    projects_score=proj_score,
                    education_score=edu_score,
                    mandatory_requirements_met=match_result["mandatory_met"],
                    mandatory_failed_reason=match_result["mandatory_failed_reason"] or "",
                    matched_skills=match_result["matched_skills"],
                    missing_skills=match_result["missing_skills"],
                    ai_analysis=ai_result
                )
                
                # 7. Update batch progress
                crud.update_batch_progress(db, batch_id, processed=1)
                
            except Exception as e:
                print(f"Error processing {filename}: {e}")
                traceback.print_exc()
                crud.update_batch_progress(db, batch_id, failed=1)
                
    finally:
        db.close()
