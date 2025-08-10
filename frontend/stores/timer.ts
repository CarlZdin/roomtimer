import { defineStore } from 'pinia'
import type { Room, TimerUpdate, TimerFinished, RoomStates } from '~/types/timer'
import { TIMER_CONFIG, playAlarm } from '~/utils/timer'

interface TimerState {
  rooms: Room[]
  isLoading: boolean
  error: string | null
}

export const useTimerStore = defineStore('timer', {
  state: (): TimerState => ({
    rooms: [
      { id: 'room1', name: 'Room 1', timeLeft: TIMER_CONFIG.INITIAL_TIME, isRunning: false },
      { id: 'room2', name: 'Room 2', timeLeft: TIMER_CONFIG.INITIAL_TIME, isRunning: false },
      { id: 'room3', name: 'Room 3', timeLeft: TIMER_CONFIG.INITIAL_TIME, isRunning: false }
    ],
    isLoading: false,
    error: null
  }),

  getters: {
    getRoomById: (state) => (roomId: string): Room | undefined => {
      return state.rooms.find(room => room.id === roomId)
    },

    getRunningRooms: (state): Room[] => {
      return state.rooms.filter(room => room.isRunning)
    },

    getFinishedRooms: (state): Room[] => {
      return state.rooms.filter(room => room.timeLeft === 0)
    }
  },

  actions: {
    updateRoom(data: TimerUpdate) {
      const room = this.rooms.find(r => r.id === data.roomId)
      if (room) {
        room.timeLeft = data.timeLeft
        room.isRunning = data.isRunning
      }
    },

    handleTimerFinished(data: TimerFinished) {
      const room = this.rooms.find(r => r.id === data.roomId)
      if (room) {
        room.isRunning = false
        room.timeLeft = 0
        playAlarm()
      }
    },

    async fetchRoomStates() {
      this.isLoading = true
      this.error = null

      try {
        const response = await fetch(`${TIMER_CONFIG.BACKEND_URL}/api/rooms`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const roomStates: RoomStates = await response.json()
        
        this.rooms.forEach(room => {
          if (roomStates[room.id]) {
            room.timeLeft = roomStates[room.id].timeLeft
            room.isRunning = roomStates[room.id].isRunning
          }
        })
      } catch (error) {
        this.error = `Failed to fetch room states: ${error instanceof Error ? error.message : 'Unknown error'}`
        console.error('Failed to fetch room states:', error)
      } finally {
        this.isLoading = false
      }
    },

    resetRoom(roomId: string) {
      const room = this.rooms.find(r => r.id === roomId)
      if (room) {
        room.timeLeft = TIMER_CONFIG.INITIAL_TIME
        room.isRunning = false
      }
    },

    setError(error: string | null) {
      this.error = error
    },

    clearError() {
      this.error = null
    }
  }
})
