import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <span className="logo-icon">🌾</span>
            <span className="logo-text">AgriNova</span>
          </div>
          <p>Transforming agriculture with AI-powered insights</p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/team">Our Team</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <ul className="contact-list">
            <li>
              <Mail size={16} />
              <span>info@agrinova.com</span>
            </li>
            <li>
              <Phone size={16} />
              <span>+91 1234567890</span>
            </li>
            <li>
              <MapPin size={16} />
              <span>Ahmedabad, Gujarat, India</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2024 AgriNova. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
