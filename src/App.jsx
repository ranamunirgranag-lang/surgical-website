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

function App() {
 const [currentPage, setCurrentPage] = useState('home'); // 'home' ki jagah 'admin' likh do

  const [inquiryCart, setInquiryCart] = useState([]);

  const addToInquiry = (product) => {
    if (!inquiryCart.some(item => item.id === product.id)) {
      setInquiryCart([...inquiryCart, product]);
    } else {
      alert("This instrument is already in your inquiry bucket!");
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'admin':
  return <AdminDashboard />;

      case 'home': return <Home setCurrentPage={setCurrentPage} />;
      case 'about': return <About />;
      case 'products': return <Products addToInquiry={addToInquiry} inquiryCart={inquiryCart} setCurrentPage={setCurrentPage} />;
      case 'contact': return <Contact inquiryCart={inquiryCart} setInquiryCart={setInquiryCart} />;
      case 'login': return <LoginSignup setCurrentPage={setCurrentPage} />;
      default: return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <AuthProvider> {/* Poori App ko context provide kar dia */}
      <div className="min-h-screen bg-slate-100 flex flex-col justify-between overflow-x-hidden">
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} inquiryCount={inquiryCart.length} />
        <main className="flex-grow">{renderPage()}</main>
        <Footer /> 
      </div>
    </AuthProvider>
  );
}

export default App;
