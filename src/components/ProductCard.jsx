import { useState } from 'react';
import { PRICE_PER_ITEM } from '../constants';

export default function ProductCard({ item, qty, cartQty, onQtyChange, onAddToCart, subtotal }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddToCart = () => {
    if (qty > 10) {
      setErrorMessage('Maximum quantity is 10');
      setSuccessMessage('');
      return;
    }
    // Add/update item in cart via parent callback (allow 0 to remove from cart)
    if (onAddToCart) {
      onAddToCart(item.id);
    }
    setErrorMessage('');
    const isUpdate = (cartQty || 0) > 0;
    if (qty === 0) {
      setSuccessMessage('Removed from cart');
    } else {
      setSuccessMessage(isUpdate 
        ? `Updated to ${qty} ${qty === 1 ? 'item' : 'items'} in cart`
        : `Added ${qty} ${qty === 1 ? 'item' : 'items'} to cart`);
    }
    setTimeout(() => setSuccessMessage(''), 2000);
    
    // Scroll to order summary after a short delay to ensure it's rendered (only if qty > 0)
    if (qty > 0) {
      setTimeout(() => {
        const orderSummary = document.getElementById('order-summary');
        if (orderSummary) {
          orderSummary.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <div className="card">
      <img src={item.image} alt={item.name} />
      <div className="card-header">
        <h3>{item.name}</h3>
      </div>
      <p className="price">${PRICE_PER_ITEM} each</p>
      <span className="qty-label">Quantity</span>
      <div className="qty">
        <button type="button" onClick={() => { onQtyChange(item.id, -1); setErrorMessage(''); setSuccessMessage(''); }} disabled={qty <= 0}>−</button>
        <input
          type="number"
          id={item.id}
          value={qty}
          min={0}
          max={10}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!Number.isNaN(v) && v >= 0 && v <= 10) {
              onQtyChange(item.id, v - qty);
              setErrorMessage('');
              setSuccessMessage('');
            }
          }}
        />
        <button type="button" onClick={() => { onQtyChange(item.id, 1); setErrorMessage(''); setSuccessMessage(''); }} disabled={qty >= 10}>+</button>
      </div>
      <p className="qty-max-note">Max 10 quantity</p>
      {errorMessage && <p className="qty-error">{errorMessage}</p>}
      {successMessage && <p className="qty-success">{successMessage}</p>}
      <button type="button" className="add-to-cart-btn" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}
