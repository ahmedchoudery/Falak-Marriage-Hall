'use client'

import { useReveal } from '../hooks/useReveal'
import Link from 'next/link'

export default function CTASection() {
  const [ref, visible] = useReveal()

  return (
    <section className="cta-section">
      <div className="container">
        <div ref={ref} className={`cta-content reveal${visible ? ' visible' : ''}`}>
          <span className="section-label">Don't Wait</span>
          <h2>Book Your Dream Wedding Today</h2>
          <p>
            Dates fill up fast. Secure your preferred date now and let us handle every detail.
          </p>
          <div className="cta-btns">
            <a href="tel:+923086891083" className="btn btn-gold">
              <i className="fas fa-phone" /> 
              <span>Call Now</span>
            </a>
            <a
              href="https://wa.me/923086891083"
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp"
            >
              <i className="fab fa-whatsapp" /> 
              <span>WhatsApp</span>
            </a>
            <Link href="/booking" className="btn btn-outline">
              <i className="fas fa-calendar-check" /> 
              <span>Online Booking</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="cta-background-glow" />
    </section>
  )
}
