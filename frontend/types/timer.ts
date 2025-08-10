export interface Room {
  id: string
  name: string
  timeLeft: number
  isRunning: boolean
}

export interface TimerUpdate {
  roomId: string
  timeLeft: number
  isRunning: boolean
}

export interface TimerFinished {
  roomId: string
}

export type TimerStatus = 'running' | 'stopped' | 'finished'

export interface RoomState {
  timeLeft: number
  isRunning: boolean
  lastStartTime: number | null
}

export interface RoomStates {
  [roomId: string]: RoomState
}
