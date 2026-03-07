import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Check, X } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ToastContainer';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import './Auth.css';

const Signup = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
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
      showError(t('messages.passwordMismatch'));
      return;
    }
    if (!agreeTerms) {
      showError(t('messages.agreeTerms'));
      return;
    }
    if (!isPasswordValid) {
      showError(t('messages.passwordRequirements'));
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
      success(t('messages.signupSuccess'));
      navigate('/dashboard');
    } catch (err) {
      showError(err.response?.data?.message || t('messages.signupFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    setGoogleLoading(true);
    try {
      console.log('Google signup success:', tokenResponse);
      
      const response = await axiosInstance.post(API_PATHS.AUTH.GOOGLE_AUTH, {
        token: tokenResponse.access_token
      });

      login(response.data);
      success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Google signup error:', err);
      showError(err.response?.data?.message || 'Google signup failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: (error) => {
      console.error('Google signup error:', error);
      showError('Google signup failed');
      setGoogleLoading(false);
    }
  });

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* LEFT SIDE - Signup Form - 2 COLUMN LAYOUT, NO SCROLL */}
        <div className="auth-form-side">
          <div className="auth-form-container">
            <Link to="/" className="auth-logo">
              <img src="https://res.cloudinary.com/dpn6jplxx/image/upload/v1772553756/logo_usg4rl.png" alt="AgriNova" className="logo-image" />
              <span className="logo-text">AgriNova</span>
            </Link>

            <div className="auth-header">
              <h1>{t('auth.signupTitle')}</h1>
              <p>{t('auth.signupSubtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {/* TWO COLUMN LAYOUT - Name and Email in one line */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    <User size={16} />
                    {t('auth.fullName')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('auth.fullNamePlaceholder')}
                    required
                  />
                </div>

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
              </div>

              {/* TWO COLUMN LAYOUT - Password and Confirm in one line */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">
                    <Lock size={16} />
                    {t('auth.password')}
                  </label>
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

                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    <Lock size={16} />
                    {t('auth.confirmPassword')}
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t('auth.confirmPasswordPlaceholder')}
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
                    <span>{t('auth.minLength')}</span>
                  </div>
                  <div className={`requirement-item-compact ${passwordRequirements.hasUpperCase ? 'met' : ''}`}>
                    {passwordRequirements.hasUpperCase ? <Check size={12} /> : <X size={12} />}
                    <span>{t('auth.uppercase')}</span>
                  </div>
                  <div className={`requirement-item-compact ${passwordRequirements.hasLowerCase ? 'met' : ''}`}>
                    {passwordRequirements.hasLowerCase ? <Check size={12} /> : <X size={12} />}
                    <span>{t('auth.lowercase')}</span>
                  </div>
                  <div className={`requirement-item-compact ${passwordRequirements.hasNumber ? 'met' : ''}`}>
                    {passwordRequirements.hasNumber ? <Check size={12} /> : <X size={12} />}
                    <span>{t('auth.number')}</span>
                  </div>
                  <div className={`requirement-item-compact ${passwordRequirements.hasSpecialChar ? 'met' : ''}`}>
                    {passwordRequirements.hasSpecialChar ? <Check size={12} /> : <X size={12} />}
                    <span>{t('auth.specialChar')}</span>
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
                  {t('auth.agreeToTerms')} <Link to="/terms">{t('auth.terms')}</Link> {t('auth.and')} <Link to="/privacy-policy">{t('auth.privacyPolicy')}</Link>
                </label>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? t('auth.creatingAccount') : t('auth.signup')} <ArrowRight size={16} />
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
                  <span>{googleLoading ? 'Signing up with Google...' : 'Sign Up with Google'}</span>
                </div>
              </button>
            </div>

            <div className="auth-footer">
              <p>
                {t('auth.haveAccount')}
                <Link to="/login">{t('nav.login')}</Link>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Image with content */}
        <div className="auth-image-side">
          <div className="auth-image-content">
            <div className="auth-image-emoji">🌱</div>
            <h2 className="auth-image-title">{t('auth.startGrowing')}</h2>
            <p className="auth-image-text">
              {t('auth.signupImageText')}
            </p>
            <div className="auth-image-features">
              <div className="auth-image-feature">
                <span>✅</span>
                <span>{t('auth.freeAccount')}</span>
              </div>
              <div className="auth-image-feature">
                <span>✅</span>
                <span>{t('auth.noCreditCard')}</span>
              </div>
              <div className="auth-image-feature">
                <span>✅</span>
                <span>{t('auth.cancelAnytime')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;