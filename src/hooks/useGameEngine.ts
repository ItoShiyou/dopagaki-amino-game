import { useCallback, useEffect, useReducer, useRef } from 'react'
import {
  pickDisplayFormat,
  randomAminoAcidForStage,
  type AminoAcid,
  type Stage,
} from '../data/aminoAcids'
import type { EngineState, FallingItem, Mode, PreviewItem } from '../types'
import { useAudioEngine } from './useAudioEngine'

const MAX_LIFE = 5
const FEVER_COMBO_THRESHOLD = 20
const FEVER_DURATION_MS = 15000
const CRACK_MILESTONE = 5
const ATSU_CHANCE = 0.05
const REVIVAL_BASE_CHANCE = 0.3
const REVIVAL_GUARANTEED_COMBO = 50
const REVIVAL_TAPS_NEEDED = 12
const REVIVAL_TIME_LIMIT_MS = 4000
const GLOW_ASSIST_COMBO = 10

const FALL_DURATION_BY_STAGE: Record<Stage, number> = {
  1: 4200,
  2: 3400,
  3: 2500,
}

function displayTextFor(amino: AminoAcid, format: 'name' | 'code3'): string {
  return format === 'name' ? amino.nameJa : amino.code3
}

function buildFallingItem(stage: Stage, seq: number): FallingItem {
  const amino = randomAminoAcidForStage(stage)
  const format = pickDisplayFormat(stage)
  return {
    id: seq,
    amino,
    displayText: displayTextFor(amino, format),
    isAtsu: Math.random() < ATSU_CHANCE,
    fallDurationMs: FALL_DURATION_BY_STAGE[stage],
    leftPercent: 12 + Math.random() * 76,
    spawnedAt: Date.now(),
  }
}

function buildPreview(stage: Stage, seq: number): PreviewItem {
  const amino = randomAminoAcidForStage(stage)
  const format = pickDisplayFormat(stage)
  const isAtsu = Math.random() < ATSU_CHANCE
  return {
    id: seq,
    amino,
    displayText: displayTextFor(amino, format),
    isAtsu,
    revealed: !isAtsu,
  }
}

type Action =
  | { type: 'START_GAME'; mode: Mode; stage: Stage }
  | { type: 'SPAWN_NEXT' }
  | { type: 'REVEAL_PREVIEW'; previewId: number }
  | { type: 'ANSWER_CORRECT' }
  | { type: 'ANSWER_WRONG' }
  | { type: 'MISS' }
  | { type: 'FEVER_TICK'; deltaMs: number }
  | { type: 'FEVER_END' }
  | { type: 'REVIVAL_OFFERED' }
  | { type: 'REVIVAL_TAP' }
  | { type: 'REVIVAL_SUCCESS' }
  | { type: 'GAME_OVER' }
  | { type: 'RETURN_TITLE' }

function initialState(): EngineState {
  return {
    screen: 'title',
    mode: 'A',
    stage: 1,
    life: MAX_LIFE,
    maxLife: MAX_LIFE,
    score: 0,
    combo: 0,
    maxCombo: 0,
    fever: false,
    feverTimeLeftMs: 0,
    current: null,
    preview: null,
    frameTheme: 0,
    flashKey: 0,
    flashColor: 'gold',
    crackKey: 0,
    particleKey: 0,
    particleColor: '#ffd700',
    comboPopupKey: 0,
    wrongShakeKey: 0,
    glowAssist: false,
    revivalPending: false,
    revivalOffered: false,
    revivalTapsNeeded: REVIVAL_TAPS_NEEDED,
    revivalTapsDone: 0,
    revivalDeadline: null,
    itemSeq: 0,
  }
}

function applyMistake(state: EngineState): EngineState {
  const nextCombo = 0
  if (state.fever) {
    return { ...state, combo: nextCombo, wrongShakeKey: state.wrongShakeKey + 1 }
  }
  const nextLife = state.life - 1
  if (nextLife <= 0) {
    const offered = shouldOfferRevival(state.maxCombo)
    return {
      ...state,
      life: 0,
      combo: nextCombo,
      wrongShakeKey: state.wrongShakeKey + 1,
      revivalPending: true,
      revivalOffered: offered,
      revivalTapsDone: 0,
      revivalDeadline: offered ? Date.now() + REVIVAL_TIME_LIMIT_MS : null,
    }
  }
  return { ...state, life: nextLife, combo: nextCombo, wrongShakeKey: state.wrongShakeKey + 1 }
}

function reducer(state: EngineState, action: Action): EngineState {
  switch (action.type) {
    case 'START_GAME': {
      const s = initialState()
      const seq1 = 1
      const seq2 = 2
      return {
        ...s,
        screen: 'playing',
        mode: action.mode,
        stage: action.stage,
        current: buildFallingItem(action.stage, seq1),
        preview: buildPreview(action.stage, seq2),
        itemSeq: seq2,
      }
    }
    case 'SPAWN_NEXT': {
      if (!state.preview) return state
      const nextSeq = state.itemSeq + 1
      const promoted: FallingItem = {
        id: state.preview.id,
        amino: state.preview.amino,
        displayText: state.preview.displayText,
        isAtsu: state.preview.isAtsu,
        fallDurationMs: FALL_DURATION_BY_STAGE[state.stage],
        leftPercent: 12 + Math.random() * 76,
        spawnedAt: Date.now(),
      }
      return {
        ...state,
        current: promoted,
        preview: buildPreview(state.stage, nextSeq),
        itemSeq: nextSeq,
      }
    }
    case 'REVEAL_PREVIEW': {
      if (!state.preview || state.preview.id !== action.previewId) return state
      return { ...state, preview: { ...state.preview, revealed: true } }
    }
    case 'ANSWER_CORRECT': {
      if (!state.current) return state
      const wasAtsu = state.current.isAtsu
      const combo = state.combo + 1
      const maxCombo = Math.max(state.maxCombo, combo)
      const base = 100 * state.stage
      let multiplier = 1
      if (wasAtsu) multiplier *= 10
      if (state.fever) multiplier *= 10
      const score = state.score + base * multiplier

      let fever = state.fever
      let feverTimeLeftMs = state.feverTimeLeftMs
      let flashColor: EngineState['flashColor'] = wasAtsu ? 'gold' : 'white'
      let bumpFlash = wasAtsu

      if (!fever && combo >= FEVER_COMBO_THRESHOLD) {
        fever = true
        feverTimeLeftMs = FEVER_DURATION_MS
        flashColor = 'rainbow'
        bumpFlash = true
      }

      let frameTheme = state.frameTheme
      let crackKey = state.crackKey
      if (combo > 0 && combo % CRACK_MILESTONE === 0) {
        frameTheme = ((state.frameTheme + 1) % 4) as EngineState['frameTheme']
        crackKey = state.crackKey + 1
      }

      return {
        ...state,
        combo,
        maxCombo,
        score,
        fever,
        feverTimeLeftMs,
        frameTheme,
        crackKey,
        flashKey: bumpFlash ? state.flashKey + 1 : state.flashKey,
        flashColor,
        particleKey: state.particleKey + 1,
        particleColor: wasAtsu ? '#ff2fd0' : '#ffd700',
        comboPopupKey: combo >= 3 ? state.comboPopupKey + 1 : state.comboPopupKey,
        glowAssist: combo >= GLOW_ASSIST_COMBO,
        current: null,
      }
    }
    case 'ANSWER_WRONG': {
      return applyMistake(state)
    }
    case 'MISS': {
      const mistaken = applyMistake(state)
      return { ...mistaken, current: null }
    }
    case 'FEVER_TICK': {
      if (!state.fever) return state
      const left = state.feverTimeLeftMs - action.deltaMs
      if (left <= 0) {
        return { ...state, fever: false, feverTimeLeftMs: 0 }
      }
      return { ...state, feverTimeLeftMs: left }
    }
    case 'FEVER_END':
      return { ...state, fever: false, feverTimeLeftMs: 0 }
    case 'REVIVAL_TAP': {
      if (!state.revivalPending || !state.revivalOffered) return state
      const done = state.revivalTapsDone + 1
      if (done >= state.revivalTapsNeeded) {
        return {
          ...state,
          life: 1,
          revivalPending: false,
          revivalOffered: false,
          revivalTapsDone: 0,
          revivalDeadline: null,
          combo: 0,
          current: buildFallingItem(state.stage, state.itemSeq + 1),
          itemSeq: state.itemSeq + 1,
        }
      }
      return { ...state, revivalTapsDone: done }
    }
    case 'GAME_OVER':
      return { ...state, screen: 'gameover', revivalPending: false, current: null }
    case 'RETURN_TITLE':
      return initialState()
    default:
      return state
  }
}

export function shouldOfferRevival(maxCombo: number): boolean {
  if (maxCombo >= REVIVAL_GUARANTEED_COMBO) return true
  return Math.random() < REVIVAL_BASE_CHANCE
}

export function useGameEngine() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)
  const stateRef = useRef(state)
  stateRef.current = state
  const audio = useAudioEngine()

  const missTimerRef = useRef<number | null>(null)
  const revealTimerRef = useRef<number | null>(null)
  const feverIntervalRef = useRef<number | null>(null)
  const revivalOfferTimerRef = useRef<number | null>(null)
  const revivalTimeoutRef = useRef<number | null>(null)
  const lastFrameTimeRef = useRef<number>(0)

  const clearMissTimer = useCallback(() => {
    if (missTimerRef.current !== null) {
      window.clearTimeout(missTimerRef.current)
      missTimerRef.current = null
    }
  }, [])

  // スケジュール: 落下アイテムのミス判定タイマー
  useEffect(() => {
    clearMissTimer()
    if (state.screen !== 'playing' || !state.current || state.revivalPending) return
    const remaining = state.current.fallDurationMs - (Date.now() - state.current.spawnedAt)
    missTimerRef.current = window.setTimeout(() => {
      dispatch({ type: 'MISS' })
      audio.playIncorrect()
    }, Math.max(0, remaining))
    return clearMissTimer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.current?.id, state.screen, state.revivalPending])

  // 次のターゲットを自動スポーン
  useEffect(() => {
    if (state.screen !== 'playing') return
    if (state.current === null && !state.revivalPending) {
      const t = window.setTimeout(() => dispatch({ type: 'SPAWN_NEXT' }), 220)
      return () => window.clearTimeout(t)
    }
  }, [state.current, state.screen, state.revivalPending])

  // プレビューの「保留変化」演出: 激アツなら少し遅れて公開
  useEffect(() => {
    if (revealTimerRef.current !== null) {
      window.clearTimeout(revealTimerRef.current)
      revealTimerRef.current = null
    }
    if (state.preview && state.preview.isAtsu && !state.preview.revealed) {
      const delay = 500 + Math.random() * 900
      const id = state.preview.id
      revealTimerRef.current = window.setTimeout(() => {
        dispatch({ type: 'REVEAL_PREVIEW', previewId: id })
      }, delay)
    }
    return () => {
      if (revealTimerRef.current !== null) {
        window.clearTimeout(revealTimerRef.current)
        revealTimerRef.current = null
      }
    }
  }, [state.preview?.id, state.preview?.isAtsu, state.preview?.revealed])

  // フィーバータイマー
  useEffect(() => {
    if (feverIntervalRef.current !== null) {
      window.clearInterval(feverIntervalRef.current)
      feverIntervalRef.current = null
    }
    if (state.fever) {
      lastFrameTimeRef.current = Date.now()
      feverIntervalRef.current = window.setInterval(() => {
        const now = Date.now()
        const delta = now - lastFrameTimeRef.current
        lastFrameTimeRef.current = now
        dispatch({ type: 'FEVER_TICK', deltaMs: delta })
      }, 200)
    }
    return () => {
      if (feverIntervalRef.current !== null) {
        window.clearInterval(feverIntervalRef.current)
        feverIntervalRef.current = null
      }
    }
  }, [state.fever])

  // フィーバー突入/終了SEとBGM切り替え
  const prevFeverRef = useRef(false)
  useEffect(() => {
    if (state.screen !== 'playing') return
    if (state.fever && !prevFeverRef.current) {
      audio.playFeverStart()
      audio.startBgm(true)
    } else if (!state.fever && prevFeverRef.current) {
      audio.startBgm(false)
    }
    prevFeverRef.current = state.fever
  }, [state.fever, state.screen, audio])

  // コンボマイルストーンで「バキィ」演出音
  const prevCrackKeyRef = useRef(0)
  useEffect(() => {
    if (state.crackKey !== prevCrackKeyRef.current) {
      prevCrackKeyRef.current = state.crackKey
      audio.playCrack()
    }
  }, [state.crackKey, audio])

  // ライフ管理: BGM開始/停止、ライフ1で心臓音、復活演出のオファー判定
  const prevLifeRef = useRef(MAX_LIFE)
  useEffect(() => {
    if (state.screen !== 'playing') return
    if (state.revivalPending) {
      audio.stopHeartbeat()
      return
    }
    if (state.life === 1) {
      audio.stopBgm()
      audio.startHeartbeat()
    } else {
      audio.stopHeartbeat()
      if (state.life > 1) {
        audio.startBgm(state.fever)
      }
    }
    prevLifeRef.current = state.life
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.life, state.screen, state.revivalPending])

  // 復活演出のオファー判定とタイムアウト処理
  useEffect(() => {
    if (revivalOfferTimerRef.current !== null) {
      window.clearTimeout(revivalOfferTimerRef.current)
      revivalOfferTimerRef.current = null
    }
    if (revivalTimeoutRef.current !== null) {
      window.clearTimeout(revivalTimeoutRef.current)
      revivalTimeoutRef.current = null
    }
    if (!state.revivalPending) return

    audio.stopBgm()
    audio.stopHeartbeat()

    if (!state.revivalOffered) {
      revivalOfferTimerRef.current = window.setTimeout(() => {
        dispatch({ type: 'GAME_OVER' })
      }, 1400)
      return
    }

    audio.playRevival()
    const deadline = state.revivalDeadline ?? Date.now() + REVIVAL_TIME_LIMIT_MS
    const remaining = Math.max(0, deadline - Date.now())
    revivalTimeoutRef.current = window.setTimeout(() => {
      if (stateRef.current.revivalPending) {
        dispatch({ type: 'GAME_OVER' })
      }
    }, remaining)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.revivalPending, state.revivalOffered])

  useEffect(() => {
    if (state.screen === 'playing' && state.life === 0 && !state.revivalPending) {
      dispatch({ type: 'GAME_OVER' })
    }
  }, [state.screen, state.life, state.revivalPending])

  const startGame = useCallback(
    (mode: Mode, stage: Stage) => {
      audio.unlock()
      dispatch({ type: 'START_GAME', mode, stage })
      window.setTimeout(() => audio.startBgm(false), 50)
    },
    [audio],
  )

  const submitAnswer = useCallback(
    (code1: string) => {
      const s = stateRef.current
      if (s.screen !== 'playing' || !s.current || s.revivalPending) return
      if (s.current.amino.code1 === code1) {
        audio.playCorrect(s.combo)
        dispatch({ type: 'ANSWER_CORRECT' })
      } else {
        audio.playIncorrect()
        dispatch({ type: 'ANSWER_WRONG' })
      }
    },
    [audio],
  )

  const tapRevival = useCallback(() => {
    dispatch({ type: 'REVIVAL_TAP' })
  }, [])

  const returnToTitle = useCallback(() => {
    audio.stopBgm()
    audio.stopHeartbeat()
    dispatch({ type: 'RETURN_TITLE' })
  }, [audio])

  useEffect(() => {
    return () => {
      audio.stopBgm()
      audio.stopHeartbeat()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { state, startGame, submitAnswer, tapRevival, returnToTitle }
}
