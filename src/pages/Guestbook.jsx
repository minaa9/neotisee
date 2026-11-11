import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import InfiniteCards from '../components/InfiniteCards'
import { Field } from '../components/forms'
import { inputCls, openMail, selectArrow } from '../components/formUtils'
import { Button, Reveal } from '../components/ui'
import { ateliers } from '../data/ateliers'
import { contact } from '../data/navigation'
import { temoignages } from '../data/temoignages'
import heroImage from '../assets/events/teinture.webp'
import fleurSechee from '../assets/home/fleur-seche.webp'
import vague from '../assets/v3/home/vague-avis.svg'
import etoile from '../assets/v3/ui/etoile-grande.svg'


function Stars({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div role="radiogroup" aria-label="Votre note" className="flex gap-[5px]" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          className={`transition-opacity ${n <= (hover || value) ? 'opacity-100' : 'opacity-25'}`}
        >
          <img src={etoile} alt="" width="20" height="18" className="h-[18px] w-5" />
        </button>
      ))}
    </div>
  )
}

function LeaveAWord() {
  const [values, setValues] = useState({ prenom: '', atelier: '', note: 5, message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const set = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((e) => ({ ...e, [name]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const found = {}
    if (!values.prenom.trim()) found.prenom = 'Indiquez votre prénom.'
    if (values.message.trim().length < 10) found.message = 'Votre mot doit contenir au moins 10 caractères.'
    setErrors(found)
    if (Object.keys(found).length) {
      document.getElementById(`lo-${Object.keys(found)[0]}`)?.focus()
      return
    }
    openMail(
      contact.email,
      `[Livre d’or] Un mot de ${values.prenom}`,
      `${values.message}\n\nAtelier : ${values.atelier || 'non précisé'}\nNote : ${values.note}/5\n— ${values.prenom}`,
    )
    setSent(true)
  }

  return (
    <section id="laisser-un-mot" aria-labelledby="mot-titre" className="relative scroll-mt-10 bg-peche pt-24 pb-16 xl:pt-[130px] xl:pb-[100px]">
      <img src={vague} alt="" aria-hidden="true" className="absolute inset-x-0 top-[-1px] h-[50px] w-full md:h-[101px]" />
      <div className="container-site relative flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
        <Reveal className="flex gap-10">
          <img src={fleurSechee} alt="" aria-hidden="true" className="mt-5 hidden h-[300px] w-[170px] shrink-0 object-contain md:block" />
          <div className="lg:pt-[30px]">
            <h2 id="mot-titre" className="max-w-[460px] font-serif text-[42px] leading-[1.08] tracking-[-0.005em] text-brun md:text-[52px]">
              À votre tour,
              <br />
              <em className="font-light">laissez-nous un mot</em>
            </h2>
            <p className="mt-6 max-w-[320px] text-petit text-brun-doux">
              Votre message sera publié après relecture par l’association.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120} className="w-full rounded-[28px] bg-lin p-6 sm:p-9 lg:w-[540px] lg:shrink-0">
          {sent ? (
            <div role="status">
              <p className="font-serif text-[30px] leading-[1.18] text-brun">Merci pour votre mot !</p>
              <p className="mt-3 text-courant text-brun-doux">
                Votre messagerie s’est ouverte avec votre message : il ne reste plus qu’à l’envoyer. Il
                sera publié après relecture.
              </p>
              <button type="button" onClick={() => setSent(false)} className="mt-6 text-petit text-terre-cuite underline">
                Écrire un autre mot
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={submit} className="flex flex-col gap-[22px]">
              <Field id="lo-prenom" label="Prénom" error={errors.prenom}>
                <input
                  id="lo-prenom"
                  autoComplete="given-name"
                  placeholder="Votre prénom"
                  value={values.prenom}
                  onChange={(e) => set('prenom', e.target.value)}
                  aria-invalid={!!errors.prenom}
                  aria-describedby={errors.prenom ? 'lo-prenom-erreur' : undefined}
                  className={`${inputCls(errors.prenom)} h-[54px]`}
                />
              </Field>
              <Field id="lo-atelier" label="Atelier suivi">
                <select
                  id="lo-atelier"
                  value={values.atelier}
                  onChange={(e) => set('atelier', e.target.value)}
                  className={`${inputCls()} ${selectArrow} h-[54px] ${values.atelier ? '' : 'text-brun-doux/80'}`}
                >
                  <option value="">Sélectionnez un atelier</option>
                  {ateliers.map((a) => (
                    <option key={a.id} value={a.titre}>
                      {a.titre}
                    </option>
                  ))}
                </select>
              </Field>
              <div>
                <p className="mb-2.5 text-label text-brun">Votre note</p>
                <Stars value={values.note} onChange={(n) => set('note', n)} />
              </div>
              <Field id="lo-message" label="Votre message" error={errors.message}>
                <textarea
                  id="lo-message"
                  rows={4}
                  placeholder="Racontez-nous votre expérience…"
                  value={values.message}
                  onChange={(e) => set('message', e.target.value)}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'lo-message-erreur' : undefined}
                  className={`${inputCls(errors.message)} block min-h-[110px] resize-y py-4`}
                />
              </Field>
              <Button type="submit" variant="plein" className="self-start">
                Envoyer
              </Button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}

/** Page Livre d'or V3 (Figma 354:318) */
export default function GuestbookPage() {
  return (
    <>
      <PageHeader
        title="Livre d’or"
        subtitle={
          <>
            Ils ont tissé
            <br />
            avec nous
          </>
        }
        text="Les mots laissés par celles et ceux qui ont partagé un atelier, une démonstration ou une rencontre."
        image={heroImage}
        imageAlt="Une animatrice prépare un bain de teinture végétale dans une jarre"
      >
        <Button href="#laisser-un-mot" className="mt-8 xl:mt-[52px]">
          Laisser un mot
        </Button>
      </PageHeader>

      <section aria-label="Témoignages" className="overflow-hidden bg-creme pb-16 xl:pt-2 xl:pb-[90px]">
        <div className="container-site">
          <InfiniteCards items={temoignages} />
        </div>
      </section>

      <LeaveAWord />
    </>
  )
}
