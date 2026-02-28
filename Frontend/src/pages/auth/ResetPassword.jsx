import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import './Auth.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const navigate = useNavigate();

  // Password requirements
  const requirements = [
    { text: 'At least 8 characters', met: password.length >= 8 },
    { text: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { text: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { text: 'Contains number', met: /[0-9]/.test(password) },
    { text: 'Contains special character', met: /[!@#$%^&*]/.test(password) },
  ];

  const allRequirementsMet = requirements.every(req => req.met);
  const passwordsMatch = password === confirmPassword && password !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!allRequirementsMet || !passwordsMatch) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/login?reset=success');
    }, 1500);
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
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setShowRequirements(true)}
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <Lock size={16} />
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              {/* Password Match Indicator */}
              {confirmPassword && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  color: passwordsMatch ? 'var(--success)' : 'var(--error)',
                  marginTop: '-0.3rem'
                }}>
                  {passwordsMatch ? (
                    <CheckCircle size={14} />
                  ) : (
                    <XCircle size={14} />
                  )}
                  <span>
                    {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                  </span>
                </div>
              )}

              {/* Password Requirements */}
              {showRequirements && (
                <div className="password-requirements">
                  <h4>Password Requirements:</h4>
                  {requirements.map((req, index) => (
                    <div key={index} className={`requirement-item ${req.met ? 'met' : ''}`}>
                      {req.met ? (
                        <CheckCircle size={12} />
                      ) : (
                        <XCircle size={12} />
                      )}
                      <span>{req.text}</span>
                    </div>
                  ))}
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary btn-block"
                disabled={loading || !allRequirementsMet || !passwordsMatch}
              >
                {loading ? (
                  <>Updating...</>
                ) : (
                  <>
                    Reset Password <ArrowRight size={16} />
                  </>
                )}
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