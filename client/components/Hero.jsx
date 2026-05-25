'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <section id="home" className="hero">
      {/* Background image with slow Ken Burns zoom */}
      <div className="hero-bg">
        <img
          src="/images/hero_bg.png"
          alt="Falak Marriage Hall interior"
          className="hero-bg-image"
        />
      </div>

      {/* Dark gradient overlay for text readability */}
      <div className="hero-overlay" />

      {/* Content */}
      <div className="hero-content">
        <div className="hero-divider-top" />
        <span className="hero-label">Gujrat&#39;s Most Premium Wedding Venue</span>
        <h1 className="hero-title">Falak Marriage Hall</h1>
        <p className="hero-subtitle">Where Beautiful Wedding Memories Begin</p>
        <div className="hero-btns">
          <Link href="/booking" className="btn btn-gold">
            <i className="fas fa-calendar-check" /> Book Your Event
          </Link>
          <a href="#gallery" className="btn btn-outline">
            <i className="fas fa-images" /> View Gallery
          </a>
        </div>
      </div>

    </section>
  )
}
