import { Button, Eyebrow, SectionTitle } from '../components/ui'

/** Page temporaire en attendant l'intégration de la maquette. */
export default function Placeholder({ eyebrow, title }) {
  return (
    <section className="container-site flex min-h-[60vh] flex-col items-start justify-center gap-6 py-24">
      <Eyebrow>{eyebrow}</Eyebrow>
      <SectionTitle as="h1">{title}</SectionTitle>
      <p className="text-encre/70">Cette page est en cours de construction.</p>
      <Button to="/" variant="outline">
        Retour à l’accueil
      </Button>
    </section>
  )
}
