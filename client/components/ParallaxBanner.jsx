import Link from 'next/link'

export default function ParallaxBanner({ image = '/images/gallery_1.png', children = null }) {
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
          <p style={{ margin: '16px auto 36px', maxWidth: '600px', textAlign: 'center' }}>
            Experience royal hospitality and breathtaking décor tailored to your vision.
          </p>
          <Link href="/booking" className="btn btn-gold">
            <i className="fas fa-calendar-check" /> Reserve Your Date
          </Link>
        </div>
      )}
    </section>
  )
}
