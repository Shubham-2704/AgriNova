import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
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

  const handleGoogleSuccess = async (tokenResponse) => {
    setGoogleLoading(true);
    try {
      console.log('Google login success:', tokenResponse);
      
      const response = await axiosInstance.post(API_PATHS.AUTH.GOOGLE_AUTH, {
        token: tokenResponse.access_token
      });

      login(response.data);
      success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Google login error:', err);
      showError(err.response?.data?.message || 'Google login failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: (error) => {
      console.error('Google login error:', error);
      showError('Google login failed');
      setGoogleLoading(false);
    }
  });

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* LEFT SIDE - Login Form */}
        <div className="auth-form-side">
          <div className="auth-form-container">
            <Link to="/" className="auth-logo">
              <img src="https://res.cloudinary.com/dpn6jplxx/image/upload/v1772553756/logo_usg4rl.png" alt="AgriNova" className="logo-image" />
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
              <button 
                className="btn-google" 
                onClick={() => {
                  setGoogleLoading(true);
                  googleLogin();
                }}
                disabled={googleLoading}
              >
                <div className="btn-google-content">
                  <svg className="google-icon" viewBox="0 0 48 48" width="18" height="18">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                  </svg>
                  <span>{googleLoading ? 'Logging in with Google...' : 'Login with Google'}</span>
                </div>
              </button>
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
            <div className="auth-image-emoji">
              <img src="https://res.cloudinary.com/dpn6jplxx/image/upload/v1772553756/logo_usg4rl.png" alt="AgriNova" className="auth-logo-image" />
            </div>
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