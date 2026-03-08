export const PRICE_PER_ITEM = 3;

export const EMAILJS = {
  PUBLIC_KEY: '0c0NjTCvAgfoUwb58',
  SERVICE_ID: 'service_f0fbs2o',
  REQUEST_TEMPLATE_ID: 'template_oecnqdd',
  CONFIRM_TEMPLATE_ID: 'template_snuvsst',
};

export const RENTAL_ITEMS = [
  { id: 'tables', name: '6" Tables', image: '/images/2.webp' },
  { id: 'whiteHighTop', name: 'White 16" High Top Tables', image: '/images/White.png' },
  { id: 'blackHighTop', name: 'Black 16" High Top Tables', image: '/images/Black.png' },
  { id: 'highTopCloths', name: '16" High Top Table Cloths', image: '/images/blackcloths.png' },
  { id: 'cloths', name: '6" Table Cloths', image: '/images/3.avif' },
  { id: 'easels', name: 'Easels', image: '/images/4.jpg' },
  { id: 'clipboard', name: 'Clipboard', image: '/images/5.jpg' },
];

export const ADMIN_CREDENTIALS = {
  email: "engineering@ucdenver.edu",
  password: "Dean'sOffice3034",
};

export const STORAGE_KEYS = {
  REQUESTS: 'eventrent_requests',
  ADMIN_AUTH: 'eventrent_admin_authed',
  ORDER_SEQ: 'eventrent_order_seq',
};

/** Format a date as MM/DD/YYYY */
export function formatDateMMDDYYYY(dateOrString) {
  if (!dateOrString) return '—';
  let d;
  if (typeof dateOrString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateOrString)) {
    const [y, m, day] = dateOrString.split('-').map(Number);
    d = new Date(y, m - 1, day);
  } else {
    d = typeof dateOrString === 'string' ? new Date(dateOrString) : dateOrString;
  }
  if (Number.isNaN(d.getTime())) return '—';
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
}

/** Parse MM/DD/YYYY or M/D/YYYY to YYYY-MM-DD, or return null if invalid */
export function parseMMDDYYYYToISO(str) {
  if (!str || typeof str !== 'string') return null;
  const trimmed = str.trim();
  const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const [, month, day, year] = match.map(Number);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const d = new Date(year, month - 1, day);
  if (d.getMonth() !== month - 1 || d.getDate() !== day) return null;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Generate next sequential order ID: ORD-001, ORD-002, ... */
export function generateOrderId() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ORDER_SEQ) : null;
    const next = (raw ? parseInt(raw, 10) : 0) + 1;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ORDER_SEQ, String(next));
    }
    return `ORD-${String(next).padStart(3, '0')}`;
  } catch {
    return `ORD-${String(Date.now() % 100000).padStart(3, '0')}`;
  }
}
