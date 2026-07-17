interface Props {
  score: number
  maxCombo: number
  onRetry: () => void
  onTitle: () => void
}

export function GameOverScreen({ score, maxCombo, onRetry, onTitle }: Props) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-gradient-to-b from-[#1a0033] via-[#0a0014] to-black px-6 text-white">
      <p className="animate-pop text-4xl font-black text-outline text-red-400">GAME OVER</p>

      <div className="w-full max-w-xs space-y-3 rounded-2xl border border-white/20 bg-white/5 p-5 text-center">
        <div>
          <p className="text-xs text-white/60">SCORE</p>
          <p className="text-3xl font-black text-yellow-200 tabular-nums">{score.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-white/60">MAX COMBO</p>
          <p className="text-2xl font-black text-fuchsia-300 tabular-nums">{maxCombo}</p>
        </div>
      </div>

      <div className="w-full max-w-xs space-y-3">
        <button
          onClick={onRetry}
          className="w-full rounded-full bg-gradient-to-r from-yellow-300 via-pink-400 to-fuchsia-500 py-4 text-lg font-black text-black shadow-[0_0_30px_rgba(255,215,0,0.7)] transition-transform active:scale-95"
        >
          もう一度挑戦！
        </button>
        <button
          onClick={onTitle}
          className="w-full rounded-full border-2 border-white/30 bg-white/5 py-3 text-sm font-bold text-white/80 transition-transform active:scale-95"
        >
          タイトルへ戻る
        </button>
      </div>
    </div>
  )
}
