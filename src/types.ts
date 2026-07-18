import type { AminoAcid, Stage } from './data/aminoAcids'

export type Screen = 'title' | 'playing' | 'gameover'
export type DisplayFormat = 'name' | 'code3'

export interface FallingItem {
  id: number
  amino: AminoAcid
  displayText: string
  isAtsu: boolean
  fallDurationMs: number
  leftPercent: number
  lane: number
  spawnClock: number
}

export interface PreviewItem {
  id: number
  amino: AminoAcid
  displayText: string
  isAtsu: boolean
  revealed: boolean
}

export type FrameTheme = 0 | 1 | 2 | 3

export interface EngineState {
  screen: Screen
  stage: Stage
  life: number
  maxLife: number
  score: number
  combo: number
  maxCombo: number
  hits: number
  fever: boolean
  feverTimeLeftMs: number
  paused: boolean
  gameClock: number
  lastSpawnClock: number
  fallingItems: FallingItem[]
  previewQueue: PreviewItem[]
  frameTheme: FrameTheme
  flashKey: number
  flashColor: 'gold' | 'red' | 'white' | 'rainbow'
  crackKey: number
  particleKey: number
  particleColor: string
  comboPopupKey: number
  wrongShakeKey: number
  correctImpactKey: number
  lastScoreGain: number
  scorePopupKey: number
  revivalPending: boolean
  revivalOffered: boolean
  revivalTapsNeeded: number
  revivalTapsDone: number
  revivalDeadline: number | null
  itemSeq: number
}

export { type AminoAcid, type Stage }
