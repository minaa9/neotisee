import { useState } from 'react'
import { create, remove, update } from '../lib/store'
import { Badge, Btn, Champ, DeleteButton, Drawer, Etat, PageTitle } from './kit'
import { useTable, useToast } from './hooks'
import { fieldCls, formatDate } from './format'

const ONGLETS = [
  ['en_attente', 'À relire'],
  ['publie', 'Publiés'],
  ['refuse', 'Refusés'],
]
const TON = { en_attente: 'attente', publie: 'ok', refuse: 'neutre' }
const LIBELLE = { en_attente: 'En attente', publie: 'Publié', refuse: 'Refusé' }

/** Formulaire pour modifier un avis (fautes, prénom…) ou en ajouter un reçu autrement. */
function AvisForm({ initial, onSaved }) {
  const nouveau = !initial.id
  const [v, setV] = useState({ prenom: '', atelier: '', note: 5, texte: '', statut: 'publie', ...initial })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setV((o) => ({ ...o, [k]: e.target.value }))

  const save = async (e) => {
    e.preventDefault()
    const texte = v.texte.trim()
    if (texte.length < 10) return setError('Le témoignage doit faire au moins 10 caractères.')
    if (texte.length > 1500) return setError('Le témoignage est trop long (1 500 caractères maximum).')
    setBusy(true)
    try {
      const row = { prenom: v.prenom.trim(), atelier: v.atelier.trim(), note: Number(v.note), texte, statut: v.statut }
      if (nouveau) await create('temoignages', { ...row, date: String(new Date().getFullYear()) })
      else await update('temoignages', initial.id, row)
      onSaved(nouveau ? (v.statut === 'publie' ? 'Avis ajouté et publié' : 'Avis ajouté') : 'Avis modifié')
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Champ label="Prénom (facultatif)">
          <input value={v.prenom} onChange={set('prenom')} className={fieldCls} placeholder="Claire" />
        </Champ>
        <Champ label="Atelier">
          <input value={v.atelier} onChange={set('atelier')} className={fieldCls} placeholder="Atelier filage de la laine" />
        </Champ>
      </div>
      <div>
        <span className="mb-2 block text-label text-brun">Note</span>
        <div className="flex gap-1" role="radiogroup" aria-label="Note sur 5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={v.note === n}
              aria-label={`${n} sur 5`}
              onClick={() => setV((o) => ({ ...o, note: n }))}
              className={`text-[28px] leading-none transition-transform hover:scale-110 ${n <= v.note ? 'text-terre-cuite' : 'text-brun/20'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <Champ label="Témoignage" hint={`${v.texte.length} / 1 500 caractères · vous pouvez corriger une faute, jamais changer le sens.`}>
        <textarea rows={7} value={v.texte} onChange={set('texte')} className={`${fieldCls} resize-y`} />
      </Champ>
      <div>
        <span className="mb-2 block text-label text-brun">Statut</span>
        <div className="flex flex-wrap gap-2">
          {ONGLETS.map(([k]) => (
            <button
              key={k}
              type="button"
              aria-pressed={v.statut === k}
              onClick={() => setV((o) => ({ ...o, statut: k }))}
              className={`rounded-full border px-4 py-2 text-[14px] transition-colors ${v.statut === k ? 'border-brun bg-brun text-lin' : 'border-brun/15 hover:border-brun/40'}`}
            >
              {LIBELLE[k]}
            </button>
          ))}
        </div>
      </div>
      {error && (
        <p role="alert" className="text-petit text-terre-cuite">
          {error}
        </p>
      )}
      <div className="sticky bottom-0 -mx-6 mt-2 flex justify-end gap-3 border-t border-brun/10 bg-creme px-6 py-4 sm:-mx-8 sm:px-8">
        <Btn type="submit" disabled={busy}>
          {busy ? 'Enregistrement…' : 'Enregistrer'}
        </Btn>
      </div>
    </form>
  )
}

export default function GuestbookAdmin() {
  const { rows, error } = useTable('temoignages')
  const [onglet, setOnglet] = useState('en_attente')
  const [toast, setToast] = useToast()
  const [edit, setEdit] = useState(null)
  const shown = (rows || []).filter((t) => t.statut === onglet)
  const count = (s) => (rows || []).filter((t) => t.statut === s).length

  const setStatut = async (t, statut) => {
    await update('temoignages', t.id, { statut })
    setToast(statut === 'publie' ? 'Publié sur le site' : statut === 'refuse' ? 'Avis refusé' : 'Retiré du site, à relire')
  }

  return (
    <div>
      <PageTitle eyebrow="Livre d’or" title={<>Les mots <em>des visiteurs</em></>}>
        <Btn onClick={() => setEdit({})}>+ Ajouter un avis</Btn>
      </PageTitle>
      <p className="-mt-4 mb-8 max-w-[680px] text-petit text-brun-doux">
        Les avis envoyés depuis la page Livre d’or arrivent dans « À relire » : <strong className="font-normal text-brun">rien n’apparaît sur le site tant que vous ne cliquez pas sur « Publier »</strong>. Vous pouvez aussi les modifier, les retirer du site ou les supprimer.
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
              <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                {t.statut === 'publie' ? (
                  <Btn variant="contour" onClick={() => setStatut(t, 'en_attente')}>
                    Retirer du site
                  </Btn>
                ) : (
                  <Btn onClick={() => setStatut(t, 'publie')}>Publier</Btn>
                )}
                <Btn variant="contour" onClick={() => setEdit(t)}>
                  Modifier
                </Btn>
                {t.statut === 'en_attente' && (
                  <Btn variant="discret" onClick={() => setStatut(t, 'refuse')}>
                    Refuser
                  </Btn>
                )}
                {t.statut === 'refuse' && (
                  <Btn variant="discret" onClick={() => setStatut(t, 'en_attente')}>
                    Remettre à relire
                  </Btn>
                )}
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
      <Drawer open={!!edit} title={edit?.id ? 'Modifier l’avis' : 'Ajouter un avis'} onClose={() => setEdit(null)}>
        {edit && (
          <AvisForm
            key={edit.id || 'nouveau'}
            initial={edit}
            onSaved={(m) => {
              setEdit(null)
              setToast(m)
            }}
          />
        )}
      </Drawer>
      {toast}
    </div>
  )
}
