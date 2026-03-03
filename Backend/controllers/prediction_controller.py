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
from dotenv import load_dotenv

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
        'data/gujarat_crop_calendar.json',  # Added for season filtering
        'data/gujarat_city_season_rainfall.json'  # Added for season-specific rainfall data
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
gujarat_city_season_rainfall = {}

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
        
        # Load Gujarat city and season-specific rainfall data
        with open('data/gujarat_city_season_rainfall.json', 'r') as f:
            gujarat_city_season_rainfall = json.load(f)
        
        # Get unique cities for Gujarat
        gujarat_cities = sorted(df_original[df_original['State'] == 'Gujarat']['City'].unique().tolist())
        models_loaded = True
        print("✅ High-accuracy crop model with season filtering loaded successfully")
        print(f"✅ Gujarat city-season rainfall data loaded for {len(gujarat_city_season_rainfall)} cities")
        
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
    STRICT season filtering based on Gujarat agricultural practices
    
    Args:
        crop_name: Name of the crop
        season: Season (Kharif, Rabi, Summer, Whole Year)
        
    Returns:
        bool: True if crop is appropriate for the season
    """
    if not gujarat_crop_calendar:
        return True  # If calendar not loaded, allow all crops
    
    # STRICT FILTERING: Only allow crops that are specifically meant for that season
    if season in gujarat_crop_calendar and crop_name in gujarat_crop_calendar[season]:
        return True
    
    # Whole Year crops can be grown in any season (but these are very limited)
    if crop_name in gujarat_crop_calendar.get('Whole Year', []):
        return True
    
    # If season is 'Whole Year', allow crops from all seasons
    if season == 'Whole Year':
        for season_crops in gujarat_crop_calendar.values():
            if crop_name in season_crops:
                return True
    
    # STRICT: If crop is not in the season list, reject it
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
        # Step 1: Get weather data with season-specific rainfall
        weather_data = await fetch_weather_data(input_data.city, input_data.state, input_data.season)
        
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
        
        # Enhanced pH based on soil type and city
        soil_ph_map = {
            "Loamy": 6.8, "Clay": 7.5, "Sandy": 6.2, "Black": 7.8, 
            "Red": 6.5, "Alluvial": 7.0, "Laterite": 5.5
        }
        
        # City-specific pH adjustments for Gujarat
        city_ph_adjustments = {
            'Ahmedabad': 0.2, 'Surat': -0.1, 'Vadodara': 0.0, 'Rajkot': 0.1,
            'Bhavnagar': 0.3, 'Jamnagar': 0.4, 'Junagadh': -0.3, 'Gandhinagar': 0.1,
            'Anand': -0.1, 'Nadiad': 0.0, 'Valsad': -0.5, 'Navsari': -0.4,
            'Bharuch': -0.2, 'Bhuj': 0.8, 'Gandhidham': 0.9, 'Mandvi': 0.7,
            'Porbandar': 0.2, 'Dwarka': 0.5, 'Veraval': 0.1, 'Amreli': -0.1,
            'Surendranagar': 0.6, 'Morbi': 0.4, 'Mehsana': 0.3, 'Patan': 0.5,
            'Palanpur': 0.0, 'Godhra': -0.2, 'Dahod': -0.4
        }
        
        base_ph = soil_ph_map.get(input_data.soil_type, weather_data.ph)
        city_adjustment = city_ph_adjustments.get(input_data.city, 0.0)
        ph_enhanced = base_ph + city_adjustment
        
        # Calculate enhanced features with city-specific adjustments
        climate_suitability = calculate_climate_suitability(
            weather_data.avg_temp, weather_data.rainfall, input_data.season
        )
        
        # City-specific climate adjustments for better differentiation
        city_climate_factors = {
            # Coastal cities - higher humidity, better for certain crops
            'Surat': 1.2, 'Valsad': 1.3, 'Navsari': 1.2, 'Bharuch': 1.1,
            # Arid regions - lower suitability for water-intensive crops
            'Bhuj': 0.7, 'Gandhidham': 0.6, 'Mandvi': 0.8, 'Rapar': 0.5,
            # Central Gujarat - moderate conditions
            'Ahmedabad': 1.0, 'Gandhinagar': 1.0, 'Anand': 1.1, 'Vadodara': 1.1,
            # Saurashtra - variable conditions
            'Rajkot': 0.9, 'Jamnagar': 0.8, 'Porbandar': 0.9, 'Dwarka': 0.8,
            'Bhavnagar': 0.8, 'Amreli': 0.9, 'Surendranagar': 0.7, 'Morbi': 0.7,
            # North Gujarat
            'Mehsana': 0.9, 'Patan': 0.8, 'Palanpur': 1.0,
            # Eastern Gujarat - higher rainfall areas
            'Godhra': 1.1, 'Dahod': 1.2
        }
        
        city_factor = city_climate_factors.get(input_data.city, 1.0)
        climate_suitability *= city_factor
        water_soil_comp = water_soil_compatibility(
            input_data.water_availability, input_data.soil_type
        )
        
        # Regional affinity based on city and historical crop patterns
        city_crop_affinity = {
            # Cotton-growing regions
            'Surendranagar': {'Cotton(lint)': 0.9, 'Groundnut': 0.8},
            'Rajkot': {'Cotton(lint)': 0.8, 'Groundnut': 0.9},
            'Bhavnagar': {'Cotton(lint)': 0.7, 'Onion': 0.8},
            
            # Rice-growing regions  
            'Surat': {'Rice': 0.9, 'Sugarcane': 0.8},
            'Navsari': {'Rice': 0.8, 'Sugarcane': 0.7},
            'Bharuch': {'Rice': 0.7, 'Cotton(lint)': 0.6},
            
            # Wheat belt
            'Mehsana': {'Wheat': 0.9, 'Bajra': 0.8},
            'Patan': {'Wheat': 0.8, 'Gram': 0.7},
            'Palanpur': {'Wheat': 0.8, 'Maize': 0.7},
            
            # Diverse cropping
            'Ahmedabad': {'Wheat': 0.7, 'Cotton(lint)': 0.6, 'Bajra': 0.7},
            'Vadodara': {'Rice': 0.6, 'Wheat': 0.7, 'Maize': 0.6},
            'Anand': {'Wheat': 0.8, 'Potato': 0.7, 'Onion': 0.6},
            
            # Arid region crops
            'Bhuj': {'Bajra': 0.9, 'Jowar': 0.8},
            'Gandhidham': {'Bajra': 0.8, 'Gram': 0.6},
            
            # Eastern Gujarat
            'Dahod': {'Maize': 0.8, 'Rice': 0.7, 'Wheat': 0.6},
            'Godhra': {'Maize': 0.7, 'Rice': 0.6, 'Wheat': 0.7}
        }
        
        # Get city-specific affinity or use default
        city_affinities = city_crop_affinity.get(input_data.city, {})
        regional_affinity = 0.5  # Default value
        
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
        
        # Ensure we have at least 6 recommendations
        if len(all_crop_predictions) < 6:
            # If we have fewer than 6 season-appropriate crops, add more from the same season only
            print(f"⚠️ Only {len(all_crop_predictions)} season-appropriate crops found for {input_data.season}")
            
            # Get all crops sorted by probability but still filter by season
            all_general_predictions = []
            for idx, prob in enumerate(probabilities):
                crop_name = crop_encoder.inverse_transform([idx])[0]
                # STRICT: Only add crops that are season-appropriate
                if is_season_appropriate_crop(crop_name, input_data.season):
                    all_general_predictions.append((idx, crop_name, prob))
            
            all_general_predictions.sort(key=lambda x: x[2], reverse=True)
            
            # Replace with the sorted season-appropriate crops
            all_crop_predictions = all_general_predictions
            
            # If still less than 6, that's fine - we'll only show season-appropriate crops
            if len(all_crop_predictions) < 6:
                print(f"📋 Final count: {len(all_crop_predictions)} season-appropriate crops for {input_data.season}")
        
        # Take up to 6 crops (or all available if less than 6)
        top_predictions = all_crop_predictions[:6]
        
        print(f"🌾 STRICT season filtering applied for {input_data.season} season:")
        print(f"   Total crops available: {len(probabilities)}")
        print(f"   Season-appropriate crops found: {len(all_crop_predictions)}")
        print(f"   Final recommendations: {len(top_predictions)}")
        print(f"   Recommended crops: {[pred[1] for pred in top_predictions]}")
        
        # Step 6: Calculate profits for each recommended crop with city-specific adjustments
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
                
                # City-specific suitability adjustments
                suitability_score = float(probability * 100)
                
                # Apply city-specific crop affinity
                if crop_name in city_affinities:
                    affinity_boost = city_affinities[crop_name]
                    suitability_score *= (1 + affinity_boost)
                    print(f"   🎯 {crop_name} affinity boost in {input_data.city}: {affinity_boost:.1f}")
                
                # Cotton boost for suitable conditions in Gujarat
                if (crop_name == 'Cotton(lint)' and 
                    input_data.state == 'Gujarat' and 
                    input_data.season == 'Kharif' and 
                    input_data.soil_type in ['Red', 'Black'] and 
                    input_data.water_availability == 'High'):
                    suitability_score *= 1.3  # 30% boost for cotton
                
                recommendations.append(CropRecommendation(
                    crop=crop_name,  # Remove boost message from crop name
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


async def fetch_weather_data(city: str, state: str, season: str = 'Whole Year') -> WeatherData:
    """
    Fetch weather data with realistic Gujarat city and season-specific rainfall data
    Uses pre-defined rainfall values based on both city and season for accuracy
    """
    api_key = os.getenv("OPENWEATHERMAP_API_KEY")
    print("--------------------api key----------------------")
    url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric'
    
    # Get realistic rainfall for Gujarat cities based on city AND season
    realistic_rainfall = 600.0  # Default fallback
    if gujarat_city_season_rainfall and city in gujarat_city_season_rainfall:
        city_data = gujarat_city_season_rainfall[city]
        if season in city_data:
            realistic_rainfall = city_data[season]
            print(f"🌧️ Using realistic rainfall for {city} in {season}: {realistic_rainfall}mm")
        else:
            realistic_rainfall = city_data.get('Whole Year', 600.0)
            print(f"🌧️ Season {season} not found, using annual average for {city}: {realistic_rainfall}mm")
    else:
        print(f"⚠️ City {city} not found in rainfall data, using default: {realistic_rainfall}mm")
        if gujarat_city_season_rainfall:
            print(f"🔍 Available cities: {list(gujarat_city_season_rainfall.keys())[:10]}...")  # Show first 10 cities
    
    try:
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            weather_data = response.json()
            
            # Extract weather data (except rainfall)
            main = weather_data.get('main', {})
            clouds = weather_data.get('clouds', {})
            rain = weather_data.get('rain', {})
            
            avg_temp = main.get('temp', 27.0)
            humidity = main.get('humidity', 60.0)
            cloud_cover = clouds.get('all', 20.0)
            
            # Get precipitation (rain in last 1 hour or 3 hours) - but don't use for annual rainfall
            precipitation = rain.get('1h', rain.get('3h', 0.0))
            
            # Calculate vapor pressure from humidity and temperature
            vap_pressure = (humidity / 100) * 6.11 * (10 ** ((7.5 * avg_temp) / (237.3 + avg_temp)))
            
            # Calculate wet day frequency based on realistic rainfall
            # Higher rainfall cities have more wet days
            if realistic_rainfall >= 1500:  # High rainfall areas (South Gujarat, Coastal)
                wet_day_freq = 25.0
            elif realistic_rainfall >= 800:  # Medium rainfall areas (Central Gujarat)
                wet_day_freq = 18.0
            elif realistic_rainfall >= 500:  # Moderate rainfall areas (North Gujarat)
                wet_day_freq = 12.0
            else:  # Low rainfall areas (Kutch, Saurashtra)
                wet_day_freq = 8.0
            
            # Soil pH mapping for Gujarat regions
            ph_map = {
                'ahmedabad': 7.2, 'surat': 6.9, 'vadodara': 6.8, 'rajkot': 7.0,
                'bhavnagar': 7.3, 'jamnagar': 7.4, 'junagadh': 6.7, 'gandhinagar': 7.1,
                'anand': 6.9, 'nadiad': 7.0, 'valsad': 6.5, 'navsari': 6.6,
                'bharuch': 6.8, 'bhuj': 7.8, 'gandhidham': 7.9, 'mandvi': 7.7,
                'porbandar': 7.2, 'dwarka': 7.5, 'veraval': 7.1, 'amreli': 6.9,
                'surendranagar': 7.6, 'morbi': 7.4, 'mehsana': 7.3, 'patan': 7.5,
                'palanpur': 7.0, 'godhra': 6.8, 'dahod': 6.6
            }
            ph = ph_map.get(city.lower(), 7.0)
            
            return WeatherData(
                avg_temp=round(avg_temp, 2),
                rainfall=round(realistic_rainfall, 2),  # Use realistic rainfall instead of API
                precipitation=round(precipitation, 2),
                vap_pressure=round(vap_pressure, 2),
                wet_day_freq=round(wet_day_freq, 2),
                ph=ph,
                cloud_cover=round(cloud_cover, 2)
            )
    except Exception as e:
        print(f"Weather API Error: {e}")
    
    # Fallback to historical averages from dataset with realistic rainfall
    if df_original is not None:
        city_data = df_original[
            (df_original['City'] == city) & 
            (df_original['State'] == state)
        ]
        
        if not city_data.empty:
            # Calculate wet day frequency based on realistic rainfall
            if realistic_rainfall >= 1500:
                wet_day_freq = 25.0
            elif realistic_rainfall >= 800:
                wet_day_freq = 18.0
            elif realistic_rainfall >= 500:
                wet_day_freq = 12.0
            else:
                wet_day_freq = 8.0
                
            return WeatherData(
                avg_temp=round(city_data['avgTemp'].mean(), 2),
                rainfall=round(realistic_rainfall, 2),  # Use realistic rainfall
                precipitation=round(city_data['Precipitation'].mean(), 2),
                vap_pressure=round(city_data['vapPressure'].mean(), 2),
                wet_day_freq=round(wet_day_freq, 2),
                ph=round(city_data['pH'].mean(), 2),
                cloud_cover=round(city_data['Cloud Cover'].mean(), 2)
            )
    
    # Ultimate fallback with realistic rainfall
    wet_day_freq = 15.0 if realistic_rainfall >= 600 else 10.0
    
    return WeatherData(
        avg_temp=28.0,
        rainfall=round(realistic_rainfall, 2),  # Use realistic rainfall
        precipitation=25.0,
        vap_pressure=8.0,
        wet_day_freq=wet_day_freq,
        ph=7.2,
        cloud_cover=35.0
    )


async def get_weather(state: str, city: str, season: str = 'Whole Year') -> WeatherData:
    """Get weather data for a specific city and optional season"""
    return await fetch_weather_data(city, state, season)

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