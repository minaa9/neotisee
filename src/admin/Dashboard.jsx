import { useRef } from 'react'
import { Link } from 'react-router'
import { categories, todayIso } from '../data/events'
import { update } from '../lib/store'
import { MOTION_OK, gsap, useGSAP } from '../motion/gsap'
import { Badge, Btn, PageTitle } from './kit'
import { useTable, useToast } from './hooks'
import { formatDate } from './format'

function StatCard({ to, label, value, hint, accent }) {
  return (
    <Link to={to} data-stat className="group block">
      <span
        className={`relative block h-full overflow-hidden rounded-[28px] p-6 transition-transform duration-500 group-hover:-translate-y-1 ${
          accent ? 'bg-terre-cuite text-lin' : 'bg-lin text-brun'
        }`}
      >
      {/* Fil qui s'enroule au survol */}
      <svg aria-hidden="true" viewBox="0 0 120 120" className="absolute -right-6 -bottom-6 size-28 opacity-30 transition-transform duration-700 group-hover:rotate-90">
        <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="1" />
        <ellipse cx="60" cy="60" rx="50" ry="18" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(30 60 60)" />
        <ellipse cx="60" cy="60" rx="50" ry="30" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(-50 60 60)" />
      </svg>
      <span className={`block text-label ${accent ? 'text-lin/80' : 'text-brique'}`}>{label}</span>
      <span data-count-to={value} className="block mt-4 font-serif text-[64px] leading-none font-light [font-feature-settings:'lnum']">
        {value}
      </span>
      <span className={`mt-3 block text-[13px] ${accent ? 'text-lin/85' : 'text-brun-doux'}`}>{hint}</span>
      </span>
    </Link>
  )
}

export default function Dashboard() {
  const ref = useRef(null)
  const ev = useTable('evenements')
  const news = useTable('actualites')
  const tem = useTable('temoignages')
  const msg = useTable('messages')
  const [toast, setToast] = useToast()

  const today = todayIso()
  const upcoming = (ev.rows || []).filter((e) => e.date >= today)
  const unread = (msg.rows || []).filter((m) => !m.lu)
  const pending = (tem.rows || []).filter((t) => t.statut === 'en_attente')
  const published = (news.rows || []).filter((n) => n.publie !== false)
  const ready = ev.rows && news.rows && tem.rows && msg.rows

  // Entrée : cartes en cascade, chiffres qui comptent, fil des rendez-vous qui se trace.
  useGSAP(
    () => {
      if (!ready) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-stat]', { y: 40, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.08 })
        ref.current.querySelectorAll('[data-count-to]').forEach((el) => {
          const o = { v: 0 }
          gsap.to(o, { v: Number(el.dataset.countTo), duration: 1.4, ease: 'power3.out', delay: 0.2, onUpdate: () => (el.textContent = Math.round(o.v)) })
        })
        gsap.from('[data-bloc]', { y: 30, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.1, delay: 0.3 })
        gsap.from('[data-dash-fil]', { scaleY: 0, transformOrigin: 'top', duration: 1.4, ease: 'expo.inOut', delay: 0.5 })
      })
      return () => mm.revert()
    },
    { scope: ref, dependencies: [ready] },
  )

  const moderate = async (t, statut) => {
    await update('temoignages', t.id, { statut })
    setToast(statut === 'publie' ? 'Témoignage publié sur le site' : 'Témoignage refusé')
  }

  const hour = new Date().getHours()
  const hello = hour < 18 ? 'Bonjour' : 'Bonsoir'

  return (
    <div ref={ref}>
      <PageTitle eyebrow={formatDate(today, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} title={<>{hello}, <em>l’équipe Néotisse</em></>}>
        <Link to="/admin/evenements?nouveau=1" className="rounded-full bg-terre-cuite px-5 py-2.5 text-[14px] text-lin transition-colors hover:bg-brique">
          + Nouvel événement
        </Link>
        <Link to="/admin/actualites?nouveau=1" className="rounded-full border border-brun/25 px-5 py-2.5 text-[14px] text-brun transition-colors hover:border-brun hover:bg-lin">
          + Nouvelle actualité
        </Link>
      </PageTitle>

      {!ready ? (
        <p className="text-brun-doux">Chargement…</p>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard to="/admin/evenements" label="Rendez-vous à venir" value={upcoming.length} hint={upcoming[0] ? `Prochain : ${formatDate(upcoming[0].date, { day: 'numeric', month: 'long' })}` : 'Aucun de prévu'} accent />
            <StatCard to="/admin/messages" label="Messages non lus" value={unread.length} hint={`${msg.rows.length} message${msg.rows.length > 1 ? 's' : ''} au total`} />
            <StatCard to="/admin/livre-d-or" label="Témoignages à relire" value={pending.length} hint={`${tem.rows.length - pending.length} déjà traités`} />
            <StatCard to="/admin/actualites" label="Actualités en ligne" value={published.length} hint={`${news.rows.length - published.length} brouillon${news.rows.length - published.length > 1 ? 's' : ''}`} />
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_1fr] [&>*]:min-w-0">
            {/* Prochains rendez-vous */}
            <section data-bloc className="rounded-[28px] bg-lin p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-[30px] leading-tight">Prochains <em>rendez-vous</em></h2>
                <Link to="/admin/evenements" className="link-fil text-[14px] text-terre-cuite">Tout voir</Link>
              </div>
              {upcoming.length ? (
                <ol className="relative mt-6 pl-6">
                  <span data-dash-fil aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-px bg-terre-cuite/40" />
                  {upcoming.slice(0, 5).map((e) => (
                    <li key={e.id} className="relative py-3">
                      <span aria-hidden="true" className={`absolute top-[22px] -left-6 size-[11px] rounded-full ring-4 ring-lin ${categories[e.categorie]?.bg || 'bg-terre-cuite'}`} />
                      <p className="text-[13px] text-brique capitalize">
                        {formatDate(e.date, { weekday: 'long', day: 'numeric', month: 'long' })} · {e.debut}–{e.fin}
                      </p>
                      <p className="mt-1 font-serif text-[21px] leading-tight">{e.titre}</p>
                      <p className="mt-1 text-[13px] text-brun-doux">{categories[e.categorie]?.label} · {e.lieu}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-6 text-brun-doux">Aucun rendez-vous à venir. <Link to="/admin/evenements?nouveau=1" className="link-fil text-terre-cuite">En ajouter un</Link></p>
              )}
            </section>

            <div className="flex flex-col gap-6">
              {/* Messages */}
              <section data-bloc className="rounded-[28px] bg-lin p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-[30px] leading-tight">Derniers <em>messages</em></h2>
                  <Link to="/admin/messages" className="link-fil text-[14px] text-terre-cuite">Boîte de réception</Link>
                </div>
                <ul className="mt-4 divide-y divide-brun/10">
                  {msg.rows.slice(0, 3).map((m) => (
                    <li key={m.id}>
                      <Link to={`/admin/messages?id=${m.id}`} className="group flex items-start gap-3 py-3">
                        <span aria-hidden="true" className={`mt-2 size-2 shrink-0 rounded-full ${m.lu ? 'bg-brun/15' : 'bg-terre-cuite'}`} />
                        <span className="min-w-0 flex-1">
                          <span className="flex justify-between gap-3 text-[14px]">
                            <span className={`truncate ${m.lu ? '' : 'font-medium'}`}>{m.nom}</span>
                            <span className="shrink-0 text-[12px] text-brun-doux">{formatDate(m.created_at, { day: 'numeric', month: 'short' })}</span>
                          </span>
                          <span className="block truncate text-[13px] text-brun-doux transition-transform duration-300 group-hover:translate-x-1">
                            {m.objet} — {m.message}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                  {!msg.rows.length && <li className="py-3 text-brun-doux">Aucun message pour l’instant.</li>}
                </ul>
              </section>

              {/* Témoignages à relire */}
              <section data-bloc className="rounded-[28px] bg-lin p-6 sm:p-8">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-serif text-[30px] leading-tight">À <em>relire</em></h2>
                  {pending.length > 0 && <Badge tone="attente">{pending.length} en attente</Badge>}
                </div>
                {pending.length ? (
                  <ul className="mt-4 flex flex-col gap-4">
                    {pending.slice(0, 2).map((t) => (
                      <li key={t.id} className="rounded-[20px] bg-creme p-4">
                        <p className="font-serif text-[18px] leading-snug italic">« {t.texte} »</p>
                        <p className="mt-2 text-[13px] text-brun-doux">{t.prenom || 'Anonyme'} · {t.atelier}</p>
                        <div className="mt-3 flex gap-2">
                          <Btn onClick={() => moderate(t, 'publie')}>Publier</Btn>
                          <Btn variant="contour" onClick={() => moderate(t, 'refuse')}>Refuser</Btn>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-brun-doux">Tout est relu, bravo !</p>
                )}
              </section>
            </div>
          </div>
        </>
      )}
      {toast}
    </div>
  )
}
