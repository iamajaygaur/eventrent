import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AdminLoginForm from './AdminLoginForm';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith('/admin');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    navigate('/admin/requests');
  };

  return (
    <>
      <Header isAdmin={isAdmin} onOpenLogin={() => setShowLoginModal(true)} />
      <main key={location.pathname} className="page-transition">
        <Outlet />
      </main>
      <Footer />

      {showLoginModal && (
        <div
          className="admin-login-overlay"
          onClick={() => setShowLoginModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-login-title"
        >
          <div className="admin-login-modal-card" onClick={(e) => e.stopPropagation()}>
            <AdminLoginForm
              onSuccess={handleLoginSuccess}
              onClose={() => setShowLoginModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
