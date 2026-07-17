import { ALL_CODE1 } from '../data/aminoAcids'

interface Props {
  onTap: (code1: string) => void
  correctCode: string | null
  glowAssist: boolean
  disabled: boolean
}

export function KeypadModeA({ onTap, correctCode, glowAssist, disabled }: Props) {
  return (
    <div className="grid grid-cols-5 gap-1.5 p-2">
      {ALL_CODE1.map((code) => {
        const isHint = glowAssist && correctCode === code
        return (
          <button
            key={code}
            disabled={disabled}
            onClick={() => onTap(code)}
            className={`aspect-square rounded-lg border-2 text-lg font-black transition-all active:scale-90 active:brightness-125 disabled:opacity-40 ${
              isHint
                ? 'border-yellow-300 bg-yellow-300/30 text-yellow-200 animate-glow-pulse'
                : 'border-white/25 bg-white/10 text-white'
            }`}
          >
            {code}
          </button>
        )
      })}
    </div>
  )
}
