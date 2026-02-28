import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, Check, X, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../../components/ToastContainer';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import './Auth.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  // Get email from sessionStorage
  const email = sessionStorage.getItem('resetEmail');

  useEffect(() => {
    // Don't redirect if reset was successful
    if (!email && !resetSuccess) {
      // Redirect to forgot password if no email found
      navigate('/forgot-password');
    }
  }, [email, resetSuccess, navigate]);

  // Password requirements
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const passwordsMatch = password === confirmPassword && password !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isPasswordValid || !passwordsMatch) {
      showError('Please meet all password requirements');
      return;
    }
    
    setLoading(true);
    
    try {
      await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, {
        email,
        newPassword: password
      });
      
      // Set success flag before clearing storage
      setResetSuccess(true);
      
      // Clear email from sessionStorage
      sessionStorage.removeItem('resetEmail');
      
      success('Password reset successfully! Please login with your new password.');
      
      // Navigate to login with success message
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1000);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* LEFT SIDE - Form */}
        <div className="auth-form-side">
          <div className="auth-form-container">
            <Link to="/" className="auth-logo">
              <span className="logo-icon">🌾</span>
              <span className="logo-text">AgriNova</span>
            </Link>

            <div className="auth-header">
              <h1>Set New Password</h1>
              <p>Create a strong password for your account</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="password">
                  <Lock size={16} />
                  New Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
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
                  Confirm Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
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

              {/* Password Requirements - Compact 2 Column */}
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

              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className={`password-match-indicator ${passwordsMatch ? 'match' : 'no-match'}`}>
                  {passwordsMatch ? <Check size={14} /> : <X size={14} />}
                  <span>
                    {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                  </span>
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary btn-block"
                disabled={loading || !isPasswordValid || !passwordsMatch}
              >
                {loading ? 'Updating...' : 'Reset Password'} <ArrowRight size={16} />
              </button>

              <div className="back-to-login">
                <Link to="/login">
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT SIDE - Image */}
        <div className="auth-image-side">
          <div className="auth-image-content">
            <div className="auth-image-emoji">🔒</div>
            <h2 className="auth-image-title">Create New Password</h2>
            <p className="auth-image-text">
              Make sure your new password is strong and secure
            </p>
            <div className="auth-image-features">
              <div className="auth-image-feature">
                <span>✅</span>
                <span>Encrypted Security</span>
              </div>
              <div className="auth-image-feature">
                <span>✅</span>
                <span>Password Strength Check</span>
              </div>
              <div className="auth-image-feature">
                <span>✅</span>
                <span>Instant Update</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;