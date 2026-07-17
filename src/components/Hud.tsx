interface Props {
  life: number
  maxLife: number
  score: number
  stage: number
  fever: boolean
  feverTimeLeftMs: number
  feverDurationMs: number
}

export function Hud({ life, maxLife, score, stage, fever, feverTimeLeftMs, feverDurationMs }: Props) {
  return (
    <div className="z-20 flex flex-col gap-1 p-2">
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5">
          {Array.from({ length: maxLife }, (_, i) => (
            <span key={i} className={`text-xl ${i < life ? 'opacity-100' : 'opacity-20 grayscale'}`}>
              ❤️
            </span>
          ))}
        </div>
        <div className="rounded-full bg-white/10 px-3 py-0.5 text-xs font-bold text-white/80">
          STAGE {stage}
        </div>
      </div>
      <div className="text-right text-2xl font-black text-outline text-yellow-200 tabular-nums">
        {score.toLocaleString()}
      </div>
      {fever && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-pink-400 via-yellow-300 to-fuchsia-500 animate-rainbow-bg"
            style={{ width: `${(feverTimeLeftMs / feverDurationMs) * 100}%` }}
          />
        </div>
      )}
    </div>
  )
}
