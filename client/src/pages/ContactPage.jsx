import { useEffect } from 'react'
import anime from 'animejs'
import { useReveal } from '../hooks/useReveal'
import { Link } from 'react-router-dom'

const contactItems = [
  { icon: 'fas fa-map-marker-alt', label: 'Address',  value: 'GT Road, Service Mor, Servis Industries, Gujrat 50700, Punjab, Pakistan' },
  { icon: 'fas fa-phone',          label: 'Phone',    value: '0308-6891083',    href: 'tel:+923086891083' },
  { icon: 'fab fa-whatsapp',       label: 'WhatsApp', value: '+92 308 6891083', href: 'https://wa.me/923086891083' },
  { icon: 'fas fa-envelope',       label: 'Email',    value: 'info@falakhall.com', href: 'mailto:info@falakhall.com' },
  { icon: 'fas fa-clock',          label: 'Hours',    value: 'Daily: 9:00 AM – 11:00 PM' },
]

const infoCards = [
  { icon: 'fas fa-car',            title: 'Easy Parking',      desc: '200+ secure parking spaces available for all your guests, managed by professional staff.' },
  { icon: 'fas fa-map-marker-alt', title: 'Central Location',  desc: 'Located on Main GT Road — easily accessible from all major areas of Gujrat and surrounding cities.' },
  { icon: 'fas fa-phone',          title: 'Always Available',  desc: 'Our team is available 7 days a week from 9 AM to 11 PM for all your queries and bookings.' },
]

function InfoCard({ icon, title, desc, delay }) {
  const [ref, visible] = useReveal({ delay })
  return (
    <div ref={ref} className={`service-card reveal-scale${visible ? ' visible' : ''}`}>
      <div className="service-icon"><i className={icon} /></div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  )
}

export default function ContactPage() {
  const [leftRef,  leftVisible]  = useReveal()
  const [rightRef, rightVisible] = useReveal({ delay: 120 })

  useEffect(() => {
    anime({
      targets: '.contact-page-title .char',
      opacity: [0, 1], translateY: [40, 0],
      delay: anime.stagger(40, { start: 200 }),
      easing: 'easeOutExpo', duration: 700,
    })
  }, [])

  const titleChars = 'Visit Us'.split('').map((c, i) => (
    <span key={i} className="char" style={{ display: 'inline-block', opacity: 0 }}>
      {c === ' ' ? '\u00A0' : c}
    </span>
  ))

  return (
    <div className="contact-page">
      <div style={{ padding: '80px 0 60px', textAlign: 'center', background: 'linear-gradient(to bottom, var(--dark-3), var(--dark-2))', borderBottom: '1px solid var(--gold-border)' }}>
        <div className="container">
          <span className="section-label" style={{ display: 'block', textAlign: 'center' }}>Get In Touch</span>
          <h1 className="contact-page-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: 'var(--cream)', lineHeight: 1.1 }}>
            {titleChars}
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 16, fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.1rem' }}>
            Located at the heart of Gujrat on Main GT Road.
          </p>
        </div>
      </div>

      <section style={{ background: 'var(--dark-2)', padding: 'clamp(60px, 8vw, 100px) 0' }}>
        <div className="container">
          <div className="location-grid">
            <div ref={leftRef} className={`map-frame reveal-left${leftVisible ? ' visible' : ''}`}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3361.678214961768!2d74.04985250952028!3d32.58810477363364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391f1ab545de0947%3A0x19f9b9caa6ba6177!2sFalak%20Marriage%20Hall!5e0!3m2!1sen!2s!4v1772830377925!5m2!1sen!2s"
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="Falak Marriage Hall Location"
              />
            </div>

            <div ref={rightRef} className={`contact-details reveal-right${rightVisible ? ' visible' : ''}`}>
              {contactItems.map((item) => (
                <div className="contact-item" key={item.label}>
                  <div className="contact-item-icon"><i className={item.icon} /></div>
                  <div>
                    <span className="contact-item-label">{item.label}</span>
                    {item.href ? (
                      <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                        className="contact-item-value"
                        style={{ display: 'block', color: 'var(--text)', transition: 'color .3s' }}
                        onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                        onMouseLeave={e => e.target.style.color = 'var(--text)'}
                      >{item.value}</a>
                    ) : (
                      <span className="contact-item-value">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
                <Link to="/booking" className="btn btn-gold" style={{ flex: 1, justifyContent: 'center', minWidth: 160 }}>
                  <i className="fas fa-calendar-check" /> Book Now
                </Link>
                <a href="https://maps.app.goo.gl/tCKXtTQEV2rjiqJs8" target="_blank" rel="noreferrer"
                  className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', minWidth: 160 }}>
                  <i className="fas fa-directions" /> Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--dark)', padding: 'clamp(60px, 8vw, 100px) 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {infoCards.map((card, i) => <InfoCard key={card.title} {...card} delay={i * 100} />)}
          </div>
        </div>
      </section>
    </div>
  )
}
