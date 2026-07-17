import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  visible: boolean
  offered: boolean
  tapsNeeded: number
  tapsDone: number
  onTap: () => void
}

export function RevivalCutIn({ visible, offered, tapsNeeded, tapsDone, onTap }: Props) {
  const [phase, setPhase] = useState<'idle' | 'slowmo' | 'cutin'>('idle')

  useEffect(() => {
    if (!visible) {
      setPhase('idle')
      return
    }
    setPhase('slowmo')
    const t = window.setTimeout(() => setPhase('cutin'), 650)
    return () => window.clearTimeout(t)
  }, [visible])

  if (!visible) return null

  if (phase === 'slowmo') {
    return (
      <motion.div
        className="absolute inset-0 z-40 flex items-center justify-center bg-black"
        initial={{ opacity: 0, backdropFilter: 'grayscale(0)' }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeIn' }}
      >
        <motion.p
          className="text-outline px-8 text-center text-3xl font-black text-red-500"
          initial={{ scale: 1.6, opacity: 0, letterSpacing: '0.2em' }}
          animate={{ scale: 1, opacity: 1, letterSpacing: '0.05em' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          まだ、終われない…
        </motion.p>
      </motion.div>
    )
  }

  if (!offered) {
    return (
      <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/90">
        <p className="animate-pop text-2xl font-black text-white/70">…力尽きた……</p>
      </div>
    )
  }

  const progress = Math.min(1, tapsDone / tapsNeeded)

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/80">
      <motion.div
        className="neon-pulse-cutin rounded-3xl border-4 border-red-500 bg-gradient-to-br from-red-900 via-black to-red-900 px-6 py-8 text-center"
        style={{ '--neon-color': 'rgba(239,68,68,0.9)' } as React.CSSProperties}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16 }}
      >
        <p className="rainbow-text text-3xl font-black text-outline">諦めるな！！</p>
        <p className="mt-1 text-sm text-white/70">連打で復活のチャンス！！</p>

        <AnimatePresence>
          <motion.button
            key={tapsDone}
            onClick={onTap}
            className="neon-pulse mx-auto mt-6 flex h-32 w-32 items-center justify-center rounded-full border-8 border-red-300 bg-gradient-to-br from-red-500 to-red-700 text-xl font-black text-white"
            style={{ '--neon-color': 'rgba(239,68,68,1)', animationDuration: '0.7s' } as React.CSSProperties}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.18, 1] }}
            whileTap={{ scale: 0.8 }}
            transition={{ duration: 0.18 }}
          >
            連打！
          </motion.button>
        </AnimatePresence>

        <div className="mx-auto mt-6 h-4 w-64 overflow-hidden rounded-full bg-white/20">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-red-500"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.1 }}
            style={{ boxShadow: '0 0 12px 2px rgba(255,215,0,0.8)' }}
          />
        </div>
      </motion.div>
    </div>
  )
}
