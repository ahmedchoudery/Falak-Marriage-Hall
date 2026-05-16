'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { to: '/#home', label: 'Home' },
  { to: '/#about', label: 'About' },
  { to: '/#services', label: 'Services' },
  { to: '/#gallery', label: 'Gallery' },
  { to: '/#packages', label: 'Packages' },
  { to: '/#menu-builder', label: 'Menu' },
  { to: '/#availability', label: 'Calendar' },
  { to: '/contact', label: 'Contact', page: true },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
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
    
    const el = document.getElementById(hash)
    if (el) {
      e.preventDefault()
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' })
      setMenuOpen(false)
    }
  }

  const isActive = (to) => pathname === to

  return (
    <>
      <nav className={`navbar${scrolled || pathname !== '/' ? ' scrolled' : ''}`}>
        <div className="container nav-inner">
          <Link href="/" className="nav-logo">FALAK HALL</Link>

          {/* Desktop links */}
          <ul className="nav-links">
            {links.map((l) =>
              l.page ? (
                <li key={l.to}>
                  <Link href={l.to} className={isActive(l.to) ? 'active' : ''}>
                    {l.label}
                  </Link>
                </li>
              ) : (
                <li key={l.to}>
                  <Link href={l.to} onClick={(e) => handleAnchorLink(e, l.to)}>{l.label}</Link>
                </li>
              )
            )}

            {/* Admin link — visible in nav */}
            <li>
              <Link
                href="/admin"
                className={isActive('/admin') ? 'active' : ''}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <i className="fas fa-user-shield" style={{ fontSize: '0.75rem' }} />
                Admin
              </Link>
            </li>
          </ul>

          <Link href="/booking" className="nav-cta">Book Now</Link>

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
                <Link href={l.to} onClick={() => setMenuOpen(false)}>{l.label}</Link>
              ) : (
                <Link href={l.to} onClick={(e) => { handleAnchorLink(e, l.to); setMenuOpen(false) }}>
                  {l.label}
                </Link>
              )}
            </li>
          ))}
          {/* Admin in mobile menu */}
          <li>
            <Link href="/admin" onClick={() => setMenuOpen(false)}
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