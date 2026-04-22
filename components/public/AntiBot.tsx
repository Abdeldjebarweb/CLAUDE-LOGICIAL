// ============================================================
// PROTECTION ANTI-BOTS GRATUITE — Honeypot + Timer
// À utiliser dans tous les formulaires publics
// Pas de service externe, 100% gratuit
// ============================================================

// UTILISATION dans un formulaire :
//
// import { useAntiBot, AntiBotField, checkAntiBot } from '@/components/AntiBot'
//
// Dans le composant :
//   const antiBot = useAntiBot()
//
// Dans le JSX du formulaire :
//   <AntiBotField value={antiBot.honeypot} onChange={antiBot.setHoneypot} />
//
// Dans handleSubmit :
//   if (!checkAntiBot(antiBot)) {
//     setError('Soumission trop rapide. Réessayez.')
//     return
//   }

import { useState, useEffect, useRef } from 'react'

// Hook principal
export function useAntiBot() {
  const [honeypot, setHoneypot] = useState('')
  const startTime = useRef(Date.now())

  useEffect(() => {
    startTime.current = Date.now()
  }, [])

  return { honeypot, setHoneypot, startTime }
}

// Champ piège invisible (les bots le remplissent, les humains ne le voient pas)
export function AntiBotField({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: '-9999px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        opacity: 0,
        pointerEvents: 'none',
      }}
    >
      <label htmlFor="website">Ne pas remplir ce champ</label>
      <input
        id="website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

// Vérification : retourne false si c'est un bot
export function checkAntiBot(antiBot: { honeypot: string; startTime: React.MutableRefObject<number> }): boolean {
  // 1. Le champ honeypot doit être vide
  if (antiBot.honeypot !== '') {
    console.warn('Bot détecté : honeypot rempli')
    return false
  }

  // 2. Le formulaire doit avoir pris au moins 3 secondes (humain normal)
  const elapsed = Date.now() - antiBot.startTime.current
  if (elapsed < 3000) {
    console.warn('Bot détecté : soumission trop rapide', elapsed, 'ms')
    return false
  }

  return true
}
