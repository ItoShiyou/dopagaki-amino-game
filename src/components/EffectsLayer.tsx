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
  rainbow:
    'bg-gradient-to-br from-pink-500 via-yellow-300 via-30% to-fuchsia-600 animate-rainbow-bg',
}

function Particles({ particleKey, color }: { particleKey: number; color: string }) {
  const particles = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 24 + Math.random() * 0.3
      const dist = 80 + Math.random() * 160
      return {
        id: i,
        px: Math.cos(angle) * dist,
        py: Math.sin(angle) * dist,
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [particleKey])

  if (particleKey === 0) return null

  return (
    <div
      key={particleKey}
      className="pointer-events-none absolute left-1/2 top-1/3 z-30"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute h-2 w-2 rounded-full animate-particle-burst"
          style={
            {
              backgroundColor: color,
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
        <div key={flashKey} className={`absolute inset-0 animate-flash ${FLASH_CLASS[flashColor]}`} />
      )}
      <Particles particleKey={particleKey} color={particleColor} />
      {comboPopupKey > 0 && (
        <div
          key={comboPopupKey}
          className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 animate-combo-pop text-center"
        >
          <div className="rainbow-text text-6xl font-black text-outline drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
            {combo}
          </div>
          <div className="text-2xl font-black text-outline text-yellow-200">COMBO!</div>
        </div>
      )}
    </div>
  )
}
