import { motion } from 'framer-motion'
import type { EngineState } from '../types'
import { FallingTarget } from './FallingTarget'
import { PreviewPanel } from './PreviewPanel'
import { SideStats } from './SideStats'
import { Hud } from './Hud'
import { BottomBar } from './BottomBar'
import { EffectsLayer } from './EffectsLayer'
import { ComboMegaDisplay } from './ComboMegaDisplay'
import { ScorePopup } from './ScorePopup'
import { AmbientParticles } from './AmbientParticles'
import { RevivalCutIn } from './RevivalCutIn'
import { KeypadModeA } from './KeypadModeA'
import { PushButtonsModeB } from './PushButtonsModeB'
import { useCameraFX } from '../hooks/useCameraFX'
import { getTierMeta } from '../lib/comboTier'

const FRAME_THEMES = [
  'ring-4 ring-white/20',
  'ring-4 ring-cyan-400',
  'ring-4 ring-fuchsia-400',
  'ring-4 ring-yellow-300',
]

const FRAME_NEON_COLORS = [
  'rgba(255,255,255,0.25)',
  'rgba(34,211,238,0.85)',
  'rgba(232,121,249,0.9)',
  'rgba(253,224,71,0.95)',
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
  const cameraControls = useCameraFX(state.correctImpactKey, state.wrongShakeKey)
  const lifeCritical = state.life === 1 && !state.fever && !state.revivalPending
  const tierMeta = getTierMeta(state.combo)
  const ambientColor = state.fever ? '#ff2fd0' : tierMeta.color

  return (
    <motion.div
      animate={cameraControls}
      className={`game-frame neon-bg relative flex h-full w-full flex-col overflow-hidden ${
        state.fever ? 'fever' : ''
      } ${FRAME_THEMES[state.frameTheme]} ${
        state.fever ? 'bg-[linear-gradient(135deg,#3a0066,#000)]' : 'bg-gradient-to-b from-[#12002b] to-black'
      }`}
      style={{ '--neon-color': FRAME_NEON_COLORS[state.frameTheme] } as React.CSSProperties}
    >
      {state.fever && (
        <div className="fever-speedlines pointer-events-none absolute inset-0 z-[6] opacity-40" />
      )}
      {state.fever && (
        <>
          <div
            className="laser-sweep pointer-events-none absolute left-0 top-[20%] z-[7] h-1 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent"
            style={{ boxShadow: '0 0 20px 4px #fff' }}
          />
          <div
            className="laser-sweep pointer-events-none absolute left-0 top-[65%] z-[7] h-1 w-1/2 bg-gradient-to-r from-transparent via-cyan-300 to-transparent"
            style={{ boxShadow: '0 0 20px 4px #22d3ee', animationDelay: '1.1s' }}
          />
        </>
      )}
      <AmbientParticles color={ambientColor} intense={state.fever} />

      <div className={lifeCritical ? 'life-critical relative z-10 flex h-full w-full flex-col' : 'relative z-10 flex h-full w-full flex-col'}>
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
          />
          <ComboMegaDisplay combo={state.combo} comboPopupKey={state.comboPopupKey} />
          <ScorePopup scorePopupKey={state.scorePopupKey} gain={state.lastScoreGain} multiplier={multiplier} />
        </div>

        <div className="z-20 border-t border-white/10 bg-black/40 backdrop-blur-sm">
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
      </div>

      {lifeCritical && <div className="vignette-critical pointer-events-none absolute inset-0 z-40" />}

      <RevivalCutIn
        visible={state.revivalPending}
        offered={state.revivalOffered}
        tapsNeeded={state.revivalTapsNeeded}
        tapsDone={state.revivalTapsDone}
        onTap={onRevivalTap}
      />
    </motion.div>
  )
}
