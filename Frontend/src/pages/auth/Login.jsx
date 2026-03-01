import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ToastContainer';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, user } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      });

      login(response.data);
      success('Welcome back! Login successful.');
      navigate('/dashboard');
    } catch (err) {
      showError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.GOOGLE_AUTH, {
        token: credentialResponse.credential
      });

      login(response.data);
      success('Welcome! Login successful with Google.');
      navigate('/dashboard');
    } catch (err) {
      showError(err.response?.data?.message || 'Google login failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    showError('Google login failed. Please try again.');
    setGoogleLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* LEFT SIDE - Login Form */}
        <div className="auth-form-side">
          <div className="auth-form-container">
            <Link to="/" className="auth-logo">
              <span className="logo-icon">🌾</span>
              <span className="logo-text">AgriNova</span>
            </Link>

            <div className="auth-header">
              <h1>Welcome Back</h1>
              <p>Login to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={16} />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <div className="password-label-row">
                  <label htmlFor="password">
                    <Lock size={16} />
                    Password
                  </label>
                  <Link to="/forgot-password" className="forgot-password-link">
                    Forgot Password?
                  </Link>
                </div>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'} <ArrowRight size={16} />
              </button>
            </form>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <div className="google-login-wrapper">
              {googleLoading ? (
                <button className="btn-google" disabled>
                  Signing in with Google...
                </button>
              ) : (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme="outline"
                  size="large"
                  text="signin_with"
                  width="100%"
                />
              )}
            </div>

            <div className="auth-footer">
              <p>
                Don't have an account?
                <Link to="/signup">Sign up</Link>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Image with content */}
        <div className="auth-image-side">
          <div className="auth-image-content">
            <div className="auth-image-emoji">🌾</div>
            <h2 className="auth-image-title">Hello, Farmer!</h2>
            <p className="auth-image-text">
              Access your personalized crop recommendations and farming insights
            </p>
            <div className="auth-image-features">
              <div className="auth-image-feature">
                <span>✅</span>
                <span>90%+ Prediction Accuracy</span>
              </div>
              <div className="auth-image-feature">
                <span>✅</span>
                <span>Real-time Weather Data</span>
              </div>
              <div className="auth-image-feature">
                <span>✅</span>
                <span>Profit Calculations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;