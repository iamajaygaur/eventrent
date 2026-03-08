import { Link, useLocation } from 'react-router-dom';
import { STORAGE_KEYS } from '../constants';

export default function Header({ isAdmin, onOpenLogin }) {
  const location = useLocation();

  const handleEventRentClick = () => {
    if (isAdmin) {
      try {
        sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      } catch (e) {}
    }
  };

  return (
    <header>
      <div className="header-inner">
        <div className="logo">
          <Link to="/">
            <img
              src="/images/cedc-logo.png"
              alt="College of Engineering, Design and Computing - University of Colorado Denver"
              className="brand-logo"
            />
          </Link>
        </div>
        <div className="header-eventrent-logo">
          <Link
            to="/"
            className="header-eventrent-link"
            onClick={handleEventRentClick}
          >
            EventRent
          </Link>
          {!isAdmin && (
            <button
              type="button"
              className="header-admin-link header-admin-link-btn"
              onClick={onOpenLogin}
            >
              <svg className="admin-login-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Admin Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
