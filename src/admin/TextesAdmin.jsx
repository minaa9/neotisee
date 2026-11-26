import { useState } from 'react'
import { saveSetting } from '../lib/store'
import { TEXTES } from '../lib/reglages'
import { Btn } from './kit'
import { fieldCls } from './format'

/** Garde seulement les textes différents de ceux d'origine (le reste suit le site). */
function nettoyer(v) {
  const out = {}
  TEXTES.forEach((b) => {
    b.champs.forEach((c) => {
      const val = v[b.id]?.[c.cle]
      if (typeof val === 'string' && val.trim() && val.trim() !== c.defaut) {
        out[b.id] = { ...out[b.id], [c.cle]: val.trim() }
      }
    })
  })
  return out
}

/**
 * Réglages › Textes du site : titres, accroches et textes d'introduction
 * de chaque page, plus les chiffres clés de l'accueil.
 */
export default function TextesAdmin({ valeur, toast }) {
  const [v, setV] = useState(() => structuredClone(valeur || {}))
  const [actif, setActif] = useState(TEXTES[0].id)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const bloc = TEXTES.find((b) => b.id === actif)

  const enregistre = JSON.stringify(nettoyer(valeur || {}))
  const dirty = JSON.stringify(nettoyer(v)) !== enregistre
  const modifies = (id) => Object.keys(nettoyer(v)[id] || {}).length

  const valeurDe = (c) => v[bloc.id]?.[c.cle] ?? c.defaut
  const changer = (c, val) => setV((o) => ({ ...o, [bloc.id]: { ...o[bloc.id], [c.cle]: val } }))

  const save = async () => {
    setError('')
    setBusy(true)
    try {
      await saveSetting('textes', nettoyer(v))
      toast('Textes enregistrés : le site est à jour')
    } catch (e) {
      setError(e.message || 'Enregistrement impossible.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="rounded-[28px] bg-lin p-6 sm:p-8">
      <h2 className="font-serif text-[30px] leading-tight">Textes du site</h2>
      <p className="mt-2 max-w-[560px] text-petit text-brun-doux">
        Modifiez les titres et les textes d’introduction de chaque page. Un retour à la ligne dans un champ crée un retour à
        la ligne sur le site. Un champ vidé reprend le texte d’origine.
      </p>

      {/* Choix de la page */}
      <ul className="mt-7 flex flex-wrap gap-2" aria-label="Choisir le texte à modifier">
        {TEXTES.map((b) => (
          <li key={b.id}>
            <button
              type="button"
              onClick={() => setActif(b.id)}
              aria-pressed={actif === b.id}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] transition-colors ${
                actif === b.id ? 'bg-brun text-lin' : 'border border-brun/15 text-brun hover:bg-creme'
              }`}
            >
              {b.page}
              {b.id === 'accueilAsso' && ' · association'}
              {modifies(b.id) > 0 && (
                <span className={`size-1.5 rounded-full ${actif === b.id ? 'bg-lin' : 'bg-terre-cuite'}`} aria-label="modifié" />
              )}
            </button>
          </li>
        ))}
      </ul>

      <div key={bloc.id} className="mt-8 animate-[fiche_0.4s_cubic-bezier(0.22,1,0.36,1)_both]">
        <p className="text-label text-brique">
          {bloc.page} · {bloc.bloc}
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {bloc.champs.map((c) => {
            const val = valeurDe(c)
            const change = val.trim() !== c.defaut
            return (
              <label key={c.cle} className={`block ${c.court ? '' : 'sm:col-span-2'}`}>
                <span className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-label text-brun">{c.label}</span>
                  {change && (
                    <button type="button" onClick={() => changer(c, c.defaut)} className="text-[12px] text-terre-cuite underline-offset-2 hover:underline">
                      Rétablir le texte d’origine
                    </button>
                  )}
                </span>
                {c.multi ? (
                  <textarea
                    rows={Math.min(5, Math.max(2, Math.ceil(val.length / 70) + (val.match(/\n/g)?.length || 0)))}
                    value={val}
                    onChange={(e) => changer(c, e.target.value)}
                    className={`${fieldCls} resize-y leading-relaxed`}
                  />
                ) : (
                  <input value={val} onChange={(e) => changer(c, e.target.value)} className={fieldCls} />
                )}
              </label>
            )
          })}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-petit text-terre-cuite">
          {error}
        </p>
      )}
      <div className="mt-8 flex flex-wrap items-center justify-end gap-4 border-t border-brun/10 pt-5">
        {dirty && <span className="text-[13px] text-brun-doux">Modifications non enregistrées</span>}
        <Btn onClick={save} disabled={!dirty || busy}>
          {busy ? 'Enregistrement…' : 'Enregistrer'}
        </Btn>
      </div>
    </section>
  )
}
