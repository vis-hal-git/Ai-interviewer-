"""
Interview routes - Interview management and WebSocket handler
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Depends
from pydantic import BaseModel
from models.interview import InterviewCreate, InterviewSession, InterviewResponse, InterviewStatus
from models.response import SuccessResponse
from utils.database import Database
from services.groq_service import groq_service
from middleware.auth_middleware import get_current_user
from bson import ObjectId
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/interviews", tags=["Interviews"])


@router.get("/user/stats")
async def get_user_interview_stats(current_user: dict = Depends(get_current_user)):
    """
    Get interview statistics for the current user's dashboard
    """
    try:
        db = Database.db
        user_id = current_user.get("uid") or current_user.get("id")
        
        # Get all interviews for this user
        interviews = await db.interviews.find({"user_id": user_id}).to_list(length=None)
        
        # Calculate statistics
        total_interviews = len(interviews)
        completed_interviews = len([i for i in interviews if i.get("status") == "completed"])
        pending_interviews = len([i for i in interviews if i.get("status") in ["pending", "in_progress"]])
        
        # Calculate average score (if scores exist)
        scores = []
        for interview in interviews:
            if interview.get("status") == "completed" and interview.get("overall_score"):
                scores.append(interview.get("overall_score"))
        
        avg_score = sum(scores) / len(scores) if scores else 0
        
        # Count unique skills assessed
        all_skills = set()
        for interview in interviews:
            questions = interview.get("questions", [])
            for q in questions:
                if q.get("category"):
                    all_skills.add(q.get("category"))
        
        # Get recent interviews (last 5)
        recent_interviews = sorted(
            interviews,
            key=lambda x: x.get("created_at", datetime.min),
            reverse=True
        )[:5]
        
        # Format recent interviews for frontend
        formatted_recent = []
        for interview in recent_interviews:
            formatted_recent.append({
                "id": str(interview.get("_id")),
                "session_id": interview.get("session_id"),
                "position": interview.get("job_role", "N/A"),
                "date": interview.get("created_at").isoformat() if interview.get("created_at") else None,
                "status": interview.get("status", "pending"),
                "score": interview.get("overall_score"),
                "duration": interview.get("duration"),
                "responses_count": len(interview.get("responses", []))
            })
        
        return {
            "success": True,
            "data": {
                "stats": {
                    "total_interviews": total_interviews,
                    "completed_interviews": completed_interviews,
                    "pending_interviews": pending_interviews,
                    "average_score": round(avg_score, 1),
                    "skills_assessed": len(all_skills)
                },
                "recent_interviews": formatted_recent
            }
        }
        
    except Exception as e:
        print(f"❌ Error fetching user stats: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch statistics: {str(e)}")


@router.post("/start", response_model=SuccessResponse)
async def start_interview(interview_data: InterviewCreate, current_user: dict = Depends(get_current_user)):
    """
    Initialize a new interview session and generate questions
    """
    try:
        db = Database.db
        
        # Get user's resume data by resume ID
        print(f"🔍 Looking for resume: {interview_data.candidate_id}")
        resume = await db.resumes.find_one({"_id": ObjectId(interview_data.candidate_id)})
        
        if not resume:
            print(f"❌ Resume not found: {interview_data.candidate_id}")
            raise HTTPException(status_code=404, detail="Resume not found. Please upload a resume first.")
        
        # Verify resume belongs to current user
        user_id = current_user.get("uid") or current_user.get("id")
        if resume.get("user_id") != user_id:
            print(f"❌ Resume owner mismatch: {resume.get('user_id')} != {user_id}")
            raise HTTPException(status_code=403, detail="Access denied to this resume")
        
        print(f"✅ Resume found for user: {user_id}")
        
        # Generate session ID
        session_id = str(uuid.uuid4())
        
        # Generate interview questions using Groq
        print(f"🤖 Generating questions for {interview_data.job_role}...")
        questions = groq_service.generate_questions(
            resume_data=resume,
            job_role=interview_data.job_role,
            num_questions=10
        )
        
        # Create interview session
        interview_session = {
            "session_id": session_id,
            "candidate_id": interview_data.candidate_id,
            "user_id": user_id,
            "job_role": interview_data.job_role,
            "status": InterviewStatus.PENDING.value,
            "questions": questions,
            "responses": [],
            "conversation_history": [],
            "face_monitoring_logs": [],
            "cheating_incidents": [],
            "current_question_index": 0,
            "resume_id": str(resume["_id"]),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Save to database
        result = await db.interviews.insert_one(interview_session)
        
        print(f"✅ Interview session created: {session_id}")
        print(f"📝 Generated {len(questions)} questions")
        
        return {
            "success": True,
            "message": "Interview session created successfully",
            "data": {
                "session_id": session_id,
                "questions_count": len(questions),
                "job_role": interview_data.job_role,
                "status": "pending"
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error starting interview: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to start interview: {str(e)}")


@router.get("/{session_id}")
async def get_interview(session_id: str, current_user: dict = Depends(get_current_user)):
    """
    Get interview details by session ID
    """
    try:
        db = Database.db
        
        # Find interview session
        interview = await db.interviews.find_one({"session_id": session_id})
        
        if not interview:
            raise HTTPException(status_code=404, detail="Interview session not found")
        
        # Check if user owns this interview
        user_id = current_user.get("uid") or current_user.get("id")
        if interview["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Convert ObjectId to string
        interview["_id"] = str(interview["_id"])
        if "resume_id" in interview:
            interview["resume_id"] = str(interview["resume_id"])
        
        return {
            "success": True,
            "data": interview
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error fetching interview: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch interview: {str(e)}")


class StatusUpdate(BaseModel):
    """Status update model"""
    status: str


@router.put("/{session_id}/status")
async def update_interview_status(
    session_id: str, 
    status_data: StatusUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    Update interview status (e.g., from 'pending' to 'in_progress')
    """
    status = status_data.status
    try:
        db = Database.db
        
        # Find interview
        interview = await db.interviews.find_one({"session_id": session_id})
        
        if not interview:
            raise HTTPException(status_code=404, detail="Interview session not found")
        
        user_id = current_user.get("uid") or current_user.get("id")
        if interview["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Update status
        update_data = {
            "status": status,
            "updated_at": datetime.utcnow()
        }
        
        # If starting interview, set start_time
        if status == "in_progress" and not interview.get("start_time"):
            update_data["start_time"] = datetime.utcnow()
        
        # If completing interview, set end_time
        if status == "completed" and not interview.get("end_time"):
            update_data["end_time"] = datetime.utcnow()
            if interview.get("start_time"):
                duration = (update_data["end_time"] - interview["start_time"]).total_seconds()
                update_data["duration"] = int(duration)
        
        await db.interviews.update_one(
            {"session_id": session_id},
            {"$set": update_data}
        )
        
        return {
            "success": True,
            "message": f"Interview status updated to {status}",
            "data": {"session_id": session_id, "status": status}
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error updating interview status: {e}")
        raise HTTPException(status_code=500, detail=str(e))


class AnswerSubmission(BaseModel):
    """Answer submission model"""
    question_id: str
    question: str
    answer: str
    time_taken: int


@router.post("/{session_id}/submit-answer")
async def submit_answer(
    session_id: str,
    answer_data: AnswerSubmission,
    current_user: dict = Depends(get_current_user)
):
    """
    Submit an answer to a question during the interview
    """
    try:
        db = Database.db
        
        # Find interview
        interview = await db.interviews.find_one({"session_id": session_id})
        
        if not interview:
            raise HTTPException(status_code=404, detail="Interview session not found")
        
        user_id = current_user.get("uid") or current_user.get("id")
        if interview["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Create response object
        response_obj = {
            "question_id": answer_data.question_id,
            "question": answer_data.question,
            "answer": answer_data.answer,
            "time_taken": answer_data.time_taken,
            "timestamp": datetime.utcnow()
        }
        
        # Add to responses array
        await db.interviews.update_one(
            {"session_id": session_id},
            {
                "$push": {"responses": response_obj},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        print(f"✅ Answer submitted for session {session_id}")
        
        return {
            "success": True,
            "message": "Answer submitted successfully",
            "data": response_obj
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error submitting answer: {e}")
        raise HTTPException(status_code=500, detail=str(e))


class FollowUpRequest(BaseModel):
    """Follow-up question request model"""
    question_id: str
    answer: str


@router.post("/{session_id}/follow-up")
async def generate_follow_up(
    session_id: str,
    follow_up_data: FollowUpRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Generate a follow-up question based on the candidate's answer
    """
    try:
        db = Database.db
        
        # Find interview
        interview = await db.interviews.find_one({"session_id": session_id})
        
        if not interview:
            raise HTTPException(status_code=404, detail="Interview session not found")
        
        user_id = current_user.get("uid") or current_user.get("id")
        if interview["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Find the original question
        original_question = None
        for q in interview.get("questions", []):
            q_id = q.get("_id") or q.get("id")
            if str(q_id) == follow_up_data.question_id:
                original_question = q.get("question")
                break
        
        if not original_question:
            # Try matching by index
            try:
                idx = int(follow_up_data.question_id)
                if 0 <= idx < len(interview.get("questions", [])):
                    original_question = interview["questions"][idx].get("question")
            except (ValueError, IndexError):
                pass
        
        # Generate follow-up using Groq
        print(f"🤖 Generating follow-up question...")
        follow_up_question = groq_service.generate_follow_up_question(
            original_question=original_question or "the previous question",
            candidate_answer=follow_up_data.answer,
            job_role=interview.get("job_role", "")
        )
        
        # Log follow-up to conversation history
        await db.interviews.update_one(
            {"session_id": session_id},
            {
                "$push": {
                    "conversation_history": {
                        "type": "follow_up",
                        "question": follow_up_question,
                        "timestamp": datetime.utcnow()
                    }
                },
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        print(f"✅ Follow-up question generated")
        
        return {
            "success": True,
            "follow_up": follow_up_question
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error generating follow-up: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{session_id}/complete")
async def complete_interview(
    session_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Mark interview as completed and trigger report generation
    """
    try:
        db = Database.db
        
        # Find interview
        interview = await db.interviews.find_one({"session_id": session_id})
        
        if not interview:
            raise HTTPException(status_code=404, detail="Interview session not found")
        
        user_id = current_user.get("uid") or current_user.get("id")
        if interview["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Calculate duration if start_time exists
        end_time = datetime.utcnow()
        duration = None
        if interview.get("start_time"):
            duration = int((end_time - interview["start_time"]).total_seconds())
        
        # Update interview status
        await db.interviews.update_one(
            {"session_id": session_id},
            {
                "$set": {
                    "status": InterviewStatus.COMPLETED.value,
                    "end_time": end_time,
                    "duration": duration,
                    "updated_at": end_time
                }
            }
        )
        
        print(f"✅ Interview {session_id} marked as completed")
        
        # TODO: Trigger async report generation here
        # This can be done with background tasks in production
        
        return {
            "success": True,
            "message": "Interview completed successfully",
            "data": {
                "session_id": session_id,
                "duration": duration,
                "responses_count": len(interview.get("responses", []))
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error completing interview: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.websocket("/ws/{session_id}")
async def websocket_interview(websocket: WebSocket, session_id: str):
    """
    WebSocket endpoint for real-time interview communication
    Handles video frames, audio, and bidirectional messaging
    """
    await websocket.accept()
    
    try:
        # TODO: Implement WebSocket interview logic
        # - Receive video frames for face detection
        # - Receive audio for transcription
        # - Send questions to candidate
        # - Send warnings for cheating detection
        # - Handle interview flow
        
        while True:
            data = await websocket.receive_json()
            
            # Process different message types
            message_type = data.get("type")
            
            if message_type == "video_frame":
                # Process video frame for face detection
                pass
            
            elif message_type == "audio_response":
                # Process audio response
                pass
            
            elif message_type == "end_interview":
                # End interview and generate report
                break
                
    except WebSocketDisconnect:
        print(f"WebSocket disconnected for session: {session_id}")
    except Exception as e:
        await websocket.send_json({
            "type": "error",
            "message": str(e)
        })
