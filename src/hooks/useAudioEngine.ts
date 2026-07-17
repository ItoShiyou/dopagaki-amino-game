import { useCallback, useRef } from 'react'

/** ド→レ→ミ...と上がっていく音階（コンボが伸びるほど気持ちよく高くなる） */
const SCALE_HZ = [
  261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25, 587.33, 659.25,
  698.46, 783.99, 880.0, 987.77, 1046.5, 1174.66, 1318.51, 1396.91, 1567.98, 1760.0,
]

export function useAudioEngine() {
  const ctxRef = useRef<AudioContext | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const bgmNodesRef = useRef<{ stop: () => void } | null>(null)
  const heartbeatNodesRef = useRef<{ stop: () => void } | null>(null)

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      const ctx = new AudioContext()
      const gain = ctx.createGain()
      gain.gain.value = 0.35
      gain.connect(ctx.destination)
      ctxRef.current = ctx
      masterGainRef.current = gain
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }, [])

  /** 最初のユーザー操作で必ず呼ぶ（iOS Safari のオートプレイ制限解除） */
  const unlock = useCallback(() => {
    getCtx()
  }, [getCtx])

  const playCorrect = useCallback(
    (combo: number) => {
      const ctx = getCtx()
      const master = masterGainRef.current!
      const freq = SCALE_HZ[Math.min(combo, SCALE_HZ.length - 1)]
      const now = ctx.currentTime

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)

      const osc2 = ctx.createOscillator()
      osc2.type = 'triangle'
      osc2.frequency.setValueAtTime(freq * 2, now)
      const gain2 = ctx.createGain()
      gain2.gain.setValueAtTime(0.15, now)
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.exponentialRampToValueAtTime(0.5, now + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28)

      osc.connect(gain).connect(master)
      osc2.connect(gain2).connect(master)
      osc.start(now)
      osc2.start(now)
      osc.stop(now + 0.3)
      osc2.stop(now + 0.3)
    },
    [getCtx],
  )

  const playIncorrect = useCallback(() => {
    const ctx = getCtx()
    const master = masterGainRef.current!
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(140, now)
    osc.frequency.linearRampToValueAtTime(90, now + 0.25)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.001, now)
    gain.gain.exponentialRampToValueAtTime(0.4, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

    osc.connect(gain).connect(master)
    osc.start(now)
    osc.stop(now + 0.4)
  }, [getCtx])

  /** パチンコ的「キュインキュインキュイン！」超高音ピッシュ音 */
  const playRevival = useCallback(() => {
    const ctx = getCtx()
    const master = masterGainRef.current!
    const now = ctx.currentTime

    for (let i = 0; i < 3; i++) {
      const start = now + i * 0.18
      const osc = ctx.createOscillator()
      osc.type = 'square'
      osc.frequency.setValueAtTime(1800, start)
      osc.frequency.exponentialRampToValueAtTime(3600, start + 0.15)

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.001, start)
      gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16)

      osc.connect(gain).connect(master)
      osc.start(start)
      osc.stop(start + 0.17)
    }
  }, [getCtx])

  /** フィーバー突入音 — ハイスピードサイレン */
  const playFeverStart = useCallback(() => {
    const ctx = getCtx()
    const master = masterGainRef.current!
    const now = ctx.currentTime
    const duration = 1.2

    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.3, now)
    gain.gain.setValueAtTime(0.001, now + duration)

    for (let t = 0; t < duration; t += 0.15) {
      osc.frequency.setValueAtTime(600, now + t)
      osc.frequency.linearRampToValueAtTime(1400, now + t + 0.075)
      osc.frequency.linearRampToValueAtTime(600, now + t + 0.15)
    }

    osc.connect(gain).connect(master)
    osc.start(now)
    osc.stop(now + duration)
  }, [getCtx])

  /** ガラスが割れる「バキィィン！」音 */
  const playCrack = useCallback(() => {
    const ctx = getCtx()
    const master = masterGainRef.current!
    const now = ctx.currentTime

    const bufferSize = ctx.sampleRate * 0.3
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2)
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 1500

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.5, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

    noise.connect(filter).connect(gain).connect(master)
    noise.start(now)

    const osc = ctx.createOscillator()
    osc.type = 'square'
    osc.frequency.setValueAtTime(120, now)
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.2)
    const oscGain = ctx.createGain()
    oscGain.gain.setValueAtTime(0.3, now)
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
    osc.connect(oscGain).connect(master)
    osc.start(now)
    osc.stop(now + 0.2)
  }, [getCtx])

  const startBgm = useCallback(
    (fast: boolean) => {
      const ctx = getCtx()
      const master = masterGainRef.current!
      bgmNodesRef.current?.stop()

      const bpm = fast ? 200 : 110
      const stepDur = 60 / bpm / 2
      const notesNormal = [261.63, 329.63, 392.0, 329.63, 392.0, 440.0, 392.0, 329.63]
      const notesFever = [523.25, 659.25, 783.99, 659.25, 987.77, 880.0, 783.99, 659.25]
      const notes = fast ? notesFever : notesNormal

      let stepIndex = 0
      let stopped = false
      const bgmGain = ctx.createGain()
      bgmGain.gain.value = fast ? 0.12 : 0.08
      bgmGain.connect(master)

      const scheduleStep = () => {
        if (stopped) return
        const now = ctx.currentTime
        const freq = notes[stepIndex % notes.length]
        const osc = ctx.createOscillator()
        osc.type = fast ? 'square' : 'triangle'
        osc.frequency.setValueAtTime(freq, now)
        const g = ctx.createGain()
        g.gain.setValueAtTime(0.001, now)
        g.gain.exponentialRampToValueAtTime(1, now + 0.01)
        g.gain.exponentialRampToValueAtTime(0.001, now + stepDur * 0.9)
        osc.connect(g).connect(bgmGain)
        osc.start(now)
        osc.stop(now + stepDur)
        stepIndex++
      }

      const intervalId = window.setInterval(scheduleStep, stepDur * 1000)
      scheduleStep()

      bgmNodesRef.current = {
        stop: () => {
          stopped = true
          window.clearInterval(intervalId)
          bgmGain.disconnect()
        },
      }
    },
    [getCtx],
  )

  const stopBgm = useCallback(() => {
    bgmNodesRef.current?.stop()
    bgmNodesRef.current = null
  }, [])

  /** ライフ残り1「ドクン、ドクン」心臓の鼓動 */
  const startHeartbeat = useCallback(() => {
    const ctx = getCtx()
    const master = masterGainRef.current!
    heartbeatNodesRef.current?.stop()
    let stopped = false

    const beat = () => {
      if (stopped) return
      const now = ctx.currentTime
      for (const offset of [0, 0.18]) {
        const osc = ctx.createOscillator()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(55, now + offset)
        osc.frequency.exponentialRampToValueAtTime(35, now + offset + 0.15)
        const g = ctx.createGain()
        g.gain.setValueAtTime(0.001, now + offset)
        g.gain.exponentialRampToValueAtTime(0.6, now + offset + 0.03)
        g.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.18)
        osc.connect(g).connect(master)
        osc.start(now + offset)
        osc.stop(now + offset + 0.2)
      }
    }

    beat()
    const intervalId = window.setInterval(beat, 900)
    heartbeatNodesRef.current = {
      stop: () => {
        stopped = true
        window.clearInterval(intervalId)
      },
    }
  }, [getCtx])

  const stopHeartbeat = useCallback(() => {
    heartbeatNodesRef.current?.stop()
    heartbeatNodesRef.current = null
  }, [])

  return {
    unlock,
    playCorrect,
    playIncorrect,
    playRevival,
    playFeverStart,
    playCrack,
    startBgm,
    stopBgm,
    startHeartbeat,
    stopHeartbeat,
  }
}
