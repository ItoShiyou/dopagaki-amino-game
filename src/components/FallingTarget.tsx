import { CATEGORY_META } from '../data/aminoAcids'
import type { FallingItem } from '../types'

interface Props {
  item: FallingItem
  paused: boolean
}

export function FallingTarget({ item, paused }: Props) {
  const meta = CATEGORY_META[item.amino.category]
  const isZebra = item.isAtsu && item.id % 2 === 0

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
        className="neon-trail pointer-events-none absolute left-1/2 top-0 h-28 w-1.5 -translate-x-1/2 -translate-y-full blur-[1px]"
        style={{ background: `linear-gradient(to top, ${meta.color}, transparent)` }}
      />
      <div
        className="aura-ring pointer-events-none absolute left-1/2 top-1/2 h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 opacity-70"
        style={{ borderColor: item.isAtsu ? '#ffd700' : meta.color }}
      />
      <div className="wobble">
        <div
          key={item.id}
          className={`neon-pulse-pop flex h-[70px] w-[76px] flex-col items-center justify-center rounded-xl border-[3px] px-1 text-center font-black shadow-xl ${
            item.isAtsu
              ? isZebra
                ? 'zebra-atsu border-yellow-300 text-black'
                : 'border-yellow-300 bg-gradient-to-br from-pink-500 via-yellow-400 to-fuchsia-600 text-black'
              : 'bg-black/80 text-white'
          }`}
          style={
            {
              '--neon-color': item.isAtsu ? '#ffd700' : meta.color,
              borderColor: item.isAtsu ? undefined : meta.color,
            } as React.CSSProperties
          }
        >
          <div className="text-[13px] leading-[1.15] [overflow-wrap:anywhere] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
            {item.isAtsu && <span className="mr-0.5">🔥</span>}
            {item.displayText}
          </div>
          {item.isAtsu && <div className="mt-0.5 text-[9px] font-black leading-none text-red-900">激アツ!!</div>}
        </div>
      </div>
    </div>
  )
}
