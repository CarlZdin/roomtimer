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
