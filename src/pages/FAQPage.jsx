import { useState } from 'react';


const faqs = [
  {
    question: 'How do I place a rental order?',
    answer:
      'Simply browse our equipment catalog on the home page, select the items you need, choose your rental dates, fill out the contact form, and submit your request. You will receive a confirmation email with your order details.',
  },
  {
    question: 'What is the cost per item?',
    answer:
      'Each rental item costs $3 per rental period. The total is calculated based on the number of items you add to your cart.',
  },
  {
    question: 'How far in advance should I book?',
    answer:
      'We recommend placing your rental request at least 3–5 business days before your event to ensure equipment availability. Last-minute requests are accommodated when possible.',
  },
  {
    question: 'Can I modify or cancel my order after submitting?',
    answer:
      'Yes. Please contact us at engineering@ucdenver.edu or call +1 303-315-7170 as soon as possible. Modifications and cancellations are handled on a case-by-case basis.',
  },
  {
    question: 'What happens if equipment is damaged during my rental?',
    answer:
      'Renters are responsible for any damage beyond normal wear and tear. Please inspect all equipment upon pickup/delivery and report any pre-existing issues. Damaged items may incur replacement or repair fees.',
  },
  {
    question: 'Do you offer delivery and pickup?',
    answer:
      'Yes! Provide your delivery address in the rental form and we will arrange delivery and pickup. Delivery is available to locations within the CU Denver campus area.',
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'We process payments through departmental Speedtype IDs. You will need your 8-digit Speedtype ID when submitting a rental request.',
  },
  {
    question: 'Who can rent equipment?',
    answer:
      'Our rental service is available to CU Denver faculty, staff, and recognized student organizations. A valid university affiliation is required.',
  },
];

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}>
      <button className="faq-question" onClick={onToggle} aria-expanded={isOpen}>
        <span>{question}</span>
        <span className="faq-icon">{isOpen ? '−' : '+'}</span>
      </button>
      <div className="faq-answer-wrap" style={{ maxHeight: isOpen ? '300px' : '0' }}>
        <p className="faq-answer">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <>
      <div className="info-page">
        <div className="info-page-container">
          <h1 className="info-page-title">Frequently Asked Questions</h1>
          <p className="info-page-subtitle">
            Find answers to the most common questions about our equipment rental service.
          </p>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
