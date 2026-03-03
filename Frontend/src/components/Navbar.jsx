import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Menu, X, LogOut, LayoutDashboard, ChevronDown, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  // Close mobile menu when screen is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/team', label: t('nav.team') },
    { path: '/faq', label: t('nav.faq') },
    { path: '/contact', label: t('nav.contact') },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* LEFT SECTION - Logo */}
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <span className="logo-icon">🌾</span>
            <span className="logo-text">AgriNova</span>
          </Link>
        </div>

        {/* CENTER SECTION - Navigation Links (Desktop only) */}
        <div className="navbar-center desktop-only">
          <div className="nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT SECTION - Actions */}
        <div className="navbar-right">
          <div className="desktop-only">
            <LanguageSwitcher />
          </div>
          
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {user ? (
            <div className="user-menu desktop-only" onClick={toggleUserMenu}>
              <div className="user-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="user-name">
                {user.name 
                  ? user.name.length > 8 
                    ? user.name.substring(0, 8) + '...' 
                    : user.name 
                  : 'User'}
              </span>
              <ChevronDown size={16} style={{ color: 'var(--text-secondary)' }} />
              
              {/* DROPDOWN MENU - OPENS WHEN CLICKED */}
              {isUserMenuOpen && (
                <div className="user-dropdown" onClick={(e) => e.stopPropagation()}>
                  <Link to="/dashboard" className="dropdown-item">
                    <LayoutDashboard size={16} />
                    {t('nav.dashboard')}
                  </Link>
                  <Link to="/history" className="dropdown-item">
                    <Clock size={16} />
                    {t('nav.history')}
                  </Link>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <LogOut size={16} />
                    {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons desktop-only">
              <Link to="/login" className="btn btn-outline">{t('nav.login')}</Link>
              <Link to="/signup" className="btn btn-primary">{t('nav.signup')}</Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          {/* Mobile Language Switcher */}
          <div className="mobile-language">
            <LanguageSwitcher />
          </div>

          {/* Mobile Navigation Links */}
          <div className="mobile-nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Auth Section */}
          {user ? (
            <div className="mobile-auth-section">
              <div className="mobile-user-info">
                <div className="mobile-user-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="mobile-user-name">{user.name || 'User'}</span>
              </div>
              <Link 
                to="/dashboard" 
                className="mobile-nav-link with-icon" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LayoutDashboard size={18} />
                {t('nav.dashboard')}
              </Link>
              <Link 
                to="/history" 
                className="mobile-nav-link with-icon" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Clock size={18} />
                {t('nav.history')}
              </Link>
              <button 
                className="mobile-nav-link with-icon logout" 
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
              >
                <LogOut size={18} />
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <div className="mobile-buttons">
              <Link 
                to="/login" 
                className="mobile-btn mobile-btn-outline" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.login')}
              </Link>
              <Link 
                to="/signup" 
                className="mobile-btn mobile-btn-primary" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.signup')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;