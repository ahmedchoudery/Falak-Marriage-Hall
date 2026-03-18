import { Link } from 'react-router-dom'

export default function ParallaxBanner({ image = '/images/gallery_1.png', children }) {
  return (
    <section
      className="parallax-banner"
      style={{ backgroundImage: `url('${image}')` }}
    >
      {children ?? (
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <span className="section-label" style={{ justifyContent: 'center', display: 'block' }}>
            Celebrate
          </span>
          <h2>Your Dream Day Deserves the Finest Stage</h2>
          <p style={{ margin: '16px 0 36px' }}>
            Experience royal hospitality and breathtaking décor tailored to your vision.
          </p>
          <Link to="/booking" className="btn btn-gold">
            <i className="fas fa-calendar-check" /> Reserve Your Date
          </Link>
        </div>
      )}
    </section>
  )
}
