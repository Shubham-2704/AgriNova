# AgriNova Frontend

A modern React-based web application for crop prediction and agricultural insights, built with Vite and featuring a responsive design with dark/light mode support.

## 🚀 Features

- **Crop Prediction**: AI-powered crop recommendations based on location, season, soil type, and weather data
- **User Authentication**: Email/password and Google OAuth login/signup
- **Prediction History**: Store and view last 5 predictions with detailed information
- **Multi-language Support**: English and Gujarati language options
- **Dark/Light Mode**: Toggle between themes for better user experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Weather**: Live weather data integration for accurate predictions
- **Input Summary**: Detailed summary of user inputs and weather conditions

## 🛠️ Tech Stack

- **Framework**: React 18 with Vite
- **Routing**: React Router DOM
- **Styling**: CSS3 with CSS Variables for theming
- **Authentication**: Google OAuth 2.0 (@react-oauth/google)
- **HTTP Client**: Axios for API communication
- **Internationalization**: react-i18next for multi-language support
- **Icons**: Lucide React for modern icons
- **State Management**: React Context API

## 📋 Prerequisites

Before running the frontend, make sure you have:

- **Node.js** (version 16.0 or higher)
- **npm** or **yarn** package manager
- **Backend API** running on `http://localhost:8000`

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AgriNova/Frontend
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env` file in the Frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

**Required Environment Variables:**
- `VITE_API_BASE_URL`: Backend API base URL
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth 2.0 Client ID for authentication

### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
Frontend/
├── public/                 # Static assets
│   ├── favicon.svg        # Application favicon
│   └── vite.svg          # Vite logo
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Footer.jsx    # Application footer
│   │   ├── Navbar.jsx    # Navigation bar
│   │   ├── Toast.jsx     # Toast notifications
│   │   └── ...
│   ├── context/          # React Context providers
│   │   ├── AuthContext.jsx        # Authentication state
│   │   ├── PredictionContext.jsx  # Prediction history
│   │   └── ThemeContext.jsx       # Dark/light theme
│   ├── pages/            # Page components
│   │   ├── auth/         # Authentication pages
│   │   ├── dashboard/    # Main prediction dashboard
│   │   ├── history/      # Prediction history
│   │   ├── landing/      # Landing page
│   │   └── ...
│   ├── locales/          # Translation files
│   │   ├── en/           # English translations
│   │   └── gu/           # Gujarati translations
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # Application entry point
│   └── i18n.js           # Internationalization setup
├── .env                  # Environment variables
├── package.json          # Dependencies and scripts
└── vite.config.js        # Vite configuration
```

## 🔑 Key Components

### Authentication System
- **Login/Signup**: Email/password and Google OAuth
- **Password Reset**: OTP-based password recovery
- **Protected Routes**: Automatic redirection for authenticated users

### Prediction Dashboard
- **Form Inputs**: Location, season, soil type, water availability, land size
- **Weather Integration**: Real-time weather data display
- **AI Predictions**: Crop recommendations with confidence scores
- **Input Summary**: Detailed summary card of all inputs and conditions

### Prediction History
- **Storage**: Last 5 predictions stored in localStorage
- **Display**: Chronological list with full details
- **Management**: Delete individual predictions
- **Statistics**: Total predictions and last prediction time

### Internationalization
- **Languages**: English and Gujarati support
- **Dynamic Switching**: Real-time language switching
- **Complete Coverage**: All UI elements translated

## 🎨 Theming

The application supports both dark and light themes:

- **CSS Variables**: Consistent theming across components
- **Theme Toggle**: Easy switching between modes
- **Persistent**: Theme preference saved in localStorage
- **Responsive**: Optimized for all screen sizes

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Touch Friendly**: Large touch targets and gestures

## 🔗 API Integration

The frontend communicates with the backend through RESTful APIs:

- **Base URL**: Configured via `VITE_API_BASE_URL`
- **Authentication**: JWT token-based authentication
- **Error Handling**: Comprehensive error handling with user feedback
- **Request Interceptors**: Automatic token attachment

## 🚀 Build & Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 📄 License

This project is part of the AgriNova agricultural prediction system.
