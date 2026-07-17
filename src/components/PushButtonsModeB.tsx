import { useMemo } from 'react'
import { ALL_CODE1 } from '../data/aminoAcids'
import type { Stage } from '../types'

interface Props {
  onTap: (code1: string) => void
  correctCode: string
  targetId: number
  stage: Stage
  isAtsu: boolean
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

export function PushButtonsModeB({ onTap, correctCode, targetId, stage, isAtsu, disabled }: Props) {
  const options = useMemo(() => {
    const count = OPTION_COUNT_BY_STAGE[stage]
    const distractorsPool = ALL_CODE1.filter((c) => c !== correctCode)
    const distractors = shuffle(distractorsPool).slice(0, count - 1)
    return shuffle([correctCode, ...distractors])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetId])

  const cols = options.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'

  return (
    <div className={`grid ${cols} gap-3 p-3`}>
      {options.map((code) => (
        <button
          key={code}
          disabled={disabled}
          onClick={() => onTap(code)}
          className={`rounded-2xl border-b-4 border-black/40 bg-gradient-to-b from-fuchsia-500 to-fuchsia-700 py-5 text-2xl font-black text-white shadow-lg transition-all active:translate-y-1 active:border-b-0 active:brightness-125 disabled:opacity-40 ${
            isAtsu ? 'animate-shake ring-4 ring-yellow-300' : ''
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  )
}
