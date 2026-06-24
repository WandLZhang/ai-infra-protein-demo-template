import { theme } from './theme.config'

export { config } from './institution.config'
export { theme } from './theme.config'

export function accentAlpha(alpha: number): string {
  const hex = theme.accent.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}
