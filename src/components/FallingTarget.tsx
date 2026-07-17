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
        top: '0%',
        animation: `fall ${item.fallDurationMs}ms linear forwards`,
        animationPlayState: paused ? 'paused' : 'running',
      }}
    >
      <div
        className="neon-trail pointer-events-none absolute left-1/2 top-0 h-24 w-1 -translate-x-1/2 -translate-y-full blur-[1px]"
        style={{ background: `linear-gradient(to top, ${meta.color}, transparent)` }}
      />
      <div
        key={item.id}
        className={`neon-pulse-pop flex h-[70px] w-[76px] flex-col items-center justify-center rounded-xl border-[3px] px-1 text-center font-black shadow-xl ${
          item.isAtsu
            ? 'border-yellow-300 bg-gradient-to-br from-pink-500 via-yellow-400 to-fuchsia-600 text-black'
            : 'bg-black/80 text-white'
        }`}
        style={
          {
            '--neon-color': item.isAtsu ? '#ffd700' : meta.color,
            borderColor: item.isAtsu ? undefined : meta.color,
          } as React.CSSProperties
        }
      >
        <div className="text-[13px] leading-[1.15] [overflow-wrap:anywhere]">
          {item.isAtsu && <span className="mr-0.5">🔥</span>}
          {item.displayText}
        </div>
        {item.isAtsu && <div className="mt-0.5 text-[9px] font-black leading-none text-red-900">激アツ!!</div>}
      </div>
    </div>
  )
}
