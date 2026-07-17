import { useMemo } from 'react'

interface Props {
  flashKey: number
  flashColor: 'gold' | 'red' | 'white' | 'rainbow'
  particleKey: number
  particleColor: string
}

const FLASH_CLASS: Record<Props['flashColor'], string> = {
  gold: 'bg-yellow-300',
  red: 'bg-red-500',
  white: 'bg-white',
  // 注意: animate-flash(0.5秒でフェードアウト)と同じ要素に animate-rainbow-bg 等の
  // 別の `animation` を重ねると、CSSの animation ショートハンドが競合してどちらか
  // 一方しか効かなくなり、フェードアウトしないまま虹色オーバーレイが残り続けるバグになる。
  // そのため rainbow は単一のグラデーションのみとし、無限ループ系アニメーションは付けない。
  rainbow: 'bg-gradient-to-br from-pink-500 via-yellow-300 via-30% via-cyan-300 to-fuchsia-600',
}

const SHAPES = ['circle', 'shard', 'star'] as const
type Shape = (typeof SHAPES)[number]

function StarSvg({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
      <path
        d="M12 0l2.9 8.1L23 11l-8.1 2.9L12 22l-2.9-8.1L1 11l8.1-2.9z"
        fill={color}
      />
    </svg>
  )
}

function Particles({ particleKey, color }: { particleKey: number; color: string }) {
  const particles = useMemo(() => {
    const count = 56
    return Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.35
      const dist = 90 + Math.random() * 230
      return {
        id: i,
        px: Math.cos(angle) * dist,
        py: Math.sin(angle) * dist,
        size: 4 + Math.random() * 9,
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)] as Shape,
        spin: Math.random() * 360,
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [particleKey])

  if (particleKey === 0) return null

  return (
    <div key={particleKey} className="pointer-events-none absolute left-1/2 top-1/3 z-30">
      <span
        className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 animate-ring-burst"
        style={{ borderColor: color }}
      />
      <span
        className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 animate-ring-burst"
        style={{ borderColor: color, animationDelay: '0.08s' }}
      />
      <span
        className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full animate-flash"
        style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
      />
      {particles.map((p) => (
        <span
          key={p.id}
          className={`absolute animate-particle-burst ${
            p.shape === 'shard' ? '' : p.shape === 'star' ? 'flex items-center justify-center' : 'rounded-full'
          }`}
          style={
            {
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.shape === 'star' ? 'transparent' : color,
              boxShadow: p.shape === 'star' ? undefined : `0 0 8px 2px ${color}`,
              transform: p.shape === 'shard' ? `rotate(${p.spin}deg)` : undefined,
              '--px': `${p.px}px`,
              '--py': `${p.py}px`,
            } as React.CSSProperties
          }
        >
          {p.shape === 'star' && <StarSvg color={color} size={p.size * 1.6} />}
        </span>
      ))}
    </div>
  )
}

export function EffectsLayer({ flashKey, flashColor, particleKey, particleColor }: Props) {
  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      {flashKey > 0 && (
        <div
          key={flashKey}
          className={`absolute inset-0 mix-blend-screen animate-flash ${FLASH_CLASS[flashColor]}`}
        />
      )}
      <Particles particleKey={particleKey} color={particleColor} />
    </div>
  )
}
