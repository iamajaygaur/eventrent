import { useState } from 'react';
import { ADMIN_CREDENTIALS, STORAGE_KEYS } from '../constants';

export default function AdminLoginForm({ onSuccess, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('Use your EventRent admin credentials to continue.');
  const [isError, setIsError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (trimmedEmail === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setMessage("Login successful.");
      setIsError(false);
      try {
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, '1');
      } catch (err) {
        console.error('Unable to write session auth:', err);
      }
      onSuccess?.();
    } else {
      setMessage('Invalid admin email or password.');
      setIsError(true);
    }
  };

  return (
    <section className="admin-card">
      {onClose && (
        <button
          type="button"
          className="admin-login-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        )}
      <h1>Admin Login</h1>
      <p className="admin-sub">Restricted access for EventRent staff.</p>

      <form className="admin-form" onSubmit={handleSubmit} autoComplete="on">
        <div className="form-group">
          <label htmlFor="admin-email">Admin Email</label>
          <input
            type="email"
            id="admin-email"
            name="username"
            placeholder="Enter Email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="admin-password">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="admin-password"
            name="password"
            placeholder="Enter password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="show-password-row">
            <input
              type="checkbox"
              id="toggle-password"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            <span>Show password</span>
          </label>
        </div>

        <button type="submit" className="submit-btn">Log In</button>
      </form>

      <p className={`admin-note ${isError ? 'error' : ''}`}>{message}</p>
    </section>
  );
}
