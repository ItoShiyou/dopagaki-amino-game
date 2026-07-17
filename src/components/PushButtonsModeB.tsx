import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AMINO_ACIDS, ALL_CODE1, CATEGORY_META } from '../data/aminoAcids'
import type { FallingItem, Stage } from '../types'

interface Props {
  onTap: (code1: string) => void
  fallingItems: FallingItem[]
  stage: Stage
  disabled: boolean
}

const OPTION_COUNT_BY_STAGE: Record<Stage, number> = { 1: 4, 2: 5, 3: 6 }

const SPARKS = Array.from({ length: 8 }, (_, i) => {
  const angle = (Math.PI * 2 * i) / 8
  return { dx: Math.cos(angle) * 46, dy: Math.sin(angle) * 46 }
})

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickFocusItem(items: FallingItem[]): FallingItem | null {
  if (items.length === 0) return null
  return items.reduce((most, it) => (it.spawnClock < most.spawnClock ? it : most))
}

function PushButton({
  code,
  isAtsu,
  disabled,
  onTap,
}: {
  code: string
  isAtsu: boolean
  disabled: boolean
  onTap: (code1: string) => void
}) {
  const [tapKey, setTapKey] = useState(0)
  const amino = AMINO_ACIDS.find((a) => a.code1 === code)!
  const meta = CATEGORY_META[amino.category]

  return (
    <motion.button
      disabled={disabled}
      onClick={() => {
        setTapKey((k) => k + 1)
        onTap(code)
      }}
      whileTap={{ scale: 0.88, y: 4 }}
      transition={{ type: 'spring', stiffness: 600, damping: 16 }}
      className={`relative overflow-visible rounded-2xl border-b-4 border-black/40 bg-gradient-to-b py-4 text-2xl font-black text-white shadow-lg disabled:opacity-40 ${
        isAtsu ? 'neon-pulse-shake ring-4 ring-yellow-300' : 'neon-pulse'
      }`}
      style={
        {
          backgroundImage: `linear-gradient(to bottom, ${meta.color}, #000)`,
          '--neon-color': meta.glow,
        } as React.CSSProperties
      }
    >
      {code}
      {tapKey > 0 && (
        <span key={tapKey} className="pointer-events-none absolute inset-0">
          {SPARKS.map((s, i) => (
            <motion.span
              key={i}
              className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-white"
              style={{ boxShadow: '0 0 8px 2px #fff' }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: s.dx, y: s.dy, opacity: 0, scale: 0.2 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          ))}
        </span>
      )}
    </motion.button>
  )
}

export function PushButtonsModeB({ onTap, fallingItems, stage, disabled }: Props) {
  const focus = pickFocusItem(fallingItems)

  const options = useMemo(() => {
    if (!focus) return []
    const count = OPTION_COUNT_BY_STAGE[stage]
    const distractorsPool = ALL_CODE1.filter((c) => c !== focus.amino.code1)
    const distractors = shuffle(distractorsPool).slice(0, count - 1)
    return shuffle([focus.amino.code1, ...distractors])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus?.id])

  if (!focus) return <div className="h-24" />

  const cols = options.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'

  return (
    <div className="p-2">
      <div className="mb-1.5 text-center text-[11px] font-bold text-white/60">
        最も危険なターゲット: <span className="text-yellow-200">{focus.displayText}</span>
      </div>
      <div className={`grid ${cols} gap-2.5`}>
        <AnimatePresence>
          {options.map((code) => (
            <PushButton key={code} code={code} isAtsu={focus.isAtsu} disabled={disabled} onTap={onTap} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
