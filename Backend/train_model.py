import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib

# Load dataset
df = pd.read_csv('Final_dataset.csv')

# Remove rows with missing target (Crop)
df = df.dropna(subset=['Crop'])

# Handle missing values in numerical columns
numerical_cols = ['avgTemp', 'Rainfall', 'pH', 'Cloud Cover', 'Precipitation', 
                  'Production', 'Area', 'AVG_Price', 'maxTemp', 'minTemp', 
                  'vapPressure', 'Wet Day Freq']
for col in numerical_cols:
    if col in df.columns:
        df[col] = df[col].fillna(df[col].median())

# Handle missing values in categorical columns
categorical_cols = ['State', 'City', 'Season', 'Soil Type', 'Water_Availability']
for col in categorical_cols:
    if col in df.columns:
        df[col] = df[col].fillna(df[col].mode()[0])

# Prepare features and target
label_encoders = {}

for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

# Enhanced features - using more environmental data
feature_cols = ['Season', 'Soil Type', 'Water_Availability', 'avgTemp', 'Rainfall', 
                'pH', 'Cloud Cover', 'Precipitation', 'maxTemp', 'minTemp', 
                'vapPressure', 'Wet Day Freq']

# Remove any remaining NaN values
df = df.dropna(subset=feature_cols + ['Crop'])

X = df[feature_cols]
y_crop = df['Crop']

# Encode crop labels
crop_encoder = LabelEncoder()
y_crop_encoded = crop_encoder.fit_transform(y_crop)

# Scale numerical features for better performance
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train Random Forest model with optimized hyperparameters
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_crop_encoded, 
                                                      test_size=0.2, random_state=42, 
                                                      stratify=y_crop_encoded)

rf_model = RandomForestClassifier(
    n_estimators=300,
    max_depth=30,
    min_samples_split=5,
    min_samples_leaf=2,
    max_features='sqrt',
    random_state=42,
    n_jobs=-1
)

rf_model.fit(X_train, y_train)

# Save model, encoders, and scaler
joblib.dump(rf_model, 'crop_model.pkl')
joblib.dump(crop_encoder, 'crop_encoder.pkl')
joblib.dump(label_encoders, 'label_encoders.pkl')
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(feature_cols, 'feature_cols.pkl')

# Save crop production and price data (using original crop names before encoding)
df_original = pd.read_csv('Final_dataset.csv')
df_original = df_original.dropna(subset=['Crop', 'Production', 'Area', 'AVG_Price'])
crop_stats = df_original.groupby('Crop').agg({
    'Production': 'mean',
    'Area': 'mean',
    'AVG_Price': 'mean'
}).reset_index()
crop_stats.to_csv('crop_stats.csv', index=False)

# Evaluate model
train_accuracy = rf_model.score(X_train, y_train)
test_accuracy = rf_model.score(X_test, y_test)

print("=" * 60)
print("Model Training Completed Successfully!")
print("=" * 60)
print(f"Training Accuracy: {train_accuracy:.2%}")
print(f"Testing Accuracy: {test_accuracy:.2%}")
print(f"Total samples used: {len(X)}")
print(f"Number of unique crops: {len(crop_encoder.classes_)}")
print(f"Features used: {len(feature_cols)}")
print("=" * 60)

# Show feature importance
feature_importance = pd.DataFrame({
    'feature': feature_cols,
    'importance': rf_model.feature_importances_
}).sort_values('importance', ascending=False)

print("\nTop 5 Most Important Features:")
print(feature_importance.head().to_string(index=False))
