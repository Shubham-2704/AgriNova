import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Target, Zap, Users, TrendingUp, Shield, Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Page.css';

const AboutUs = () => {
  const { t } = useTranslation();
  
  const stats = [
    { value: '95%', label: t('about.predictionAccuracy') },
    { value: '50K+', label: t('about.happyFarmers') },
    { value: '26+', label: t('about.citiesCovered') },
    { value: '15+', label: t('about.cropTypes') },
  ];

  const values = [
    {
      icon: <Target size={24} />,
      title: t('about.missionDriven'),
      description: t('about.missionDrivenDesc')
    },
    {
      icon: <Zap size={24} />,
      title: t('about.innovationFirst'),
      description: t('about.innovationFirstDesc')
    },
    {
      icon: <Users size={24} />,
      title: t('about.farmerCentric'),
      description: t('about.farmerCentricDesc')
    },
    {
      icon: <Shield size={24} />,
      title: t('about.trustTransparency'),
      description: t('about.trustTransparencyDesc')
    },
  ];

  return (
    <div className="page">
      <Navbar />
      
      {/* Hero Section */}
      <div className="page-hero">
        <div className="container">
          <h1 className="page-hero-title">{t('about.title')}</h1>
          <p className="page-hero-subtitle">
            {t('about.subtitle')}
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="page-container">
        <div className="mission-section">
          <div className="mission-content">
            <span className="section-tag">{t('about.ourMission')}</span>
            <h2 className="mission-title">{t('about.missionTitle')}</h2>
            <p className="mission-text">
              {t('about.missionText')}
            </p>
            <div className="mission-features">
              <div className="mission-feature">
                <Leaf size={20} className="mission-feature-icon" />
                <span>{t('about.sustainableFarming')}</span>
              </div>
              <div className="mission-feature">
                <TrendingUp size={20} className="mission-feature-icon" />
                <span>{t('about.higherYields')}</span>
              </div>
              <div className="mission-feature">
                <Zap size={20} className="mission-feature-icon" />
                <span>{t('about.aiPowered')}</span>
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
            <span className="section-tag">{t('about.whatWeDo')}</span>
            <h2 className="section-title-large">{t('about.whatWeDoTitle')}</h2>
            <p className="section-description">
              {t('about.whatWeDoDesc')}
            </p>
          </div>

          <div className="process-grid">
            <div className="process-card">
              <div className="process-number">01</div>
              <h3 className="process-title">{t('about.dataCollection')}</h3>
              <p className="process-text">
                {t('about.dataCollectionDesc')}
              </p>
            </div>
            <div className="process-card">
              <div className="process-number">02</div>
              <h3 className="process-title">{t('about.aiAnalysis')}</h3>
              <p className="process-text">
                {t('about.aiAnalysisDesc')}
              </p>
            </div>
            <div className="process-card">
              <div className="process-number">03</div>
              <h3 className="process-title">{t('about.recommendations')}</h3>
              <p className="process-text">
                {t('about.recommendationsDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="content-section">
          <div className="section-header-center">
            <span className="section-tag">{t('about.ourValues')}</span>
            <h2 className="section-title-large">{t('about.ourValuesTitle')}</h2>
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
            <span className="section-tag">{t('about.ourTechnology')}</span>
            <h2 className="tech-title">{t('about.technologyTitle')}</h2>
            <p className="tech-text">
              {t('about.technologyDesc')}
            </p>
            <ul className="tech-list">
              <li className="tech-list-item">
                <span className="tech-check">✓</span>
                {t('about.tech1')}
              </li>
              <li className="tech-list-item">
                <span className="tech-check">✓</span>
                {t('about.tech2')}
              </li>
              <li className="tech-list-item">
                <span className="tech-check">✓</span>
                {t('about.tech3')}
              </li>
              <li className="tech-list-item">
                <span className="tech-check">✓</span>
                {t('about.tech4')}
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