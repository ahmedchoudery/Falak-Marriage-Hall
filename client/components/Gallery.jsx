'use client'

import { useEffect, useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import Image from 'next/image'

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

  // Close lightbox on ESC
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null) }
    if (lightbox) {
      window.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox])

  return (
    <section id="gallery" className="gallery-section">
      <div className="container">
        <div
          ref={headRef}
          className={`section-header reveal${headVisible ? ' visible' : ''}`}
        >
          <span className="section-label">Moments of Perfection</span>
          <h2>Our <span>Gallery</span></h2>
          <p className="section-subtitle">
            A glimpse into the luxury and elegance we bring to every celebration at Falak Hall.
          </p>
        </div>
      </div>

      <div className="gallery-ticker-wrap">
        {/* Row 1 — scrolls left */}
        <div className="gallery-ticker gallery-ticker--left">
          {[...images, ...images].map((img, i) => (
            <GalleryItem key={`r1-${i}`} img={img} onClick={() => setLightbox(img)} />
          ))}
        </div>

        {/* Row 2 — scrolls right */}
        <div className="gallery-ticker gallery-ticker--right" style={{ marginTop: '16px' }}>
          {[...images.slice(2), ...images, ...images.slice(0, 2)].map((img, i) => (
            <GalleryItem key={`r2-${i}`} img={img} onClick={() => setLightbox(img)} />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox ? (
        <div className="gallery-lightbox" onClick={() => setLightbox(null)}>
          <button className="gallery-close" aria-label="Close Gallery"><i className="fas fa-times" /></button>
          <div className="gallery-lightbox-content" onClick={e => e.stopPropagation()}>
            <div className="lightbox-img-wrapper">
              <Image 
                src={lightbox.src} 
                alt={lightbox.alt} 
                fill 
                className="lightbox-img"
              />
            </div>
            <div className="lightbox-caption">{lightbox.alt}</div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function GalleryItem({ img, onClick }) {
  return (
    <div className="gallery-slide" onClick={onClick}>
      <Image 
        src={img.src} 
        alt={img.alt} 
        width={400} 
        height={300} 
        className="gallery-img"
      />
      <div className="gallery-overlay">
        <div className="gallery-overlay-icon">
          <i className="fas fa-expand" />
        </div>
      </div>
    </div>
  )
}
