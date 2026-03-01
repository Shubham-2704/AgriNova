import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Legal.css';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/" className="back-link">
          <ArrowLeft size={20} />
          {t('legal.backToHome')}
        </Link>

        <div className="legal-header">
          <h1>{t('legal.privacyTitle')}</h1>
          <p className="last-updated">{t('legal.lastUpdated')} March 1, 2026</p>
        </div>

        <div className="legal-content">
          <section>
            <h2>{t('legal.privacy.section1Title')}</h2>
            <p>{t('legal.privacy.section1Text')}</p>
          </section>

          <section>
            <h2>{t('legal.privacy.section2Title')}</h2>
            <p>{t('legal.privacy.section2Text')}</p>
          </section>

          <section>
            <h2>{t('legal.privacy.section3Title')}</h2>
            <p>{t('legal.privacy.section3Text')}</p>
          </section>

          <section>
            <h2>{t('legal.privacy.section4Title')}</h2>
            <p>
              {t('legal.privacy.section4Text')} <strong>privacy@agrinova.com</strong>
            </p>
            <p className="legal-footer-text">
              {t('legal.privacy.forDetails')} <Link to="/terms">{t('legal.termsTitle')}</Link> {t('legal.terms.and')} <Link to="/cookie-policy">{t('legal.cookieTitle')}</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
