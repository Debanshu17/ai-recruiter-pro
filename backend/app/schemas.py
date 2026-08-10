from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class JobBase(BaseModel):
    title: str
    department: str
    location: str
    experience_required: str
    description: str
    required_skills: str
    preferred_skills: str
    mandatory_requirements: str
    threshold: int = 80

class JobCreate(JobBase):
    pass

class JobResponse(JobBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ResumeAnalysisBase(BaseModel):
    match_percentage: int
    required_skills_score: int
    experience_score: int
    projects_score: int
    education_score: int
    mandatory_requirements_met: bool
    mandatory_failed_reason: Optional[str]
    matched_skills: str
    missing_skills: str
    summary: str
    strengths: str
    weaknesses: str
    suggestions: str
    file_name: str

class ResumeAnalysisResponse(ResumeAnalysisBase):
    id: int
    candidate_id: int
    model_config = ConfigDict(from_attributes=True)

class CandidateBase(BaseModel):
    name: str
    email: str
    phone: str
    overall_score: int
    status: str

class CandidateResponse(CandidateBase):
    id: int
    job_id: int
    created_at: datetime
    analysis: Optional[ResumeAnalysisResponse] = None
    model_config = ConfigDict(from_attributes=True)

class BatchBase(BaseModel):
    total_resumes: int
    processed: int
    failed: int
    status: str

class BatchResponse(BatchBase):
    id: int
    job_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)