import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, TrendingUp, Shield, Star } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './LandingPage.css'

const heroSlides = [
  {
    title: "Transform Your Farming with AI",
    subtitle: "Get intelligent crop recommendations based on real-time weather data and soil conditions",
    image: "🌾",
    gradient: "linear-gradient(135deg, #27ae60 0%, #229954 100%)"
  },
  {
    title: "Maximize Your Crop Yield",
    subtitle: "Data-driven insights to help you make informed decisions and increase productivity by 30%",
    image: "📈",
    gradient: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)"
  },
  {
    title: "Smart Agriculture for Everyone",
    subtitle: "Join thousands of farmers using AgriNova to revolutionize their farming operations",
    image: "🚜",
    gradient: "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)"
  }
]

const features = [
  {
    icon: "🤖",
    title: "AI-Powered Predictions",
    description: "Advanced machine learning algorithms analyze your farm conditions to recommend the best crops"
  },
  {
    icon: "🌤️",
    title: "Real-Time Weather Data",
    description: "Live weather integration ensures recommendations are based on current conditions"
  },
  {
    icon: "💰",
    title: "Profit Optimization",
    description: "Calculate expected profits and production to make data-driven financial decisions"
  },
  {
    icon: "📊",
    title: "Detailed Analytics",
    description: "Comprehensive reports on suitability, production estimates, and market prices"
  }
]

const testimonials = [
  {
    quote: "AgriSmart transformed our farming operations. The crop monitoring system helped increase our yield by 30%.",
    author: "Rajesh Patel",
    role: "Commercial Farmer",
    rating: 5
  },
  {
    quote: "The analytics dashboard provides incredible insights. It's like having an agricultural expert available 24/7.",
    author: "Priya Sharma",
    role: "Agricultural Consultant",
    rating: 5
  },
  {
    quote: "Managing multiple farms has never been easier. AgriSmart streamlined our entire operation.",
    author: "Amit Desai",
    role: "Cooperative Manager",
    rating: 5
  }
]

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="landing-page">
      <Navbar />
      
      {/* Hero Section with Carousel */}
      <section className="hero-section">
        <div className="hero-carousel">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ background: slide.gradient }}
            >
              <div className="container hero-content">
                <div className="hero-text fade-in">
                  <h1 className="hero-title">
                    {slide.title}
                  </h1>
                  <p className="hero-subtitle">
                    {slide.subtitle}
                  </p>
                  <div className="hero-actions">
                    <Link to="/signup" className="btn btn-primary btn-lg">
                      Start Free Trial <ArrowRight size={20} />
                    </Link>
                    <Link to="/about" className="btn btn-outline btn-lg">
                      Learn More
                    </Link>
                  </div>
                </div>
                <div className="hero-image">
                  <span className="hero-emoji">{slide.image}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="carousel-indicators">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose AgriNova?</h2>
            <p className="section-subtitle">
              Powerful features designed to help you grow smarter
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Users Say</h2>
            <p className="section-subtitle">
              Join thousands of satisfied farmers
            </p>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card card">
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} fill="var(--accent)" color="var(--accent)" />
                  ))}
                </div>
                <p className="testimonial-quote">"{testimonial.quote}"</p>
                <div className="testimonial-author">
                  <strong>{testimonial.author}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container cta-content">
          <h2 className="cta-title">Ready to Transform Your Farm?</h2>
          <p className="cta-subtitle">
            Join the agricultural revolution today. Start your free trial and experience the power of smart farming.
          </p>
          <div className="cta-actions">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Start Free Trial <ArrowRight size={20} />
            </Link>
            <Link to="/about" className="btn btn-secondary btn-lg">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage
