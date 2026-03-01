from fastapi import APIRouter
from controllers.contact_controller import submit_contact

router = APIRouter(prefix="/api/contact", tags=["Contact"])

router.post("/submit")(submit_contact)
