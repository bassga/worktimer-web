export const WorkStatus = {
  GO_HOME: 'GO_HOME',
  WORKING: 'WORKING',
  BREAK_TIME: 'BREAK_TIME',
  NO_WORK: 'NO_WORK',
} as const

export type WorkStatus = typeof WorkStatus[keyof typeof WorkStatus]
