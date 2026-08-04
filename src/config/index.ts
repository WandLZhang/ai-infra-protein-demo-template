import { theme } from './theme.config'

export { config } from './institution.config'
export { theme } from './theme.config'
export { ConfigProvider, useConfig } from './ConfigContext'

function accentRgb(): [number, number, number] {
  const hex = theme.accent.replace('#', '')
  return [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16),
  ]
}

export function accentAlpha(alpha: number): string {
  const [r, g, b] = accentRgb()
  return `rgba(${r},${g},${b},${alpha})`
}

/** Tint the accent toward white. ratio 0 = accent, 1 = white. */
function accentTint(ratio: number): string {
  const [r, g, b] = accentRgb()
  const mix = (c: number) => Math.round(c + (255 - c) * ratio)
  return `rgb(${mix(r)},${mix(g)},${mix(b)})`
}

/**
 * Publish the accent as CSS custom properties so `hud.css` can theme off it.
 *
 * Why this exists: hud.css previously hardcoded Cornell Red (#B31B1B) in 22 places, so
 * `theme.accent` only controlled the handful of inline React styles. Stanford's Cardinal
 * (#8C1515) masked the bug — both are dark reds — but Delaware Blue made it obvious.
 * Call once at startup, before render.
 */
export function applyThemeVars(): void {
  const [r, g, b] = accentRgb()
  const s = document.documentElement.style
  s.setProperty('--accent', theme.accent)
  // Triplet form so CSS can build any alpha: rgba(var(--accent-rgb), 0.35)
  s.setProperty('--accent-rgb', `${r}, ${g}, ${b}`)
  s.setProperty('--accent-weak', accentAlpha(0.06))
  // Ring tints for the marker spinner (was a 3-stop red ramp).
  s.setProperty('--accent-2', accentTint(0.3))
  s.setProperty('--accent-3', accentTint(0.5))
  // Light tint for text ON DARK surfaces (terminal, marker label). A dark accent like
  // a dark accent is unreadable on #1a1a1a, so never use --accent for terminal text.
  s.setProperty('--accent-soft', accentTint(0.62))
  s.setProperty('--accent-term', accentTint(0.55))
}
