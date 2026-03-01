import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/team', label: 'Our Team' },
    { path: '/faq', label: 'FAQ' },
    { path: '/contact', label: 'Contact Us' },
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

        {/* CENTER SECTION - Navigation Links */}
        <div className="navbar-center">
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
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {user ? (
            <div className="user-menu" onClick={toggleUserMenu}>
              <div className="user-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="user-name">{user.name || 'User'}</span>
              <ChevronDown size={16} style={{ color: 'var(--text-secondary)' }} />
              
              {/* DROPDOWN MENU - OPENS WHEN CLICKED */}
              {isUserMenuOpen && (
                <div className="user-dropdown" onClick={(e) => e.stopPropagation()}>
                  <Link to="/dashboard" className="dropdown-item">
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
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
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              <Link to="/dashboard" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                <LayoutDashboard size={16} style={{ marginRight: '8px' }} />
                Dashboard
              </Link>
              <button 
                className="nav-link logout" 
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
              >
                <LogOut size={16} style={{ marginRight: '8px' }} />
                Logout
              </button>
            </>
          ) : (
            <div className="mobile-buttons">
              <Link to="/login" className="btn btn-outline btn-block" onClick={() => setIsMobileMenuOpen(false)}>
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary btn-block" onClick={() => setIsMobileMenuOpen(false)}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;