import React, { useState } from 'react';
import { FaBriefcaseMedical, FaExchangeAlt, FaShoppingBag, FaBars, FaTimes } from 'react-icons/fa'; // FaBars aur FaTimes icons add kiye 3 lines k liye
import '../styles/Navbar.css';

const Navbar = ({ currentPage, setCurrentPage, inquiryCount }) => {
  // Mobile responsive menu toggle variable checking status open/close
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handlePageNavigation = (pageName) => {
    setCurrentPage(pageName);
    setIsMobileMenuOpen(false); // Mobile lines menu click hotay hi automatic close ho jaye ga
  };

  return (
    <nav className="modern-navbar">
      {/* Brand Branding Logo Group */}
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

      {/* DYNAMIC NAVIGATION LINKS: Mobile status check karke toggle class lagaye ga */}
      <ul className={`navbar-links ${isMobileMenuOpen ? 'mobile-links-active' : ''}`}>
        <li className={currentPage === 'home' ? 'active-link' : ''} onClick={() => handlePageNavigation('home')}>Home</li>
        <li className={currentPage === 'about' ? 'active-link' : ''} onClick={() => handlePageNavigation('about')}>About Us</li>
        <li className={currentPage === 'products' ? 'active-link' : ''} onClick={() => handlePageNavigation('products')}>Products</li>
        <li className={currentPage === 'contact' ? 'active-link' : ''} onClick={() => handlePageNavigation('contact')}>Contact Us</li>
        <li className={currentPage === 'login' ? 'active-link' : ''} onClick={() => handlePageNavigation('login')}>Login / Register</li>
      </ul>

      {/* Interactive Bucket Center */}
      <div className="navbar-bucket" onClick={() => handlePageNavigation('contact')}>
        <FaShoppingBag className="bucket-icon" />
        {inquiryCount > 0 && <span className="bucket-badge">{inquiryCount}</span>}
        <span className="bucket-text">Inquiry Bucket</span>
      </div>

      {/* MOBILE RESPONSIVE HAMBURGER BUTTON TRRIGGER LAYER */}
      <button className="mobile-menu-hamburger-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
    </nav>
  );
};

export default Navbar;
