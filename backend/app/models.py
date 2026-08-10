from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    department = Column(String)
    location = Column(String)
    experience_required = Column(String)
    description = Column(Text)
    required_skills = Column(Text) # Comma separated
    preferred_skills = Column(Text) # Comma separated
    mandatory_requirements = Column(Text) # Comma separated
    threshold = Column(Integer, default=80)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    candidates = relationship("Candidate", back_populates="job", cascade="all, delete-orphan")
    batches = relationship("ScreeningBatch", back_populates="job", cascade="all, delete-orphan")

class ScreeningBatch(Base):
    __tablename__ = "screening_batches"
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    total_resumes = Column(Integer, default=0)
    processed = Column(Integer, default=0)
    failed = Column(Integer, default=0)
    status = Column(String, default="Processing") # Processing, Completed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    job = relationship("Job", back_populates="batches")

class Candidate(Base):
    __tablename__ = "candidates"
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    name = Column(String)
    email = Column(String)
    phone = Column(String)
    overall_score = Column(Integer, default=0)
    status = Column(String, default="Pending") # Pending, Shortlisted, Rejected, Review
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    job = relationship("Job", back_populates="candidates")
    analysis = relationship("ResumeAnalysis", back_populates="candidate", uselist=False, cascade="all, delete-orphan")

class ResumeAnalysis(Base):
    __tablename__ = "resume_analysis"
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), unique=True)
    file_name = Column(String)
    
    match_percentage = Column(Integer) # Overall Score
    required_skills_score = Column(Integer, default=0)
    experience_score = Column(Integer, default=0)
    projects_score = Column(Integer, default=0)
    education_score = Column(Integer, default=0)
    
    mandatory_requirements_met = Column(Boolean, default=True)
    mandatory_failed_reason = Column(Text, nullable=True)
    
    matched_skills = Column(Text)
    missing_skills = Column(Text)
    
    summary = Column(Text) # "Why this candidate?"
    strengths = Column(Text)
    weaknesses = Column(Text)
    suggestions = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    candidate = relationship("Candidate", back_populates="analysis")