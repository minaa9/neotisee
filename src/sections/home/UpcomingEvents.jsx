import EventCard from '../../components/EventCard'
import { Button, Eyebrow, Reveal, SectionTitle } from '../../components/ui'
import { events } from '../../data/events'

/** 06 · Prochains rendez-vous (Figma 253:39) */
export default function UpcomingEvents() {
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = events.filter((e) => e.date >= today)
  const list = (upcoming.length ? upcoming : events).slice(0, 4)

  return (
    <section className="bg-creme py-20 xl:pt-[100px] xl:pb-[120px]">
      <div className="container-site">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="flex flex-col items-start gap-4">
            <Eyebrow>Calendrier</Eyebrow>
            <SectionTitle className="xl:text-[44px]">Nos prochains rendez-vous</SectionTitle>
            <p className="text-[17px] text-encre/65">
              Ateliers, événements, conférences… plongez au cœur des savoir-faire textiles anciens.
            </p>
          </Reveal>
          <Button to="/calendrier" variant="outline" arrow className="self-start py-3.5 lg:self-auto">
            Voir tout le calendrier
          </Button>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 xl:mt-[42px] xl:grid-cols-4">
          {list.map((event, i) => (
            <Reveal as="li" key={event.id} delay={i * 100}>
              <EventCard event={event} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
