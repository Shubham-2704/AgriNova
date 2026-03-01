from datetime import datetime
import requests
import os

FRONTEND_URL = os.getenv("FRONTEND_URL")
RESEND_API_URL = os.getenv("RESEND_API_URL")
RESEND_API_KEY = os.getenv("RESEND_API_KEY")
EMAIL_FROM = os.getenv("EMAIL_FROM")


# 🔹 Core Email Sender (Resend API)
def send_email(to_email: str, subject: str, html_content: str):
    if not all([RESEND_API_URL, RESEND_API_KEY, EMAIL_FROM]):
        print("Error: Missing email configuration environment variables")
        return False

    try:
        response = requests.post(
            RESEND_API_URL, 
            headers={
                "Authorization": f"Bearer {RESEND_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "from": EMAIL_FROM,
                "to": [to_email],
                "subject": subject,
                "html": html_content,
            },
            timeout=30 
        )

        print("STATUS:", response.status_code)
        print("RESPONSE:", response.text)

        if response.status_code >= 400:
            print(f"Email failed: {response.status_code} - {response.text}")
            return False

        return True
        
    except requests.exceptions.RequestException as e:
        print(f"Email sending error: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False


# 🔹 OTP Email
def send_otp_email(
    to_email: str,
    user_name: str,
    otp: str,
    expiry_minutes: int = 10
):
    try:
        template_path = "templates/otp_email.html"
        if not os.path.exists(template_path):
            print(f"Template file not found: {template_path}")
            return False
            
        with open(template_path, "r", encoding="utf-8") as file:
            html_template = file.read()

        html_content = (
            html_template
            .replace("{{user_name}}", user_name)
            .replace("{{otp_code}}", otp)
            .replace("{{otp_expiry_minutes}}", str(expiry_minutes))
            .replace("{{current_year}}", str(datetime.now().year))
        )

        return send_email(
            to_email,
            "AgriNova - Password Reset OTP",
            html_content
        )

    except FileNotFoundError:
        print(f"OTP email template not found at templates/otp_email.html")
        return False
    except Exception as e:
        print(f"Error sending OTP email: {e}")
        return False



# 🔹 Contact Form Email (Admin Notification)
def send_contact_admin_email(
    name: str,
    email: str,
    phone: str,
    message: str
):
    """
    Send contact form submission notification to admin
    """
    try:
        template_path = "templates/contact_admin_email.html"
        if not os.path.exists(template_path):
            print(f"Template file not found: {template_path}")
            return False
            
        with open(template_path, "r", encoding="utf-8") as file:
            html_template = file.read()

        html_content = (
            html_template
            .replace("{{user_name}}", name)
            .replace("{{user_email}}", email)
            .replace("{{user_phone}}", phone)
            .replace("{{user_message}}", message)
            .replace("{{submission_date}}", datetime.now().strftime("%B %d, %Y at %I:%M %p"))
            .replace("{{current_year}}", str(datetime.now().year))
        )
        
        # Get admin email from environment
        admin_email = os.getenv("ADMIN_EMAIL", "support@agrinova.com")
        
        return send_email(
            admin_email,
            f"New Contact Form: {name}",
            html_content
        )
        
    except Exception as e:
        print(f"Error sending admin contact email: {e}")
        return False


# 🔹 Contact Form Email (User Confirmation)
def send_contact_user_email(
    name: str,
    email: str,
    message: str
):
    """
    Send thank you email to user who submitted contact form
    """
    try:
        template_path = "templates/contact_user_email.html"
        if not os.path.exists(template_path):
            print(f"Template file not found: {template_path}")
            return False
            
        with open(template_path, "r", encoding="utf-8") as file:
            html_template = file.read()

        # Truncate message if too long for email
        display_message = message if len(message) <= 200 else message[:200] + "..."

        html_content = (
            html_template
            .replace("{{user_name}}", name)
            .replace("{{user_message}}", display_message)
            .replace("{{current_year}}", str(datetime.now().year))
        )
        
        return send_email(
            email,
            "Thank You for Contacting AgriNova",
            html_content
        )
        
    except Exception as e:
        print(f"Error sending user contact email: {e}")
        return False
