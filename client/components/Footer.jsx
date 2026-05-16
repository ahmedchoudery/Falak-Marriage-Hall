import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <Link href="/" className="footer-brand-logo">FALAK HALL</Link>
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
              <li><Link href="/#home">Home</Link></li>
              <li><Link href="/#about">About Us</Link></li>
              <li><Link href="/#services">Services</Link></li>
              <li><Link href="/#gallery">Gallery</Link></li>
              <li><Link href="/booking">Online Booking</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h4>Our Services</h4>
            <ul className="footer-links">
              <li><Link href="/#services">Wedding Ceremony</Link></li>
              <li><Link href="/#services">Mehndi Events</Link></li>
              <li><Link href="/#services">Walima Reception</Link></li>
              <li><Link href="/#services">Luxury Catering</Link></li>
              <li><Link href="/#services">Stage Decoration</Link></li>
              <li><Link href="/#services">Photography</Link></li>
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

    </footer>
  )
}
