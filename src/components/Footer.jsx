import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      {/* ── Top section: 3 columns ── */}
      <div className="footer-top">
        <div className="footer-col footer-col--about">
          <div className="footer-brand">
            <img
              src="/images/cedc-logo.png"
              alt="College of Engineering, Design and Computing - University of Colorado Denver"
              className="brand-logo"
            />
            <div className="footer-brand-info">
              <span className="footer-brand-name">EventRent</span>
              <p className="footer-text footer-brand-desc">
                A service by the College of Engineering, Design and Computing at CU Denver.
                Simple, reliable, and affordable event equipment rentals for the campus community.
              </p>
            </div>
          </div>
        </div>

        <div className="footer-col footer-col--nav">
          <h4 className="footer-heading">Navigate</h4>
          <div className="footer-nav-grid">
            <ul className="footer-nav-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/returns">Returns</Link></li>
            </ul>
            <ul className="footer-nav-list">
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/accessibility">Accessibility</Link></li>
              <li><Link to="/terms-and-conditions">Terms &amp; Conditions</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Address bar ── */}
      <div className="footer-address">
        <span>EventRent</span>
        <span className="footer-dot">•</span>
        <span>North Classroom Building, 1200 Larimer St, Suite 3034, Denver, CO 80204</span>
        <span className="footer-dot">•</span>
        <span>Phone: +1 303-315-7170</span>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <div className="footer-bottom-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-and-conditions">Terms</Link>
            <Link to="/accessibility">Accessibility</Link>
          </div>
          <span className="footer-copyright">© 2026 EventRent. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
