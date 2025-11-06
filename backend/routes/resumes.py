"""
Resume upload and management routes
"""
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import Optional
import os
from datetime import datetime
from pathlib import Path
import shutil

from models.resume import Resume, ResumeUploadResponse
from services.resume_parser import resume_parser
from middleware.auth_middleware import get_current_user
from utils.database import Database
from config import settings
from typing import Optional


router = APIRouter(prefix="/api/resumes", tags=["resumes"])

# Ensure upload directory exists
UPLOAD_DIR = Path(settings.UPLOAD_DIR) / "resumes"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def validate_file(file: UploadFile) -> tuple[bool, Optional[str]]:
    """Validate uploaded file"""
    # Check file extension
    file_ext = Path(file.filename).suffix.lower()
    allowed_extensions = ['.pdf', '.docx', '.doc']
    
    if file_ext not in allowed_extensions:
        return False, f"Invalid file type. Allowed types: {', '.join(allowed_extensions)}"
    
    # Check file size (read first chunk to estimate)
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()
    file.file.seek(0)  # Reset to beginning
    
    max_size = 10 * 1024 * 1024  # 10MB
    if file_size > max_size:
        return False, f"File too large. Maximum size: {max_size // (1024*1024)}MB"
    
    return True, None


from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer(auto_error=False)  # Don't auto-error if no token


async def get_optional_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[dict]:
    """
    Get current user if authenticated, otherwise return None
    This allows the endpoint to work with or without authentication
    """
    if not credentials:
        print("⚠️ No authentication credentials provided")
        return None
    
    try:
        from services.firebase_service import FirebaseService
        firebase_service = FirebaseService()
        token = credentials.credentials
        decoded_token = firebase_service.verify_token(token)
        print(f"✅ User authenticated: {decoded_token.get('uid')}")
        return decoded_token
    except Exception as e:
        print(f"⚠️ Authentication failed: {e}")
        return None


@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(
    file: UploadFile = File(...),
    job_role: str = Form(...),
    current_user: Optional[dict] = Depends(get_optional_current_user)
):
    """
    Upload and parse a resume
    
    - **file**: PDF or DOCX resume file (max 10MB)
    - **job_role**: Target job role for the interview
    - Returns parsed resume data and resume_id
    """
    try:
        # Debug: Log authentication
        print(f"🔐 Attempting resume upload...")
        print(f"🔐 Current user type: {type(current_user)}")
        print(f"🔐 Current user: {current_user}")
        
        # Extract user ID safely
        user_id = "unknown"
        if current_user and isinstance(current_user, dict):
            user_id = current_user.get("uid") or current_user.get("user_id") or current_user.get("sub") or "unknown"
            print(f"✅ User ID extracted: {user_id}")
        else:
            print(f"⚠️ Warning: current_user is not a valid dict, using 'unknown' as user_id")
        
        # Validate file
        is_valid, error_msg = validate_file(file)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_msg)
        
        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_ext = Path(file.filename).suffix
        filename = f"{user_id}_{timestamp}{file_ext}"
        file_path = UPLOAD_DIR / filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Parse resume
        print(f"📄 Parsing resume: {filename}")
        parsed_data = resume_parser.parse(str(file_path))
        
        # Create resume document with all extracted fields
        resume_data = {
            "user_id": user_id,
            "full_name": parsed_data.get("name", "Unknown"),
            "email": parsed_data.get("email"),
            "phone": parsed_data.get("phone"),
            "skills": parsed_data.get("skills", []),
            "experience": parsed_data.get("experience", []),
            "education": parsed_data.get("education", []),
            "certifications": parsed_data.get("certifications", []),
            "projects": parsed_data.get("projects", []),
            "achievements": parsed_data.get("achievements", []),
            "languages": parsed_data.get("languages", []),
            "publications": parsed_data.get("publications", []),
            "volunteer": parsed_data.get("volunteer", []),
            "summary": parsed_data.get("summary"),
            "job_role": job_role,
            "linkedin": parsed_data.get("linkedin"),
            "github": parsed_data.get("github"),
            "portfolio": parsed_data.get("portfolio"),
            "raw_text": parsed_data.get("raw_text", ""),
            "filename": filename,
            "file_path": str(file_path),
            "file_size": file_path.stat().st_size,
            "uploaded_at": datetime.utcnow()
        }
        
        # Save to database
        resumes_collection = Database.get_collection("resumes")
        result = await resumes_collection.insert_one(resume_data)
        resume_id = str(result.inserted_id)
        
        print(f"✅ Resume saved with ID: {resume_id}")
        
        # Prepare response with all extracted data
        extracted_data = {
            "name": resume_data["full_name"],
            "email": resume_data["email"],
            "phone": resume_data["phone"],
            "skills": resume_data["skills"],
            "experience": resume_data["experience"],  # Full experience array
            "education": resume_data["education"],    # Full education array
            "certifications": resume_data["certifications"],
            "projects": resume_data["projects"],
            "achievements": resume_data["achievements"],
            "languages": resume_data["languages"],
            "publications": resume_data["publications"],
            "volunteer": resume_data["volunteer"],
            "summary": resume_data["summary"],
            "linkedin": resume_data["linkedin"],
            "github": resume_data["github"],
            "portfolio": resume_data["portfolio"]
        }
        
        return ResumeUploadResponse(
            success=True,
            message="Resume uploaded and parsed successfully!",
            resume_id=resume_id,
            extracted_data=extracted_data,
            can_start_interview=len(resume_data["skills"]) > 0
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error uploading resume: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to upload resume: {str(e)}")


@router.get("/{resume_id}")
async def get_resume(
    resume_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get resume by ID"""
    try:
        from bson import ObjectId
        
        resumes_collection = Database.get_collection("resumes")
        resume = await resumes_collection.find_one({"_id": ObjectId(resume_id)})
        
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        # Check if user owns this resume
        if resume.get("user_id") != current_user.get("uid"):
            raise HTTPException(status_code=403, detail="Not authorized to access this resume")
        
        # Convert ObjectId to string
        resume["_id"] = str(resume["_id"])
        
        return resume
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error getting resume: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get resume: {str(e)}")


@router.get("/user/all")
async def get_user_resumes(current_user: dict = Depends(get_current_user)):
    """Get all resumes for current user"""
    try:
        user_id = current_user.get("uid")
        resumes_collection = Database.get_collection("resumes")
        
        cursor = resumes_collection.find({"user_id": user_id}).sort("uploaded_at", -1)
        resumes = await cursor.to_list(length=100)
        
        # Convert ObjectIds to strings
        for resume in resumes:
            resume["_id"] = str(resume["_id"])
        
        return {"resumes": resumes, "count": len(resumes)}
        
    except Exception as e:
        print(f"❌ Error getting user resumes: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get resumes: {str(e)}")


@router.delete("/{resume_id}")
async def delete_resume(
    resume_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a resume"""
    try:
        from bson import ObjectId
        
        resumes_collection = Database.get_collection("resumes")
        resume = await resumes_collection.find_one({"_id": ObjectId(resume_id)})
        
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        # Check if user owns this resume
        if resume.get("user_id") != current_user.get("uid"):
            raise HTTPException(status_code=403, detail="Not authorized to delete this resume")
        
        # Delete file if exists
        file_path = Path(resume.get("file_path", ""))
        if file_path.exists():
            file_path.unlink()
        
        # Delete from database
        await resumes_collection.delete_one({"_id": ObjectId(resume_id)})
        
        return {"success": True, "message": "Resume deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error deleting resume: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete resume: {str(e)}")
