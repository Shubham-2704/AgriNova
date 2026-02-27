import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Page.css'

const faqs = [
  {
    question: "How accurate are the crop recommendations?",
    answer: "Our AI model has been trained on extensive agricultural data and achieves over 90% accuracy in crop recommendations. The system considers multiple factors including weather, soil type, water availability, and historical data to provide reliable suggestions."
  },
  {
    question: "How does the weather integration work?",
    answer: "We integrate with OpenWeatherMap API to fetch real-time weather data for your selected location. This includes temperature, rainfall, humidity, cloud cover, and other meteorological factors that influence crop growth."
  },
  {
    question: "Can I use AgriNova for any location in India?",
    answer: "Currently, AgriNova is optimized for Gujarat state with data from 26+ cities. We're continuously expanding our coverage to include more states and regions across India."
  },
  {
    question: "How are profit calculations determined?",
    answer: "Profit calculations are based on historical production data, current market prices, and your specified land area. We provide both per-acre and total profit estimates to help you make informed decisions."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take data security seriously. All user data is encrypted and stored securely. We never share your personal information with third parties without your explicit consent."
  },
  {
    question: "Do I need technical knowledge to use AgriNova?",
    answer: "Not at all! AgriNova is designed with farmers in mind. The interface is intuitive and easy to use. Simply input your farm details, and our system will provide recommendations in a clear, understandable format."
  },
  {
    question: "Can I get recommendations for multiple crops?",
    answer: "Yes! Our system provides the top 6 crop recommendations ranked by suitability. You can view the top 3 initially and expand to see 3 more alternatives."
  },
  {
    question: "How often is the data updated?",
    answer: "Weather data is fetched in real-time whenever you make a prediction. Our crop database and pricing information are updated regularly to ensure accuracy."
  }
]

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="page">
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about AgriNova</p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item card">
              <button 
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                <ChevronDown 
                  className={`faq-icon ${openIndex === index ? 'open' : ''}`}
                  size={20}
                />
              </button>
              {openIndex === index && (
                <div className="faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default FAQ
