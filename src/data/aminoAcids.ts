export interface AminoAcid {
  /** 一文字記号 (正解キー) */
  code1: string
  /** 三文字記号 */
  code3: string
  /** 日本語名 */
  nameJa: string
  /** 頭文字と1文字記号がズレている「ドパガキ殺し」枠か */
  isTricky: boolean
}

export const AMINO_ACIDS: AminoAcid[] = [
  { code1: 'A', code3: 'Ala', nameJa: 'アラニン', isTricky: false },
  { code1: 'R', code3: 'Arg', nameJa: 'アルギニン', isTricky: true },
  { code1: 'N', code3: 'Asn', nameJa: 'アスパラギン', isTricky: true },
  { code1: 'D', code3: 'Asp', nameJa: 'アスパラギン酸', isTricky: true },
  { code1: 'C', code3: 'Cys', nameJa: 'システイン', isTricky: false },
  { code1: 'Q', code3: 'Gln', nameJa: 'グルタミン', isTricky: true },
  { code1: 'E', code3: 'Glu', nameJa: 'グルタミン酸', isTricky: true },
  { code1: 'G', code3: 'Gly', nameJa: 'グリシン', isTricky: false },
  { code1: 'H', code3: 'His', nameJa: 'ヒスチジン', isTricky: false },
  { code1: 'I', code3: 'Ile', nameJa: 'イソロイシン', isTricky: false },
  { code1: 'L', code3: 'Leu', nameJa: 'ロイシン', isTricky: true },
  { code1: 'K', code3: 'Lys', nameJa: 'リジン', isTricky: true },
  { code1: 'M', code3: 'Met', nameJa: 'メチオニン', isTricky: false },
  { code1: 'F', code3: 'Phe', nameJa: 'フェニルアラニン', isTricky: false },
  { code1: 'P', code3: 'Pro', nameJa: 'プロリン', isTricky: false },
  { code1: 'S', code3: 'Ser', nameJa: 'セリン', isTricky: false },
  { code1: 'T', code3: 'Thr', nameJa: 'トレオニン', isTricky: true },
  { code1: 'W', code3: 'Trp', nameJa: 'トリプトファン', isTricky: true },
  { code1: 'Y', code3: 'Tyr', nameJa: 'チロシン', isTricky: true },
  { code1: 'V', code3: 'Val', nameJa: 'バリン', isTricky: false },
]

export const ALL_CODE1: string[] = AMINO_ACIDS.map((a) => a.code1)

export type Stage = 1 | 2 | 3

/** ステージに応じた出題フォーマットを決定 */
export function pickDisplayFormat(stage: Stage): 'name' | 'code3' {
  if (stage === 1) return 'name'
  if (stage === 2) return 'code3'
  return Math.random() < 0.5 ? 'name' : 'code3'
}

export function randomAminoAcid(): AminoAcid {
  return AMINO_ACIDS[Math.floor(Math.random() * AMINO_ACIDS.length)]
}

/** ステージ3では「ズレ枠」を優先的に連続で出しやすくする */
export function randomAminoAcidForStage(stage: Stage): AminoAcid {
  if (stage === 3 && Math.random() < 0.55) {
    const tricky = AMINO_ACIDS.filter((a) => a.isTricky)
    return tricky[Math.floor(Math.random() * tricky.length)]
  }
  return randomAminoAcid()
}
