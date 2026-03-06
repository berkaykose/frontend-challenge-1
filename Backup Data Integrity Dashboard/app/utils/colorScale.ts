// 8-level green palette: index 0 = least data, 7 = most data
export const COLOR_PALETTE = [
  '#dcfce7', // green-100
  '#bbf7d0', // green-200
  '#86efac', // green-300
  '#4ade80', // green-400
  '#22c55e', // green-500
  '#16a34a', // green-600
  '#15803d', // green-700
  '#166534', // green-800
] as const

export function getCellColor(dataCount: number, min: number, max: number): string {
  if (dataCount === 0) return 'transparent'
  if (max === min) return COLOR_PALETTE[3]
  const t = (dataCount - min) / (max - min)
  const idx = Math.min(7, Math.max(0, Math.floor(t * 8)))
  return COLOR_PALETTE[idx]!
}
