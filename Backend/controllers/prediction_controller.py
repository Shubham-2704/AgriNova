#!/usr/bin/env python3
"""
AgriNova Crop Prediction Controller

This module handles crop recommendation predictions using a simple Random Forest model.
It provides realistic profit calculations based on Gujarat agricultural data.

Key Features:
- Single model approach for simplicity and accuracy
- Realistic production values (quintals converted to kg)
- Market-based pricing (₹ per quintal converted to ₹ per kg)
- Cotton boost for suitable conditions in Gujarat
- Indian currency formatting (lakhs/crores)

Database Structure:
- Area: in Acres
- Production: in Quintals (total production for that area)  
- AVG_Price: in ₹ per Quintal
"""

from fastapi import HTTPException
from models.prediction_model import PredictionInput, CropRecommendation, WeatherData
from typing import List
import pandas as pd
import joblib
import numpy as np
import requests
import os

# ============================================================================
# MODEL INITIALIZATION
# ============================================================================

def check_models_exist():
    """Check if all required model files exist"""
    required_files = [
        'trained_models/crop_model.pkl',
        'trained_models/crop_encoder.pkl', 
        'trained_models/label_encoders.pkl',
        'trained_models/scaler.pkl',
        'trained_models/feature_cols.pkl',
        'trained_models/feature_selector.pkl',  # Added for high-accuracy model
        'data/crop_stats.csv',
        'data/Final_dataset.csv',
        'data/gujarat_crop_calendar.json'  # Added for season filtering
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    if missing_files:
        print(f"❌ Missing required files: {missing_files}")
        print("🔧 Please run: python train_simple_model.py")
        return False
    return True

# Initialize models only if they exist
models_loaded = False
gujarat_crop_calendar = {}

if check_models_exist():
    try:
        # Load all model components
        rf_model = joblib.load('trained_models/crop_model.pkl')
        crop_encoder = joblib.load('trained_models/crop_encoder.pkl')
        label_encoders = joblib.load('trained_models/label_encoders.pkl')
        scaler = joblib.load('trained_models/scaler.pkl')
        selected_features = joblib.load('trained_models/feature_cols.pkl')  # These are now selected features
        feature_selector = joblib.load('trained_models/feature_selector.pkl')
        
        # Load data
        crop_stats = pd.read_csv('data/crop_stats.csv')
        df_original = pd.read_csv('data/Final_dataset.csv')
        
        # Load Gujarat crop calendar for season filtering
        import json
        with open('data/gujarat_crop_calendar.json', 'r') as f:
            gujarat_crop_calendar = json.load(f)
        
        # Get unique cities for Gujarat
        gujarat_cities = sorted(df_original[df_original['State'] == 'Gujarat']['City'].unique().tolist())
        models_loaded = True
        print("✅ High-accuracy crop model with season filtering loaded successfully")
        
    except Exception as e:
        print(f"❌ Error loading models: {e}")
        models_loaded = False
else:
    print("❌ Models not found. Please train models first.")
    models_loaded = False

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def format_indian_currency(amount):
    """Format amount in Indian currency format (lakhs/crores)"""
    if amount >= 10000000:  # 1 crore
        return f"₹{amount/10000000:.2f} Cr"
    elif amount >= 100000:  # 1 lakh
        return f"₹{amount/100000:.2f} L"
    elif amount >= 1000:  # 1 thousand
        return f"₹{amount/1000:.2f} K"
    else:
        return f"₹{amount:.2f}"

def is_season_appropriate_crop(crop_name, season):
    """
    Check if a crop is appropriate for the given season based on Gujarat crop calendar
    
    Args:
        crop_name: Name of the crop
        season: Season (Kharif, Rabi, Summer, Whole Year)
        
    Returns:
        bool: True if crop is appropriate for the season
    """
    if not gujarat_crop_calendar:
        return True  # If calendar not loaded, allow all crops
    
    # Check if crop is in the specific season
    if season in gujarat_crop_calendar and crop_name in gujarat_crop_calendar[season]:
        return True
    
    # Whole Year crops can be grown in any season
    if crop_name in gujarat_crop_calendar.get('Whole Year', []):
        return True
    
    # If season is 'Whole Year', allow crops from all seasons
    if season == 'Whole Year':
        for season_crops in gujarat_crop_calendar.values():
            if crop_name in season_crops:
                return True
    
    return False

# ============================================================================
# MAIN PREDICTION FUNCTION
# ============================================================================

async def predict_crops(input_data: PredictionInput) -> List[CropRecommendation]:
    """
    Get crop recommendations based on farm conditions using simple, accurate method
    
    Args:
        input_data: Farm conditions (state, city, season, soil, water, area)
        
    Returns:
        List of crop recommendations sorted by profitability
        
    Raises:
        HTTPException: If models not loaded or prediction fails
    """
    if not models_loaded:
        raise HTTPException(
            status_code=503, 
            detail="Models not loaded. Please run 'python train_simple_model.py' first."
        )
    
    try:
        # Step 1: Get weather data
        weather_data = await fetch_weather_data(input_data.city, input_data.state)
        
        # Step 2: Encode categorical inputs
        season_encoded = label_encoders['Season'].transform([input_data.season])[0]
        soil_encoded = label_encoders['Soil Type'].transform([input_data.soil_type])[0]
        water_encoded = label_encoders['Water_Availability'].transform([input_data.water_availability])[0]
        
        # Step 3: Prepare enhanced features (same as training)
        # Calculate enhanced features for better accuracy
        
        # Climate suitability
        def calculate_climate_suitability(temp, rainfall, season):
            if season == 'Kharif':
                temp_score = 1.0 if 25 <= temp <= 35 else 0.5
                rain_score = 1.0 if 400 <= rainfall <= 1200 else 0.3
            elif season == 'Rabi':
                temp_score = 1.0 if 15 <= temp <= 28 else 0.5
                rain_score = 1.0 if 200 <= rainfall <= 600 else 0.3
            elif season == 'Summer':
                temp_score = 1.0 if 30 <= temp <= 40 else 0.5
                rain_score = 1.0 if 100 <= rainfall <= 400 else 0.3
            else:  # Whole Year
                temp_score = 1.0 if 20 <= temp <= 35 else 0.5
                rain_score = 1.0 if 300 <= rainfall <= 800 else 0.3
            return (temp_score + rain_score) / 2
        
        # Water-soil compatibility
        def water_soil_compatibility(water_avail, soil_type):
            compatibility_matrix = {
                ('High', 'Black'): 1.0, ('High', 'Clay'): 0.9, ('High', 'Loamy'): 0.8,
                ('Medium', 'Red'): 1.0, ('Medium', 'Loamy'): 0.9, ('Medium', 'Sandy'): 0.7,
                ('Low', 'Sandy'): 1.0, ('Low', 'Red'): 0.8, ('Low', 'Laterite'): 0.7
            }
            return compatibility_matrix.get((water_avail, soil_type), 0.5)
        
        # Enhanced pH based on soil type
        soil_ph_map = {
            "Loamy": 6.8, "Clay": 7.5, "Sandy": 6.2, "Black": 7.8, 
            "Red": 6.5, "Alluvial": 7.0, "Laterite": 5.5
        }
        ph_enhanced = soil_ph_map.get(input_data.soil_type, weather_data.ph)
        
        # Calculate enhanced features
        climate_suitability = calculate_climate_suitability(
            weather_data.avg_temp, weather_data.rainfall, input_data.season
        )
        water_soil_comp = water_soil_compatibility(
            input_data.water_availability, input_data.soil_type
        )
        
        # Regional affinity (simplified for prediction)
        regional_affinity = 0.5  # Default value for prediction
        
        # Productivity index (simplified)
        productivity_index = weather_data.rainfall * weather_data.avg_temp / 1000
        
        # All features (before selection)
        all_features_dict = {
            'Season_encoded': season_encoded,
            'Soil Type_encoded': soil_encoded,
            'Water_Availability_encoded': water_encoded,
            'avgTemp': weather_data.avg_temp,
            'Rainfall': weather_data.rainfall,
            'pH_enhanced': ph_enhanced,
            'Cloud Cover': weather_data.cloud_cover,
            'Precipitation': weather_data.precipitation,
            'vapPressure': weather_data.vap_pressure,
            'Wet Day Freq': weather_data.wet_day_freq,
            'climate_suitability': climate_suitability,
            'water_soil_compatibility': water_soil_comp,
            'regional_affinity': regional_affinity,
            'productivity_index': productivity_index
        }
        
        # Create DataFrame with all features
        all_features_df = pd.DataFrame([all_features_dict])
        
        # Apply feature selection (this will select the same features as training)
        features_selected = feature_selector.transform(all_features_df)
        
        # Step 4: Scale selected features
        features_scaled = scaler.transform(features_selected)
        
        # Step 5: Get crop predictions with season filtering
        probabilities = rf_model.predict_proba(features_scaled)[0]
        
        # Get all crops with their probabilities
        all_crop_predictions = []
        for idx, prob in enumerate(probabilities):
            crop_name = crop_encoder.inverse_transform([idx])[0]
            
            # Apply season filtering - only include season-appropriate crops
            if is_season_appropriate_crop(crop_name, input_data.season):
                all_crop_predictions.append((idx, crop_name, prob))
        
        # Sort by probability and take top crops
        all_crop_predictions.sort(key=lambda x: x[2], reverse=True)
        top_predictions = all_crop_predictions[:8]  # Get top 8 season-appropriate crops
        
        print(f"🌾 Season filtering applied for {input_data.season} season:")
        print(f"   Total crops available: {len(probabilities)}")
        print(f"   Season-appropriate crops: {len(all_crop_predictions)}")
        print(f"   Top recommendations: {len(top_predictions)}")
        
        # Step 6: Calculate profits for each recommended crop
        recommendations = []
        for idx, crop_name, probability in top_predictions:
            
            # Get crop statistics from database
            if crop_name in crop_stats['Crop'].values:
                crop_data = crop_stats[crop_stats['Crop'] == crop_name].iloc[0]
                
                # Production calculations (quintals → kg for display)
                avg_production_per_acre_quintals = crop_data['Production'] / crop_data['Area'] if crop_data['Area'] > 0 else crop_data['Production']
                avg_production_per_acre_kg = avg_production_per_acre_quintals * 100  # Convert to kg
                
                expected_production_quintals = avg_production_per_acre_quintals * input_data.area
                expected_production_kg = expected_production_quintals * 100  # Convert to kg
                
                # Profit calculations (quintals × ₹/quintal)
                avg_price_per_quintal = crop_data['AVG_Price']
                profit_per_acre = avg_production_per_acre_quintals * avg_price_per_quintal
                total_profit = expected_production_quintals * avg_price_per_quintal
                
                # Price conversion for display (₹/quintal → ₹/kg)
                avg_price_per_kg = avg_price_per_quintal / 100
                
                # Cotton boost for suitable conditions in Gujarat
                suitability_score = float(probability * 100)
                boost_message = ""
                
                if (crop_name == 'Cotton(lint)' and 
                    input_data.state == 'Gujarat' and 
                    input_data.season == 'Kharif' and 
                    input_data.soil_type in ['Red', 'Black'] and 
                    input_data.water_availability == 'High'):
                    suitability_score *= 1.5  # 50% boost
                    boost_message = " (COTTON BOOST APPLIED)"
                
                recommendations.append(CropRecommendation(
                    crop=crop_name + boost_message,
                    suitability=min(suitability_score, 100.0),
                    profit_per_acre=float(profit_per_acre),
                    total_profit=float(total_profit),
                    expected_production=float(avg_production_per_acre_kg),  # Display in kg
                    total_production=float(expected_production_kg),  # Display in kg
                    avg_price=float(avg_price_per_kg),
                    profit_per_acre_formatted=format_indian_currency(profit_per_acre),
                    total_profit_formatted=format_indian_currency(total_profit)
                ))
        
        # Sort by total profit (most profitable first)
        recommendations.sort(key=lambda x: x.total_profit, reverse=True)
        return recommendations
    
    except Exception as e:
        print(f"Error in prediction: {e}")
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

# ============================================================================
# WEATHER DATA FUNCTIONS
# ============================================================================


async def fetch_weather_data(city: str, state: str) -> WeatherData:
    """
    Fetch weather data with enhanced historical data for cotton regions
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
            humidity = main.get('humidity', 60.0)
            cloud_cover = clouds.get('all', 20.0)
            
            # Get precipitation (rain in last 1 hour or 3 hours)
            precipitation = rain.get('1h', rain.get('3h', 0.0))
            
            # Calculate vapor pressure from humidity and temperature
            vap_pressure = (humidity / 100) * 6.11 * (10 ** ((7.5 * avg_temp) / (237.3 + avg_temp)))
            
            # Enhanced rainfall estimation for agricultural predictions
            # Use historical averages for cotton-growing regions
            if state == 'Gujarat' and city.lower() in ['ahmedabad', 'surendranagar', 'rajkot', 'bhavnagar']:
                # Cotton regions typically get 400-600mm annual rainfall
                rainfall = 470.0  # Good for cotton cultivation
                wet_day_freq = 15.0  # Moderate wet days suitable for cotton
            else:
                # General estimation
                rainfall = max(precipitation * 30, 200.0)  # Monthly estimate with minimum
                wet_day_freq = min(precipitation * 2, 30) if precipitation > 0 else 8
            
            # Soil pH mapping for Gujarat regions
            ph_map = {
                'ahmedabad': 7.2,
                'surendranagar': 7.5,
                'rajkot': 7.0,
                'bhavnagar': 7.3,
                'vadodara': 6.8,
                'surat': 6.9
            }
            ph = ph_map.get(city.lower(), 7.0)
            
            return WeatherData(
                avg_temp=round(avg_temp, 2),
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
    if df_original is not None:
        city_data = df_original[
            (df_original['City'] == city) & 
            (df_original['State'] == state)
        ]
        
        if not city_data.empty:
            return WeatherData(
                avg_temp=round(city_data['avgTemp'].mean(), 2),
                rainfall=round(max(city_data['Rainfall'].mean(), 400.0), 2),  # Ensure minimum for cotton
                precipitation=round(city_data['Precipitation'].mean(), 2),
                vap_pressure=round(city_data['vapPressure'].mean(), 2),
                wet_day_freq=round(city_data['Wet Day Freq'].mean(), 2),
                ph=round(city_data['pH'].mean(), 2),
                cloud_cover=round(city_data['Cloud Cover'].mean(), 2)
            )
    
    # Ultimate fallback with cotton-friendly defaults
    return WeatherData(
        avg_temp=28.0,
        rainfall=450.0,  # Good for cotton
        precipitation=25.0,
        vap_pressure=8.0,
        wet_day_freq=12.0,
        ph=7.2,
        cloud_cover=35.0
    )


async def get_weather(state: str, city: str) -> WeatherData:
    """Get weather data for a specific city"""
    return await fetch_weather_data(city, state)

# ============================================================================
# API HELPER FUNCTIONS
# ============================================================================

async def get_options():
    """Get available options for form dropdowns"""
    if not models_loaded:
        # Return default options if models aren't loaded
        return {
            "states": ["Gujarat"],
            "cities": ["Ahmedabad", "Rajkot", "Surat", "Vadodara", "Bhavnagar"],
            "seasons": ["Kharif", "Rabi", "Summer", "Whole Year"],
            "soil_types": ["Black", "Red", "Loamy"],
            "water_availability": ["High", "Medium", "Low"]
        }
    
    try:
        return {
            "states": ["Gujarat"],
            "cities": gujarat_cities,
            "seasons": label_encoders['Season'].classes_.tolist(),
            "soil_types": label_encoders['Soil Type'].classes_.tolist(),
            "water_availability": ["High", "Medium", "Low"]
        }
    except Exception as e:
        print(f"Error getting options: {e}")
        # Return default options on error
        return {
            "states": ["Gujarat"],
            "cities": ["Ahmedabad", "Rajkot", "Surat", "Vadodara", "Bhavnagar"],
            "seasons": ["Kharif", "Rabi", "Summer", "Whole Year"],
            "soil_types": ["Black", "Red", "Loamy"],
            "water_availability": ["High", "Medium", "Low"]
        }