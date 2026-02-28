import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Target, Zap, Users, TrendingUp, Shield, Leaf } from 'lucide-react';
import './Page.css';

const AboutUs = () => {
  const stats = [
    { value: '95%', label: 'Prediction Accuracy' },
    { value: '50K+', label: 'Happy Farmers' },
    { value: '26+', label: 'Cities Covered' },
    { value: '15+', label: 'Crop Types' },
  ];

  const values = [
    {
      icon: <Target size={24} />,
      title: 'Mission-Driven',
      description: 'We exist to empower farmers with AI technology for sustainable agriculture.'
    },
    {
      icon: <Zap size={24} />,
      title: 'Innovation First',
      description: 'Constantly improving our algorithms to provide the most accurate recommendations.'
    },
    {
      icon: <Users size={24} />,
      title: 'Farmer-Centric',
      description: 'Every feature we build is designed with farmers\' needs in mind.'
    },
    {
      icon: <Shield size={24} />,
      title: 'Trust & Transparency',
      description: 'Clear, honest recommendations you can rely on for your farming decisions.'
    },
  ];

  return (
    <div className="page">
      <Navbar />
      
      {/* Hero Section */}
      <div className="page-hero">
        <div className="container">
          <h1 className="page-hero-title">About AgriNova</h1>
          <p className="page-hero-subtitle">
            Revolutionizing agriculture with AI-powered insights for a sustainable future
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="page-container">
        <div className="mission-section">
          <div className="mission-content">
            <span className="section-tag">Our Mission</span>
            <h2 className="mission-title">Empowering Farmers with Intelligent Technology</h2>
            <p className="mission-text">
              At AgriNova, we're on a mission to transform traditional farming into smart, 
              data-driven agriculture. We believe that every farmer deserves access to cutting-edge 
              technology that can help them make better decisions, increase yields, and maximize profits.
            </p>
            <div className="mission-features">
              <div className="mission-feature">
                <Leaf size={20} className="mission-feature-icon" />
                <span>Sustainable Farming</span>
              </div>
              <div className="mission-feature">
                <TrendingUp size={20} className="mission-feature-icon" />
                <span>Higher Yields</span>
              </div>
              <div className="mission-feature">
                <Zap size={20} className="mission-feature-icon" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
          <div className="mission-image">
            <span className="mission-emoji">🌱</span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* What We Do Section */}
        <div className="content-section">
          <div className="section-header-center">
            <span className="section-tag">What We Do</span>
            <h2 className="section-title-large">AI-Powered Crop Recommendations</h2>
            <p className="section-description">
              We combine real-time weather data, soil conditions, and historical patterns to provide 
              the most accurate crop recommendations for your farm.
            </p>
          </div>

          <div className="process-grid">
            <div className="process-card">
              <div className="process-number">01</div>
              <h3 className="process-title">Data Collection</h3>
              <p className="process-text">
                We gather real-time weather data, soil information, and historical agricultural patterns.
              </p>
            </div>
            <div className="process-card">
              <div className="process-number">02</div>
              <h3 className="process-title">AI Analysis</h3>
              <p className="process-text">
                Our machine learning models analyze multiple factors to find the best crop matches.
              </p>
            </div>
            <div className="process-card">
              <div className="process-number">03</div>
              <h3 className="process-title">Recommendations</h3>
              <p className="process-text">
                We provide detailed insights on suitability, profit estimates, and production forecasts.
              </p>
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="content-section">
          <div className="section-header-center">
            <span className="section-tag">Our Values</span>
            <h2 className="section-title-large">What Drives Us Forward</h2>
          </div>

          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-text">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Section */}
        <div className="tech-section">
          <div className="tech-content">
            <span className="section-tag">Our Technology</span>
            <h2 className="tech-title">Powered by Advanced Machine Learning</h2>
            <p className="tech-text">
              We use advanced machine learning algorithms trained on extensive agricultural datasets 
              to provide accurate crop recommendations. Our system integrates live weather APIs, 
              soil analysis, and market price data to give you comprehensive insights for 
              informed decision-making.
            </p>
            <ul className="tech-list">
              <li className="tech-list-item">
                <span className="tech-check">✓</span>
                90%+ prediction accuracy with Random Forest ML models
              </li>
              <li className="tech-list-item">
                <span className="tech-check">✓</span>
                Real-time weather integration for up-to-date recommendations
              </li>
              <li className="tech-list-item">
                <span className="tech-check">✓</span>
                Comprehensive profit and production calculations
              </li>
              <li className="tech-list-item">
                <span className="tech-check">✓</span>
                Continuous learning and improvement of algorithms
              </li>
            </ul>
          </div>
          <div className="tech-image">
            <span className="tech-emoji">📊</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;