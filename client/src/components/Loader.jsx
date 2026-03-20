import { useEffect, useRef, useState } from 'react'
import anime from 'animejs'

export default function Loader() {
  const overlayRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    // Animate logo and tagline in
    anime.timeline({ easing: 'easeOutExpo' })
      .add({
        targets: '.loader-logo',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 700,
        delay: 200,
      })
      .add({
        targets: '.loader-tagline',
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 500,
      }, '-=300')

    // Simulate loading progress
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 18 + 4
      if (p >= 100) { p = 100; clearInterval(interval) }
      setProgress(Math.min(Math.round(p), 100))
    }, 80)

    // Hide after window load
    const hide = () => {
      setTimeout(() => setHidden(true), 600)
    }

    if (document.readyState === 'complete') {
      setTimeout(hide, 800)
    } else {
      window.addEventListener('load', hide)
    }

    return () => {
      clearInterval(interval)
      window.removeEventListener('load', hide)
    }
  }, [])

  return (
    <div ref={overlayRef} className={`loader-overlay${hidden ? ' hidden' : ''}`}>
      <span className="loader-logo">FALAK HALL</span>
      <span className="loader-tagline">Gujrat's Finest Wedding Venue</span>
      <div className="loader-bar-wrap">
        <div className="loader-bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
