# AgriNova - Smart Crop Recommendation System

A machine learning-powered crop recommendation system that predicts the best crops based on environmental conditions and calculates expected profit.

## Features

- Random Forest ML model for crop prediction
- Top 3 crop recommendations with suitability scores
- Profit calculation based on area and average prices
- Production estimation
- FastAPI backend
- React + Vite frontend

## Setup Instructions

### Backend Setup

1. Navigate to Backend directory:
```bash
cd AgriNova/Backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Train the model:
```bash
python train_model.py
```

4. Start the FastAPI server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to Frontend directory:
```bash
cd AgriNova/Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## API Endpoints

- `GET /` - API health check
- `GET /options` - Get available seasons, soil types, and water availability options
- `POST /predict` - Get crop recommendations

## Input Parameters

- Season (Kharif, Rabi, Summer, Whole Year)
- Soil Type (Black, Red, Loamy)
- Water Availability (High, Medium, Low)
- Land Size (in acres)
- Average Temperature (°C)
- Rainfall (mm)
- pH Level (0-14)
- Cloud Cover (%)
- Precipitation (mm)

## Output

For each recommended crop:
- Crop name
- Suitability percentage
- Profit per acre
- Total profit
- Expected production per acre
- Total production
- Average price per kg
