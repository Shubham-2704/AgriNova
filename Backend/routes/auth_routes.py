from fastapi import APIRouter
from controllers.auth_controller import *

router = APIRouter(prefix="/api/auth", tags=["Auth"])

router.post("/register")(register_user)
router.post("/login")(login_user)
router.get("/profile")(get_profile)
router.post("/forgot-password")(forgot_password)
router.post("/verify-reset-otp")(verify_reset_otp)
router.post("/reset-password")(reset_password)
router.post("/google")(google_auth)