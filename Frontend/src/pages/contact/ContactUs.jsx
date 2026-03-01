import { useState } from 'react';
import { Mail, Phone, MapPin, Send, User, MessageSquare, Clock } from 'lucide-react';
import { useToast } from '../../components/ToastContainer';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { contactFormSchema } from '../../utils/validationSchemas';
import { Navbar, Footer } from '../../components';
import '../info/Page.css';
import './ContactUs.css';

const ContactUs = () => {
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
          <h1 className="page-hero-title">Get In Touch</h1>
          <p className="page-hero-subtitle">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
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
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={16} />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  <Phone size={16} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter 10-digit phone number"
                  maxLength="10"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  <MessageSquare size={16} />
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you... (minimum 10 characters)"
                  rows="5"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'} <Send size={16} />
              </button>
            </form>
          </div>

          {/* Right Side - Contact Info */}
          <div className="contact-info-section">
            <div className="contact-info-card">
              <h3>Contact Information</h3>
              <p>Feel free to reach out to us through any of these channels.</p>

              <div className="contact-details">
                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <Mail size={20} />
                  </div>
                  <div className="contact-detail-text">
                    <h4>Email</h4>
                    <p>support@agrinova.com</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <Phone size={20} />
                  </div>
                  <div className="contact-detail-text">
                    <h4>Phone</h4>
                    <p>+91 98765 43210</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <MapPin size={20} />
                  </div>
                  <div className="contact-detail-text">
                    <h4>Location</h4>
                    <p>Ahmedabad, Gujarat, India</p>
                  </div>
                </div>
              </div>

              <div className="contact-hours">
                <div className="contact-hours-header">
                  <Clock size={20} />
                  <h4>Business Hours</h4>
                </div>
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
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
