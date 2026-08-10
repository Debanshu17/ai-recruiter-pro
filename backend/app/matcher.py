import json
from pathlib import Path
import re

def extract_skills(text, predefined_skills=None):
    if predefined_skills is None:
        SKILLS_FILE = Path(__file__).parent / "skills.json"
        with open(SKILLS_FILE, "r") as file:
            predefined_skills = json.load(file)
            
    found_skills = []
    text_lower = text.lower()
    
    for skill in predefined_skills:
        # Simple exact match for now, could be improved with regex word boundaries
        if re.search(r'\b' + re.escape(skill.lower()) + r'\b', text_lower):
            found_skills.append(skill)
            
    return sorted(list(set(found_skills)))

def compare_skills(resume_skills, jd_skills, mandatory_skills=[]):
    matched_skills = []
    missing_skills = []
    
    resume_skills_lower = [s.lower() for s in resume_skills]
    
    for skill in jd_skills:
        if not skill.strip(): continue
        if skill.lower() in resume_skills_lower:
            matched_skills.append(skill)
        else:
            found = False
            for r_skill in resume_skills_lower:
                if skill.lower() in r_skill or r_skill in skill.lower():
                    matched_skills.append(skill)
                    found = True
                    break
            if not found:
                missing_skills.append(skill)

    req_score = 0
    if len(jd_skills) > 0:
        req_score = round((len(matched_skills) / len(jd_skills)) * 100)
        
    mandatory_met = True
    mandatory_failed_reasons = []
    
    for m_skill in mandatory_skills:
        if not m_skill.strip(): continue
        found = False
        for r_skill in resume_skills_lower:
            if m_skill.lower() in r_skill or r_skill in m_skill.lower():
                found = True
                break
        if not found:
            mandatory_met = False
            mandatory_failed_reasons.append(m_skill)
            
    return {
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "required_skills_score": req_score,
        "mandatory_met": mandatory_met,
        "mandatory_failed_reason": "Missing: " + ", ".join(mandatory_failed_reasons) if not mandatory_met else None
    }