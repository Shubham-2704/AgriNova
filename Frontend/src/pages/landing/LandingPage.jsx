import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './LandingPage.css';

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useTranslation();

  const heroSlides = [
    {
      title: t('landing.smartFarming'),
      subtitle: t('landing.sustainableHarvests'),
      description: t('landing.sustainableHarvestsDesc'),
      getStarted: t('landing.started'),
      image: 'https://res.cloudinary.com/dpn6jplxx/image/upload/v1772446581/01_r1kwpp.png',
      gradient: "linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(46, 125, 50, 0.5) 100%)",
      primaryColor: "rgba(76, 175, 80, 0.03)",
      textBgColor: "rgba(0, 0, 0, 0.05)"
    },
    {
      title: t('landing.aiPoweredAgriculture'),
      subtitle: t('landing.dataDrivenDecisions'),
      description: t('landing.dataDrivenDecisionsDesc'),
      getStarted: t('landing.started'),
      image: 'https://res.cloudinary.com/dpn6jplxx/image/upload/v1772446583/02_w9wrbe.png',
      gradient: "linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(2, 136, 209, 0.5) 100%)",
      primaryColor: "rgba(33, 150, 243, 0.03)",
      textBgColor: "rgba(0, 0, 0, 0.05)"
    },
    {
      title: t('landing.precisionFarming'),
      subtitle: t('landing.futureOfAgriculture'),
      description: t('landing.futureOfAgricultureDesc'),
      getStarted: t('landing.started'),
      image: 'https://res.cloudinary.com/dpn6jplxx/image/upload/v1772446584/03_vilfls.png',
      gradient: "linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(245, 124, 0, 0.5) 100%)",
      primaryColor: "rgba(255, 152, 0, 0.03)",
      textBgColor: "rgba(0, 0, 0, 0.05)"
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

  const steps = [
    {
      number: "1",
      icon: "📝",
      title: t('landing.step1Title'),
      description: t('landing.step1Desc')
    },
    {
      number: "2",
      icon: "🌍",
      title: t('landing.step2Title'),
      description: t('landing.step2Desc')
    },
    {
      number: "3",
      icon: "🤖",
      title: t('landing.step3Title'),
      description: t('landing.step3Desc')
    },
    {
      number: "4",
      icon: "🌱",
      title: t('landing.step4Title'),
      description: t('landing.step4Desc')
    }
  ];

  const insights = [
    {
      icon: "🌡️",
      title: t('landing.weatherIntegration'),
      description: t('landing.weatherIntegrationDesc')
    },
    {
      icon: "💹",
      title: t('landing.profitCalculation'),
      description: t('landing.profitCalculationDesc')
    },
    {
      icon: "📈",
      title: t('landing.yieldPrediction'),
      description: t('landing.yieldPredictionDesc')
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

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">{t('landing.simpleProcess')}</span>
            <h2 className="section-title">{t('landing.howItWorks')}</h2>
            <p className="section-subtitle">
              {t('landing.howItWorksSubtitle')}
            </p>
          </div>
          
          <div className="steps-grid">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{step.number}</div>
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Insights Section */}
      <section className="insights-section">
        <div className="container">
          <div className="insights-content">
            <div className="insights-left">
              <span className="section-tag">{t('landing.dataInsightsTag')}</span>
              <h2 className="insights-title">{t('landing.dataInsightsTitle')}</h2>
              <p className="insights-description">
                {t('landing.dataInsightsDescription')}
              </p>
              
              <div className="insights-features">
                {insights.map((insight, index) => (
                  <div key={index} className="insight-item">
                    <div className="insight-icon">{insight.icon}</div>
                    <div className="insight-content">
                      <h4>{insight.title}</h4>
                      <p>{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="insights-right">
              <div className="insights-visual">
                <div className="visual-card">
                  <div className="visual-header">
                    <span className="visual-icon">🌾</span>
                    <span className="visual-title">{t('landing.cropRecommendation')}</span>
                  </div>
                  <div className="visual-body">
                    <div className="prediction-item">
                      <span className="crop-name">{t('landing.sampleCrop1')}</span>
                      <div className="prediction-bar">
                        <div className="prediction-fill" style={{width: '95%'}}></div>
                      </div>
                      <span className="prediction-value">95%</span>
                    </div>
                    <div className="prediction-item">
                      <span className="crop-name">{t('landing.sampleCrop2')}</span>
                      <div className="prediction-bar">
                        <div className="prediction-fill" style={{width: '88%'}}></div>
                      </div>
                      <span className="prediction-value">88%</span>
                    </div>
                    <div className="prediction-item">
                      <span className="crop-name">{t('landing.sampleCrop3')}</span>
                      <div className="prediction-bar">
                        <div className="prediction-fill" style={{width: '82%'}}></div>
                      </div>
                      <span className="prediction-value">82%</span>
                    </div>
                  </div>
                </div>
                
                <div className="visual-stats">
                  <div className="stat-box">
                    <div className="stat-value">30+</div>
                    <div className="stat-label">{t('landing.cropsSupported')}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-value">26</div>
                    <div className="stat-label">{t('landing.gujaratCities')}</div>
                  </div>
                </div>
              </div>
            </div>
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