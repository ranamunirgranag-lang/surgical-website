
import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="modern-footer">
      <div className="footer-content">
        {/* Company Info */}
        <div className="footer-section">
          <h3>RANA APEX SURGICAL</h3>
          <p>Manufacturing premium quality surgical and dental instruments with extreme precision and global standards.</p>
        </div>

        {/* Quick Contact Info */}
        <div className="footer-section">
          <h3>Quick Contact</h3>
          <ul className="footer-contact-list">
            <li><FaMapMarkerAlt className="footer-icon" /> Kachehri Road, Sialkot, Punjab, Pakistan</li>
            <li><FaPhoneAlt className="footer-icon" /> +92 319 4195765</li>
            <li><FaEnvelope className="footer-icon" /> ranaapexsurgical640@gmailww.com</li>
          </ul>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Rana Apex Surgical. All Rights Reserved. Designed with React.</p>
      </div>
    </footer>
  );
};

export default Footer;
