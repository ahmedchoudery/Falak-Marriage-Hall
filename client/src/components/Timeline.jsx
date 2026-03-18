import { useReveal } from '../hooks/useReveal'

const steps = [
  {
    num: '01',
    title: 'Guest Arrival',
    desc: 'Red carpet welcome with professional greeters and complimentary refreshments in the arrival lounge.',
  },
  {
    num: '02',
    title: 'Nikah Ceremony',
    desc: 'A sacred and serene setting with spiritual ambience, floral backdrops, and full sound arrangements.',
  },
  {
    num: '03',
    title: 'Royal Dinner',
    desc: 'Gourmet meals served buffet or plated style in an elegantly lit dining hall by our trained service staff.',
  },
  {
    num: '04',
    title: 'Celebrations',
    desc: 'Cake cutting, family celebrations, and entertainment — every moment managed by our event team.',
  },
  {
    num: '05',
    title: 'Photography',
    desc: 'Cinematic photo and video sessions capturing memories that you will treasure for a lifetime.',
  },
]

export default function Timeline() {
  const [headRef, headVisible] = useReveal()

  return (
    <section className="timeline-section">
      <div className="container">
        <div
          ref={headRef}
          className={`section-title reveal${headVisible ? ' visible' : ''}`}
        >
          <span className="section-label">The Journey</span>
          <h2>Your Wedding Day Flow</h2>
          <div className="gold-divider" />
          <p style={{ color: 'var(--text-muted)', marginTop: 20, fontSize: '0.95rem' }}>
            A seamless, orchestrated experience from start to finish.
          </p>
        </div>

        <div className="timeline">
          {steps.map((s, i) => (
            <TimelineItem key={s.num} {...s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TimelineItem({ num, title, desc, index }) {
  const [ref, visible] = useReveal({ delay: index * 120 })
  const isLeft = index % 2 === 0

  return (
    <div
      ref={ref}
      className={`timeline-item reveal${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className="timeline-dot" />
      <div className="timeline-content">
        <span className="timeline-num">Step {num}</span>
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
      {/* Spacer for opposite side */}
      <div style={{ flex: 1 }} />
    </div>
  )
}
