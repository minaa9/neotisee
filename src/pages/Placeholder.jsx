import { Button, Eyebrow } from '../components/ui'

/** Page temporaire en attendant l'intégration de la maquette. */
export default function Placeholder({ eyebrow, title }) {
  return (
    <section className="container-site flex min-h-[70vh] flex-col items-start justify-center gap-6 pt-40 pb-24">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="font-serif text-[48px] leading-[1.08] text-brun md:text-[64px]">{title}</h1>
      <p className="text-courant text-brun-doux">Cette page est en cours de construction.</p>
      <Button to="/">Retour à l’accueil</Button>
    </section>
  )
}
