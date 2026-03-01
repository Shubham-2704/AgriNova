import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import httpx
from typing import Optional, Dict

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")


def generate_token(user_id: str):
    payload = {
        "id": user_id,
        "exp": datetime.now() + timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str):
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

async def verify_google_token(token: str) -> Optional[Dict]:
    """
    Verify Google OAuth ID token (industry standard)
    Uses Google's tokeninfo endpoint for validation
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Verify ID token using Google's tokeninfo endpoint
            response = await client.get(
                f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
            )
            
            if response.status_code != 200:
                print(f"Token verification failed: {response.status_code}")
                return None
            
            token_info = response.json()
            
            # Verify the token is for our app
            if GOOGLE_CLIENT_ID and token_info.get("aud") != GOOGLE_CLIENT_ID:
                print("Token audience mismatch")
                return None
            
            # Verify token is not expired
            exp = token_info.get("exp")
            if exp and int(exp) < datetime.now().timestamp():
                print("Token expired")
                return None
            
            # Return user info
            return {
                "email": token_info.get("email"),
                "name": token_info.get("name"),
                "picture": token_info.get("picture"),
                "sub": token_info.get("sub"),  # Google user ID
                "email_verified": token_info.get("email_verified") == "true"
            }
            
    except httpx.TimeoutException:
        print("Google API timeout")
        return None
    except Exception as e:
        print(f"Google token verification error: {e}")
        return None