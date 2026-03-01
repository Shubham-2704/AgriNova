import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, GradientBoostingClassifier
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import classification_report, accuracy_score, mean_squared_error, r2_score
from sklearn.feature_selection import SelectKBest, f_classif
import joblib
import os
import warnings
warnings.filterwarnings('ignore')

print("🚀 OPTIMIZED AGRINOVA MODEL TRAINING FOR 70-80% ACCURACY")
print("=" * 70)

# Create directories
os.makedirs('trained_models', exist_ok=True)
os.makedirs('data', exist_ok=True)

# Load dataset
df = pd.read_csv('data/Final_dataset.csv')
print(f"📊 Original dataset shape: {df.shape}")

# Remove rows with missing critical data
df = df.dropna(subset=['Crop', 'Production', 'AVG_Price'])
print(f"📊 After removing missing data: {df.shape}")

# Handle missing values
numerical_cols = ['avgTemp', 'Rainfall', 'pH', 'Cloud Cover', 'Precipitation', 
                  'Production', 'Area', 'AVG_Price', 'vapPressure', 'Wet Day Freq']
for col in numerical_cols:
    if col in df.columns:
        df[col] = df[col].fillna(df[col].median())

categorical_cols = ['State', 'City', 'Season', 'Crop', 'Soil Type', 'Water_Availability']
for col in categorical_cols:
    if col in df.columns:
        df[col] = df[col].fillna(df[col].mode()[0])

print("🔧 STEP 1: IMPROVED FEATURE ENGINEERING FOR BETTER CROP PREDICTION")
print("-" * 70)

# Enhanced soil pH mapping with more precision
soil_ph_map = {
    "Loamy": 6.8, "Clay": 7.5, "Sandy": 6.2, "Black": 7.8, "Red": 6.5, "Alluvial": 7.0
}
df['pH'] = df.apply(lambda row: soil_ph_map.get(row['Soil Type'], row['pH']) if pd.isna(row['pH']) else row['pH'], axis=1)

# 1. Regional crop suitability (based on actual data patterns)
def get_regional_suitability(state, city, crop, season, soil, temp, rainfall):
    """Calculate suitability based on regional agricultural patterns"""
    base_score = 3.0
    
    # Gujarat-specific adjustments based on actual data
    if state == 'Gujarat':
        # Temperature suitability
        if 25 <= temp <= 35:
            base_score += 0.5
        elif 20 <= temp <= 40:
            base_score += 0.2
        
        # Rainfall suitability  
        if 300 <= rainfall <= 800:
            base_score += 0.5
        elif 200 <= rainfall <= 1000:
            base_score += 0.3
        
        # Soil-season combinations that work well in Gujarat
        if (soil == 'Red' and season == 'Kharif') or (soil == 'Black' and season in ['Kharif', 'Rabi']):
            base_score += 0.3
        
        # High water availability regions
        if rainfall > 400:
            base_score += 0.2
    
    return min(base_score, 5.0)

df['regional_suitability'] = df.apply(
    lambda row: get_regional_suitability(
        row['State'], row['City'], row['Crop'], row['Season'], 
        row['Soil Type'], row['avgTemp'], row['Rainfall']
    ), axis=1
)

# 2. Climate-soil interaction index
def climate_soil_interaction(temp, rainfall, soil_type, ph):
    """Better climate-soil interaction scoring"""
    score = 0
    
    # Temperature-soil interaction
    if soil_type == 'Red' and 25 <= temp <= 35:
        score += 1.0
    elif soil_type == 'Black' and 20 <= temp <= 32:
        score += 1.0
    elif soil_type == 'Loamy' and 22 <= temp <= 30:
        score += 1.0
    else:
        score += 0.5
    
    # Rainfall-soil interaction
    if soil_type == 'Red' and 300 <= rainfall <= 700:
        score += 1.0
    elif soil_type == 'Black' and 400 <= rainfall <= 900:
        score += 1.0
    elif soil_type == 'Loamy' and 500 <= rainfall <= 1200:
        score += 1.0
    else:
        score += 0.5
    
    # pH suitability
    if 6.0 <= ph <= 7.5:
        score += 0.5
    
    return score

df['climate_soil_interaction'] = df.apply(
    lambda row: climate_soil_interaction(
        row['avgTemp'], row['Rainfall'], row['Soil Type'], row['pH']
    ), axis=1
)

# 3. Seasonal weather fitness
def seasonal_weather_fitness(season, temp, rainfall, cloud_cover):
    """Season-weather alignment scoring"""
    fitness_scores = {
        'Kharif': {
            'temp_range': (25, 35),
            'rainfall_range': (400, 1000),
            'cloud_optimal': (40, 70)
        },
        'Rabi': {
            'temp_range': (15, 28),
            'rainfall_range': (200, 600),
            'cloud_optimal': (20, 50)
        },
        'Summer': {
            'temp_range': (30, 40),
            'rainfall_range': (100, 400),
            'cloud_optimal': (10, 40)
        },
        'Whole Year': {
            'temp_range': (20, 35),
            'rainfall_range': (300, 800),
            'cloud_optimal': (30, 60)
        }
    }
    
    if season not in fitness_scores:
        return 0.5
    
    ranges = fitness_scores[season]
    score = 0
    
    # Temperature fitness
    if ranges['temp_range'][0] <= temp <= ranges['temp_range'][1]:
        score += 1.0
    elif abs(temp - ranges['temp_range'][0]) <= 5 or abs(temp - ranges['temp_range'][1]) <= 5:
        score += 0.7
    else:
        score += 0.3
    
    # Rainfall fitness
    if ranges['rainfall_range'][0] <= rainfall <= ranges['rainfall_range'][1]:
        score += 1.0
    elif abs(rainfall - ranges['rainfall_range'][0]) <= 200 or abs(rainfall - ranges['rainfall_range'][1]) <= 200:
        score += 0.7
    else:
        score += 0.3
    
    # Cloud cover fitness
    if ranges['cloud_optimal'][0] <= cloud_cover <= ranges['cloud_optimal'][1]:
        score += 0.5
    
    return score / 2.5  # Normalize to 0-1

df['seasonal_weather_fitness'] = df.apply(
    lambda row: seasonal_weather_fitness(
        row['Season'], row['avgTemp'], row['Rainfall'], row['Cloud Cover']
    ), axis=1
)

# 4. Water-soil drainage compatibility
def water_soil_drainage(water_avail, soil_type, rainfall):
    """Water availability and soil drainage compatibility"""
    drainage_map = {
        'Red': 'good',      # Red soil has good drainage
        'Black': 'moderate', # Black soil retains water
        'Loamy': 'excellent' # Loamy soil has excellent drainage
    }
    
    drainage = drainage_map.get(soil_type, 'moderate')
    
    if water_avail == 'High':
        if drainage == 'good' and rainfall > 400:
            return 1.0
        elif drainage == 'moderate' and rainfall > 500:
            return 1.0
        elif drainage == 'excellent' and rainfall > 600:
            return 1.0
        else:
            return 0.7
    elif water_avail == 'Medium':
        if drainage in ['good', 'excellent'] and 300 <= rainfall <= 700:
            return 1.0
        else:
            return 0.8
    else:  # Low water
        if drainage == 'good' and rainfall < 400:
            return 1.0
        else:
            return 0.6

df['water_soil_drainage'] = df.apply(
    lambda row: water_soil_drainage(
        row['Water_Availability'], row['Soil Type'], row['Rainfall']
    ), axis=1
)

# 5. Comprehensive growing conditions index
df['growing_conditions_index'] = (
    (df['avgTemp'] / 35.0) * 0.25 +  # Temperature factor
    (df['Rainfall'] / 1000.0) * 0.35 +  # Rainfall factor (most important)
    (df['pH'] / 8.0) * 0.15 +  # pH factor
    (df['vapPressure'] / 30.0) * 0.10 +  # Humidity factor
    (df['Cloud Cover'] / 100.0) * 0.15  # Cloud cover factor
)

# 6. Area-productivity relationship
df['area_efficiency'] = np.log1p(df['Area']) * (df['Production'] / (df['Area'] + 1))

print("✅ Created 6 improved features for better crop prediction")

# Encode categorical variables
label_encoders = {}
categorical_features = ['State', 'City', 'Season', 'Crop', 'Soil Type', 'Water_Availability']

for col in categorical_features:
    if col in df.columns:
        le = LabelEncoder()
        df[col + '_encoded'] = le.fit_transform(df[col].astype(str))
        label_encoders[col] = le

print(f"✅ Encoded {len(categorical_features)} categorical features")

# Filter to 15 major crops with better balancing strategy
major_crops = df['Crop'].value_counts().head(15).index.tolist()
df_filtered = df[df['Crop'].isin(major_crops)].copy()
print(f"📊 Filtered to {len(major_crops)} major crops: {df_filtered.shape}")

# Smart balancing: ensure minimum samples while not over-balancing
print("⚖️ Smart balancing with special attention to important crops like Cotton...")
crop_counts = df_filtered['Crop'].value_counts()
min_samples = max(crop_counts.min(), 150)  # At least 150 samples
max_samples = min(crop_counts.max(), 350)  # Reduced cap to give more balance

# Special handling for important crops like Cotton
important_crops = ['Cotton(lint)', 'Rice', 'Wheat']  # Ensure these get good representation

balanced_dfs = []
for crop in major_crops:
    crop_data = df_filtered[df_filtered['Crop'] == crop]
    current_count = len(crop_data)
    
    # Special handling for important crops
    if crop in important_crops:
        target = max(min_samples, min(current_count, 300))  # Ensure at least 150, max 300
        if current_count < target:
            crop_data = crop_data.sample(n=target, replace=True, random_state=42)
        elif current_count > target:
            crop_data = crop_data.sample(n=target, replace=False, random_state=42)
    else:
        # Regular balancing for other crops
        if current_count < min_samples:
            target = min_samples
            crop_data = crop_data.sample(n=target, replace=True, random_state=42)
        elif current_count > max_samples:
            target = max_samples
            crop_data = crop_data.sample(n=target, replace=False, random_state=42)
        else:
            target = current_count
    
    balanced_dfs.append(crop_data)
    print(f"   {crop}: {current_count} → {len(crop_data)} samples")

df_filtered = pd.concat(balanced_dfs, ignore_index=True)
print(f"📊 Balanced dataset: {df_filtered.shape}")

print("\n🏭 STEP 2: MODEL 1 - PRODUCTION PREDICTION")
print("-" * 50)

# MODEL 1: Production Prediction
production_features = [
    'State_encoded', 'City_encoded', 'Season_encoded', 'Crop_encoded',
    'Soil Type_encoded', 'Water_Availability_encoded', 'Area',
    'avgTemp', 'Rainfall', 'Cloud Cover', 'Precipitation', 
    'vapPressure', 'Wet Day Freq', 'pH'
]

X_production = df_filtered[production_features]
y_production = df_filtered['Production']

# Remove any remaining NaN values
mask = ~(X_production.isnull().any(axis=1) | y_production.isnull())
X_production = X_production[mask]
y_production = y_production[mask]

X_prod_train, X_prod_test, y_prod_train, y_prod_test = train_test_split(
    X_production, y_production, test_size=0.2, random_state=42
)

model_production = RandomForestRegressor(
    n_estimators=300, max_depth=20, random_state=42, n_jobs=-1
)
model_production.fit(X_prod_train, y_prod_train)

prod_test_score = model_production.score(X_prod_test, y_prod_test)
print(f"🌾 PRODUCTION MODEL ACCURACY: {prod_test_score*100:.1f}%")

print("\n🏭 STEP 3: OPTIMIZED CROP RECOMMENDATION MODEL")
print("-" * 55)

# MODEL 2: Enhanced Crop Recommendation
crop_features = [
    'State_encoded', 'City_encoded', 'Season_encoded',
    'Soil Type_encoded', 'Water_Availability_encoded', 'Area',
    'avgTemp', 'Rainfall', 'pH', 'Cloud Cover', 'Precipitation', 'vapPressure',
    'regional_suitability', 'climate_soil_interaction', 'seasonal_weather_fitness',
    'water_soil_drainage', 'growing_conditions_index', 'area_efficiency'
]

X_crop = df_filtered[crop_features]
y_crop = df_filtered['Crop_encoded']

# Remove any remaining NaN values
mask = ~(X_crop.isnull().any(axis=1) | y_crop.isnull())
X_crop = X_crop[mask]
y_crop = y_crop[mask]

print(f"📊 Crop model data: {X_crop.shape}")
print(f"📊 Number of crops: {len(np.unique(y_crop))}")

# Feature selection for optimal performance
print("🔍 Selecting best features...")
selector = SelectKBest(score_func=f_classif, k=15)  # Select top 15 features
X_crop_selected = selector.fit_transform(X_crop, y_crop)
selected_features = [crop_features[i] for i in selector.get_support(indices=True)]
print(f"✅ Selected {len(selected_features)} best features")

# Split data
X_crop_train, X_crop_test, y_crop_train, y_crop_test = train_test_split(
    X_crop_selected, y_crop, test_size=0.2, random_state=42, stratify=y_crop
)

# Train optimized model with good parameters (faster training)
print("🎯 Training optimized model with proven parameters...")
model_crop = RandomForestClassifier(
    n_estimators=500,
    max_depth=20,
    min_samples_split=5,
    min_samples_leaf=2,
    max_features='sqrt',
    class_weight='balanced',
    random_state=42,
    n_jobs=-1
)

model_crop.fit(X_crop_train, y_crop_train)

# Evaluate Crop Model
crop_train_score = model_crop.score(X_crop_train, y_crop_train)
crop_test_score = model_crop.score(X_crop_test, y_crop_test)

# Cross-validation for robust accuracy estimate
cv_scores = cross_val_score(model_crop, X_crop_selected, y_crop, cv=5, scoring='accuracy')

print(f"🌱 CROP RECOMMENDATION MODEL RESULTS:")
print(f"   Training Accuracy: {crop_train_score:.3f}")
print(f"   Testing Accuracy: {crop_test_score:.3f}")
print(f"   Cross-validation: {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:.3f})")
print(f"   Final Accuracy: {crop_test_score*100:.1f}%")

print("\n🏭 STEP 4: MODEL 3 - PRICE PREDICTION")
print("-" * 50)

# MODEL 3: Price Prediction
price_features = [
    'Crop_encoded', 'Season_encoded', 'Production', 'Area',
    'avgTemp', 'Rainfall', 'pH', 'Water_Availability_encoded'
]

X_price = df_filtered[price_features]
y_price = df_filtered['AVG_Price']

mask = ~(X_price.isnull().any(axis=1) | y_price.isnull())
X_price = X_price[mask]
y_price = y_price[mask]

X_price_train, X_price_test, y_price_train, y_price_test = train_test_split(
    X_price, y_price, test_size=0.2, random_state=42
)

model_price = RandomForestRegressor(
    n_estimators=300, max_depth=18, random_state=42, n_jobs=-1
)
model_price.fit(X_price_train, y_price_train)

price_test_score = model_price.score(X_price_test, y_price_test)
print(f"💰 PRICE PREDICTION ACCURACY: {price_test_score*100:.1f}%")

print("\n💾 STEP 5: SAVING OPTIMIZED MODELS")
print("-" * 40)

# Save all models
joblib.dump(model_production, 'trained_models/production_model.pkl')
joblib.dump(model_crop, 'trained_models/crop_model.pkl')
joblib.dump(model_price, 'trained_models/price_model.pkl')
joblib.dump(label_encoders, 'trained_models/label_encoders.pkl')
joblib.dump(selector, 'trained_models/feature_selector.pkl')

# Save feature lists
joblib.dump(production_features, 'trained_models/production_features.pkl')
joblib.dump(selected_features, 'trained_models/crop_features.pkl')  # Save selected features
joblib.dump(price_features, 'trained_models/price_features.pkl')
joblib.dump(soil_ph_map, 'trained_models/soil_ph_map.pkl')

# Save crop stats
crop_stats = df_filtered.groupby('Crop').agg({
    'Production': 'mean', 'Area': 'mean', 'AVG_Price': 'mean'
}).reset_index()
crop_stats.to_csv('data/crop_stats.csv', index=False)

# Save model metadata
model_info = {
    'production_model': {'type': 'Random Forest Regressor', 'accuracy': prod_test_score},
    'crop_model': {
        'type': 'Optimized Random Forest Classifier',
        'accuracy': crop_test_score,
        'cv_accuracy': cv_scores.mean(),
        'selected_features': selected_features
    },
    'price_model': {'type': 'Random Forest Regressor', 'accuracy': price_test_score},
    'major_crops': major_crops,
    'soil_ph_map': soil_ph_map
}
joblib.dump(model_info, 'trained_models/model_info.pkl')

print("✅ All optimized models saved successfully!")

print(f"\n🎯 FINAL OPTIMIZED RESULTS")
print("=" * 70)
print(f"🌾 Production Model Accuracy: {prod_test_score*100:.1f}%")
print(f"🌱 Crop Recommendation Accuracy: {crop_test_score*100:.1f}%")
print(f"💰 Price Prediction Accuracy: {price_test_score*100:.1f}%")
print("=" * 70)

# Feature importance
print(f"\n📊 TOP FEATURES FOR CROP PREDICTION:")
feature_importance = pd.DataFrame({
    'feature': selected_features,
    'importance': model_crop.feature_importances_
}).sort_values('importance', ascending=False)
print(feature_importance.head(10).to_string(index=False))

if crop_test_score >= 0.75:
    print(f"\n🏆 EXCELLENT! Achieved {crop_test_score:.1%} crop prediction accuracy!")
    print(f"🎉 Target of 70-80% accuracy ACHIEVED!")
elif crop_test_score >= 0.65:
    print(f"\n✅ GOOD! Achieved {crop_test_score:.1%} crop prediction accuracy!")
    print(f"📈 Close to 70-80% target - consider more data or features")
else:
    print(f"\n⚠️ Achieved {crop_test_score:.1%} accuracy - needs more optimization")

print(f"\n🚀 Ready to run: python main.py")