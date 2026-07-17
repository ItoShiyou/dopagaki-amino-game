import type { EngineState } from '../types'
import { FallingTarget } from './FallingTarget'
import { PreviewPanel } from './PreviewPanel'
import { Hud } from './Hud'
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
}

export function GameScreen({ state, onAnswer, onRevivalTap }: Props) {
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
        stage={state.stage}
        fever={state.fever}
        feverTimeLeftMs={state.feverTimeLeftMs}
        feverDurationMs={FEVER_DURATION_MS}
      />

      <div className="relative flex-1">
        <PreviewPanel preview={state.preview} />
        {state.current && <FallingTarget item={state.current} />}
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
            correctCode={state.current?.amino.code1 ?? null}
            glowAssist={state.glowAssist}
            disabled={!state.current || state.revivalPending}
          />
        ) : state.current ? (
          <PushButtonsModeB
            onTap={onAnswer}
            correctCode={state.current.amino.code1}
            targetId={state.current.id}
            stage={state.stage}
            isAtsu={state.current.isAtsu}
            disabled={state.revivalPending}
          />
        ) : (
          <div className="h-24" />
        )}
      </div>

      <EffectsLayer
        flashKey={state.flashKey}
        flashColor={state.flashColor}
        particleKey={state.particleKey}
        particleColor={state.particleColor}
        comboPopupKey={state.comboPopupKey}
        combo={state.combo}
      />

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
