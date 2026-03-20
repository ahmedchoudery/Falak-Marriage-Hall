import { useState, useMemo } from 'react'
import { useReveal } from '../hooks/useReveal'
import { Link } from 'react-router-dom'

/* ── Menu Data ──────────────────────────────────────────── */
const CATEGORIES = [
  {
    id: 'starters',
    label: 'Starters',
    icon: 'fas fa-seedling',
    items: [
      { id: 's1', name: 'Chicken Malai Boti', price: 80 },
      { id: 's2', name: 'Seekh Kabab', price: 60 },
      { id: 's3', name: 'Fish Tikka', price: 120 },
      { id: 's4', name: 'Paneer Tikka', price: 70 },
      { id: 's5', name: 'Mutton Chapli Kabab', price: 100 },
      { id: 's6', name: 'Dahi Bhallé', price: 40 },
    ],
  },
  {
    id: 'mains',
    label: 'Main Course',
    icon: 'fas fa-utensils',
    items: [
      { id: 'm1', name: 'Chicken Qorma', price: 0 },
      { id: 'm2', name: 'Mutton Karahi', price: 150 },
      { id: 'm3', name: 'Chicken Biryani', price: 0 },
      { id: 'm4', name: 'Mutton Pulao', price: 120 },
      { id: 'm5', name: 'Butter Chicken', price: 80 },
      { id: 'm6', name: 'Beef Nihari', price: 100 },
      { id: 'm7', name: 'Dal Makhni', price: 0 },
      { id: 'm8', name: 'Mixed Vegetables', price: 0 },
    ],
  },
  {
    id: 'rice',
    label: 'Rice & Bread',
    icon: 'fas fa-bread-slice',
    items: [
      { id: 'r1', name: 'Zeera Rice', price: 0 },
      { id: 'r2', name: 'Kabuli Pulao', price: 80 },
      { id: 'r3', name: 'Naan', price: 0 },
      { id: 'r4', name: 'Garlic Naan', price: 30 },
      { id: 'r5', name: 'Roghni Naan', price: 20 },
    ],
  },
  {
    id: 'desserts',
    label: 'Desserts',
    icon: 'fas fa-ice-cream',
    items: [
      { id: 'd1', name: 'Gulab Jamun', price: 0 },
      { id: 'd2', name: 'Kheer', price: 30 },
      { id: 'd3', name: 'Jalebi', price: 20 },
      { id: 'd4', name: 'Ice Cream Station', price: 100 },
      { id: 'd5', name: 'Fruit Chaat', price: 40 },
    ],
  },
  {
    id: 'drinks',
    label: 'Beverages',
    icon: 'fas fa-mug-hot',
    items: [
      { id: 'b1', name: 'Doodh Patti Chai', price: 0 },
      { id: 'b2', name: 'Green Tea', price: 20 },
      { id: 'b3', name: 'Fresh Juices Bar', price: 80 },
      { id: 'b4', name: 'Soft Drinks', price: 50 },
      { id: 'b5', name: 'Lassi Station', price: 60 },
    ],
  },
]

const PACKAGES = [
  {
    id: 'silver',
    name: 'Silver',
    tier: 'Standard',
    basePrice: 1200,
    perHead: 'per head',
    includedDishes: 1,
    desc: 'A dignified celebration with essential catering.',
    defaults: ['m1', 'r1', 'r3', 'd1', 'b1'],
  },
  {
    id: 'gold',
    name: 'Gold',
    tier: 'Premium',
    basePrice: 1800,
    perHead: 'per head',
    includedDishes: 3,
    desc: 'Our most popular — luxury catering with gourmet selections.',
    defaults: ['s1', 'm1', 'm3', 'r1', 'r3', 'd1', 'b1'],
    featured: true,
    badge: 'Most Popular',
  },
  {
    id: 'royal',
    name: 'Royal',
    tier: 'VIP Royal',
    basePrice: 2800,
    perHead: 'per head',
    includedDishes: 5,
    desc: 'An uncompromising royal feast for the finest celebrations.',
    defaults: ['s1', 's2', 'm1', 'm2', 'm3', 'm7', 'r1', 'r2', 'r3', 'd1', 'd2', 'b1', 'b3'],
  },
]

/* ── Helper: find item by ID ── */
const allItems = CATEGORIES.flatMap(c => c.items)
const findItem = (id) => allItems.find(i => i.id === id)

/* ── Component ──────────────────────────────────────────── */
export default function MenuBuilder() {
  const [headRef, headVisible] = useReveal()
  const [selectedPkg, setSelectedPkg] = useState('gold')
  const [selectedItems, setSelectedItems] = useState(
    () => new Set(PACKAGES.find(p => p.id === 'gold').defaults)
  )
  const [guests, setGuests] = useState(300)
  const [activeCategory, setActiveCategory] = useState('mains')

  const pkg = PACKAGES.find(p => p.id === selectedPkg)

  /* Switch package → reset to its defaults */
  const selectPackage = (pkgId) => {
    const p = PACKAGES.find(pp => pp.id === pkgId)
    setSelectedPkg(pkgId)
    setSelectedItems(new Set(p.defaults))
  }

  /* Toggle a dish */
  const toggleItem = (itemId) => {
    setSelectedItems(prev => {
      const next = new Set(prev)
      if (next.has(itemId)) next.delete(itemId)
      else next.add(itemId)
      return next
    })
  }

  /* ── Price Calculation ── */
  const pricing = useMemo(() => {
    let extraPerHead = 0
    selectedItems.forEach(id => {
      const item = findItem(id)
      if (item) extraPerHead += item.price
    })
    const totalPerHead = pkg.basePrice + extraPerHead
    const estimatedTotal = totalPerHead * guests
    return { extraPerHead, totalPerHead, estimatedTotal }
  }, [selectedItems, pkg, guests])

  const formatPrice = (n) => `PKR ${n.toLocaleString()}`

  return (
    <section id="menu-builder" className="menu-builder-section">
      <div className="container">
        {/* ── Header ── */}
        <div
          ref={headRef}
          className={`section-title reveal${headVisible ? ' visible' : ''}`}
        >
          <span className="section-label">Customize Your Feast</span>
          <h2>Interactive Menu Builder</h2>
          <div className="gold-divider" />
          <p className="menu-builder-subtitle">
            Select a package, customize your dishes, and get an instant price estimate for your dream event.
          </p>
        </div>

        {/* ── Package Selector ── */}
        <div className="mb-pkg-selector">
          {PACKAGES.map(p => (
            <button
              key={p.id}
              className={`mb-pkg-btn${selectedPkg === p.id ? ' active' : ''}${p.featured ? ' featured' : ''}`}
              onClick={() => selectPackage(p.id)}
            >
              {p.badge && <span className="mb-pkg-badge">{p.badge}</span>}
              <span className="mb-pkg-tier">{p.tier}</span>
              <span className="mb-pkg-name">{p.name}</span>
              <span className="mb-pkg-price">{formatPrice(p.basePrice)}<small>/{p.perHead}</small></span>
            </button>
          ))}
        </div>

        {/* ── Main Builder Area ── */}
        <div className="mb-builder">
          {/* Left: Category tabs + dish list */}
          <div className="mb-dishes">
            <div className="mb-cat-tabs">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`mb-cat-tab${activeCategory === cat.id ? ' active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <i className={cat.icon} />
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="mb-dish-grid">
              {CATEGORIES.find(c => c.id === activeCategory)?.items.map(item => {
                const isSelected = selectedItems.has(item.id)
                const isDefault = pkg.defaults.includes(item.id)
                return (
                  <button
                    key={item.id}
                    className={`mb-dish-card${isSelected ? ' selected' : ''}${isDefault ? ' default' : ''}`}
                    onClick={() => toggleItem(item.id)}
                  >
                    <span className="mb-dish-check">
                      <i className={isSelected ? 'fas fa-check-circle' : 'far fa-circle'} />
                    </span>
                    <span className="mb-dish-name">{item.name}</span>
                    <span className="mb-dish-price">
                      {item.price === 0 ? (
                        <span className="mb-included">Included</span>
                      ) : (
                        `+${formatPrice(item.price)}`
                      )}
                    </span>
                    {isDefault && <span className="mb-dish-default-tag">Default</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right: Summary panel */}
          <div className="mb-summary">
            <div className="mb-summary-card">
              <h3 className="mb-summary-title">
                <i className="fas fa-receipt" /> Your Estimate
              </h3>

              {/* Guest slider */}
              <div className="mb-guest-control">
                <label>Number of Guests</label>
                <div className="mb-guest-slider-row">
                  <input
                    type="range"
                    min="50"
                    max="1500"
                    step="50"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="mb-slider"
                  />
                  <span className="mb-guest-count">{guests}</span>
                </div>
              </div>

              {/* Selected package */}
              <div className="mb-summary-row">
                <span>Package</span>
                <strong className="mb-gold">{pkg.name} ({pkg.tier})</strong>
              </div>
              <div className="mb-summary-row">
                <span>Base Rate</span>
                <span>{formatPrice(pkg.basePrice)} /head</span>
              </div>
              <div className="mb-summary-row">
                <span>Add-ons</span>
                <span>{pricing.extraPerHead > 0 ? `+${formatPrice(pricing.extraPerHead)}` : '—'}</span>
              </div>

              <div className="mb-summary-divider" />

              <div className="mb-summary-row mb-total-row">
                <span>Total / Head</span>
                <strong className="mb-gold">{formatPrice(pricing.totalPerHead)}</strong>
              </div>

              <div className="mb-summary-grand">
                <span>Estimated Grand Total</span>
                <strong>{formatPrice(pricing.estimatedTotal)}</strong>
              </div>

              {/* Selected dishes list */}
              <div className="mb-selected-list">
                <h4>{selectedItems.size} dishes selected</h4>
                <ul>
                  {[...selectedItems].map(id => {
                    const item = findItem(id)
                    return item ? (
                      <li key={id}>
                        <span>{item.name}</span>
                        <span className="mb-dish-li-price">
                          {item.price === 0 ? 'Included' : `+${formatPrice(item.price)}`}
                        </span>
                      </li>
                    ) : null
                  })}
                </ul>
              </div>

              <Link
                to="/booking"
                className="btn btn-gold mb-book-btn"
              >
                <i className="fas fa-calendar-check" /> Book This Menu
              </Link>

              <p className="mb-disclaimer">
                * Prices are estimates. Final pricing confirmed after consultation with our events team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
