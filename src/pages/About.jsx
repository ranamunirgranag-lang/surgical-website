import React from 'react';
import { FaCogs, FaCheckCircle, FaAward, FaEye, FaTools } from 'react-icons/fa';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-page-container">
      {/* 1. Epic Hero Section */}
      <header className="about-header-banner-premium animate-fade-up">
        <div className="banner-glass-overlay">
          <span className="about-subtitle-tech">QUALITY MANUFACTURING HUB</span>
          <h2>Engineering Excellence & <span className="text-highlight-blue-title">Surgical Mastery</span></h2>
          <p>
            Rana Apex Surgical is a premium manufacturing facility specializing in high-precision, 
            biocompatible dental, orthopedic, and general surgical instruments.
          </p>
        </div>
      </header>

      {/* 2. Dual Pillars */}
      <section className="about-pillars-grid">
        <div className="pillar-modern-card mandate-blue animate-fade-up">
          <div className="pillar-icon-box"><FaEye /></div>
          <div className="pillar-text-content">
            <h3>Our Mission</h3>
            <p>
              To deliver highly precise and reliable surgical instruments that ensure total control and safety in operating theaters worldwide.
            </p>
          </div>
        </div>
        
        <div className="pillar-modern-card quality-slate animate-fade-up">
          <div className="pillar-icon-box"><FaAward /></div>
          <div className="pillar-text-content">
            <h3>Premium Steel Grade</h3>
            <p>
              Forged exclusively from surgical grade stainless steel alloy that guarantees lifelong rust resistance and extreme durability.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Short & Clean 3-Stage Process Grid */}
      <section className="about-detailed-workflow">
        <div className="section-title-centered-premium">
          <h2>The Advanced Forging System</h2>
          <p>Uncompromising industrial production standards executed within our facility.</p>
        </div>

        <div className="workflow-timeline-grid">
          <div className="workflow-card-premium animate-fade-up">
            <div className="workflow-badge">STAGE 01</div>
            <div className="w-icon-box"><FaTools /></div>
            <h3>Pneumatic <span className="text-highlight">Hot Forging</span></h3>
            <p>Raw steel bars are heated to optimal temperatures and hammered into instrument profiles via heavy drop-forging presses.</p>
          </div>

          <div className="workflow-card-premium animate-fade-up">
            <div className="workflow-badge">STAGE 02</div>
            <div className="w-icon-box"><FaCogs /></div>
            <h3>Precision <span className="text-highlight">Milling & Alignment</span></h3>
            <p>Using advanced fixtures, the box-locks and joints are configured. Master tool-makers hand-grind teeth for zero-play alignment.</p>
          </div>

          <div className="workflow-card-premium animate-fade-up">
            <div className="workflow-badge">STAGE 03</div>
            <div className="w-icon-box"><FaCheckCircle /></div>
            <h3>Chemical <span className="text-highlight">Passivation</span></h3>
            <p>Instruments undergo precise passivation baths to remove free surface iron, ensuring a pristine lifelong anti-rust layer.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;




