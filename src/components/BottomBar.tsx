interface Props {
  hits: number
}

export function BottomBar({ hits }: Props) {
  return (
    <div className="z-20 flex items-center justify-between border-t border-white/10 bg-black/60 px-3 py-1.5">
      <div className="flex items-center gap-1.5">
        <div className="flex items-end gap-[2px]">
          {[6, 10, 5, 12, 8].map((h, i) => (
            <span
              key={i}
              className="w-[3px] animate-pulse rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.9)]"
              style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
        <div className="leading-tight">
          <div className="text-[8px] font-bold tracking-wider text-white/50">HITS</div>
          <div className="text-sm font-black text-white tabular-nums">{hits}</div>
        </div>
      </div>
      <p className="text-outline text-xs font-black leading-tight text-white/90">
        ドパガキの限界を、<span className="text-red-400">ぶち破れ。</span>
      </p>
    </div>
  )
}
