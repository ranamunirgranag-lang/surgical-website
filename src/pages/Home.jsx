import React from 'react';
import { FaAward, FaShieldAlt, FaShippingFast, FaArrowRight } from 'react-icons/fa';
import '../styles/Home.css';

// FIXED: Props ke bracket me setCurrentPage receive kiya ta-ke button click work kre
const Home = ({ setCurrentPage }) => {
  return (
    <div className="home-container">
      {/* 1. Modern Split-Screen Hero Section */}
      <section className="hero-split">
        <div className="hero-text-content">
          <span className="badge-tech">Next-Gen Medical Manufacturing</span>
          <h1>Precision Crafted Surgical Instruments</h1>
          <p>
            Rana Apex Surgical engineers premium quality dental, general surgery, and orthopedic instruments. 
            Built for ultimate durability and extreme surgical precision.
          </p>
          <div className="hero-cta-buttons">
            {/* FIXED: Explore Catalog par click krne se products page khule ga */}
            <button className="btn-primary" onClick={() => setCurrentPage('products')}>
              Explore Catalog <FaArrowRight />
            </button>
            
            {/* FIXED: Request Custom Sample par click krne se contact page khule ga */}
            <button className="btn-secondary-outline" onClick={() => setCurrentPage('contact')}>
              Request Custom Sample
            </button>
          </div>
          
          {/* Dynamic Counters Showcase */}
          <div className="hero-stats">
            <div className="stat-box">
              <h3>1,500+</h3>
              <p>Tools Catalog</p>
            </div>
            <div className="stat-box">
              <h3>100%</h3>
              <p>German Steel</p>
            </div>
            <div className="stat-box">
              <h3>30+</h3>
              <p>Global Clients</p>
            </div>
          </div>
        </div>

        {/* Dynamic Mosaic Grid for Images */}
        <div className="hero-image-mosaic">
          <div className="mosaic-card card-1">
            <span className="mosaic-label">Dental Tools</span>
          </div>
          <div className="mosaic-card card-2">
            <span className="mosaic-label">Surgical Scissors</span>
          </div>
          <div className="mosaic-card card-3">
            <span className="mosaic-label">Orthopedic</span>
          </div>
        </div>
      </section>

      {/* 2. Premium Grid Quality Core Features */}
      <section className="core-features-section">
        <div className="section-header-centered">
          <h2>Engineered To International Standards</h2>
          <p>Why healthcare facilities worldwide trust Rana Apex Surgical for their operating rooms.</p>
        </div>

        <div className="features-asymmetric-grid">
          <div className="feature-modern-card">
            <div className="feat-icon-wrapper"><FaShieldAlt /></div>
            <h3>Premium Material Grade</h3>
            <p>Forged exclusively from AISI 420/440 surgical grade stainless steel with high corrosion resistance.</p>
          </div>

          <div className="feature-modern-card">
            <div className="feat-icon-wrapper"><FaAward /></div>
            <h3>ISO & CE Compliant</h3>
            <p>Every single instrument undergoes rigorous 10-step quality auditing to assure zero micro-defects.</p>
          </div>

          <div className="feature-modern-card">
            <div className="feat-icon-wrapper"><FaShippingFast /></div>
            <h3>B2B Global Logistics</h3>
            <p>Streamlined bulk shipping pipelines delivering directly to hospitals and distribution centers worldwide.</p>
          </div>
        </div>
      </section>
            {/* 3. NEW SECTION: NEXT-GEN SURGICAL MANUFACTURING LAB & INTERACTIVE OVERVIEW */}
      <section className="manufacturing-lab-showcase">
        <div className="lab-split-grid">
          
          {/* Left Visual Pillar: Video Tour Overlay Canvas */}
          <div className="lab-video-canvas">
            <img 
              src="" 
              alt="Rana Apex Advanced Production Facility" 
              className="lab-main-visual"
            />
            <div className="pulse-play-layer">
              <div className="play-button-ring"></div>
              <span className="play-icon-medical">🩺</span>
            </div>
            <div className="floating-badge-production">
              <span className="live-dot-pulse"></span> Sialkot Factory Live Operations
            </div>
          </div>

          {/* Right Metrics Pillar: Technical Specifications Typewriter List */}
          <div className="lab-technical-specs">
            <span className="specs-subheading">Manufacturing Excellence</span>
            <h2>Where Material Science Meets Extreme Surgical Precision</h2>
            <p className="specs-lead-text">
              Our automated metallurgical forge filters alloys at atomic levels, creating ultra-light balance ratios for prolonged theater operations.
            </p>

            <div className="tech-specs-stack-list">
              <div className="spec-bullet-row">
                <div className="bullet-glow-dot">01</div>
                <div className="bullet-data-text">
                  <h4>Cryogenic Nitrogen Hardening</h4>
                  <p>Blades are tempered at -196°C to lock structural carbide matrices, multiplying edge retention by 5x.</p>
                </div>
              </div>

              <div className="spec-bullet-row">
                <div className="bullet-glow-dot">02</div>
                <div className="bullet-data-text">
                  <h4>Shadowless Electro-Chemical Matte Finish</h4>
                  <p>Zero high-intensity overhead glare refraction under specialized theater surgical LED matrices.</p>
                </div>
              </div>

              <div className="spec-bullet-row">
                <div className="bullet-glow-dot">03</div>
                <div className="bullet-data-text">
                  <h4>Microscopic Ultrasonic Cleansing Loop</h4>
                  <p>Multi-stage biological debris protection treatment prior to safe localized packaging cycles.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
               {/* 4. FIXED MASTER INSULATION: Inline background layer inject kar di hai ta-ke white dhabba 100% khatam ho jaye */}
      <section className="global-trust-testimonials" style={{ backgroundColor: '#eef2f6', background: 'linear-gradient(135deg, #eef2f6 0%, #e2e8f0 100%)', width: '100%', boxSizing: 'border-box' }}>
        <div className="trust-split-grid">
          
          <div className="trust-metrics-panel">
            <span className="trust-badge-tag">Global Presence</span>
            <h2>Supplying Trust to Leading Hospitals Worldwide</h2>
            <p className="trust-description-lead">
              From automated dental clinics to multi-theater surgical complexes, our supply lines empower healthcare distributions across continents.
            </p>
            <div className="metrics-expanded-grid">
              <div className="metric-data-card">
                <h3>45+</h3>
                <h4>Export Destinations</h4>
                <p>Fully compliant with international customs and biomedical delivery standards.</p>
              </div>
              <div className="metric-data-card">
                <h3>12M+</h3>
                <h4>Instruments Manufactured</h4>
                <p>Precision forged instruments supporting operating theaters over the decade.</p>
              </div>
            </div>
          </div>

          <div className="testimonials-cards-stack">
            <div className="testimonial-luxury-card">
              <div className="quote-icon-decor">“</div>
              <p className="testimonial-speech-text">
                "The AISI 420 needle holders we procured from Rana Apex Surgical maintain flawless grip tension even after 200+ sterilization autoclaving cycles. Outstanding structural durability."
              </p>
              <div className="buyer-profile-row">
                <div className="buyer-avatar-placeholder">DE</div>
                <div className="buyer-meta-info">
                  <h4>Dr. Elena Rostova</h4>
                  <p>Chief of Procurement, European Surgical Supply Ltd.</p>
                </div>
              </div>
            </div>

            <div className="testimonial-luxury-card">
              <div className="quote-icon-decor">“</div>
              <p className="testimonial-speech-text">
                "Finding bulk premium grade dental scaling kits with transparent white backgrounds and crystal clear descriptions was tough until we integrated with Apex catalog systems."
              </p>
              <div className="buyer-profile-row">
                <div className="buyer-avatar-placeholder">MK</div>
                <div className="buyer-meta-info">
                  <h4>Muhammad Khan</h4>
                  <p>Director, Al-Shifa Clinical Distributors</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>


    </div>
  );
};

export default Home;
