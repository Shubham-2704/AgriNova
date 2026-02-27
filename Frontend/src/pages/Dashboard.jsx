import { useState, useEffect } from 'react'
import axios from 'axios'
import { TrendingUp, Loader } from 'lucide-react'
import Navbar from '../components/Navbar'
import './Dashboard.css'

const API_URL = 'http://localhost:8000'

const Dashboard = () => {
  const [formData, setFormData] = useState({
    state: 'Gujarat',
    city: '',
    season: '',
    soil_type: '',
    water_availability: '',
    area: ''
  })

  const [options, setOptions] = useState({
    states: [],
    cities: [],
    seasons: [],
    soil_types: [],
    water_availability: []
  })

  const [weatherData, setWeatherData] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [showAllCrops, setShowAllCrops] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingWeather, setLoadingWeather] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOptions()
  }, [])

  useEffect(() => {
    if (formData.city && formData.state) {
      fetchWeatherData()
    }
  }, [formData.city, formData.state])

  const fetchOptions = async () => {
    try {
      const response = await axios.get(`${API_URL}/options`)
      setOptions(response.data)
      if (response.data.states && response.data.states.length > 0) {
        setFormData(prev => ({
          ...prev,
          state: response.data.states[0]
        }))
      }
    } catch (err) {
      console.error('Error fetching options:', err)
      setError('Failed to load options. Please make sure the backend is running.')
    }
  }

  const fetchWeatherData = async () => {
    setLoadingWeather(true)
    try {
      const response = await axios.get(`${API_URL}/weather/${formData.state}/${formData.city}`)
      setWeatherData(response.data)
    } catch (err) {
      console.error('Error fetching weather:', err)
    } finally {
      setLoadingWeather(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setShowAllCrops(false)
    
    try {
      const payload = {
        state: formData.state,
        city: formData.city,
        season: formData.season,
        soil_type: formData.soil_type,
        water_availability: formData.water_availability,
        area: parseFloat(formData.area)
      }

      const response = await axios.post(`${API_URL}/predict`, payload)
      setRecommendations(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Error getting recommendations')
    } finally {
      setLoading(false)
    }
  }

  const displayedCrops = showAllCrops ? recommendations : recommendations.slice(0, 3)
  const hasMoreCrops = recommendations.length > 3

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>🌾 Crop Recommendation Dashboard</h1>
          <p>Get AI-powered crop recommendations based on your farm conditions</p>
        </div>

        <div className="dashboard-content">
          <form onSubmit={handleSubmit} className="prediction-form card">
            <h2>Farm Details</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label>State</label>
                <select name="state" value={formData.state} onChange={handleChange} required>
                  <option value="">Select State</option>
                  {options.states && options.states.length > 0 ? (
                    options.states.map(s => <option key={s} value={s}>{s}</option>)
                  ) : (
                    <option value="Gujarat">Gujarat</option>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>City</label>
                <select name="city" value={formData.city} onChange={handleChange} required>
                  <option value="">Select City</option>
                  {options.cities && options.cities.length > 0 && options.cities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Season</label>
                <select name="season" value={formData.season} onChange={handleChange} required>
                  <option value="">Select Season</option>
                  {options.seasons && options.seasons.length > 0 && options.seasons.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Soil Type</label>
                <select name="soil_type" value={formData.soil_type} onChange={handleChange} required>
                  <option value="">Select Soil Type</option>
                  {options.soil_types && options.soil_types.length > 0 && options.soil_types.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Water Availability</label>
                <select name="water_availability" value={formData.water_availability} onChange={handleChange} required>
                  <option value="">Select Water Source</option>
                  {options.water_availability && options.water_availability.length > 0 && options.water_availability.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Land Size (Acres)</label>
                <input 
                  type="number" 
                  name="area" 
                  step="0.01" 
                  min="0.01" 
                  value={formData.area} 
                  onChange={handleChange} 
                  placeholder="Enter land size" 
                  required 
                />
              </div>
            </div>

            {weatherData && (
              <div className="weather-info">
                <h3>🌤️ Live Weather Data for {formData.city}</h3>
                <div className="weather-grid">
                  <div className="weather-item">
                    <span className="weather-label">Avg Temp:</span>
                    <span className="weather-value">{weatherData.avg_temp}°C</span>
                  </div>
                  <div className="weather-item">
                    <span className="weather-label">Max Temp:</span>
                    <span className="weather-value">{weatherData.max_temp}°C</span>
                  </div>
                  <div className="weather-item">
                    <span className="weather-label">Min Temp:</span>
                    <span className="weather-value">{weatherData.min_temp}°C</span>
                  </div>
                  <div className="weather-item">
                    <span className="weather-label">Rainfall:</span>
                    <span className="weather-value">{weatherData.rainfall} mm</span>
                  </div>
                  <div className="weather-item">
                    <span className="weather-label">Cloud Cover:</span>
                    <span className="weather-value">{weatherData.cloud_cover}%</span>
                  </div>
                  <div className="weather-item">
                    <span className="weather-label">pH Level:</span>
                    <span className="weather-value">{weatherData.ph}</span>
                  </div>
                </div>
              </div>
            )}

            {loadingWeather && <div className="loading-weather">Fetching live weather data...</div>}

            <button type="submit" className="btn btn-primary btn-block" disabled={loading || !weatherData}>
              {loading ? (
                <>
                  <Loader className="spin" size={20} />
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp size={20} />
                  Get Recommendations
                </>
              )}
            </button>
          </form>

          {error && <div className="error-message">{error}</div>}

          {recommendations.length > 0 && (
            <div className="recommendations-section">
              <h2>🌟 TOP {showAllCrops ? '6' : '3'} RECOMMENDED CROPS</h2>
              <div className="crops-grid">
                {displayedCrops.map((rec, idx) => (
                  <div key={idx} className="crop-card card">
                    <div className="crop-header">
                      <span className="crop-rank">{idx + 1}</span>
                      <h3>{rec.crop}</h3>
                    </div>
                    <div className="crop-body">
                      <div className="crop-stat">
                        <span className="stat-label">⭐ Suitability:</span>
                        <span className="stat-value">{rec.suitability.toFixed(1)}%</span>
                      </div>
                      <div className="crop-stat">
                        <span className="stat-label">💰 Profit/Acre:</span>
                        <span className="stat-value">₹{rec.profit_per_acre.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                      </div>
                      <div className="crop-stat highlight">
                        <span className="stat-label">💵 Total Profit:</span>
                        <span className="stat-value">₹{rec.total_profit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                      </div>
                      <div className="crop-stat">
                        <span className="stat-label">📊 Production/Acre:</span>
                        <span className="stat-value">{rec.expected_production.toFixed(2)} kg</span>
                      </div>
                      <div className="crop-stat">
                        <span className="stat-label">💲 Avg Price:</span>
                        <span className="stat-value">₹{rec.avg_price.toFixed(2)}/kg</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {hasMoreCrops && (
                <div className="show-more-container">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setShowAllCrops(!showAllCrops)}
                  >
                    {showAllCrops ? '🔼 Show Less Crops' : '🔽 Show 3 More Crops'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
