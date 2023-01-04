export const WorkStatus = {
  HOME: 'HOME',
  WORKING: 'WORKING',
} as const

export type WorkStatus = typeof WorkStatus[keyof typeof WorkStatus]
