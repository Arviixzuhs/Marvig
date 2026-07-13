import { ChatBot } from './components/ChatBot'
import { FaqSection } from './components/FaqSection'
import { HeroSection } from './components/HeroSection'
import { ServicesSection } from './components/ServicesSection'
import { LocationSection } from './components/LocationSection'
import { ApartmentsSection } from './components/ApartmentsSection'

export const LandingPage = () => {
  return (
    <div className='min-h-screen bg-background'>
      <HeroSection />
      <ApartmentsSection />
      <ServicesSection />
      <FaqSection />
      <LocationSection />
      <ChatBot />
    </div>
  )
}
