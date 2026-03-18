import { useReveal } from '../hooks/useReveal'
import { Link } from 'react-router-dom'

export default function CTASection() {
  const [ref, visible] = useReveal()

  return (
    <section className="cta-section">
      <div className="container">
        <div ref={ref} className={`reveal${visible ? ' visible' : ''}`}>
          <span className="section-label" style={{ display: 'block', textAlign: 'center' }}>
            Don't Wait
          </span>
          <h2>Book Your Dream Wedding Today</h2>
          <p>
            Dates fill up fast. Secure your preferred date now and let us handle every detail.
          </p>
          <div className="cta-btns">
            <a href="tel:+923086891083" className="btn btn-gold">
              <i className="fas fa-phone" /> Call Now
            </a>
            <a
              href="https://wa.me/923086891083"
              target="_blank"
              rel="noreferrer"
              className="btn"
              style={{ background: '#25d366', borderColor: '#25d366', color: 'white' }}
            >
              <i className="fab fa-whatsapp" /> WhatsApp
            </a>
            <Link to="/booking" className="btn btn-outline">
              <i className="fas fa-calendar-check" /> Online Booking
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
