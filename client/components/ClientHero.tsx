'use client'

import dynamic from 'next/dynamic'

// Hero imports three.js + anime.js which are browser-only.
// Wrapping in a 'use client' component is required to use ssr: false.
const Hero = dynamic(() => import('./Hero'), { ssr: false })

export default function ClientHero() {
  return <Hero />
}
