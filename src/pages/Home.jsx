import PartnersBand from '../components/PartnersBand'
import Hero from '../sections/home/Hero'
import Association from '../sections/home/Association'
import Workshops from '../sections/home/Workshops'
import Reviews from '../sections/home/Reviews'
import ContactCta from '../sections/home/ContactCta'
import WeaveSection from '../sections/home/WeaveSection'
import QuoteFullscreen from '../sections/home/QuoteFullscreen'

/** Accueil V3 (Figma 347:19) */
export default function Home() {
  return (
    <>
      <Hero />
      <Association />
      <WeaveSection />
      <PartnersBand />
      <Workshops />
      <QuoteFullscreen />
      <Reviews />
      <ContactCta />
    </>
  )
}
