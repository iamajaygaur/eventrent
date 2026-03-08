

export default function AccessibilityPage() {
  return (
    <>
      <div className="info-page">
        <div className="info-page-container">
          <h1 className="info-page-title">Accessibility</h1>
          <p className="info-page-subtitle">
            EventRent is committed to ensuring digital accessibility for people of all abilities.
          </p>

          <section className="info-section">
            <h2 className="info-section-title">Our Commitment</h2>
            <p>
              We strive to provide an accessible and inclusive experience for everyone who uses our
              platform. EventRent is continually improving the user experience for all visitors and
              applying the relevant accessibility standards.
            </p>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">Standards</h2>
            <p>
              We aim to conform to the{' '}
              <strong>Web Content Accessibility Guidelines (WCAG) 2.1</strong> at Level AA. These
              guidelines explain how to make web content more accessible to people with a wide
              range of disabilities, including:
            </p>
            <ul className="info-list">
              <li>Visual impairments (low vision, color blindness, blindness)</li>
              <li>Hearing impairments</li>
              <li>Motor impairments</li>
              <li>Cognitive and learning disabilities</li>
            </ul>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">Accessibility Features</h2>
            <p>EventRent includes the following accessibility features:</p>
            <ul className="info-list">
              <li>Semantic HTML structure for screen reader compatibility</li>
              <li>Keyboard navigable interface for all interactive elements</li>
              <li>ARIA labels and roles for assistive technologies</li>
              <li>Sufficient color contrast ratios for text readability</li>
              <li>Focus indicators for keyboard navigation</li>
              <li>Descriptive alt text for images</li>
              <li>Responsive design that adapts to various screen sizes and zoom levels</li>
            </ul>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">Known Limitations</h2>
            <p>
              While we strive for comprehensive accessibility, some areas of the site may still be
              undergoing improvements. We are actively working to identify and resolve any barriers
              and welcome your feedback to help improve our accessibility.
            </p>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">Assistive Technology Support</h2>
            <p>Our platform is designed to be compatible with the following assistive technologies:</p>
            <ul className="info-list">
              <li>Screen readers (VoiceOver, NVDA, JAWS)</li>
              <li>Screen magnification software</li>
              <li>Speech recognition software</li>
              <li>Keyboard-only navigation</li>
            </ul>
          </section>

          <section className="info-section">
            <h2 className="info-section-title">Need Help?</h2>
            <p>
              If you encounter any accessibility barriers or need assistance using EventRent, please
              contact us:
            </p>
            <ul className="info-list">
              <li>
                Email: <strong>engineering@ucdenver.edu</strong>
              </li>
              <li>
                Phone: <strong>+1 303-315-7170</strong>
              </li>
            </ul>
            <p>
              We welcome your feedback and will make reasonable accommodations to ensure you can
              access our services.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
