export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_PATHS = {
  PREDICTION: {
    GET_OPTIONS: "/api/options",
    PREDICT_CROPS: "/api/predict",
    GET_WEATHER: (state, city) => `/api/weather/${state}/${city}`,
  },
  AUTH: {
    REGISTER: "/api/auth/register", 
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    VERIFY_OTP: "/api/auth/verify-reset-otp",
    RESET_PASSWORD: "/api/auth/reset-password",
    GOOGLE_AUTH: "/api/auth/google",
  },
  CONTACT: {
    SUBMIT: "/api/contact/submit",
  },
};
