import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaCertificate, FaShieldAlt, FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = ({ setCurrentPage }) => {
  const handleNavClick = (pageName, e) => {
    if (setCurrentPage) {
      e.preventDefault();
      setCurrentPage(pageName);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openGmailTab = (e) => {
    e.preventDefault();
    const url = "https://" + "://google.com" + "/mail/?view=cm&fs=1&to=ranaapexsurgical640@gmail.com";
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <footer className="modern-footer">
      <div className="footer-top-grid">
        
        {/* Company Vision Portfolio Column */}
        <div className="footer-brand-column">
          <div className="footer-logo-title-group">
            <span className="footer-logo-icon">🔬</span>
            <h3>RANA APEX SURGICAL</h3>
          </div>
          <p className="footer-brand-desc">
            Engineered with absolute biological compliance. Manufacturing premium surgical, orthopedic, 
            and dental instruments with uncompromised precision for medical hubs worldwide.
          </p>
          
          <div className="footer-social-media-wrapper">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn facebook" title="Follow on Facebook">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn instagram" title="Follow on Instagram">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn linkedin" title="Connect on LinkedIn">
              <FaLinkedinIn />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn youtube" title="Subscribe on YouTube">
              <FaYoutube />
            </a>
          </div>

          <div className="footer-trust-badges">
            <span className="badge-pill"><FaShieldAlt /> FDA Compliant</span>
            <span className="badge-pill"><FaCertificate /> ISO 13485</span>
          </div>
        </div>

        {/* Corporate Navigation */}
        <div className="footer-links-column">
          <h4>Corporate Navigation</h4>
          <ul className="footer-navigation-links">
            <li><a href="#home" onClick={(e) => handleNavClick('home', e)}> Home Workspace</a></li>
            <li><a href="#about" onClick={(e) => handleNavClick('about', e)}> About Our Forge</a></li>
            <li><a href="#products" onClick={(e) => handleNavClick('products', e)}> Instruments Catalog</a></li>
            <li><a href="#contact" onClick={(e) => handleNavClick('contact', e)}> Contact Helpline</a></li>
            <li><a href="#login" onClick={(e) => handleNavClick('login', e)}> Client Login</a></li>
            <li><a href="#register" onClick={(e) => handleNavClick('login', e)}> Register Account</a></li>
          </ul>
        </div>

        {/* Instrument Catalog */}
        <div className="footer-links-column">
          <h4>Instrument Catalog</h4>
          <ul className="footer-navigation-links">
            <li><a href="#products" onClick={(e) => handleNavClick('products', e)}>All Instruments</a></li>
            <li><a href="#products" onClick={(e) => handleNavClick('products', e)}>Dental Instruments</a></li>
            <li><a href="#products" onClick={(e) => handleNavClick('products', e)}>General Surgery Tools</a></li>
            <li><a href="#products" onClick={(e) => handleNavClick('products', e)}>Orthopedic Tools</a></li>
          </ul>
        </div>

        {/* Corporate Headquarters */}
        <div className="footer-contact-column">
          <h4>Corporate Headquarters</h4>
          <ul className="footer-contact-list">
            <li>
              <div className="icon-circle"><FaMapMarkerAlt /></div>
              <span>Kachehri Road, Sialkot, Punjab, Pakistan</span>
            </li>
            <li>
              <div className="icon-circle"><FaPhoneAlt /></div>
              <span>+92 319 4195765</span>
            </li>
            <li>
              <div className="icon-circle"><FaEnvelope /></div>
              <a 
                href="#email"
                onClick={openGmailTab}
                className="footer-email-link"
                style={{ color: '#38bdf8', textDecoration: 'underline', cursor: 'pointer' }}
              >
                ranaapexsurgical640@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright Line */}
      <div 
        style={{ 
          backgroundColor: '#09111e', 
          borderTop: '1px solid rgba(255, 255, 255, 0.08)', 
          padding: '28px 20px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '10px',
          textAlign: 'center',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <p style={{ margin: 0, color: '#64748b', fontSize: '12.5px', letterSpacing: '0.4px' }}>
          &copy; {new Date().getFullYear()} <span style={{ color: '#94a3b8', fontWeight: '600' }}>RANA APEX SURGICAL</span>. All Engineering Rights Reserved. Global Medical Distribution Platform.
        </p>
        <p style={{ margin: 0, color: '#38bdf8', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
          MADE WITH ❤️ BY FAQEEHA DEVELOPER
        </p>
      </div>
    </footer>
  );
};

export default Footer;
