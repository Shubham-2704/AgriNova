from pydantic import BaseModel, EmailStr, validator
from config.constants import (
    CONTACT_NAME_MIN_LENGTH,
    CONTACT_NAME_MAX_LENGTH,
    CONTACT_PHONE_LENGTH,
    CONTACT_MESSAGE_MIN_LENGTH,
    CONTACT_MESSAGE_MAX_LENGTH,
    CONTACT_ERROR_NAME_TOO_SHORT,
    CONTACT_ERROR_NAME_TOO_LONG,
    CONTACT_ERROR_PHONE_INVALID,
    CONTACT_ERROR_PHONE_DIGITS_ONLY,
    CONTACT_ERROR_MESSAGE_TOO_SHORT,
    CONTACT_ERROR_MESSAGE_TOO_LONG
)
import re

class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    message: str

    @validator('name')
    def validate_name(cls, v):
        if len(v.strip()) < CONTACT_NAME_MIN_LENGTH:
            raise ValueError(CONTACT_ERROR_NAME_TOO_SHORT)
        if len(v.strip()) > CONTACT_NAME_MAX_LENGTH:
            raise ValueError(CONTACT_ERROR_NAME_TOO_LONG)
        return v.strip()

    @validator('phone')
    def validate_phone(cls, v):
        # Remove any spaces or special characters
        phone_clean = re.sub(r'[^0-9]', '', v)
        
        # Check if exactly 10 digits
        if len(phone_clean) != CONTACT_PHONE_LENGTH:
            raise ValueError(CONTACT_ERROR_PHONE_INVALID)
        
        # Check if all digits
        if not phone_clean.isdigit():
            raise ValueError(CONTACT_ERROR_PHONE_DIGITS_ONLY)
        
        return phone_clean

    @validator('message')
    def validate_message(cls, v):
        if len(v.strip()) < CONTACT_MESSAGE_MIN_LENGTH:
            raise ValueError(CONTACT_ERROR_MESSAGE_TOO_SHORT)
        if len(v.strip()) > CONTACT_MESSAGE_MAX_LENGTH:
            raise ValueError(CONTACT_ERROR_MESSAGE_TOO_LONG)
        return v.strip()
