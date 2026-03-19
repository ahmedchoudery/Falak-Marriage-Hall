import { useState, useEffect } from 'react'
import anime from 'animejs'
import { useReveal } from '../hooks/useReveal'

const eventTypes = [
  'Wedding (Nikah)',
  'Walima / Reception',
  'Mehndi Night',
  'Birthday Party',
  'Corporate Event',
  'Other',
]

const halls = [
  'Main Grand Hall',
  'Garden Terrace',
  'Any Available',
]

function FormField({ label, required, error, children }) {
  return (
    <div className="form-group">
      <label>
        {label} {required && <span>*</span>}
      </label>
      {children}
      {error && (
        <span style={{ color: '#e74c3c', fontSize: '0.78rem', marginTop: 6, display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  )
}

export default function BookingPage() {
  const [formRef, formVisible] = useReveal()
  const [infoRef, infoVisible] = useReveal({ delay: 100 })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    eventDate: '', eventType: '', hall: 'Any Available',
    guests: '', message: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.name.trim())          e.name      = 'Full name is required'
    if (!form.phone.trim())         e.phone     = 'Phone number is required'
    if (!form.eventDate)            e.eventDate = 'Please select an event date'
    if (!form.eventType)            e.eventType = 'Please select event type'
    const guestsNum = Number(form.guests)
    if (!Number.isFinite(guestsNum) || guestsNum < 1) e.guests = 'Please enter estimated guest count'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok && data.success) {
        setSubmitted(true)
        
        // Construct WhatsApp message
        const waMsg = encodeURIComponent(
          `Hi, I just submitted a booking inquiry on your website!\n\n` +
          `*Name:* ${form.name}\n` +
          `*Date:* ${form.eventDate}\n` +
          `*Event:* ${form.eventType}\n` +
          `*Guests:* ${form.guests}\n` +
          `*Phone:* ${form.phone}\n` +
          (form.message ? `*Notes:* ${form.message}` : '')
        );
        const waUrl = `https://wa.me/923086891083?text=${waMsg}`;
        
        // Automatically trigger WhatsApp in a new tab
        window.open(waUrl, '_blank');

        // Animate success icon
        setTimeout(() => {
          anime({
            targets: '.form-success-icon',
            scale: [0, 1],
            opacity: [0, 1],
            duration: 600,
            easing: 'spring(1, 80, 10, 0)',
          })
        }, 50)
      } else {
        alert('Error: ' + (data.message || 'Unable to submit booking. Please try again.'))
      }
    } catch {
      alert('Network error. Please call us directly: 0308-6891083')
    } finally {
      setLoading(false)
    }
  }

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0]

  // Page entrance animation
  useEffect(() => {
    anime({
      targets: '.booking-page-title .char',
      opacity: [0, 1],
      translateY: [40, 0],
      delay: anime.stagger(40, { start: 200 }),
      easing: 'easeOutExpo',
      duration: 700,
    })
  }, [])

  const titleChars = 'Book Your Event'.split('').map((c, i) => (
    <span key={i} className="char" style={{ display: 'inline-block', opacity: 0 }}>
      {c === ' ' ? '\u00A0' : c}
    </span>
  ))

  return (
    <div className="booking-page">
      {/* Hero Header */}
      <div
        style={{
          padding: '80px 0 60px',
          textAlign: 'center',
          background: 'linear-gradient(to bottom, var(--dark-3), var(--dark-2))',
          borderBottom: '1px solid var(--gold-border)',
        }}
      >
        <div className="container">
          <span className="section-label" style={{ display: 'block', textAlign: 'center' }}>
            Reserve Your Date
          </span>
          <h1
            className="booking-page-title"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              color: 'var(--cream)',
              lineHeight: 1.1,
            }}
          >
            {titleChars}
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 16, fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.1rem' }}>
            Fill in the form below and our team will confirm within 24 hours.
          </p>
        </div>
      </div>

      {/* Form + Info grid */}
      <div className="container" style={{ padding: '80px clamp(20px, 5vw, 60px)' }}>
        <div className="booking-grid">

          {/* ── Form ── */}
          <div
            ref={formRef}
            className={`booking-form-wrap reveal-left${formVisible ? ' visible' : ''}`}
          >
            {submitted ? (
              <div className="form-success">
                <div className="form-success-icon">
                  <i className="fas fa-check" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--cream)', marginBottom: 12 }}>
                  Booking Inquiry Submitted!
                </h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: '0.95rem' }}>
                  We'll contact you any minute now on <strong style={{ color: 'var(--gold)' }}>{form.phone}</strong> to confirm your details.
                </p>
                {/* Dynamic WhatsApp Confirmation */}
                <a 
                  href={`https://wa.me/923086891083?text=${encodeURIComponent(
                    `Hi, I just submitted a booking inquiry on your website!\n\n` +
                    `*Name:* ${form.name}\n` +
                    `*Date:* ${form.eventDate}\n` +
                    `*Event:* ${form.eventType}\n` +
                    `*Guests:* ${form.guests}\n` +
                    `*Phone:* ${form.phone}\n` +
                    (form.message ? `*Notes:* ${form.message}` : '')
                  )}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn btn-gold"
                  style={{ background: '#25d366', borderColor: '#25d366', color: 'white' }}
                >
                  <i className="fab fa-whatsapp" /> Confirm on WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--cream)', marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid var(--gold-border)' }}>
                  Event Details
                </h3>

                <FormField label="Full Name" required error={errors.name}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Muhammad Ahmed"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                  />
                </FormField>

                <div className="form-row">
                  <FormField label="Phone Number" required error={errors.phone}>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="03xx-xxxxxxx"
                      value={form.phone}
                      onChange={e => set('phone', e.target.value)}
                    />
                  </FormField>
                  <FormField label="Email Address" error={errors.email}>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="optional"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                    />
                  </FormField>
                </div>

                <div className="form-row">
                  <FormField label="Event Date" required error={errors.eventDate}>
                    <input
                      type="date"
                      className="form-control"
                      min={today}
                      value={form.eventDate}
                      onChange={e => set('eventDate', e.target.value)}
                    />
                  </FormField>
                  <FormField label="Estimated Guests" required error={errors.guests}>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="e.g. 500"
                      min="1"
                      value={form.guests}
                      onChange={e => set('guests', e.target.value)}
                    />
                  </FormField>
                </div>

                <div className="form-row">
                  <FormField label="Event Type" required error={errors.eventType}>
                    <select
                      className="form-control"
                      value={form.eventType}
                      onChange={e => set('eventType', e.target.value)}
                    >
                      <option value="">Select event type…</option>
                      {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Preferred Hall" error={errors.hall}>
                    <select
                      className="form-control"
                      value={form.hall}
                      onChange={e => set('hall', e.target.value)}
                    >
                      {halls.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </FormField>
                </div>

                <FormField label="Your Requirements / Message" error={errors.message}>
                  <textarea
                    className="form-control"
                    rows={5}
                    placeholder="Tell us about your theme preferences, catering needs, special requests…"
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    style={{ resize: 'vertical' }}
                  />
                </FormField>

                <button
                  type="submit"
                  className={`btn btn-gold${loading ? ' is-loading' : ''}`}
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', padding: '16px 0', letterSpacing: '0.2em' }}
                >
                  {loading ? (
                    <><i className="fas fa-circle-notch fa-spin" /> Submitting…</>
                  ) : (
                    <><i className="fas fa-paper-plane" /> Submit Booking Inquiry</>
                  )}
                </button>

                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 16 }}>
                  We'll call you on your given Contact. We'll confirm within 24 hours. For urgent booking, call{' '}
                  <a href="tel:+923086891083" style={{ color: 'var(--gold)' }}>0308-6891083</a>
                </p>
              </form>
            )}
          </div>

          {/* ── Info Panel ── */}
          <div
            ref={infoRef}
            className={`booking-info reveal-right${infoVisible ? ' visible' : ''}`}
          >
            <div className="booking-info-card">
              <h3>Premium Experience</h3>
              <div className="info-feature">
                <i className="fas fa-gem" />
                <div>
                  <strong>Luxury Ambience</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '0.83rem' }}>Grand halls with exquisite lighting and exclusive décor for every occasion.</p>
                </div>
              </div>
              <div className="info-feature">
                <i className="fas fa-utensils" />
                <div>
                  <strong>Custom Catering</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '0.83rem' }}>Gourmet menus prepared by expert chefs, tailored to your preferences.</p>
                </div>
              </div>
              <div className="info-feature">
                <i className="fas fa-camera" />
                <div>
                  <strong>Full Management</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '0.83rem' }}>Photography, stage, sound, and coordination — all in one place.</p>
                </div>
              </div>
              <div className="info-feature">
                <i className="fas fa-shield-alt" />
                <div>
                  <strong>Secure & Trusted</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '0.83rem' }}>Over 1,500 successful events with 5-star client satisfaction.</p>
                </div>
              </div>
            </div>

            <div className="booking-info-card">
              <h3>Quick Contact</h3>
              <a
                href="tel:+923086891083"
                className="btn btn-gold"
                style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }}
              >
                <i className="fas fa-phone" /> Call: 0308-6891083
              </a>
              <a
                href="https://wa.me/923086891083"
                target="_blank"
                rel="noreferrer"
                className="btn"
                style={{ width: '100%', justifyContent: 'center', background: '#25d366', borderColor: '#25d366', color: 'white' }}
              >
                <i className="fab fa-whatsapp" /> WhatsApp Chat
              </a>
            </div>

            <div className="booking-info-card" style={{ background: 'var(--dark-3)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                "Submit your inquiry above and our event experts will contact you within 24 hours to plan your perfect day."
              </p>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--gold-border)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                  — Falak Hall & Events Team
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
