'use client'

import { useState, useEffect } from 'react'
import { useReveal } from '../hooks/useReveal'
import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

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
        const res = await fetch(`${API_BASE}/api/availability`)
        const data = await res.json()
        if (data.success) {
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
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
    const isPast  = new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
    cells.push({ day: d, booked: bookedDates.includes(dateStr), isToday, isPast })
  }

  return (
    <section id="availability" className="calendar-section">
      <div className="container">
        <div ref={headRef} className={`section-title reveal${headVisible ? ' visible' : ''}`}>
          <span className="section-label">Booking Status</span>
          <h2>Event Availability</h2>
          <div className="gold-divider" />
          <p className="calendar-subtitle">
            Check our schedule and secure your perfect wedding date.
          </p>
        </div>

        <div className="calendar-card">
          <div className="calendar-header">
            <button onClick={prevMonth} aria-label="Previous Month" className="calendar-nav-btn">
              <i className="fas fa-chevron-left" />
            </button>
            <h3 className="calendar-title">{MONTHS[month]} {year}</h3>
            <button onClick={nextMonth} aria-label="Next Month" className="calendar-nav-btn">
              <i className="fas fa-chevron-right" />
            </button>
          </div>

          <div className="calendar-grid">
            {DAYS.map(d => (
              <div className="calendar-day-label" key={d}>{d}</div>
            ))}
            {cells.map((c, i) => {
              if (c.empty) return <div className="calendar-cell empty" key={`e-${i}`} />
              const cls = c.booked
                ? 'calendar-cell booked'
                : c.isPast
                ? 'calendar-cell past'
                : 'calendar-cell available'
              return (
                <div key={c.day} className={`${cls}${c.isToday ? ' today' : ''}`}>
                  <span className="cell-day-num">{c.day}</span>
                  {c.isToday && <span className="today-dot" />}
                </div>
              )
            })}
          </div>

          <div className="calendar-legend">
            <div className="legend-item">
              <span className="legend-dot available" />
              <span>Available</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot booked" />
              <span>Booked</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot today" />
              <span>Today</span>
            </div>
          </div>
        </div>

        <div className="calendar-cta">
          <Link href="/booking" className="btn btn-gold">
            <span>Reserve a Date</span>
            <i className="fas fa-calendar-plus" />
          </Link>
        </div>
      </div>
    </section>
  )
}