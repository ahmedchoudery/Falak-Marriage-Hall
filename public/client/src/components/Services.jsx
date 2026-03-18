import { useReveal } from '../hooks/useReveal'

const services = [
  {
    icon: 'fas fa-church',
    title: 'Wedding Ceremony',
    desc: 'Enchanting setups for your main event with premium décor, floral arrangements, and professional lighting systems.',
  },
  {
    icon: 'fas fa-palette',
    title: 'Mehndi Events',
    desc: 'Colorful and vibrant traditional arrangements that bring the magic of Mehndi nights to life.',
  },
  {
    icon: 'fas fa-glass-cheers',
    title: 'Walima Reception',
    desc: 'Sophisticated reception setups with elegant seating, fine dining, and a refined ambience.',
  },
  {
    icon: 'fas fa-utensils',
    title: 'Catering Services',
    desc: 'Gourmet menus crafted by expert chefs — from traditional one-dish spreads to luxury multi-course banquets.',
  },
  {
    icon: 'fas fa-gem',
    title: 'Luxury Decoration',
    desc: 'Exclusive floral arrangements, state-of-the-art stage designs, and bespoke theme installations.',
  },
  {
    icon: 'fas fa-camera',
    title: 'Photography & Video',
    desc: 'Professional event photography and cinematic videography to preserve your most precious memories forever.',
  },
]

export default function Services() {
  const [headRef, headVisible] = useReveal()

  return (
    <section id="services" className="services-section">
      <div className="container">
        <div
          ref={headRef}
          className={`section-title reveal${headVisible ? ' visible' : ''}`}
        >
          <span className="section-label">What We Offer</span>
          <h2>Luxury Services</h2>
          <div className="gold-divider" />
        </div>

        <div className="services-grid">
          {services.map((s, i) => (
            <ServiceCard key={s.title} {...s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ icon, title, desc, index }) {
  const [ref, visible] = useReveal({ delay: index * 80 })

  return (
    <div
      ref={ref}
      className={`service-card reveal-scale${visible ? ' visible' : ''}`}
    >
      <div className="service-icon">
        <i className={icon} />
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  )
}
