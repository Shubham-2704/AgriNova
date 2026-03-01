import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './LandingPage.css';
import image01 from '../../assets/01.png';
import image02 from '../../assets/02.png';
import image03 from '../../assets/03.png';

const heroSlides = [
  {
    title: "Transform Your Farming with AI",
    subtitle: "Get intelligent crop recommendations based on real-time weather data and soil conditions",
    image: "🌾",
    gradient: "linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)"
  },
  {
    title: "Maximize Your Crop Yield",
    subtitle: "Data-driven insights to help you make informed decisions and increase productivity",
    image: "📈",
    gradient: "linear-gradient(135deg, #0288D1 0%, #01579B 100%)"
  },
  {
    title: "Smart Agriculture for Everyone",
    subtitle: "Join thousands of farmers using AgriNova to revolutionize their farming operations",
    image: "🚜",
    gradient: "linear-gradient(135deg, #F57C00 0%, #E65100 100%)"
  }
];

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
];

const testimonials = [
  {
    quote: "AgriNova transformed our farming operations. The AI recommendations helped increase our yield by 40%.",
    author: "Rajesh Patel",
    role: "Commercial Farmer",
    rating: 5
  },
  {
    quote: "The weather integration and profit calculations are incredibly accurate. Best investment for our farm.",
    author: "Priya Sharma",
    role: "Agricultural Consultant",
    rating: 5
  },
  {
    quote: "Managing multiple farms has never been easier. AgriNova streamlined our entire operation.",
    author: "Amit Desai",
    role: "Cooperative Manager",
    rating: 5
  }
];

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useTranslation();

  const heroSlides = [
    {
      title: t('landing.smartFarming'),
      subtitle: t('landing.sustainableHarvests'),
      description: t('landing.sustainableHarvestsDesc'),
      getStarted: t('landing.started'),
      image: image01,
      gradient: "linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(46, 125, 50, 0.5) 100%)",
      primaryColor: "rgba(76, 175, 80, 0.03)", // Almost invisible green
      textBgColor: "rgba(0, 0, 0, 0.05)" // Nearly invisible
    },
    {
      title: t('landing.aiPoweredAgriculture'),
      subtitle: t('landing.dataDrivenDecisions'),
      description: t('landing.dataDrivenDecisionsDesc'),
      getStarted: t('landing.started'),
      image: image02,
      gradient: "linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(2, 136, 209, 0.5) 100%)",
      primaryColor: "rgba(33, 150, 243, 0.03)", // Almost invisible blue
      textBgColor: "rgba(0, 0, 0, 0.05)" // Nearly invisible
    },
    {
      title: t('landing.precisionFarming'),
      subtitle: t('landing.futureOfAgriculture'),
      description: t('landing.futureOfAgricultureDesc'),
      getStarted: t('landing.started'),
      image: image03,
      gradient: "linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(245, 124, 0, 0.5) 100%)",
      primaryColor: "rgba(255, 152, 0, 0.03)", // Almost invisible orange
      textBgColor: "rgba(0, 0, 0, 0.05)" // Nearly invisible
    }
  ];

  const features = [
    {
      icon: "🤖",
      title: t('landing.aiPowered'),
      description: t('landing.aiPoweredDesc')
    },
    {
      icon: "🌤️",
      title: t('landing.realTimeWeather'),
      description: t('landing.realTimeWeatherDesc')
    },
    {
      icon: "💰",
      title: t('landing.profitOptimization'),
      description: t('landing.profitOptimizationDesc')
    },
    {
      icon: "📊",
      title: t('landing.detailedAnalytics'),
      description: t('landing.detailedAnalyticsDesc')
    }
  ];

  const testimonials = [
    {
      quote: t('landing.testimonial1'),
      author: t('landing.testimonial1Author'),
      role: t('landing.testimonial1Role'),
      rating: 5
    },
    {
      quote: t('landing.testimonial2'),
      author: t('landing.testimonial2Author'),
      role: t('landing.testimonial2Role'),
      rating: 5
    },
    {
      quote: t('landing.testimonial3'),
      author: t('landing.testimonial3Author'),
      role: t('landing.testimonial3Role'),
      rating: 5
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="landing-page">
      <Navbar />
      
      {/* Hero Section with Background Image Carousel */}
      <section className="hero-section">
        <div className="hero-carousel">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ 
                backgroundImage: `${slide.gradient}, url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                '--primary-color': slide.primaryColor,
                '--text-bg-color': slide.textBgColor
              }}
            >
              <div className="hero-content">
                <div className="hero-text">
                  <div className="hero-badge">{slide.title}</div>
                  <h1 className="hero-main-title">
                    {slide.subtitle}
                  </h1>
                  <p className="hero-description">
                    {slide.description}
                  </p>
                  <div className="hero-actions">
                    <Link to="/signup" className="btn btn-hero-primary">
                      {slide.getStarted}
                    </Link>
                  </div>
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
            <h2 className="section-title">{t('landing.whyChoose')}</h2>
            <p className="section-subtitle">
              {t('landing.whyChooseSubtitle')}
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
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
            <h2 className="section-title">{t('landing.whatUsersSay')}</h2>
            <p className="section-subtitle">
              {t('landing.whatUsersSaySubtitle')}
            </p>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
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
        <div className="cta-content">
          <h2 className="cta-title">{t('landing.readyToTransform')}</h2>
          <p className="cta-subtitle">
            {t('landing.heroSubtitle')}
          </p>
          <div className="cta-actions">
            <Link to="/signup" className="btn btn-primary btn-lg">
              {t('landing.startFreeTrial')} <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="btn btn-secondary btn-lg">
              {t('landing.contactSales')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;