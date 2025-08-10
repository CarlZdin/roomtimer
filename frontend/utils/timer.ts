/**
 * Formats time in seconds to MM:SS format
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * Plays an alarm sound using Web Audio API
 */
export const playAlarm = (): void => {
  if (process.client && window.AudioContext) {
    try {
      const audioContext = new AudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      gainNode.gain.value = 0.3
      
      oscillator.start()
      oscillator.stop(audioContext.currentTime + 1)
    } catch (error) {
      console.error('Failed to play alarm:', error)
    }
  }
}

/**
 * Constants for timer configuration
 */
export const TIMER_CONFIG = {
  INITIAL_TIME: 300, // 5 minutes in seconds
  UPDATE_INTERVAL: 1000, // 1 second
  BACKEND_URL: 'http://localhost:3001'
} as const
