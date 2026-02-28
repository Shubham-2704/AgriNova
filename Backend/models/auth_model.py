from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, timezone 

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    token: str
    createdAt: datetime
    updatedAt: datetime
    role: str = "user"

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    profileImageUrl: Optional[str] = None

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class VerifyOtpRequest(BaseModel):
    email: EmailStr
    otp: str

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    newPassword: str

class GoogleSignupRequest(BaseModel):
    token: str  # Google OAuth token

class GoogleUserInfo(BaseModel):
    email: EmailStr
    name: str
    picture: Optional[str] = None
    sub: str  # Google user ID