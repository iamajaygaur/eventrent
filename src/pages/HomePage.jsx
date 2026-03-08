import { useState, useCallback } from 'react';
import emailjs from '@emailjs/browser';

import ProductCard from '../components/ProductCard';
import DateInput from '../components/DateInput';
import TimeInput from '../components/TimeInput';
import { RENTAL_ITEMS, PRICE_PER_ITEM, EMAILJS, STORAGE_KEYS, generateOrderId, formatDateMMDDYYYY } from '../constants';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const initialQuantities = Object.fromEntries(RENTAL_ITEMS.map((i) => [i.id, 0]));

export default function HomePage() {
  const [quantities, setQuantities] = useState(initialQuantities);
  const [cartItems, setCartItems] = useState(initialQuantities); // Items actually added to cart
  const [submitStatus, setSubmitStatus] = useState({ message: '', error: false });
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    full_name: '',
    department: '',
    speedtype_id: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  const changeQty = useCallback((id, delta) => {
    setQuantities((prev) => {
      const next = { ...prev };
      const v = (next[id] || 0) + delta;
      const newQty = Math.min(10, Math.max(0, v));
      next[id] = newQty;
      
      // If item is already in cart, automatically update cart when quantity changes
      setCartItems((prevCart) => {
        // Check if item is in cart
        if (prevCart[id] !== undefined && prevCart[id] > 0) {
          const nextCart = { ...prevCart };
          if (newQty === 0) {
            // Remove item from cart if quantity is 0
            delete nextCart[id];
          } else {
            // Update cart with new quantity
            nextCart[id] = newQty;
          }
          return nextCart;
        }
        return prevCart;
      });
      
      return next;
    });
  }, []);

  const handleAddToCart = useCallback((itemId) => {
    setCartItems((prev) => {
      const next = { ...prev };
      const newQty = quantities[itemId] || 0;
      if (newQty === 0) {
        // Remove item from cart if quantity is 0
        delete next[itemId];
      } else {
        // Update cart with new quantity
        next[itemId] = newQty;
      }
      return next;
    });
  }, [quantities]);

  const totalItems = Object.values(cartItems).reduce((a, b) => a + b, 0);
  const totalPrice = totalItems * PRICE_PER_ITEM;

  const handleSpeedtypeChange = (e) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 8);
    setFormData((prev) => ({ ...prev, speedtype_id: v }));
  };

  const handlePhoneChange = (e) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: v }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ message: '', error: false });

    if (!/^\d{8}$/.test(formData.speedtype_id.trim())) {
      setSubmitStatus({ message: 'Speedtype ID must be exactly 8 digits.', error: true });
      return;
    }
    if (!/^\d{10}$/.test(formData.phone.trim())) {
      setSubmitStatus({ message: 'Phone must be exactly 10 digits.', error: true });
      return;
    }
    if (totalPrice === 0) {
      setSubmitStatus({ message: 'Add at least one item before submitting your request.', error: true });
      return;
    }

    setSending(true);

    const itemsForStorage = RENTAL_ITEMS.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: cartItems[item.id] || 0,
    }));

    const orderSummary = itemsForStorage
      .filter((it) => it.quantity > 0)
      .map((it) => `${it.name}: ${it.quantity}`)
      .join('\n');

    const orderId = generateOrderId();
    const record = {
      id: Date.now(),
      orderId,
      createdAt: new Date().toISOString(),
      totalPrice: String(totalPrice),
      items: itemsForStorage,
      fullName: formData.full_name,
      department: formData.department,
      speedtype: formData.speedtype_id,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      notes: formData.notes,
      startDate: formData.start_date,
      startTime: formData.start_time,
      endDate: formData.end_date,
      endTime: formData.end_time,
    };

    // 1. Save to database (Supabase) or localStorage so the request is visible on Rental Requests page
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('rental_requests').insert({
        order_id: orderId,
        total_price: String(totalPrice),
        items: itemsForStorage,
        full_name: formData.full_name,
        department: formData.department,
        speedtype: formData.speedtype_id,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        notes: formData.notes,
        start_date: formData.start_date,
        start_time: formData.start_time,
        end_date: formData.end_date,
        end_time: formData.end_time,
      });
      if (error) {
        console.error('Supabase insert error:', error);
        setSubmitStatus({ message: 'Could not save your request. Please try again.', error: true });
        setSending(false);
        return;
      }
    } else {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.REQUESTS);
        const existing = raw ? JSON.parse(raw) : [];
        existing.push(record);
        localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(existing));
      } catch (err) {
        console.error('Error saving request:', err);
        setSubmitStatus({ message: 'Could not save your request. Please try again.', error: true });
        setSending(false);
        return;
      }
    }

    const templateParams = {
      start_date: formData.start_date,
      start_time: formData.start_time,
      end_date: formData.end_date,
      end_time: formData.end_time,
      full_name: formData.full_name,
      department: formData.department,
      speedtype_id: formData.speedtype_id,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      notes: formData.notes,
      total_price: String(totalPrice),
    };

    // 2. Email to admin (staff notification)
    try {
      await emailjs.send(
        EMAILJS.SERVICE_ID,
        EMAILJS.REQUEST_TEMPLATE_ID,
        templateParams
      );
    } catch (err) {
      console.error('EmailJS request (admin) error:', err);
    }

    // 3. Email to customer (confirmation)
    if (formData.email) {
      emailjs
        .send(EMAILJS.SERVICE_ID, EMAILJS.CONFIRM_TEMPLATE_ID, {
          to_email: formData.email,
          full_name: formData.full_name,
          total_price: String(totalPrice),
          order_summary: orderSummary,
        })
        .catch((err) => console.error('EmailJS confirmation (customer) error:', err));
    }

    setSubmitStatus({
      message: `Request submitted! Your order details will be shared on your email and your order ID is ${orderId}.`,
      error: false,
    });
    setQuantities(initialQuantities);
    setCartItems(initialQuantities);
    setFormData({
      start_date: '',
      start_time: '',
      end_date: '',
      end_time: '',
      full_name: '',
      department: '',
      speedtype_id: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
    });
    setSending(false);
  };

  return (
    <>
      <section className="hero">
        <h1 className="animate-character">Event Equipment Rental</h1>
        <p>Select items, choose dates & submit your request.</p>
      </section>

      <form id="rentalForm" onSubmit={handleSubmit}>
        <section className="container">
          <h2>Select Items</h2>
          <p className="sub">Each item costs $3</p>
          <div className="grid">
            {RENTAL_ITEMS.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                qty={quantities[item.id] || 0}
                cartQty={cartItems[item.id] || 0}
                onQtyChange={changeQty}
                onAddToCart={handleAddToCart}
                subtotal={(quantities[item.id] || 0) * PRICE_PER_ITEM}
              />
            ))}
          </div>
        </section>

        <section className="form-intro">
          <div className="form-logo">
            <svg className="form-brand-logo" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Document */}
              <path d="M16 8h28l8 8v36c0 2.21-1.79 4-4 4H16c-2.21 0-4-1.79-4-4V12c0-2.21 1.79-4 4-4z" fill="#ffffff" stroke="#1F252E" strokeWidth="2"/>
              <path d="M44 8v8h8" stroke="#1F252E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Lines on document */}
              <line x1="20" y1="24" x2="40" y2="24" stroke="#1F252E" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="20" y1="30" x2="44" y2="30" stroke="#1F252E" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="20" y1="36" x2="38" y2="36" stroke="#1F252E" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="20" y1="42" x2="42" y2="42" stroke="#1F252E" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h2>Rental Details</h2>
          <p>Confirm your rental dates and how we can contact you.</p>
        </section>

        <section className="form-wrapper">
          <div className="form-card">
            <h2>Rental Period</h2>
            <div className="form-row">
              <div className="form-group form-group-half">
                <label>Start Date</label>
                <DateInput
                  name="start_date"
                  required
                  value={formData.start_date}
                  onChange={(iso) => setFormData((p) => ({ ...p, start_date: iso }))}
                  minDate={true}
                />
              </div>
              <div className="form-group form-group-half">
                <label>Start Time</label>
                <TimeInput
                  name="start_time"
                  required
                  value={formData.start_time}
                  onChange={(t) => setFormData((p) => ({ ...p, start_time: t }))}
                  minTime={(() => {
                    const now = new Date();
                    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                  })()}
                  selectedDate={formData.start_date}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group form-group-half">
                <label>End Date</label>
                <DateInput
                  name="end_date"
                  required
                  value={formData.end_date}
                  onChange={(iso) => setFormData((p) => ({ ...p, end_date: iso }))}
                  minDate={true}
                />
              </div>
              <div className="form-group form-group-half">
                <label>End Time</label>
                <TimeInput
                  name="end_time"
                  required
                  value={formData.end_time}
                  onChange={(t) => setFormData((p) => ({ ...p, end_time: t }))}
                  minTime={(() => {
                    const now = new Date();
                    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                  })()}
                  selectedDate={formData.end_date}
                />
              </div>
            </div>

            <h2 style={{ marginTop: '32px', marginBottom: '28px' }}>Contact Information</h2>
            <div className="form-row">
              <div className="form-group form-group-half">
                <label>Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  placeholder="Full Name"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData((p) => ({ ...p, full_name: e.target.value }))}
                />
              </div>
              <div className="form-group form-group-half">
                <label>Department Name</label>
                <input
                  type="text"
                  name="department"
                  placeholder="Department Name"
                  value={formData.department}
                  onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group form-group-half">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                />
              </div>
              <div className="form-group form-group-half">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  maxLength={10}
                  inputMode="numeric"
                  required
                  value={formData.phone}
                  onChange={handlePhoneChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Speedtype ID</label>
              <input
                type="text"
                name="speedtype_id"
                placeholder="Speedtype ID"
                maxLength={8}
                inputMode="numeric"
                required
                value={formData.speedtype_id}
                onChange={handleSpeedtypeChange}
              />
            </div>
            <div className="form-group">
              <label>Delivery Address</label>
              <textarea
                name="address"
                placeholder="Delivery Address"
                value={formData.address}
                onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Additional Notes</label>
              <textarea
                name="notes"
                placeholder="Additional Notes"
                value={formData.notes}
                onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
              />
            </div>
          </div>
        </section>

        <div className="order-summary-wrap">
          <input type="hidden" name="total_price" value={totalPrice} />

          {totalItems > 0 && (
            <div className="order-summary-card">
              <h3 className="order-summary-title">Order Summary</h3>
              
              <div className="order-summary-section">
                <div className="order-summary-section-header">
                  <h4 className="order-summary-section-title">Items</h4>
                  <div className="order-summary-header-labels">
                    <span className="order-summary-header-label">Quantity</span>
                    <span className="order-summary-header-label">Price</span>
                  </div>
                </div>
                <div className="order-summary-items">
                  {RENTAL_ITEMS.filter(item => (cartItems[item.id] || 0) > 0).map(item => (
                    <div key={item.id} className="order-summary-item">
                      <span className="order-summary-item-name">{item.name}</span>
                      <span className="order-summary-item-qty">{cartItems[item.id]}</span>
                      <span className="order-summary-item-price">${(cartItems[item.id] * PRICE_PER_ITEM).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {(formData.start_date || formData.end_date) && (
                <div className="order-summary-section">
                  <h4 className="order-summary-section-title">Rental Period</h4>
                  <div className="order-summary-details">
                    {formData.start_date && (
                      <div className="order-summary-detail">
                        <span className="order-summary-detail-label">Start:</span>
                        <span className="order-summary-detail-value">
                          {formatDateMMDDYYYY(formData.start_date)} {formData.start_time && `at ${formData.start_time}`}
                        </span>
                      </div>
                    )}
                    {formData.end_date && (
                      <div className="order-summary-detail">
                        <span className="order-summary-detail-label">End:</span>
                        <span className="order-summary-detail-value">
                          {formatDateMMDDYYYY(formData.end_date)} {formData.end_time && `at ${formData.end_time}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(formData.full_name || formData.email || formData.phone) && (
                <div className="order-summary-section">
                  <h4 className="order-summary-section-title">Contact Information</h4>
                  <div className="order-summary-details">
                    {formData.full_name && (
                      <div className="order-summary-detail">
                        <span className="order-summary-detail-label">Name:</span>
                        <span className="order-summary-detail-value">{formData.full_name}</span>
                      </div>
                    )}
                    {formData.email && (
                      <div className="order-summary-detail">
                        <span className="order-summary-detail-label">Email:</span>
                        <span className="order-summary-detail-value">{formData.email}</span>
                      </div>
                    )}
                    {formData.phone && (
                      <div className="order-summary-detail">
                        <span className="order-summary-detail-label">Phone:</span>
                        <span className="order-summary-detail-value">{formData.phone}</span>
                      </div>
                    )}
                    {formData.department && (
                      <div className="order-summary-detail">
                        <span className="order-summary-detail-label">Department:</span>
                        <span className="order-summary-detail-value">{formData.department}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="order-summary-total">
                <span className="order-summary-total-label">Total Amount:</span>
                <span className="order-summary-total-amount">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="submit-wrap">
          <button
            type="submit"
            className="submit-btn"
            id="submitBtn"
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Submit Rental Request'}
          </button>
          <p id="successMsg" className={submitStatus.error ? 'error' : ''} aria-live="polite">
            {submitStatus.message}
          </p>
          </div>
        </div>
      </form>
    </>
  );
}
