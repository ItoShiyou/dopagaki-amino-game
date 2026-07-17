import type { PreviewItem } from '../types'

interface Props {
  preview: PreviewItem | null
}

export function PreviewPanel({ preview }: Props) {
  if (!preview) return null
  const showAtsu = preview.isAtsu && preview.revealed

  return (
    <div className="absolute right-2 top-2 z-20 flex flex-col items-center">
      <span className="mb-1 text-[10px] font-bold text-white/60">NEXT</span>
      <div
        key={preview.id}
        className={`animate-pop flex h-16 w-16 items-center justify-center rounded-xl border-2 text-center text-[11px] font-bold leading-tight ${
          showAtsu
            ? 'border-yellow-300 bg-gradient-to-br from-pink-500 via-yellow-400 to-fuchsia-600 text-black animate-glow-pulse'
            : 'border-white/30 bg-black/60 text-white/90'
        }`}
      >
        {showAtsu ? (
          <span>🔥{preview.displayText}</span>
        ) : preview.isAtsu && !preview.revealed ? (
          <span className="animate-pulse text-white/50">？？？</span>
        ) : (
          <span>{preview.displayText}</span>
        )}
      </div>
    </div>
  )
}
