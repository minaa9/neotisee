import { useState } from 'react'
import { create, remove, update } from '../lib/store'
import { Btn, Champ, DeleteButton, Drawer, Etat, PageTitle } from './kit'
import { useTable, useToast } from './hooks'
import { fieldCls } from './format'
import ImageField from './ImageField'

const VIDE = { titre: '', accroche: '', description: '', image: '' }

function AtelierForm({ initial, ordre, onSaved }) {
  const [v, setV] = useState({ ...VIDE, ...initial })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setV((o) => ({ ...o, [k]: e.target.value }))

  const save = async (e) => {
    e.preventDefault()
    if (!v.titre.trim()) return setError('Le nom de l’atelier est obligatoire.')
    if (v.description.trim().length < 20) return setError('Ajoutez une description d’au moins une phrase.')
    setBusy(true)
    try {
      const row = { titre: v.titre.trim(), accroche: v.accroche.trim(), description: v.description.trim(), image: v.image }
      if (initial?.id) await update('ateliers', initial.id, row)
      else await create('ateliers', { ...row, ordre })
      onSaved(initial?.id ? 'Atelier modifié' : 'Atelier ajouté')
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-5">
      <ImageField value={v.image} onChange={(url) => setV((o) => ({ ...o, image: url }))} label="Photo de l’atelier" />
      <p className="-mt-3 text-[12px] text-brun-doux">Format paysage conseillé. Sans photo, l’image d’origine est conservée.</p>
      <Champ label="Nom de l’atelier">
        <input value={v.titre} onChange={set('titre')} className={fieldCls} placeholder="Filage de la laine" />
      </Champ>
      <Champ label="Accroche" hint="Une courte phrase en italique, sous le nom (page d’accueil).">
        <input value={v.accroche} onChange={set('accroche')} className={fieldCls} placeholder="Le geste ancestral du filage" />
      </Champ>
      <Champ label="Description" hint={`${v.description.length} caractères · affichée sur la page Nos ateliers.`}>
        <textarea rows={6} value={v.description} onChange={set('description')} className={`${fieldCls} resize-y`} />
      </Champ>
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

export default function AteliersAdmin() {
  const { rows, error } = useTable('ateliers')
  const [edit, setEdit] = useState(null)
  const [toast, setToast] = useToast()
  const list = rows || []

  // Monter / descendre : on échange la place de deux ateliers.
  const deplacer = async (i, dir) => {
    const a = list[i]
    const b = list[i + dir]
    if (!b) return
    await Promise.all([update('ateliers', a.id, { ordre: b.ordre ?? i + dir + 1 }), update('ateliers', b.id, { ordre: a.ordre ?? i + 1 })])
    setToast('Ordre mis à jour')
  }

  return (
    <div>
      <PageTitle eyebrow="Nos ateliers" title={<>Les <em>ateliers</em></>}>
        <Btn onClick={() => setEdit({})}>+ Nouvel atelier</Btn>
      </PageTitle>

      <p className="mb-8 max-w-[640px] text-petit text-brun-doux">
        Ces ateliers s’affichent sur la page d’accueil (les arches) et sur la page Nos ateliers, dans cet ordre. Changez une photo,
        un texte ou l’ordre : le site se met à jour tout seul.
      </p>

      <Etat rows={rows} error={error} vide="Aucun atelier : le site affiche les ateliers d’origine." />
      {list.length > 0 && (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 [&>*]:min-w-0">
          {list.map((a, i) => (
            <li key={a.id} className="group flex flex-col overflow-hidden rounded-[24px] bg-lin">
              <div className="relative">
                <div className="overflow-hidden rounded-t-[120px]">
                  {a.image ? (
                    <img src={a.image} alt="" className="aspect-[270/250] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="flex aspect-[270/250] items-center justify-center bg-peche/60 px-6 text-center text-[13px] text-brun-doux">Photo d’origine</div>
                  )}
                </div>
                <span className="absolute top-3 left-3 flex size-9 items-center justify-center rounded-full bg-creme font-serif text-[18px] text-terre-cuite">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="font-serif text-[22px] leading-tight">{a.titre}</p>
                {a.accroche && <p className="mt-1 font-serif text-[16px] text-brun-doux italic">{a.accroche}</p>}
                <p className="mt-2 line-clamp-3 text-[13px] text-brun-doux">{a.description}</p>
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
                  <Btn variant="contour" onClick={() => setEdit(a)}>
                    Modifier
                  </Btn>
                  <span className="ml-auto flex gap-1">
                    <button type="button" onClick={() => deplacer(i, -1)} disabled={i === 0} aria-label={`Monter « ${a.titre} »`} className="flex size-9 items-center justify-center rounded-full border border-brun/20 transition-colors hover:bg-creme disabled:opacity-30">
                      ↑
                    </button>
                    <button type="button" onClick={() => deplacer(i, 1)} disabled={i === list.length - 1} aria-label={`Descendre « ${a.titre} »`} className="flex size-9 items-center justify-center rounded-full border border-brun/20 transition-colors hover:bg-creme disabled:opacity-30">
                      ↓
                    </button>
                  </span>
                </div>
                <div className="mt-2">
                  <DeleteButton
                    onConfirm={async () => {
                      await remove('ateliers', a.id)
                      setToast('Atelier supprimé')
                    }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Drawer open={!!edit} title={edit?.id ? 'Modifier l’atelier' : 'Nouvel atelier'} onClose={() => setEdit(null)}>
        {edit && (
          <AtelierForm
            key={edit.id || 'nouveau'}
            initial={edit}
            ordre={Math.max(0, ...list.map((a) => a.ordre || 0)) + 1}
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
