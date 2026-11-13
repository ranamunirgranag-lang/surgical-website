import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 👈 Direct axios lagaya taake base url config ka rona na rahe
import { FaEye, FaEyeSlash, FaLock, FaCheckCircle, FaUser, FaHistory, FaKey, FaSignOutAlt } from 'react-icons/fa';

export default function UserDashboard() {
  // ⚡ FIXED: activeTab ko local storage se uthayein ge taake page refresh ya back jane par wahi tab khula rahe
  const [activeTab, setActiveTab] = useState(localStorage.getItem('activeDashboardTab') || 'profile'); 
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]); 
 
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    pmdcLicense: '', 
    hospitalName: '' 
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const userId = localStorage.getItem('token'); 
  
  // Dynamic Environment Configuration (Localhost aur Live hosting dono handle karega)
 const BACKEND_API_URL = 'https://vercel.app';


    useEffect(() => {
    const fetchUserProfileAndHistory = async () => {
      if (!userId) { setLoading(false); return; }
      try {
        // 🎯 FIXED LAYER: Cache burst parameter (?t=...) lagaya taake browser purana data cache na kare aur humesha database se direct dynamic text uthaye
        const response = await axios.get(`${BACKEND_API_URL}/auth/profile/${userId}?t=${new Date().getTime()}`);
        if (response.data.success && response.data.user) {
          const dbUser = response.data.user;
          setUserData({
            name: dbUser.name || '',
            email: dbUser.email || '',
            pmdcLicense: dbUser.pmdcLicense || '', 
            hospitalName: dbUser.hospitalName || ''
          });
          setOrders(response.data.purchases || []);
        }
        setLoading(false);
      } catch (error) {
        console.error("Dashboard Sync Failed:", error);
        setLoading(false);
      }
    };
    fetchUserProfileAndHistory();
  }, [userId, BACKEND_API_URL]);


  // Tab change handler jo choice ko browser memory mein save rakhega
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    localStorage.setItem('activeDashboardTab', tabName);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      // 🎯 FIXED: Backend code logic ke mutabiq route /auth/profile/update/:userId hai (No double /api/auth)
      const response = await axios.put(`${BACKEND_API_URL}/auth/profile/update/${userId}`, {
        name: userData.name,
        pmdcLicense: userData.pmdcLicense,      
        hospitalName: userData.hospitalName
      });
      if (response.data.success) {
        alert("🎯 Success: Profile settings locked inside cloud registry!");
        
        // ⚡ FIXED: window.location.reload() ki jagah direct state state sync karein taake picture ya names flash na hon
        if(response.data.user) {
          setUserData({
            name: response.data.user.name || '',
            email: response.data.user.email || '',
            pmdcLicense: response.data.user.pmdcLicense || '',
            hospitalName: response.data.user.hospitalName || ''
          });
        }
      }
    } catch (error) {
      console.error("Update Error:", error);
      const errorMsg = error.response?.data?.msg || error.response?.data?.message || "Update pipeline failed.";
      alert(`❌ Operational Error: ${errorMsg}`);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("❌ Error: New Password mismatch validation keys!");
      return;
    }
    try {
      // 🎯 FIXED: Sahi secure absolute path structure setup
      const response = await axios.put(`${BACKEND_API_URL}/auth/profile/password/${userId}`, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      if (response.data.success) {
        alert("🎯 Password Updated Successfully Security Layers Sealed!");
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      console.error("Password Change Error:", error);
      const errorMsg = error.response?.data?.msg || error.response?.data?.message || "Current credential code is invalid.";
      alert(`❌ Verification Failed: ${errorMsg}`);
    }
  };

  const checkPasswordStrength = (password) => {
    if (!password) return { text: 'Empty', score: 0, color: '#94a3b8' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { text: 'Weak Security ⚠️', score, color: '#ef4444' };
    if (score <= 4) return { text: 'Medium Strength ⚡', score, color: '#f59e0b' };
    return { text: 'Highly Strong & Encrypted Safe Vector 🔒', score, color: '#10b981' };
  };

  const strength = checkPasswordStrength(passwordData.newPassword);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('activeDashboardTab'); // Logout par clean settings
    window.location.href = '/login';
  };

  if (loading) return <div className="loading-state-box">Synchronizing Apex Server Dataset...</div>;

  return (
    <div className="dashboard-container">
    
      <aside className="dashboard-sidebar">
        <div>
          <div className="sidebar-title">User Panel</div>
          <button
            type="button"
            onClick={() => {
              window.location.href = '/home';
            }}
            className="back-btn-dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '6px 8px',
              marginBottom: '20px',
              border: 'none',
              background: 'transparent',
              color: '#94a3b8',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <span className="back-arrow" style={{ display: 'inline-block', fontSize: '17px', transition: 'all 0.3s ease' }}>←</span>
            <span className="back-text" style={{ display: 'inline-block', transition: 'all 0.3s ease' }}>Back</span>
          </button>
          
          <nav className="sidebar-nav-group">
            {/* ⚡ FIXED: Default onClick ko handleTabChange method se convert kiya */}
            <button onClick={() => handleTabChange('profile')} className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}><FaUser /> My Profile</button>
            <button onClick={() => handleTabChange('orders')} className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}><FaHistory /> Inquiry History</button>
            <button onClick={() => handleTabChange('password')} className={`nav-btn ${activeTab === 'password' ? 'active' : ''}`}><FaKey /> Change Password</button>
          </nav>
        </div>
        <button onClick={handleLogout} className="nav-btn logout-btn"><FaSignOutAlt /> Logout Account</button>
      </aside>










{/* TAB 1: PROFILE SETTINGS */}
{activeTab === 'profile' && (
  <div
    style={{
      width: '100%',
      maxWidth: '1100px',
      margin: '0 auto',
      boxSizing: 'border-box'
    }}
  >
    {/* PAGE TITLE */}
    <div
      style={{
        marginBottom: '22px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <h1
        className="content-title"
        style={{
          fontSize: 'clamp(22px, 3vw, 28px)',
          fontWeight: '800',
          color: '#0f172a',
          margin: 0,
          lineHeight: '1.2'
        }}
      >
        Account Settings
      </h1>
      <p
        style={{
          margin: '7px 0 0',
          color: '#64748b',
          fontSize: '14px',
          lineHeight: '1.5'
        }}
      >
        Manage your registered account information and profile details.
      </p>
    </div>

    {/* MAIN SETTINGS CARD */}
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: 'clamp(18px, 4vw, 32px)',
        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* PROFILE HEADER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: '22px',
          marginBottom: '26px',
          width: '100%',
          boxSizing: 'border-box',
          flexWrap: 'wrap'
        }}
      >
        {/* AVATAR */}
        {/* ⚡ FIXED: Agar Master Admin login ho ya localStorage mein userPic set ho, to avatar crash ya remove na ho background par */}
        {localStorage.getItem('userPic') && localStorage.getItem('userPic') !== 'https://unsplash.com' ? (
          <img 
            src={localStorage.getItem('userPic')} 
            alt="Profile View" 
            style={{ width: '62px', height: '62px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, boxShadow: '0 6px 18px rgba(0,0,0,0.1)' }}
          />
        ) : (
          <div
            style={{
              width: '62px',
              height: '62px',
              minWidth: '62px',
              background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: '800',
              borderRadius: '50%',
              boxShadow: '0 6px 18px rgba(225, 29, 72, 0.25)',
              flexShrink: 0
            }}
          >
            {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
          </div>
        )}

        {/* PROFILE INFO */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            flex: 1
          }}
        >
          <h3
            style={{
              margin: 0,
              color: '#0f172a',
              fontSize: '18px',
              fontWeight: '750',
              lineHeight: '1.3',
              wordBreak: 'break-word'
            }}
          >
            {userData.name || 'Surgical Portal Account'}
          </h3>
          <p
            style={{
              margin: '5px 0 0',
              fontSize: '13px',
              color: '#64748b',
              lineHeight: '1.5'
            }}
          >
            Rana Apex Registered Account Portal
          </p>
        </div>


















          {/* ACTIVE BADGE */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ecfdf5',
              color: '#15803d',
              border: '1px solid #bbf7d0',
              borderRadius: '999px',
              padding: '6px 11px',
              fontSize: '12px',
              fontWeight: '700',
              flexShrink: 0
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#22c55e',
                display: 'inline-block'
              }}
            />
            Active
          </div>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleProfileUpdate}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            width: '100%',
            margin: 0,
            boxSizing: 'border-box'
          }}
        >

          {/* RESPONSIVE INPUT GRID */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: '20px',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >

            {/* FULL NAME */}
            <div
              style={{
                width: '100%',
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxSizing: 'border-box'
              }}
            >
              <label
                style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#475569',
                  margin: 0
                }}
              >
                Full Name / Title
              </label>

              <input
                type="text"
                value={userData.name}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    name: e.target.value
                  })
                }
                required
                placeholder="Enter your full name"
                style={{
                  width: '100%',
                  height: '48px',
                  minHeight: '48px',
                  padding: '0 15px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: '#334155',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                  display: 'block',
                  transition: 'all 0.2s ease'
                }}
              />
            </div>

            {/* EMAIL */}
            <div
              style={{
                width: '100%',
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxSizing: 'border-box'
              }}
            >
              <label
                style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#475569',
                  margin: 0
                }}
              >
                Secure Email Handle
              </label>

              <input
                type="email"
                value={userData.email}
                disabled
                style={{
                  width: '100%',
                  height: '48px',
                  minHeight: '48px',
                  padding: '0 15px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: '#94a3b8',
                  backgroundColor: '#f8fafc',
                  cursor: 'not-allowed',
                  boxSizing: 'border-box',
                  display: 'block'
                }}
              />

              <span
                style={{
                  fontSize: '11px',
                  color: '#94a3b8'
                }}
              >
                🔒 Email address cannot be changed
              </span>
            </div>

            {/* MOBILE */}
            <div
              style={{
                width: '100%',
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxSizing: 'border-box'
              }}
            >
              <label
                style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#475569',
                  margin: 0
                }}
              >
                Contact Mobile Connection
              </label>

              <input
                type="text"
                value={userData.pmdcLicense}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    pmdcLicense: e.target.value
                  })
                }
                required
                placeholder="Enter contact number"
                style={{
                  width: '100%',
                  height: '48px',
                  minHeight: '48px',
                  padding: '0 15px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: '#334155',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                  display: 'block',
                  transition: 'all 0.2s ease'
                }}
              />
        </div>
            
          
{/* HOSPITAL */}
            <div
              style={{
                width: '100%',
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxSizing: 'border-box'
              }}
            >
              <label
                style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#475569',
                  margin: 0
                }}
              >
                Hospital Clinic Location
              </label>

              <input
                type="text"
                value={userData.hospitalName}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    hospitalName: e.target.value
                  })
                }
                required
                placeholder="Enter hospital / clinic"
                style={{
                  width: '100%',
                  height: '48px',
                  minHeight: '48px',
                  padding: '0 15px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: '#334155',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                  display: 'block'
                }}
              />
            </div>

          </div>

          {/* SAVE BUTTON AREA */}
          <div
            style={{
              width: '100%',
              marginTop: '4px',
              paddingTop: '20px',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'flex-start',
              boxSizing: 'border-box'
            }}
          >

            <button
              type="submit"
              style={{
                background:
                  'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                color: '#ffffff',
                padding: '0 28px',
                height: '48px',
                minHeight: '48px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                boxShadow:
                  '0 6px 16px rgba(225,29,72,0.20)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease'
              }}
            >
              💾 Save Profile Changes
            </button>

          </div>

        </form>

      </div>

    </div>
  )}











       {/* TAB 2: RESPONSIVE INQUIRY HISTORY */}
{activeTab === 'orders' && (
  <div
    style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      boxSizing: 'border-box'
    }}
  >
    {/* HEADER */}
    <div
      style={{
        marginBottom: '22px'
      }}
    >
      <h1
        className="content-title"
        style={{
          margin: 0,
          fontSize: 'clamp(21px, 3vw, 28px)',
          fontWeight: '800',
          color: '#0f172a',
          lineHeight: '1.25'
        }}
      >
        Transmitted RFQ Instruments Inquiries
      </h1>
      <p
        style={{
          margin: '7px 0 0',
          color: '#64748b',
          fontSize: '13px'
        }}
      >
        Track all transmitted instrument inquiries and their current status.
      </p>
    </div>
    {/* MAIN CARD */}
    <div
      style={{
        width: '100%',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 25px rgba(15,23,42,0.05)',
        boxSizing: 'border-box'
      }}
    >
      {orders.length === 0 ? (
        /* EMPTY */
        <div
          style={{
            padding: '55px 20px',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '58px',
              height: '58px',
              margin: '0 auto 14px',
              borderRadius: '50%',
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '25px'
            }}
          >
            📋
          </div>

          <p
            style={{
              margin: 0,
              color: '#64748b',
              fontSize: '14px'
            }}
          >
            No current instrument lists transmitted inside query logs tracker bucket.
          </p>
        </div>

      ) : (
        <>
        {/* ================= DESKTOP TABLE ================= */}
          <div
            style={{
              width: '100%',
              overflowX: 'auto',
              boxSizing: 'border-box'
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}
            >
              <thead
                style={{
                  background:
                    'linear-gradient(135deg,#0f172a,#1e293b)'
                }}
              >
                <tr>
                 {[
  'Instrument Image', // 👈 Naya Column Picture ke liye
  'Company Details',
  'Inquiry Tracking ID',
  'Submission Date',
  'Status',
  'Items Count',
  'Actions' // 👈 Naya Column Delete button ke liye
].map((heading, i) => (

                    <th
                      key={heading}
                      style={{
                        padding: '17px 20px',
                        color: i === 4 ? '#fb7185' : '#38bdf8',
                        fontSize: '11px',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        textAlign: i === 4 ? 'right' : 'left',
                        whiteSpace: 'nowrap',
                        borderBottom: '2px solid #0284c7'
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
</thead>
<tbody>
  {orders.map((order, index) => {
    const isQuoteReady = order.products && order.products.some(item => Number(item.price) > 0);

    const totalInvoiceBill = order.products && isQuoteReady
      ? order.products.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || item.qty || 1)), 0)
      : 0;

    return (
      <tr
        key={index}
        style={{
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc'
        }}
      >
        {/* 🖼️ CATALOG INSTRUMENT SPECIFICATION PANEL */}
        <td
          style={{
            padding: '18px 20px',
            verticalAlign: 'middle',
            minWidth: '290px'
          }}
        >
          {order.products && order.products.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {order.products.map((prod, pIdx) => (
                <div key={pIdx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {prod.image || prod.imageUrl ? (
                    <img 
                      src={prod.image || prod.imageUrl} 
                      alt={prod.name} 
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        borderRadius: '6px', 
                        objectFit: 'cover', 
                        border: '1px solid #cbd5e1', 
                        background: '#f8fafc',
                        flexShrink: 0
                      }} 
                    />
                  ) : (
                    <div style={{ width: '60px', height: '60px', borderRadius: '6px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', border: '1px solid #e2e8f0', flexShrink: 0 }}>📦</div>
                  )}
                  <div style={{ textAlign: 'left', minWidth: 0 }}>
                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '13px', wordBreak: 'break-word' }}>{prod.name || 'Surgical Instrument'}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Catalog SKU: {prod.sku || 'RA-9921'}</div>
                    
                    <div style={{ marginTop: '3px' }}>
                      {Number(prod.price) > 0 ? (
                        <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: '800' }}>
                          ${prod.price} <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'normal' }}>x{prod.quantity || prod.qty || 1} Pcs</span>
                        </span>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#d97706', background: '#fef3c7', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                          ⏳ Price Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '6px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', border: '1px solid #e2e8f0' }}>📦</div>
              <div style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>Standard Spec Configuration</div>
            </div>
          )}
        </td>

        {/* B2B COMPANY LOGISTICS & ADMIN RESPONSE LOG */}
        <td
          style={{
            padding: '18px 20px',
            verticalAlign: 'top',
            minWidth: '250px'
          }}
        >
          <div style={{ fontWeight: '750', color: '#0f172a', fontSize: '14px' }}>
            {order.company || 'International Buyer Portal'}
          </div>
          <div style={{ marginTop: '4px', color: '#64748b', fontSize: '12px', wordBreak: 'break-word', lineHeight: '1.4' }}>
            <span style={{ fontWeight: 'bold', color: '#475569' }}>Client Specifications:</span> {order.message || 'No specific modifications requested'}
          </div>

          <div 
            style={{ 
              marginTop: '10px', 
              padding: '8px 12px', 
              borderRadius: '6px', 
              background: order.adminReply ? '#f0fdf4' : '#fff7ed', 
              border: order.adminReply ? '1px solid #bbf7d0' : '1px solid #ffedd5',
              textAlign: 'left'
            }}
          >
            <div style={{ fontSize: '10px', fontWeight: '800', color: order.adminReply ? '#166534' : '#c2410c', textTransform: 'uppercase' }}>
              {order.adminReply ? '🏛️ Apex Commercial Response:' : '🔬 Engineering Audit Status:'}
            </div>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: order.adminReply ? '#14532d' : '#9a3412', lineHeight: '1.4' }}>
              {order.adminReply || 'Sialkot export desk is evaluating technical parameters and material grade availability.'}
            </p>
          </div>
        </td>

        {/* TRACKING ID */}
        <td
          style={{
            padding: '18px 20px',
            fontFamily: 'monospace',
            color: '#64748b',
            fontSize: '12px',
            verticalAlign: 'middle'
          }}
        >
          {order._id}
        </td>

        {/* SUBMISSION DATE */}
        <td
          style={{
            padding: '18px 20px',
            color: '#475569',
            fontSize: '13px',
            whiteSpace: 'nowrap',
            verticalAlign: 'middle'
          }}
        >
          {new Date(order.createdAt).toLocaleDateString('en-GB')}
        </td>

        {/* EXPORT QUOTE WORKFLOW STATUS */}
        <td
          style={{
            padding: '18px 20px',
            verticalAlign: 'middle'
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '999px',
              background: isQuoteReady ? '#d1fae5' : '#eff6ff',
              color: isQuoteReady ? '#065f46' : '#1e40af',
              border: isQuoteReady ? '1px solid #a7f3d0' : '1px solid #bfdbfe',
              fontSize: '11px',
              fontWeight: '800',
              whiteSpace: 'nowrap'
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: isQuoteReady ? '#10b981' : '#3b82f6'
              }}
            />
            {isQuoteReady ? 'Proforma Invoice Ready' : 'RFQ Transmitted'}
          </span>
        </td>

        {/* TOTAL INTERNATIONAL BILL AMOUNT */}
        <td
          style={{
            padding: '18px 20px',
            textAlign: 'right',
            verticalAlign: 'middle',
            minWidth: '150px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>
              {order.products ? order.products.length : 1} Line Items
            </span>
            
            {totalInvoiceBill > 0 ? (
              <span
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  background: '#16a34a',
                  fontSize: '13px',
                  fontWeight: '800',
                  color: '#ffffff',
                  whiteSpace: 'nowrap'
                }}
              >
                Total FOB: ${totalInvoiceBill}
              </span>
            ) : (
              <span
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#64748b',
                  whiteSpace: 'nowrap'
                }}
              >
                📝 Price On Request
              </span>
            )}
          </div>
        </td>

        {/* REGISTRY EXECUTIONS */}
        <td
          style={{
            padding: '18px 20px',
            textAlign: 'center',
            verticalAlign: 'middle'
          }}
        >
         <button
            type="button"
            onClick={async () => {
              if (window.confirm("Are you sure you want to cancel this international surgical instrument inquiry?")) {
                try {
                  const res = await axios.delete(`${BACKEND_API_URL || 'https://vercel.app'}/auth/inquiry/delete/${order._id}`);
                  if (res.data.success) {
                    alert("🎯 Success: Inquiry entry removed!");
                    setOrders(orders.filter(item => item._id !== order._id));
                  }
                } catch (err) {
                  alert("❌ Error: Operation failed.");
                }

              }
            }}
            style={{
              background: 'rgba(239, 68, 68, 0.08)',
              color: '#ef4444',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Cancel RFQ
          </button>
        </td>
      </tr>
    );
  })}
</tbody>


            </table>
          </div>


          {/* ================= MOBILE CARDS ================= */}

          <div
            style={{
              display: 'none'
            }}
          >
            {orders.map((order, index) => (
              <div
                key={index}
                style={{
                  margin: '12px',
                  padding: '18px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  background: '#ffffff',
                  boxShadow: '0 5px 15px rgba(15,23,42,0.05)'
                }}
              >

                {/* COMPANY */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '10px',
                    marginBottom: '16px'
                  }}
                >
                  <div
                    style={{
                      minWidth: 0
                    }}
                  >
                    <div
                      style={{
                        color: '#0f172a',
                        fontWeight: '800',
                        fontSize: '15px',
                        wordBreak: 'break-word'
                      }}
                    >
                      {order.company || 'Retail Client Asset'}
                    </div>

                    <div
                      style={{
                        marginTop: '5px',
                        color: '#64748b',
                        fontSize: '12px',
                        lineHeight: '1.5',
                        wordBreak: 'break-word'
                      }}
                    >
                      {order.message || 'No manual notes context added'}
                    </div>
                  </div>

                  {/* STATUS */}
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 9px',
                      borderRadius: '999px',
                      background: '#ecfdf5',
                      color: '#15803d',
                      border: '1px solid #bbf7d0',
                      fontSize: '10px',
                      fontWeight: '800',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    🟢 Active
                  </span>
                </div>


                {/* DETAILS */}
                <div
                  style={{
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '11px'
                  }}
                >

                  {/* ID */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '15px'
                    }}
                  >
                    <span
                      style={{
                        color: '#94a3b8',
                        fontSize: '12px'
                      }}
                    >
                      Tracking ID
                    </span>

                    <span
                      style={{
                        color: '#475569',
                        fontFamily: 'monospace',
                        fontSize: '11px',
                        textAlign: 'right',
                        wordBreak: 'break-all'
                      }}
                    >
                      {order._id}
                    </span>
                  </div>


                  {/* DATE */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span
                      style={{
                        color: '#94a3b8',
                        fontSize: '12px'
                      }}
                    >
                      Submission Date
                    </span>

                    <span
                      style={{
                        color: '#475569',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      {new Date(order.createdAt).toLocaleDateString('en-GB')}
                    </span>
                  </div>






















                {/* ITEMS */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span
                      style={{
                        color: '#94a3b8',
                        fontSize: '12px'
                      }}
                    >
                      Items Count
                    </span>

                    <span
                      style={{
                        padding: '5px 9px',
                        borderRadius: '7px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#334155',
                        fontSize: '11px',
                        fontWeight: '700'
                      }}
                    >
                      📦 {order.products ? order.products.length : 1} Tools
                    </span>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </>

      )}

    </div>
  </div>
)}
        {activeTab === 'password' && (
          <div>
            <h1 className="content-title">Security & Credentials</h1>
            <div className="dashboard-card" style={{ maxWidth: '500px', width: '100%' }}>
              <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                  <label>Current Security Password</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input type={showOldPassword ? "text" : "password"} value={passwordData.oldPassword} onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})} className="form-input" style={{ width: '100%', height: '44px', paddingRight: '40px' }} required />
                    <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} style={{ position: 'absolute', right: '12px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>{showOldPassword ? <FaEyeSlash /> : <FaEye />}</button>
                  </div>
                </div>
                <div className="form-group">
                  <label>New Secret Password Code</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input type={showNewPassword ? "text" : "password"} value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} className="form-input" style={{ width: '100%', height: '44px', paddingRight: '40px' }} required />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} style={{ position: 'absolute', right: '12px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>{showNewPassword ? <FaEyeSlash /> : <FaEye />}</button>
                  </div>
                  {passwordData.newPassword && (
                    <div style={{ marginTop: '6px', fontSize: '11px', fontWeight: 'bold', color: strength.color }}>{strength.text}</div>
                  )}
                </div>
                <div className="form-group">
                  <label>Confirm New Password Sequence</label>
                  <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="form-input" style={{ width: '100%', height: '44px' }} required />
                </div>
                <button type="submit" className="btn-primary" style={{ height: '44px', marginTop: '10px' }}>Update Security Password</button>
              </form>
            </div>
          </div>
        )}

      
    </div>
  );
}

