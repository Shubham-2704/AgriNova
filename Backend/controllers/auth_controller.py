from models.auth_model import *
from config.database import database
from config.constants import (
    MAX_PASSWORD_RESET_ATTEMPTS,
    PASSWORD_RESET_BLOCK_DURATION_HOURS,
    PASSWORD_RESET_OTP_EXPIRY_MINUTES
)
from fastapi import Request, Depends
from middlewares.auth_middlewares import protect
from utils.hash import hash_password, verify_password
from utils.auth import generate_token, verify_google_token
from utils.helper import error_response
from datetime import datetime, timezone, timedelta
from bson import ObjectId
from utils.otp import *
from utils.email import *

users = database["users"]
reset_otps = database["password_reset_otps"]
reset_limits = database["password_reset_limits"]

# Register User
async def register_user(data: UserCreate):
    user_exists = await users.find_one({"email": data.email})
    if user_exists:
        return error_response(400, "User with this email already exists")

    now = datetime.now(timezone.utc)
    role = "user"

    new_user = {
        "name": data.name,
        "email": data.email,
        "password": hash_password(data.password),
        "role": role, 
        "createdAt": now,
        "updatedAt": now
    }

    result = await users.insert_one(new_user)
    user_id = str(result.inserted_id)

    return UserResponse(
        id=user_id,
        name=data.name,
        email=data.email,
        token=generate_token(user_id),
        createdAt=now,
        updatedAt=now,
        role=role
    )

# Login User
async def login_user(data: UserLogin):
    user = await users.find_one({"email": data.email})
    if not user:
        return error_response(400, "Invalid email or password")
    
    # 🚫 BLOCK: Google OAuth users must use Google Sign-In
    if user.get("authProvider") == "google":
        return error_response(400, "This account uses Google Sign-In. Please use the 'Sign in with Google' button.")

    if not verify_password(data.password, user["password"]):
        return error_response(400, "Invalid email or password")

    now = datetime.now(timezone.utc)

    # Update last login timestamp if desired
    await users.update_one(
        {"_id": user["_id"]},
        {"$set": {"updatedAt": now}}
    )
    
    role = "user"

    return UserResponse(
        id=str(user["_id"]),
        name=user["name"],
        email=user["email"],
        token=generate_token(str(user["_id"])),
        createdAt=user.get("createdAt", now),
        updatedAt=now,
        role=role
    )

#  Get Profile
async def get_profile(request: Request, user_data = Depends(protect)):
    user_id = request.state.user["id"]

    user = await users.find_one({"_id": ObjectId(user_id)}, {"password": 0})
    if not user:
        return error_response(404, "User not found")

    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "createdAt": user.get("createdAt"),
        "updatedAt": user.get("updatedAt"),
        "role": user.get("role")
    }

# Forgot Password
async def forgot_password(data: ForgotPasswordRequest):
    user = await users.find_one({"email": data.email})
    if not user:
        return error_response(404, "User not found")
    
    # 🚫 BLOCK: Google OAuth users cannot reset password
    if user.get("authProvider") == "google":
        return error_response(400, "This account uses Google Sign-In. Please login with Google.")

    now = datetime.now(timezone.utc)
    block_duration = timedelta(hours=PASSWORD_RESET_BLOCK_DURATION_HOURS)

    # 🛑 BLOCK CHECK (FROM reset_limits)
    limit = await reset_limits.find_one({"userId": user["_id"]})
    if limit and limit.get("blockedUntil"):
        blocked_until = limit["blockedUntil"]
        if blocked_until.tzinfo is None:
            blocked_until = blocked_until.replace(tzinfo=timezone.utc)

        if now < blocked_until:
            minutes_left = int((blocked_until - now).total_seconds() / 60)
            hours_left = minutes_left // 60
            minutes_remainder = minutes_left % 60

            if hours_left > 0:
                return error_response(
                    429,
                    f"Too many attempts. Try again after {hours_left} hours"
                )
            else:
                return error_response(
                    429,
                    f"Too many attempts. Try again after {minutes_remainder} minutes"
                )

    # 🔐 GENERATE OTP
    otp = generate_otp()

    # 🔑 STORE OTP (OTP COLLECTION ONLY)
    await reset_otps.update_one(
        {"userId": user["_id"]},
        {"$set": {
            "userId": user["_id"],
            "email": user["email"],
            "otp": hash_password(otp),
            "expiresAt": now + timedelta(minutes=PASSWORD_RESET_OTP_EXPIRY_MINUTES),
            "createdAt": now
        }},
        upsert=True
    )

    # 📧 SEND EMAIL
    send_otp_email(
        to_email=user["email"],
        user_name=user["name"],
        otp=otp,
        expiry_minutes=PASSWORD_RESET_OTP_EXPIRY_MINUTES
    )

    return {
        "message": "OTP sent to your email",
        "expiresIn": PASSWORD_RESET_OTP_EXPIRY_MINUTES * 60
    }

# Verify OTP
async def verify_reset_otp(data: VerifyOtpRequest):
    block_duration = timedelta(hours=PASSWORD_RESET_BLOCK_DURATION_HOURS)

    record = await reset_otps.find_one({"email": data.email})
    if not record:
        return error_response(400, "OTP expired or invalid")
    
    # 🚫 BLOCK: Double-check Google OAuth users
    user = await users.find_one({"_id": record["userId"]})
    if user and user.get("authProvider") == "google":
        return error_response(400, "This account uses Google Sign-In. Password reset is not available.")

    now = datetime.now(timezone.utc)

    # 🛑 BLOCK CHECK (FROM reset_limits)
    limit = await reset_limits.find_one({"userId": record["userId"]})
    if limit and limit.get("blockedUntil"):
        blocked_until = limit["blockedUntil"]
        if blocked_until.tzinfo is None:
            blocked_until = blocked_until.replace(tzinfo=timezone.utc)

        if now < blocked_until:
            minutes_left = int((blocked_until - now).total_seconds() / 60)
            hours_left = minutes_left // 60
            minutes_remainder = minutes_left % 60

            if hours_left > 0:
                return error_response(429, f"Try again after {hours_left} hours")
            else:
                return error_response(429, f"Try again after {minutes_remainder} minutes")

    # ❌ WRONG OTP
    if not verify_password(data.otp, record["otp"]):
        attempts = (limit.get("attempts", 0) if limit else 0) + 1

        # 🔒 MAX ATTEMPTS REACHED
        if attempts >= MAX_PASSWORD_RESET_ATTEMPTS:
            await reset_limits.update_one(
                {"userId": record["userId"]},
                {"$set": {
                    "attempts": attempts,
                    "blockedUntil": now + block_duration,
                    "updatedAt": now
                }},
                upsert=True
            )

            return error_response(
                400,
                f"Maximum attempts ({MAX_PASSWORD_RESET_ATTEMPTS}) reached. Account blocked for {PASSWORD_RESET_BLOCK_DURATION_HOURS} hours"
            )

        # 🔁 UPDATE ATTEMPTS
        await reset_limits.update_one(
            {"userId": record["userId"]},
            {"$set": {
                "attempts": attempts,
                "updatedAt": now
            }},
            upsert=True
        )

        remaining = MAX_PASSWORD_RESET_ATTEMPTS - attempts
        return error_response(
            400,
            f"Invalid OTP. You have {remaining} attempt(s) remaining"
        )

    # ✅ OTP CORRECT → CLEAR LIMITS
    await reset_limits.delete_one({"userId": record["userId"]})

    return {"message": "OTP verified successfully"}

# Reset Password
async def reset_password(data: ResetPasswordRequest):
    user = await users.find_one({"email": data.email})
    if not user:
        return error_response(404, "User not found")
    
    # 🚫 BLOCK: Google OAuth users cannot reset password
    if user.get("authProvider") == "google":
        return error_response(400, "This account uses Google Sign-In. Password reset is not available.")
    
    record = await reset_otps.find_one({"email": data.email})
    if not record:
        return error_response(400, "Please verify OTP first")
    
    await users.update_one(
        {"email": data.email},
        {"$set": {
            "password": hash_password(data.newPassword),
            "updatedAt": datetime.now(timezone.utc)
        }}
    )

    await reset_otps.delete_one({"_id": record["_id"]})

    return {"message": "Password reset successfully"}

#  Google Auth (handles both login and signup)
async def google_auth(data: GoogleSignupRequest):
    """
    Industry-standard Google OAuth handler
    - Automatically handles both login and signup
    - Uses Google ID token for security
    - Validates email verification
    - Creates or updates user as needed
    """
    try:
        # Verify Google token
        google_user = await verify_google_token(data.token)
        
        if not google_user:
            return error_response(401, "Invalid or expired Google token")
        
        # Ensure email is verified by Google
        if not google_user.get("email_verified", False):
            return error_response(400, "Please use a verified Google account")
        
        email = google_user["email"]
        name = google_user.get("name", "").strip() or email.split('@')[0]
        picture = google_user.get("picture")
        google_id = google_user.get("sub")
        
        now = datetime.now(timezone.utc)
        
        # Check if user exists
        existing_user = await users.find_one({"email": email})
        
        if existing_user:
            # LOGIN: User exists
            
            # � BLOCK: If user has email/password account, don't allow Google login
            if existing_user.get("authProvider") != "google":
                return error_response(400, "An account with this email already exists. Please login with your email and password.")
            
            # Regular Google login - update last login
            await users.update_one(
                {"_id": existing_user["_id"]},
                {"$set": {
                    "updatedAt": now,
                    "lastLogin": now,
                    "profileImageUrl": picture
                }}
            )
            
            return UserResponse(
                id=str(existing_user["_id"]),
                name=existing_user["name"],
                email=existing_user["email"],
                token=generate_token(str(existing_user["_id"])),
                createdAt=existing_user.get("createdAt", now),
                updatedAt=now,
                role=existing_user.get("role", "user")
            )
        else:
            # SIGNUP: Create new user
            new_user = {
                "name": name,
                "email": email,
                "password": None,  # No password for Google auth users
                "profileImageUrl": picture,
                "authProvider": "google",
                "googleId": google_id,
                "role": "user",
                "emailVerified": True,
                "createdAt": now,
                "updatedAt": now,
                "lastLogin": now
            }
            
            result = await users.insert_one(new_user)
            user_id = str(result.inserted_id)
            
            return UserResponse(
                id=user_id,
                name=name,
                email=email,
                token=generate_token(user_id),
                createdAt=now,
                updatedAt=now,
                role="user"
            )
            
    except Exception as e:
        print(f"Google auth error: {e}")
        return error_response(500, "Authentication failed. Please try again.")