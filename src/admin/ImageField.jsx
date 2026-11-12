import { useRef, useState } from 'react'
import { uploadImage } from '../lib/store'

/** Choix d'une photo : glisser-déposer ou parcourir, avec aperçu. */
export default function ImageField({ value, onChange, label = 'Photo' }) {
  const input = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [over, setOver] = useState(false)

  const send = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return setError('Choisissez une image (JPG, PNG, WebP).')
    if (file.size > 8 * 1024 * 1024) return setError('Image trop lourde (8 Mo maximum).')
    setError('')
    setBusy(true)
    try {
      onChange(await uploadImage(file))
    } catch (e) {
      setError(e.message || 'Envoi impossible.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <span className="mb-2 block text-label text-brun">{label}</span>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          send(e.dataTransfer.files[0])
        }}
        className={`relative flex min-h-[160px] items-center justify-center overflow-hidden rounded-[20px] border border-dashed transition-colors ${
          over ? 'border-terre-cuite bg-peche/50' : 'border-brun/25 bg-lin'
        }`}
      >
        {value ? (
          <>
            <img src={value} alt="" className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-x-3 bottom-3 flex gap-2">
              <button type="button" onClick={() => input.current.click()} className="rounded-full bg-creme/95 px-4 py-2 text-[13px] text-brun">
                Changer
              </button>
              <button type="button" onClick={() => onChange('')} className="rounded-full bg-creme/95 px-4 py-2 text-[13px] text-terre-cuite">
                Retirer
              </button>
            </div>
          </>
        ) : (
          <button type="button" onClick={() => input.current.click()} className="flex flex-col items-center gap-2 p-6 text-center text-[14px] text-brun-doux">
            <span aria-hidden="true" className="flex size-11 items-center justify-center rounded-full border border-brun/20 text-[22px] text-terre-cuite">+</span>
            {busy ? 'Envoi en cours…' : 'Glissez une photo ici ou cliquez pour parcourir'}
          </button>
        )}
      </div>
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => send(e.target.files[0])} />
      {error && <p className="mt-1.5 text-petit text-terre-cuite">{error}</p>}
    </div>
  )
}
