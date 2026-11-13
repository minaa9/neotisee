import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { remove, update } from '../lib/store'
import { Badge, Btn, DeleteButton, Etat, PageTitle } from './kit'
import { useTable, useToast } from './hooks'
import { fieldCls, formatDate } from './format'

const FILTRES = [
  ['tous', 'Tous'],
  ['nonlus', 'Non lus'],
  ['lus', 'Lus'],
]

export default function MessagesAdmin() {
  const { rows, error } = useTable('messages')
  const [params, setParams] = useSearchParams()
  const [filtre, setFiltre] = useState('tous')
  const [q, setQ] = useState('')
  const [toast, setToast] = useToast()
  const id = params.get('id')
  const all = rows || []
  const counts = { tous: all.length, nonlus: all.filter((m) => !m.lu).length, lus: all.filter((m) => m.lu).length }
  const shown = all
    .filter((m) => (filtre === 'nonlus' ? !m.lu : filtre === 'lus' ? m.lu : true))
    .filter((m) => !q || `${m.nom} ${m.email} ${m.objet} ${m.message}`.toLowerCase().includes(q.toLowerCase()))
  const current = all.find((m) => m.id === id) || null

  // Ouvrir un message le marque comme lu, une seule fois par ouverture :
  // s'il est ensuite remis « non lu », il le reste (même affiché).
  const dejaMarque = useRef(null)
  useEffect(() => {
    if (!current || dejaMarque.current === current.id) return
    dejaMarque.current = current.id
    if (!current.lu) update('messages', current.id, { lu: true })
  }, [current])

  const open = (m) => setParams({ id: m.id })
  const basculerLu = async () => {
    const lu = !current.lu
    await update('messages', current.id, { lu })
    setToast(lu ? 'Marqué comme lu' : 'Marqué comme non lu : il reste en tête de vos « Non lus »')
  }
  const toutLu = async () => {
    await Promise.all(all.filter((m) => !m.lu).map((m) => update('messages', m.id, { lu: true })))
    setToast('Tous les messages sont marqués comme lus')
  }

  return (
    <div>
      <PageTitle eyebrow="Contact" title={<>Boîte <em>de réception</em></>}>
        {counts.nonlus > 0 && (
          <Btn variant="contour" onClick={toutLu}>
            Tout marquer comme lu
          </Btn>
        )}
      </PageTitle>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" aria-label="Filtrer les messages" className="flex rounded-full bg-lin p-1">
          {FILTRES.map(([k, l]) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={filtre === k}
              onClick={() => setFiltre(k)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-[14px] transition-colors sm:px-5 ${filtre === k ? 'bg-brun text-lin' : 'text-brun hover:text-terre-cuite'}`}
            >
              {l}
              <span className={`rounded-full px-1.5 text-[12px] tabular-nums ${filtre === k ? 'bg-lin/20' : 'bg-brun/8'}`}>{counts[k]}</span>
            </button>
          ))}
        </div>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un nom, un mot…" aria-label="Rechercher un message" className={`${fieldCls} max-w-[300px] rounded-full`} />
      </div>

      <Etat rows={rows && shown} error={error} vide={filtre === 'nonlus' ? 'Aucun message non lu. Tout est à jour.' : q ? 'Aucun message ne correspond.' : 'Aucun message.'} />
      {shown.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr] [&>*]:min-w-0">
          <ul className="flex flex-col gap-2">
            {shown.map((m) => {
              const sel = m.id === id
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => open(m)}
                    aria-current={sel}
                    className={`group relative w-full rounded-[20px] p-4 pl-6 text-left transition-[background-color,transform] duration-300 hover:translate-x-1 ${sel ? 'bg-terre-cuite text-lin' : m.lu ? 'bg-lin/60' : 'bg-lin'}`}
                  >
                    {/* Fil terre cuite : message non lu */}
                    {!m.lu && <span aria-hidden="true" className={`absolute inset-y-4 left-2.5 w-[3px] rounded-full ${sel ? 'bg-lin' : 'bg-terre-cuite'}`} />}
                    <span className="flex items-center justify-between gap-3">
                      <span className={`truncate text-[15px] ${m.lu ? '' : 'font-medium'}`}>
                        {m.nom}
                        {!m.lu && <span className="sr-only"> (non lu)</span>}
                      </span>
                      <span className={`shrink-0 text-[12px] ${sel ? 'text-lin/80' : 'text-brun-doux'}`}>{formatDate(m.created_at, { day: 'numeric', month: 'short' })}</span>
                    </span>
                    <span className={`mt-1 block truncate text-[13px] ${sel ? 'text-lin/90' : 'text-brique'}`}>{m.objet}</span>
                    <span className={`mt-1 block truncate text-[13px] ${sel ? 'text-lin/80' : 'text-brun-doux'}`}>{m.message}</span>
                  </button>
                </li>
              )
            })}
          </ul>

          <article className="min-h-[300px] rounded-[28px] bg-lin p-6 sm:p-8 lg:sticky lg:top-8 lg:self-start">
            {current ? (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="alerte">{current.objet}</Badge>
                  {current.lu ? <Badge>Lu</Badge> : <Badge tone="attente">Non lu</Badge>}
                </div>
                <h2 className="mt-3 font-serif text-[32px] leading-tight">{current.nom}</h2>
                <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[14px]">
                  <dt className="text-brun-doux">E-mail</dt>
                  <dd className="min-w-0 truncate">
                    <a href={`mailto:${current.email}`} className="link-fil text-terre-cuite">
                      {current.email}
                    </a>
                  </dd>
                  {current.profil && (
                    <>
                      <dt className="text-brun-doux">Profil</dt>
                      <dd>{current.profil}</dd>
                    </>
                  )}
                  {current.rdv && (
                    <>
                      <dt className="text-brun-doux">Rendez-vous</dt>
                      <dd className="text-brique">{current.rdv}</dd>
                    </>
                  )}
                  <dt className="text-brun-doux">Reçu le</dt>
                  <dd>{formatDate(current.created_at, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</dd>
                </dl>
                <p className="mt-6 border-t border-brun/10 pt-6 text-courant whitespace-pre-line text-brun">{current.message}</p>
                <div className="mt-8 flex flex-wrap gap-2 border-t border-brun/10 pt-5">
                  <a
                    href={`mailto:${current.email}?subject=${encodeURIComponent(`Re : ${current.objet} — Néotisse`)}`}
                    className="rounded-full bg-terre-cuite px-5 py-2.5 text-[14px] text-lin transition-colors hover:bg-brique"
                  >
                    Répondre par e-mail
                  </a>
                  <Btn variant="contour" onClick={basculerLu}>
                    {current.lu ? 'Marquer comme non lu' : 'Marquer comme lu'}
                  </Btn>
                  <DeleteButton
                    onConfirm={async () => {
                      await remove('messages', current.id)
                      setParams({})
                      setToast('Message supprimé')
                    }}
                  />
                </div>
              </>
            ) : (
              <p className="flex h-full min-h-[240px] items-center justify-center text-center font-serif text-[22px] text-brun-doux italic">Choisissez un message à lire</p>
            )}
          </article>
        </div>
      )}
      {toast}
    </div>
  )
}
