import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Legal.css';

const TermsOfService = () => {
  const { t } = useTranslation();

  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/" className="back-link">
          <ArrowLeft size={20} />
          {t('legal.backToHome')}
        </Link>

        <div className="legal-header">
          <h1>{t('legal.termsTitle')}</h1>
          <p className="last-updated">{t('legal.lastUpdated')} March 1, 2026</p>
        </div>

        <div className="legal-content">
          <section>
            <h2>{t('legal.terms.section1Title')}</h2>
            <div className="disclaimer-box">
              <h3>{t('legal.terms.importantNotice')}</h3>
              <p>
                <strong>{t('legal.terms.disclaimer')}</strong>
              </p>
              <ul>
                <li>{t('legal.terms.disclaimer1')}</li>
                <li>{t('legal.terms.disclaimer2')}</li>
                <li>{t('legal.terms.disclaimer3')}</li>
                <li>{t('legal.terms.disclaimer4')}</li>
              </ul>
            </div>
          </section>

          <section>
            <h2>{t('legal.terms.section2Title')}</h2>
            <p>{t('legal.terms.section2Text')}</p>
          </section>

          <section>
            <h2>{t('legal.terms.section3Title')}</h2>
            <div className="disclaimer-box">
              <p>
                <strong>{t('legal.terms.maxExtent')}</strong>
              </p>
              <ul>
                <li>{t('legal.terms.liability1')}</li>
                <li>{t('legal.terms.liability2')}</li>
                <li>{t('legal.terms.liability3')}</li>
                <li>{t('legal.terms.liability4')}</li>
              </ul>
            </div>
          </section>

          <section>
            <h2>{t('legal.terms.section4Title')}</h2>
            <p>
              {t('legal.terms.section4Text')} <strong>support@agrinova.com</strong>
            </p>
            <p className="legal-footer-text">
              {t('legal.terms.readMore')} <Link to="/privacy-policy">{t('legal.privacyTitle')}</Link> {t('legal.terms.and')} <Link to="/cookie-policy">{t('legal.cookieTitle')}</Link> {t('legal.terms.forMore')}
            </p>
          </section>

          <section>
            <p className="legal-acknowledgment">
              {t('legal.terms.acknowledgment')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
