/**
 * Game color definitions — the 8 possible peg colors.
 * Each color has a display name and hex value for rendering.
 */
export const COLORS = [
  { name: 'Red', hex: '#ff3333' },
  { name: 'Blue', hex: '#3399ff' },
  { name: 'Yellow', hex: '#ffee00' },
  { name: 'Green', hex: '#33ff66' },
  { name: 'Orange', hex: '#ff8800' },
  { name: 'Purple', hex: '#cc33ff' },
  { name: 'Cyan', hex: '#00ffee' },
  { name: 'Pink', hex: '#ff66aa' },
]

/**
 * Default game settings shown on the Setup Screen.
 */
export const DEFAULT_SETTINGS = {
  slots: 4,
  colors: 6,
  duplicates: false,
  feedbackMode: 'standard',
  timeAttack: 0,
}

/**
 * Constraints for settings and attempt calculations.
 */
export const LIMITS = {
  slots: { min: 3, max: 6 },
  colors: { min: 4, max: 8 },
  attempts: { min: 6, max: 15 },
}

/**
 * Time attack options in seconds. 0 means off.
 */
export const TIME_ATTACK_OPTIONS = [0, 15, 30, 60]
