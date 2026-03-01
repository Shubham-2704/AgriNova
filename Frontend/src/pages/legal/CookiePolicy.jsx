import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Legal.css';

const CookiePolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/" className="back-link">
          <ArrowLeft size={20} />
          {t('legal.backToHome')}
        </Link>

        <div className="legal-header">
          <h1>{t('legal.cookieTitle')}</h1>
          <p className="last-updated">{t('legal.lastUpdated')} March 1, 2026</p>
        </div>

        <div className="legal-content">
          <section>
            <h2>{t('legal.cookie.section1Title')}</h2>
            <p>{t('legal.cookie.section1Text')}</p>
          </section>

          <section>
            <h2>{t('legal.cookie.section2Title')}</h2>
            
            <h3>{t('legal.cookie.section2_1Title')}</h3>
            <p>{t('legal.cookie.section2_1Text')}</p>
            <ul>
              <li><strong>{t('legal.cookie.authToken')}</strong> {t('legal.cookie.authTokenDesc')}</li>
              <li><strong>{t('legal.cookie.cookieConsent')}</strong> {t('legal.cookie.cookieConsentDesc')}</li>
            </ul>

            <h3>{t('legal.cookie.section2_2Title')}</h3>
            <p>{t('legal.cookie.section2_2Text')}</p>
            <ul>
              <li><strong>{t('legal.cookie.themePreference')}</strong> {t('legal.cookie.themePreferenceDesc')}</li>
              <li><strong>{t('legal.cookie.languageSettings')}</strong> {t('legal.cookie.languageSettingsDesc')}</li>
            </ul>
          </section>

          <section>
            <h2>{t('legal.cookie.section3Title')}</h2>
            <ul>
              <li>{t('legal.cookie.usage1')}</li>
              <li>{t('legal.cookie.usage2')}</li>
              <li>{t('legal.cookie.usage3')}</li>
              <li>{t('legal.cookie.usage4')}</li>
            </ul>
          </section>

          <section>
            <h2>{t('legal.cookie.section4Title')}</h2>
            <p>{t('legal.cookie.section4Text')}</p>
            <ul>
              <li><strong>{t('legal.cookie.googleOAuth')}</strong> {t('legal.cookie.googleOAuthDesc')}</li>
            </ul>
          </section>

          <section>
            <h2>{t('legal.cookie.section5Title')}</h2>
            <p>{t('legal.cookie.section5Text')}</p>
            <ul>
              <li>{t('legal.cookie.manage1')}</li>
              <li>{t('legal.cookie.manage2')}</li>
              <li>{t('legal.cookie.manage3')}</li>
            </ul>
            <p>{t('legal.cookie.manageNote')}</p>
          </section>

          <section>
            <h2>{t('legal.cookie.section6Title')}</h2>
            <p>{t('legal.cookie.section6Text')}</p>
          </section>

          <section>
            <h2>{t('legal.cookie.section7Title')}</h2>
            <p>{t('legal.cookie.section7Text')}</p>
            <div className="contact-info">
              <p><strong>{t('legal.cookie.email')}</strong> privacy@agrinova.com</p>
            </div>
          </section>

          <section>
            <p>
              {t('legal.cookie.moreInfo')} <Link to="/privacy-policy">{t('legal.privacyTitle')}</Link> {t('legal.terms.and')} <Link to="/terms">{t('legal.termsTitle')}</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
