import Collage from '../../components/Collage'
import { Button, Eyebrow, Reveal } from '../../components/ui'
import { contact } from '../../data/navigation'
import planteGravure from '../../assets/home/plante-gravure.webp'
import fleurViolette from '../../assets/home/fleur-violette.webp'
import iconeMail from '../../assets/common/icone-mail.svg'
import iconeTel from '../../assets/common/icone-tel.svg'
import iconeLieu from '../../assets/common/icone-lieu.svg'

const infos = [
  { icon: iconeMail, label: contact.email, href: `mailto:${contact.email}` },
  { icon: iconeTel, label: contact.phone, href: contact.phoneHref },
  { icon: iconeLieu, label: contact.city },
]

/** 08 · Contact (Figma 255:44) */
export default function ContactCta() {
  return (
    <section className="relative overflow-hidden bg-creme py-20 xl:pt-[110px] xl:pb-[120px]">
      {/* Gravures décoratives */}
      <div className="pointer-events-none absolute top-[136px] -left-[3px] hidden w-[153px] md:block">
        <Collage
          width={152.548}
          height={258.668}
          items={[
            { x: 0, y: 0, w: 152.548, h: 258.668, iw: 127.123, ih: 246.492, rotate: -173.87, flipY: true, src: planteGravure, cover: true },
          ]}
        />
      </div>
      <div className="pointer-events-none absolute top-[82px] right-[37px] hidden w-[223px] md:block">
        <Collage
          width={222.915}
          height={226.223}
          items={[
            { x: 0, y: 0, w: 222.915, h: 226.223, iw: 196.127, ih: 200.04, rotate: -8.29, src: fleurViolette, cover: true },
          ]}
        />
      </div>

      <Reveal className="container-site relative flex flex-col items-center gap-[26px] text-center">
        <Eyebrow centered>Contact</Eyebrow>
        <h2 className="font-serif text-[34px] leading-tight text-encre/90 md:text-[44px] xl:text-[52px]">
          Une question ? Une envie de projet ?
        </h2>
        <p className="max-w-[620px] text-[17px] leading-[1.45] text-encre/68 xl:text-[18px]">
          Un atelier pour une école, un musée, un festival ? Écrivez-nous, nous serons ravies
          d’échanger avec vous.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button to="/contact" arrow className="py-[18px]">
            Nous écrire
          </Button>
          <Button to="/calendrier" variant="outline" className="py-[18px]">
            Voir le calendrier
          </Button>
        </div>

        <ul className="mt-2.5 flex flex-col items-center gap-5 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-12">
          {infos.map((info) => {
            const content = (
              <>
                <span className="flex size-11 items-center justify-center rounded-full bg-mauve">
                  <img src={info.icon} alt="" width="22" height="22" />
                </span>
                {info.label}
              </>
            )
            return (
              <li key={info.label}>
                {info.href ? (
                  <a href={info.href} className="flex items-center gap-3 text-encre/80 hover:text-terre">
                    {content}
                  </a>
                ) : (
                  <span className="flex items-center gap-3 text-encre/80">{content}</span>
                )}
              </li>
            )
          })}
        </ul>
      </Reveal>
    </section>
  )
}
