import { CATEGORY_META } from '../data/aminoAcids'
import type { PreviewItem } from '../types'

interface Props {
  previewQueue: PreviewItem[]
}

function NextBox({ preview }: { preview: PreviewItem }) {
  const showAtsu = preview.isAtsu && preview.revealed
  const meta = CATEGORY_META[preview.amino.category]

  return (
    <div className="flex flex-col items-center">
      <span className="mb-0.5 text-[9px] font-bold tracking-wider text-white/60">NEXT</span>
      <div
        key={preview.id}
        className={`neon-pulse animate-pop flex h-16 w-16 flex-col items-center justify-center rounded-xl border-2 text-center text-[11px] font-bold leading-tight ${
          showAtsu
            ? 'border-yellow-300 bg-gradient-to-br from-pink-500 via-yellow-400 to-fuchsia-600 text-black'
            : 'bg-black/70 text-white/90'
        }`}
        style={{ '--neon-color': showAtsu ? '#ffd700' : meta.glow, borderColor: showAtsu ? undefined : meta.color } as React.CSSProperties}
      >
        {showAtsu ? (
          <>
            <span>🔥{preview.amino.code3}</span>
            <span className="text-[8px] text-red-900">激アツ!!</span>
          </>
        ) : preview.isAtsu && !preview.revealed ? (
          <span className="animate-pulse text-white/50">？？？</span>
        ) : (
          <span>{preview.amino.code3}</span>
        )}
      </div>
    </div>
  )
}

export function PreviewPanel({ previewQueue }: Props) {
  if (previewQueue.length === 0) return null
  const [next, ...queue] = previewQueue

  return (
    <div className="absolute right-2 top-2 z-20 flex flex-col items-end gap-2">
      <NextBox preview={next} />
      {queue.length > 0 && (
        <div className="flex flex-col items-center rounded-lg border border-white/15 bg-black/40 px-1.5 py-1">
          <span className="mb-1 text-[8px] font-bold tracking-wider text-white/50">QUEUE</span>
          <div className="flex flex-col gap-1">
            {queue.map((p) => {
              const meta = CATEGORY_META[p.amino.category]
              return (
                <div
                  key={p.id}
                  className="flex h-6 w-12 items-center justify-center rounded-md border text-[10px] font-bold text-white/90"
                  style={{ borderColor: meta.color + 'aa', boxShadow: `0 0 6px ${meta.glow}` }}
                >
                  {p.amino.code3}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
