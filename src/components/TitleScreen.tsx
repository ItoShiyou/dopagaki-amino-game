import { useState } from 'react'
import type { Mode, Stage } from '../types'

interface Props {
  onStart: (mode: Mode, stage: Stage) => void
}

const STAGE_INFO: { stage: Stage; label: string; desc: string }[] = [
  { stage: 1, label: 'STAGE 1 初級', desc: '日本語名 → 1文字記号' },
  { stage: 2, label: 'STAGE 2 中級', desc: '3文字記号 → 1文字記号' },
  { stage: 3, label: 'STAGE 3 地獄', desc: '混合・高速・ドパガキ殺し' },
]

export function TitleScreen({ onStart }: Props) {
  const [mode, setMode] = useState<Mode>('A')
  const [stage, setStage] = useState<Stage>(1)

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#1a0033] via-[#0a0014] to-black px-4 py-8 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30 animate-rainbow-bg bg-[radial-gradient(circle_at_50%_20%,#ff00cc_0%,transparent_60%)]" />

      <div className="z-10 mt-4 text-center">
        <p className="text-sm tracking-widest text-fuchsia-300">HAMARU 風・脳汁暗記アクション</p>
        <h1 className="mt-2 text-4xl font-black leading-tight text-outline">
          <span className="rainbow-text">ドパガキが</span>
          <br />
          <span className="text-yellow-300">アミノ酸を覚える</span>
        </h1>
      </div>

      <div className="z-10 w-full max-w-sm space-y-6">
        <div>
          <p className="mb-2 text-center text-sm font-bold text-fuchsia-200">モード選択</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode('A')}
              className={`rounded-2xl border-2 px-3 py-4 text-sm font-bold transition-all active:scale-95 ${
                mode === 'A'
                  ? 'border-yellow-300 bg-yellow-300/20 shadow-[0_0_20px_rgba(253,224,71,0.6)]'
                  : 'border-white/20 bg-white/5'
              }`}
            >
              モードA
              <div className="mt-1 text-xs font-normal text-white/70">固定キーパッド</div>
            </button>
            <button
              onClick={() => setMode('B')}
              className={`rounded-2xl border-2 px-3 py-4 text-sm font-bold transition-all active:scale-95 ${
                mode === 'B'
                  ? 'border-yellow-300 bg-yellow-300/20 shadow-[0_0_20px_rgba(253,224,71,0.6)]'
                  : 'border-white/20 bg-white/5'
              }`}
            >
              モードB
              <div className="mt-1 text-xs font-normal text-white/70">可変プッシュボタン</div>
            </button>
          </div>
        </div>

        <div>
          <p className="mb-2 text-center text-sm font-bold text-fuchsia-200">ステージ選択</p>
          <div className="space-y-2">
            {STAGE_INFO.map((s) => (
              <button
                key={s.stage}
                onClick={() => setStage(s.stage)}
                className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-all active:scale-95 ${
                  stage === s.stage
                    ? 'border-pink-400 bg-pink-400/20 shadow-[0_0_16px_rgba(244,114,182,0.5)]'
                    : 'border-white/20 bg-white/5'
                }`}
              >
                <span className="font-bold">{s.label}</span>
                <span className="text-xs text-white/70">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => onStart(mode, stage)}
        className="z-10 mb-2 w-full max-w-sm rounded-full bg-gradient-to-r from-yellow-300 via-pink-400 to-fuchsia-500 py-4 text-xl font-black text-black shadow-[0_0_30px_rgba(255,215,0,0.7)] transition-transform active:scale-95"
      >
        ゲームスタート！
      </button>
    </div>
  )
}
