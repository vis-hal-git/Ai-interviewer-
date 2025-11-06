"""
Authentication middleware for protecting routes
"""
from fastapi import Request, HTTPException, status, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from services.firebase_service import FirebaseService
from typing import Optional


security = HTTPBearer()
firebase_service = FirebaseService()


async def verify_firebase_token(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> dict:
    """
    Verify Firebase ID token from Authorization header
    
    Args:
        credentials: HTTP Bearer credentials
        
    Returns:
        Decoded token with user info (uid, email, etc.)
        
    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        token = credentials.credentials
        decoded_token = firebase_service.verify_token(token)
        return decoded_token
    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid authentication credentials: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials"
        )


async def get_current_user_uid(
    token_data: dict = Depends(verify_firebase_token)
) -> str:
    """
    Extract user UID from verified token
    
    Args:
        token_data: Decoded Firebase token
        
    Returns:
        User's Firebase UID
    """
    uid = token_data.get("uid")
    if not uid:
        raise HTTPException(status_code=401, detail="Invalid token: missing UID")
    return uid


async def verify_token(credentials: HTTPAuthorizationCredentials) -> dict:
    """
    Verify JWT token from Authorization header
    
    Args:
        credentials: Bearer token credentials
        
    Returns:
        Decoded token payload with user info
        
    Raises:
        HTTPException: If token is invalid or expired
    """
    # TODO: Implement JWT token verification
    # 1. Extract token from credentials
    # 2. Verify with Firebase Admin SDK
    # 3. Return user info from token
    pass


async def get_current_user(
    token_data: dict = Depends(verify_firebase_token)
) -> dict:
    """
    Get current authenticated user from token
    
    Args:
        token_data: Decoded Firebase token (automatically injected)
        
    Returns:
        User information dictionary with uid, email, etc.
        
    Raises:
        HTTPException: If not authenticated
    """
    if not token_data:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )
    
    # Return the decoded token which contains user info
    return token_data


async def require_role(required_role: str):
    """
    Dependency to require specific user role
    
    Args:
        required_role: Required role ("candidate" or "recruiter")
        
    Returns:
        Function that checks user role
    """
    # TODO: Implement role checking
    pass
