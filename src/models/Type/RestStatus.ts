export const RestStatus = {
  BREAKTIME: 'breakTime',
  WORKING: 'working',
  HOME: 'home',
} as const

export type RestStatus = typeof RestStatus[keyof typeof RestStatus]
