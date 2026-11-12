import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { categories, todayIso } from '../data/events'
import { create, remove, update } from '../lib/store'
import { Badge, Btn, Champ, DeleteButton, Drawer, Etat, PageTitle } from './kit'
import { useTable, useToast } from './hooks'
import { fieldCls, formatDate } from './format'
import ImageField from './ImageField'

const VIDE = { titre: '', court: '', categorie: 'atelier', date: '', debut: '10:00', fin: '16:00', lieu: 'Montpellier', description: '', image: '' }

function EventForm({ initial, onSaved }) {
  const [v, setV] = useState({ ...VIDE, ...initial })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setV((o) => ({ ...o, [k]: e.target ? e.target.value : e }))

  const save = async (e) => {
    e.preventDefault()
    if (!v.titre.trim() || !v.date) return setError('Le titre et la date sont obligatoires.')
    if (v.fin <= v.debut) return setError('L’heure de fin doit être après l’heure de début.')
    setBusy(true)
    try {
      const row = {
        titre: v.titre.trim(),
        court: (v.court || v.titre).trim(),
        categorie: v.categorie,
        date: v.date,
        debut: v.debut,
        fin: v.fin,
        lieu: v.lieu.trim(),
        description: v.description.trim(),
        image: v.image,
      }
      if (initial?.id) await update('evenements', initial.id, row)
      else await create('evenements', row)
      onSaved(initial?.id ? 'Rendez-vous modifié' : 'Rendez-vous ajouté au calendrier')
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-5">
      <Champ label="Titre">
        <input value={v.titre} onChange={set('titre')} className={fieldCls} placeholder="Initiation au filage de la laine" />
      </Champ>
      <Champ label="Titre court" hint="Affiché sur la navette du calendrier. Laisser vide pour reprendre le titre.">
        <input value={v.court} onChange={set('court')} className={fieldCls} placeholder="Initiation au filage" />
      </Champ>
      <div>
        <span className="mb-2 block text-label text-brun">Type</span>
        <div className="flex flex-wrap gap-2">
          {Object.entries(categories).map(([k, c]) => (
            <button
              key={k}
              type="button"
              onClick={() => setV((o) => ({ ...o, categorie: k }))}
              aria-pressed={v.categorie === k}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[14px] transition-colors ${
                v.categorie === k ? 'border-brun bg-brun text-lin' : 'border-brun/15 hover:border-brun/40'
              }`}
            >
              <img src={c.dot} alt="" className="size-2.5" />
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Champ label="Date">
          <input type="date" value={v.date} onChange={set('date')} className={fieldCls} />
        </Champ>
        <Champ label="Début">
          <input type="time" value={v.debut} onChange={set('debut')} className={fieldCls} />
        </Champ>
        <Champ label="Fin">
          <input type="time" value={v.fin} onChange={set('fin')} className={fieldCls} />
        </Champ>
      </div>
      <Champ label="Lieu">
        <input value={v.lieu} onChange={set('lieu')} className={fieldCls} />
      </Champ>
      <Champ label="Description">
        <textarea rows={4} value={v.description} onChange={set('description')} className={`${fieldCls} resize-y`} />
      </Champ>
      <ImageField value={v.image} onChange={(url) => setV((o) => ({ ...o, image: url }))} />
      {error && <p role="alert" className="text-petit text-terre-cuite">{error}</p>}
      <div className="sticky bottom-0 -mx-6 mt-2 flex justify-end gap-3 border-t border-brun/10 bg-creme px-6 py-4 sm:-mx-8 sm:px-8">
        <Btn type="submit" disabled={busy}>{busy ? 'Enregistrement…' : 'Enregistrer'}</Btn>
      </div>
    </form>
  )
}

export default function EventsAdmin() {
  const { rows, error } = useTable('evenements')
  const [params, setParams] = useSearchParams()
  const [edit, setEdit] = useState(null) // null = fermé, {} = nouveau, objet = modification
  const [filtre, setFiltre] = useState('avenir')
  const [q, setQ] = useState('')
  const [toast, setToast] = useToast()

  // Lien « + Nouvel événement » du tableau de bord.
  const opened = edit ?? (params.get('nouveau') ? {} : null)
  const close = () => {
    setEdit(null)
    if (params.get('nouveau')) setParams({}, { replace: true })
  }

  const today = todayIso()
  const shown = (rows || [])
    .filter((e) => (filtre === 'avenir' ? e.date >= today : e.date < today))
    .filter((e) => !q || `${e.titre} ${e.lieu}`.toLowerCase().includes(q.toLowerCase()))
  if (filtre === 'passes') shown.reverse()

  return (
    <div>
      <PageTitle eyebrow="Calendrier" title={<>Les <em>événements</em></>}>
        <Btn onClick={() => setEdit({})}>+ Nouvel événement</Btn>
      </PageTitle>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex rounded-full bg-lin p-1">
          {[['avenir', 'À venir'], ['passes', 'Passés']].map(([k, l]) => (
            <button key={k} type="button" onClick={() => setFiltre(k)} className={`rounded-full px-5 py-2 text-[14px] transition-colors ${filtre === k ? 'bg-brun text-lin' : 'text-brun hover:text-terre-cuite'}`}>
              {l}
            </button>
          ))}
        </div>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher…" aria-label="Rechercher un événement" className={`${fieldCls} max-w-[280px] rounded-full`} />
      </div>

      <Etat rows={rows && shown} error={error} vide={filtre === 'avenir' ? 'Aucun rendez-vous à venir.' : 'Aucun rendez-vous passé.'} />
      {rows && shown.length > 0 && (
        <ul className="flex flex-col gap-3">
          {shown.map((e) => (
            <li key={e.id} className="group flex flex-wrap items-center gap-5 rounded-[24px] bg-lin p-4 transition-transform duration-300 hover:translate-x-1 sm:flex-nowrap sm:p-5">
              <div className="flex w-16 shrink-0 flex-col items-center text-center">
                <span className="font-serif text-[34px] leading-none">{formatDate(e.date, { day: '2-digit' })}</span>
                <span className="font-serif text-[16px] text-brun-doux italic">{formatDate(e.date, { month: 'short' })}</span>
              </div>
              {e.image && <img src={e.image} alt="" className="hidden size-16 shrink-0 rounded-[16px] object-cover sm:block" />}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>
                    <img src={categories[e.categorie]?.dot} alt="" className="size-2" />
                    {categories[e.categorie]?.label}
                  </Badge>
                  <span className="text-[13px] text-brun-doux">{e.debut}–{e.fin} · {e.lieu}</span>
                </div>
                <p className="mt-1.5 truncate font-serif text-[22px] leading-tight">{e.titre}</p>
              </div>
              <div className="flex gap-2">
                <Btn variant="contour" onClick={() => setEdit(e)}>Modifier</Btn>
                <DeleteButton
                  onConfirm={async () => {
                    await remove('evenements', e.id)
                    setToast('Rendez-vous supprimé')
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <Drawer open={!!opened} title={opened?.id ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'} onClose={close}>
        {opened && (
          <EventForm
            key={opened.id || 'nouveau'}
            initial={opened}
            onSaved={(m) => {
              close()
              setToast(m)
            }}
          />
        )}
      </Drawer>
      {toast}
    </div>
  )
}
