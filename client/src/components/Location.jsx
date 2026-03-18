import { useReveal } from '../hooks/useReveal'
import { Link } from 'react-router-dom'

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
          <p style={{ color: 'var(--text-muted)', marginTop: 20, fontSize: '0.95rem' }}>
            Centrally located on GT Road — easy to reach from across Gujrat and beyond.
          </p>
        </div>

        <div className="location-grid">
          {/* Map */}
          <div
            ref={leftRef}
            className={`map-frame reveal-left${leftVisible ? ' visible' : ''}`}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3361.678214961768!2d74.04985250952028!3d32.58810477363364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391f1ab545de0947%3A0x19f9b9caa6ba6177!2sFalak%20Marriage%20Hall!5e0!3m2!1sen!2s!4v1772830377925!5m2!1sen!2s"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Falak Marriage Hall Location"
            />
          </div>

          {/* Contact Details */}
          <div
            ref={rightRef}
            className={`contact-details reveal-right${rightVisible ? ' visible' : ''}`}
          >
            {contactItems.map((item) => (
              <div className="contact-item" key={item.label}>
                <div className="contact-item-icon">
                  <i className={item.icon} />
                </div>
                <div>
                  <span className="contact-item-label">{item.label}</span>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel="noreferrer"
                      className="contact-item-value"
                      style={{ display: 'block', color: 'var(--text)', transition: 'color .3s' }}
                      onMouseEnter={(e) => e.target.style.color = 'var(--gold)'}
                      onMouseLeave={(e) => e.target.style.color = 'var(--text)'}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="contact-item-value">{item.value}</span>
                  )}
                </div>
              </div>
            ))}

            <Link
              to="/booking"
              className="btn btn-gold"
              style={{ marginTop: 8, width: '100%', justifyContent: 'center' }}
            >
              <i className="fas fa-calendar-check" /> Book Your Date Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
