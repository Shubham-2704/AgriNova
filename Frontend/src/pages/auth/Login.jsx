import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Chrome, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ name: email.split('@')[0], email });
    navigate('/dashboard');
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    navigate('/dashboard');
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
                <label htmlFor="password">
                  <Lock size={16} />
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="forgot-password">
                <a href="/forgot-password">Forgot Password?</a>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Login <ArrowRight size={16} />
              </button>
            </form>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <button onClick={handleGoogleLogin} className="btn-google">
              <Chrome size={18} />
              Continue with Google
            </button>

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