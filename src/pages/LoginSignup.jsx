import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { FaEye, FaEyeSlash, FaLock, FaEnvelope, FaUser, FaPhone } from 'react-icons/fa'; 
import axios from 'axios';
import '../styles/LoginSignup.css';

function LoginSignup({ setCurrentPage }) {
  const [isLogin, setIsLogin] = useState(true);
  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  // ✅ LIVE BACKEND URL DIRECTLY CONNECTED (No more localhost error!)
  const BACKEND_API_URL = import.meta.env.VITE_API_URL || 'https://vercel.app';

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
    if (e.target.name === 'password') { checkPasswordStrength(e.target.value); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      // 🔐 SECRET ADMIN BYPASS PORTAL ENTRY GATE
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
      
      // 🟢 LIVE BACKEND LOGIN
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
          alert("❌ Network Error: Backend server is not responding. Check Vercel Deployment Protection.");
        }
      }
    } else {
      // 🛡️ LIVE BACKEND REGISTRATION
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
        console.error("Direct Register Error Intercepted:", error);
        const errorMsg = error.response?.data?.msg || error.response?.data?.message || error.message;
        alert(`❌ Network or Validation Error: ${errorMsg}`);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card-premium">
        <div className="medical-decor-line"></div>
        <h2 className="auth-title-heavy">{isLogin ? 'RANA APEX SURGICAL' : 'CREATE ACCOUNT'}</h2>
        <p className="auth-subtitle-heavy">
          {isLogin ? 'Secure Customer Portal Access' : 'Register your profile to track retail orders and custom specifications'}
        </p>

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
              placeholder="Account Password" 
              required 
              className="auth-input-heavy" 
              onChange={handleChange} 
            />
            <span className="eye-toggle-icon-trigger" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#94a3b8' }}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

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
      </div>
    </div>
  );
}

export default LoginSignup;
