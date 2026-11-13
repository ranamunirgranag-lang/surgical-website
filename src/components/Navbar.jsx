import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 👈 Direct axios lagaya taake routing configure perfectly chale

import { FaBriefcaseMedical, FaExchangeAlt, FaShoppingBag, FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa'; 
import '../styles/Navbar.css';

const Navbar = ({ currentPage, setCurrentPage, inquiryCount }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [userName, setUserName] = useState('User'); // Default fallback text

  const userId = localStorage.getItem('token'); 
  const userPic = localStorage.getItem('userPic'); // Admin image selector layer

  // Live Dynamic URL Config Configuration
  const BACKEND_API_URL = import.meta.env.VITE_API_URL || 'https://vercel.app
/api';

  // 📡 DATABASE LIVE CONFIGURATION
  useEffect(() => {
    const fetchNavbarUserData = async () => {
      if (userId) {
        try {
          const response = await axios.get(`${BACKEND_API_URL}/auth/profile/${userId}`);
          if (response.data.success && response.data.user) {
            setUserName(response.data.user.name || 'User');
          }
        } catch (error) {
          console.error("Navbar sync glitch:", error.message);
        }
      }
    };
    fetchNavbarUserData();
  }, [userId, currentPage, BACKEND_API_URL]);

  const handlePageNavigation = (pageName) => {
    setCurrentPage(pageName);
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false); 
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('userPic'); // Clear admin portal attributes
    localStorage.removeItem('activeDashboardTab'); // Settings buffer clean
    setIsDropdownOpen(false);
    setCurrentPage('home'); 
  };

  // Extract initial text alphabet logic
  const getNavInitial = () => {
    return userName ? userName.charAt(0).toUpperCase() : 'U';
  };

  return (
    <nav className="modern-navbar">
      <div className="navbar-logo" onClick={() => handlePageNavigation('home')}>
        <div className="logo-icon-box">
          <FaBriefcaseMedical className="main-med-icon" />
          <FaExchangeAlt className="sub-apex-icon" />
        </div>
        <div className="logo-text-box">
          <span className="brand-name-top">RANA APEX</span>
          <span className="brand-name-sub">SURGICAL</span>
        </div>
      </div>

      <ul className={`navbar-links ${isMobileMenuOpen ? 'mobile-links-active' : ''}`}>
        <li className={currentPage === 'home' ? 'active-link' : ''} onClick={() => handlePageNavigation('home')}>Home</li>
        <li className={currentPage === 'about' ? 'active-link' : ''} onClick={() => handlePageNavigation('about')}>About Us</li>
        <li className={currentPage === 'products' ? 'active-link' : ''} onClick={() => handlePageNavigation('products')}>Products</li>
        <li className={currentPage === 'contact' ? 'active-link' : ''} onClick={() => handlePageNavigation('contact')}>Contact Us</li>
        {!userId && (
          <li className={currentPage === 'login' ? 'active-link' : ''} onClick={() => handlePageNavigation('login')}>Login / Register</li>
        )}
      </ul>

      <div className="navbar-right-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div className="navbar-bucket" onClick={() => handlePageNavigation('contact')}>
          <FaShoppingBag className="bucket-icon" />
          {inquiryCount > 0 && <span className="bucket-badge">{inquiryCount}</span>}
          <span className="bucket-text">Inquiry Bucket</span>
        </div>

        {userId && (
          <div className="profile-dropdown-wrapper" style={{ position: 'relative' }}>
            {/* 🎯 FIXED LAYER: Agar picture link available ho (Jaise master bypass user standard par) to dynamic avatar load hoga */}
            {userPic && userPic !== 'https://unsplash.com' ? (
              <img 
                src={userPic} 
                alt="Profile Indicator" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', 
                  objectFit: 'cover', cursor: 'pointer', border: '2px solid #fff',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}
              />
            ) : (
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #dc2626, #991b1b)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', border: '2px solid #fff',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)', textTransform: 'uppercase'
                }}
              >
                {getNavInitial()}
              </div>
            )}

            {isDropdownOpen && (
              <div className="avatar-dropdown-menu" style={{ position: 'absolute', right: 0, top: '50px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', width: '160px', zIndex: 1000, overflow: 'hidden' }}>
                <button onClick={() => handlePageNavigation('dashboard')} style={{ width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                  <FaUser style={{ color: '#4b5563' }} /> My Dashboard
                </button>
                <button onClick={handleLogout} style={{ width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#dc2626', borderTop: '1px solid #f3f4f6' }}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <button className="mobile-menu-hamburger-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
    </nav>
  );
};

export default Navbar;
