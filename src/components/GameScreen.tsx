import type { EngineState } from '../types'
import { FallingTarget } from './FallingTarget'
import { PreviewPanel } from './PreviewPanel'
import { SideStats } from './SideStats'
import { Hud } from './Hud'
import { BottomBar } from './BottomBar'
import { EffectsLayer } from './EffectsLayer'
import { RevivalCutIn } from './RevivalCutIn'
import { KeypadModeA } from './KeypadModeA'
import { PushButtonsModeB } from './PushButtonsModeB'

const FRAME_THEMES = [
  'ring-4 ring-white/20',
  'ring-4 ring-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.6)]',
  'ring-4 ring-fuchsia-400 shadow-[0_0_30px_rgba(232,121,249,0.7)]',
  'ring-4 ring-yellow-300 shadow-[0_0_40px_rgba(253,224,71,0.8)]',
]

const FEVER_DURATION_MS = 15000

interface Props {
  state: EngineState
  onAnswer: (code1: string) => void
  onRevivalTap: () => void
  onTogglePause: () => void
}

export function GameScreen({ state, onAnswer, onRevivalTap, onTogglePause }: Props) {
  const activeCodes = new Set(state.fallingItems.map((f) => f.amino.code1))
  const multiplier = state.fever ? 10 : 1

  return (
    <div
      className={`relative flex h-full w-full flex-col overflow-hidden transition-shadow duration-300 ${
        FRAME_THEMES[state.frameTheme]
      } ${state.fever ? 'animate-rainbow-bg bg-[linear-gradient(135deg,#3a0066,#000)]' : 'bg-gradient-to-b from-[#12002b] to-black'}`}
    >
      <Hud
        life={state.life}
        maxLife={state.maxLife}
        score={state.score}
        multiplier={multiplier}
        fever={state.fever}
        feverTimeLeftMs={state.feverTimeLeftMs}
        feverDurationMs={FEVER_DURATION_MS}
        paused={state.paused}
        onTogglePause={onTogglePause}
      />

      <div className="relative flex-1">
        <div className="absolute inset-0 z-10">
          {state.fallingItems.map((item) => (
            <FallingTarget key={item.id} item={item} paused={state.paused || state.revivalPending} />
          ))}
        </div>
        <SideStats combo={state.combo} maxCombo={state.maxCombo} stage={state.stage} />
        <PreviewPanel previewQueue={state.previewQueue} />

        {state.paused && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70">
            <p className="text-outline animate-pop text-3xl font-black text-white">一時停止中</p>
          </div>
        )}

        <EffectsLayer
          flashKey={state.flashKey}
          flashColor={state.flashColor}
          particleKey={state.particleKey}
          particleColor={state.particleColor}
          comboPopupKey={state.comboPopupKey}
          combo={state.combo}
        />
      </div>

      <div
        key={`controls-${state.wrongShakeKey}`}
        className={`z-20 border-t border-white/10 bg-black/40 backdrop-blur-sm ${
          state.wrongShakeKey > 0 ? 'animate-shake' : ''
        }`}
      >
        {state.mode === 'A' ? (
          <KeypadModeA
            onTap={onAnswer}
            activeCodes={activeCodes}
            glowAssist={state.glowAssist}
            disabled={state.revivalPending || state.paused}
          />
        ) : (
          <PushButtonsModeB
            onTap={onAnswer}
            fallingItems={state.fallingItems}
            stage={state.stage}
            disabled={state.revivalPending || state.paused}
          />
        )}
      </div>

      <BottomBar hits={state.hits} />

      <RevivalCutIn
        visible={state.revivalPending}
        offered={state.revivalOffered}
        tapsNeeded={state.revivalTapsNeeded}
        tapsDone={state.revivalTapsDone}
        onTap={onRevivalTap}
      />
    </div>
  )
}
