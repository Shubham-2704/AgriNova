#!/usr/bin/env python3
"""
AgriNova High-Accuracy Crop Prediction Model Training Script

This script trains an optimized Random Forest model for crop recommendation
with target accuracy of 80%+ using advanced techniques like feature engineering,
data balancing, and hyperparameter optimization.

Database Structure:
- Area: in Acres
- Production: in Quintals (total production for that area)
- AVG_Price: in ₹ per Quintal

Usage: python train_simple_model.py
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os
import warnings
warnings.filterwarnings('ignore')

print("🌾 AgriNova High-Accuracy Crop Prediction Model Training")
print("🎯 Target: 80%+ Accuracy")
print("=" * 60)

# Create directories if they don't exist
os.makedirs('trained_models', exist_ok=True)
os.makedirs('data', exist_ok=True)

# Load dataset
print("📊 Loading and analyzing dataset...")
df = pd.read_csv('data/Final_dataset.csv')
print(f"   Original dataset: {df.shape[0]} rows, {df.shape[1]} columns")

# Data cleaning and preprocessing
print("🧹 Advanced data cleaning...")
df = df.dropna(subset=['Crop'])

# Handle missing values in numerical columns
numerical_cols = ['avgTemp', 'Rainfall', 'pH', 'Cloud Cover', 'Precipitation', 
                  'Production', 'Area', 'AVG_Price', 'vapPressure', 'Wet Day Freq']
for col in numerical_cols:
    if col in df.columns:
        df[col] = df[col].fillna(df[col].median())

# Handle missing values in categorical columns
categorical_cols = ['State', 'City', 'Season', 'Soil Type', 'Water_Availability']
for col in categorical_cols:
    if col in df.columns:
        df[col] = df[col].fillna(df[col].mode()[0])

print(f"   After cleaning: {df.shape[0]} rows")

# Advanced Feature Engineering for Higher Accuracy
print("🔧 Advanced feature engineering...")

# 1. Soil pH mapping with regional variations
soil_ph_map = {
    "Loamy": 6.8, "Clay": 7.5, "Sandy": 6.2, "Black": 7.8, 
    "Red": 6.5, "Alluvial": 7.0, "Laterite": 5.5
}
df['pH_enhanced'] = df.apply(
    lambda row: soil_ph_map.get(row['Soil Type'], row['pH']) if pd.isna(row['pH']) else row['pH'], 
    axis=1
)

# 2. Climate suitability index
def calculate_climate_suitability(temp, rainfall, season):
    """Calculate climate suitability based on season-specific optimal ranges"""
    if season == 'Kharif':  # Monsoon crops
        temp_score = 1.0 if 25 <= temp <= 35 else 0.5
        rain_score = 1.0 if 400 <= rainfall <= 1200 else 0.3
    elif season == 'Rabi':  # Winter crops
        temp_score = 1.0 if 15 <= temp <= 28 else 0.5
        rain_score = 1.0 if 200 <= rainfall <= 600 else 0.3
    elif season == 'Summer':  # Summer crops
        temp_score = 1.0 if 30 <= temp <= 40 else 0.5
        rain_score = 1.0 if 100 <= rainfall <= 400 else 0.3
    else:  # Whole Year
        temp_score = 1.0 if 20 <= temp <= 35 else 0.5
        rain_score = 1.0 if 300 <= rainfall <= 800 else 0.3
    
    return (temp_score + rain_score) / 2

df['climate_suitability'] = df.apply(
    lambda row: calculate_climate_suitability(row['avgTemp'], row['Rainfall'], row['Season']), 
    axis=1
)

# 3. Water-soil compatibility
def water_soil_compatibility(water_avail, soil_type):
    """Calculate water-soil compatibility score"""
    compatibility_matrix = {
        ('High', 'Black'): 1.0, ('High', 'Clay'): 0.9, ('High', 'Loamy'): 0.8,
        ('Medium', 'Red'): 1.0, ('Medium', 'Loamy'): 0.9, ('Medium', 'Sandy'): 0.7,
        ('Low', 'Sandy'): 1.0, ('Low', 'Red'): 0.8, ('Low', 'Laterite'): 0.7
    }
    return compatibility_matrix.get((water_avail, soil_type), 0.5)

df['water_soil_compatibility'] = df.apply(
    lambda row: water_soil_compatibility(row['Water_Availability'], row['Soil Type']), 
    axis=1
)

# 4. Regional crop affinity (based on state-crop combinations)
state_crop_counts = df.groupby(['State', 'Crop']).size().reset_index(name='count')
state_totals = df.groupby('State').size().reset_index(name='total')
state_crop_affinity = state_crop_counts.merge(state_totals, on='State')
state_crop_affinity['affinity'] = state_crop_affinity['count'] / state_crop_affinity['total']

affinity_dict = {}
for _, row in state_crop_affinity.iterrows():
    affinity_dict[(row['State'], row['Crop'])] = row['affinity']

df['regional_affinity'] = df.apply(
    lambda row: affinity_dict.get((row['State'], row['Crop']), 0.1), 
    axis=1
)

# 5. Productivity index
df['productivity_index'] = (df['Production'] / (df['Area'] + 1)) * df['AVG_Price'] / 1000

print("   ✅ Created 5 advanced engineered features")

# Feature encoding
print("🔢 Encoding categorical features...")
label_encoders = {}
for col in categorical_cols:
    le = LabelEncoder()
    df[col + '_encoded'] = le.fit_transform(df[col])
    label_encoders[col] = le

# Enhanced feature set with engineered features
feature_cols = [
    'Season_encoded', 'Soil Type_encoded', 'Water_Availability_encoded', 
    'avgTemp', 'Rainfall', 'pH_enhanced', 'Cloud Cover', 'Precipitation', 
    'vapPressure', 'Wet Day Freq', 'climate_suitability', 'water_soil_compatibility',
    'regional_affinity', 'productivity_index'
]

# Remove any remaining NaN values
df = df.dropna(subset=feature_cols + ['Crop'])
print(f"   Final dataset: {df.shape[0]} rows")

# Gujarat Crop Calendar - Season-Crop Filtering
print("🌾 Implementing Gujarat crop calendar filtering...")

# Define Gujarat crop calendar based on agricultural practices
gujarat_crop_calendar = {
    'Kharif': ['Rice', 'Cotton(lint)', 'Groundnut', 'Maize', 'Bajra', 'Soybean', 'Sugarcane', 'Jowar'],
    'Rabi': ['Wheat', 'Gram', 'Mustard', 'Cumin', 'Coriander', 'Fennel', 'Barley'],
    'Summer': ['Fodder crops', 'Watermelon', 'Muskmelon'],
    'Whole Year': ['Onion', 'Potato', 'Tomato', 'Brinjal', 'Okra', 'Chilli']
}

# Filter dataset to include only season-appropriate crops
def is_season_appropriate(crop, season):
    """Check if crop is appropriate for the given season"""
    for season_key, crops in gujarat_crop_calendar.items():
        if crop in crops and season_key == season:
            return True
        elif crop in crops and season == 'Whole Year':
            return True
        elif season == 'Whole Year' and crop in gujarat_crop_calendar['Whole Year']:
            return True
    return False

# Apply season filtering
print("   Filtering crops by season appropriateness...")
df_season_filtered = df[df.apply(lambda row: is_season_appropriate(row['Crop'], row['Season']), axis=1)].copy()
print(f"   After season filtering: {df_season_filtered.shape[0]} rows (removed {df.shape[0] - df_season_filtered.shape[0]} inappropriate season-crop combinations)")

# Smart crop balancing for better accuracy
print("⚖️ Smart crop balancing...")
crop_counts = df_season_filtered['Crop'].value_counts()
print(f"   Season-appropriate crops: {len(crop_counts)} unique crops")

# Focus on top crops with sufficient data (minimum 50 samples after filtering)
min_samples = 50  # Reduced threshold due to season filtering
major_crops = crop_counts[crop_counts >= min_samples].index.tolist()
df_filtered = df_season_filtered[df_season_filtered['Crop'].isin(major_crops)].copy()

print(f"   Filtered to {len(major_crops)} major crops with {df_filtered.shape[0]} samples")
print(f"   Major crops: {major_crops}")

# Balance the dataset to prevent overfitting on dominant crops
max_samples_per_crop = 800  # Limit to prevent any single crop from dominating
balanced_dfs = []

for crop in major_crops:
    crop_data = df_filtered[df_filtered['Crop'] == crop]
    if len(crop_data) > max_samples_per_crop:
        crop_data = crop_data.sample(n=max_samples_per_crop, random_state=42)
    balanced_dfs.append(crop_data)

df_balanced = pd.concat(balanced_dfs, ignore_index=True)
print(f"   Balanced dataset: {df_balanced.shape[0]} rows")

# Prepare features and target
X = df_balanced[feature_cols]
y_crop = df_balanced['Crop']

# Encode crop labels
crop_encoder = LabelEncoder()
y_crop_encoded = crop_encoder.fit_transform(y_crop)

# Feature selection for optimal performance
print("🔍 Selecting best features...")
selector = SelectKBest(score_func=f_classif, k=12)  # Select top 12 features
X_selected = selector.fit_transform(X, y_crop_encoded)
selected_features = [feature_cols[i] for i in selector.get_support(indices=True)]
print(f"   Selected {len(selected_features)} best features: {selected_features}")

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_selected)

# Train-test split with stratification
print("🎯 Training optimized model...")
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y_crop_encoded, test_size=0.2, random_state=42, stratify=y_crop_encoded
)

# Hyperparameter optimization for higher accuracy
print("   🔧 Optimizing hyperparameters...")
param_grid = {
    'n_estimators': [400, 500],
    'max_depth': [25, 30],
    'min_samples_split': [3, 5],
    'min_samples_leaf': [1, 2],
    'max_features': ['sqrt', 'log2']
}

# Use a smaller grid search for speed
rf_base = RandomForestClassifier(random_state=42, n_jobs=-1, class_weight='balanced')
grid_search = GridSearchCV(
    rf_base, param_grid, cv=3, scoring='accuracy', n_jobs=-1, verbose=1
)
grid_search.fit(X_train, y_train)

# Best model
rf_model = grid_search.best_estimator_
print(f"   ✅ Best parameters: {grid_search.best_params_}")

# Model evaluation
train_accuracy = rf_model.score(X_train, y_train)
test_accuracy = rf_model.score(X_test, y_test)

# Cross-validation for robust accuracy estimate
cv_scores = cross_val_score(rf_model, X_scaled, y_crop_encoded, cv=5, scoring='accuracy')

# Save all model components
print("💾 Saving optimized model files...")
joblib.dump(rf_model, 'trained_models/crop_model.pkl')
joblib.dump(crop_encoder, 'trained_models/crop_encoder.pkl')
joblib.dump(label_encoders, 'trained_models/label_encoders.pkl')
joblib.dump(scaler, 'trained_models/scaler.pkl')
joblib.dump(selected_features, 'trained_models/feature_cols.pkl')  # Save selected features
joblib.dump(selector, 'trained_models/feature_selector.pkl')  # Save selector for prediction

# Create crop statistics for profit calculations
print("📈 Creating crop statistics...")
df_original = pd.read_csv('data/Final_dataset.csv')
df_original = df_original.dropna(subset=['Crop', 'Production', 'Area', 'AVG_Price'])

crop_stats = df_original.groupby('Crop').agg({
    'Production': 'mean',  # Average production in quintals
    'Area': 'mean',        # Average area in acres
    'AVG_Price': 'mean'    # Average price in ₹ per quintal
}).reset_index()

crop_stats.to_csv('data/crop_stats.csv', index=False)

# Save Gujarat crop calendar for prediction use
print("📅 Saving Gujarat crop calendar...")
import json
with open('data/gujarat_crop_calendar.json', 'w') as f:
    json.dump(gujarat_crop_calendar, f, indent=2)

print("   ✅ Crop calendar saved for prediction filtering")

# Results
print("\n" + "=" * 70)
print("🎉 HIGH-ACCURACY MODEL TRAINING COMPLETED!")
print("=" * 70)
print(f"📊 Training Accuracy: {train_accuracy:.2%}")
print(f"📊 Testing Accuracy: {test_accuracy:.2%}")
print(f"📊 Cross-Validation: {cv_scores.mean():.2%} (±{cv_scores.std()*2:.2%})")
print(f"📊 Total samples used: {len(X_scaled):,}")
print(f"📊 Number of crops: {len(major_crops)}")
print(f"📊 Selected features: {len(selected_features)}")

# Feature importance
feature_importance = pd.DataFrame({
    'feature': selected_features,
    'importance': rf_model.feature_importances_
}).sort_values('importance', ascending=False)

print(f"\n🔍 TOP 5 MOST IMPORTANT FEATURES:")
print("-" * 50)
for idx, row in feature_importance.head().iterrows():
    print(f"   {row['feature']:<25} {row['importance']:.3f}")

# Accuracy assessment
if test_accuracy >= 0.80:
    print(f"\n🏆 EXCELLENT! Achieved {test_accuracy:.1%} accuracy!")
    print(f"🎯 Target of 80%+ accuracy ACHIEVED!")
elif test_accuracy >= 0.70:
    print(f"\n✅ GOOD! Achieved {test_accuracy:.1%} accuracy!")
    print(f"📈 Close to 80% target")
else:
    print(f"\n⚠️ Achieved {test_accuracy:.1%} accuracy")
    print(f"💡 Consider more data or feature engineering")

print(f"\n🚀 Ready to use: python main.py")
print("=" * 70)