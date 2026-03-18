import { useReveal } from '../hooks/useReveal'
import { Link } from 'react-router-dom'

const packages = [
  {
    tier: 'Standard',
    name: 'Silver',
    desc: 'A complete and dignified celebration for intimate gatherings.',
    features: [
      'Hall decoration & setup',
      'Basic sound system',
      'Standard seating for 300',
      'One-dish catering',
      'Parking management',
      'Event coordinator',
    ],
    featured: false,
  },
  {
    tier: 'Premium',
    name: 'Gold',
    desc: 'Our most popular package — the perfect balance of luxury and value.',
    features: [
      'Luxury floral decoration',
      'Professional lighting setup',
      'Full AC hall for 500 guests',
      'Gourmet 3-dish catering',
      'Sound & DJ management',
      'Dedicated event manager',
      'Complimentary cake',
    ],
    featured: true,
    badge: 'Most Popular',
  },
  {
    tier: 'VIP Royal',
    name: 'Royal',
    desc: 'An uncompromising royal experience for those who demand the very best.',
    features: [
      'Regal stage & custom sets',
      'Professional photography',
      'Cinematic videography',
      'Five-star multi-course menu',
      'Bridal suite access',
      'Fireworks arrangement',
      'VIP guest lounge',
    ],
    featured: false,
  },
]

export default function Packages() {
  const [headRef, headVisible] = useReveal()

  return (
    <section id="packages" className="packages-section">
      <div className="container">
        <div
          ref={headRef}
          className={`section-title reveal${headVisible ? ' visible' : ''}`}
        >
          <span className="section-label">Tailored For You</span>
          <h2>Wedding Packages</h2>
          <div className="gold-divider" />
          <p style={{ color: 'var(--text-muted)', marginTop: 20, fontSize: '0.95rem' }}>
            Every package includes our signature royal hospitality and full event coordination.
          </p>
        </div>

        <div className="packages-grid">
          {packages.map((pkg, i) => (
            <PackageCard key={pkg.name} {...pkg} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PackageCard({ tier, name, desc, features, featured, badge, index }) {
  const [ref, visible] = useReveal({ delay: index * 120 })

  return (
    <div
      ref={ref}
      className={`package-card reveal${visible ? ' visible' : ''}${featured ? ' featured' : ''}`}
    >
      {badge && <div className="package-badge">{badge}</div>}
      <div className="package-tier">{tier}</div>
      <div className="package-name">{name} Package</div>
      <p className="package-desc">{desc}</p>

      <ul className="package-features">
        {features.map((f) => (
          <li key={f}>
            <i className={featured ? 'fas fa-star' : 'fas fa-check'} />
            {f}
          </li>
        ))}
      </ul>

      <Link
        to="/booking"
        className={`btn ${featured ? 'btn-gold' : 'btn-outline'}`}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        Select Package
      </Link>
    </div>
  )
}
