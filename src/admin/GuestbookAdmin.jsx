import { useState } from 'react'
import { remove, update } from '../lib/store'
import { Badge, Btn, DeleteButton, Etat, PageTitle } from './kit'
import { useTable, useToast } from './hooks'
import { formatDate } from './format'

const ONGLETS = [
  ['en_attente', 'À relire'],
  ['publie', 'Publiés'],
  ['refuse', 'Refusés'],
]
const TON = { en_attente: 'attente', publie: 'ok', refuse: 'neutre' }
const LIBELLE = { en_attente: 'En attente', publie: 'Publié', refuse: 'Refusé' }

export default function GuestbookAdmin() {
  const { rows, error } = useTable('temoignages')
  const [onglet, setOnglet] = useState('en_attente')
  const [toast, setToast] = useToast()
  const shown = (rows || []).filter((t) => t.statut === onglet)
  const count = (s) => (rows || []).filter((t) => t.statut === s).length

  const setStatut = async (t, statut) => {
    await update('temoignages', t.id, { statut })
    setToast(statut === 'publie' ? 'Publié sur le site' : statut === 'refuse' ? 'Témoignage refusé' : 'Remis en attente')
  }

  return (
    <div>
      <PageTitle eyebrow="Livre d’or" title={<>Les mots <em>des visiteurs</em></>} />
      <p className="-mt-4 mb-8 max-w-[640px] text-petit text-brun-doux">
        Les témoignages envoyés depuis la page Livre d’or arrivent ici. Seuls ceux que vous publiez apparaissent sur le site.
      </p>

      <div className="mb-6 flex flex-wrap gap-1 rounded-full bg-lin p-1 sm:inline-flex">
        {ONGLETS.map(([k, l]) => (
          <button key={k} type="button" onClick={() => setOnglet(k)} className={`flex items-center gap-2 rounded-full px-5 py-2 text-[14px] transition-colors ${onglet === k ? 'bg-brun text-lin' : 'text-brun hover:text-terre-cuite'}`}>
            {l}
            <span className={`rounded-full px-2 text-[12px] ${onglet === k ? 'bg-lin/20' : 'bg-brun/8'}`}>{count(k)}</span>
          </button>
        ))}
      </div>

      <Etat rows={rows && shown} error={error} vide={onglet === 'en_attente' ? 'Rien à relire pour le moment.' : 'Aucun témoignage ici.'} />
      {shown.length > 0 && (
        <ul className="grid gap-5 lg:grid-cols-2">
          {shown.map((t) => (
            <li key={t.id} className="flex flex-col rounded-[28px] bg-lin p-6">
              <div className="flex items-center justify-between gap-3">
                <span aria-label={`${t.note} sur 5`} className="tracking-[0.2em] text-terre-cuite">
                  {'★'.repeat(t.note || 0)}
                  <span className="text-brun/20">{'★'.repeat(5 - (t.note || 0))}</span>
                </span>
                <Badge tone={TON[t.statut]}>{LIBELLE[t.statut]}</Badge>
              </div>
              <blockquote className="mt-4 font-serif text-[21px] leading-snug italic">« {t.texte} »</blockquote>
              <p className="mt-3 text-[13px] text-brun-doux">
                {t.prenom || 'Anonyme'} · {t.atelier || 'Atelier non précisé'} · reçu le {formatDate(t.created_at)}
              </p>
              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                {t.statut !== 'publie' && <Btn onClick={() => setStatut(t, 'publie')}>Publier</Btn>}
                {t.statut !== 'refuse' && <Btn variant="contour" onClick={() => setStatut(t, 'refuse')}>{t.statut === 'publie' ? 'Retirer du site' : 'Refuser'}</Btn>}
                {t.statut === 'refuse' && <Btn variant="contour" onClick={() => setStatut(t, 'en_attente')}>Remettre en attente</Btn>}
                <DeleteButton
                  onConfirm={async () => {
                    await remove('temoignages', t.id)
                    setToast('Témoignage supprimé')
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
      {toast}
    </div>
  )
}
