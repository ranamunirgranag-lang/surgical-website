import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { FaEye, FaEyeSlash, FaLock, FaEnvelope, FaUser, FaPhone, FaKey } from 'react-icons/fa'; 
import axios from 'axios';
import '../styles/LoginSignup.css';

function LoginSignup({ setCurrentPage }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', otp: '', newPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const BACKEND_API_URL = 'https://vercel.app';

  const checkPasswordStrength = (password) => {
    if (!password) { setPasswordStrength(''); return; }
    const strongRegex = /^(?=.*[a-z])(?=.*[0-9])(?=.*[@#$%^&+=!]).{6,}$/;
    const mediumRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{5,}$/;
    if (strongRegex.test(password)) { setPasswordStrength('Strong Password ✓ Perfect'); }
    else if (mediumRegex.test(password)) { setPasswordStrength('Medium Strength (Add symbols like @/#/$)'); }
    else { setPasswordStrength('Weak Password (Must be 5+ chars with numbers)'); }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'password' || e.target.name === 'newPassword') {
      checkPasswordStrength(e.target.value);
    }
  };

  const handleSendResetOtp = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      alert("Please enter your registered email address first!");
      return;
    }
    setLoadingReset(true);
    try {
      const res = await axios.post(`${BACKEND_API_URL}/auth/forgot-password`, { email: formData.email.trim() });
      if (res.data.success) {
        alert(`📩 ${res.data.msg}`);
        setOtpSent(true);
      } else {
        alert(`⚠️ ${res.data.msg}`);
      }
    } catch (error) {
      alert(`❌ ${error.response?.data?.msg || "Error sending verification code."}`);
    } finally {
      setLoadingReset(false);
    }
  };

  const handleConfirmResetPassword = async (e) => {
    e.preventDefault();
    if (!formData.otp.trim() || !formData.newPassword.trim()) {
      alert("Please enter both the 6-digit code and your new password!");
      return;
    }
    setLoadingReset(true);
    try {
      const res = await axios.post(`${BACKEND_API_URL}/auth/reset-password`, {
        email: formData.email.trim(),
        otp: formData.otp.trim(),
        newPassword: formData.newPassword
      });
      if (res.data.success) {
        alert(`🎉 ${res.data.msg}`);
        setIsForgot(false);
        setOtpSent(false);
        setIsLogin(true);
        setFormData({ ...formData, otp: '', newPassword: '', password: '' });
      } else {
        alert(`⚠️ ${res.data.msg}`);
      }
    } catch (error) {
      alert(`❌ ${error.response?.data?.msg || "Failed to reset password."}`);
    } finally {
      setLoadingReset(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      if (formData.email.trim() === 'faqeehataskeen@apex.com') {
        if (formData.password === 'faqeeha07@') {
          alert("🔓 Access Granted: Welcome Back, Master Admin Faqeeha Taskeen!");
          localStorage.setItem('token', '6a7d6ce8bd12a58dcb8bc557');
          localStorage.setItem('userPic', 'https://unsplash.com'); 
          setCurrentPage('admin');
          return;
        } else {
          alert("❌ Invalid Admin Password Key Match!");
          return;
        }
      }
      
      try {
        const response = await axios.post(`${BACKEND_API_URL}/auth/login`, { 
          email: formData.email, 
          password: formData.password 
        });
        if (response.data.success) {
          alert("🔓 Login Successful!");
          localStorage.setItem('token', response.data.token || response.data.user._id);
          setCurrentPage('dashboard');
        } else {
          alert(`⚠️ ${response.data.msg}`);
        }
      } catch (err) {
        try {
          const response = await loginUser(formData.email, formData.password);
          alert(response.msg);
          if (response.success) {
            localStorage.setItem('token', response.token || '6a7d6ce8bd12a58dcb8bc557');
            setCurrentPage('dashboard');
          }
        } catch (fallbackErr) {
          alert("❌ Invalid email or password!");
        }
      }
    } else {
      try {
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          pmdcLicense: formData.phone, 
          hospitalName: "Public Retail Buyer"
        };
        
        const res = await axios.post(`${BACKEND_API_URL}/auth/signup`, payload);
        
        if (res.data.success) {
          alert(`🎯 ${res.data.msg}`);
          setIsLogin(true);
        } else {
          alert(`⚠️ Alert: ${res.data.msg}`);
        }
      } catch (error) {
        const errorMsg = error.response?.data?.msg || error.response?.data?.message || error.message;
        alert(`❌ Network or Validation Error: ${errorMsg}`);
      }
    }
  };
    return (
    <div className="auth-container">
      <div className="auth-card-premium">
        <div className="medical-decor-line"></div>
        <h2 className="auth-title-heavy">
          {isForgot ? 'RECOVER PASSWORD' : isLogin ? 'RANA APEX SURGICAL' : 'CREATE ACCOUNT'}
        </h2>
        <p className="auth-subtitle-heavy">
          {isForgot
            ? 'Enter your registered email to receive a 6-digit security verification code'
            : isLogin
            ? 'Secure Customer Portal Access'
            : 'Register your profile to track retail orders and custom specifications'}
        </p>

        {isForgot ? (
          <form onSubmit={otpSent ? handleConfirmResetPassword : handleSendResetOtp} className="auth-form-heavy">
            <div className="input-icon-wrapper">
              <FaEnvelope className="input-side-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Enter Your Registered Email Address"
                required
                disabled={otpSent}
                className="auth-input-heavy"
                onChange={handleChange}
              />
            </div>

            {otpSent && (
              <>
                <div className="input-icon-wrapper">
                  <FaKey className="input-side-icon" />
                  <input
                    type="text"
                    name="otp"
                    maxLength="6"
                    value={formData.otp}
                    placeholder="Enter 6-Digit Code Sent to Email"
                    required
                    className="auth-input-heavy"
                    onChange={handleChange}
                  />
                </div>

                <div className="input-icon-wrapper" style={{ position: 'relative' }}>
                  <FaLock className="input-side-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    placeholder="Enter New Password"
                    required
                    className="auth-input-heavy"
                    onChange={handleChange}
                  />
                  <span
                    className="eye-toggle-icon-trigger"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#94a3b8' }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                {formData.newPassword && (
                  <div
                    className={`strength-badge-text ${passwordStrength.includes('Strong') ? 'str-green' : passwordStrength.includes('Medium') ? 'str-orange' : 'str-red'}`}
                    style={{ textAlign: 'left', fontSize: '12px', fontWeight: 'bold', marginTop: '-4px' }}
                  >
                    {passwordStrength}
                  </div>
                )}
              </>
            )}

            <button type="submit" disabled={loadingReset} className="auth-button-heavy">
              {loadingReset ? 'PLEASE WAIT...' : otpSent ? 'RESET PASSWORD NOW' : 'SEND 6-DIGIT CODE'}
            </button>

            <p className="auth-toggle-text-heavy" style={{ marginTop: '12px' }}>
              Remembered your password?{' '}
              <span
                className="auth-toggle-link-heavy"
                onClick={() => {
                  setIsForgot(false);
                  setOtpSent(false);
                }}
              >
                Back to Login
              </span>
            </p>
          </form>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="auth-form-heavy">
              {!isLogin && (
                <>
                  <div className="input-icon-wrapper">
                    <FaUser className="input-side-icon" />
                    <input type="text" name="name" placeholder="Your Full Name (e.g. Abdullah Khan)" required className="auth-input-heavy" onChange={handleChange} />
                  </div>
                  
                  <div className="input-icon-wrapper">
                    <FaPhone className="input-side-icon" />
                    <input 
                      type="tel" 
                      name="phone" 
                      maxLength="11" 
                      placeholder="Contact Mobile / WhatsApp Number (11 Digits)" 
                      required 
                      className="auth-input-heavy" 
                      onChange={handleChange} 
                    />
                  </div>
                </>
              )}
              
              <div className="input-icon-wrapper">
                <FaEnvelope className="input-side-icon" />
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email}
                  placeholder="Email Address / Admin Username" 
                  required 
                  className="auth-input-heavy" 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="input-icon-wrapper" style={{ position: 'relative' }}>
                <FaLock className="input-side-icon" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password" 
                  value={formData.password}
                  placeholder="Account Password" 
                  required 
                  className="auth-input-heavy" 
                  onChange={handleChange} 
                />
                <span className="eye-toggle-icon-trigger" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#94a3b8' }}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {isLogin && (
                <div style={{ textAlign: 'right', marginTop: '-6px', marginBottom: '4px' }}>
                  <span
                    onClick={() => {
                      setIsForgot(true);
                      setOtpSent(false);
                    }}
                    style={{ color: '#38bdf8', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Forgot Password?
                  </span>
                </div>
              )}

              {formData.password && (
                <div className={`strength-badge-text ${passwordStrength.includes('Strong') ? 'str-green' : passwordStrength.includes('Medium') ? 'str-orange' : 'str-red'}`} style={{ textAlign: 'left', fontSize: '12px', fontWeight: 'bold', marginTop: '-4px' }}>
                  {passwordStrength}
                </div>
              )}

              <button type="submit" className="auth-button-heavy">
                {isLogin ? 'AUTHENTICATE ACCESS' : 'CREATE ACCOUNT NOW'}
              </button>
            </form>

            <p className="auth-toggle-text-heavy">
              {isLogin ? "New to Apex Surgical? " : "Already have an account? "}
              <span className="auth-toggle-link-heavy" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Create Account' : 'Access Portal'}
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginSignup;

