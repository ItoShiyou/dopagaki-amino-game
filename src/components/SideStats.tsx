import { getTierMeta } from '../lib/comboTier'

interface Props {
  combo: number
  maxCombo: number
  stage: number
}

export function SideStats({ combo, maxCombo, stage }: Props) {
  const meta = getTierMeta(combo)

  return (
    <div className="absolute left-2 top-2 z-20 flex flex-col items-start gap-1.5">
      <div
        key={combo}
        className={`neon-pulse-pop rounded-xl border-2 bg-black/60 px-2.5 py-1 text-center ${meta.textClass}`}
        style={{ '--neon-color': meta.glow, borderColor: meta.color } as React.CSSProperties}
      >
        <div className="text-[9px] font-bold tracking-wider" style={{ color: meta.color }}>
          COMBO
        </div>
        <div className="text-lg font-black leading-tight text-outline tabular-nums">
          {meta.icon}
          {combo}
          <span className="ml-0.5 text-[10px]">COMBO!</span>
        </div>
      </div>

      <div
        className="neon-pulse rounded-lg border border-fuchsia-400/70 bg-black/50 px-2.5 py-1 text-center"
        style={{ '--neon-color': 'rgba(232,121,249,0.5)' } as React.CSSProperties}
      >
        <div className="text-[8px] font-bold tracking-wider text-fuchsia-300">BEST COMBO</div>
        <div className="text-sm font-black leading-tight text-fuchsia-200 tabular-nums">{maxCombo}</div>
      </div>

      <div
        className="neon-pulse rounded-lg border border-red-500/60 bg-gradient-to-r from-red-900/70 to-black/60 px-2.5 py-1 text-center"
        style={{ '--neon-color': 'rgba(239,68,68,0.6)' } as React.CSSProperties}
      >
        <div className="text-xs font-black leading-tight text-red-400">
          STAGE {stage}
          {stage === 3 && <div className="text-[9px] text-red-300">地獄モード</div>}
        </div>
      </div>
    </div>
  )
}
