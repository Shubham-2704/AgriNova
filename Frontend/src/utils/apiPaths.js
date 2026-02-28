export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_PATHS = {
  PREDICTION: {
    GET_OPTIONS: "/api/options",
    PREDICT_CROPS: "/api/predict",
    GET_WEATHER: (state, city) => `/api/weather/${state}/${city}`,
  },
};
