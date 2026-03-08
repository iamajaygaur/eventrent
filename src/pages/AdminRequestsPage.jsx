import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { STORAGE_KEYS, formatDateMMDDYYYY, PRICE_PER_ITEM } from '../constants';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const PER_PAGE = 10;

function rowToRequest(row) {
  return {
    id: row.id,
    orderId: row.order_id || null,
    createdAt: row.created_at,
    totalPrice: row.total_price,
    items: row.items || [],
    fullName: row.full_name,
    department: row.department,
    speedtype: row.speedtype,
    email: row.email,
    phone: row.phone,
    address: row.address,
    notes: row.notes,
    startDate: row.start_date,
    startTime: row.start_time,
    endDate: row.end_date,
    endTime: row.end_time,
  };
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [viewRequest, setViewRequest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) !== '1') {
        navigate('/admin', { replace: true });
        return;
      }
    } catch {
      navigate('/admin', { replace: true });
      return;
    }
    loadRequests();
  }, [navigate]);

  /** Sort so newest request is first (on top), older below */
  function sortNewestFirst(list) {
    return [...list].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (dateB !== dateA) return dateB - dateA;
      return (b.id || 0) - (a.id || 0);
    });
  }

  async function loadRequests() {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('rental_requests')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setRequests(sortNewestFirst((data || []).map(rowToRequest)));
      } else {
        const raw = localStorage.getItem(STORAGE_KEYS.REQUESTS);
        const data = raw ? JSON.parse(raw) : [];
        setRequests(sortNewestFirst(data));
      }
    } catch (err) {
      console.error('Error loading requests:', err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  if (sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) !== '1') {
    return null;
  }

  const total = requests.length;
  const start = (page - 1) * PER_PAGE;
  const end = Math.min(start + PER_PAGE, total);
  const pageData = requests.slice(start, end);
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const handlePrintOrderSummary = () => {
    if (!viewRequest) return;
    
    const printWindow = window.open('', '_blank');
    const itemsHtml = (viewRequest.items || [])
      .filter((i) => i.quantity > 0)
      .map((item) => `
        <tr>
          <td>${item.name}</td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: right;">$${(item.quantity * PRICE_PER_ITEM).toFixed(2)}</td>
        </tr>
      `).join('');

    const startDateStr = viewRequest.startDate 
      ? `${formatDateMMDDYYYY(viewRequest.startDate)}${viewRequest.startTime && viewRequest.startTime.trim() ? ` at ${viewRequest.startTime.trim()}` : ''}`
      : '—';
    
    const endDateStr = viewRequest.endDate 
      ? `${formatDateMMDDYYYY(viewRequest.endDate)}${viewRequest.endTime && viewRequest.endTime.trim() ? ` at ${viewRequest.endTime.trim()}` : ''}`
      : '—';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order Summary - ${viewRequest.orderId || 'N/A'}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif;
              padding: 40px;
              color: #111827;
              max-width: 800px;
              margin: 0 auto;
            }
            h1 {
              text-align: center;
              margin-bottom: 30px;
              color: #111827;
            }
            .section {
              margin-bottom: 30px;
            }
            .section-title {
              font-size: 14px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #374151;
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 1px solid #e5e7eb;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th {
              text-align: left;
              font-size: 12px;
              font-weight: 600;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              padding: 8px 0;
            }
            td {
              padding: 8px 0;
              border-bottom: 1px solid #f3f4f6;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #f3f4f6;
            }
            .detail-label {
              font-weight: 500;
              color: #6b7280;
            }
            .detail-value {
              color: #111827;
            }
            .total {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              display: flex;
              justify-content: space-between;
              font-size: 16px;
              font-weight: 600;
            }
            .total-amount {
              font-size: 20px;
              font-weight: 700;
            }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <h1>Order Summary</h1>
          
          <div class="section">
            <div class="section-title">Order Information</div>
            <div class="detail-row">
              <span class="detail-label">Order ID:</span>
              <span class="detail-value"><strong>${viewRequest.orderId || '—'}</strong></span>
            </div>
            ${viewRequest.createdAt ? `
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${formatDateMMDDYYYY(viewRequest.createdAt)}, ${new Date(viewRequest.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' })}</span>
            </div>
            ` : ''}
          </div>

          ${itemsHtml ? `
          <div class="section">
            <div class="section-title">Items</div>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align: center;">Quantity</th>
                  <th style="text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>
          ` : ''}

          ${(viewRequest.startDate || viewRequest.endDate) ? `
          <div class="section">
            <div class="section-title">Rental Period</div>
            <div class="detail-row">
              <span class="detail-label">Start:</span>
              <span class="detail-value">${startDateStr}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">End:</span>
              <span class="detail-value">${endDateStr}</span>
            </div>
          </div>
          ` : ''}

          ${(viewRequest.fullName || viewRequest.email || viewRequest.phone || viewRequest.department) ? `
          <div class="section">
            <div class="section-title">Contact Information</div>
            ${viewRequest.fullName ? `
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">${viewRequest.fullName}</span>
            </div>
            ` : ''}
            ${viewRequest.email ? `
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">${viewRequest.email}</span>
            </div>
            ` : ''}
            ${viewRequest.phone ? `
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span class="detail-value">${viewRequest.phone}</span>
            </div>
            ` : ''}
            ${viewRequest.department ? `
            <div class="detail-row">
              <span class="detail-label">Department:</span>
              <span class="detail-value">${viewRequest.department}</span>
            </div>
            ` : ''}
            ${viewRequest.speedtype ? `
            <div class="detail-row">
              <span class="detail-label">Speedtype:</span>
              <span class="detail-value">${viewRequest.speedtype}</span>
            </div>
            ` : ''}
            ${viewRequest.address ? `
            <div class="detail-row">
              <span class="detail-label">Address:</span>
              <span class="detail-value">${viewRequest.address}</span>
            </div>
            ` : ''}
          </div>
          ` : ''}

          ${viewRequest.notes ? `
          <div class="section">
            <div class="section-title">Notes</div>
            <div class="detail-row">
              <span class="detail-value" style="width: 100%; text-align: left;">${viewRequest.notes}</span>
            </div>
          </div>
          ` : ''}

          <div class="total">
            <span>Total Amount:</span>
            <span class="total-amount">$${parseFloat(viewRequest.totalPrice || '0').toFixed(2)}</span>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <main className="admin-main">
      <section className="admin-card admin-requests-card">
        <div className="admin-requests-header">
          <div>
            <h1>Rental Requests</h1>
            <p className="admin-sub">
              {isSupabaseConfigured()
                ? 'Submissions are stored in the database and sync across devices.'
                : 'Entries are stored locally in this browser. Add Supabase to use a database.'}
            </p>
          </div>
          <button type="button" className="admin-refresh-btn" onClick={loadRequests} disabled={loading}>
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>

        {loading && requests.length === 0 ? (
          <div className="admin-note">Loading requests…</div>
        ) : requests.length === 0 ? (
          <div className="admin-note">No rental requests have been submitted yet.</div>
        ) : (
          <>
            <div className="requests-table-wrap">
              <table className="requests-table requests-table--styled">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Department</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Email</th>
                    <th>Total</th>
                    <th className="th-actions">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((req) => {
                    const created = req.createdAt ? new Date(req.createdAt) : null;
                    const dateStr = formatDateMMDDYYYY(created);
                    const timeStr = created ? created.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' }) : '—';
                    return (
                      <tr key={req.id}>
                        <td className="td-order-id">{req.orderId || '—'}</td>
                        <td className="td-customer">{req.fullName || '—'}</td>
                        <td className="td-department">{req.department || '—'}</td>
                        <td className="td-date">{dateStr}</td>
                        <td className="td-time">{timeStr}</td>
                        <td className="td-email">{req.email || '—'}</td>
                        <td className="td-total">${req.totalPrice || '0'}</td>
                        <td className="td-actions">
                          <button
                            type="button"
                            className="req-btn req-btn--view"
                            onClick={() => setViewRequest(req)}
                            title="View details"
                            aria-label="View details"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          </button>
                          <button
                            type="button"
                            className="req-btn req-btn--print"
                            onClick={() => {
                              const printRequest = req;
                              const printWindow = window.open('', '_blank');
                              const itemsHtml = (printRequest.items || [])
                                .filter((i) => i.quantity > 0)
                                .map((item) => `
                                  <tr>
                                    <td>${item.name}</td>
                                    <td style="text-align: center;">${item.quantity}</td>
                                    <td style="text-align: right;">$${(item.quantity * PRICE_PER_ITEM).toFixed(2)}</td>
                                  </tr>
                                `).join('');

                              const startDateStr = printRequest.startDate 
                                ? `${formatDateMMDDYYYY(printRequest.startDate)}${printRequest.startTime && printRequest.startTime.trim() ? ` at ${printRequest.startTime.trim()}` : ''}`
                                : '—';
                              
                              const endDateStr = printRequest.endDate 
                                ? `${formatDateMMDDYYYY(printRequest.endDate)}${printRequest.endTime && printRequest.endTime.trim() ? ` at ${printRequest.endTime.trim()}` : ''}`
                                : '—';

                              printWindow.document.write(`
                                <!DOCTYPE html>
                                <html>
                                  <head>
                                    <title>Order Summary - ${printRequest.orderId || 'N/A'}</title>
                                    <style>
                                      body {
                                        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif;
                                        padding: 40px;
                                        color: #111827;
                                        max-width: 800px;
                                        margin: 0 auto;
                                      }
                                      h1 {
                                        text-align: center;
                                        margin-bottom: 30px;
                                        color: #111827;
                                      }
                                      .section {
                                        margin-bottom: 30px;
                                      }
                                      .section-title {
                                        font-size: 14px;
                                        font-weight: 600;
                                        text-transform: uppercase;
                                        letter-spacing: 0.05em;
                                        color: #374151;
                                        margin-bottom: 12px;
                                        padding-bottom: 8px;
                                        border-bottom: 1px solid #e5e7eb;
                                      }
                                      table {
                                        width: 100%;
                                        border-collapse: collapse;
                                        margin-bottom: 20px;
                                      }
                                      th {
                                        text-align: left;
                                        font-size: 12px;
                                        font-weight: 600;
                                        color: #6b7280;
                                        text-transform: uppercase;
                                        letter-spacing: 0.05em;
                                        padding: 8px 0;
                                      }
                                      td {
                                        padding: 8px 0;
                                        border-bottom: 1px solid #f3f4f6;
                                      }
                                      .detail-row {
                                        display: flex;
                                        justify-content: space-between;
                                        padding: 8px 0;
                                        border-bottom: 1px solid #f3f4f6;
                                      }
                                      .detail-label {
                                        font-weight: 500;
                                        color: #6b7280;
                                      }
                                      .detail-value {
                                        color: #111827;
                                      }
                                      .total {
                                        margin-top: 20px;
                                        padding-top: 20px;
                                        border-top: 2px solid #e5e7eb;
                                        display: flex;
                                        justify-content: space-between;
                                        font-size: 16px;
                                        font-weight: 600;
                                      }
                                      .total-amount {
                                        font-size: 20px;
                                        font-weight: 700;
                                      }
                                      @media print {
                                        body { padding: 20px; }
                                      }
                                    </style>
                                  </head>
                                  <body>
                                    <h1>Order Summary</h1>
                                    
                                    <div class="section">
                                      <div class="section-title">Order Information</div>
                                      <div class="detail-row">
                                        <span class="detail-label">Order ID:</span>
                                        <span class="detail-value"><strong>${printRequest.orderId || '—'}</strong></span>
                                      </div>
                                      ${printRequest.createdAt ? `
                                      <div class="detail-row">
                                        <span class="detail-label">Date:</span>
                                        <span class="detail-value">${formatDateMMDDYYYY(printRequest.createdAt)}, ${new Date(printRequest.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' })}</span>
                                      </div>
                                      ` : ''}
                                    </div>

                                    ${itemsHtml ? `
                                    <div class="section">
                                      <div class="section-title">Items</div>
                                      <table>
                                        <thead>
                                          <tr>
                                            <th>Item</th>
                                            <th style="text-align: center;">Quantity</th>
                                            <th style="text-align: right;">Price</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          ${itemsHtml}
                                        </tbody>
                                      </table>
                                    </div>
                                    ` : ''}

                                    ${(printRequest.startDate || printRequest.endDate) ? `
                                    <div class="section">
                                      <div class="section-title">Rental Period</div>
                                      <div class="detail-row">
                                        <span class="detail-label">Start:</span>
                                        <span class="detail-value">${startDateStr}</span>
                                      </div>
                                      <div class="detail-row">
                                        <span class="detail-label">End:</span>
                                        <span class="detail-value">${endDateStr}</span>
                                      </div>
                                    </div>
                                    ` : ''}

                                    ${(printRequest.fullName || printRequest.email || printRequest.phone || printRequest.department || printRequest.speedtype || printRequest.address) ? `
                                    <div class="section">
                                      <div class="section-title">Contact Information</div>
                                      ${printRequest.fullName ? `
                                      <div class="detail-row">
                                        <span class="detail-label">Name:</span>
                                        <span class="detail-value">${printRequest.fullName}</span>
                                      </div>
                                      ` : ''}
                                      ${printRequest.email ? `
                                      <div class="detail-row">
                                        <span class="detail-label">Email:</span>
                                        <span class="detail-value">${printRequest.email}</span>
                                      </div>
                                      ` : ''}
                                      ${printRequest.phone ? `
                                      <div class="detail-row">
                                        <span class="detail-label">Phone:</span>
                                        <span class="detail-value">${printRequest.phone}</span>
                                      </div>
                                      ` : ''}
                                      ${printRequest.department ? `
                                      <div class="detail-row">
                                        <span class="detail-label">Department:</span>
                                        <span class="detail-value">${printRequest.department}</span>
                                      </div>
                                      ` : ''}
                                      ${printRequest.speedtype ? `
                                      <div class="detail-row">
                                        <span class="detail-label">Speedtype:</span>
                                        <span class="detail-value">${printRequest.speedtype}</span>
                                      </div>
                                      ` : ''}
                                      ${printRequest.address ? `
                                      <div class="detail-row">
                                        <span class="detail-label">Address:</span>
                                        <span class="detail-value">${printRequest.address}</span>
                                      </div>
                                      ` : ''}
                                    </div>
                                    ` : ''}

                                    ${printRequest.notes ? `
                                    <div class="section">
                                      <div class="section-title">Notes</div>
                                      <div class="detail-row">
                                        <span class="detail-value" style="width: 100%; text-align: left;">${printRequest.notes}</span>
                                      </div>
                                    </div>
                                    ` : ''}

                                    <div class="total">
                                      <span>Total Amount:</span>
                                      <span class="total-amount">$${parseFloat(printRequest.totalPrice || '0').toFixed(2)}</span>
                                    </div>
                                  </body>
                                </html>
                              `);
                              
                              printWindow.document.close();
                              setTimeout(() => {
                                printWindow.print();
                              }, 250);
                            }}
                            title="Print order summary"
                            aria-label="Print order summary"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="6 9 6 2 18 2 18 9"></polyline>
                              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                              <rect x="6" y="14" width="12" height="8"></rect>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="requests-pagination">
              <span className="requests-pagination-info">
                {total === 0 ? '0 items' : `${start + 1} – ${end} of ${total} items`}
              </span>
              <div className="requests-pagination-btns">
                <button
                  type="button"
                  className="req-page-btn"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="req-page-btn"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {viewRequest && (
        <div className="req-modal-overlay" onClick={() => setViewRequest(null)} role="dialog" aria-modal="true" aria-labelledby="req-modal-title">
          <div className="req-modal" onClick={(e) => e.stopPropagation()}>
            <div className="req-modal-header">
              <h2 id="req-modal-title">Rental request details</h2>
              <button type="button" className="req-modal-close" onClick={() => setViewRequest(null)} aria-label="Close">×</button>
            </div>
            <div className="req-modal-body">
              <div className="req-modal-summary-card">
                <h3 className="req-modal-summary-title">Order Summary</h3>
                
                {/* Order Information Section */}
                <div className="req-modal-summary-section">
                  <h4 className="req-modal-summary-section-title">Order Information</h4>
                  <div className="req-modal-summary-details">
                    {viewRequest.orderId && (
                      <div className="req-modal-summary-detail">
                        <span className="req-modal-summary-detail-label">Order ID:</span>
                        <span className="req-modal-summary-detail-value"><strong>{viewRequest.orderId}</strong></span>
                      </div>
                    )}
                    {viewRequest.createdAt && (
                      <div className="req-modal-summary-detail">
                        <span className="req-modal-summary-detail-label">Date:</span>
                        <span className="req-modal-summary-detail-value">
                          {formatDateMMDDYYYY(viewRequest.createdAt)}, {new Date(viewRequest.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items Section */}
                {(viewRequest.items || []).filter((i) => i.quantity > 0).length > 0 && (
                  <div className="req-modal-summary-section">
                    <div className="req-modal-summary-section-header">
                      <h4 className="req-modal-summary-section-title">Items</h4>
                      <div className="req-modal-summary-header-labels">
                        <span className="req-modal-summary-header-label">Quantity</span>
                        <span className="req-modal-summary-header-label">Price</span>
                      </div>
                    </div>
                    <div className="req-modal-summary-items">
                      {(viewRequest.items || []).filter((i) => i.quantity > 0).map((item) => (
                        <div key={item.id} className="req-modal-summary-item">
                          <span className="req-modal-summary-item-name">{item.name}</span>
                          <span className="req-modal-summary-item-qty">{item.quantity}</span>
                          <span className="req-modal-summary-item-price">${(item.quantity * PRICE_PER_ITEM).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rental Period Section */}
                {(viewRequest.startDate || viewRequest.endDate) && (
                  <div className="req-modal-summary-section">
                    <h4 className="req-modal-summary-section-title">Rental Period</h4>
                    <div className="req-modal-summary-details">
                      {viewRequest.startDate && (
                        <div className="req-modal-summary-detail">
                          <span className="req-modal-summary-detail-label">Start:</span>
                          <span className="req-modal-summary-detail-value">
                            {formatDateMMDDYYYY(viewRequest.startDate)}
                            {viewRequest.startTime && viewRequest.startTime.trim() && ` at ${viewRequest.startTime.trim()}`}
                          </span>
                        </div>
                      )}
                      {viewRequest.endDate && (
                        <div className="req-modal-summary-detail">
                          <span className="req-modal-summary-detail-label">End:</span>
                          <span className="req-modal-summary-detail-value">
                            {formatDateMMDDYYYY(viewRequest.endDate)}
                            {viewRequest.endTime && viewRequest.endTime.trim() && ` at ${viewRequest.endTime.trim()}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact Information Section */}
                {(viewRequest.fullName || viewRequest.email || viewRequest.phone || viewRequest.department || viewRequest.speedtype || viewRequest.address) && (
                  <div className="req-modal-summary-section">
                    <h4 className="req-modal-summary-section-title">Contact Information</h4>
                    <div className="req-modal-summary-details">
                      {viewRequest.fullName && (
                        <div className="req-modal-summary-detail">
                          <span className="req-modal-summary-detail-label">Name:</span>
                          <span className="req-modal-summary-detail-value">{viewRequest.fullName}</span>
                        </div>
                      )}
                      {viewRequest.email && (
                        <div className="req-modal-summary-detail">
                          <span className="req-modal-summary-detail-label">Email:</span>
                          <span className="req-modal-summary-detail-value">{viewRequest.email}</span>
                        </div>
                      )}
                      {viewRequest.phone && (
                        <div className="req-modal-summary-detail">
                          <span className="req-modal-summary-detail-label">Phone:</span>
                          <span className="req-modal-summary-detail-value">{viewRequest.phone}</span>
                        </div>
                      )}
                      {viewRequest.department && (
                        <div className="req-modal-summary-detail">
                          <span className="req-modal-summary-detail-label">Department:</span>
                          <span className="req-modal-summary-detail-value">{viewRequest.department}</span>
                        </div>
                      )}
                      {viewRequest.speedtype && (
                        <div className="req-modal-summary-detail">
                          <span className="req-modal-summary-detail-label">Speedtype:</span>
                          <span className="req-modal-summary-detail-value">{viewRequest.speedtype}</span>
                        </div>
                      )}
                      {viewRequest.address && (
                        <div className="req-modal-summary-detail">
                          <span className="req-modal-summary-detail-label">Address:</span>
                          <span className="req-modal-summary-detail-value">{viewRequest.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes Section */}
                {viewRequest.notes && (
                  <div className="req-modal-summary-section">
                    <h4 className="req-modal-summary-section-title">Notes</h4>
                    <div className="req-modal-summary-details">
                      <div className="req-modal-summary-detail">
                        <span className="req-modal-summary-detail-value" style={{ width: '100%', textAlign: 'left' }}>{viewRequest.notes}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Total Amount */}
                <div className="req-modal-summary-total">
                  <span className="req-modal-summary-total-label">Total Amount:</span>
                  <span className="req-modal-summary-total-amount">${parseFloat(viewRequest.totalPrice || '0').toFixed(2)}</span>
                </div>

                {/* Print Button */}
                <div className="req-modal-print-section">
                  <button type="button" className="req-modal-print-btn-large" onClick={handlePrintOrderSummary}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 6 2 18 2 18 9"></polyline>
                      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                      <rect x="6" y="14" width="12" height="8"></rect>
                    </svg>
                    Print Order Summary
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
