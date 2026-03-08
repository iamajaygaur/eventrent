import { useNavigate } from 'react-router-dom';
import AdminLoginForm from '../components/AdminLoginForm';

export default function AdminLoginPage() {
  const navigate = useNavigate();

  return (
    <main className="admin-main">
      <AdminLoginForm onSuccess={() => navigate('/admin/requests')} />
    </main>
  );
}
