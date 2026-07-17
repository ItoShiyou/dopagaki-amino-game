import { useMemo } from 'react'
import { AMINO_ACIDS, ALL_CODE1, CATEGORY_META } from '../data/aminoAcids'
import type { FallingItem, Stage } from '../types'

interface Props {
  onTap: (code1: string) => void
  fallingItems: FallingItem[]
  stage: Stage
  disabled: boolean
}

const OPTION_COUNT_BY_STAGE: Record<Stage, number> = { 1: 4, 2: 5, 3: 6 }

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
        {options.map((code) => {
          const amino = AMINO_ACIDS.find((a) => a.code1 === code)!
          const meta = CATEGORY_META[amino.category]
          return (
            <button
              key={code}
              disabled={disabled}
              onClick={() => onTap(code)}
              className={`neon-pulse rounded-2xl border-b-4 border-black/40 bg-gradient-to-b py-4 text-2xl font-black text-white shadow-lg transition-all active:translate-y-1 active:border-b-0 active:brightness-125 disabled:opacity-40 ${
                focus.isAtsu ? 'animate-shake ring-4 ring-yellow-300' : ''
              }`}
              style={
                {
                  backgroundImage: `linear-gradient(to bottom, ${meta.color}, #000)`,
                  '--neon-color': meta.glow,
                } as React.CSSProperties
              }
            >
              {code}
            </button>
          )
        })}
      </div>
    </div>
  )
}
