from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import numpy as np
from typing import List, Dict
import requests

app = FastAPI(title="AgriNova Crop Recommendation API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models and data
rf_model = joblib.load('crop_model.pkl')
crop_encoder = joblib.load('crop_encoder.pkl')
label_encoders = joblib.load('label_encoders.pkl')
scaler = joblib.load('scaler.pkl')
feature_cols = joblib.load('feature_cols.pkl')
crop_stats = pd.read_csv('crop_stats.csv')
df_original = pd.read_csv('Final_dataset.csv')

# Get unique cities for Gujarat
gujarat_cities = sorted(df_original[df_original['State'] == 'Gujarat']['City'].unique().tolist())
print(f"Loaded {len(gujarat_cities)} cities from Gujarat")
print(f"Cities: {gujarat_cities[:5]}...")

class PredictionInput(BaseModel):
    state: str
    city: str
    season: str
    soil_type: str
    water_availability: str
    area: float

class WeatherData(BaseModel):
    avg_temp: float
    max_temp: float
    min_temp: float
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

@app.get("/")
def read_root():
    return {"message": "AgriNova Crop Recommendation API"}

@app.post("/predict", response_model=List[CropRecommendation])
async def predict_crops(input_data: PredictionInput):
    try:
        # Fetch weather data for the selected city
        weather_data = await fetch_weather_data(input_data.city, input_data.state)
        
        # Encode categorical inputs
        season_encoded = label_encoders['Season'].transform([input_data.season])[0]
        soil_encoded = label_encoders['Soil Type'].transform([input_data.soil_type])[0]
        water_encoded = label_encoders['Water_Availability'].transform([input_data.water_availability])[0]
        
        # Prepare features in the same order as training
        features = np.array([[
            season_encoded,
            soil_encoded,
            water_encoded,
            weather_data.avg_temp,
            weather_data.rainfall,
            weather_data.ph,
            weather_data.cloud_cover,
            weather_data.precipitation,
            weather_data.max_temp,
            weather_data.min_temp,
            weather_data.vap_pressure,
            weather_data.wet_day_freq
        ]])
        
        # Scale features
        features_scaled = scaler.transform(features)
        
        # Get prediction probabilities
        probabilities = rf_model.predict_proba(features_scaled)[0]
        
        # Get top 6 crops (3 initially + 3 more on request)
        top_indices = np.argsort(probabilities)[-6:][::-1]
        
        recommendations = []
        for idx in top_indices:
            crop_name = crop_encoder.inverse_transform([idx])[0]
            crop_data = crop_stats[crop_stats['Crop'] == crop_name].iloc[0]
            
            # Calculate production based on area
            avg_production_per_acre = crop_data['Production'] / crop_data['Area']
            expected_production = avg_production_per_acre * input_data.area
            
            # Calculate profit
            avg_price = crop_data['AVG_Price']
            profit_per_acre = avg_production_per_acre * avg_price
            total_profit = expected_production * avg_price
            
            recommendations.append(CropRecommendation(
                crop=crop_name,
                suitability=float(probabilities[idx] * 100),
                profit_per_acre=float(profit_per_acre),
                total_profit=float(total_profit),
                expected_production=float(avg_production_per_acre),
                total_production=float(expected_production),
                avg_price=float(avg_price)
            ))
        
        return recommendations
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/options")
def get_options():
    return {
        "states": ["Gujarat"],
        "cities": gujarat_cities,
        "seasons": label_encoders['Season'].classes_.tolist(),
        "soil_types": label_encoders['Soil Type'].classes_.tolist(),
        "water_availability": ["High", "Medium", "Low"]
    }

async def fetch_weather_data(city: str, state: str) -> WeatherData:
    """
    Fetch weather data from OpenWeatherMap API
    """
    api_key = '7c6f9435eddc2f9063fe9233bb6a273a'
    url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric'

    
    try:
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            weather_data = response.json()
            
            # Extract weather data
            main = weather_data.get('main', {})
            clouds = weather_data.get('clouds', {})
            rain = weather_data.get('rain', {})
            
            avg_temp = main.get('temp', 27.0)
            max_temp = main.get('temp_max', 30.0)
            min_temp = main.get('temp_min', 22.0)
            humidity = main.get('humidity', 60.0)
            pressure = main.get('pressure', 1013.0)
            cloud_cover = clouds.get('all', 20.0)
            
            # Get precipitation (rain in last 1 hour or 3 hours)
            precipitation = rain.get('1h', rain.get('3h', 0.0))
            
            # Calculate vapor pressure from humidity and temperature
            # Using Magnus formula
            vap_pressure = (humidity / 100) * 6.11 * (10 ** ((7.5 * avg_temp) / (237.3 + avg_temp)))
            
            # Estimate rainfall and wet day frequency
            rainfall = precipitation * 30  # Monthly estimate
            wet_day_freq = min(precipitation * 2, 30) if precipitation > 0 else 4
            
            # Default pH for Gujarat soil
            ph = 7.0
            
            return WeatherData(
                avg_temp=round(avg_temp, 2),
                max_temp=round(max_temp, 2),
                min_temp=round(min_temp, 2),
                rainfall=round(rainfall, 2),
                precipitation=round(precipitation, 2),
                vap_pressure=round(vap_pressure, 2),
                wet_day_freq=round(wet_day_freq, 2),
                ph=ph,
                cloud_cover=round(cloud_cover, 2)
            )
    except Exception as e:
        print(f"Weather API Error: {e}")
    
    # Fallback to historical averages from dataset
    city_data = df_original[
        (df_original['City'] == city) & 
        (df_original['State'] == state)
    ]
    
    if not city_data.empty:
        return WeatherData(
            avg_temp=round(city_data['avgTemp'].mean(), 2),
            max_temp=round(city_data['maxTemp'].mean(), 2),
            min_temp=round(city_data['minTemp'].mean(), 2),
            rainfall=round(city_data['Rainfall'].mean(), 2),
            precipitation=round(city_data['Precipitation'].mean(), 2),
            vap_pressure=round(city_data['vapPressure'].mean(), 2),
            wet_day_freq=round(city_data['Wet Day Freq'].mean(), 2),
            ph=round(city_data['pH'].mean(), 2),
            cloud_cover=round(city_data['Cloud Cover'].mean(), 2)
        )
    
    # Ultimate fallback
    return WeatherData(
        avg_temp=27.0,
        max_temp=30.0,
        min_temp=22.0,
        rainfall=200.0,
        precipitation=20.0,
        vap_pressure=5.0,
        wet_day_freq=4.0,
        ph=7.0,
        cloud_cover=20.0
    )

@app.get("/weather/{state}/{city}")
async def get_weather(state: str, city: str):
    """Get weather data for a specific city"""
    weather_data = await fetch_weather_data(city, state)
    return weather_data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
