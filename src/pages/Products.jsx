import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { FaSearch, FaChevronDown, FaChevronUp, FaStethoscope } from 'react-icons/fa';
import '../styles/Products.css';

const initialProducts = [
  { id: 1, name: "Dental Extracting Forceps (Anterior)", sku: "RA-1011", category: "Dental Instruments", description: "Premium grade surgical steel forceps designed for flawless upper anterior extraction.", image: "/product0apex.jpg" },
  { id: 2, name: "Mayo Surgical Scissors Straight", sku: "RA-2045", category: "General Surgery Tools", description: "Highly durable beveled blade scissors crafted for cutting surface tissue and sutures.", image: "/product00apex.jpg" },
  { id: 3, name: "Bone Holding Forceps (Ortho)", sku: "RA-3090", category: "Orthopedic Tools", description: "Heavy duty stainless steel tool with self-retaining ratchet lock mechanism.", image: "/product3apex.jpg" },
  { id: 4, name: "Dental Explorer & Probe Combo", sku: "RA-1082", category: "Dental Instruments", description: "Double-ended diagnostic nav tool for precise enamel and cavity exploration.", image: "/product4apex.jpg" },
  { id: 5, name: "Scalpel Blade Handle No. 4", sku: "RA-2010", category: "General Surgery Tools", description: "Ergonomic textured grip handle fully compatible with standard surgical blades.", image: "/product5apex.jpg" },
  { id: 6, name: "Dental Scaling Instrument", sku: "RA-1142", category: "Dental Instruments", description: "Sickle scaler configured for premium calculus removal and root planing.", image: "/product6apex.jpg" },
  { id: 7, name: "Crile-Wood Needle Holder", sku: "RA-2510", category: "General Surgery Tools", description: "Serrated jaws with carbon inserts for secure suture needle grip.", image: "/product7apex.jpg" },
  { id: 8, name: "Orthopedic Bone Rongeur", sku: "RA-3120", category: "Orthopedic Tools", description: "Double-action heavy joints designed for scooping out bone structures cleanly.", image: "/product8apex.jpg" },
  { id: 9, name: "Mouth Gaze Mirror No. 5", sku: "RA-1200", category: "Dental Instruments", description: "Anti-fog front surface rhodium coating mirror for crystal clear oral navigation.", image: "/product9apex.jpg" },
  { id: 10, name: "Metzenbaum Dissecting Scissors", sku: "RA-2088", category: "General Surgery Tools", description: "Sleek long handle scissors designed specifically for deep delicate tissue dissection.", image: "/product10apex.jpg" }
];

const Products = ({ addToInquiry, inquiryCart, setCurrentPage }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = ["All", "Dental Instruments", "General Surgery Tools", "Orthopedic Tools"];

  const filteredProducts = initialProducts.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="products-page-container">
      {/* Premium Glassmorphic Hero Banner */}
      <div className="products-hero-banner">
        <div className="hero-floating-icon"><FaStethoscope /></div>
        <h2>Surgical Instruments Catalog</h2>
        <p>Explore Rana Apex Surgical’s premium medical inventory. Open for hospitals, clinicians, and retail buyers.</p>
      </div>

      {/* Central Hub with Luxury Shadows & Focus Animation */}
      <div className="search-filter-central-hub">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon-inside" />
          <input 
            type="text" 
            placeholder="Search catalog by instrument name or code (e.g. RA-1011)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="central-dropdown-wrapper">
          <button className="dropdown-toggle-trigger-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <span>Category: <strong>{selectedCategory}</strong></span>
            {isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {isDropdownOpen && (
            <ul className="dropdown-slide-menu-list">
              {categories.map((cat, index) => (
                <li 
                  key={index}
                  className={selectedCategory === cat ? 'active-dropdown-item' : ''}
                  onClick={() => { setSelectedCategory(cat); setIsDropdownOpen(false); }}
                >
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Grid view wrapper */}
      <main className="products-grid-view-fullwidth">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              addToInquiry={addToInquiry}
              isAdded={inquiryCart.some(item => item.id === product.id)}
              setCurrentPage={setCurrentPage}
            />
          ))
        ) : (
          <div className="no-products-found">
            <span className="no-prod-icon">🔍</span>
            <h3>No Instruments Found</h3>
            <p>We couldn't find anything matching your search criteria. Try checking your spelling or selection.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;