import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/landing/LandingPage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/dashboard/Dashboard';
import { PredictionHistory } from './pages/history';
import AboutUs from './pages/info/AboutUs';
import OurTeam from './pages/info/OurTeam';
import FAQ from './pages/info/FAQ';
import { PrivacyPolicy, TermsOfService, CookiePolicy } from './pages/legal';
import { ContactUs } from './pages/contact';
import NotFound from './pages/notfound/NotFound';
import CookieConsent from './components/CookieConsent';
import './App.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <>
      <CookieConsent />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/team" element={<OurTeam />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/history" 
          element={
            <ProtectedRoute>
              <PredictionHistory />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;