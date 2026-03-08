

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="info-page">
        <div className="info-page-container">
          <h1 className="info-page-title">Privacy Policy</h1>
          <p className="info-page-subtitle">
            Your privacy matters to us. This policy explains how we collect, use, and protect your
            information.
          </p>
          <p className="info-page-effective">Effective Date: March 1, 2026</p>

          <section className="info-section">
            <h2 className="info-section-title">Information We Collect</h2>
            <p>When you submit a rental request, we collect the following personal information:</p>
            <ul className="info-list">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Department name</li>
              <li>Speedtype ID</li>
              <li>Delivery address</li>
              <li>Rental dates and times</li>
              <li>Order details and additional notes</li>
            </ul>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="info-list">
              <li>Process and fulfill your rental requests</li>
              <li>Communicate order confirmations and updates via email</li>
              <li>Coordinate equipment delivery and pickup</li>
              <li>Process internal departmental billing through Speedtype IDs</li>
              <li>Improve our services and user experience</li>
            </ul>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">Data Storage &amp; Security</h2>
            <p>
              Your data is stored securely using industry-standard encryption and access controls.
              We use Supabase for database services, which implements robust security measures
              including encryption at rest and in transit. Access to personal data is restricted to
              authorized EventRent administrators only.
            </p>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">Third-Party Services</h2>
            <p>We use the following third-party services to operate EventRent:</p>
            <ul className="info-list">
              <li>
                <strong>EmailJS</strong> — for sending order confirmation and notification emails
              </li>
              <li>
                <strong>Supabase</strong> — for secure data storage and management
              </li>
            </ul>
            <p>
              These services have their own privacy policies and handle data in accordance with
              their respective terms of service.
            </p>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">Data Retention</h2>
            <p>
              We retain your rental request data for a period necessary to fulfill our operational
              and administrative obligations, typically for the duration of the academic year.
              After this period, data may be anonymized or deleted.
            </p>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="info-list">
              <li>Request access to your personal data</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for data processing</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at{' '}
              <strong>engineering@ucdenver.edu</strong>.
            </p>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">Contact Us</h2>
            <p>
              If you have questions about this privacy policy, contact us at{' '}
              <strong>engineering@ucdenver.edu</strong> or call <strong>+1 303-315-7170</strong>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
