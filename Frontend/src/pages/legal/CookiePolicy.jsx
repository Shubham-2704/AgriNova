import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './Legal.css';

const CookiePolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/" className="back-link">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="legal-header">
          <h1>Cookie Policy</h1>
          <p className="last-updated">Last Updated: March 1, 2026</p>
        </div>

        <div className="legal-content">
          <section>
            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and login status.
            </p>
          </section>

          <section>
            <h2>2. Cookies We Use</h2>
            
            <h3>2.1 Essential Cookies (Required)</h3>
            <p>These cookies are necessary for the website to function:</p>
            <ul>
              <li><strong>Authentication Token:</strong> Keeps you logged in (JWT token in localStorage)</li>
              <li><strong>Cookie Consent:</strong> Remembers your cookie preferences</li>
            </ul>

            <h3>2.2 Preference Cookies (Optional)</h3>
            <p>These cookies remember your choices:</p>
            <ul>
              <li><strong>Theme Preference:</strong> Remembers dark/light mode selection</li>
              <li><strong>Language Settings:</strong> Stores your preferred language</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Cookies</h2>
            <ul>
              <li>Keep you logged in to your account</li>
              <li>Remember your theme and display preferences</li>
              <li>Improve website performance and user experience</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2>4. Third-Party Cookies</h2>
            <p>We use the following third-party services that may set cookies:</p>
            <ul>
              <li><strong>Google OAuth:</strong> For authentication (subject to Google's Cookie Policy)</li>
            </ul>
          </section>

          <section>
            <h2>5. Managing Cookies</h2>
            <p>You can control cookies through:</p>
            <ul>
              <li>Our cookie consent banner (appears on first visit)</li>
              <li>Your browser settings (may affect website functionality)</li>
              <li>Clearing your browser's cache and cookies</li>
            </ul>
            <p>
              Note: Disabling essential cookies may prevent you from using certain features of the website.
            </p>
          </section>

          <section>
            <h2>6. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated "Last Updated" date.
            </p>
          </section>

          <section>
            <h2>7. Contact Us</h2>
            <p>
              If you have questions about our use of cookies, contact us at:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> privacy@agrinova.com</p>
            </div>
          </section>

          <section>
            <p>
              For more information about how we handle your data, please read our <Link to="/privacy-policy">Privacy Policy</Link> and <Link to="/terms">Terms of Service</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
