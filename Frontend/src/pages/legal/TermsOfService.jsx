import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './Legal.css';

const TermsOfService = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/" className="back-link">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="legal-header">
          <h1>Terms of Service</h1>
          <p className="last-updated">Last Updated: March 1, 2026</p>
        </div>

        <div className="legal-content">
          <section>
            <h2>1. Service Description & Disclaimer</h2>
            <div className="disclaimer-box">
              <h3>⚠️ Important Notice</h3>
              <p>
                <strong>AgriNova provides AI-powered crop predictions based on historical data. These predictions are NOT guarantees and should NOT replace professional agricultural advice.</strong>
              </p>
              <ul>
                <li>Predictions may not account for unforeseen weather, market, or environmental changes</li>
                <li>Results vary based on local conditions and farming practices</li>
                <li>Always consult qualified agricultural professionals before making farming decisions</li>
                <li>AgriNova is a decision-support tool, not a replacement for expertise</li>
              </ul>
            </div>
          </section>

          <section>
            <h2>2. User Responsibilities</h2>
            <p>
              By using AgriNova, you agree to provide accurate information, keep your account secure, and not misuse the service. You are responsible for all activities under your account. We reserve the right to suspend accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2>3. Limitation of Liability</h2>
            <div className="disclaimer-box">
              <p>
                <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</strong>
              </p>
              <ul>
                <li>AgriNova is provided "AS IS" without warranties of any kind</li>
                <li>We are NOT liable for crop failures, financial losses, or damages from using our predictions</li>
                <li>We are NOT responsible for decisions made based on our recommendations</li>
                <li>Our total liability shall not exceed the amount you paid for the service (if any)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2>4. Contact & Changes</h2>
            <p>
              We may update these Terms at any time. Continued use after changes means you accept the new terms. For questions, contact us at <strong>support@agrinova.com</strong>
            </p>
            <p className="legal-footer-text">
              Read our <Link to="/privacy-policy">Privacy Policy</Link> and <Link to="/cookie-policy">Cookie Policy</Link> for more information.
            </p>
          </section>

          <section>
            <p className="legal-acknowledgment">
              BY USING AGRINOVA, YOU ACKNOWLEDGE THAT YOU HAVE READ AND AGREE TO THESE TERMS.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
