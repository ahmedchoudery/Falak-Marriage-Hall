import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <Link to="/" className="footer-brand-logo">FALAK HALL</Link>
            <p className="footer-brand-desc">
              The premier wedding venue in Gujrat, dedicated to providing luxury, elegance,
              and unforgettable memories for your most precious day.
            </p>
            <div className="footer-socials">
              <a href="#" className="footer-social-btn" aria-label="Facebook">
                <i className="fab fa-facebook-f" />
              </a>
              <a href="#" className="footer-social-btn" aria-label="Instagram">
                <i className="fab fa-instagram" />
              </a>
              <a href="#" className="footer-social-btn" aria-label="TikTok">
                <i className="fab fa-tiktok" />
              </a>
              <a href="https://wa.me/923086891083" className="footer-social-btn" aria-label="WhatsApp" target="_blank" rel="noreferrer">
                <i className="fab fa-whatsapp" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/#home">Home</a></li>
              <li><a href="/#about">About Us</a></li>
              <li><a href="/#services">Services</a></li>
              <li><a href="/#gallery">Gallery</a></li>
              <li><Link to="/booking">Online Booking</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h4>Our Services</h4>
            <ul className="footer-links">
              <li><a href="/#services">Wedding Ceremony</a></li>
              <li><a href="/#services">Mehndi Events</a></li>
              <li><a href="/#services">Walima Reception</a></li>
              <li><a href="/#services">Luxury Catering</a></li>
              <li><a href="/#services">Stage Decoration</a></li>
              <li><a href="/#services">Photography</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact Us</h4>
            <div className="footer-contact-item">
              <i className="fas fa-map-marker-alt" />
              <span>GT Road, Service Mor, Gujrat 50700, Punjab, Pakistan</span>
            </div>
            <div className="footer-contact-item">
              <i className="fas fa-phone" />
              <a href="tel:+923086891083" style={{ color: 'inherit', transition: 'color .3s' }}>
                0308-6891083
              </a>
            </div>
            <div className="footer-contact-item">
              <i className="fas fa-envelope" />
              <a href="mailto:info@falakhall.com" style={{ color: 'inherit', transition: 'color .3s' }}>
                info@falakhall.com
              </a>
            </div>
            <div className="footer-contact-item">
              <i className="fas fa-clock" />
              <span>Daily: 9:00 AM – 11:00 PM</span>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <span>&copy; {year} Falak Marriage Hall. All Rights Reserved.</span>
          <span>Designed with Excellence · Gujrat, Pakistan</span>
        </div>
      </div>

      {/* WhatsApp Float */}
      <a
        href="https://wa.me/923086891083"
        className="whatsapp-float"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <i className="fab fa-whatsapp" />
      </a>
      <a href="/admin" style={{ position: 'fixed', bottom: 8, left: 8, fontSize: '0.55rem', opacity: 0.15, color: 'var(--text-muted)' }}>
        Admin
      </a>
    </footer>
  )
}
