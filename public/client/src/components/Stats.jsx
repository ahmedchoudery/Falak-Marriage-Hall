import { useCounter, useReveal } from '../hooks/useReveal'

const stats = [
  { icon: 'fas fa-users',          target: 500,  suffix: '+', label: 'Guest Capacity'   },
  { icon: 'fas fa-calendar-check', target: 1500, suffix: '+', label: 'Events Completed' },
  { icon: 'fas fa-car',            target: 200,  suffix: '+', label: 'Parking Spaces'   },
  { icon: 'fas fa-snowflake',      target: 100,  suffix: '%', label: 'AC Coverage'      },
]

function StatItem({ icon, target, suffix, label, delay }) {
  const [numRef, count] = useCounter(target)
  const [ref, visible]  = useReveal({ delay })
  return (
    <div ref={ref} className={`stat-item reveal${visible ? ' visible' : ''}`}>
      <i className={icon} />
      <span ref={numRef} className="stat-number">{count}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

export default function Stats() {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((s, i) => <StatItem key={s.label} {...s} delay={i * 100} />)}
        </div>
      </div>
    </section>
  )
}
