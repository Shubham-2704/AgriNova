import { Link } from 'react-router-dom';
import { Mail, MapPin, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  const quickLinks = [
    { path: '/about', label: t('nav.about') },
    { path: '/team', label: t('nav.team') },
    { path: '/faq', label: t('nav.faq') },
    { path: '/dashboard', label: t('nav.dashboard') },
  ];

  const resources = [
    { label: t('footer.blog'), path: '/blog' },
    { label: t('footer.support'), path: '/support' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  const legal = [
    { label: t('footer.privacyPolicy'), path: '/privacy-policy' },
    { label: t('footer.termsOfService'), path: '/terms' },
    { label: t('footer.cookiePolicy'), path: '/cookie-policy' },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* MAIN FOOTER CONTENT - 3 COLUMNS */}
        <div className="footer-main">
          {/* LEFT SECTION - Brand */}
          <div className="footer-left">
            <Link to="/" className="footer-logo">
              <span className="logo-icon">🌾</span>
              <span className="logo-text">AgriNova</span>
            </Link>
            <p className="footer-description">
              {t('footer.description')}
            </p>
          </div>

          {/* CENTER SECTION - Links */}
          <div className="footer-center">
            <div className="footer-links-section">
              <h3>{t('footer.company')}</h3>
              <ul className="footer-links">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links-section">
              <h3>{t('footer.resources')}</h3>
              <ul className="footer-links">
                {resources.map((resource, index) => (
                  <li key={index}>
                    <Link to={resource.path}>{resource.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links-section">
              <h3>{t('footer.legal')}</h3>
              <ul className="footer-links">
                {legal.map((item, index) => (
                  <li key={index}>
                    <Link to={item.path}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT SECTION - Contact & Newsletter */}
          <div className="footer-right">
            <h3>{t('footer.contactUs')}</h3>
            <ul className="contact-info">
              <li className="contact-item">
                <MapPin size={16} />
                <span>{t('footer.location')}</span>
              </li>
              <li className="contact-item">
                <Linkedin size={16} />
                <a href="https://linkedin.com/company/agrinova" target="_blank" rel="noopener noreferrer">
                  linkedin.com/company/agrinova
                </a>
              </li>
              <li className="contact-item">
                <Mail size={16} />
                <span>{t('footer.email')}</span>
              </li>
            </ul>

          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="footer-bottom">
          <p className="copyright">
            © {currentYear} {t('footer.copyright')}
          </p>
          <div className="footer-bottom-links">
            <Link to="/privacy-policy">{t('footer.privacyPolicy')}</Link>
            <Link to="/terms">{t('footer.termsOfService')}</Link>
            <Link to="/cookie-policy">{t('footer.cookiePolicy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;