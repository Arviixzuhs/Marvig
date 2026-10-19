import { Chatbot } from '@/components/Chatbot'
import ReactLenis from 'lenis/react'
import { FaqSection } from './components/FaqSection'
import { HeroSection } from './components/HeroSection'
import { ContactSection } from './components/ContactSection'
import { ServicesSection } from './components/ServicesSection'
import { LocationSection } from './components/LocationSection'
import { ApartmentsSection } from './components/ApartmentsSection'

export const LandingPage = () => {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      <div className='min-h-screen bg-background'>
        <HeroSection />
        <ApartmentsSection />
        <ServicesSection />
        <FaqSection />
        <LocationSection />
        <ContactSection />
        <Chatbot mode='POPUP' />
      </div>
    </ReactLenis>
  )
}
