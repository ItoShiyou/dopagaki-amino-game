import type { AminoAcid, Stage } from './data/aminoAcids'

export type Screen = 'title' | 'playing' | 'gameover'
export type Mode = 'A' | 'B'
export type DisplayFormat = 'name' | 'code3'

export interface FallingItem {
  id: number
  amino: AminoAcid
  displayText: string
  isAtsu: boolean
  fallDurationMs: number
  leftPercent: number
  spawnedAt: number
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
  mode: Mode
  stage: Stage
  life: number
  maxLife: number
  score: number
  combo: number
  maxCombo: number
  fever: boolean
  feverTimeLeftMs: number
  current: FallingItem | null
  preview: PreviewItem | null
  frameTheme: FrameTheme
  flashKey: number
  flashColor: 'gold' | 'red' | 'white' | 'rainbow'
  crackKey: number
  particleKey: number
  particleColor: string
  comboPopupKey: number
  wrongShakeKey: number
  glowAssist: boolean
  revivalPending: boolean
  revivalOffered: boolean
  revivalTapsNeeded: number
  revivalTapsDone: number
  revivalDeadline: number | null
  itemSeq: number
}

export { type AminoAcid, type Stage }
