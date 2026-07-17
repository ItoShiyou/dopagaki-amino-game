import { useMemo } from 'react'

interface Props {
  flashKey: number
  flashColor: 'gold' | 'red' | 'white' | 'rainbow'
  particleKey: number
  particleColor: string
  comboPopupKey: number
  combo: number
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

function Particles({ particleKey, color }: { particleKey: number; color: string }) {
  const particles = useMemo(() => {
    return Array.from({ length: 32 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 32 + Math.random() * 0.3
      const dist = 90 + Math.random() * 190
      return {
        id: i,
        px: Math.cos(angle) * dist,
        py: Math.sin(angle) * dist,
        size: 5 + Math.random() * 7,
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
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full animate-particle-burst"
          style={
            {
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: color,
              boxShadow: `0 0 8px 2px ${color}`,
              '--px': `${p.px}px`,
              '--py': `${p.py}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

export function EffectsLayer({
  flashKey,
  flashColor,
  particleKey,
  particleColor,
  comboPopupKey,
  combo,
}: Props) {
  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      {flashKey > 0 && (
        <div
          key={flashKey}
          className={`absolute inset-0 mix-blend-screen animate-flash ${FLASH_CLASS[flashColor]}`}
        />
      )}
      <Particles particleKey={particleKey} color={particleColor} />
      {comboPopupKey > 0 && (
        <div
          key={comboPopupKey}
          className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 animate-combo-pop text-center"
        >
          <div className="rainbow-text text-6xl font-black text-outline drop-shadow-[0_0_28px_rgba(255,255,255,0.9)]">
            {combo}
          </div>
          <div className="text-2xl font-black text-outline text-yellow-200 drop-shadow-[0_0_12px_rgba(253,224,71,0.9)]">
            COMBO!
          </div>
        </div>
      )}
    </div>
  )
}
