'use client'

import { useReveal } from '../hooks/useReveal'
import Link from 'next/link'
import Image from 'next/image'

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
    <section id="about" className="about-section">
      <div className="container">
        <div className="about-grid">

          {/* Image Stack */}
          <div
            ref={imgRef}
            className={`about-image-stack reveal-left${imgVisible ? ' visible' : ''}`}
          >
            <div className="about-img-main-wrapper">
              <Image
                src="/images/2.jpeg"
                alt="Falak Hall exterior"
                width={600}
                height={450}
                className="about-img-main"
                priority={false}
              />
            </div>
            <div className="about-img-secondary-wrapper">
              <Image
                src="/images/1.jpeg"
                alt="Hall building"
                width={400}
                height={300}
                className="about-img-secondary"
                priority={false}
              />
            </div>
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

            <div className="about-actions">
              <Link href="/booking" className="btn btn-gold">
                <span>Book a Visit</span>
                <i className="fas fa-calendar-check" />
              </Link>
              <Link href="/contact" className="btn btn-outline">
                <span>Get In Touch</span>
                <i className="fas fa-envelope" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
