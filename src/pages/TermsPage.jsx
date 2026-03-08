

export default function TermsPage() {
  return (
    <>
      <div className="info-page">
        <div className="info-page-container">
          <h1 className="info-page-title">Terms and Conditions</h1>
          <p className="info-page-subtitle">
            Please read these terms carefully before using our rental service.
          </p>
          <p className="info-page-effective">Effective Date: March 1, 2026</p>

          <section className="info-section">
            <h2 className="info-section-title">1. Acceptance of Terms</h2>
            <p>
              By submitting a rental request through EventRent, you agree to be bound by these Terms
              and Conditions. If you do not agree with any part of these terms, please do not use
              our services.
            </p>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">2. Eligibility</h2>
            <p>
              EventRent services are available exclusively to CU Denver faculty, staff, and
              recognized student organizations. All renters must provide a valid departmental
              Speedtype ID for billing purposes.
            </p>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">3. Rental Agreement</h2>
            <p>
              Each submitted rental request constitutes a rental agreement between you and EventRent
              (operated by the College of Engineering, Design and Computing at CU Denver). The
              agreement includes the selected items, rental period, pricing, and delivery details as
              specified in your request.
            </p>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">4. Pricing &amp; Payment</h2>
            <ul className="info-list">
              <li>All items are priced at $3 per item per rental period.</li>
              <li>Charges are billed to the Speedtype ID provided in the rental request.</li>
              <li>Pricing is subject to change; current prices are displayed on the website.</li>
              <li>Late return fees of $5 per day per item may apply.</li>
            </ul>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">5. Equipment Use</h2>
            <p>Renters agree to:</p>
            <ul className="info-list">
              <li>Use equipment only for its intended purpose</li>
              <li>Not modify, disassemble, or alter any equipment</li>
              <li>Not sub-rent or transfer equipment to third parties</li>
              <li>Keep equipment secure and protected from theft or damage</li>
              <li>Return equipment in the same condition as received</li>
            </ul>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">6. Liability &amp; Damages</h2>
            <p>
              The renter assumes full responsibility for all rented equipment from the time of
              delivery or pickup until return. Renters are liable for:
            </p>
            <ul className="info-list">
              <li>Repair costs for damaged equipment</li>
              <li>Full replacement cost for lost or stolen items</li>
              <li>Any costs arising from misuse or negligence</li>
            </ul>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">7. Cancellation</h2>
            <p>
              Rental requests may be cancelled or modified by contacting EventRent at least 24 hours
              before the scheduled start date. Cancellations made less than 24 hours in advance may
              still incur charges.
            </p>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">8. Limitation of Liability</h2>
            <p>
              EventRent and CU Denver shall not be liable for any indirect, incidental, or
              consequential damages arising from the use or inability to use rented equipment. Our
              total liability is limited to the rental fees paid for the specific transaction.
            </p>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">9. Changes to Terms</h2>
            <p>
              EventRent reserves the right to update these Terms and Conditions at any time.
              Continued use of the service after changes constitutes acceptance of the updated terms.
              We encourage you to review this page periodically.
            </p>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">10. Contact</h2>
            <p>
              For questions about these Terms and Conditions, contact us at{' '}
              <strong>engineering@ucdenver.edu</strong> or call <strong>+1 303-315-7170</strong>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
