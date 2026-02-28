import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Chrome, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    if (!agreeTerms) {
      alert("Please agree to Terms and Conditions");
      return;
    }
    login({ name, email });
    navigate('/dashboard');
  };

  const handleGoogleSignup = async () => {
    await loginWithGoogle();
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* LEFT SIDE - Signup Form - 2 COLUMN LAYOUT, NO SCROLL */}
        <div className="auth-form-side">
          <div className="auth-form-container">
            <Link to="/" className="auth-logo">
              <span className="logo-icon">🌾</span>
              <span className="logo-text">AgriNova</span>
            </Link>

            <div className="auth-header">
              <h1>Create Account</h1>
              <p>Join AgriNova today</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {/* TWO COLUMN LAYOUT - Name and Email in one line */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    <User size={16} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <Mail size={16} />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                  />
                </div>
              </div>

              {/* TWO COLUMN LAYOUT - Password and Confirm in one line */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">
                    <Lock size={16} />
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    <Lock size={16} />
                    Confirm
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>

              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <label htmlFor="terms">
                  I agree to the <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>
                </label>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Sign Up <ArrowRight size={16} />
              </button>
            </form>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <button onClick={handleGoogleSignup} className="btn-google">
              <Chrome size={18} />
              Sign up with Google
            </button>

            <div className="auth-footer">
              <p>
                Already have an account?
                <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Image with content */}
        <div className="auth-image-side">
          <div className="auth-image-content">
            <div className="auth-image-emoji">🌱</div>
            <h2 className="auth-image-title">Start Growing!</h2>
            <p className="auth-image-text">
              Join thousands of farmers using AI to maximize their yields
            </p>
            <div className="auth-image-features">
              <div className="auth-image-feature">
                <span>✅</span>
                <span>Free Account</span>
              </div>
              <div className="auth-image-feature">
                <span>✅</span>
                <span>No Credit Card</span>
              </div>
              <div className="auth-image-feature">
                <span>✅</span>
                <span>Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;