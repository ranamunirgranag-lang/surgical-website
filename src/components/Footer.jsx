import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaGlobe, FaCertificate, FaShieldAlt, FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaPaperPlane, FaCode } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = ({ setCurrentPage }) => {
  const [quickMessage, setQuickMessage] = useState('');

  const handleNavClick = (pageName, e) => {
    if (setCurrentPage) {
      e.preventDefault();
      setCurrentPage(pageName);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 📧 DIRECT GMAIL WEB LAUNCHER: Browser mein seedha Gmail kholega
  const handleSendDirectEmail = (e) => {
    e.preventDefault();
    if (!quickMessage.trim()) {
      alert("Please type a short message first!");
      return;
    }
    const companyEmail = "ranaapexsurgical640@gmail.com";
    const subject = encodeURIComponent("Surgical Inquiry - Rana Apex Surgical");
    const body = encodeURIComponent(quickMessage);
    const gmailUrl = `https://google.com{companyEmail}&su=${subject}&body=${body}`;

    window.open(gmailUrl, '_blank');
    setQuickMessage('');
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
          
          {/* REAL DYNAMIC SOCIAL LINKS GROUP */}
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

        {/* Global Coordinates Vector Controls + Quick Email Box */}
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
              href="https://google.com"

                target="_blank" 
                rel="noopener noreferrer"
                className="footer-email-link"
                style={{ color: '#38bdf8', textDecoration: 'underline', cursor: 'pointer' }}
              >
                ranaapexsurgical640@gmail.com
              </a>
            </li>
          </ul>

          {/* 💌 PYARA SA QUICK EMAIL MESSAGE BOX */}
          <form 
            onSubmit={handleSendDirectEmail}
            style={{
              marginTop: '16px',
              background: 'rgba(255, 255, 255, 0.06)',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              ✉️ Quick Direct Email
            </span>
            <textarea
              placeholder="Write your quick inquiry here..."
              value={quickMessage}
              onChange={(e) => setQuickMessage(e.target.value)}
              rows="2"
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(15, 23, 42, 0.7)',
                color: '#ffffff',
                fontSize: '12px',
                resize: 'none',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                color: '#ffffff',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: '0.2s'
              }}
            >
              <FaPaperPlane /> Send via Gmail
            </button>
          </form>
        </div>
      </div>

        {/* Clean & Luxury Dark Bottom Horizon Line */}
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
        {/* Top Line: Copyright & Global Tag */}
        <p style={{ margin: 0, color: '#64748b', fontSize: '12.5px', letterSpacing: '0.4px' }}>
          &copy; {new Date().getFullYear()} <span style={{ color: '#94a3b8', fontWeight: '600' }}>RANA APEX SURGICAL</span>. All Engineering Rights Reserved. Global Medical Distribution Platform.
        </p>
        
        {/* Bottom Line: Sleek & Classy Blue Signature */}
        <div 
          style={{ 
            fontSize: '11.5px', 
            letterSpacing: '2.2px', 
            textTransform: 'uppercase', 
            color: '#94a3b8', 
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <span>MADE WITH</span>
          <span style={{ color: '#e11d48', fontSize: '13px' }}>♥</span>
          <span>BY</span>
          <span style={{ color: '#38bdf8', fontWeight: '600', letterSpacing: '2.5px' }}>FAQEEHA DEVELOPER</span>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
