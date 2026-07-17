import { useEffect, useRef } from 'react'
import { useAnimation } from 'framer-motion'

/**
 * 画面全体の「カメラ」演出(ヒットストップ風パンチ、誤答シェイク)を
 * correctImpactKey / wrongShakeKey の変化に合わせて発火するフック。
 */
export function useCameraFX(correctImpactKey: number, wrongShakeKey: number) {
  const controls = useAnimation()
  const prevCorrect = useRef(correctImpactKey)
  const prevWrong = useRef(wrongShakeKey)

  useEffect(() => {
    if (correctImpactKey !== prevCorrect.current) {
      prevCorrect.current = correctImpactKey
      controls.start({
        scale: [1, 0.985, 1.02, 1],
        transition: { duration: 0.22, times: [0, 0.25, 0.55, 1], ease: 'easeOut' },
      })
    }
  }, [correctImpactKey, controls])

  useEffect(() => {
    if (wrongShakeKey !== prevWrong.current) {
      prevWrong.current = wrongShakeKey
      controls.start({
        x: [0, -10, 9, -7, 6, -3, 0],
        rotate: [0, -0.6, 0.6, -0.4, 0.3, 0, 0],
        transition: { duration: 0.4, ease: 'easeInOut' },
      })
    }
  }, [wrongShakeKey, controls])

  return controls
}
