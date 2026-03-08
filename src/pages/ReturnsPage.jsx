

export default function ReturnsPage() {
  return (
    <>
      <div className="info-page">
        <div className="info-page-container">
          <h1 className="info-page-title">Returns</h1>
          <p className="info-page-subtitle">
            Our return process is designed to be as simple and hassle-free as your rental experience.
          </p>

          <section className="info-section">
            <h2 className="info-section-title">Return Policy Overview</h2>
            <p>
              All rented equipment must be returned by the end date and time specified in your rental
              agreement. Timely returns ensure availability for other customers and help you avoid
              late fees.
            </p>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">How to Return Equipment</h2>
            <div className="info-steps">
              <div className="info-step">
                <span className="info-step-number">1</span>
                <div>
                  <h3>Inspect &amp; Clean</h3>
                  <p>
                    Ensure all equipment is clean and in the same condition as when you received it.
                    Remove any personal items or labels.
                  </p>
                </div>
              </div>
              <div className="info-step">
                <span className="info-step-number">2</span>
                <div>
                  <h3>Pack Securely</h3>
                  <p>
                    Use the original packaging if available. Secure all components, cables, and
                    accessories together to prevent damage during transport.
                  </p>
                </div>
              </div>
              <div className="info-step">
                <span className="info-step-number">3</span>
                <div>
                  <h3>Drop Off or Schedule Pickup</h3>
                  <p>
                    Return equipment to the North Classroom Building, 1200 Larimer Street, Suite
                    3034, Denver, CO 80204 — or contact us to arrange a campus pickup.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">Late Returns</h2>
            <p>
              Equipment returned after the agreed end date may incur a late fee of <strong>$5 per
              day per item</strong>. If you anticipate a delay, please contact us as soon as
              possible to discuss options and potentially extend your rental period.
            </p>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">Damaged or Missing Items</h2>
            <p>
              Renters are responsible for equipment during the rental period. If an item is returned
              damaged or with missing components, repair or replacement costs may apply. Please
              document and report any issues immediately upon discovery.
            </p>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">Questions?</h2>
            <p>
              Contact us at <strong>engineering@ucdenver.edu</strong> or call{' '}
              <strong>+1 303-315-7170</strong> for any return-related inquiries.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
