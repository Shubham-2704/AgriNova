import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './NotFound.css';

const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <Navbar />
      
      <div className="notfound-container">
        <div className="notfound-content">
          <div className="notfound-icon">
            <AlertTriangle size={80} />
          </div>
          
          <h1 className="notfound-code">404</h1>
          
          <h2 className="notfound-title">{t('notfound.title')}</h2>
          
          <p className="notfound-description">
            {t('notfound.description')}
          </p>
          
          <div className="notfound-buttons">
            <Link to="/" className="btn btn-primary">
              <Home size={18} />
              {t('notfound.goHome')}
            </Link>
            
            <button 
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} />
              {t('notfound.goBack')}
            </button>
          </div>
          
          <div className="notfound-suggestions">
            <p className="suggestions-title">{t('notfound.suggestions')}</p>
            <ul className="suggestions-list">
              <li>
                <Link to="/">{t('nav.home')}</Link>
              </li>
              <li>
                <Link to="/about">{t('nav.about')}</Link>
              </li>
              <li>
                <Link to="/contact">{t('nav.contact')}</Link>
              </li>
              <li>
                <Link to="/faq">{t('nav.faq')}</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
