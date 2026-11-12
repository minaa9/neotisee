import Weave from '../../components/Weave'
import { Eyebrow, Reveal } from '../../components/ui'

/**
 * Le métier de Néotisse : section sombre en pleine largeur, avec la trame
 * interactive. Elle casse le rythme crème du site et sert de signature.
 */
export default function WeaveSection() {
  return (
    <section className="relative overflow-hidden bg-brun py-20 text-lin xl:py-28">
      <div className="container-site">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <Reveal>
            <Eyebrow className="text-poudre!">Le métier</Eyebrow>
            <h2 className="mt-4 font-serif text-[40px] leading-[1.05] font-light text-lin md:text-[60px]">
              Croiser les fils,
              <br />
              <em>faire naître l’étoffe</em>
            </h2>
          </Reveal>
          <Reveal delay={120} as="p" className="max-w-[460px] text-courant text-lin/75 lg:justify-self-end">
            Les fils tendus sur le métier forment la chaîne ; la trame passe dessus, dessous, et
            dessine le motif. Choisissez une armure, puis effleurez l’étoffe.
          </Reveal>
        </div>
        <div className="mt-10 xl:mt-14">
          <Weave />
        </div>
      </div>
    </section>
  )
}
