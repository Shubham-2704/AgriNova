import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import './CookieConsent.css';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-consent-overlay">
      <div className="cookie-consent-banner">
        <button 
          className="cookie-close-btn" 
          onClick={handleDecline}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="cookie-content">
          <span className="cookie-icon">🍪</span>
          <div className="cookie-text">
            <h3>We Value Your Privacy</h3>
            <p>
              We use cookies to enhance your experience, keep you logged in, and remember your preferences. 
              By clicking "Accept All", you agree to our use of cookies.
              {' '}<Link to="/cookie-policy">Learn more</Link>
            </p>
          </div>
        </div>

        <div className="cookie-actions">
          <button className="btn-decline" onClick={handleDecline}>
            Decline
          </button>
          <button className="btn-accept" onClick={handleAccept}>
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
