import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  scorePopupKey: number
  gain: number
  multiplier: number
}

export function ScorePopup({ scorePopupKey, gain, multiplier }: Props) {
  if (scorePopupKey === 0) return null

  return (
    <div className="pointer-events-none absolute left-1/2 top-[46%] z-30 -translate-x-1/2">
      <AnimatePresence>
        <motion.div
          key={scorePopupKey}
          initial={{ opacity: 0, y: 10, scale: 0.4, rotate: -6 }}
          animate={{ opacity: 1, y: -70, scale: 1.15, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center"
        >
          <span className="text-outline drop-shadow-[0_0_18px_rgba(255,215,0,0.9)] text-4xl font-black text-yellow-300">
            +{gain.toLocaleString()}
          </span>
          {multiplier > 1 && (
            <span className="text-outline ml-1 text-2xl font-black text-fuchsia-300">×{multiplier}</span>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
