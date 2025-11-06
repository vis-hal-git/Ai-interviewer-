"""
Resume model for storing parsed resume data
"""
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
from datetime import datetime
from bson import ObjectId


class Education(BaseModel):
    """Education entry"""
    degree: str
    institution: str
    year: Optional[str] = None
    grade: Optional[str] = None


class Experience(BaseModel):
    """Work experience entry"""
    title: str
    company: str
    duration: Optional[str] = None
    description: Optional[str] = None


class Resume(BaseModel):
    """Resume document model with flexible schema"""
    user_id: str  # Firebase user ID
    full_name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    skills: List[str] = []
    experience: List[Experience] = []
    education: List[Education] = []
    certifications: List[str] = []
    summary: Optional[str] = None
    job_role: str  # Target job role
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    
    # Flexible fields for any additional sections
    projects: List[Dict] = []  # Projects section
    achievements: List[str] = []  # Achievements/Awards
    languages: List[str] = []  # Programming/Spoken languages
    publications: List[Dict] = []  # Research papers/publications
    volunteer: List[Dict] = []  # Volunteer experience
    additional_sections: Dict = {}  # Any other custom sections
    
    raw_text: str  # Full extracted text
    filename: str
    file_path: str
    file_size: int
    uploaded_at: datetime = datetime.utcnow()
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            ObjectId: lambda v: str(v)
        }


class ResumeUploadResponse(BaseModel):
    """Response after resume upload"""
    success: bool
    message: str
    resume_id: str
    extracted_data: Dict
    can_start_interview: bool
