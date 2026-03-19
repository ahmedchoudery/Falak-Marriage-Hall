import { useState, useEffect } from 'react'
import { useReveal } from '../hooks/useReveal'
import { Link } from 'react-router-dom'

const DAYS   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  const day = new Date(year, month, 1).getDay()
  return (day === 0) ? 6 : day - 1
}

export default function AvailabilityCalendar() {
  const today = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [bookedDates, setBookedDates] = useState([])
  const [loading, setLoading] = useState(true)
  const [headRef, headVisible] = useReveal()

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await fetch('/api/availability')
        const data = await res.json()
        if (data.success) {
          // Store only the dates as a simple array for easy checking
          setBookedDates(data.data.map(d => d.date))
        }
      } catch (err) {
        console.error('Failed to fetch availability:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAvailability()
  }, [])

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay    = getFirstDayOfMonth(year, month)

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push({ empty: true })
  
  for (let d = 1; d <= daysInMonth; d++) {
    // Format: YYYY-MM-DD
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
    const isPast  = new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
    cells.push({ 
      day: d, 
      booked: bookedDates.includes(dateStr), 
      isToday, 
      isPast 
    })
  }

  return (
    <section className="calendar-section">
      <div className="container">
        <div
          ref={headRef}
          className={`section-title reveal${headVisible ? ' visible' : ''}`}
        >
          <span className="section-label">Booking Status</span>
          <h2>Event Availability</h2>
          <div className="gold-divider" />
          <p style={{ color: 'var(--text-muted)', marginTop: 20, fontSize: '0.95rem' }}>
            Check our schedule and secure your perfect wedding date.
          </p>
        </div>

        <div className="calendar-wrap">
          {/* Header */}
          <div className="calendar-header">
            <button
              onClick={prevMonth}
              style={{ background: 'none', border: '1px solid var(--gold-border)', color: 'var(--gold)', width: 36, height: 36, borderRadius: 'var(--radius)', transition: 'all .3s' }}
              className="hoverable"
            >
              <i className="fas fa-chevron-left" />
            </button>
            <h3>{MONTHS[month]} {year}</h3>
            <button
              onClick={nextMonth}
              style={{ background: 'none', border: '1px solid var(--gold-border)', color: 'var(--gold)', width: 36, height: 36, borderRadius: 'var(--radius)', transition: 'all .3s' }}
              className="hoverable"
            >
              <i className="fas fa-chevron-right" />
            </button>
          </div>

          {/* Grid */}
          <div className="calendar-grid">
            {DAYS.map(d => (
              <div className="cal-header" key={d}>{d}</div>
            ))}
            {cells.map((c, i) => {
              if (c.empty) return <div className="cal-day empty" key={`e-${i}`} />
              const cls = c.booked
                ? 'cal-day booked'
                : c.isPast
                ? 'cal-day'
                : 'cal-day available'
              return (
                <div
                  key={c.day}
                  className={cls}
                  style={{
                    outline: c.isToday ? '1px solid var(--gold)' : undefined,
                    opacity: c.isPast ? 0.3 : 1,
                  }}
                >
                  {c.day}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="cal-legend">
            <div className="cal-legend-item">
              <div className="cal-legend-dot" style={{ background: 'rgba(15,42,36,0.5)', border: '1px solid var(--gold-border)' }} />
              Available
            </div>
            <div className="cal-legend-item">
              <div className="cal-legend-dot" style={{ background: 'rgba(220,53,69,0.15)', border: '1px solid rgba(220,53,69,0.3)' }} />
              Booked
            </div>
            <div className="cal-legend-item">
              <div className="cal-legend-dot" style={{ outline: '1px solid var(--gold)', background: 'transparent' }} />
              Today
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link to="/booking" className="btn btn-gold">
            <i className="fas fa-calendar-plus" /> Reserve a Date
          </Link>
        </div>
      </div>
    </section>
  )
}
