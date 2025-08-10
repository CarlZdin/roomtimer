import { ref, onMounted, onUnmounted } from 'vue'
import { io, Socket } from 'socket.io-client'
import type { Room, TimerUpdate, TimerFinished } from '~/types/timer'
import { TIMER_CONFIG } from '~/utils/timer'

export const useSocket = () => {
  const socket = ref<Socket | null>(null)
  const isConnected = ref(false)

  const connect = () => {
    if (!socket.value) {
      socket.value = io(TIMER_CONFIG.BACKEND_URL)
      
      socket.value.on('connect', () => {
        isConnected.value = true
        console.log('Connected to server')
      })

      socket.value.on('disconnect', () => {
        isConnected.value = false
        console.log('Disconnected from server')
      })
    }
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      isConnected.value = false
    }
  }

  const joinRoom = (roomId: string) => {
    if (socket.value) {
      socket.value.emit('joinRoom', roomId)
    }
  }

  const startTimer = (roomId: string) => {
    if (socket.value) {
      socket.value.emit('startTimer', roomId)
    }
  }

  const stopTimer = (roomId: string) => {
    if (socket.value) {
      socket.value.emit('stopTimer', roomId)
    }
  }

  const restartTimer = (roomId: string) => {
    if (socket.value) {
      socket.value.emit('restartTimer', roomId)
    }
  }

  const onTimerUpdate = (callback: (data: TimerUpdate) => void) => {
    if (socket.value) {
      socket.value.on('timerUpdate', callback)
    }
  }

  const onTimerFinished = (callback: (data: TimerFinished) => void) => {
    if (socket.value) {
      socket.value.on('timerFinished', callback)
    }
  }

  const offTimerUpdate = () => {
    if (socket.value) {
      socket.value.off('timerUpdate')
    }
  }

  const offTimerFinished = () => {
    if (socket.value) {
      socket.value.off('timerFinished')
    }
  }

  onMounted(() => {
    connect()
  })

  onUnmounted(() => {
    offTimerUpdate()
    offTimerFinished()
    disconnect()
  })

  return {
    socket: readonly(socket),
    isConnected: readonly(isConnected),
    connect,
    disconnect,
    joinRoom,
    startTimer,
    stopTimer,
    restartTimer,
    onTimerUpdate,
    onTimerFinished,
    offTimerUpdate,
    offTimerFinished
  }
}
