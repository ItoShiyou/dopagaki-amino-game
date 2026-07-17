import { AnimatePresence, motion } from 'framer-motion'
import { getTierMeta } from '../lib/comboTier'

interface Props {
  combo: number
  comboPopupKey: number
}

export function ComboMegaDisplay({ combo, comboPopupKey }: Props) {
  if (combo <= 0 || comboPopupKey === 0) return null
  const meta = getTierMeta(combo)

  return (
    <div className="pointer-events-none absolute left-1/2 top-[40%] z-30 -translate-x-1/2 -translate-y-1/2 text-center">
      <AnimatePresence>
        <motion.div
          key={comboPopupKey}
          initial={{ scale: 0.3, opacity: 0, rotate: -8 }}
          animate={{ scale: [0.3, 1.35, 0.95, 1.05], opacity: [0, 1, 1, 1], rotate: [-8, 4, -2, 0] }}
          exit={{ scale: 0.6, opacity: 0, transition: { duration: 0.35 } }}
          transition={{ duration: 0.5, times: [0, 0.45, 0.75, 1], ease: 'easeOut' }}
        >
          <div
            className={`text-outline text-7xl font-black leading-none ${meta.textClass}`}
            style={{ filter: `drop-shadow(0 0 22px ${meta.glow})` }}
          >
            {meta.icon}
            {combo}
          </div>
          <div
            className={`text-outline mt-1 text-2xl font-black leading-none ${meta.textClass}`}
            style={{ filter: `drop-shadow(0 0 14px ${meta.glow})` }}
          >
            COMBO!!
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
