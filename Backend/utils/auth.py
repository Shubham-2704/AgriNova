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
    Verify Google OAuth access token using userinfo endpoint
    Works with useGoogleLogin hook from @react-oauth/google
    """
    try:
        print(f"Verifying Google access token...")
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            # Use Authorization header with Bearer token
            headers = {
                "Authorization": f"Bearer {token}",
                "Accept": "application/json"
            }
            
            # Try Google's userinfo v2 endpoint
            response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers=headers
            )
            
            if response.status_code == 200:
                user_info = response.json()
                
                # Check if we have email (required field)
                email = user_info.get("email")
                if email:
                    result = {
                        "email": email,
                        "name": user_info.get("name", email.split('@')[0]),
                        "picture": user_info.get("picture"),
                        "sub": user_info.get("id"),
                        "email_verified": user_info.get("verified_email", True)
                    }
                    return result
                else:
                    return None
            else:
                return None
            
    except Exception as e:
        import traceback
        traceback.print_exc()
        return None