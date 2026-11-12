import React, { useState } from 'react';
import AdminDashboard from './pages/AdminDashboard';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Contact from './pages/Contact';
import LoginSignup from './pages/LoginSignup';
import { AuthProvider } from './AuthContext'; // Context Import Kiya
import UserDashboard from './pages/UserDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); 
  const [inquiryCart, setInquiryCart] = useState([]);

  const addToInquiry = (product) => {
    if (!inquiryCart.some(item => item.id === product.id)) {
      setInquiryCart([...inquiryCart, product]);
    } else {
      alert("This instrument is already in your inquiry bucket!");
    }
  };

  // Dynamic conditional pagination rendering core setup layer
  const renderPage = () => {
    switch (currentPage) {
      case 'admin':
        return <AdminDashboard />;
      case 'dashboard': 
        return <UserDashboard />; // User dashboard runtime case integration
      case 'home': 
        return <Home setCurrentPage={setCurrentPage} />;
      case 'about': 
        return <About />;
      case 'products': 
        return <Products addToInquiry={addToInquiry} inquiryCart={inquiryCart} setCurrentPage={setCurrentPage} />;
      case 'contact': 
        return <Contact inquiryCart={inquiryCart} setInquiryCart={setInquiryCart} />;
      case 'login': 
        return <LoginSignup setCurrentPage={setCurrentPage} />;
      default: 
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };
    return (
    <AuthProvider> {/* Poori App ko context provide kar dia */}
      <div className="min-h-screen bg-slate-100 flex flex-col justify-between overflow-x-hidden">
        
        {/* ✅ FIXED: Admin aur User Dashboard dono panels par main website ka navbar auto-hide kar diya hai */}
        {currentPage !== 'admin' && currentPage !== 'dashboard' && (
          <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} inquiryCount={inquiryCart.length} />
        )}
        
        <main className="flex-grow">{renderPage()}</main>
        
        {/* ✅ FIXED: Dashboard aur Admin dono panels par footer ko auto-hide kar diya hai */}
        {currentPage !== 'admin' && currentPage !== 'dashboard' && (
          <Footer setCurrentPage={setCurrentPage} />
        )}
      </div>
    </AuthProvider>
  );
}

export default App;

