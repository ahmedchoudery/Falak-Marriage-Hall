import { useEffect, useRef, useState } from 'react'
import { useReveal } from '../hooks/useReveal'

const images = [
  { src: '/images/gallery_1.png', alt: 'Grand stage decoration' },
  { src: '/images/gallery_2.png', alt: 'Elegant seating arrangement' },
  { src: '/images/gallery_3.png', alt: 'Premium lighting ambience' },
  { src: '/images/gallery_4.png', alt: 'Royal stage setup' },
  { src: '/images/gallery_5.png', alt: 'Dessert station' },
  { src: '/images/hero_bg.png',   alt: 'Main hall overview' },
  { src: '/images/1.jpeg',        alt: 'Hall architecture' },
  { src: '/images/2.jpeg',        alt: 'Hall entrance' },
]

export default function Gallery() {
  const [headRef, headVisible] = useReveal()
  const [lightbox, setLightbox] = useState(null)
  const track1Ref = useRef(null)
  const track2Ref = useRef(null)
  const animRef1  = useRef(null)
  const animRef2  = useRef(null)

  // Split images into two rows
  const row1 = images.slice(0, 4)
  const row2 = images.slice(4)

  // Infinite scroll ticker (CSS approach via inline style animation)
  useEffect(() => {
    // Use CSS animation for smooth infinite scroll — no JS loop needed
  }, [])

  // Close lightbox on ESC
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <section id="gallery" className="gallery-section">
      <div className="container">
        <div
          ref={headRef}
          className={`section-title reveal${headVisible ? ' visible' : ''}`}
        >
          <span className="section-label">Our Portfolio</span>
          <h2>Moments at Falak</h2>
          <div className="gold-divider" />
          <p style={{ color: 'var(--text-muted)', marginTop: 20, fontSize: '0.95rem' }}>
            Every event we host is a masterpiece. Browse our curated collection.
          </p>
        </div>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="gallery-ticker-wrap" style={{ overflow: 'hidden', marginBottom: 16 }}>
        <div className="gallery-ticker gallery-ticker--left">
          {[...images, ...images].map((img, i) => (
            <GalleryItem key={i} img={img} onClick={() => setLightbox(img)} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="gallery-ticker-wrap" style={{ overflow: 'hidden' }}>
        <div className="gallery-ticker gallery-ticker--right">
          {[...images.slice(2), ...images, ...images.slice(0, 2)].map((img, i) => (
            <GalleryItem key={i} img={img} onClick={() => setLightbox(img)} />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>
            <i className="fas fa-times" />
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <style>{`
        .gallery-ticker {
          display: flex;
          gap: 16px;
          width: max-content;
          will-change: transform;
        }
        .gallery-ticker--left {
          animation: tickerLeft 40s linear infinite;
        }
        .gallery-ticker--right {
          animation: tickerRight 45s linear infinite;
        }
        .gallery-ticker:hover { animation-play-state: paused; }

        @keyframes tickerLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes tickerRight {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  )
}

function GalleryItem({ img, onClick }) {
  return (
    <div className="gallery-slide" onClick={onClick} style={{ flexShrink: 0 }}>
      <img src={img.src} alt={img.alt} />
      <div className="gallery-overlay">
        <div className="gallery-overlay-icon">
          <i className="fas fa-expand" />
        </div>
      </div>
    </div>
  )
}
