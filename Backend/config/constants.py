# Password Reset OTP Settings
MAX_PASSWORD_RESET_ATTEMPTS = 3
PASSWORD_RESET_BLOCK_DURATION_HOURS = 1
PASSWORD_RESET_OTP_EXPIRY_MINUTES = 5

# Contact Form Settings
CONTACT_RATE_LIMIT_DAYS = 7
CONTACT_NAME_MIN_LENGTH = 2
CONTACT_NAME_MAX_LENGTH = 100
CONTACT_PHONE_LENGTH = 10
CONTACT_MESSAGE_MIN_LENGTH = 10
CONTACT_MESSAGE_MAX_LENGTH = 1000

# Contact Form Error Messages
CONTACT_ERROR_NAME_TOO_SHORT = f"Name must be at least {CONTACT_NAME_MIN_LENGTH} characters"
CONTACT_ERROR_NAME_TOO_LONG = f"Name must not exceed {CONTACT_NAME_MAX_LENGTH} characters"
CONTACT_ERROR_PHONE_INVALID = f"Phone number must be exactly {CONTACT_PHONE_LENGTH} digits"
CONTACT_ERROR_PHONE_DIGITS_ONLY = "Phone number must contain only digits"
CONTACT_ERROR_MESSAGE_TOO_SHORT = f"Message must be at least {CONTACT_MESSAGE_MIN_LENGTH} characters"
CONTACT_ERROR_MESSAGE_TOO_LONG = f"Message must not exceed {CONTACT_MESSAGE_MAX_LENGTH} characters"
CONTACT_ERROR_RATE_LIMIT = "You've already submitted a query recently. Please wait {days} more day(s) before submitting again."
