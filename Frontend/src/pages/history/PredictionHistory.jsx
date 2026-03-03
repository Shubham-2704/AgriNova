import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Calendar, MapPin as MapPinIcon, ArrowLeft, Zap, Thermometer, Droplets, Cloud, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { usePrediction } from '../../context/PredictionContext';
import './PredictionHistory.css';

const PredictionHistory = () => {
  const { t } = useTranslation();
  const { predictions, removePrediction } = usePrediction();
  const [selectedCrop, setSelectedCrop] = useState(null);

  const translateData = (category, value) => {
    const key = `data.${category}.${value}`;
    const translated = t(key);
    return translated === key ? value : translated;
  };

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
    <div className="history-page">
      <Navbar />

      <div className="history-container">
        <div className="history-header">
          <Link to="/dashboard" className="back-button">
            <ArrowLeft size={20} />
            {t('history.backToDashboard')}
          </Link>
          <h1>{t('history.title')}</h1>
          <p>{t('history.subtitle')}</p>
        </div>

        {predictions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Zap size={48} />
            </div>
            <h2>{t('history.noPredictions')}</h2>
            <p>{t('history.noPredictionsDesc')}</p>
            <Link to="/dashboard" className="btn btn-primary">
              {t('history.goToDashboard')}
            </Link>
          </div>
        ) : (
          <div className="history-content">
            <div className="history-stats">
              <div className="stat-card">
                <span className="stat-label">{t('history.totalPredictions')}</span>
                <span className="stat-value">{predictions.length}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">{t('history.lastPrediction')}</span>
                <span className="stat-value">{formatPredictionTime(predictions[0].predictedAt)}</span>
              </div>
            </div>

            <div className="predictions-list">
              {predictions.map((prediction) => (
                <div key={prediction.id} className="input-summary-card">
                  <div className="prediction-header">
                    <div className="prediction-time">
                      <Calendar size={16} />
                      <span>{formatPredictionTime(prediction.predictedAt)}</span>
                    </div>
                    <button
                      className="btn-delete"
                      onClick={() => removePrediction(prediction.id)}
                      title="Delete prediction"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="summary-label">{t('dashboard.location')}:</span>
                      <span className="summary-value">
                        <MapPinIcon size={14} />
                        {translateData('cities', prediction.formData.city)}, {t(`data.states.${prediction.formData.state}`) || prediction.formData.state}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">{t('dashboard.season')}:</span>
                      <span className="summary-value">{translateData('seasons', prediction.formData.season)}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">{t('dashboard.soilType')}:</span>
                      <span className="summary-value">{translateData('soilTypes', prediction.formData.soil_type)}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">{t('dashboard.waterAvailability')}:</span>
                      <span className="summary-value">{translateData('waterAvailability', prediction.formData.water_availability)}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">{t('dashboard.landSize')}:</span>
                      <span className="summary-value">{prediction.formData.area} {t('dashboard.acres')}</span>
                    </div>
                  </div>

                  {prediction.weatherData && (
                    <div className="summary-weather">
                      <h4>{t('dashboard.liveWeather')} {translateData('cities', prediction.formData.city)}</h4>
                      <div className="weather-summary-grid">
                        <div className="weather-summary-item">
                          <span className="weather-summary-label">
                            <Thermometer size={14} />
                            {t('dashboard.weather.temp')}
                          </span>
                          <span className="weather-summary-value">{prediction.weatherData.avg_temp}°C</span>
                        </div>
                        <div className="weather-summary-item">
                          <span className="weather-summary-label">
                            <Droplets size={14} />
                            {t('dashboard.weather.rain')}
                          </span>
                          <span className="weather-summary-value">{prediction.weatherData.rainfall} mm</span>
                        </div>
                        <div className="weather-summary-item">
                          <span className="weather-summary-label">
                            <Cloud size={14} />
                            {t('dashboard.weather.cloud')}
                          </span>
                          <span className="weather-summary-value">{prediction.weatherData.cloud_cover}%</span>
                        </div>
                        <div className="weather-summary-item">
                          <span className="weather-summary-label">{t('dashboard.weather.vapor')}</span>
                          <span className="weather-summary-value">{prediction.weatherData.vap_pressure} mm</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="prediction-crops">
                    <span className="crops-label">{t('dashboard.allCrops')}:</span>
                    <div className="crops-list">
                      {prediction.recommendations.map((crop, idx) => (
                        <button
                          key={idx}
                          className="crop-tag"
                          onClick={() => setSelectedCrop(crop)}
                        >
                          {translateData('crops', crop.crop)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
                  <span className="detail-title">{t('dashboard.profitPerAcre')}</span>
                  <span className="detail-amount">₹{selectedCrop.profit_per_acre.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
                <div className="detail-box">
                  <span className="detail-title">{t('dashboard.productionPerAcre')}</span>
                  <span className="detail-amount">{selectedCrop.expected_production.toLocaleString('en-IN', {maximumFractionDigits: 0})} kg</span>
                </div>
                <div className="detail-box">
                  <span className="detail-title">{t('dashboard.avgPrice')}</span>
                  <span className="detail-amount">₹{selectedCrop.avg_price.toFixed(2)}/kg</span>
                </div>
                <div className="detail-box highlight">
                  <span className="detail-title">{t('dashboard.totalProfit')}</span>
                  <span className="detail-amount">₹{selectedCrop.total_profit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PredictionHistory;
