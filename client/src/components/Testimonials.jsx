import { useEffect, useRef } from 'react'
import { useReveal } from '../hooks/useReveal'

const testimonials = [
  {
    name: 'Muhammad Ahmed',
    event: 'Wedding Ceremony',
    text: 'Falak Marriage Hall made our wedding absolutely unforgettable. The decoration, the food, and the staff professionalism were beyond our expectations. Every single detail was perfect.',
    stars: 5,
  },
  {
    name: 'Zeeshan Malik',
    event: 'Walima Reception',
    text: 'The most premium venue in Gujrat. Their one-window solution saved us from so much planning stress. A highly professional team that truly cares about your happiness.',
    stars: 5,
  },
  {
    name: 'Fatima Sheikh',
    event: 'Mehndi Event',
    text: 'Exceptional food and stunning ambience. Our guests are still talking about the beautiful stage decoration and the magical lighting. We could not have chosen a better venue.',
    stars: 5,
  },
  {
    name: 'Ali Raza',
    event: 'Wedding + Walima',
    text: 'We booked both our wedding and walima here. The team handled everything flawlessly. The Royal Package truly lived up to its name — a regal experience from start to finish.',
    stars: 5,
  },
]

export default function Testimonials() {
  const swiperRef = useRef(null)
  const [headRef, headVisible] = useReveal()

  useEffect(() => {
    let swiper
    import('swiper').then(({ Swiper }) => {
      import('swiper/css').catch(() => {})
      swiper = new Swiper(swiperRef.current, {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        autoplay: { delay: 4500, disableOnInteraction: false },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 2 },
        },
      })
    })
    return () => swiper?.destroy?.()
  }, [])

  return (
    <section className="testimonials-section">
      <div className="container">
        <div
          ref={headRef}
          className={`section-title reveal${headVisible ? ' visible' : ''}`}
        >
          <span className="section-label">Happy Couples</span>
          <h2>What Our Guests Say</h2>
          <div className="gold-divider" />
        </div>

        <div ref={swiperRef} className="swiper testimonial-swiper">
          <div className="swiper-wrapper">
            {testimonials.map((t, i) => (
              <div className="swiper-slide" key={i}>
                <div className="testimonial-card">
                  <div className="testimonial-stars">
                    {'★'.repeat(t.stars)}
                  </div>
                  <p className="testimonial-text">{t.text}</p>
                  <div>
                    <div className="testimonial-author">{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                      {t.event}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="swiper-pagination" style={{ marginTop: 32, position: 'relative' }} />
        </div>
      </div>
    </section>
  )
}
