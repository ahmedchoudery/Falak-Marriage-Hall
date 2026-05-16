'use client'

import { useReveal } from '../hooks/useReveal'
import Link from 'next/link'

const contactItems = [
  {
    icon: 'fas fa-map-marker-alt',
    label: 'Address',
    value: 'GT Road, Service Mor, Servis Industries, Gujrat 50700, Punjab, Pakistan',
  },
  {
    icon: 'fas fa-phone',
    label: 'Phone',
    value: '0308-6891083',
    href: 'tel:+923086891083',
  },
  {
    icon: 'fab fa-whatsapp',
    label: 'WhatsApp',
    value: '+92 308 6891083',
    href: 'https://wa.me/923086891083',
  },
  {
    icon: 'fas fa-envelope',
    label: 'Email',
    value: 'info@falakhall.com',
    href: 'mailto:info@falakhall.com',
  },
  {
    icon: 'fas fa-clock',
    label: 'Hours',
    value: 'Mon – Sun: 9:00 AM – 11:00 PM',
  },
]

export default function Location() {
  const [leftRef,  leftVisible]  = useReveal()
  const [rightRef, rightVisible] = useReveal({ delay: 150 })

  return (
    <section id="location" className="location-section">
      <div className="container">
        <div className={`section-title reveal${leftVisible ? ' visible' : ''}`}>
          <span className="section-label">Find Us</span>
          <h2>Visit Falak Hall</h2>
          <div className="gold-divider" />
          <p className="location-subtitle">
            Centrally located on GT Road — easy to reach from across Gujrat and beyond.
          </p>
        </div>

        <div className="location-grid">
          {/* Map */}
          <div
            ref={leftRef}
            className={`map-frame-wrapper reveal-left${leftVisible ? ' visible' : ''}`}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3361.678214961768!2d74.04985250952028!3d32.58810477363364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391f1ab545de0947%3A0x19f9b9caa6ba6177!2sFalak%20Marriage%20Hall!5e0!3m2!1sen!2s!4v1772830377925!5m2!1sen!2s"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Falak Marriage Hall Location"
              className="location-map"
            />
          </div>

          {/* Contact Details */}
          <div
            ref={rightRef}
            className={`contact-info reveal-right${rightVisible ? ' visible' : ''}`}
          >
            <div className="contact-items-grid">
              {contactItems.map((item) => (
                <div className="contact-info-item" key={item.label}>
                  <div className="contact-info-icon">
                    <i className={item.icon} />
                  </div>
                  <div className="contact-info-text">
                    <span className="contact-info-label">{item.label}</span>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel="noreferrer"
                        className="contact-info-value"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="contact-info-value">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/booking"
              className="btn btn-gold btn-full mt-24"
            >
              <span>Book Your Date Now</span>
              <i className="fas fa-calendar-check" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
