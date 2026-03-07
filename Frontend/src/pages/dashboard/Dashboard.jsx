import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Loader, Cloud, Droplets, Thermometer, AlertTriangle, Trash2, Calendar, MapPin as MapPinIcon, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { usePrediction } from '../../context/PredictionContext';
import './Dashboard.css';

const Dashboard = () => {
  const { t } = useTranslation();
  const { predictions, savePrediction, removePrediction } = usePrediction();
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
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [lastPredictionData, setLastPredictionData] = useState(null);

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
      
      // Save prediction data for display
      setLastPredictionData({
        formData,
        weatherData
      });
      
      // Save to localStorage with weather data
      savePrediction(formData, response.data, weatherData);
      
      // Clear form inputs and weather data
      setFormData({
        state: formData.state,
        city: '',
        season: '',
        soil_type: '',
        water_availability: '',
        area: ''
      });
      setWeatherData(null);
    } catch (err) {
      setError(err.response?.data?.detail || t('dashboard.errorRecommendations'));
    } finally {
      setLoading(false);
    }
  };

  const displayedCrops = showAllCrops ? recommendations : recommendations.slice(0, 3);
  const hasMoreCrops = recommendations.length > 3;
  const translateData = (category, value) => {
    const key = `data.${category}.${value}`;
    const translated = t(key);
    // If translation key doesn't exist, return original value
    return translated === key ? value : translated;
  };

  // Format date and time
  const formatPredictionTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            <div className="farm-details-header">
              <h2>{t('dashboard.farmDetails')}</h2>
              {predictions.length > 0 && (
                <Link to="/history" className="btn btn-secondary">
                  {t('dashboard.viewHistory')}
                </Link>
              )}
            </div>
            
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
              {/* Input Summary Card */}
              {lastPredictionData && (
                <div className="input-summary-card">
                  <h3>📋 {t('dashboard.yourInputSummary')}</h3>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="summary-label">{t('dashboard.location')}:</span>
                      <span className="summary-value">
                        {translateData('cities', lastPredictionData.formData.city)}, {t(`data.states.${lastPredictionData.formData.state}`) || lastPredictionData.formData.state}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">{t('dashboard.season')}:</span>
                      <span className="summary-value">{lastPredictionData.formData.season ? translateData('seasons', lastPredictionData.formData.season) : '-'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">{t('dashboard.soilType')}:</span>
                      <span className="summary-value">{lastPredictionData.formData.soil_type ? translateData('soilTypes', lastPredictionData.formData.soil_type) : '-'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">{t('dashboard.waterAvailability')}:</span>
                      <span className="summary-value">{lastPredictionData.formData.water_availability ? translateData('waterAvailability', lastPredictionData.formData.water_availability) : '-'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">{t('dashboard.landSize')}:</span>
                      <span className="summary-value">{lastPredictionData.formData.area} {t('dashboard.acres')}</span>
                    </div>
                  </div>

                  {lastPredictionData.weatherData && (
                    <div className="summary-weather">
                      <h4>{t('dashboard.liveWeather')} {translateData('cities', lastPredictionData.formData.city)}</h4>
                      <div className="weather-summary-grid">
                        <div className="weather-summary-item">
                          <span className="weather-summary-label">
                            <Thermometer size={14} />
                            {t('dashboard.weather.temp')}
                          </span>
                          <span className="weather-summary-value">{lastPredictionData.weatherData.avg_temp}°C</span>
                        </div>
                        <div className="weather-summary-item">
                          <span className="weather-summary-label">
                            <Droplets size={14} />
                            {t('dashboard.weather.rain')}
                          </span>
                          <span className="weather-summary-value">{lastPredictionData.weatherData.rainfall} mm</span>
                        </div>
                        <div className="weather-summary-item">
                          <span className="weather-summary-label">
                            <Cloud size={14} />
                            {t('dashboard.weather.cloud')}
                          </span>
                          <span className="weather-summary-value">{lastPredictionData.weatherData.cloud_cover}%</span>
                        </div>
                        <div className="weather-summary-item">
                          <span className="weather-summary-label">{t('dashboard.weather.vapor')}</span>
                          <span className="weather-summary-value">{lastPredictionData.weatherData.vap_pressure} mm</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <h2>{t('dashboard.topRecommended')} {showAllCrops ? '6' : '3'} {t('dashboard.recommendedCrops')}</h2>
              
              <div className="crops-grid">
                {displayedCrops.map((rec, idx) => (
                  <div key={idx} className="crop-card" onClick={() => setSelectedCrop(rec)}>
                    <div className="crop-header">
                      <div className="crop-header-left">
                        <span className="crop-rank">{idx + 1}</span>
                        <h3>{translateData('crops', rec.crop)}</h3>
                      </div>
                      {/* <div className="crop-match-badge">
                        {rec.suitability.toFixed(0)}% MATCH
                      </div> */}
                    </div>
                    <div className="crop-body">
                      <div className="crop-stat">
                        <span className="stat-label">{t('dashboard.profitPerAcre')}</span>
                        <span className="stat-value">{rec.profit_per_acre_formatted?.replace(' ', '') || `₹${rec.profit_per_acre.toLocaleString('en-IN', {maximumFractionDigits: 0})}`}</span>
                      </div>
                      <div className="crop-stat">
                        <span className="stat-label">{t('dashboard.productionPerAcre')}</span>
                        <span className="stat-value">{rec.expected_production.toLocaleString('en-IN', {maximumFractionDigits: 0})} kg</span>
                      </div>
                      <div className="crop-stat">
                        <span className="stat-label">{t('dashboard.avgPrice')}</span>
                        <span className="stat-value">₹{rec.avg_price.toFixed(2)}/kg</span>
                      </div>
                      <div className="crop-stat highlight">
                        <span className="stat-label">{t('dashboard.totalProfit')}</span>
                        <span className="stat-value">{rec.total_profit_formatted?.replace(' ', '') || `₹${rec.total_profit.toLocaleString('en-IN', {maximumFractionDigits: 0})}`}</span>
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

      {/* Crop Detail Modal */}
      {selectedCrop && (
        <div className="modal-overlay" onClick={() => setSelectedCrop(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setSelectedCrop(null)}
            >
              <X size={24} />
            </button>
            
            <div className="modal-header">
              <h2>{translateData('crops', selectedCrop.crop)}</h2>
            </div>

            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-box">
                  <span className="detail-title">Profit Per Acre</span>
                  <span className="detail-amount">₹{selectedCrop.profit_per_acre.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div className="detail-box">
                  <span className="detail-title">Expected Production</span>
                  <span className="detail-amount">{selectedCrop.expected_production.toLocaleString('en-IN', {maximumFractionDigits: 0})} kg</span>
                </div>
                <div className="detail-box">
                  <span className="detail-title">Average Price</span>
                  <span className="detail-amount">₹{selectedCrop.avg_price.toFixed(2)}/kg</span>
                </div>
                <div className="detail-box highlight">
                  <span className="detail-title">Total Profit</span>
                  <span className="detail-amount">₹{selectedCrop.total_profit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
              </div>

              {weatherData && (
                <div className="weather-section">
                  <h3>Live Weather Data</h3>
                  <div className="weather-detail-grid">
                    <div className="weather-detail-box">
                      <span className="weather-detail-label">{t('dashboard.weather.temp')}</span>
                      <span className="weather-detail-value">{weatherData.avg_temp}°C</span>
                    </div>
                    <div className="weather-detail-box">
                      <span className="weather-detail-label">{t('dashboard.weather.rain')}</span>
                      <span className="weather-detail-value">{weatherData.rainfall} mm</span>
                    </div>
                    <div className="weather-detail-box">
                      <span className="weather-detail-label">{t('dashboard.weather.cloud')}</span>
                      <span className="weather-detail-value">{weatherData.cloud_cover}%</span>
                    </div>
                    <div className="weather-detail-box">
                      <span className="weather-detail-label">{t('dashboard.weather.vapor')}</span>
                      <span className="weather-detail-value">{weatherData.vap_pressure} mm</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer Section */}
      <div className="dashboard-disclaimer">
        <div className="disclaimer-container">
          <div className="disclaimer-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="disclaimer-content">
            <h3>{t('dashboard.disclaimer.title')}</h3>
            <p>{t('dashboard.disclaimer.description')}</p>
            <p className="disclaimer-footer">
              {t('dashboard.disclaimer.legal')} <Link to="/terms">{t('dashboard.disclaimer.terms')}</Link> {t('dashboard.disclaimer.and')} <Link to="/privacy-policy">{t('dashboard.disclaimer.privacy')}</Link>.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;