import { useReveal } from '../hooks/useReveal'
import { Link } from 'react-router-dom'

const features = [
  'Professional Management',
  'Luxury Decoration',
  'Full AC Coverage',
  'Gourmet Catering',
  'Secure Parking',
  'Photography Services',
]

export default function About() {
  const [imgRef, imgVisible]   = useReveal()
  const [textRef, textVisible] = useReveal({ delay: 150 })

  return (
    <section id="about" style={{ background: 'var(--dark)', padding: 'clamp(80px, 10vw, 130px) 0' }}>
      <div className="container">
        <div className="about-grid">

          {/* Image Stack */}
          <div
            ref={imgRef}
            className={`about-image-stack reveal-left${imgVisible ? ' visible' : ''}`}
          >
            <img
              src="/images/2.jpeg"
              alt="Falak Hall exterior"
              className="about-img-main"
            />
            <img
              src="/images/1.jpeg"
              alt="Hall building"
              className="about-img-secondary"
            />
            <div className="about-badge">
              <div className="about-badge-ring" />
              <span className="about-badge-num">10+</span>
              <span className="about-badge-text">Years<br/>of Excellence</span>
            </div>
          </div>

          {/* Text */}
          <div
            ref={textRef}
            className={`about-text reveal-right${textVisible ? ' visible' : ''}`}
          >
            <span className="section-label">About Falak Hall</span>
            <h2>Creating Unforgettable Wedding Celebrations</h2>
            <p>
              Located in the heart of Gujrat on Main GT Road, Falak Marriage Hall stands as a
              symbol of elegance and royal hospitality. With over a decade of experience organizing
              premium events, we deliver a seamless one-window solution for your most precious moments.
            </p>
            <p>
              From enchanting stage designs to gourmet catering, our dedicated team ensures that
              every detail of your celebration is handled with perfection and care.
            </p>

            <div className="about-features">
              {features.map((f) => (
                <div className="about-feature" key={f}>
                  <i className="fas fa-check-circle" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/booking" className="btn btn-gold">Book a Visit</Link>
              <Link to="/contact" className="btn btn-outline">Get In Touch</Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
