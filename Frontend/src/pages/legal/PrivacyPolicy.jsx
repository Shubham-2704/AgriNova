import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './Legal.css';

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/" className="back-link">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="legal-header">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: March 1, 2026</p>
        </div>

        <div className="legal-content">
          <section>
            <h2>1. Information We Collect</h2>
            <p>
              We collect your name, email, and password when you create an account. If you use Google Sign-In, we collect your Google profile information. We also collect agricultural data you provide (location, soil type, crop preferences) to generate predictions.
            </p>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>
              We use your information to provide crop predictions, authenticate your account, send password reset emails, and improve our machine learning models. We do NOT sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2>3. Data Security</h2>
            <p>
              Your password is encrypted using industry-standard Argon2 hashing. We use JWT tokens for secure authentication and HTTPS for all data transmission. While we implement strong security measures, no system is 100% secure.
            </p>
          </section>

          <section>
            <h2>4. Your Rights</h2>
            <p>
              You can access, update, or delete your account data at any time. To exercise these rights or for any privacy concerns, contact us at <strong>privacy@agrinova.com</strong>
            </p>
            <p className="legal-footer-text">
              For more details, see our <Link to="/terms">Terms of Service</Link> and <Link to="/cookie-policy">Cookie Policy</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
