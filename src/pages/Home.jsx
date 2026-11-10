import PartnersBand from '../components/PartnersBand'
import Hero from '../sections/home/Hero'
import Association from '../sections/home/Association'
import Workshops from '../sections/home/Workshops'
import Reviews from '../sections/home/Reviews'
import ContactCta from '../sections/home/ContactCta'

/** Accueil V3 (Figma 347:19) */
export default function Home() {
  return (
    <>
      <Hero />
      <Association />
      <PartnersBand />
      <Workshops />
      <Reviews />
      <ContactCta />
    </>
  )
}
