# AgriNova Backend

A robust FastAPI-based backend service for crop prediction and agricultural insights, featuring machine learning integration, user authentication, and real-time weather data processing.

## 🚀 Features

- **Crop Prediction API**: Machine learning-powered crop recommendations
- **User Authentication**: JWT-based auth with Google OAuth 2.0 support
- **Weather Integration**: Real-time weather data from OpenWeatherMap API
- **Email Services**: OTP-based password recovery using Resend API
- **Database Management**: MongoDB integration with async operations
- **Contact System**: Email-based contact form handling
- **Security**: Password hashing, JWT tokens, and CORS protection
- **Scalable Architecture**: Modular design with separation of concerns

## 🛠️ Tech Stack

- **Framework**: FastAPI (Python 3.8+)
- **Database**: MongoDB with Motor (async driver)
- **Authentication**: JWT tokens, Google OAuth 2.0
- **Machine Learning**: Scikit-learn, Pandas, NumPy
- **Email Service**: Resend API for transactional emails
- **Weather API**: OpenWeatherMap API
- **HTTP Client**: HTTPX for async HTTP requests
- **Validation**: Pydantic models for data validation
- **Environment**: Python-dotenv for configuration

## 📋 Prerequisites

Before running the backend, ensure you have:

- **Python 3.8+** installed
- **MongoDB** database (local or cloud)
- **API Keys** for external services:
  - OpenWeatherMap API key
  - Google OAuth 2.0 credentials
  - Resend API key for emails

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AgriNova/Backend
```

### 2. Create Virtual Environment
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Configuration
Create a `.env` file in the Backend directory:

```env
# Database
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/

# JWT Security
JWT_SECRET_KEY=your_super_secret_jwt_key_here

# Frontend URL
FRONTEND_URL=http://localhost:5173/

# Email Service (Resend)
RESEND_API_URL=https://api.resend.com/emails
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=AgriNova <support@yourdomain.com>

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here

# Admin Configuration
ADMIN_EMAIL=admin@yourdomain.com

# Weather API
OPENWEATHERMAP_API_KEY=your_openweathermap_api_key_here

# Environment
ENVIRONMENT=development
```

### 5. Prepare Machine Learning Models

#### Option 1: Train New Models (Recommended)
```bash
# Create the trained_models directory
mkdir trained_models

# Train the machine learning models
python train_simple_model.py
```

This will generate all required model files:
- `crop_model.pkl` - Main prediction model
- `scaler.pkl` - Feature scaler
- `label_encoders.pkl` - Label encoders
- `feature_selector.pkl` - Feature selector
- `crop_encoder.pkl` - Crop encoder
- `feature_cols.pkl` - Feature columns

### 6. Start the Server
```bash
# Development
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production
uvicorn main:app --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## 📁 Project Structure

```
Backend/
├── config/                 # Configuration modules
│   ├── constants.py       # Application constants
│   └── database.py        # MongoDB connection setup
├── controllers/           # Request handlers
│   ├── auth_controller.py      # Authentication logic
│   ├── contact_controller.py   # Contact form handling
│   └── prediction_controller.py # Crop prediction logic
├── data/                  # Data files
│   ├── crop_stats.csv     # Crop statistics
│   ├── Final_dataset.csv  # Training dataset
│   └── gujarat_*.json     # Gujarat-specific data
├── middlewares/           # Custom middleware
│   └── auth_middlewares.py # JWT authentication middleware
├── models/                # Pydantic models
│   ├── auth_model.py      # Authentication models
│   ├── contact_model.py   # Contact form models
│   └── prediction_model.py # Prediction models
├── routes/                # API route definitions
│   ├── auth_routes.py     # Authentication endpoints
│   ├── contact_routes.py  # Contact endpoints
│   └── prediction_routes.py # Prediction endpoints
├── templates/             # Email templates
│   ├── contact_admin_email.html
│   ├── contact_user_email.html
│   └── otp_email.html
├── trained_models/        # ML model files
│   ├── crop_model.pkl
│   ├── scaler.pkl
│   └── ...
├── utils/                 # Utility functions
│   ├── auth.py           # JWT and Google auth utilities
│   ├── email.py          # Email sending utilities
│   ├── hash.py           # Password hashing
│   ├── helper.py         # General helpers
│   └── otp.py            # OTP generation
├── .env                  # Environment variables
├── main.py               # FastAPI application entry point
├── requirements.txt      # Python dependencies
└── train_simple_model.py # Model training script
```

## 🤖 Machine Learning Pipeline

### Model Architecture
- **Algorithm**: Random Forest Classifier
- **Features**: Location, season, soil type, water availability, land size, weather data
- **Output**: Top 5 crop recommendations with confidence scores

### Data Processing
1. **Feature Engineering**: Categorical encoding, numerical scaling
2. **Weather Integration**: Real-time weather data incorporation
3. **Prediction**: Model inference with confidence scoring
4. **Post-processing**: Result formatting and ranking

### Model Files
- **crop_model.pkl**: Trained Random Forest model
- **scaler.pkl**: StandardScaler for numerical features
- **label_encoders.pkl**: LabelEncoders for categorical features
- **feature_selector.pkl**: Feature selection transformer
- **crop_encoder.pkl**: Crop name encoder
- **feature_cols.pkl**: Feature column names

## 🔐 Security Features

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password security
- **Google OAuth**: Secure third-party authentication
- **Token Expiration**: 7-day token validity

### API Security
- **CORS**: Cross-origin resource sharing configuration
- **Input Validation**: Pydantic model validation
- **Error Handling**: Secure error responses
- **Rate Limiting**: Protection against abuse

## 🌤️ Weather Integration

### OpenWeatherMap API
- **Current Weather**: Real-time weather conditions
- **Location-based**: Weather data for specific coordinates
- **Parameters**: Temperature, rainfall, cloud cover, vapor pressure
- **Error Handling**: Fallback for API failures

### Weather Data Processing
```python
# Weather parameters used in prediction
- Temperature (°C)
- Rainfall (mm)
- Cloud Cover (%)
- Vapor Pressure (hPa)
```

## 📧 Email Services

### Resend API Integration
- **OTP Emails**: Password reset verification
- **Contact Forms**: User inquiry handling
- **Templates**: HTML email templates
- **Error Handling**: Robust email delivery

### Email Templates
- **OTP Email**: Password reset verification
- **Contact Confirmation**: User inquiry confirmation
- **Admin Notification**: New contact form submissions


## 🚀 Deployment

### Development
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production
```bash
# Using Gunicorn with Uvicorn workers
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Or direct Uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Performance Optimization

- **Database Indexing**: Create indexes on frequently queried fields
- **Connection Pooling**: Configure MongoDB connection pool
- **Async Operations**: Use async/await for I/O operations

## 📄 API Documentation

FastAPI automatically generates interactive API documentation:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI Schema**: `http://localhost:8000/openapi.json`


## 📄 License

This project is part of the AgriNova agricultural prediction system.

## 📞 Support

For technical support or questions about the backend setup, please refer to the main project documentation or contact the development team.