import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'

/* ── Blog Articles Data ─────────────────────────────────── */
const ARTICLES = [
  {
    id: 'wedding-trends-2026',
    title: 'Top 7 Wedding Trends in Gujrat for 2026',
    excerpt: 'From royal stage designs to floral arches and cinematic drone coverage — discover what is trending this wedding season in Punjab.',
    category: 'Trends',
    date: '2026-03-15',
    readTime: '5 min read',
    icon: 'fas fa-crown',
    content: [
      'The wedding scene in Gujrat and across Punjab is evolving rapidly. Couples are moving beyond traditional setups to embrace modern luxury while keeping cultural roots intact.',
      '**1. Royal Stage Designs** — Grand elevated stages with crystal chandeliers and LED backdrops are replacing simple floral setups. At Falak Hall, we offer fully customizable stage designs that blend Pakistani heritage with contemporary elegance.',
      '**2. Cinematic Drone Coverage** — Aerial videography has become a must-have. Our venue\'s open garden terrace is perfect for stunning aerial shots of your baraat procession.',
      '**3. Live Food Stations** — Instead of traditional buffets, couples are opting for live cooking stations where guests can watch chefs prepare dishes like seekh kababs and hand-pulled naan.',
      '**4. Floral Arches & Installations** — Think floor-to-ceiling rose walls, marigold canopies, and jasmine-draped walkways that create an unforgettable entrance.',
      '**5. Personalized LED Monograms** — Custom LED displays featuring the couple\'s names or initials on the stage backdrop and entrance.',
      '**6. Traditional Mehndi Nights with a Modern Twist** — DJs, LED dance floors, and themed décor are transforming the classic mehndi into a full-blown party.',
      '**7. Eco-Friendly Decorations** — Sustainable florals, biodegradable confetti, and energy-efficient lighting are gaining popularity among environmentally conscious couples.',
    ],
  },
  {
    id: 'choosing-perfect-venue',
    title: 'How to Choose the Perfect Wedding Venue in Punjab',
    excerpt: 'Location, capacity, catering quality, and management — the 8 essential factors every couple must consider before booking.',
    category: 'Guide',
    date: '2026-03-10',
    readTime: '7 min read',
    icon: 'fas fa-map-marker-alt',
    content: [
      'Choosing the right wedding venue is one of the most important decisions you\'ll make. Here\'s a comprehensive guide to help you find the perfect match.',
      '**1. Location & Accessibility** — Choose a venue that\'s easy to reach for all guests. Falak Hall\'s GT Road location provides direct access from all parts of Gujrat and surrounding cities.',
      '**2. Guest Capacity** — Ensure the venue can comfortably accommodate your guest list. Our Main Grand Hall seats up to 1,500 guests with luxurious spacing.',
      '**3. Catering Excellence** — Food is the heart of any Pakistani wedding. Look for venues with in-house catering that can customize menus to your taste.',
      '**4. Decoration Flexibility** — The best venues allow you to bring your own decorator or offer premium in-house decoration packages.',
      '**5. Air Conditioning & Comfort** — Punjab summers are intense. Make sure the venue has powerful, reliable AC throughout the main hall and guest areas.',
      '**6. Parking & Valet** — With hundreds of guests, ample parking is essential. Professional valet services add a premium touch.',
      '**7. Photography-Friendly Spaces** — Look for venues with beautiful backdrops, gardens, and well-lit areas for stunning photography.',
      '**8. Professional Management** — A dedicated event coordinator can make or break your experience. Ensure the venue provides end-to-end management.',
    ],
  },
  {
    id: 'budget-planning',
    title: 'Wedding Budget Planning: A Complete Breakdown',
    excerpt: 'Learn how to allocate your budget wisely across venue, catering, decoration, photography, and entertainment.',
    category: 'Planning',
    date: '2026-03-05',
    readTime: '6 min read',
    icon: 'fas fa-calculator',
    content: [
      'Planning a wedding budget doesn\'t have to be stressful. Here\'s a practical breakdown to help you make the most of every rupee.',
      '**Venue & Hall (30-35%)** — This is typically your largest expense. It includes hall rental, AC, basic lighting, and sound setup.',
      '**Catering (25-30%)** — Food quality defines your wedding\'s reputation. Allocate generously here. Our packages start from PKR 1,200 per head.',
      '**Decoration & Stage (15-20%)** — This covers floral arrangements, stage design, entrance décor, and ambient lighting.',
      '**Photography & Videography (8-10%)** — Professional coverage is worth the investment. Consider packages that include both photo and video.',
      '**Entertainment (5-8%)** — DJ, live music, mehndi night setup, and any special performances.',
      '**Miscellaneous (5-10%)** — Always keep a buffer for unexpected expenses like weather adjustments, extra guests, or last-minute additions.',
      'Pro Tip: Use our Interactive Menu Builder to get instant cost estimates and customize your package before booking.',
    ],
  },
  {
    id: 'mehndi-ideas',
    title: '15 Stunning Mehndi Night Ideas That Will Wow Your Guests',
    excerpt: 'From colorful themed décor to unique entertainment — make your mehndi the most talked-about night of the wedding week.',
    category: 'Inspiration',
    date: '2026-02-28',
    readTime: '4 min read',
    icon: 'fas fa-paint-brush',
    content: [
      'The mehndi night is where families come together for pure joy and celebration. Here are ideas to make yours unforgettable.',
      '**Truck Art Theme** — Embrace Pakistan\'s vibrant truck art culture with colorful panels, jingle bells, and painted backdrops.',
      '**Garden Fairy Lights** — Transform Falak Hall\'s Garden Terrace into a magical wonderland with thousands of warm fairy lights draped across trees.',
      '**Live Dhol Performance** — Nothing gets the energy going like a professional dhol player leading the dance floor.',
      '**Henna Station** — Set up a dedicated area with professional mehndi artists offering unique modern and traditional designs.',
      '**Photo Booth with Props** — Colorful bangles, dupattas, and fun signs make for amazing candid photos and Instagram-worthy moments.',
      '**Color-Coordinated Dress Code** — Ask guests to wear specific colors (yellow, green, orange) for visually stunning group photos.',
      '**Traditional Sweets Display** — A beautiful spread of laddu, barfi, and jalebi adds both visual appeal and delicious tradition.',
    ],
  },
  {
    id: 'why-falak-hall',
    title: 'Why Falak Hall is Gujrat\'s Most Trusted Wedding Venue',
    excerpt: 'Over 1,500 successful events, a reputation built on trust, and a commitment to making every celebration unforgettable.',
    category: 'About Us',
    date: '2026-02-20',
    readTime: '3 min read',
    icon: 'fas fa-star',
    content: [
      'When it comes to choosing a wedding venue in Gujrat, trust is everything. Here\'s why families across Punjab choose Falak Hall.',
      '**1,500+ Successful Events** — Our track record speaks for itself. From intimate gatherings to grand celebrations, we\'ve delivered excellence every single time.',
      '**Prime GT Road Location** — Centrally located with easy access from all areas of Gujrat, Jhelum, Lalamusa, and surrounding cities.',
      '**Customizable Packages** — Silver, Gold, and Royal packages with our Interactive Menu Builder let you design your perfect event within your budget.',
      '**Professional Event Management** — Our dedicated team handles everything from decoration to catering coordination, so you can focus on enjoying your special day.',
      '**State-of-the-Art Facilities** — Full AC, professional lighting, premium sound systems, and a luxurious bridal suite.',
      '**Transparent Pricing** — No hidden charges. Use our online pricing tool to get instant estimates before you visit.',
      'Book your visit today and experience the Falak Hall difference.',
    ],
  },
  {
    id: 'catering-tips',
    title: 'The Art of Wedding Catering: What Makes a Great Menu',
    excerpt: 'Expert tips on selecting the perfect dishes, balancing variety, and ensuring every guest leaves satisfied.',
    category: 'Catering',
    date: '2026-02-15',
    readTime: '5 min read',
    icon: 'fas fa-utensils',
    content: [
      'Food is the centerpiece of any Pakistani wedding. Here\'s how to craft a menu that delights every guest.',
      '**Balance is Key** — Include a mix of chicken, mutton, and vegetarian dishes to cater to all preferences.',
      '**Quality Over Quantity** — Three perfectly prepared dishes will always outshine seven mediocre ones.',
      '**Seasonal Ingredients** — Fresh, seasonal produce makes a noticeable difference in taste and presentation.',
      '**Live Cooking Stations** — Guests love watching their food being prepared fresh. Consider adding a live biryani or kabab station.',
      '**Don\'t Forget Desserts** — A beautiful dessert spread with traditional and modern options leaves a lasting impression.',
      '**Beverage Variety** — Beyond the standard chai, consider fresh juice bars, lassi stations, and flavored milk.',
      'Use our online Menu Builder to customize your feast and get an instant price estimate tailored to your event.',
    ],
  },
]

const CATEGORIES = ['All', ...new Set(ARTICLES.map(a => a.category))]

/* ── Component ──────────────────────────────────────────── */
export default function Blog() {
  const [headRef, headVisible] = useReveal()
  const [activeCategory, setActiveCategory] = useState('All')
  const [expandedArticle, setExpandedArticle] = useState(null)

  const filteredArticles = activeCategory === 'All'
    ? ARTICLES
    : ARTICLES.filter(a => a.category === activeCategory)

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="blog-page">
      {/* Hero Header */}
      <div className="blog-hero">
        <div className="container">
          <span className="section-label" style={{ display: 'block', textAlign: 'center' }}>
            Inspiration & Insights
          </span>
          <h1
            ref={headRef}
            className={`blog-hero-title reveal${headVisible ? ' visible' : ''}`}
          >
            Wedding Blog
          </h1>
          <p className="blog-hero-subtitle">
            Expert advice, trending ideas, and insider tips to plan your dream wedding at Punjab's premier venue.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container">
        <div className="blog-filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`blog-filter-btn${activeCategory === cat ? ' active' : ''}`}
              onClick={() => { setActiveCategory(cat); setExpandedArticle(null) }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Article Grid or Expanded Article */}
        {expandedArticle ? (
          <article className="blog-article-full">
            <button
              className="blog-back-btn"
              onClick={() => setExpandedArticle(null)}
            >
              <i className="fas fa-arrow-left" /> Back to Articles
            </button>

            <div className="blog-article-header">
              <span className="blog-card-category">{expandedArticle.category}</span>
              <h1>{expandedArticle.title}</h1>
              <div className="blog-article-meta">
                <span><i className="fas fa-calendar-alt" /> {formatDate(expandedArticle.date)}</span>
                <span><i className="fas fa-clock" /> {expandedArticle.readTime}</span>
              </div>
            </div>

            <div className="blog-article-body">
              {expandedArticle.content.map((paragraph, i) => (
                <p key={i} dangerouslySetInnerHTML={{
                  __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                }} />
              ))}
            </div>

            <div className="blog-article-cta">
              <h3>Ready to Start Planning?</h3>
              <p>Use our Interactive Menu Builder to design your perfect wedding feast.</p>
              <a href="/#menu-builder" className="btn btn-gold">
                <i className="fas fa-utensils" /> Build Your Menu
              </a>
            </div>
          </article>
        ) : (
          <div className="blog-grid">
            {filteredArticles.map((article, i) => (
              <BlogCard
                key={article.id}
                article={article}
                index={i}
                formatDate={formatDate}
                onExpand={() => {
                  setExpandedArticle(article)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function BlogCard({ article, index, formatDate, onExpand }) {
  const [ref, visible] = useReveal({ delay: index * 80 })

  return (
    <div
      ref={ref}
      className={`blog-card reveal${visible ? ' visible' : ''}`}
      onClick={onExpand}
    >
      <div className="blog-card-icon">
        <i className={article.icon} />
      </div>
      <div className="blog-card-content">
        <span className="blog-card-category">{article.category}</span>
        <h3 className="blog-card-title">{article.title}</h3>
        <p className="blog-card-excerpt">{article.excerpt}</p>
        <div className="blog-card-meta">
          <span><i className="fas fa-calendar-alt" /> {formatDate(article.date)}</span>
          <span><i className="fas fa-clock" /> {article.readTime}</span>
        </div>
        <span className="blog-card-read-more">
          Read Article <i className="fas fa-arrow-right" />
        </span>
      </div>
    </div>
  )
}
