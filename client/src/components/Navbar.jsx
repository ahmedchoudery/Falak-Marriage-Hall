import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const links = [
  { to: '/#home', label: 'Home' },
  { to: '/#about', label: 'About' },
  { to: '/#services', label: 'Services' },
  { to: '/#gallery', label: 'Gallery' },
  { to: '/#packages', label: 'Packages' },
  { to: '/#availability', label: 'Calendar' },
  { to: '/contact', label: 'Contact', page: true },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      const el = document.documentElement
      const sc = el.scrollTop || document.body.scrollTop
      const height = el.scrollHeight - el.clientHeight
      setProgress(height > 0 ? (sc / height) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  const handleAnchorLink = (e, to) => {
    if (!to.includes('#')) return
    const [, hash] = to.split('#')
    if (pathname !== '/') return
    e.preventDefault()
    const el = document.getElementById(hash)
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' })
      setMenuOpen(false)
    }
  }

  return (
    <>
      {/* Scroll progress bar */}
      <div className="progress-bar" style={{ width: `${progress}%` }} />

      <nav className={`navbar${scrolled || pathname !== '/' ? ' scrolled' : ''}`}>
        <div className="container nav-inner">
          <Link to="/" className="nav-logo">
            <img src="/images/falak-logo.svg" alt="Falak Hall" />
          </Link>

          {/* Desktop links */}
          <ul className="nav-links">
            {links.map((l) =>
              l.page ? (
                <li key={l.to}>
                  <NavLink to={l.to} className={({ isActive }) => isActive ? 'active' : ''}>
                    {l.label}
                  </NavLink>
                </li>
              ) : (
                <li key={l.to}>
                  <a href={l.to} onClick={(e) => handleAnchorLink(e, l.to)}>{l.label}</a>
                </li>
              )
            )}

            {/* Admin link — visible in nav */}
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) => isActive ? 'active' : ''}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <i className="fas fa-user-shield" style={{ fontSize: '0.75rem' }} />
                Admin
              </NavLink>
            </li>
          </ul>

          <Link to="/booking" className="nav-cta">Book Now</Link>

          {/* Hamburger */}
          <button
            className={`nav-hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`mobile-overlay${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile menu */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <ul>
          {links.map((l) => (
            <li key={l.to}>
              {l.page ? (
                <Link to={l.to} onClick={() => setMenuOpen(false)}>{l.label}</Link>
              ) : (
                <a href={l.to} onClick={(e) => { handleAnchorLink(e, l.to); setMenuOpen(false) }}>
                  {l.label}
                </a>
              )}
            </li>
          ))}
          {/* Admin in mobile menu */}
          <li>
            <Link to="/admin" onClick={() => setMenuOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <i className="fas fa-user-shield" style={{ color: 'var(--gold)', fontSize: '1rem' }} />
              Admin
            </Link>
          </li>
        </ul>

        <div style={{ marginTop: 48, paddingTop: 40, borderTop: '1px solid var(--gold-border)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>Contact</p>
          <a href="tel:+923086891083" style={{ color: 'var(--gold)', fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>
            0308-6891083
          </a>
        </div>
      </div>

      {/* Sticky CTA bar (shows after scroll) */}
      <div className={`sticky-cta${scrolled ? ' visible' : ''}`}>
        <a href="tel:+923086891083" className="sticky-cta-btn">
          <i className="fas fa-phone" /> Call Now
        </a>
        <a href="https://wa.me/923086891083" target="_blank" rel="noreferrer" className="sticky-cta-btn">
          <i className="fab fa-whatsapp" /> WhatsApp Booking
        </a>
      </div>
    </>
  )
}