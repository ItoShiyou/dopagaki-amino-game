import { CATEGORY_META } from '../data/aminoAcids'
import type { FallingItem } from '../types'

interface Props {
  item: FallingItem
  paused: boolean
}

export function FallingTarget({ item, paused }: Props) {
  const meta = CATEGORY_META[item.amino.category]

  return (
    <div
      className="absolute -translate-x-1/2"
      style={{
        left: `${item.leftPercent}%`,
        top: '-15%',
        animation: `fall ${item.fallDurationMs}ms linear forwards`,
        animationPlayState: paused ? 'paused' : 'running',
      }}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-32 w-px -translate-x-1/2 -translate-y-full"
        style={{ background: `linear-gradient(to top, ${meta.color}, transparent)`, opacity: 0.6 }}
      />
      <div
        key={item.id}
        className={`animate-pop whitespace-nowrap rounded-xl border-[3px] px-3 py-1.5 text-center font-black shadow-xl ${
          item.isAtsu
            ? 'border-yellow-300 bg-gradient-to-br from-pink-500 via-yellow-400 to-fuchsia-600 text-black animate-glow-pulse'
            : 'bg-black/75 text-white'
        }`}
        style={
          item.isAtsu
            ? undefined
            : { borderColor: meta.color, boxShadow: `0 0 14px ${meta.glow}` }
        }
      >
        <div className="text-base leading-tight">
          {item.isAtsu && <span className="mr-1">🔥</span>}
          {item.displayText}
        </div>
        {item.isAtsu && <div className="text-[10px] font-black leading-tight text-red-900">激アツ!!</div>}
      </div>
    </div>
  )
}
