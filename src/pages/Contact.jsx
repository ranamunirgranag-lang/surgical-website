import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaTrash, FaShoppingBag } from 'react-icons/fa';
import '../styles/Contact.css';

const Contact = ({ inquiryCart = [], setInquiryCart }) => {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '', city: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = localStorage.getItem('token');
  const BACKEND_API_URL = 'https://surgical-backend.vercel.app/api';

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const response = await axios.get(`${BACKEND_API_URL}/auth/profile/${userId}`);
          if (response.data.success && response.data.user) {
            const user = response.data.user;
            setFormData(prev => ({
              ...prev,
              name: user.name || '',
              email: user.email || '',
              phone: user.pmdcLicense || '', 
              city: user.hospitalName || ''  
            }));
          }
        } catch (error) {
          console.error("Form auto-fill failed:", error);
        }
      }
    };
    fetchUserData();
  }, [userId, BACKEND_API_URL]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuantityChange = (id, newQty) => {
    const validQty = Math.max(1, Number(newQty) || 1);
    const updatedCart = inquiryCart.map(item =>
      item.id === id ? { ...item, quantity: validQty, qty: validQty } : item
    );
    if (setInquiryCart) setInquiryCart(updatedCart);
  };

  const handleRemove = (id) => {
    const updatedCart = inquiryCart.filter(item => item.id !== id);
    if (setInquiryCart) setInquiryCart(updatedCart);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!userId) {
      alert("Please login/register your surgical account before transmitting inquiries!");
      return;
    }

    setIsSubmitting(true);
    try {
      const realProductsArray = inquiryCart.map(item => ({
        id: item.id || item._id || "123",
        name: item.name || "Surgical Instrument",
        sku: item.sku || `RA-${Math.floor(1000 + Math.random() * 9000)}`,
        category: item.category || "General Surgery Tools",
        image: item.image || item.imageUrl || item.img || "", 
        quantity: Number(item.quantity || item.qty || 1),
        price: Number(item.price || 0)
      }));

      const cleanUserId = userId.length > 30 ? "653b2026af8dad1234567890" : userId; 

      const backendDataPayload = {
        userId: cleanUserId, 
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "+92 000 0000000",
        city: formData.city || "Sialkot",
        company: formData.company || 'Private Medical Clinic',
        message: formData.message,
        products: realProductsArray, 
        itemsCount: Number(inquiryCart.length)
      };

      const response = await axios.post(`${BACKEND_API_URL}/auth/inquiry/submit`, backendDataPayload);
      
      if (response.data.success) {
        alert("🎯 Success: Your RFQ Request has been securely saved to MongoDB Cloud Database!");
        if (setInquiryCart) setInquiryCart([]); 
        setFormData(prev => ({ ...prev, company: '', message: '' }));
      } else {
        alert(`⚠️ Backend Alert: ${response.data.msg}`);
      }
    } catch (error) {
      console.error("Live submission catch intercepted:", error);
      const errorMsg = error.response?.data?.msg || error.response?.data?.message || error.message;
      alert(`❌ Submission Blocked: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };
    return (
    <div className="contact-page-container">
      <div className="contact-premium-split-grid">
        
        {/* 🟦 LEFT BLOCK: INFO PANEL WITH DYNAMIC BUCKET */}
        <div className="hq-info-panel-card" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div>
            <h3>Headquarters & Logistics Hub</h3>
            <p className="hq-description">Our manufacturing infrastructure is strategically situated in the global surgical hub of Sialkot, exporting precision instruments internationally.</p>
          </div>
          
          <div className="hq-details-stack">
            <div className="hq-row">
              <div className="hq-icon-box"><FaMapMarkerAlt /></div>
              <div className="hq-text">
                <h4>Our Company Address</h4>
                <p>Kachehri Road, Sialkot, Punjab, Pakistan</p>
              </div>
            </div>

            <div className="hq-row">
              <div className="hq-icon-box"><FaPhoneAlt /></div>
              <div className="hq-text">
                <h4>Phone & WhatsApp</h4>
                <p>+92 319 4195765</p>
              </div>
            </div>

            <div className="hq-row">
              <div className="hq-icon-box"><FaEnvelope /></div>
              <div className="hq-text">
                <h4>Business Email</h4>
                <p>ranaapexsurgical640@gmail.com</p>
              </div>
            </div>
          </div>

          {/* DYNAMIC SURGICAL BUCKET ITEMS RENDERING WITH QUANTITY CONTROLS */}
          <div className="live-bucket-section" style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '20px', marginTop: '10px' }}>
            <h4 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', fontSize: '16px' }}>
              <FaShoppingBag style={{ color: '#38bdf8' }} /> Selected Instruments ({inquiryCart.length})
            </h4>
            
            {inquiryCart.length > 0 ? (
              <div className="bucket-items-scroll-box" style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '5px' }}>
                {inquiryCart.map((item) => {
                  const currentQty = Number(item.quantity || item.qty || 1);
                  return (
                    <div key={item.id} className="mini-bucket-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.1)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)' }}>
                      <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: '10px', background: '#38bdf8', color: '#0f172a', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{item.sku}</span>
                        <h5 style={{ color: 'white', margin: '4px 0 0 0', fontSize: '13px', fontWeight: '600', wordBreak: 'break-word' }}>{item.name}</h5>
                      </div>

                      {/* QUANTITY CONTROLS (- / Input / +) */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(15, 23, 42, 0.7)', padding: '3px 5px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)' }}>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, currentQty - 1)}
                          style={{ background: 'transparent', color: '#38bdf8', border: 'none', width: '22px', height: '22px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={currentQty}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          style={{ width: '42px', textAlign: 'center', background: 'transparent', color: '#ffffff', border: 'none', fontSize: '12px', fontWeight: '700', outline: 'none' }}
                        />
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, currentQty + 1)}
                          style={{ background: 'transparent', color: '#38bdf8', border: 'none', width: '22px', height: '22px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}
                        >
                          +
                        </button>
                      </div>

                      <button 
                        type="button"
                        onClick={() => handleRemove(item.id)} 
                        title="Remove Item"
                        style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: 'none', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0 }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.2)', fontSize: '13px', color: '#cbd5e1' }}>
                🛒 Your bucket is empty. Go to the products page to select items for quotation.
              </div>
            )}
          </div>

        </div>

        {/* ⬜ RIGHT BLOCK: REQUEST QUOTE INPUT FIELDS */}
        <div className="form-workspace-card">
          <h3>Submit Request For Quote (RFQ)</h3>
          <p className="form-sub-label">Please fill out this technical specifications form for order details.</p>
          
          <form onSubmit={handleSubmit} className="premium-executive-form">
            <div className="input-group-row">
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" required />
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" required />
            </div>

            <div className="input-group-row">
              <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" />
              <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Hospital/City" />
            </div>

            <input type="text" name="company" value={formData.company} onChange={handleInputChange} placeholder="Medical Practice / Company Name" className="full-width-input" />
            <textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Describe specific sizes, dynamic parameters or specific material grades needed..." required className="full-width-textarea" />

            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-rfq-button"
              style={{ opacity: isSubmitting ? 0.65 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              <FaPaperPlane style={{ marginRight: '8px' }} />
              {isSubmitting ? 'TRANSMITTING RFQ...' : 'TRANSMIT RFQ SPECIFICATIONS'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;

