# AgriNova Backend

AI-powered crop recommendation system using FastAPI and Machine Learning.

## 📁 Project Structure

```
Backend/
├── models/                      # Pydantic models for request/response
│   └── prediction_model.py
├── controllers/                 # Business logic
│   └── prediction_controller.py
├── routes/                      # API route definitions
│   └── prediction_routes.py
├── data/                        # CSV datasets
│   ├── Final_dataset.csv
│   └── crop_stats.csv
├── trained_models/              # ML model files (.pkl)
│   ├── crop_model.pkl
│   ├── crop_encoder.pkl
│   ├── label_encoders.pkl
│   ├── scaler.pkl
│   └── feature_cols.pkl
├── main.py                      # FastAPI application entry point
├── train_model.py               # ML model training script
└── requirements.txt             # Python dependencies
```

## 🚀 Setup

1. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Train the model (first time only):**
```bash
python train_model.py
```

This will create:
- `trained_models/` folder with all .pkl files
- `data/crop_stats.csv` with aggregated crop statistics

4. **Run the server:**
```bash
python main.py
```

Server will start at `http://localhost:8000`

## 📡 API Endpoints

### Base URL: `http://localhost:8000/api`

- `GET /` - API health check
- `GET /options` - Get available options (states, cities, seasons, etc.)
- `POST /predict` - Get crop recommendations
- `GET /weather/{state}/{city}` - Get weather data for a city

## 📝 API Usage Example

```python
import requests

# Get crop recommendations
response = requests.post('http://localhost:8000/api/predict', json={
    "state": "Gujarat",
    "city": "Ahmedabad",
    "season": "Kharif",
    "soil_type": "Black",
    "water_availability": "High",
    "area": 10.5
})

recommendations = response.json()
```

## 🔧 Development

- Models are defined in `models/`
- Business logic in `controllers/`
- Routes registered in `routes/`
- Main app in `main.py`

## 📊 Model Information

- **Algorithm:** Random Forest Classifier
- **Features:** Season, Soil Type, Water Availability, Weather Data
- **Accuracy:** 90%+
- **Output:** Top 6 crop recommendations with suitability scores
