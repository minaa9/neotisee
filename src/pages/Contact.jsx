import { useState } from 'react'
import Collage from '../components/Collage'
import HeroDecor from '../components/HeroDecor'
import { Eyebrow, Reveal } from '../components/ui'
import { contact } from '../data/navigation'
import traitTitre from '../assets/actualites/trait-titre.svg'
import photoTissage from '../assets/actualites/photo-tissage.webp'
import tacheIcone from '../assets/contact/tache-icone.svg'
import traitCourt from '../assets/contact/trait-court.svg'
import iconeMail from '../assets/contact/icone-mail.svg'
import iconeTel from '../assets/contact/icone-tel.svg'
import iconeLieu from '../assets/contact/icone-lieu.svg'
import arrowLong from '../assets/common/arrow-long.svg'
import planteGravure from '../assets/home/plante-gravure.webp'

const infos = [
  { icon: iconeMail, label: 'E-mail', value: contact.email, href: `mailto:${contact.email}` },
  { icon: iconeTel, label: 'Téléphone', value: contact.phone, href: contact.phoneHref },
  { icon: iconeLieu, label: 'Localisation', value: contact.city },
]

const objets = [
  'Réserver un atelier',
  'Demande de devis',
  'Atelier pour une école ou un centre de loisirs',
  'Partenariat, musée ou festival',
  'Autre demande',
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values) {
  const errors = {}
  if (!values.nom.trim()) errors.nom = 'Indiquez votre nom et prénom.'
  if (!values.email.trim()) errors.email = 'Indiquez votre adresse e-mail.'
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Cette adresse e-mail ne semble pas valide.'
  if (!values.objet) errors.objet = 'Choisissez l’objet de votre demande.'
  if (values.message.trim().length < 10) errors.message = 'Votre message doit contenir au moins 10 caractères.'
  return errors
}

const fieldCls = (hasError) =>
  `w-full rounded-[8px] bg-[rgba(217,217,217,0.49)] px-5 text-[15px] text-encre placeholder:text-[13px] placeholder:font-medium placeholder:text-black/33 outline-offset-2 transition-shadow focus:ring-2 focus:ring-terre/40 focus:outline-none ${
    hasError ? 'ring-2 ring-terre' : ''
  }`

function Field({ id, label, error, className = '', children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block pl-2.5 text-[15px] font-medium text-black/66">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-erreur`} className="mt-1.5 pl-2.5 text-sm text-terre">
          {error}
        </p>
      )}
    </div>
  )
}

/** Page Contact (Figma 257:535) */
export default function ContactPage() {
  const [values, setValues] = useState({ nom: '', email: '', objet: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const update = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus()
      return
    }
    // Pas encore de serveur d'envoi : on ouvre la messagerie de l'internaute
    // avec le message pré-rempli. À remplacer par un service de formulaire
    // (Formspree, Netlify Forms…) au moment de la mise en ligne.
    const subject = `[Site Néotisse] ${values.objet}`
    const body = `${values.message}\n\n— ${values.nom} (${values.email})`
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  const describedBy = (name) => (errors[name] ? `${name}-erreur` : undefined)

  return (
    <div className="relative overflow-hidden bg-creme pb-20 xl:pb-[45px]">
      <section className="relative pt-14 xl:min-h-[440px] xl:pt-[40px]">
        <HeroDecor variant="contact" />
        <Reveal as="header" className="container-site relative">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-6 font-serif text-[40px] leading-[normal] text-black/88 xl:mt-[27px] xl:text-[48px]">
            Une question ?
            <br />
            Une envie de projet ?
          </h1>
          <img src={traitTitre} alt="" width="122" height="4" className="mt-6 -ml-0.5 xl:mt-[61px]" />
          <p className="mt-8 max-w-[392px] text-[20px] leading-[normal] text-black/72 xl:mt-[45px] xl:text-[24px]">
            Écrivez-nous, nous serons ravies d’échanger avec vous
          </p>
        </Reveal>
        <Reveal className="container-site mt-10 xl:hidden">
          <img src={photoTissage} alt="" className="mx-auto w-full max-w-[442px]" />
        </Reveal>
      </section>

      <div className="container-site relative mt-12 grid gap-14 lg:grid-cols-[1fr_635px] lg:gap-10 xl:mt-[-2px]">
        {/* Coordonnées */}
        <Reveal as="aside" className="lg:pt-[70px] lg:pl-[87px]">
          <ul className="flex flex-col gap-[45px]">
            {infos.map((info) => (
              <li key={info.label} className="flex items-center gap-5">
                <span className="relative flex h-[55px] w-16 shrink-0 items-center justify-center">
                  <img src={tacheIcone} alt="" className="absolute inset-0 size-full -rotate-[0.9deg]" />
                  <img src={info.icon} alt="" width="26" height="26" className="relative" />
                </span>
                <p className="font-serif text-[14px] leading-[normal] text-black/66">
                  {info.label}
                  <br />
                  {info.href ? (
                    <a href={info.href} className="hover:text-terre">
                      {info.value}
                    </a>
                  ) : (
                    info.value
                  )}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-14 font-serif text-[20px] text-terre-fonce/71 lg:ml-[-29px]">Tissons la suite ensemble.</p>
          <img src={traitCourt} alt="" width="60" height="2" className="mt-1 lg:ml-[-29px]" />
        </Reveal>

        {/* Formulaire */}
        <Reveal delay={120}>
          {sent ? (
            <div role="status" className="rounded-[18px] bg-lin p-8 xl:p-10">
              <p className="font-serif text-[28px] text-encre">Merci, à très vite !</p>
              <p className="mt-3 text-encre/75">
                Votre messagerie s’est ouverte avec votre message pré-rempli : il ne vous reste plus
                qu’à l’envoyer. Si rien ne s’est ouvert, écrivez-nous directement à{' '}
                <a href={`mailto:${contact.email}`} className="font-medium text-terre-fonce underline">
                  {contact.email}
                </a>
                .
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false)
                  setValues({ nom: '', email: '', objet: '', message: '' })
                }}
                className="mt-6 font-medium text-terre-fonce underline"
              >
                Écrire un autre message
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={submit} className="grid gap-x-[62px] gap-y-[22px] sm:grid-cols-2" aria-label="Formulaire de contact">
              <Field id="nom" label="Nom & Prénom" error={errors.nom}>
                <input
                  id="nom"
                  name="nom"
                  autoComplete="name"
                  placeholder="Votre nom"
                  value={values.nom}
                  onChange={update}
                  aria-invalid={!!errors.nom}
                  aria-describedby={describedBy('nom')}
                  className={`${fieldCls(errors.nom)} h-[49px]`}
                />
              </Field>
              <Field id="email" label="E-mail" error={errors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Votre e-mail"
                  value={values.email}
                  onChange={update}
                  aria-invalid={!!errors.email}
                  aria-describedby={describedBy('email')}
                  className={`${fieldCls(errors.email)} h-[49px]`}
                />
              </Field>
              <Field id="objet" label="Objet de votre demande" error={errors.objet} className="sm:col-span-2">
                <select
                  id="objet"
                  name="objet"
                  value={values.objet}
                  onChange={update}
                  aria-invalid={!!errors.objet}
                  aria-describedby={describedBy('objet')}
                  className={`${fieldCls(errors.objet)} h-[49px] appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2214%22 height=%228%22><path d=%22M1 1l6 6 6-6%22 fill=%22none%22 stroke=%22%231f1a17%22 stroke-width=%221.4%22/></svg>')] bg-[position:right_20px_center] bg-no-repeat ${
                    values.objet ? '' : 'text-[13px]! font-medium text-black/33!'
                  }`}
                >
                  <option value="" disabled>
                    Sélectionnez
                  </option>
                  {objets.map((o) => (
                    <option key={o} value={o} className="text-encre">
                      {o}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="message" label="Votre message" error={errors.message} className="sm:col-span-2">
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Écrivez ici…"
                  value={values.message}
                  onChange={update}
                  aria-invalid={!!errors.message}
                  aria-describedby={describedBy('message')}
                  className={`${fieldCls(errors.message)} block min-h-[105px] resize-y py-4`}
                />
              </Field>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="group mt-2 inline-flex h-14 w-full max-w-[256px] items-center justify-center gap-3 rounded-[40px] bg-terre-fonce text-base font-bold text-white transition-colors hover:bg-terre sm:ml-3.5"
                >
                  Envoyer
                  <img
                    src={arrowLong}
                    alt=""
                    width="27"
                    height="11"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </div>
            </form>
          )}
        </Reveal>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-[26px] hidden w-[90px] xl:block">
        <Collage
          width={90.003}
          height={152.157}
          items={[
            { x: 0, y: 0, w: 90.003, h: 152.157, iw: 75, ih: 145, rotate: -173.89, flipY: true, src: planteGravure, cover: true },
          ]}
        />
      </div>
    </div>
  )
}
