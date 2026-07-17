interface Props {
  life: number
  maxLife: number
  score: number
  multiplier: number
  fever: boolean
  feverTimeLeftMs: number
  feverDurationMs: number
  paused: boolean
  onTogglePause: () => void
}

export function Hud({
  life,
  maxLife,
  score,
  multiplier,
  fever,
  feverTimeLeftMs,
  feverDurationMs,
  paused,
  onTogglePause,
}: Props) {
  return (
    <div className="z-20 flex flex-col gap-1 p-2">
      <div className="flex items-start justify-between gap-2">
        <div className="rounded-xl border-2 border-red-500/70 bg-black/60 px-3 py-1.5 text-center shadow-[0_0_14px_rgba(239,68,68,0.5)]">
          <div className="text-[9px] font-bold tracking-wider text-red-300">SCORE</div>
          <div className="text-xl font-black text-outline text-yellow-200 tabular-nums leading-tight">
            {score.toLocaleString()}
          </div>
          <div className="text-xs font-black text-fuchsia-300">×{multiplier.toFixed(1)}</div>
        </div>

        {fever && (
          <div className="flex-1 rounded-xl border-2 border-fuchsia-400 bg-black/50 px-2 py-1 text-center shadow-[0_0_20px_rgba(232,121,249,0.7)]">
            <div className="rainbow-text text-sm font-black leading-tight">FEVER MODE!!</div>
            <div className="text-[10px] font-black leading-tight text-yellow-200">確変中!!</div>
          </div>
        )}

        <div className="flex items-center gap-1.5 rounded-xl border-2 border-pink-400/70 bg-black/60 px-2 py-1.5 shadow-[0_0_14px_rgba(244,114,182,0.5)]">
          <div>
            <div className="text-[9px] font-bold tracking-wider text-pink-300">LIFE</div>
            <div className="flex gap-0.5">
              {Array.from({ length: maxLife }, (_, i) => (
                <span key={i} className={`text-base ${i < life ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                  ❤️
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={onTogglePause}
            className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-xs font-black text-white active:scale-90"
          >
            {paused ? '▶' : '❚❚'}
          </button>
        </div>
      </div>

      {fever && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-pink-400 via-yellow-300 to-fuchsia-500 animate-rainbow-bg"
            style={{ width: `${(feverTimeLeftMs / feverDurationMs) * 100}%` }}
          />
        </div>
      )}
    </div>
  )
}
