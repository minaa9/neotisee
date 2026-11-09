import Collage from '../components/Collage'
import { Eyebrow, Reveal } from '../components/ui'
import marie from '../assets/equipe/marie.webp'
import emilie from '../assets/equipe/emilie.webp'
import traitCourbe from '../assets/equipe/trait-courbe.svg'
import fleurViolette from '../assets/home/fleur-violette.webp'
import fragmentTissu from '../assets/association/fragment-tissu.webp'

function MemberPhoto({ src, box }) {
  return (
    <Collage
      width={box.w}
      height={box.h}
      className="w-full"
      items={[{ x: 0, y: 0, ...box, rotate: -3.33, src }]}
    />
  )
}

function MemberText({ name, role, bio }) {
  return (
    <div>
      <h2 className="font-serif text-[34px] leading-[normal] text-black xl:text-[43px]">{name}</h2>
      <p className="mt-3 max-w-[313px] text-[18px] text-black/82">{role}</p>
      <p className="mt-6 max-w-[390px] text-base text-black/82 xl:mt-[42px]">{bio}</p>
    </div>
  )
}

/** Page L'équipe (Figma 257:150) */
export default function TeamPage() {
  return (
    <div className="overflow-hidden bg-creme pt-12 pb-24 xl:pt-[48px] xl:pb-[232px]">
      <Reveal as="header" className="container-site">
        <Eyebrow>L’équipe</Eyebrow>
        <h1 className="mt-5 font-serif text-[38px] leading-[normal] text-encre/90 md:text-[52px]">
          Les visages de Néotisse
        </h1>
        <p className="mt-3 max-w-[560px] text-[17px] leading-[1.4] text-encre/70 xl:text-[19px]">
          Archéologie, égyptologie, gestes de tisserands : Néotisse est née de la rencontre entre
          la recherche et l’envie de transmettre.
        </p>
        <span aria-hidden="true" className="mt-6 block h-[3px] w-[120px] rounded-[2px] bg-terre" />
      </Reveal>

      {/* Marie-Salomé */}
      <section className="relative mt-16 xl:mt-[69px]">
        <div className="container-site flex flex-col gap-8 md:flex-row md:items-start md:gap-[42px]">
          <Reveal className="w-full max-w-[386px] md:ml-[53px] md:w-[40%] md:shrink-0">
            <MemberPhoto src={marie} box={{ w: 385.621, h: 391.384, iw: 364.71, ih: 370.838 }} />
          </Reveal>
          <Reveal delay={120} className="md:pt-6">
            <MemberText
              name="Marie-Salomé"
              role="Diplômée d’un master en égyptologie"
              bio="Les mots sont aussi des traces du passé. Marie-Salomé s’intéresse aux termes de l’Égypte ancienne liés aux tisserands, pour explorer la place du textile dans les sociétés anciennes à travers les sources écrites."
            />
          </Reveal>
        </div>
        {/* Décor : fil rouge + fleur */}
        <div className="pointer-events-none absolute top-[21px] right-0 hidden w-[482px] xl:block">
          <Collage
            width={482}
            height={217}
            items={[
              { x: 0, y: 138, w: 462, h: 63, src: traitCourbe },
              { x: 201, y: 0, w: 213.858, h: 217.031, iw: 188.158, ih: 191.912, rotate: -8.29, src: fleurViolette, cover: true },
            ]}
          />
        </div>
      </section>

      {/* Émilie Roma */}
      <section className="relative mt-16 md:-mt-[19px]">
        <div className="container-site flex flex-col-reverse gap-8 md:flex-row md:items-start md:justify-between">
          <Reveal className="md:mt-[131px] md:ml-[112px]">
            <MemberText
              name="Émilie Roma"
              role="Doctorante en archéologie, spécialiste des systèmes de tissage"
              bio="Comprendre les textiles anciens, c’est aussi comprendre les techniques qui leur ont donné forme. À travers sa spécialité, Émilie étudie les systèmes de tissage et contribue à faire connaître les savoir-faire qui se cachent derrière les étoffes."
            />
          </Reveal>
          <Reveal delay={120} className="w-full max-w-[355px] md:mr-[96px] md:w-[36%] md:shrink-0">
            <MemberPhoto src={emilie} box={{ w: 354.631, h: 448.106, iw: 330.247, ih: 429.66 }} />
          </Reveal>
        </div>
        <div className="pointer-events-none absolute top-[370px] -left-[51px] hidden w-[231px] xl:block">
          <Collage
            width={231.125}
            height={217.186}
            items={[
              { x: 0, y: 0, w: 231.125, h: 217.186, iw: 190, ih: 169, rotate: -162.99, src: fragmentTissu, cover: true },
            ]}
          />
        </div>
      </section>
    </div>
  )
}
