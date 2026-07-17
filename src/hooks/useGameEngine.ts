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
const TICK_MS = 100
const LANE_COUNT = 4
const PREVIEW_QUEUE_LEN = 4

const FALL_DURATION_BY_STAGE: Record<Stage, number> = { 1: 4500, 2: 3800, 3: 3000 }
const MAX_CONCURRENT_BY_STAGE: Record<Stage, number> = { 1: 2, 2: 2, 3: 3 }
const SPAWN_INTERVAL_BY_STAGE: Record<Stage, number> = { 1: 1700, 2: 1350, 3: 1050 }

function displayTextFor(amino: AminoAcid, format: 'name' | 'code3'): string {
  return format === 'name' ? amino.nameJa : amino.code3
}

function laneToPercent(lane: number): number {
  const slot = 100 / LANE_COUNT
  const jitter = (Math.random() - 0.5) * (slot * 0.15)
  return slot * lane + slot / 2 + jitter
}

/** 隣接レーンでの視覚的な衝突を避けるため、既存レーンから最も離れた空きレーンを優先して選ぶ */
function pickLane(occupied: Set<number>): number {
  const all = Array.from({ length: LANE_COUNT }, (_, i) => i)
  const free = all.filter((l) => !occupied.has(l))
  const pool = free.length > 0 ? free : all
  if (occupied.size === 0) {
    return pool[Math.floor(Math.random() * pool.length)]
  }
  let bestScore = -1
  let candidates: number[] = []
  for (const lane of pool) {
    const minDist = Math.min(...Array.from(occupied, (o) => Math.abs(o - lane)))
    if (minDist > bestScore) {
      bestScore = minDist
      candidates = [lane]
    } else if (minDist === bestScore) {
      candidates.push(lane)
    }
  }
  return candidates[Math.floor(Math.random() * candidates.length)]
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

function previewToFalling(preview: PreviewItem, stage: Stage, lane: number, spawnClock: number): FallingItem {
  return {
    id: preview.id,
    amino: preview.amino,
    displayText: preview.displayText,
    isAtsu: preview.isAtsu,
    fallDurationMs: FALL_DURATION_BY_STAGE[stage],
    leftPercent: laneToPercent(lane),
    lane,
    spawnClock,
  }
}

type Action =
  | { type: 'START_GAME'; mode: Mode; stage: Stage }
  | { type: 'TICK'; deltaMs: number }
  | { type: 'REVEAL_PREVIEW'; previewId: number }
  | { type: 'ANSWER_CORRECT'; itemId: number }
  | { type: 'ANSWER_WRONG' }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'REVIVAL_TAP' }
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
    hits: 0,
    fever: false,
    feverTimeLeftMs: 0,
    paused: false,
    gameClock: 0,
    lastSpawnClock: 0,
    fallingItems: [],
    previewQueue: [],
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

interface MistakeOutcome {
  life: number
  combo: number
  wrongShakeKey: number
  revivalPending: boolean
  revivalOffered: boolean
  revivalDeadline: number | null
}

function computeMistakeOutcome(state: EngineState, lossCount: number): MistakeOutcome {
  const wrongShakeKey = state.wrongShakeKey + 1
  if (state.fever) {
    return {
      life: state.life,
      combo: 0,
      wrongShakeKey,
      revivalPending: false,
      revivalOffered: false,
      revivalDeadline: null,
    }
  }
  const life = Math.max(0, state.life - lossCount)
  if (life <= 0) {
    const offered = shouldOfferRevival(state.maxCombo)
    return {
      life: 0,
      combo: 0,
      wrongShakeKey,
      revivalPending: true,
      revivalOffered: offered,
      revivalDeadline: offered ? Date.now() + REVIVAL_TIME_LIMIT_MS : null,
    }
  }
  return {
    life,
    combo: 0,
    wrongShakeKey,
    revivalPending: false,
    revivalOffered: false,
    revivalDeadline: null,
  }
}

function reducer(state: EngineState, action: Action): EngineState {
  switch (action.type) {
    case 'START_GAME': {
      const s = initialState()
      let itemSeq = 0
      const previewQueue: PreviewItem[] = []
      for (let i = 0; i < PREVIEW_QUEUE_LEN; i++) {
        itemSeq += 1
        previewQueue.push(buildPreview(action.stage, itemSeq))
      }

      const maxConcurrent = MAX_CONCURRENT_BY_STAGE[action.stage]
      const fallingItems: FallingItem[] = []
      const occupied = new Set<number>()
      for (let i = 0; i < maxConcurrent && previewQueue.length > 0; i++) {
        const head = previewQueue.shift()!
        const lane = pickLane(occupied)
        occupied.add(lane)
        fallingItems.push(previewToFalling(head, action.stage, lane, 0))
        itemSeq += 1
        previewQueue.push(buildPreview(action.stage, itemSeq))
      }

      return {
        ...s,
        screen: 'playing',
        mode: action.mode,
        stage: action.stage,
        fallingItems,
        previewQueue,
        itemSeq,
        lastSpawnClock: 0,
        gameClock: 0,
      }
    }
    case 'TICK': {
      if (state.screen !== 'playing' || state.paused || state.revivalPending) return state
      const clock = state.gameClock + action.deltaMs

      let fever = state.fever
      let feverTimeLeftMs = state.feverTimeLeftMs
      if (fever) {
        feverTimeLeftMs -= action.deltaMs
        if (feverTimeLeftMs <= 0) {
          fever = false
          feverTimeLeftMs = 0
        }
      }

      const stillFalling: FallingItem[] = []
      let expiredCount = 0
      for (const item of state.fallingItems) {
        if (clock - item.spawnClock >= item.fallDurationMs) {
          expiredCount += 1
        } else {
          stillFalling.push(item)
        }
      }

      let life = state.life
      let combo = state.combo
      let wrongShakeKey = state.wrongShakeKey
      let revivalPending = false
      let revivalOffered = state.revivalOffered
      let revivalDeadline = state.revivalDeadline

      if (expiredCount > 0) {
        const outcome = computeMistakeOutcome({ ...state, fever }, expiredCount)
        life = outcome.life
        combo = outcome.combo
        wrongShakeKey = outcome.wrongShakeKey
        revivalPending = outcome.revivalPending
        revivalOffered = outcome.revivalOffered
        revivalDeadline = outcome.revivalDeadline
      }

      let fallingItems = stillFalling
      let previewQueue = state.previewQueue
      let lastSpawnClock = state.lastSpawnClock
      let itemSeq = state.itemSeq

      const maxConcurrent = Math.min(LANE_COUNT, MAX_CONCURRENT_BY_STAGE[state.stage] + (fever ? 1 : 0))
      const spawnInterval = SPAWN_INTERVAL_BY_STAGE[state.stage] * (fever ? 0.7 : 1)

      if (
        !revivalPending &&
        fallingItems.length < maxConcurrent &&
        fallingItems.length < LANE_COUNT &&
        clock - lastSpawnClock >= spawnInterval &&
        previewQueue.length > 0
      ) {
        const [head, ...rest] = previewQueue
        const occupied = new Set(fallingItems.map((f) => f.lane))
        const lane = pickLane(occupied)
        fallingItems = [...fallingItems, previewToFalling(head, state.stage, lane, clock)]
        itemSeq += 1
        previewQueue = [...rest, buildPreview(state.stage, itemSeq)]
        lastSpawnClock = clock
      }

      return {
        ...state,
        gameClock: clock,
        fever,
        feverTimeLeftMs,
        fallingItems,
        previewQueue,
        lastSpawnClock,
        itemSeq,
        life,
        combo,
        wrongShakeKey,
        revivalPending,
        revivalOffered,
        revivalDeadline,
        revivalTapsDone: revivalPending ? 0 : state.revivalTapsDone,
      }
    }
    case 'REVEAL_PREVIEW': {
      const idx = state.previewQueue.findIndex((p) => p.id === action.previewId)
      if (idx === -1) return state
      const previewQueue = [...state.previewQueue]
      previewQueue[idx] = { ...previewQueue[idx], revealed: true }
      return { ...state, previewQueue }
    }
    case 'ANSWER_CORRECT': {
      const item = state.fallingItems.find((f) => f.id === action.itemId)
      if (!item) return state
      const fallingItems = state.fallingItems.filter((f) => f.id !== action.itemId)
      const wasAtsu = item.isAtsu
      const combo = state.combo + 1
      const maxCombo = Math.max(state.maxCombo, combo)
      const hits = state.hits + 1
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
        fallingItems,
        combo,
        maxCombo,
        hits,
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
      }
    }
    case 'ANSWER_WRONG': {
      const outcome = computeMistakeOutcome(state, 1)
      return { ...state, ...outcome }
    }
    case 'TOGGLE_PAUSE': {
      if (state.screen !== 'playing' || state.revivalPending) return state
      return { ...state, paused: !state.paused }
    }
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
        }
      }
      return { ...state, revivalTapsDone: done }
    }
    case 'GAME_OVER':
      return { ...state, screen: 'gameover', revivalPending: false, fallingItems: [] }
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

  const revealTimerRef = useRef<number | null>(null)
  const revivalOfferTimerRef = useRef<number | null>(null)
  const revivalTimeoutRef = useRef<number | null>(null)

  // ゲームクロックの心臓部: 100msごとに進行・失点判定・自動スポーンをまとめて処理
  useEffect(() => {
    if (state.screen !== 'playing' || state.paused || state.revivalPending) return
    let last = Date.now()
    const id = window.setInterval(() => {
      const now = Date.now()
      const delta = now - last
      last = now
      dispatch({ type: 'TICK', deltaMs: delta })
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [state.screen, state.paused, state.revivalPending])

  // プレビューの「保留変化」演出: NEXT枠が激アツなら少し遅れて公開
  const nextPreview = state.previewQueue[0] ?? null
  useEffect(() => {
    if (revealTimerRef.current !== null) {
      window.clearTimeout(revealTimerRef.current)
      revealTimerRef.current = null
    }
    if (nextPreview && nextPreview.isAtsu && !nextPreview.revealed) {
      const delay = 500 + Math.random() * 900
      const id = nextPreview.id
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
  }, [nextPreview?.id, nextPreview?.isAtsu, nextPreview?.revealed])

  // ミス(誤タップ/落下ミス)のブザー音を一括で処理
  const prevWrongShakeKeyRef = useRef(0)
  useEffect(() => {
    if (state.wrongShakeKey !== prevWrongShakeKeyRef.current) {
      prevWrongShakeKeyRef.current = state.wrongShakeKey
      audio.playIncorrect()
    }
  }, [state.wrongShakeKey, audio])

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

  // ライフ管理: BGM開始/停止、ライフ1で心臓音、ポーズ中は静音
  useEffect(() => {
    if (state.screen !== 'playing') return
    if (state.paused || state.revivalPending) {
      audio.stopHeartbeat()
      audio.stopBgm()
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
  }, [state.life, state.screen, state.paused, state.revivalPending, state.fever, audio])

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
      if (s.screen !== 'playing' || s.revivalPending || s.paused) return
      const item = s.fallingItems.find((f) => f.amino.code1 === code1)
      if (item) {
        audio.playCorrect(s.combo)
        dispatch({ type: 'ANSWER_CORRECT', itemId: item.id })
      } else if (s.fallingItems.length > 0) {
        dispatch({ type: 'ANSWER_WRONG' })
      }
    },
    [audio],
  )

  const tapRevival = useCallback(() => {
    dispatch({ type: 'REVIVAL_TAP' })
  }, [])

  const togglePause = useCallback(() => {
    dispatch({ type: 'TOGGLE_PAUSE' })
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

  return { state, startGame, submitAnswer, tapRevival, togglePause, returnToTitle }
}
