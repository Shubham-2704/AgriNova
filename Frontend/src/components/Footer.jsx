import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useState } from 'react';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thanks for subscribing! We'll send updates to ${email}`);
      setEmail('');
    }
  };

  const quickLinks = [
    { path: '/about', label: 'About Us' },
    { path: '/team', label: 'Our Team' },
    { path: '/faq', label: 'FAQ' },
    { path: '/dashboard', label: 'Dashboard' },
  ];

  const resources = [
    { label: 'Blog', path: '/blog' },
    { label: 'Support', path: '/support' },
    { label: 'Contact', path: '/contact' },
  ];

  const legal = [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
  ];

  const socialLinks = [
    { icon: <Facebook size={18} />, label: 'Facebook', url: 'https://facebook.com/agrinova' },
    { icon: <Twitter size={18} />, label: 'Twitter', url: 'https://twitter.com/agrinova' },
    { icon: <Instagram size={18} />, label: 'Instagram', url: 'https://instagram.com/agrinova' },
    { icon: <Linkedin size={18} />, label: 'LinkedIn', url: 'https://linkedin.com/company/agrinova' },
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
              Revolutionizing agriculture with AI-powered insights. Making smart farming accessible to every farmer.
            </p>
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* CENTER SECTION - Links */}
          <div className="footer-center">
            <div className="footer-links-section">
              <h3>Company</h3>
              <ul className="footer-links">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links-section">
              <h3>Resources</h3>
              <ul className="footer-links">
                {resources.map((resource, index) => (
                  <li key={index}>
                    <Link to={resource.path}>{resource.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links-section">
              <h3>Legal</h3>
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
            <h3>Contact Us</h3>
            <ul className="contact-info">
              <li className="contact-item">
                <MapPin size={16} />
                <span>Ahmedabad, Gujarat, India</span>
              </li>
              <li className="contact-item">
                <Phone size={16} />
                <span>+91 98765 43210</span>
              </li>
              <li className="contact-item">
                <Mail size={16} />
                <span>support@agrinova.com</span>
              </li>
            </ul>

            <div className="newsletter">
              <h3>Newsletter</h3>
              <p className="footer-description">
                Subscribe for updates and farming tips.
              </p>
              <form onSubmit={handleSubscribe} className="newsletter-input">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit">
                  <Send size={16} style={{ marginRight: '4px' }} />
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="footer-bottom">
          <p className="copyright">
            © {currentYear} AgriNova. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookies">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;