import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Chrome, ArrowRight, Eye, EyeOff, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ToastContainer';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import './Auth.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Password validation
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showError("Passwords don't match!");
      return;
    }
    if (!agreeTerms) {
      showError("Please agree to Terms and Conditions");
      return;
    }
    if (!isPasswordValid) {
      showError("Password does not meet all requirements");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name,
        email,
        password
      });

      login(response.data);
      success('Account created successfully! Welcome to AgriNova.');
      navigate('/dashboard');
    } catch (err) {
      showError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    // TODO: Implement Google OAuth
    alert('Google signup coming soon!');
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
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    <Lock size={16} />
                    Confirm
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Compact Password Requirements - 2 columns */}
              {password && (
                <div className="password-requirements-compact">
                  <div className={`requirement-item-compact ${passwordRequirements.minLength ? 'met' : ''}`}>
                    {passwordRequirements.minLength ? <Check size={12} /> : <X size={12} />}
                    <span>8+ chars</span>
                  </div>
                  <div className={`requirement-item-compact ${passwordRequirements.hasUpperCase ? 'met' : ''}`}>
                    {passwordRequirements.hasUpperCase ? <Check size={12} /> : <X size={12} />}
                    <span>Uppercase</span>
                  </div>
                  <div className={`requirement-item-compact ${passwordRequirements.hasLowerCase ? 'met' : ''}`}>
                    {passwordRequirements.hasLowerCase ? <Check size={12} /> : <X size={12} />}
                    <span>Lowercase</span>
                  </div>
                  <div className={`requirement-item-compact ${passwordRequirements.hasNumber ? 'met' : ''}`}>
                    {passwordRequirements.hasNumber ? <Check size={12} /> : <X size={12} />}
                    <span>Number</span>
                  </div>
                  <div className={`requirement-item-compact ${passwordRequirements.hasSpecialChar ? 'met' : ''}`}>
                    {passwordRequirements.hasSpecialChar ? <Check size={12} /> : <X size={12} />}
                    <span>Special (!@#$)</span>
                  </div>
                </div>
              )}

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

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Creating Account...' : 'Sign Up'} <ArrowRight size={16} />
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