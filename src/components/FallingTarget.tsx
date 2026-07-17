import type { FallingItem } from '../types'

interface Props {
  item: FallingItem
}

export function FallingTarget({ item }: Props) {
  return (
    <div
      className="absolute -translate-x-1/2"
      style={{
        left: `${item.leftPercent}%`,
        top: '-15%',
        animation: `fall ${item.fallDurationMs}ms linear forwards`,
      }}
    >
      <div
        key={item.id}
        className={`animate-pop whitespace-nowrap rounded-2xl border-4 px-4 py-2 text-center font-black shadow-xl ${
          item.isAtsu
            ? 'border-yellow-300 bg-gradient-to-br from-pink-500 via-yellow-400 to-fuchsia-600 text-2xl text-black animate-glow-pulse'
            : 'border-white/40 bg-black/70 text-xl text-white'
        }`}
      >
        {item.isAtsu && <span className="mr-1">🔥</span>}
        {item.displayText}
      </div>
    </div>
  )
}
