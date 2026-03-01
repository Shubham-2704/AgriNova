import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ToastContainer';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import './Auth.css';

const Login = () => {
  const { t } = useTranslation();
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
      success(t('messages.loginSuccess'));
      navigate('/dashboard');
    } catch (err) {
      showError(err.response?.data?.message || t('messages.loginFailed'));
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
      success(t('messages.googleLoginSuccess'));
      navigate('/dashboard');
    } catch (err) {
      showError(err.response?.data?.message || t('messages.googleLoginFailed'));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    showError(t('messages.googleLoginFailed'));
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
              <h1>{t('auth.loginTitle')}</h1>
              <p>{t('auth.loginSubtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={16} />
                  {t('auth.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder')}
                  required
                />
              </div>

              <div className="form-group">
                <div className="password-label-row">
                  <label htmlFor="password">
                    <Lock size={16} />
                    {t('auth.password')}
                  </label>
                  <Link to="/forgot-password" className="forgot-password-link">
                    {t('auth.forgotPassword')}
                  </Link>
                </div>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.passwordPlaceholder')}
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
                {loading ? t('auth.loggingIn') : t('auth.login')} <ArrowRight size={16} />
              </button>
            </form>

            <div className="auth-divider">
              <span>{t('auth.orContinueWith')}</span>
            </div>

            <div className="google-login-wrapper">
              {googleLoading ? (
                <button className="btn-google" disabled>
                  {t('auth.signInWithGoogle')}
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
                {t('auth.noAccount')}
                <Link to="/signup">{t('nav.signup')}</Link>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Image with content */}
        <div className="auth-image-side">
          <div className="auth-image-content">
            <div className="auth-image-emoji">🌾</div>
            <h2 className="auth-image-title">{t('auth.helloFarmer')}</h2>
            <p className="auth-image-text">
              {t('auth.loginImageText')}
            </p>
            <div className="auth-image-features">
              <div className="auth-image-feature">
                <span>✅</span>
                <span>{t('auth.predictionAccuracy')}</span>
              </div>
              <div className="auth-image-feature">
                <span>✅</span>
                <span>{t('auth.realTimeWeather')}</span>
              </div>
              <div className="auth-image-feature">
                <span>✅</span>
                <span>{t('auth.profitCalculations')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;