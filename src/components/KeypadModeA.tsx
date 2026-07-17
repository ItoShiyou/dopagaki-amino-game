import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AMINO_ACIDS, CATEGORY_META, type AminoAcid } from '../data/aminoAcids'

interface Props {
  onTap: (code1: string) => void
  activeCodes: Set<string>
  glowAssist: boolean
  disabled: boolean
}

const SPARKS = Array.from({ length: 6 }, (_, i) => {
  const angle = (Math.PI * 2 * i) / 6
  return { dx: Math.cos(angle) * 28, dy: Math.sin(angle) * 28 }
})

function KeyButton({
  amino,
  isHint,
  disabled,
  onTap,
}: {
  amino: AminoAcid
  isHint: boolean
  disabled: boolean
  onTap: (code1: string) => void
}) {
  const [tapKey, setTapKey] = useState(0)
  const meta = CATEGORY_META[amino.category]

  return (
    <motion.button
      disabled={disabled}
      onClick={() => {
        setTapKey((k) => k + 1)
        onTap(amino.code1)
      }}
      whileTap={{ scale: 0.82 }}
      transition={{ type: 'spring', stiffness: 700, damping: 18 }}
      className="neon-pulse relative flex aspect-square flex-col items-center justify-center overflow-visible rounded-lg border-2 bg-black/60 disabled:opacity-40"
      style={
        {
          '--neon-color': isHint ? '#ffd700' : meta.glow,
          borderColor: isHint ? '#ffd700' : meta.color,
        } as React.CSSProperties
      }
    >
      <span className={`text-base font-black leading-none ${isHint ? 'text-yellow-200' : 'text-white'}`}>
        {amino.code1}
      </span>
      <span className="mt-0.5 text-[7px] font-semibold leading-none" style={{ color: meta.color }}>
        {meta.label}
      </span>

      <AnimatePresence>
        {tapKey > 0 && (
          <motion.span
            key={tapKey}
            className="pointer-events-none absolute inset-0 rounded-lg"
            initial={{ boxShadow: `0 0 0px 0px ${meta.color}` }}
            animate={{ boxShadow: `0 0 24px 6px ${meta.color}` }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>
      {tapKey > 0 && (
        <span key={`spark-${tapKey}`} className="pointer-events-none absolute inset-0">
          {SPARKS.map((s, i) => (
            <motion.span
              key={i}
              className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full"
              style={{ backgroundColor: meta.color, boxShadow: `0 0 6px 1px ${meta.color}` }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: s.dx, y: s.dy, opacity: 0, scale: 0.3 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          ))}
        </span>
      )}
    </motion.button>
  )
}

export function KeypadModeA({ onTap, activeCodes, glowAssist, disabled }: Props) {
  return (
    <div className="grid grid-cols-5 gap-1 p-1.5">
      {AMINO_ACIDS.map((amino) => (
        <KeyButton
          key={amino.code1}
          amino={amino}
          isHint={glowAssist && activeCodes.has(amino.code1)}
          disabled={disabled}
          onTap={onTap}
        />
      ))}
    </div>
  )
}
