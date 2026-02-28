import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle, ArrowRight } from 'lucide-react';
import { useToast } from '../../components/ToastContainer';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: otp
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [expiryTime, setExpiryTime] = useState(null);
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, {
        email
      });
      
      // Store email in sessionStorage for reset password page
      sessionStorage.setItem('resetEmail', email);
      
      setStep(2);
      const expiresIn = response.data.expiresIn || 300; // Default 5 minutes
      setTimer(expiresIn);
      setExpiryTime(Date.now() + (expiresIn * 1000));
      startTimer(expiresIn);
      success('OTP sent to your email successfully!');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = (initialTime) => {
    setTimer(initialTime);
    setCanResend(false);
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setLoading(true);
    
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, {
        email
      });
      
      const expiresIn = response.data.expiresIn || 300;
      setTimer(expiresIn);
      setExpiryTime(Date.now() + (expiresIn * 1000));
      startTimer(expiresIn);
      setOtp(['', '', '', '', '', '']);
      success('OTP resent successfully!');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      showError('Please enter complete OTP');
      return;
    }
    
    setLoading(true);
    
    try {
      await axiosInstance.post(API_PATHS.AUTH.VERIFY_OTP, {
        email,
        otp: otpValue
      });
      
      success('OTP verified successfully!');
      // Navigate to reset password page
      navigate('/reset-password');
    } catch (err) {
      showError(err.response?.data?.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
              <h1>{step === 1 ? 'Forgot Password?' : 'Verify OTP'}</h1>
              <p>
                {step === 1 
                  ? 'Enter your email to reset your password' 
                  : `We've sent a 6-digit code to ${email}`}
              </p>
            </div>

            {step === 1 ? (
              /* STEP 1: Email Form */
              <form onSubmit={handleEmailSubmit} className="auth-form">
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
                    placeholder="Enter your registered email"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading ? 'Sending...' : (
                    <>
                      Send Reset Code <Send size={16} />
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
            ) : (
              /* STEP 2: OTP Verification */
              <form onSubmit={handleOtpSubmit} className="auth-form">
                <div className="success-message">
                  <CheckCircle size={40} />
                  <p>Verification code sent to {email}</p>
                </div>

                <div className="otp-group">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      className="otp-input"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      disabled={loading}
                    />
                  ))}
                </div>

                <div className="timer-text">
                  {timer > 0 ? (
                    <>Time remaining: <span>{formatTime(timer)}</span></>
                  ) : (
                    <>OTP expired. Please request a new one.</>
                  )}
                </div>

                <div className="resend-link">
                  <button 
                    type="button" 
                    onClick={handleResendOTP}
                    disabled={!canResend || loading}
                  >
                    {loading ? 'Sending...' : 'Resend OTP'}
                  </button>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-block"
                  disabled={otp.join('').length !== 6 || loading}
                >
                  {loading ? 'Verifying...' : (
                    <>
                      Verify & Continue <ArrowRight size={16} />
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
            )}
          </div>
        </div>

        {/* RIGHT SIDE - Image */}
        <div className="auth-image-side">
          <div className="auth-image-content">
            <div className="auth-image-emoji">🔐</div>
            <h2 className="auth-image-title">Reset Password</h2>
            <p className="auth-image-text">
              We'll help you regain access to your account securely
            </p>
            <div className="auth-image-features">
              <div className="auth-image-feature">
                <span>✅</span>
                <span>Secure Verification</span>
              </div>
              <div className="auth-image-feature">
                <span>✅</span>
                <span>Quick & Easy</span>
              </div>
              <div className="auth-image-feature">
                <span>✅</span>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;