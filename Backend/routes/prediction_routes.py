from fastapi import APIRouter
from controllers.prediction_controller import *
from models.prediction_model import *

router = APIRouter(prefix="/api", tags=["Predictions"])

router.get("/options")(get_options)
router.post("/predict", response_model=List[CropRecommendation])(predict_crops)
router.get("/weather/{state}/{city}")(get_weather)
