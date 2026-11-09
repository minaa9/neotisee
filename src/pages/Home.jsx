import PartnersBand from '../components/PartnersBand'
import Hero from '../sections/home/Hero'
import Association from '../sections/home/Association'
import Team from '../sections/home/Team'
import Workshops from '../sections/home/Workshops'
import UpcomingEvents from '../sections/home/UpcomingEvents'
import LatestNews from '../sections/home/LatestNews'
import ContactCta from '../sections/home/ContactCta'

export default function Home() {
  return (
    <>
      <Hero />
      <Association />
      <PartnersBand />
      <Team />
      <Workshops />
      <UpcomingEvents />
      <LatestNews />
      <ContactCta />
    </>
  )
}
