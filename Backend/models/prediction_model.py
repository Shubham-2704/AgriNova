from pydantic import BaseModel, Field
from typing import Optional

class PredictionInput(BaseModel):
    state: str
    city: str
    season: str
    soil_type: str
    water_availability: str
    area: float = Field(gt=0, description="Land area in acres")

class WeatherData(BaseModel):
    avg_temp: float
    rainfall: float
    precipitation: float
    vap_pressure: float
    wet_day_freq: float
    ph: float
    cloud_cover: float

class CropRecommendation(BaseModel):
    crop: str
    suitability: float
    profit_per_acre: float
    total_profit: float
    expected_production: float
    total_production: float
    avg_price: float
