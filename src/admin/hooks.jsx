import { useCallback, useEffect, useState } from 'react'
import { list } from '../lib/store'

/** Charge une table et se recharge quand les données changent. */
export function useTable(table) {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(null)
  const reload = useCallback(() => {
    list(table)
      .then((r) => {
        setRows(r)
        setError(null)
      })
      .catch((e) => setError(e.message || 'Impossible de charger les données.'))
  }, [table])
  useEffect(() => {
    reload()
    window.addEventListener('neotisse:data', reload)
    return () => window.removeEventListener('neotisse:data', reload)
  }, [reload])
  return { rows, error, reload }
}

/** Message temporaire en bas de l'écran. */
export function useToast() {
  const [msg, setMsg] = useState(null)
  useEffect(() => {
    if (!msg) return
    const t = setTimeout(() => setMsg(null), 2600)
    return () => clearTimeout(t)
  }, [msg])
  const node = msg && (
    <p role="status" className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 animate-[fiche_0.5s_ease_both] rounded-full bg-brun px-6 py-3 text-[14px] text-lin shadow-lg">
      {msg}
    </p>
  )
  return [node, setMsg]
}
