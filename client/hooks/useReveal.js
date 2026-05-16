import { useEffect, useRef, useState } from 'react'

/**
 * useReveal — triggers a CSS `visible` class when element enters viewport
 * @param {object} options - threshold, rootMargin, delay
 */
export function useReveal(options = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (options.delay) {
            setTimeout(() => setVisible(true), options.delay)
          } else {
            setVisible(true)
          }
          observer.disconnect()
        }
      },
      {
        threshold: options.threshold ?? 0.1,
        rootMargin: options.rootMargin ?? '0px 0px -60px 0px',
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, visible]
}

/**
 * useCounter — animates a number from 0 to target when visible
 */
export function useCounter(target, duration = 2000) {
  const ref = useRef(null)
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        setStarted(true)
        observer.disconnect()
      }
    }, { threshold: 0.5 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    const steps = 60
    const increment = target / steps
    const interval = duration / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, interval)
    return () => clearInterval(timer)
  }, [started, target, duration])

  return [ref, count]
}
