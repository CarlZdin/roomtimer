
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}


export const playAlarm = (): void => {
  if (process.client && window.Audio) {
    try {
      const audio = new Audio('/alarm.mp3')
      audio.volume = 0.5
      audio.play().catch(error => {
        console.error('Failed to play alarm:', error)
      })
    } catch (error) {
      console.error('Failed to create audio element:', error)
    }
  }
}

export const TIMER_CONFIG = {
  INITIAL_TIME: 300, // 5 minutes in seconds
  UPDATE_INTERVAL: 1000, // 1 second
  BACKEND_URL: 'http://localhost:3001'
} as const
