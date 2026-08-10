import React from 'react';
import { FaCartPlus, FaCheckCircle, FaHashtag } from 'react-icons/fa';
import '../styles/ProductCard.css';

const ProductCard = ({ product, addToInquiry, isAdded }) => {
  const displayPrice = (product.id * 1250 + 450);

  return (
    <div className="product-card-modern">
      <div className="prod-img-container">
        <img 
          src={product.image} 
          alt={product.name} 
          onError={(e) => { e.target.src = "surgical3.jpg" }} 
        />
        <div className="prod-sku-badge">
          <FaHashtag className="sku-hash-icon" /> {product.sku}
        </div>
        <div className="img-hover-overlay"></div>
      </div>
      
      <div className="prod-meta-content">
        <span className="prod-cat-tag">{product.category}</span>
        <h3 className="prod-title-heavy">{product.name}</h3>
        <p className="prod-desc-text">{product.description}</p>
        
        <div className="premium-price-tag">
          <span className="price-label">Wholesale Rate </span>
          <span className="price-amount">Rs. {displayPrice.toLocaleString()}</span>
        </div>

        {/* FIXED: Ab button dabne par direct item add hoga aur page change nahi hoga! */}
        <button 
          className={`btn-add-inquiry ${isAdded ? 'already-added' : ''}`}
          onClick={(e) => {
            e.stopPropagation(); // Taake event bubble na ho
            addToInquiry(product);
          }}
          disabled={isAdded}
        >
          {isAdded ? (
            <>
              <FaCheckCircle className="btn-icon-spin" /> In Bucket
            </>
          ) : (
            <>
              <FaCartPlus className="btn-icon-bounce" /> Add To Inquiry
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
