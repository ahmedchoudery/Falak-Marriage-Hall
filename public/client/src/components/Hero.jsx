import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import anime from 'animejs'
import { Link } from 'react-router-dom'

export default function Hero() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ── Three.js Setup ──────────────────────────────────
    const scene    = new THREE.Scene()
    const camera   = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x000000, 0)

    camera.position.z = 6

    // ── Particles ───────────────────────────────────────
    const COUNT = window.innerWidth < 768 ? 600 : 1400
    const positions = new Float32Array(COUNT * 3)
    const sizes     = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 22
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      sizes[i] = Math.random() * 1.5 + 0.5
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('size',     new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.PointsMaterial({
      color: 0xC6A769,
      size: 0.025,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // ── Mouse parallax ──────────────────────────────────
    let targetRotX = 0, targetRotY = 0
    const onMouseMove = (e) => {
      targetRotY = ((e.clientX / window.innerWidth)  - 0.5) * 0.6
      targetRotX = ((e.clientY / window.innerHeight) - 0.5) * 0.35
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // ── Animation loop ──────────────────────────────────
    let animId
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Slow drift
      particles.rotation.y += 0.0006
      particles.rotation.z = Math.sin(t * 0.1) * 0.04

      // Mouse follow (lerp)
      particles.rotation.y += (targetRotY - particles.rotation.y) * 0.025
      particles.rotation.x += (targetRotX - particles.rotation.x) * 0.025

      renderer.render(scene, camera)
    }
    animate()

    // ── Resize ──────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    // ── Anime.js text entrance ──────────────────────────
    const tl = anime.timeline({ easing: 'easeOutExpo' })

    tl.add({
      targets: '.hero-label',
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 700,
      delay: 400,
    }).add({
      targets: '.hero-title .char',
      opacity:    [0, 1],
      translateY: [70, 0],
      duration: 800,
      delay: anime.stagger(35, { from: 'first' }),
    }, '-=300').add({
      targets: '.hero-subtitle',
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
    }, '-=200').add({
      targets: '.hero-btns',
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 500,
    }, '-=300')

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  // Split title into individual chars for stagger animation
  const title = 'Falak Marriage Hall'
  const chars = title.split('').map((c, i) => (
    <span key={i} className="char" style={{ willChange: 'transform, opacity' }}>
      {c === ' ' ? '\u00A0' : c}
    </span>
  ))

  return (
    <section id="home" className="hero">
      <div className="hero-bg" />
      <canvas ref={canvasRef} className="hero-canvas" />

      <div className="hero-content">
        <span className="hero-label">Gujrat's Most Premium Wedding Venue</span>
        <h1 className="hero-title">{chars}</h1>
        <p className="hero-subtitle">Where Beautiful Wedding Memories Begin</p>
        <div className="hero-btns">
          <Link to="/booking" className="btn btn-gold">
            <i className="fas fa-calendar-check" /> Book Your Event
          </Link>
          <a href="#gallery" className="btn btn-outline">
            <i className="fas fa-images" /> View Gallery
          </a>
        </div>
      </div>

      <div className="hero-scroll">
        <div className="hero-scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  )
}
