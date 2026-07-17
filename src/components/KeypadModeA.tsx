import { AMINO_ACIDS, CATEGORY_META } from '../data/aminoAcids'

interface Props {
  onTap: (code1: string) => void
  activeCodes: Set<string>
  glowAssist: boolean
  disabled: boolean
}

export function KeypadModeA({ onTap, activeCodes, glowAssist, disabled }: Props) {
  return (
    <div className="grid grid-cols-5 gap-1 p-1.5">
      {AMINO_ACIDS.map((amino) => {
        const meta = CATEGORY_META[amino.category]
        const isHint = glowAssist && activeCodes.has(amino.code1)
        return (
          <button
            key={amino.code1}
            disabled={disabled}
            onClick={() => onTap(amino.code1)}
            className="flex aspect-square flex-col items-center justify-center rounded-lg border-2 bg-black/50 transition-all active:scale-90 active:brightness-125 disabled:opacity-40"
            style={{
              borderColor: isHint ? '#ffd700' : meta.color,
              boxShadow: isHint ? '0 0 14px rgba(255,215,0,0.85)' : `0 0 6px ${meta.glow}`,
            }}
          >
            <span className={`text-base font-black leading-none ${isHint ? 'text-yellow-200' : 'text-white'}`}>
              {amino.code1}
            </span>
            <span className="mt-0.5 text-[7px] font-semibold leading-none text-white/60">{amino.nameEn}</span>
          </button>
        )
      })}
    </div>
  )
}
