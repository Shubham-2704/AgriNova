import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const PredictionContext = createContext()

export const PredictionProvider = ({ children }) => {
  const [predictions, setPredictions] = useState([])
  const { user } = useAuth()

  // Load predictions from localStorage only when user is logged in
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem('predictions')
      if (stored) {
        try {
          setPredictions(JSON.parse(stored))
        } catch (error) {
        }
      }
    } else {
      // Clear predictions when user is not logged in
      setPredictions([])
    }
  }, [user])

  const savePrediction = (formData, recommendations, weatherData) => {
    const newPrediction = {
      id: Date.now(),
      formData,
      recommendations,
      weatherData,
      predictedAt: new Date().toISOString()
    }

    // Keep only last 5 predictions (remove oldest if 6th is added)
    let updated = [newPrediction, ...predictions]
    if (updated.length > 5) {
      updated = updated.slice(0, 5)
    }
    
    setPredictions(updated)
    localStorage.setItem('predictions', JSON.stringify(updated))
    return newPrediction
  }

  const clearPredictions = () => {
    setPredictions([])
    localStorage.removeItem('predictions')
  }

  const removePrediction = (id) => {
    const updated = predictions.filter(p => p.id !== id)
    setPredictions(updated)
    localStorage.setItem('predictions', JSON.stringify(updated))
  }

  return (
    <PredictionContext.Provider value={{ 
      predictions, 
      savePrediction, 
      clearPredictions,
      removePrediction 
    }}>
      {children}
    </PredictionContext.Provider>
  )
}

export const usePrediction = () => useContext(PredictionContext)
