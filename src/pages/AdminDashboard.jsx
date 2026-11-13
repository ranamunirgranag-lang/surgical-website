import React, { useEffect, useState } from 'react';
import axios from 'axios'; // 👈 Direct axios for seamless environmental routing handles

// Custom styles naye panel ke liye
const productStyles = {
  formGroup: { marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '5px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#f8fafc' },
  textarea: { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', height: '80px', background: '#f8fafc' },
  btnPrimary: { padding: '10px 20px', background: '#e11d48', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' },
  productCard: { border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px', background: '#fff' },
  priceRow: { display: 'flex', gap: '10px', marginTop: '15px', alignItems: 'center' },
  priceInput: { width: '100px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' },
  btnSuccess: { padding: '6px 12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }
};

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('inquiries'); 
  const [users, setUsers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Form input states for creating new items
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: '', category: '' });
  // Individual product price tracks
  const [editPrices, setEditPrices] = useState({});

  // Live Dynamic URL Config Configuration
  const BACKEND_API_URL = import.meta.env.VITE_API_URL || 'https://vercel.app
/api';

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const usersRes = await axios.get(`${BACKEND_API_URL}/auth/admin/users/list`);
      const inqRes = await axios.get(`${BACKEND_API_URL}/auth/admin/inquiries/list`);
      
      if (usersRes.data.success) setUsers(usersRes.data.users || []);
      if (inqRes.data.success) setInquiries(inqRes.data.inquiries || []);
      
      try {
        const prodRes = await axios.get(`${BACKEND_API_URL}/products/all`);
        setProducts(prodRes.data || []);
        
        const initialPrices = {};
        if (prodRes.data && Array.isArray(prodRes.data)) {
          prodRes.data.forEach(p => { initialPrices[p._id] = p.price; });
        }
        setEditPrices(initialPrices);
      } catch (err) {
        console.error("Error loading products:", err);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Dashboard error:", error);
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboardData(); }, []);

  const handlePurgeUser = async (id, userName) => {
    if (window.confirm(`Are you sure you want to permanently remove ${userName}?`)) {
      try {
        await axios.delete(`${BACKEND_API_URL}/auth/admin/user/delete/${id}`);
        loadDashboardData();
      } catch (err) { console.error(err); }
    }
  };
   const handleSendReply = async (id, finalProductsList) => {
    if (!replyText.trim()) { alert("Type response text first!"); return; }
    try {
      // 🎯 FIXED LAUNCHER: URL endpoint ko perfect /auth/admin/inquiry/reply/:id par set kiya aur state structure match karwa di
      const res = await axios.put(`${BACKEND_API_URL}/auth/admin/inquiry/reply/${id}`, { 
        adminReply: replyText,
        products: finalProductsList 
      });
      
      if (res.data.success) {
        alert("🎯 Quote packages synchronized successfully!");
        setReplyText('');
        setActiveReplyId(null);
        loadDashboardData(); // Is se database se bilkul fresh data load hoga aur screen par text tikka rahega
      }
    } catch (err) {
      console.error(err);
      alert("❌ Pipeline failure: Couldn't register pricing values.");
      setActiveReplyId(null);
    }
  };


  const handleAddProduct = async (e) => {
    e.preventDefault();
   if (!newProduct.name || !newProduct.image) {
  alert("Please fill name and image fields!");
  return;
}

    try {
      const res = await axios.post(`${BACKEND_API_URL}/products/add`, newProduct);

      if (res.data.success) {
        alert("📦 Product Added Successfully!");
        setNewProduct({ name: '', description: '', price: '', image: '', category: '' });
        loadDashboardData(); 
      }
    } catch (err) {
      console.error("Add Product Deep Error Intercepted:", err);
      const serverMessage = err.response?.data?.message || err.message;
      alert(`❌ Database Rejected Operation: ${serverMessage}`);
    }
  };

  const handleUpdatePrice = async (id) => {
    const updatedPrice = editPrices[id];
    if (!updatedPrice || isNaN(updatedPrice)) {
      alert("Please enter a valid numeric price!");
      return;
    }
    try {
      const res = await axios.put(`${BACKEND_API_URL}/products/update/${id}`, { price: Number(updatedPrice) });

      if (res.data.success) {
        alert("💰 Price Updated Successfully!");
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update price");
    }
  };

  const parseMessageAndProducts = (messageText) => {
    if (!messageText) return { cleanMsg: '', products: [] };
    if (messageText.includes('||JSON_DATA||')) {
      try {
        const parts = messageText.split('||JSON_DATA||');
        const jsonData = JSON.parse(parts[1]);
        const cleanMsg = parts[2] || '';
        return { cleanMsg, products: jsonData };
      } catch (e) {
        return { cleanMsg: messageText, products: [] };
      }
    }
    return { cleanMsg: messageText, products: [] };
  };

  return (
    <div className="dashboard-container">
      
      <div className="dashboard-sidebar">
        <div className="sidebar-brand-wrapper">
          <button
            type="button"
            onClick={() => { window.location.href = '/home'; }}
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
            <span className="back-arrow" style={{ display: 'inline-block', fontSize: '17px', color: '#94a3b8' }}>←</span>
            <span className="back-text" style={{ display: 'inline-block', color: '#94a3b8' }}>Back</span>
          </button>
          <h3 className="sidebar-title">⚙️ APEX COMMAND</h3>
        </div>
        <div className="sidebar-nav-group">
          <button 
            onClick={() => setActiveTab('users')} 
            className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
          >
            👥 Registered Users
          </button>
          <button 
            onClick={() => setActiveTab('inquiries')} 
            className={`nav-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
          >
            📬 Client Inquiries
          </button>
          <button 
            onClick={() => setActiveTab('products')} 
            className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`}
          >
            📦 Manage Products
          </button>
        </div>
      </div>


     <div className="dashboard-content">
        <h2 className="content-title">
          {activeTab === 'users' && '👥 Registered Customers Profile'}
          {activeTab === 'inquiries' && '📬 Incoming RFQ Quote Requests'}
          {activeTab === 'products' && '📦 Inventory & Surgical Product Manager'}
        </h2>
        <p className="content-subtitle">
          Real-time record stream tracking customer bulk orders, dynamic instruments thumbnails, and data specifications.
        </p>

        {loading ? (
          <div className="loading-state-box">Streaming database data matrix...</div>
        ) : (
          <div className="dashboard-data-wrapper">
            {activeTab === 'users' && (
              <div className="users-grid">
                {users && users.map((doc) => (
                  <div key={doc._id} className="user-card">
                    <div className="user-name">{doc.name}</div>
                    <div className="user-email">📧 {doc.email}</div>
                    <div className="user-license">🆔 License: {doc.pmdcLicense || 'N/A'}</div>
                    <div className="user-hospital">🏢 {doc.hospitalName || 'Retail Customer'}</div>
                    <div className="user-card-footer">
                      <span className="status-badge">🟢 Active Client</span>
                      <button onClick={() => handlePurgeUser(doc._id, doc.name)} className="btn-remove">🗑️ Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'inquiries' && (
              <div className="inquiries-wrapper">
                {inquiries && inquiries.map((inq) => {
                  const parsedData = parseMessageAndProducts(inq.message);
                  const cleanMsg = parsedData.cleanMsg;
                  const finalProductsList = (inq.products && inq.products.length > 0) ? inq.products : parsedData.products;

                  return (
                    <div key={inq._id} className="inquiry-card" style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: '12px', background: '#fff', marginBottom: '20px' }}>
                      <div className="inquiry-meta-row">
                        <span className="clean-meta-badge user-badge">👤 {inq.name || 'Client'}</span>
                        <span className="clean-meta-badge text-badge">✉️ {inq.email}</span>
                        <span className="clean-meta-badge text-badge">📞 {inq.phone || 'N/A'}</span>
                        <span className="clean-meta-badge text-badge">📍 {inq.city && inq.city !== 'no hospital' ? inq.city : 'Sialkot Hub'}</span>
                        <span className="clean-meta-badge text-badge">🏢 {inq.company || 'Retail Buyer'}</span>
                      </div>

                      <div className="inquiry-message-box" style={{ marginTop: '12px', padding: '10px', background: '#f8fafc', borderRadius: '6px', fontSize: '13px', fontStyle: 'italic' }}>
                        "{cleanMsg || inq.message || 'Surgical Quote Query Request Log.'}"
                      </div>

                      {finalProductsList && finalProductsList.length > 0 && (
                        <div className="products-section" style={{ marginTop: '15px' }}>
                          <div className="products-section-title" style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '14px', color: '#0f172a' }}>
                            📦 Transmitted Selected Instruments ({finalProductsList.length}):
                          </div>
                          <div className="products-grid" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {finalProductsList.map((p, idx) => {
                              const rawImg = p.image || p.imageUrl || p.img;
                              let finalImgSrc = rawImg ? (rawImg.startsWith('http') ? rawImg : `http://localhost:5173${rawImg.startsWith('/') ? rawImg : '/' + rawImg}`) : "";
                              return (
                                <div key={idx} className="product-item-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', border: '1px solid #f1f5f9', borderRadius: '8px', background: '#f8fafc' }}>
                                  <div className="product-item-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className="product-image-box">
                                      {finalImgSrc ? (
                                        <img src={finalImgSrc} alt={p.name || "Instrument"} style={{ width: '55px', height: '55px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #cbd5e1' }} onError={(e) => { e.target.style.display = 'none'; }} />
                                      ) : (
                                        <div style={{ width: '55px', height: '55px', borderRadius: '6px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📦</div>
                                      )}
                                    </div>
                                    <div className="product-item-text" style={{ textAlign: 'left' }}>
                                      <h5 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{p.name || p.title || 'Surgical Tool Spec'}</h5>
                                      <span style={{ fontSize: '11px', color: '#64748b' }}>SKU: {p.sku || 'N/A'}</span>
                                    </div>
                                  </div>
                                  
                                  {/* 💰 ADMIN PRICING & QUOTATION INPUT CONTROLS */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#475569' }}>Price ($):</span>
                                      <input 
                                        type="number" 
                                        placeholder="0"
                                        value={p.price || ''} 
                                        onChange={(e) => {
                                          p.price = Number(e.target.value);
                                          setInquiries([...inquiries]);
                                        }}
                                        style={{ width: '70px', height: '32px', padding: '0 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                                      />
                                    </div>
                                    <span className="product-qty-badge" style={{ fontWeight: '700', fontSize: '13px', color: '#334155', background: '#e2e8f0', padding: '4px 8px', borderRadius: '6px' }}>Qty: {p.quantity || 1}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                                       {/* 🏛️ ADMIN REPLY INJECTION AND ACTION BLOCK */}
                      <div style={{ marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                        
                        {/* 📋 AGAR PEHLE SE REPLY BHEJA HUA HAI TOU YAHAN SHOW HO GA */}
                        {inq.adminReply && (
                          <div style={{ padding: '8px 12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', marginBottom: '5px' }}>
                            <strong style={{ fontSize: '11px', color: '#1e40af', display: 'block', textTransform: 'uppercase' }}>🏛️ Currently Transmitted Quote:</strong>
                            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#1e3a8a' }}>{inq.adminReply}</p>
                          </div>
                        )}

                        <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                          {inq.adminReply ? "🔄 Update Official Response / Notes" : "Official Admin Response / Custom Quotation Notes"}
                        </label>
                        
                        <textarea 
                          placeholder="Type proforma specifications, lead time, or shipping terms..."
                          value={replyText} 
                          onChange={(e) => setReplyText(e.target.value)} 
                          style={{ width: '100%', height: '70px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', resize: 'none', boxSizing: 'border-box' }}
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            handleSendReply(inq._id, finalProductsList);
                          }}
                          style={{ alignSelf: 'flex-start', padding: '8px 16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                        >
                          🚀 Transmit Commercial Quote
                        </button>
                      </div>


                    </div>
                  );
                })}
              </div>

            )}
      {activeTab === 'products' && (
              <div className="products-manager-wrapper" style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', width: '100%' }}>
                
                {/* 1. Add Product HTML Form View */}
                <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '30px' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#1e293b' }}>➕ Add New Surgical Product</h3>
                  <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={productStyles.formGroup}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Product Name *</label>
                      <input type="text" style={productStyles.input} placeholder="e.g. Operating Scissors Straight" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} />
                    </div>
                    <div style={productStyles.formGroup}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Description *</label>
                      <textarea style={productStyles.textarea} placeholder="Write details about size, material..." value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} />
                    </div>
                    
                    <div style={productStyles.formGroup}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Category</label>
                      <input type="text" style={productStyles.input} placeholder="e.g. Scissors" value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} />
                    </div>

                    {/* 💻 UPLOAD SYSTEM: Converts Laptop Images into Base64 format automatically */}
                    <div style={productStyles.formGroup}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Upload Product Image From Laptop *</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        style={productStyles.input} 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewProduct({ ...newProduct, image: reader.result });
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                      />
                      {newProduct.image && (
                        <img 
                          src={newProduct.image} 
                          alt="Preview" 
                          style={{ width: '70px', height: '70px', objectFit: 'contain', marginTop: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }} 
                        />
                      )}
                    </div>

                    <button type="submit" style={productStyles.btnPrimary}>Save Product to Cloud Database</button>
                  </form>
                </div>

                {/* 2. Live Interactive Product Database Matrix Catalog */}
                <div>
                  <h3 style={{ color: '#1e293b', marginBottom: '5px' }}>📋 Current Product Catalog ({products.length})</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', marginTop: 0 }}>Manage your active B2B surgical instruments below.</p>
                  
                  <div style={productStyles.productGrid}>
                    {products.length === 0 ? (
                      <div style={{ color: '#64748b' }}>No products found in database inventory.</div>
                    ) : (
                      products.map((prod) => (
                        <div key={prod._id} style={productStyles.productCard}>
                          <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '150px', objectFit: 'contain', borderRadius: '6px', background: '#f8fafc', marginBottom: '10px' }} onError={(e) => { e.target.src = 'https://placehold.co'; }} />
                          <h4 style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#0f172a' }}>{prod.name}</h4>
                          <span style={{ fontSize: '11px', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{prod.category || 'General'}</span>
                          
                          {/* 🗑️ FIXED CATALOG WIPE BUTTON INTEGRATION */}
                          <div style={{ marginTop: '15px' }}>
                            <button 
                              type="button"
                              onClick={async () => {
                                if (window.confirm(`Are you sure you want to permanently delete ${prod.name} from the catalog?`)) {
                                  try {
                                    const BACKEND_API_URL = import.meta.env.VITE_API_URL || 'https://vercel.app
/api';
                                    
                                    const res = await axios.delete(`${BACKEND_API_URL}/auth/delete/${prod._id}`);
                                    
                                    if (res.data.success) {
                                      alert("🎯 Success: Product purged from inventory registry!");
                                      loadDashboardData();
                                    }
                                  } catch (err) {
                                    alert("❌ Operational Error: Delete sequence rejected.");
                                  }
                                }
                              }}
                              style={{ width: '100%', padding: '8px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
                            >
                              🗑️ Delete Product
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
