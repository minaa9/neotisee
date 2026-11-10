import { useState } from 'react'
import { useSearchParams } from 'react-router'
import PageHeader from '../components/PageHeader'
import { Field, PillChoice } from '../components/forms'
import { EMAIL_RE, inputCls, openMail, selectArrow } from '../components/formUtils'
import { Button, Reveal, Star } from '../components/ui'
import { events } from '../data/events'
import { contact } from '../data/navigation'
import heroImage from '../assets/ateliers/broderie.webp'
import fuseau from '../assets/association/fuseau.webp'
import pastille from '../assets/v3/contact/pastille.svg'
import iconeMail from '../assets/v3/contact/icone-mail.svg'
import iconeTel from '../assets/v3/contact/icone-tel.svg'
import iconeLieu from '../assets/v3/contact/icone-lieu.svg'

const OBJETS = {
  prestation: 'Demande de prestation (atelier, démonstration, présentation)',
  inscription: 'Inscription à un rendez-vous',
  partenariat: 'Partenariat ou projet commun',
  question: 'Une autre question',
}

const infos = [
  { icon: iconeMail, label: 'E-mail', value: contact.email, href: `mailto:${contact.email}` },
  { icon: iconeTel, label: 'Téléphone', value: contact.phone, href: contact.phoneHref },
  { icon: iconeLieu, label: 'Localisation', value: contact.city },
]

/** Page Contact V3 (Figma 354:428) */
export default function ContactPage() {
  const [params] = useSearchParams()
  const rdv = events.find((e) => e.id === params.get('rdv'))
  const initialObjet = OBJETS[params.get('objet')] ? params.get('objet') : ''

  const [values, setValues] = useState({
    profil: initialObjet === 'inscription' ? 'Un particulier' : 'Une institution',
    nom: '',
    email: '',
    objet: initialObjet,
    message: rdv ? `Bonjour, je souhaite m’inscrire au rendez-vous « ${rdv.titre} ».` : '',
    accord: false,
  })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const set = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((e) => ({ ...e, [name]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const found = {}
    if (!values.nom.trim()) found.nom = 'Indiquez votre nom et prénom.'
    if (!values.email.trim()) found.email = 'Indiquez votre adresse e-mail.'
    else if (!EMAIL_RE.test(values.email.trim())) found.email = 'Cette adresse e-mail ne semble pas valide.'
    if (!values.objet) found.objet = 'Choisissez l’objet de votre demande.'
    if (values.message.trim().length < 10) found.message = 'Votre message doit contenir au moins 10 caractères.'
    if (!values.accord) found.accord = 'Merci d’accepter l’utilisation de vos données pour vous répondre.'
    setErrors(found)
    if (Object.keys(found).length) {
      document.getElementById(`ct-${Object.keys(found)[0]}`)?.focus()
      return
    }
    openMail(
      contact.email,
      `[Site Néotisse] ${OBJETS[values.objet]}`,
      `${values.message}\n\n— ${values.nom} (${values.profil.toLowerCase()}) · ${values.email}`,
    )
    setSent(true)
  }

  const described = (n) => (errors[n] ? `ct-${n}-erreur` : undefined)

  return (
    <>
      <PageHeader
        title="Contact"
        subtitle={
          <>
            Une question ?
            <br />
            Une envie de projet ?
          </>
        }
        text="Un atelier pour une école, un musée, un festival ? Écrivez-nous, nous serons ravies d’échanger avec vous."
        image={heroImage}
        imageAlt="Broderie de fils de laine verte et beige sur toile de lin"
      />

      <section aria-label="Coordonnées et formulaire" className="relative bg-creme pb-24 xl:h-[900px] xl:pt-10 xl:pb-0">
        <div className="container-site flex flex-col gap-14 lg:flex-row lg:items-start lg:justify-between">
          {/* Coordonnées */}
          <Reveal className="relative lg:w-[460px] lg:shrink-0 lg:pt-5">
            <ul className="flex flex-col gap-11">
              {infos.map((info) => (
                <li key={info.label} className="flex items-center gap-6">
                  <span className="relative flex size-14 shrink-0 items-center justify-center">
                    <img src={pastille} alt="" className="absolute inset-0 size-full" />
                    <img src={info.icon} alt="" width="24" height="24" className="relative" />
                  </span>
                  <p>
                    <span className="block text-label text-brique">{info.label}</span>
                    {info.href ? (
                      <a href={info.href} className="font-serif text-[24px] leading-[1.18] text-brun hover:text-terre-cuite sm:text-[26px]">
                        {info.value}
                      </a>
                    ) : (
                      <span className="font-serif text-[24px] leading-[1.18] text-brun sm:text-[26px]">{info.value}</span>
                    )}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-12 rounded-[28px] bg-peche px-10 pt-7 pb-8 xl:mt-[74px]">
              <p className="flex items-center gap-3 font-serif text-[26px] leading-[1.18] text-brun">
                <Star className="-ml-[7px] size-3.5" />
                Vous êtes une institution ?
              </p>
              <p className="mt-4 text-petit text-brun-doux">
                Musées, universités, collectivités, festivals : nos ateliers existent en format
                participatif, en démonstration ou en présentation.
              </p>
            </div>

            <img
              src={fuseau}
              alt=""
              aria-hidden="true"
              className="pointer-events-none mt-8 ml-[290px] hidden h-[240px] w-[70px] rotate-[14deg] object-contain lg:block"
            />
          </Reveal>

          {/* Formulaire */}
          <Reveal delay={120} className="w-full rounded-[32px] border border-brun/6 bg-lin p-6 sm:p-[43px] lg:w-[640px] lg:shrink-0">
            {sent ? (
              <div role="status">
                <p className="font-serif text-[34px] leading-[1.18] text-brun">Merci, à très vite !</p>
                <p className="mt-3 text-courant text-brun-doux">
                  Votre messagerie s’est ouverte avec votre message pré-rempli : il ne vous reste plus
                  qu’à l’envoyer. Si rien ne s’est ouvert, écrivez-nous à{' '}
                  <a href={`mailto:${contact.email}`} className="text-terre-cuite underline">
                    {contact.email}
                  </a>
                  .
                </p>
                <button type="button" onClick={() => setSent(false)} className="mt-6 text-petit text-terre-cuite underline">
                  Écrire un autre message
                </button>
              </div>
            ) : (
              <form noValidate onSubmit={submit} className="flex flex-col gap-[22px]" aria-label="Formulaire de contact">
                <fieldset>
                  <legend className="mb-2.5 text-label text-brun">Vous êtes</legend>
                  <PillChoice
                    name="profil"
                    options={['Une institution', 'Un particulier']}
                    value={values.profil}
                    onChange={(v) => set('profil', v)}
                  />
                </fieldset>
                <Field id="ct-nom" label="Nom & prénom" error={errors.nom}>
                  <input
                    id="ct-nom"
                    autoComplete="name"
                    placeholder="Votre nom"
                    value={values.nom}
                    onChange={(e) => set('nom', e.target.value)}
                    aria-invalid={!!errors.nom}
                    aria-describedby={described('nom')}
                    className={`${inputCls(errors.nom)} h-[54px]`}
                  />
                </Field>
                <Field id="ct-email" label="E-mail" error={errors.email}>
                  <input
                    id="ct-email"
                    type="email"
                    autoComplete="email"
                    placeholder="Votre e-mail"
                    value={values.email}
                    onChange={(e) => set('email', e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={described('email')}
                    className={`${inputCls(errors.email)} h-[54px]`}
                  />
                </Field>
                <Field id="ct-objet" label="Objet de votre demande" error={errors.objet}>
                  <select
                    id="ct-objet"
                    value={values.objet}
                    onChange={(e) => set('objet', e.target.value)}
                    aria-invalid={!!errors.objet}
                    aria-describedby={described('objet')}
                    className={`${inputCls(errors.objet)} ${selectArrow} h-[54px] ${values.objet ? '' : 'text-brun-doux/80'}`}
                  >
                    <option value="">Sélectionnez</option>
                    {Object.entries(OBJETS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id="ct-message" label="Votre message" error={errors.message}>
                  <textarea
                    id="ct-message"
                    rows={5}
                    placeholder="Écrivez ici…"
                    value={values.message}
                    onChange={(e) => set('message', e.target.value)}
                    aria-invalid={!!errors.message}
                    aria-describedby={described('message')}
                    className={`${inputCls(errors.message)} block min-h-[130px] resize-y py-4`}
                  />
                </Field>
                <div>
                  <label className="flex cursor-pointer items-start gap-3 text-petit text-brun-doux">
                    <input
                      id="ct-accord"
                      type="checkbox"
                      checked={values.accord}
                      onChange={(e) => set('accord', e.target.checked)}
                      aria-invalid={!!errors.accord}
                      aria-describedby={described('accord')}
                      className="mt-0.5 size-[18px] shrink-0 cursor-pointer appearance-none rounded-[5px] border border-brun/40 bg-lin bg-center bg-no-repeat checked:border-terre-cuite checked:bg-terre-cuite checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%228%22><path d=%22M1 4l3 3 5-6%22 fill=%22none%22 stroke=%22white%22 stroke-width=%221.6%22/></svg>')]"
                    />
                    J’accepte que mes données soient utilisées uniquement pour répondre à ma demande.
                  </label>
                  {errors.accord && (
                    <p id="ct-accord-erreur" className="mt-1.5 text-petit text-terre-cuite">
                      {errors.accord}
                    </p>
                  )}
                </div>
                <Button type="submit" variant="plein" className="self-start">
                  Envoyer
                </Button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </>
  )
}
