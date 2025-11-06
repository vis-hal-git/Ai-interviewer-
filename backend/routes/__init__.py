"""
Routes package - API endpoint handlers
"""
from .auth import router as auth_router
from .candidates import router as candidates_router
from .interviews import router as interviews_router
from .recruiters import router as recruiters_router
from .resumes import router as resumes_router

__all__ = [
    "auth_router",
    "candidates_router",
    "interviews_router",
    "recruiters_router",
    "resumes_router",
]
