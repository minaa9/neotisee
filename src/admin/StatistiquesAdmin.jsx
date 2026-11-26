import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { saveSetting } from '../lib/store'
import { DEFAUTS } from '../lib/reglages'
import { MOTION_OK, gsap, useGSAP } from '../motion/gsap'
import { Badge, Btn, Champ, Drawer, PageTitle } from './kit'
import { useTable, useToast } from './hooks'
import { fieldCls, formatDate } from './format'
import { APPAREILS, FIDELITE, PAGES, SOURCES, chargerStatistiques, debutPeriode, nombre } from './statistiques'
import { Anneau, Classement, Courbe, Jauge } from './graphiques'

const PERIODES = [
  { jours: 7, label: '7 jours' },
  { jours: 28, label: '28 jours' },
  { jours: 90, label: '3 mois' },
]

/** Évolution par rapport à la période précédente : « ↗ +12 % ». */
function Evolution({ actuel, precedent, clair }) {
  if (!precedent) return <span className={clair ? 'text-lin/75' : 'text-brun-doux'}>Pas de comparaison possible</span>
  const pc = Math.round(((actuel - precedent) / precedent) * 100)
  const ton = clair ? 'text-lin' : pc >= 0 ? 'text-[#56663f]' : 'text-terre-cuite'
  return (
    <span className={ton}>
      {pc >= 0 ? '↗' : '↘'} {pc > 0 ? '+' : ''}
      {pc} % <span className={clair ? 'text-lin/75' : 'text-brun-doux'}>vs période précédente</span>
    </span>
  )
}

/** Grande carte chiffrée (même dessin que le tableau de bord). */
function Carte({ label, valeur, suffixe = '', actuel, precedent, accent }) {
  return (
    <div data-stat className={`relative h-full overflow-hidden rounded-[28px] p-6 ${accent ? 'bg-terre-cuite text-lin' : 'bg-lin text-brun'}`}>
      <svg aria-hidden="true" viewBox="0 0 120 120" className="absolute -right-6 -bottom-6 size-28 opacity-30">
        <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="1" />
        <ellipse cx="60" cy="60" rx="50" ry="18" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(30 60 60)" />
        <ellipse cx="60" cy="60" rx="50" ry="30" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(-50 60 60)" />
      </svg>
      <span className={`block text-label ${accent ? 'text-lin/80' : 'text-brique'}`}>{label}</span>
      <span className="mt-4 block font-serif text-[56px] leading-none font-light [font-feature-settings:'lnum']">
        {valeur}
        {suffixe && <span className="ml-1 text-[28px]">{suffixe}</span>}
      </span>
      <span className="mt-3 block text-[13px]">
        <Evolution actuel={actuel} precedent={precedent} clair={accent} />
      </span>
    </div>
  )
}

/** Petite tuile chiffrée. */
function Tuile({ label, valeur, detail }) {
  return (
    <div data-stat className="rounded-[20px] border border-brun/10 bg-creme p-4">
      <p className="text-label text-brique">{label}</p>
      <p className="mt-2 font-serif text-[32px] leading-none [font-feature-settings:'lnum']">{valeur}</p>
      {detail && <p className="mt-2 text-[12px] text-brun-doux">{detail}</p>}
    </div>
  )
}

function Bloc({ titre, italique, aside, children, className = '' }) {
  return (
    <section data-bloc className={`rounded-[28px] bg-lin p-6 sm:p-8 ${className}`}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-serif text-[30px] leading-tight">
          {titre} {italique && <em>{italique}</em>}
        </h2>
        {aside && <p className="text-[13px] text-brun-doux">{aside}</p>}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  )
}

const duree = (s) => {
  const m = Math.floor(s / 60)
  const sec = Math.round(s % 60)
  return m ? `${m} min ${String(sec).padStart(2, '0')}` : `${sec} s`
}

/** Les indicateurs du plan de pilotage, avec leurs seuils mensuels. */
const KPI = [
  { cle: 'generate_lead', label: 'Demandes envoyées', detail: 'Formulaire de contact et de devis', objectif: true },
  { cle: 'click_contact', label: 'Clics sur le contact', detail: 'E-mail et téléphone' },
  { cle: 'click_event', label: 'Interactions agenda', detail: 'Clics sur les événements' },
  { cle: 'form_start', label: 'Formulaires commencés', detail: 'Premier champ rempli' },
]

function statut(mensuel, o) {
  if (mensuel < o.seuilBas) return { ton: 'alerte', label: 'Alerte négative' }
  if (mensuel > o.seuilHaut) return { ton: 'ok', label: 'Alerte positive' }
  return { ton: 'neutre', label: 'Zone normale' }
}

/** Formulaire « Modifier les objectifs » (enregistré dans Réglages › objectifs). */
function Objectifs({ valeur, onClose, toast }) {
  const [v, setV] = useState({ ...valeur })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const set = (k) => (e) => setV((o) => ({ ...o, [k]: e.target.value }))
  const save = async (e) => {
    e.preventDefault()
    const n = { seuilBas: Number(v.seuilBas), seuilHaut: Number(v.seuilHaut), objectifDemandes: Number(v.objectifDemandes) }
    if (Object.values(n).some((x) => !Number.isFinite(x) || x < 0)) return setError('Indiquez des nombres positifs.')
    if (n.seuilBas >= n.seuilHaut) return setError('Le seuil bas doit être plus petit que le seuil haut.')
    setBusy(true)
    try {
      await saveSetting('objectifs', n)
      toast('Objectifs enregistrés')
      onClose()
    } catch (err) {
      setError(err.message || 'Enregistrement impossible.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <form onSubmit={save} className="flex flex-col gap-5">
      <p className="text-petit text-brun-doux">Les seuils s’appliquent à chaque indicateur, ramené à un mois (rythme mensuel).</p>
      <Champ label="Seuil bas (alerte négative en dessous)" hint="Par défaut : 3 actions par mois">
        <input type="number" min="0" value={v.seuilBas} onChange={set('seuilBas')} className={fieldCls} />
      </Champ>
      <Champ label="Seuil haut (alerte positive au-dessus)" hint="Par défaut : 10 actions par mois">
        <input type="number" min="0" value={v.seuilHaut} onChange={set('seuilHaut')} className={fieldCls} />
      </Champ>
      <Champ label="Objectif de demandes par mois" hint="Le cahier des charges vise 2 à 3 demandes de devis par mois">
        <input type="number" min="0" value={v.objectifDemandes} onChange={set('objectifDemandes')} className={fieldCls} />
      </Champ>
      {error && (
        <p role="alert" className="text-petit text-terre-cuite">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-3">
        <Btn variant="contour" onClick={onClose}>
          Annuler
        </Btn>
        <Btn type="submit" disabled={busy}>
          {busy ? 'Enregistrement…' : 'Enregistrer'}
        </Btn>
      </div>
    </form>
  )
}

/** Page Statistiques : les chiffres de Google Analytics 4, dans le back-office. */
export default function StatistiquesAdmin() {
  const ref = useRef(null)
  const [jours, setJours] = useState(28)
  const [charge, setCharge] = useState(null)
  const [edition, setEdition] = useState(false)
  const [toast, setToast] = useToast()
  const reglages = useTable('reglages')
  const messages = useTable('messages')
  const objectifs = { ...DEFAUTS.objectifs, ...(reglages.rows?.find((r) => r.id === 'objectifs')?.valeur || {}) }

  useEffect(() => {
    let vivant = true
    chargerStatistiques(jours).then((r) => vivant && setCharge({ jours, ...r }))
    return () => {
      vivant = false
    }
  }, [jours])

  // Tant que la nouvelle période charge, on n'affiche pas l'ancienne.
  const res = charge?.jours === jours ? charge : null
  const d = res?.donnees
  useGSAP(
    () => {
      if (!d) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-stat]', { y: 30, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05 })
        gsap.from('[data-bloc]', { y: 30, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.08, delay: 0.15 })
      })
      return () => mm.revert()
    },
    { scope: ref, dependencies: [d] },
  )

  const a = d?.totaux.actuel
  const p = d?.totaux.precedent
  const ev = d?.evenements
  const conversion = a?.activeUsers ? (ev.actuel.generate_lead / a.activeUsers) * 100 : 0
  const depuis = debutPeriode(jours)
  const messagesPeriode = (messages.rows || []).filter((m) => (m.created_at || '').slice(0, 10) >= depuis).length

  return (
    <div ref={ref}>
      <PageTitle eyebrow="Audience · Google Analytics 4" title={<>Statistiques <em>du site</em></>}>
        <div role="group" aria-label="Période" className="flex rounded-full border border-brun/15 bg-lin p-1">
          {PERIODES.map((pe) => (
            <button
              key={pe.jours}
              type="button"
              onClick={() => setJours(pe.jours)}
              aria-pressed={jours === pe.jours}
              className={`rounded-full px-4 py-2 text-[13px] transition-colors ${jours === pe.jours ? 'bg-brun text-lin' : 'text-brun hover:bg-creme'}`}
            >
              {pe.label}
            </button>
          ))}
        </div>
      </PageTitle>

      {res?.etat === 'exemple' && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-[20px] bg-[#D6A23A]/18 px-5 py-4 text-[14px] text-[#6d4f12]">
          <p>
            <strong className="font-medium">Données d’exemple</strong> ·{' '}
            {res.raison === 'local'
              ? 'les vrais chiffres GA4 s’affichent seulement sur le site en ligne.'
              : 'Google Analytics 4 n’est pas encore relié à cette page. Les chiffres ci-dessous montrent seulement à quoi elle ressemblera.'}
          </p>
          {res.raison !== 'local' && <span className="text-[13px]">Voir docs/STATISTIQUES.md pour le relier</span>}
        </div>
      )}
      {res?.etat === 'erreur' && <p className="mb-8 rounded-[20px] border border-terre-cuite/30 bg-lin p-5 text-terre-cuite">{res.message}</p>}

      {!res ? (
        <p className="text-brun-doux">Chargement des statistiques…</p>
      ) : d ? (
        <>
          {/* Chiffres clés */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <Carte label="Visiteurs" valeur={nombre(a.activeUsers)} actuel={a.activeUsers} precedent={p.activeUsers} accent />
            <Carte label="Pages vues" valeur={nombre(a.screenPageViews)} actuel={a.screenPageViews} precedent={p.screenPageViews} />
            <Carte label="Taux d’engagement" valeur={Math.round(a.engagementRate * 100)} suffixe="%" actuel={a.engagementRate} precedent={p.engagementRate} />
            <Carte label="Demandes envoyées" valeur={nombre(ev.actuel.generate_lead)} actuel={ev.actuel.generate_lead} precedent={ev.precedent.generate_lead} />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
            <Tuile label="Nouveaux visiteurs" valeur={nombre(a.newUsers)} detail={a.activeUsers ? `${Math.round((a.newUsers / a.activeUsers) * 100)} % des visiteurs` : ''} />
            <Tuile label="Visites" valeur={nombre(a.sessions)} detail={`${nombre(a.engagedSessions)} avec engagement`} />
            <Tuile label="Temps moyen" valeur={a.activeUsers ? duree(a.userEngagementDuration / a.activeUsers) : '—'} detail="par visiteur" />
            <Tuile label="Pages par visite" valeur={a.sessions ? (a.screenPageViews / a.sessions).toFixed(1).replace('.', ',') : '—'} detail="en moyenne" />
            <Tuile label="Taux de conversion" valeur={`${conversion.toFixed(1).replace('.', ',')} %`} detail="visiteurs qui envoient une demande" />
          </div>

          {/* Fréquentation */}
          <Bloc titre="Fréquentation" italique="jour par jour" aside={`Du ${formatDate(depuis, { day: 'numeric', month: 'long' })} à aujourd’hui`} className="mt-8">
            <Courbe points={d.parJour.map((x) => ({ date: x.date, valeur: x.visiteurs }))} unite="visiteurs" />
          </Bloc>

          {/* Objectifs du plan de pilotage */}
          <Bloc
            titre="Objectifs"
            italique="du plan de pilotage"
            aside={
              <button type="button" onClick={() => setEdition(true)} className="link-fil text-[14px] text-terre-cuite">
                Modifier les objectifs
              </button>
            }
            className="mt-8"
          >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {KPI.map((k) => {
                const v = ev.actuel[k.cle] || 0
                const mensuel = (v * 30) / jours
                const s = statut(mensuel, objectifs)
                return (
                  <div key={k.cle} data-stat className="rounded-[20px] border border-brun/10 bg-creme p-5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-label text-brique">{k.label}</p>
                      <span className="shrink-0 whitespace-nowrap">
                        <Badge tone={s.ton}>{s.label}</Badge>
                      </span>
                    </div>
                    <p className="mt-3 font-serif text-[40px] leading-none [font-feature-settings:'lnum']">{nombre(v)}</p>
                    <p className="mt-1 text-[12px] text-brun-doux">{k.detail}</p>
                    <Jauge valeur={mensuel} seuilBas={objectifs.seuilBas} seuilHaut={objectifs.seuilHaut} />
                    <p className="mt-3 text-[12px] text-brun-doux">
                      Rythme : <span className="text-brun">{mensuel.toFixed(1).replace('.', ',')} / mois</span> · seuils {objectifs.seuilBas} et {objectifs.seuilHaut}
                      {k.objectif && (
                        <>
                          <br />
                          Objectif : <span className="text-brun">{objectifs.objectifDemandes} demandes / mois</span> {mensuel >= objectifs.objectifDemandes ? '✓ atteint' : ''}
                        </>
                      )}
                    </p>
                  </div>
                )
              })}
            </div>
          </Bloc>

          {/* Sources et appareils */}
          <div className="mt-8 grid gap-6 xl:grid-cols-2 [&>*]:min-w-0">
            <Bloc titre="D’où viennent" italique="les visiteurs" aside="Visites par source">
              <Anneau centre="visites" items={d.sources.map((x) => ({ label: SOURCES[x.nom] || x.nom, valeur: x.valeur }))} />
            </Bloc>
            <Bloc titre="Sur quel" italique="appareil" aside="Visiteurs par appareil">
              <Anneau centre="visiteurs" items={d.appareils.map((x) => ({ label: APPAREILS[x.nom] || x.nom, valeur: x.valeur }))} />
            </Bloc>
          </div>

          {/* Pages, villes, fidélité */}
          <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_1fr] [&>*]:min-w-0">
            <Bloc titre="Pages" italique="les plus vues">
              <Classement unite="vues" items={d.pages.map((x) => ({ label: PAGES[x.nom.replace(/\/$/, '') || '/'] || x.nom, valeur: x.valeur }))} />
            </Bloc>
            <div className="flex flex-col gap-6">
              <Bloc titre="Villes" italique="des visiteurs">
                <Classement unite="visiteurs" items={d.villes.map((x) => ({ label: x.nom, valeur: x.valeur }))} />
              </Bloc>
              <Bloc titre="Nouveaux" italique="ou fidèles ?">
                <Anneau centre="visiteurs" items={d.fidelite.map((x) => ({ label: FIDELITE[x.nom] || x.nom, valeur: x.valeur }))} />
              </Bloc>
            </div>
          </div>

          {/* Données du site lui-même (Supabase) */}
          <Bloc titre="Côté" italique="back-office" aside="Données réelles de votre base" className="mt-8">
            <div className="grid gap-3 sm:grid-cols-3">
              <Tuile label="Messages reçus" valeur={messages.rows ? messagesPeriode : '—'} detail="sur la période, via le formulaire" />
              <Tuile label="Messages non lus" valeur={messages.rows ? messages.rows.filter((m) => !m.lu).length : '—'} detail={<Link to="/admin/messages" className="link-fil text-terre-cuite">Ouvrir la boîte de réception</Link>} />
              <Tuile label="Formulaires abandonnés" valeur={Math.max(0, (ev.actuel.form_start || 0) - (ev.actuel.generate_lead || 0))} detail="commencés mais pas envoyés (GA4)" />
            </div>
          </Bloc>

          <p className="mt-6 text-[13px] text-brun-doux">
            Source : Google Analytics 4{res.etat === 'reel' ? `, mis à jour le ${formatDate(d.maj, { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}` : ''}. Seuls les visiteurs qui ont
            accepté les cookies de mesure d’audience sont comptés en détail.
          </p>
        </>
      ) : null}

      <Drawer open={edition} title="Modifier les objectifs" onClose={() => setEdition(false)}>
        {edition && <Objectifs valeur={objectifs} onClose={() => setEdition(false)} toast={setToast} />}
      </Drawer>
      {toast}
    </div>
  )
}
