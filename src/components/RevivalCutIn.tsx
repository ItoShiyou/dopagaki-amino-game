interface Props {
  visible: boolean
  offered: boolean
  tapsNeeded: number
  tapsDone: number
  onTap: () => void
}

export function RevivalCutIn({ visible, offered, tapsNeeded, tapsDone, onTap }: Props) {
  if (!visible) return null

  if (!offered) {
    return (
      <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/80">
        <p className="animate-pop text-2xl font-black text-white/70">…力尽きた……</p>
      </div>
    )
  }

  const progress = Math.min(1, tapsDone / tapsNeeded)

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/70">
      <div
        className="neon-pulse-cutin rounded-3xl border-4 border-red-500 bg-gradient-to-br from-red-900 via-black to-red-900 px-6 py-8 text-center"
        style={{ '--neon-color': 'rgba(239,68,68,0.9)' } as React.CSSProperties}
      >
        <p className="rainbow-text text-3xl font-black text-outline">諦めるな！！</p>
        <p className="mt-1 text-sm text-white/70">連打で復活のチャンス！！</p>

        <button
          onClick={onTap}
          className="neon-pulse mx-auto mt-6 flex h-32 w-32 items-center justify-center rounded-full border-8 border-red-300 bg-gradient-to-br from-red-500 to-red-700 text-xl font-black text-white transition-transform active:scale-90"
          style={{ '--neon-color': 'rgba(239,68,68,1)', animationDuration: '0.7s' } as React.CSSProperties}
        >
          連打！
        </button>

        <div className="mx-auto mt-6 h-4 w-64 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-red-500 transition-[width] duration-100"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
