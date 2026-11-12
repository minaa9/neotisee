import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { remove, update } from '../lib/store'
import { Badge, Btn, DeleteButton, Etat, PageTitle } from './kit'
import { useTable, useToast } from './hooks'
import { formatDate } from './format'

export default function MessagesAdmin() {
  const { rows, error } = useTable('messages')
  const [params, setParams] = useSearchParams()
  const [filtre, setFiltre] = useState('tous')
  const [toast, setToast] = useToast()
  const id = params.get('id')
  const shown = (rows || []).filter((m) => filtre === 'tous' || !m.lu)
  const current = rows?.find((m) => m.id === id) || null

  // Ouvrir un message le marque comme lu.
  useEffect(() => {
    if (current && !current.lu) update('messages', current.id, { lu: true })
  }, [current])

  const open = (m) => setParams({ id: m.id })

  return (
    <div>
      <PageTitle eyebrow="Contact" title={<>Boîte <em>de réception</em></>} />

      <div className="mb-6 flex rounded-full bg-lin p-1 sm:inline-flex">
        {[['tous', 'Tous'], ['nonlus', 'Non lus']].map(([k, l]) => (
          <button key={k} type="button" onClick={() => setFiltre(k)} className={`rounded-full px-5 py-2 text-[14px] transition-colors ${filtre === k ? 'bg-brun text-lin' : 'text-brun hover:text-terre-cuite'}`}>
            {l}
          </button>
        ))}
      </div>

      <Etat rows={rows && shown} error={error} vide="Aucun message." />
      {shown.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr] [&>*]:min-w-0">
          <ul className="flex flex-col gap-2">
            {shown.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => open(m)}
                  aria-current={m.id === id}
                  className={`group w-full rounded-[20px] p-4 text-left transition-[background-color,transform] duration-300 hover:translate-x-1 ${m.id === id ? 'bg-terre-cuite text-lin' : 'bg-lin'}`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-2">
                      {!m.lu && <span aria-label="Non lu" className={`size-2 shrink-0 rounded-full ${m.id === id ? 'bg-lin' : 'bg-terre-cuite'}`} />}
                      <span className={`truncate text-[15px] ${m.lu ? '' : 'font-medium'}`}>{m.nom}</span>
                    </span>
                    <span className={`shrink-0 text-[12px] ${m.id === id ? 'text-lin/80' : 'text-brun-doux'}`}>{formatDate(m.created_at, { day: 'numeric', month: 'short' })}</span>
                  </span>
                  <span className={`mt-1 block text-[13px] ${m.id === id ? 'text-lin/90' : 'text-brique'}`}>{m.objet}</span>
                  <span className={`mt-1 block truncate text-[13px] ${m.id === id ? 'text-lin/80' : 'text-brun-doux'}`}>{m.message}</span>
                </button>
              </li>
            ))}
          </ul>

          <article className="min-h-[300px] rounded-[28px] bg-lin p-6 sm:p-8 lg:sticky lg:top-8 lg:self-start">
            {current ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <Badge tone="alerte">{current.objet}</Badge>
                    <h2 className="mt-3 font-serif text-[32px] leading-tight">{current.nom}</h2>
                    <p className="mt-1 text-[14px] text-brun-doux">
                      {current.email}
                      {current.profil && ` · ${current.profil}`} · {formatDate(current.created_at, { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {current.rdv && <p className="mt-1 text-[14px] text-brique">Rendez-vous : {current.rdv}</p>}
                  </div>
                </div>
                <p className="mt-6 text-courant whitespace-pre-line text-brun">{current.message}</p>
                <div className="mt-8 flex flex-wrap gap-2 border-t border-brun/10 pt-5">
                  <a
                    href={`mailto:${current.email}?subject=${encodeURIComponent(`Re : ${current.objet} — Néotisse`)}`}
                    className="rounded-full bg-terre-cuite px-5 py-2.5 text-[14px] text-lin transition-colors hover:bg-brique"
                  >
                    Répondre par e-mail
                  </a>
                  <Btn variant="contour" onClick={() => update('messages', current.id, { lu: false }).then(() => setParams({}))}>Marquer non lu</Btn>
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
