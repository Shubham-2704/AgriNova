from models.contact_model import ContactRequest
from config.database import database
from config.constants import CONTACT_RATE_LIMIT_DAYS, CONTACT_ERROR_RATE_LIMIT
from utils.email import send_contact_admin_email, send_contact_user_email
from utils.helper import error_response
from datetime import datetime, timezone, timedelta

contacts = database["contacts"]

async def submit_contact(data: ContactRequest):
    """
    Handle contact form submission
    - Validate input
    - Check rate limiting (configurable days between submissions)
    - Store in database
    - Send email to admin
    - Send thank you email to user
    """
    now = datetime.now(timezone.utc)
    
    # 🛑 RATE LIMITING: Check if email submitted in last X days
    rate_limit_period = now - timedelta(days=CONTACT_RATE_LIMIT_DAYS)
    
    recent_submission = await contacts.find_one({
        "email": data.email.lower(),
        "createdAt": {"$gte": rate_limit_period}
    })
    
    if recent_submission:
        # Calculate when they can submit again
        submission_time = recent_submission["createdAt"]
        
        # Ensure timezone awareness
        if submission_time.tzinfo is None:
            submission_time = submission_time.replace(tzinfo=timezone.utc)
        
        next_allowed = submission_time + timedelta(days=CONTACT_RATE_LIMIT_DAYS)
        days_remaining = (next_allowed - now).days + 1
        
        return error_response(
            429,
            CONTACT_ERROR_RATE_LIMIT.format(days=days_remaining)
        )
    
    # Store in database
    contact_data = {
        "name": data.name,
        "email": data.email.lower(),
        "phone": data.phone,
        "message": data.message,
        "status": "new",
        "createdAt": now
    }
    
    await contacts.insert_one(contact_data)
    
    # Send emails (don't fail request if emails fail)
    try:
        # 1. Send to admin
        send_contact_admin_email(
            name=data.name,
            email=data.email,
            phone=data.phone,
            message=data.message
        )
        
        # 2. Send thank you to user
        send_contact_user_email(
            name=data.name,
            email=data.email,
            message=data.message
        )
    except Exception as e:
        print(f"Failed to send contact emails: {e}")
        # Don't fail the request if email fails
    
    return {
        "message": "Thank you for contacting us! We'll get back to you soon."
    }
