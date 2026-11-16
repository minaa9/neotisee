import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Logo } from '../components/ui'
import { attenteConnexion, definirMotDePasse, demoAllowed, isLive, ouvrirLienRecuperation, resetPassword, signIn } from '../lib/store'
import { MOTION_OK, gsap, useGSAP } from '../motion/gsap'
import { Btn, Champ } from './kit'
import { fieldCls } from './format'
import { forceMotDePasse } from './securite'

/** Champ mot de passe avec bouton pour l'afficher. */
export function MotDePasse({ value, onChange, autoComplete = 'current-password', placeholder, label, id }) {
  const [voir, setVoir] = useState(false)
  return (
    <div className="relative">
      <input
        id={id}
        type={voir ? 'text' : 'password'}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={label}
        className={`${fieldCls} pr-24`}
      />
      <button type="button" onClick={() => setVoir((v) => !v)} aria-pressed={voir} className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full px-3 py-1.5 text-[12px] text-brun-doux transition-colors hover:bg-lin hover:text-brun">
        {voir ? 'Masquer' : 'Afficher'}
      </button>
    </div>
  )
}

/** Jauge de force du mot de passe (4 segments) et conseils. */
export function JaugeMotDePasse({ value }) {
  if (!value) return null
  const f = forceMotDePasse(value)
  const couleur = ['bg-terre-cuite', 'bg-terre-cuite', 'bg-[#D6A23A]', 'bg-[#7d8f6a]', 'bg-[#56663f]'][f.score]
  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i < Math.max(1, f.score) ? couleur : 'bg-brun/10'}`} />
        ))}
      </div>
      <p className="mt-1.5 text-[12px] text-brun-doux">
        <span className="text-brun">{f.libelle}</span>
        {f.conseils.length > 0 && <> · Ajoutez {f.conseils.join(', ')}.</>}
      </p>
    </div>
  )
}

/** Cadre commun des écrans de connexion : fil qui se dessine, carte claire. */
function Cadre({ children, onSubmit }) {
  const ref = useRef(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-login]', { y: 30, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.08 })
        gsap.from('[data-login-fil]', { drawSVG: 0, duration: 2.2, ease: 'power2.inOut' })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )
  const Tag = onSubmit ? 'form' : 'div'
  return (
    <div ref={ref} className="relative flex min-h-svh items-center justify-center overflow-hidden bg-creme px-5 py-10">
      <svg aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full">
        <path data-login-fil d="M-20 640 C 260 520, 420 760, 700 640 C 820 590, 860 560, 900 600 C 930 630, 880 670, 860 640 C 840 610, 920 560, 1000 580 C 1180 620, 1300 520, 1460 560" fill="none" stroke="#B4583D" strokeOpacity="0.5" strokeWidth="1.4" />
      </svg>
      <Tag onSubmit={onSubmit} className="relative w-full max-w-[440px] rounded-[32px] bg-lin p-8 shadow-[0_30px_80px_-40px_rgba(61,42,35,0.5)] sm:p-10">
        <div data-login className="flex items-center gap-3">
          <Logo />
          <span className="text-label text-brique">Espace équipe</span>
        </div>
        {children}
      </Tag>
    </div>
  )
}

const Titre = ({ children }) => (
  <h1 data-login className="mt-6 font-serif text-[42px] leading-[1.02] font-light [&_em]:italic">
    {children}
  </h1>
)
const Texte = ({ children }) => (
  <p data-login className="mt-3 text-petit text-brun-doux">
    {children}
  </p>
)
const Alerte = ({ children, ok }) =>
  children ? (
    <p role="alert" className={`mt-5 rounded-[14px] px-4 py-3 text-petit ${ok ? 'bg-[#7d8f6a]/15 text-[#56663f]' : 'bg-terre-cuite/10 text-terre-cuite'}`}>
      {children}
    </p>
  ) : null

/** Sur le site en ligne, tant que Supabase n'est pas branché : porte close. */
export function NonActive() {
  return (
    <Cadre>
      <Titre>
        Espace <em>fermé</em>
      </Titre>
      <Texte>
        L’espace de gestion n’est pas encore activé sur ce site. Il s’ouvrira dès que la base de données de l’association
        sera branchée (voir le guide <code className="rounded bg-creme px-1">docs/BACKOFFICE.md</code>).
      </Texte>
      <div data-login className="mt-8">
        <a href="/" className="link-fil text-[14px] text-brun-doux">
          ← Retour au site
        </a>
      </div>
    </Cadre>
  )
}

/** Connexion, avec « mot de passe oublié » sur la même carte. */
export function Connexion({ onDone }) {
  const [mode, setMode] = useState('connexion')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState(() =>
    new URLSearchParams(location.search).get('raison') === 'inactivite' ? 'Par sécurité, la session a été fermée après 30 minutes d’inactivité.' : '',
  )
  const [busy, setBusy] = useState(false)
  const [attente, setAttente] = useState(() => attenteConnexion())

  // Compte à rebours quand trop d'essais ont échoué.
  useEffect(() => {
    if (!attente) return
    const t = setTimeout(() => setAttente(attenteConnexion()), 1000)
    return () => clearTimeout(t)
  }, [attente])

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    setInfo('')
    try {
      if (mode === 'oubli') {
        await resetPassword(email.trim())
        setInfo('Si cette adresse correspond à un compte, un lien pour choisir un nouveau mot de passe vient d’y être envoyé. Pensez à regarder dans les indésirables.')
      } else {
        await signIn(email.trim(), password)
        onDone()
      }
    } catch (err) {
      setError(err.message)
      setAttente(attenteConnexion())
    } finally {
      setBusy(false)
    }
  }

  return (
    <Cadre onSubmit={submit}>
      <Titre>{mode === 'oubli' ? <>Mot de passe <em>oublié</em></> : <>Bon retour <em>parmi nous</em></>}</Titre>
      <Texte>
        {mode === 'oubli'
          ? 'Indiquez l’adresse de votre compte : vous recevrez un lien pour choisir un nouveau mot de passe.'
          : isLive
            ? 'Connectez-vous avec le compte de l’association.'
            : 'Mode démo (sur votre ordinateur uniquement) : saisissez n’importe quelle adresse pour entrer.'}
      </Texte>
      <div data-login className="mt-8 flex flex-col gap-5">
        <Champ label="Adresse e-mail">
          <input type="email" required={isLive} autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldCls} placeholder="vous@exemple.fr" />
        </Champ>
        {mode === 'connexion' && (
          <div>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <label htmlFor="mdp" className="text-label text-brun">
                Mot de passe
              </label>
              {isLive && (
                <button type="button" onClick={() => (setMode('oubli'), setError(''))} className="link-fil text-[13px] text-terre-cuite">
                  Mot de passe oublié ?
                </button>
              )}
            </div>
            <MotDePasse id="mdp" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        )}
      </div>
      <Alerte>{error}</Alerte>
      <Alerte ok>{info}</Alerte>
      <div data-login className="mt-8 flex items-center justify-between gap-4">
        {mode === 'oubli' ? (
          <button type="button" onClick={() => (setMode('connexion'), setInfo(''), setError(''))} className="link-fil text-[14px] text-brun-doux">
            ← Retour à la connexion
          </button>
        ) : (
          <a href="/" className="link-fil text-[14px] text-brun-doux">
            ← Retour au site
          </a>
        )}
        <Btn type="submit" disabled={busy || (mode === 'connexion' && attente > 0)}>
          {busy ? 'Un instant…' : mode === 'oubli' ? 'Envoyer le lien' : attente > 0 ? `Patientez ${attente} s` : 'Se connecter'}
        </Btn>
      </div>
      {isLive && mode === 'connexion' && (
        <p data-login className="mt-6 flex items-center gap-2 border-t border-brun/10 pt-5 text-[12px] text-brun-doux">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 10V8a6 6 0 1 1 12 0v2M5 10h14v10H5V10Z" />
          </svg>
          Connexion chiffrée · déconnexion automatique après 30 min d’inactivité
        </p>
      )}
      {!isLive && !demoAllowed && <Alerte>Le back-office n’est pas encore activé sur ce site.</Alerte>}
    </Cadre>
  )
}

/** Arrivée depuis le lien « mot de passe oublié » (ou l'invitation) reçu par e-mail. */
export function NouveauMotDePasse() {
  const navigate = useNavigate()
  const [etat, setEtat] = useState('verif') // verif | pret | erreur | fini
  const [error, setError] = useState('')
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    ouvrirLienRecuperation()
      .then((s) => setEtat(s ? 'pret' : 'erreur'))
      .catch((e) => {
        setError(e.message)
        setEtat('erreur')
      })
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    const f = forceMotDePasse(a)
    if (!f.valide) return setError(`Mot de passe trop faible : ajoutez ${f.conseils.join(', ') || 'de la longueur'}.`)
    if (a !== b) return setError('Les deux mots de passe ne sont pas identiques.')
    setBusy(true)
    setError('')
    try {
      await definirMotDePasse(a)
      setEtat('fini')
      setTimeout(() => navigate('/admin', { replace: true }), 1800)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (etat === 'verif')
    return (
      <Cadre>
        <Texte>Vérification du lien…</Texte>
      </Cadre>
    )
  if (etat === 'erreur')
    return (
      <Cadre>
        <Titre>
          Lien <em>expiré</em>
        </Titre>
        <Alerte>{error || 'Ce lien n’est plus valable.'}</Alerte>
        <div data-login className="mt-8">
          <a href="/admin/connexion" className="link-fil text-[14px] text-terre-cuite">
            Demander un nouveau lien →
          </a>
        </div>
      </Cadre>
    )
  if (etat === 'fini')
    return (
      <Cadre>
        <Titre>
          C’est <em>fait</em>
        </Titre>
        <Alerte ok>Votre nouveau mot de passe est enregistré. Ouverture du tableau de bord…</Alerte>
      </Cadre>
    )
  return (
    <Cadre onSubmit={submit}>
      <Titre>
        Nouveau <em>mot de passe</em>
      </Titre>
      <Texte>Choisissez un mot de passe que personne d’autre ne connaît. Il remplace l’ancien sur tous vos appareils.</Texte>
      <div data-login className="mt-8 flex flex-col gap-5">
        <div>
          <span className="mb-2 block text-label text-brun">Nouveau mot de passe</span>
          <MotDePasse value={a} onChange={(e) => setA(e.target.value)} autoComplete="new-password" label="Nouveau mot de passe" />
          <JaugeMotDePasse value={a} />
        </div>
        <div>
          <span className="mb-2 block text-label text-brun">Confirmer</span>
          <MotDePasse value={b} onChange={(e) => setB(e.target.value)} autoComplete="new-password" label="Confirmer le mot de passe" />
        </div>
      </div>
      <Alerte>{error}</Alerte>
      <div data-login className="mt-8 flex justify-end">
        <Btn type="submit" disabled={busy || !a}>
          {busy ? 'Enregistrement…' : 'Enregistrer'}
        </Btn>
      </div>
    </Cadre>
  )
}
