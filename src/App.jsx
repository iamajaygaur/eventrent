import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminRequestsPage from './pages/AdminRequestsPage';
import FAQPage from './pages/FAQPage';
import ReturnsPage from './pages/ReturnsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import AccessibilityPage from './pages/AccessibilityPage';
import TermsPage from './pages/TermsPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="admin" element={<AdminLoginPage />} />
        <Route path="admin/requests" element={<AdminRequestsPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="returns" element={<ReturnsPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="accessibility" element={<AccessibilityPage />} />
        <Route path="terms-and-conditions" element={<TermsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
