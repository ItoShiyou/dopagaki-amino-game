export type ComboTier = 'base' | 'blue' | 'purple' | 'red' | 'gold' | 'rainbow'

export interface TierMeta {
  tier: ComboTier
  label: string
  color: string
  glow: string
  textClass: string
  icon: string
}

const TIERS: Record<ComboTier, TierMeta> = {
  base: {
    tier: 'base',
    label: '',
    color: '#5a6b8c',
    glow: 'rgba(90,107,140,0.55)',
    textClass: 'text-slate-200',
    icon: '',
  },
  blue: {
    tier: 'blue',
    label: '',
    color: '#22d3ee',
    glow: 'rgba(34,211,238,0.85)',
    textClass: 'text-cyan-300',
    icon: '',
  },
  purple: {
    tier: 'purple',
    label: '',
    color: '#c266ff',
    glow: 'rgba(194,102,255,0.9)',
    textClass: 'text-fuchsia-300',
    icon: '⚡',
  },
  red: {
    tier: 'red',
    label: '',
    color: '#ff3b4e',
    glow: 'rgba(255,59,78,0.95)',
    textClass: 'text-red-400',
    icon: '🔥',
  },
  gold: {
    tier: 'gold',
    label: '',
    color: '#ffd700',
    glow: 'rgba(255,215,0,1)',
    textClass: 'text-yellow-300',
    icon: '👑',
  },
  rainbow: {
    tier: 'rainbow',
    label: '',
    color: '#ff2fd0',
    glow: 'rgba(255,255,255,1)',
    textClass: 'rainbow-text',
    icon: '🌈',
  },
}

export function getComboTier(combo: number): ComboTier {
  if (combo >= 50) return 'rainbow'
  if (combo >= 30) return 'gold'
  if (combo >= 20) return 'red'
  if (combo >= 10) return 'purple'
  if (combo >= 1) return 'blue'
  return 'base'
}

export function getTierMeta(combo: number): TierMeta {
  return TIERS[getComboTier(combo)]
}
