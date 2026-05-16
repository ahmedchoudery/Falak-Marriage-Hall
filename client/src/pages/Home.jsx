import Hero from '../components/Hero'
import Stats from '../components/Stats'
import About from '../components/About'
import Services from '../components/Services'
import Gallery from '../components/Gallery'
import ParallaxBanner from '../components/ParallaxBanner'
import Packages from '../components/Packages'
import MenuBuilder from '../components/MenuBuilder'
import AvailabilityCalendar from '../components/AvailabilityCalendar'
import CTASection from '../components/CTASection'
import Location from '../components/Location'

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <Services />
      <Gallery />
      <ParallaxBanner image="/images/gallery_3.png" />
      <Packages />
      <MenuBuilder />
      <AvailabilityCalendar />
      <CTASection />
      <Location />
    </>
  )
}
