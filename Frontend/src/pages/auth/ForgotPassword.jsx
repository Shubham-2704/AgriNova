import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle, ArrowRight } from 'lucide-react';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: otp
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      startTimer();
    }, 1500);
  };

  const startTimer = () => {
    setTimer(60);
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

  const handleResendOTP = () => {
    if (!canResend) return;
    // Resend OTP logic
    startTimer();
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

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      // Verify OTP
      navigate('/reset-password');
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
                  {loading ? (
                    <>Sending...</>
                  ) : (
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
                    />
                  ))}
                </div>

                <div className="timer-text">
                  {timer > 0 ? (
                    <>Resend code in <span>{timer}s</span></>
                  ) : (
                    <>You can resend the code now</>
                  )}
                </div>

                <div className="resend-link">
                  <button 
                    type="button" 
                    onClick={handleResendOTP}
                    disabled={!canResend}
                  >
                    Resend OTP
                  </button>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-block"
                  disabled={otp.join('').length !== 6}
                >
                  Verify & Continue <ArrowRight size={16} />
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