import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { create, remove, update } from '../lib/store'
import { Badge, Btn, Champ, DeleteButton, Drawer, Etat, PageTitle } from './kit'
import { useTable, useToast } from './hooks'
import { fieldCls, formatDate } from './format'
import { Toggle } from '../components/CookieBanner'
import ImageField from './ImageField'

function NewsForm({ initial, onSaved }) {
  const [v, setV] = useState({
    titre: initial.titre || '',
    rubrique: initial.rubrique || '',
    texte: (initial.paragraphes || []).join('\n\n'),
    image: initial.image || '',
    alt: initial.alt || '',
    publie: initial.publie ?? true,
  })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setV((o) => ({ ...o, [k]: e.target.value }))

  const save = async (e) => {
    e.preventDefault()
    const paragraphes = v.texte.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    if (!v.titre.trim() || !paragraphes.length) return setError('Le titre et le texte sont obligatoires.')
    if (v.image && !v.alt.trim()) return setError('Décrivez la photo en une phrase (pour l’accessibilité).')
    setBusy(true)
    try {
      const row = { titre: v.titre.trim(), rubrique: v.rubrique.trim(), paragraphes, image: v.image, alt: v.alt.trim(), publie: v.publie }
      if (initial.id) await update('actualites', initial.id, row)
      else await create('actualites', row)
      onSaved(initial.id ? 'Actualité modifiée' : v.publie ? 'Actualité publiée' : 'Brouillon enregistré')
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-5">
      <Champ label="Titre">
        <input value={v.titre} onChange={set('titre')} className={fieldCls} />
      </Champ>
      <Champ label="Date ou précision (facultatif)" hint="Affichée seulement à côté de « À la une », ex. « 9–10 octobre 2027 ».">
        <input value={v.rubrique} onChange={set('rubrique')} className={fieldCls} />
      </Champ>
      <Champ label="Texte" hint="Laissez une ligne vide entre deux paragraphes. Le premier paragraphe sert de résumé.">
        <textarea rows={9} value={v.texte} onChange={set('texte')} className={`${fieldCls} resize-y`} />
      </Champ>
      <ImageField value={v.image} onChange={(url) => setV((o) => ({ ...o, image: url }))} />
      <Champ label="Description de la photo" hint="Une phrase lue par les lecteurs d’écran.">
        <input value={v.alt} onChange={set('alt')} className={fieldCls} />
      </Champ>
      <div className="flex items-center justify-between gap-4 rounded-[20px] bg-lin p-4">
        <span>
          <span className="block text-[15px]">Publier sur le site</span>
          <span className="block text-[13px] text-brun-doux">Désactivé : l’article reste en brouillon.</span>
        </span>
        <Toggle checked={v.publie} onChange={(x) => setV((o) => ({ ...o, publie: x }))} label="Publier sur le site" />
      </div>
      {error && <p role="alert" className="text-petit text-terre-cuite">{error}</p>}
      <div className="sticky bottom-0 -mx-6 mt-2 flex justify-end gap-3 border-t border-brun/10 bg-creme px-6 py-4 sm:-mx-8 sm:px-8">
        <Btn type="submit" disabled={busy}>{busy ? 'Enregistrement…' : 'Enregistrer'}</Btn>
      </div>
    </form>
  )
}

export default function NewsAdmin() {
  const { rows, error } = useTable('actualites')
  const [params, setParams] = useSearchParams()
  const [edit, setEdit] = useState(null)
  const [toast, setToast] = useToast()
  const opened = edit ?? (params.get('nouveau') ? {} : null)
  const close = () => {
    setEdit(null)
    if (params.get('nouveau')) setParams({}, { replace: true })
  }

  return (
    <div>
      <PageTitle eyebrow="Actualités" title={<>Les <em>derniers fils</em></>}>
        <Btn onClick={() => setEdit({})}>+ Nouvelle actualité</Btn>
      </PageTitle>
      <p className="-mt-4 mb-8 text-petit text-brun-doux">L’article le plus récent est mis « à la une » sur la page Actualités.</p>

      <Etat rows={rows} error={error} vide="Aucune actualité pour l’instant." />
      {rows?.length > 0 && (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((n, i) => (
            <li key={n.id} className="group flex flex-col overflow-hidden rounded-[28px] bg-lin transition-transform duration-500 hover:-translate-y-1">
              <div className="relative aspect-[16/10] overflow-hidden bg-peche">
                {n.image && <img src={n.image} alt="" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                <div className="absolute top-3 left-3 flex gap-2">
                  {n.publie === false ? <Badge tone="attente">Brouillon</Badge> : <Badge tone="ok">En ligne</Badge>}
                  {i === 0 && n.publie !== false && <Badge tone="alerte">À la une</Badge>}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                {n.rubrique && <p className="mb-2 text-label text-brique">{n.rubrique}</p>}
                <p className="font-serif text-[22px] leading-tight">{n.titre}</p>
                <p className="mt-2 line-clamp-2 text-[13px] text-brun-doux">{n.paragraphes?.[0]}</p>
                <p className="mt-3 text-[12px] text-brun-doux">Créée le {formatDate(n.created_at)}</p>
                <div className="mt-auto flex gap-2 pt-4">
                  <Btn variant="contour" onClick={() => setEdit(n)}>Modifier</Btn>
                  <DeleteButton
                    onConfirm={async () => {
                      await remove('actualites', n.id)
                      setToast('Actualité supprimée')
                    }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Drawer open={!!opened} title={opened?.id ? 'Modifier l’actualité' : 'Nouvelle actualité'} onClose={close}>
        {opened && (
          <NewsForm
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
