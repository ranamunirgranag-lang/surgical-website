import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('inquiries'); 
  const [users, setUsers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const usersRes = await axios.get('http://localhost:5000/api/auth/admin/users/list');
      const inqRes = await axios.get('http://localhost:5000/api/auth/admin/inquiries/list');
      
      if (usersRes.data.success) setUsers(usersRes.data.users || []);
      if (inqRes.data.success) setInquiries(inqRes.data.inquiries || []);
      
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
        await axios.delete('http://localhost:5000/api/auth/admin/user/delete/' + id);
        loadDashboardData();
      } catch (err) { console.error(err); }
    }
  };

  const handleSendReply = async (id, oldMessage) => {
    if (!replyText.trim()) { alert("Type response text first!"); return; }
    try {
      await axios.put('http://localhost:5000/api/auth/admin/reply/' + id, { replyMessage: replyText, oldMessage });
      alert(`Response transmitted successfully!`);
      setReplyText('');
      setActiveReplyId(null);
      loadDashboardData();
    } catch (err) {
      setActiveReplyId(null);
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
    <div style={{ display: 'flex', minHeight: '90vh', backgroundColor: '#f8fafc', width: '100%', boxSizing: 'border-box' }}>
      
      <div style={{ width: '260px', minWidth: '260px', background: '#0f172a', color: 'white', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left', boxSizing: 'border-box' }}>
        <h3 style={{ color: '#38bdf8', fontSize: '16px', fontWeight: '800', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', margin: '0' }}>⚙️ APEX COMMAND</h3>
        <button onClick={() => setActiveTab('users')} style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: '700', cursor: 'pointer', textAlign: 'left', background: activeTab === 'users' ? '#0284c7' : 'transparent', color: activeTab === 'users' ? '#ffffff' : '#94a3b8', transition: '0.2s' }}>👥 Registered Users</button>
        <button onClick={() => setActiveTab('inquiries')} style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: '700', cursor: 'pointer', textAlign: 'left', background: activeTab === 'inquiries' ? '#0284c7' : 'transparent', color: activeTab === 'inquiries' ? '#ffffff' : '#94a3b8', transition: '0.2s' }}>📬 Client Inquiries</button>
      </div>

      <div style={{ flex: 1, padding: '40px', textAlign: 'left', overflowX: 'auto', boxSizing: 'border-box' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>
          {activeTab === 'users' ? '👥 Registered Customers Profile' : '📬 Incoming RFQ Quote Requests'}
        </h2>
        <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 30px 0' }}>
          Real-time record stream tracking customer bulk orders, dynamic instruments thumbnails, and data specifications.
        </p>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Streaming database data matrix...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 10px 25px rgba(0,0,0,0.02)', borderRadius: '12px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ backgroundColor: '#0284c7', color: 'white', fontSize: '14px' }}>
                <th style={{ padding: '16px' }}>{activeTab === 'users' ? 'User Name' : 'Client Name'}</th>
                <th style={{ padding: '16px' }}>Official Email</th>
                <th style={{ padding: '16px' }}>{activeTab === 'users' ? 'Mobile / WhatsApp' : 'Company Affiliation'}</th>
                <th style={{ padding: '16px' }}>{activeTab === 'users' ? 'Status clearance' : 'Inquiry Message & Live Selected Inventory'}</th>
                <th style={{ padding: '16px' }}>{activeTab === 'users' ? 'Action' : 'Tools Count'}</th>
                <th style={{ padding: '16px' }}>Action Portal</th>
              </tr>
            </thead>
            <tbody>
              {activeTab === 'users' ? (
                users.map((doc) => (
                  <tr key={doc._id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: 'white', fontSize: '14px' }}>
                    <td style={{ padding: '16px', fontWeight: '700', color: '#1e293b' }}>{doc.name}</td>
                    <td style={{ padding: '16px', color: '#475569' }}>{doc.email}</td>
                    <td style={{ padding: '16px', color: '#0284c7', fontWeight: '700' }}>{doc.pmdcLicense || 'N/A'}</td>
                    <td style={{ padding: '16px', color: '#10b981', fontWeight: '700' }}>Active Customer Profile</td>
                    <td style={{ padding: '16px', color: '#64748b' }}>N/A</td>
                    <td style={{ padding: '16px' }}>
                      <button onClick={() => handlePurgeUser(doc._id, doc.name)} style={{ background: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>🗑️ Remove</button>
                    </td>
                  </tr>
                ))
              ) : (
                inquiries.map((inq) => {
                  const { cleanMsg, products } = parseMessageAndProducts(inq.message);
                  return (
                    <tr key={inq._id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: 'white', fontSize: '14px' }}>
                      <td style={{ padding: '16px', fontWeight: '700', color: '#1e293b' }}>{inq.name}</td>
                      <td style={{ padding: '16px', color: '#475569' }}>{inq.email}</td>
                      <td style={{ padding: '16px', color: '#0284c7', fontWeight: '700' }}>{inq.company || 'Retail Buyer'}</td>
                      
                      <td style={{ padding: '16px', color: '#334155', maxWidth: '380px' }}>
                        <div style={{ fontWeight: '600', marginBottom: '8px', whiteSpace: 'pre-line' }}>{cleanMsg}</div>
                        
                        {products && products.length > 0 && (
                          <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '12px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '10.5px', color: '#0284c7', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🛒 Ordered Items Preview:</span>
                            {products.map((p, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <img src={p.image} alt={p.name} style={{ width: '36px', height: '32px', borderRadius: '6px', objectFit: 'cover', background: '#f8fafc' }} />
                                <div style={{ textAlign: 'left' }}>
                                  <h6 style={{ margin: '0', fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{p.name}</h6>
                                  <span style={{ fontSize: '10px', color: '#0284c7', fontWeight: '700' }}>{p.sku}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '16px', fontWeight: '800', color: '#0ea5e9' }}>{inq.itemsCount || 1} Instruments</td>
                      <td style={{ padding: '16px' }}>
                        {activeReplyId === inq._id ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <input 
                              type="text" 
                              placeholder="Type answer..." 
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                            />
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button onClick={() => handleSendReply(inq._id, inq.message)} style={{ background: '#10b981', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>Send</button>
                              <button onClick={() => setActiveReplyId(null)} style={{ background: '#64748b', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => setActiveReplyId(inq._id)} style={{ background: '#0284c7', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>
                            ✉️ Reply Quote
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

export default AdminDashboard;
