import { useMemo } from 'react'

interface Props {
  color: string
  intense: boolean
}

interface Particle {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  shape: 'dot' | 'spark' | 'shard'
}

const COUNT_NORMAL = 16
const COUNT_INTENSE = 30

export function AmbientParticles({ color, intense }: Props) {
  const particles = useMemo<Particle[]>(() => {
    const count = intense ? COUNT_INTENSE : COUNT_NORMAL
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 3 + Math.random() * 6,
      duration: 3.5 + Math.random() * 4,
      delay: -Math.random() * 8,
      shape: (['dot', 'dot', 'spark', 'shard'] as const)[Math.floor(Math.random() * 4)],
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intense])

  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className={`ambient-particle absolute bottom-0 ${
            p.shape === 'shard' ? 'rotate-45' : 'rounded-full'
          }`}
          style={
            {
              left: `${p.left}%`,
              width: p.shape === 'spark' ? '2px' : `${p.size}px`,
              height: p.shape === 'spark' ? `${p.size * 3}px` : `${p.size}px`,
              backgroundColor: color,
              boxShadow: `0 0 ${intense ? 10 : 6}px ${color}`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
