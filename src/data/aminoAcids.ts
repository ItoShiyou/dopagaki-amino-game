export type Category = 'nonpolar' | 'polar' | 'acidic' | 'basic'

export interface AminoAcid {
  /** 一文字記号 (正解キー) */
  code1: string
  /** 三文字記号 */
  code3: string
  /** 日本語名 */
  nameJa: string
  /** 英語名 */
  nameEn: string
  /** 頭文字と1文字記号がズレている「ドパガキ殺し」枠か */
  isTricky: boolean
  /** 色分け用の性質カテゴリ */
  category: Category
}

export const CATEGORY_META: Record<Category, { label: string; color: string; glow: string }> = {
  nonpolar: { label: '疎水性', color: '#4da6ff', glow: 'rgba(77,166,255,0.65)' },
  polar: { label: '極性', color: '#3ee06f', glow: 'rgba(62,224,111,0.65)' },
  acidic: { label: '酸性', color: '#ff5577', glow: 'rgba(255,85,119,0.65)' },
  basic: { label: '塩基性', color: '#c266ff', glow: 'rgba(194,102,255,0.65)' },
}

export const AMINO_ACIDS: AminoAcid[] = [
  { code1: 'A', code3: 'Ala', nameJa: 'アラニン', nameEn: 'Alanine', isTricky: false, category: 'nonpolar' },
  { code1: 'R', code3: 'Arg', nameJa: 'アルギニン', nameEn: 'Arginine', isTricky: true, category: 'basic' },
  { code1: 'N', code3: 'Asn', nameJa: 'アスパラギン', nameEn: 'Asparagine', isTricky: true, category: 'polar' },
  { code1: 'D', code3: 'Asp', nameJa: 'アスパラギン酸', nameEn: 'Aspartic acid', isTricky: true, category: 'acidic' },
  { code1: 'C', code3: 'Cys', nameJa: 'システイン', nameEn: 'Cysteine', isTricky: false, category: 'polar' },
  { code1: 'Q', code3: 'Gln', nameJa: 'グルタミン', nameEn: 'Glutamine', isTricky: true, category: 'polar' },
  { code1: 'E', code3: 'Glu', nameJa: 'グルタミン酸', nameEn: 'Glutamic acid', isTricky: true, category: 'acidic' },
  { code1: 'G', code3: 'Gly', nameJa: 'グリシン', nameEn: 'Glycine', isTricky: false, category: 'nonpolar' },
  { code1: 'H', code3: 'His', nameJa: 'ヒスチジン', nameEn: 'Histidine', isTricky: false, category: 'basic' },
  { code1: 'I', code3: 'Ile', nameJa: 'イソロイシン', nameEn: 'Isoleucine', isTricky: false, category: 'nonpolar' },
  { code1: 'L', code3: 'Leu', nameJa: 'ロイシン', nameEn: 'Leucine', isTricky: true, category: 'nonpolar' },
  { code1: 'K', code3: 'Lys', nameJa: 'リジン', nameEn: 'Lysine', isTricky: true, category: 'basic' },
  { code1: 'M', code3: 'Met', nameJa: 'メチオニン', nameEn: 'Methionine', isTricky: false, category: 'nonpolar' },
  { code1: 'F', code3: 'Phe', nameJa: 'フェニルアラニン', nameEn: 'Phenylalanine', isTricky: false, category: 'nonpolar' },
  { code1: 'P', code3: 'Pro', nameJa: 'プロリン', nameEn: 'Proline', isTricky: false, category: 'nonpolar' },
  { code1: 'S', code3: 'Ser', nameJa: 'セリン', nameEn: 'Serine', isTricky: false, category: 'polar' },
  { code1: 'T', code3: 'Thr', nameJa: 'トレオニン', nameEn: 'Threonine', isTricky: true, category: 'polar' },
  { code1: 'W', code3: 'Trp', nameJa: 'トリプトファン', nameEn: 'Tryptophan', isTricky: true, category: 'nonpolar' },
  { code1: 'Y', code3: 'Tyr', nameJa: 'チロシン', nameEn: 'Tyrosine', isTricky: true, category: 'polar' },
  { code1: 'V', code3: 'Val', nameJa: 'バリン', nameEn: 'Valine', isTricky: false, category: 'nonpolar' },
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
