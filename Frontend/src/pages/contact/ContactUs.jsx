import { useState } from 'react';
import { Mail, MapPin, Send, User, MessageSquare, Clock, Linkedin, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../components/ToastContainer';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { contactFormSchema } from '../../utils/validationSchemas';
import { Navbar, Footer } from '../../components';
import '../info/Page.css';
import './ContactUs.css';

const ContactUs = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const { success, error: showError } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For phone field, only allow numbers
    if (name === 'phone') {
      const numbersOnly = value.replace(/[^0-9]/g, '');
      setFormData({
        ...formData,
        [name]: numbersOnly
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Zod Validation
    try {
      contactFormSchema.parse(formData);
    } catch (error) {
      // Show first validation error
      if (error.errors && error.errors.length > 0) {
        showError(error.errors[0].message);
      }
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post(API_PATHS.CONTACT.SUBMIT, formData);
      
      success('Message sent successfully! We\'ll get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (err) {
      // Show backend validation errors in toast
      const errorMessage = err.response?.data?.message || err.response?.data?.detail || 'Failed to send message. Please try again.';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      
      {/* Hero Section */}
      <div className="page-hero">
        <div className="container">
          <h1 className="page-hero-title">{t('contact.title')}</h1>
          <p className="page-hero-subtitle">
            {t('contact.subtitle')}
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <div className="page-container">
        <div className="contact-content">
          {/* Left Side - Contact Form */}
          <div className="contact-form-section">
            <form onSubmit={handleSubmit} className="contact-form" noValidate>
              <div className="form-group">
                <label htmlFor="name">
                  <User size={16} />
                  {t('contact.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('contact.namePlaceholder')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={16} />
                  {t('contact.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('contact.emailPlaceholder')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  <Phone size={16} />
                  {t('contact.phone')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t('contact.phonePlaceholder')}
                  maxLength="10"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  <MessageSquare size={16} />
                  {t('contact.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('contact.messagePlaceholder')}
                  rows="5"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? t('contact.sending') : t('contact.sendMessage')} <Send size={16} />
              </button>
            </form>
          </div>

          {/* Right Side - Contact Info */}
          <div className="contact-info-section">
            <div className="contact-info-card">
              <h3>{t('contact.contactInfo')}</h3>
              <p>{t('contact.contactInfoDesc')}</p>

              <div className="contact-details">
                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <Mail size={20} />
                  </div>
                  <div className="contact-detail-text">
                    <h4>{t('contact.email')}</h4>
                    <p>support@agrinova.com</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <Linkedin size={20} />
                  </div>
                  <div className="contact-detail-text">
                    <h4>{t('contact.linkedin')}</h4>
                    <a href="https://linkedin.com/company/agrinova" target="_blank" rel="noopener noreferrer">
                      linkedin.com/company/agrinova
                    </a>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <MapPin size={20} />
                  </div>
                  <div className="contact-detail-text">
                    <h4>{t('footer.location')}</h4>
                    <p>{t('footer.location')}</p>
                  </div>
                </div>
              </div>

              <div className="contact-hours">
                <div className="contact-hours-header">
                  <Clock size={20} />
                  <h4>{t('contact.businessHours')}</h4>
                </div>
                <p>{t('contact.mondayFriday')}</p>
                <p>{t('contact.saturday')}</p>
                <p>{t('contact.sunday')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ContactUs;
