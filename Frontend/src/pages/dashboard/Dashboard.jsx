import { useState, useEffect } from 'react';
import { TrendingUp, Loader, Cloud, MapPin, Droplets, Thermometer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import './Dashboard.css';

const Dashboard = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    state: 'Gujarat',
    city: '',
    season: '',
    soil_type: '',
    water_availability: '',
    area: ''
  });

  const [options, setOptions] = useState({
    states: [],
    cities: [],
    seasons: [],
    soil_types: [],
    water_availability: []
  });

  const [weatherData, setWeatherData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [showAllCrops, setShowAllCrops] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    if (formData.city && formData.state) {
      fetchWeatherData();
    }
  }, [formData.city, formData.state]);

  const fetchOptions = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.PREDICTION.GET_OPTIONS);
      setOptions(response.data);
      if (response.data.states && response.data.states.length > 0) {
        setFormData(prev => ({
          ...prev,
          state: response.data.states[0]
        }));
      }
    } catch (err) {
      console.error('Error fetching options:', err);
      setError(t('dashboard.errorLoadOptions'));
    }
  };

  const fetchWeatherData = async () => {
    setLoadingWeather(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.PREDICTION.GET_WEATHER(formData.state, formData.city)
      );
      setWeatherData(response.data);
    } catch (err) {
      console.error('Error fetching weather:', err);
    } finally {
      setLoadingWeather(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowAllCrops(false);
    
    try {
      const payload = {
        state: formData.state,
        city: formData.city,
        season: formData.season,
        soil_type: formData.soil_type,
        water_availability: formData.water_availability,
        area: parseFloat(formData.area)
      };

      const response = await axiosInstance.post(API_PATHS.PREDICTION.PREDICT_CROPS, payload);
      setRecommendations(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || t('dashboard.errorRecommendations'));
    } finally {
      setLoading(false);
    }
  };

  const displayedCrops = showAllCrops ? recommendations : recommendations.slice(0, 3);
  const hasMoreCrops = recommendations.length > 3;

  // Helper function to translate dynamic data
  const translateData = (category, value) => {
    const key = `data.${category}.${value}`;
    const translated = t(key);
    // If translation key doesn't exist, return original value
    return translated === key ? value : translated;
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>{t('dashboard.title')}</h1>
          <p>{t('dashboard.subtitle')}</p>
        </div>

        <div className="dashboard-content">
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="prediction-form">
            <h2>{t('dashboard.farmDetails')}</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label>{t('dashboard.state')}</label>
                <select name="state" value={formData.state} onChange={handleChange} required>
                  <option value="">{t('dashboard.selectState')}</option>
                  {options.states && options.states.length > 0 ? (
                    options.states.map(s => <option key={s} value={s}>{s}</option>)
                  ) : (
                    <option value="Gujarat">Gujarat</option>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>{t('dashboard.city')}</label>
                <select name="city" value={formData.city} onChange={handleChange} required>
                  <option value="">{t('dashboard.selectCity')}</option>
                  {options.cities && options.cities.length > 0 && options.cities.map(c => (
                    <option key={c} value={c}>{translateData('cities', c)}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>{t('dashboard.season')}</label>
                <select name="season" value={formData.season} onChange={handleChange} required>
                  <option value="">{t('dashboard.selectSeason')}</option>
                  {options.seasons && options.seasons.length > 0 && options.seasons.map(s => (
                    <option key={s} value={s}>{translateData('seasons', s)}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>{t('dashboard.soilType')}</label>
                <select name="soil_type" value={formData.soil_type} onChange={handleChange} required>
                  <option value="">{t('dashboard.selectSoilType')}</option>
                  {options.soil_types && options.soil_types.length > 0 && options.soil_types.map(s => (
                    <option key={s} value={s}>{translateData('soilTypes', s)}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>{t('dashboard.waterAvailability')}</label>
                <select name="water_availability" value={formData.water_availability} onChange={handleChange} required>
                  <option value="">{t('dashboard.selectWaterSource')}</option>
                  {options.water_availability && options.water_availability.length > 0 && options.water_availability.map(w => (
                    <option key={w} value={w}>{translateData('waterAvailability', w)}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>{t('dashboard.landSize')}</label>
                <input 
                  type="number" 
                  name="area" 
                  step="0.01" 
                  min="0.01" 
                  value={formData.area} 
                  onChange={handleChange} 
                  placeholder={t('dashboard.enterLandSize')}
                  required 
                />
              </div>
            </div>

            {/* Weather Data */}
            {weatherData && (
              <div className="weather-info">
                <h3>
                  <Cloud size={20} />
                  {t('dashboard.liveWeather')} {formData.city}
                </h3>
                <div className="weather-grid">
                  <div className="weather-item">
                    <span className="weather-label">
                      <Thermometer size={16} style={{ marginRight: '4px' }} />
                      {t('dashboard.avgTemp')}
                    </span>
                    <span className="weather-value">{weatherData.avg_temp}°C</span>
                  </div>
                  <div className="weather-item">
                    <span className="weather-label">{t('dashboard.cloudCover')}</span>
                    <span className="weather-value">{weatherData.cloud_cover}%</span>
                  </div>
                  <div className="weather-item">
                    <span className="weather-label">
                      <Droplets size={16} style={{ marginRight: '4px' }} />
                      {t('dashboard.rainfall')}
                    </span>
                    <span className="weather-value">{weatherData.rainfall} mm</span>
                  </div>
                  <div className="weather-item">
                    <span className="weather-label">{t('dashboard.vapPressure')}</span>
                    <span className="weather-value">{weatherData.vap_pressure} mm</span>
                  </div>
                </div>
              </div>
            )}

            {loadingWeather && (
              <div className="loading-weather">
                <Loader className="spin" size={16} style={{ marginRight: '8px' }} />
                {t('dashboard.fetchingWeather')}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary btn-block" 
              disabled={loading || !weatherData}
            >
              {loading ? (
                <>
                  <Loader className="spin" size={18} />
                  {t('dashboard.analyzing')}
                </>
              ) : (
                <>
                  <TrendingUp size={18} />
                  {t('dashboard.getRecommendations')}
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="recommendations-section">
              <h2>{t('dashboard.topRecommended')} {showAllCrops ? '6' : '3'} {t('dashboard.recommendedCrops')}</h2>
              
              <div className="crops-grid">
                {displayedCrops.map((rec, idx) => (
                  <div key={idx} className="crop-card">
                    <div className="crop-header">
                      <span className="crop-rank">{idx + 1}</span>
                      <h3>{translateData('crops', rec.crop)}</h3>
                    </div>
                    <div className="crop-body">
                      <div className="crop-stat">
                        <span className="stat-label">{t('dashboard.suitability')}</span>
                        <span className="stat-value">{rec.suitability.toFixed(1)}%</span>
                      </div>
                      <div className="crop-stat">
                        <span className="stat-label">{t('dashboard.profitPerAcre')}</span>
                        <span className="stat-value">₹{rec.profit_per_acre.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                      </div>
                      <div className="crop-stat highlight">
                        <span className="stat-label">{t('dashboard.totalProfit')}</span>
                        <span className="stat-value">₹{rec.total_profit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                      </div>
                      <div className="crop-stat">
                        <span className="stat-label">{t('dashboard.productionPerAcre')}</span>
                        <span className="stat-value">{rec.expected_production.toFixed(2)} kg</span>
                      </div>
                      <div className="crop-stat">
                        <span className="stat-label">{t('dashboard.avgPrice')}</span>
                        <span className="stat-value">₹{rec.avg_price.toFixed(2)}/kg</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Show More Button */}
              {hasMoreCrops && (
                <div className="show-more-container">
                  <button 
                    className="btn-secondary" 
                    onClick={() => setShowAllCrops(!showAllCrops)}
                  >
                    {showAllCrops ? t('dashboard.showLess') : t('dashboard.showMore')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;