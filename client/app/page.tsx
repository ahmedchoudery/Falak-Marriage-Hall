import ClientHero from '@/components/ClientHero'
import Stats from '@/components/Stats'
import About from '@/components/About'
import Services from '@/components/Services'
import Gallery from '@/components/Gallery'
import ParallaxBanner from '@/components/ParallaxBanner'
import MenuBuilder from '@/components/MenuBuilder'
import AvailabilityCalendar from '@/components/AvailabilityCalendar'
import CTASection from '@/components/CTASection'
import Location from '@/components/Location'

export default function Home() {
  return (
    <>
      <div id="home"><ClientHero /></div>
      <Stats />
      <div id="about"><About /></div>
      <div id="services"><Services /></div>
      <div id="gallery"><Gallery /></div>
      <ParallaxBanner image="/images/gallery_3.png" />
      <div id="menu-builder"><MenuBuilder /></div>
      <div id="availability"><AvailabilityCalendar /></div>
      <CTASection />
      <Location />
    </>
  )
}
