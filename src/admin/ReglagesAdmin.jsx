import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { changePassword, getSession, isLive, list, resetDemo, saveSetting, uploadImage } from '../lib/store'
import { DEFAUTS, EMPLACEMENTS } from '../lib/reglages'
import { Btn, Champ, PageTitle } from './kit'
import { useTable, useToast } from './hooks'
import { fieldCls } from './format'

const ONGLETS = [
  { id: 'coordonnees', label: 'Coordonnées', icon: 'M4 6h16v12H4V6Zm0 0 8 7 8-7' },
  { id: 'reseaux', label: 'Réseaux sociaux', icon: 'M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Zm5 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5-2h.01' },
  { id: 'photos', label: 'Photos du site', icon: 'M4 6h16v12H4V6Zm0 9 4-4 4 4 3-3 5 5M15 9h.01' },
  { id: 'annonce', label: 'Bandeau d’annonce', icon: 'M4 10v4h3l6 4V6L7 10H4Zm13-1a4 4 0 0 1 0 6' },
  { id: 'compte', label: 'Compte et données', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0' },
]

function Icon({ d }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

/** Carte de réglage : titre, explication, contenu, bouton Enregistrer. */
function Carte({ titre, texte, children, onSave, dirty, busy }) {
  return (
    <section className="rounded-[28px] bg-lin p-6 sm:p-8">
      <h2 className="font-serif text-[30px] leading-tight">{titre}</h2>
      {texte && <p className="mt-2 max-w-[560px] text-petit text-brun-doux">{texte}</p>}
      <div className="mt-7">{children}</div>
      {onSave && (
        <div className="mt-8 flex flex-wrap items-center justify-end gap-4 border-t border-brun/10 pt-5">
          {dirty && <span className="text-[13px] text-brun-doux">Modifications non enregistrées</span>}
          <Btn onClick={onSave} disabled={!dirty || busy}>
            {busy ? 'Enregistrement…' : 'Enregistrer'}
          </Btn>
        </div>
      )}
    </section>
  )
}

/** Formulaire d'un groupe de réglages (coordonnées, réseaux, annonce). */
function useGroupe(id, valeur, toast) {
  const [v, setV] = useState(valeur)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const dirty = JSON.stringify(v) !== JSON.stringify(valeur)
  const set = (k) => (e) => setV((o) => ({ ...o, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  const save = async (check) => {
    const err = check?.(v)
    if (err) return setError(err)
    setError('')
    setBusy(true)
    try {
      await saveSetting(id, v)
      toast('Réglages enregistrés : le site est à jour')
    } catch (e) {
      setError(e.message || 'Enregistrement impossible.')
    } finally {
      setBusy(false)
    }
  }
  return { v, set, dirty, busy, error, save }
}

const Erreur = ({ children }) =>
  children ? (
    <p role="alert" className="mt-4 text-petit text-terre-cuite">
      {children}
    </p>
  ) : null

function Coordonnees({ valeur, toast }) {
  const g = useGroupe('coordonnees', valeur, toast)
  const check = (v) => (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()) ? 'L’adresse e-mail ne semble pas valide.' : null)
  return (
    <Carte
      titre="Coordonnées"
      texte="Affichées dans le pied de page, le menu, la page Contact et les pages légales. Les messages du formulaire restent aussi dans votre boîte de réception."
      onSave={() => g.save(check)}
      dirty={g.dirty}
      busy={g.busy}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Champ label="Adresse e-mail" className="sm:col-span-2">
          <input type="email" value={g.v.email} onChange={g.set('email')} className={fieldCls} />
        </Champ>
        <Champ label="Téléphone">
          <input type="tel" value={g.v.telephone} onChange={g.set('telephone')} className={fieldCls} />
        </Champ>
        <Champ label="Ville">
          <input value={g.v.ville} onChange={g.set('ville')} className={fieldCls} />
        </Champ>
      </div>
      <Erreur>{g.error}</Erreur>
    </Carte>
  )
}

function Reseaux({ valeur, toast }) {
  const g = useGroupe('reseaux', valeur, toast)
  const check = (v) => (Object.values(v).some((u) => u && !/^https:\/\//.test(u)) ? 'Les adresses doivent commencer par https://' : null)
  return (
    <Carte titre="Réseaux sociaux" texte="Laissez un champ vide pour masquer le réseau sur le site." onSave={() => g.save(check)} dirty={g.dirty} busy={g.busy}>
      <div className="grid gap-5">
        <Champ label="Instagram" hint="Ex. https://www.instagram.com/neotisse">
          <input type="url" value={g.v.instagram} onChange={g.set('instagram')} className={fieldCls} placeholder="https://www.instagram.com/…" />
        </Champ>
        <Champ label="Facebook" hint="Ex. https://www.facebook.com/neotisse">
          <input type="url" value={g.v.facebook} onChange={g.set('facebook')} className={fieldCls} placeholder="https://www.facebook.com/…" />
        </Champ>
      </div>
      <Erreur>{g.error}</Erreur>
    </Carte>
  )
}

function Annonce({ valeur, toast }) {
  const g = useGroupe('annonce', valeur, toast)
  const check = (v) => (v.actif && !v.texte.trim() ? 'Écrivez le texte du bandeau avant de l’activer.' : null)
  return (
    <Carte
      titre="Bandeau d’annonce"
      texte="Un court message affiché tout en haut du site : inscriptions ouvertes, prochain festival, fermeture exceptionnelle…"
      onSave={() => g.save(check)}
      dirty={g.dirty}
      busy={g.busy}
    >
      <label className="flex items-center justify-between gap-6 rounded-[20px] border border-brun/10 bg-creme px-5 py-4">
        <span>
          <span className="block font-serif text-[20px]">Afficher le bandeau</span>
          <span className="block text-[13px] text-brun-doux">Visible sur toutes les pages du site.</span>
        </span>
        <input type="checkbox" checked={g.v.actif} onChange={g.set('actif')} className="peer sr-only" />
        <span aria-hidden="true" className="relative h-7 w-12 shrink-0 rounded-full bg-brun/20 transition-colors peer-checked:bg-terre-cuite peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-terre-cuite after:absolute after:top-1 after:left-1 after:size-5 after:rounded-full after:bg-lin after:transition-transform peer-checked:after:translate-x-5" />
      </label>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Champ label="Texte" className="sm:col-span-2" hint={`${g.v.texte.length} / 140 caractères`}>
          <input maxLength={140} value={g.v.texte} onChange={g.set('texte')} className={fieldCls} placeholder="Les inscriptions pour l’atelier filage de décembre sont ouvertes !" />
        </Champ>
        <Champ label="Lien (facultatif)" hint="Une page du site (/calendrier) ou une adresse complète.">
          <input value={g.v.lien} onChange={g.set('lien')} className={fieldCls} placeholder="/calendrier" />
        </Champ>
        <Champ label="Texte du lien">
          <input value={g.v.libelle} onChange={g.set('libelle')} className={fieldCls} placeholder="Je m’inscris" />
        </Champ>
      </div>

      {/* Aperçu */}
      <p className="mt-7 mb-2 text-label text-brun">Aperçu</p>
      <div className={`overflow-hidden rounded-[16px] transition-opacity ${g.v.actif ? '' : 'opacity-45'}`}>
        <div className="flex min-h-9 items-center justify-center gap-3 bg-brun px-4 py-2 text-center text-[13px] text-lin">
          <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-poudre" />
          <span>
            {g.v.texte || 'Votre message ici'}
            {g.v.lien && <span className="ml-2 text-poudre underline underline-offset-2">{g.v.libelle || 'En savoir plus'} →</span>}
          </span>
        </div>
      </div>
      {!g.v.actif && <p className="mt-2 text-[12px] text-brun-doux">Le bandeau est désactivé : il n’apparaît pas sur le site.</p>}
      <Erreur>{g.error}</Erreur>
    </Carte>
  )
}

/** Un emplacement de photo : aperçu, remplacer, revenir à l'origine. */
function PhotoSlot({ slot, value, onChange }) {
  const input = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const send = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return setError('Choisissez une image (JPG, PNG, WebP).')
    if (file.size > 8 * 1024 * 1024) return setError('Image trop lourde (8 Mo maximum).')
    setError('')
    setBusy(true)
    try {
      await onChange(await uploadImage(file))
    } catch (e) {
      setError(e.message || 'Envoi impossible.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <li className="flex flex-col overflow-hidden rounded-[22px] border border-brun/10 bg-creme">
      <div
        className="group relative aspect-[16/10] overflow-hidden"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          send(e.dataTransfer.files[0])
        }}
      >
        <img src={value || slot.origine} alt="" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[12px] shadow-sm ${value ? 'bg-[#56663f] text-lin' : 'bg-creme/95 text-brun'}`}>
          {value ? '✓ Personnalisée' : 'Photo d’origine'}
        </span>
        {busy && <span className="absolute inset-0 flex items-center justify-center bg-brun/40 text-[14px] text-lin">Envoi…</span>}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-label text-brique">{slot.page}</p>
        <p className="mt-1 font-serif text-[20px] leading-tight">{slot.label}</p>
        <p className="mt-1 text-[12px] text-brun-doux">{slot.format}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <Btn variant="contour" onClick={() => input.current.click()} disabled={busy}>
            Remplacer
          </Btn>
          {value && (
            <Btn variant="discret" onClick={() => onChange('')}>
              Remettre l’originale
            </Btn>
          )}
        </div>
        {error && <p className="mt-2 text-[13px] text-terre-cuite">{error}</p>}
      </div>
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => send(e.target.files[0])} />
    </li>
  )
}

function Photos({ valeur, toast }) {
  const change = (id) => async (url) => {
    const next = { ...valeur }
    if (url) next[id] = url
    else delete next[id]
    await saveSetting('photos', next)
    toast(url ? 'Photo remplacée sur le site' : 'Photo d’origine remise')
  }
  return (
    <Carte titre="Photos du site" texte="Remplacez les grandes photos des pages. Glissez une image sur une carte ou cliquez sur « Remplacer ». Le changement est immédiat.">
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 [&>*]:min-w-0">
        {EMPLACEMENTS.map((slot) => (
          <PhotoSlot key={slot.id} slot={slot} value={valeur[slot.id]} onChange={change(slot.id)} />
        ))}
      </ul>
      <p className="mt-5 text-[12px] text-brun-doux">Les photos des ateliers, des actualités et des événements se changent dans leur rubrique.</p>
    </Carte>
  )
}

/** Export CSV des messages (ouvrable dans Excel, Numbers, Google Sheets). */
async function exporterMessages() {
  const rows = await list('messages')
  const cols = [
    ['created_at', 'Date'],
    ['nom', 'Nom'],
    ['email', 'E-mail'],
    ['profil', 'Profil'],
    ['objet', 'Objet'],
    ['rdv', 'Rendez-vous'],
    ['message', 'Message'],
    ['lu', 'Lu'],
  ]
  const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = [cols.map(([, l]) => cell(l)).join(';'), ...rows.map((r) => cols.map(([k]) => cell(k === 'lu' ? (r.lu ? 'oui' : 'non') : r[k])).join(';'))].join('\n')
  const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `neotisse-messages-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
  return rows.length
}

function Compte({ toast }) {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState({ a: '', b: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [armed, setArmed] = useState(false)
  useEffect(() => {
    getSession().then((s) => setEmail(s?.user?.email || ''))
  }, [])

  const changer = async (e) => {
    e.preventDefault()
    if (pw.a.length < 8) return setError('Au moins 8 caractères.')
    if (pw.a !== pw.b) return setError('Les deux mots de passe ne sont pas identiques.')
    setError('')
    setBusy(true)
    try {
      await changePassword(pw.a)
      setPw({ a: '', b: '' })
      toast('Mot de passe modifié')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Carte titre="Votre compte" texte={isLive ? 'Seuls les comptes créés par l’association dans Supabase peuvent se connecter.' : 'Mode démo : aucun mot de passe n’est nécessaire.'}>
        <div className="flex items-center gap-4 rounded-[20px] border border-brun/10 bg-creme p-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-terre-cuite font-serif text-[22px] text-lin uppercase">{email.slice(0, 1) || '·'}</span>
          <span className="min-w-0">
            <span className="block truncate text-[15px]">{email}</span>
            <span className="block text-[13px] text-brun-doux">{isLive ? 'Membre de l’équipe' : 'Session de démonstration'}</span>
          </span>
        </div>

        {isLive && (
          <form onSubmit={changer} className="mt-6">
            <p className="text-label text-brun">Changer le mot de passe</p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <input type="password" autoComplete="new-password" placeholder="Nouveau mot de passe" value={pw.a} onChange={(e) => setPw((o) => ({ ...o, a: e.target.value }))} className={fieldCls} aria-label="Nouveau mot de passe" />
              <input type="password" autoComplete="new-password" placeholder="Confirmer" value={pw.b} onChange={(e) => setPw((o) => ({ ...o, b: e.target.value }))} className={fieldCls} aria-label="Confirmer le mot de passe" />
            </div>
            <Erreur>{error}</Erreur>
            <div className="mt-4 flex justify-end">
              <Btn type="submit" disabled={busy || !pw.a}>
                {busy ? 'Modification…' : 'Changer le mot de passe'}
              </Btn>
            </div>
          </form>
        )}
      </Carte>

      <Carte titre="Vos données" texte="Récupérez les messages reçus dans un tableur (Excel, Numbers, Google Sheets).">
        <div className="flex flex-wrap gap-3">
          <Btn variant="contour" onClick={async () => toast(`${await exporterMessages()} message(s) exporté(s)`)}>
            Exporter les messages (CSV)
          </Btn>
          {!isLive && (
            <Btn
              variant={armed ? 'plein' : 'danger'}
              onClick={() => {
                if (!armed) return setArmed(true)
                resetDemo()
                setArmed(false)
                toast('Démo réinitialisée')
              }}
            >
              {armed ? 'Confirmer la réinitialisation ?' : 'Réinitialiser la démo'}
            </Btn>
          )}
        </div>
      </Carte>
    </div>
  )
}

/** Page Réglages du back-office. */
export default function ReglagesAdmin() {
  const { rows, error } = useTable('reglages')
  const [params, setParams] = useSearchParams()
  const [toast, setToast] = useToast()
  const onglet = ONGLETS.some((o) => o.id === params.get('onglet')) ? params.get('onglet') : 'coordonnees'

  const valeurs = structuredClone(DEFAUTS)
  ;(rows || []).forEach((r) => {
    if (r.id in valeurs && r.valeur) valeurs[r.id] = { ...valeurs[r.id], ...r.valeur }
  })
  // Le formulaire repart des valeurs enregistrées quand elles changent.
  const cle = (id) => `${id}-${JSON.stringify(valeurs[id])}`

  return (
    <div>
      <PageTitle eyebrow="Configuration" title={<>Les <em>réglages</em></>} />
      {error && <p className="mb-6 rounded-[20px] border border-terre-cuite/30 bg-lin p-5 text-terre-cuite">{error}</p>}

      <div className="grid gap-8 lg:grid-cols-[230px_1fr] [&>*]:min-w-0">
        <nav aria-label="Rubriques des réglages" className="lg:sticky lg:top-8 lg:self-start">
          <ul className="flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-col lg:overflow-visible">
            {ONGLETS.map((o) => (
              <li key={o.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setParams({ onglet: o.id }, { replace: true })}
                  aria-current={onglet === o.id ? 'page' : undefined}
                  className={`flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-left text-[14px] whitespace-nowrap transition-colors ${
                    onglet === o.id ? 'bg-brun text-lin' : 'text-brun hover:bg-lin'
                  }`}
                >
                  <Icon d={o.icon} />
                  {o.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div key={onglet} className="animate-[fiche_0.5s_cubic-bezier(0.22,1,0.36,1)_both]">
          {!rows && !error ? (
            <p className="p-6 text-brun-doux">Chargement…</p>
          ) : (
            <>
              {onglet === 'coordonnees' && <Coordonnees key={cle('coordonnees')} valeur={valeurs.coordonnees} toast={setToast} />}
              {onglet === 'reseaux' && <Reseaux key={cle('reseaux')} valeur={valeurs.reseaux} toast={setToast} />}
              {onglet === 'photos' && <Photos valeur={valeurs.photos} toast={setToast} />}
              {onglet === 'annonce' && <Annonce key={cle('annonce')} valeur={valeurs.annonce} toast={setToast} />}
              {onglet === 'compte' && <Compte toast={setToast} />}
            </>
          )}
        </div>
      </div>
      {toast}
    </div>
  )
}
