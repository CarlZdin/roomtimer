<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
    <NuxtRouteAnnouncer />
    
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Title -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
              </svg>
            </div>
            <h1 class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Timer Rooms
            </h1>
          </div>
          
          <!-- Connection Status -->
          <div class="flex items-center space-x-2">
            <div class="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gray-50">
              <div :class="statusIndicatorClass"></div>
              <span :class="statusTextClass">{{ connectionStatus }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="relative">
      <!-- Background Decoration -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div class="absolute -top-40 left-20 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 py-8">
        <RoomsGrid
          :rooms="rooms"
          :is-loading="isLoading"
          :error="error"
          @start-timer="handleStartTimer"
          @stop-timer="handleStopTimer"
          @restart-timer="handleRestartTimer"
          @retry="handleRetry"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client'
import { formatTime, playAlarm, TIMER_CONFIG } from '~/utils/timer'

// Reactive state
const socket = ref(null)
const isConnected = ref(false)
const isLoading = ref(false)
const error = ref(null)

const rooms = ref([
  { id: 'room1', name: 'Room 1', timeLeft: TIMER_CONFIG.INITIAL_TIME, isRunning: false },
  { id: 'room2', name: 'Room 2', timeLeft: TIMER_CONFIG.INITIAL_TIME, isRunning: false },
  { id: 'room3', name: 'Room 3', timeLeft: TIMER_CONFIG.INITIAL_TIME, isRunning: false }
])

// Computed properties
const connectionStatus = computed(() => {
  return isConnected.value ? 'Connected' : 'Connecting...'
})

const statusIndicatorClass = computed(() => {
  const baseClass = 'w-2 h-2 rounded-full transition-all duration-300'
  return isConnected.value 
    ? `${baseClass} bg-green-500 shadow-sm shadow-green-500/50` 
    : `${baseClass} bg-red-500 animate-pulse shadow-sm shadow-red-500/50`
})

const statusTextClass = computed(() => {
  const baseClass = 'text-sm font-medium transition-colors duration-300'
  return isConnected.value 
    ? `${baseClass} text-green-700`
    : `${baseClass} text-red-700`
})

// Socket connection
const connectSocket = () => {
  socket.value = io(TIMER_CONFIG.BACKEND_URL)
  
  socket.value.on('connect', () => {
    isConnected.value = true
    console.log('Connected to server')
  })

  socket.value.on('disconnect', () => {
    isConnected.value = false
    console.log('Disconnected from server')
  })

  socket.value.on('timerUpdate', (data) => {
    const room = rooms.value.find(r => r.id === data.roomId)
    if (room) {
      room.timeLeft = data.timeLeft
      room.isRunning = data.isRunning
    }
  })

  socket.value.on('timerFinished', (data) => {
    const room = rooms.value.find(r => r.id === data.roomId)
    if (room) {
      room.isRunning = false
      room.timeLeft = 0
      playAlarm()
    }
  })
}

// Timer control functions
const handleStartTimer = (roomId) => {
  if (socket.value) {
    socket.value.emit('startTimer', roomId)
  }
}

const handleStopTimer = (roomId) => {
  if (socket.value) {
    socket.value.emit('stopTimer', roomId)
  }
}

const handleRestartTimer = (roomId) => {
  if (socket.value) {
    socket.value.emit('restartTimer', roomId)
  }
}

const handleRetry = () => {
  error.value = null
  fetchRoomStates()
}

// Fetch room states from API
const fetchRoomStates = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await fetch(`${TIMER_CONFIG.BACKEND_URL}/api/rooms`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const roomStates = await response.json()
    
    rooms.value.forEach(room => {
      if (roomStates[room.id]) {
        room.timeLeft = roomStates[room.id].timeLeft
        room.isRunning = roomStates[room.id].isRunning
      }
    })
  } catch (err) {
    error.value = `Failed to fetch room states: ${err.message}`
    console.error('Failed to fetch room states:', err)
  } finally {
    isLoading.value = false
  }
}

// Initialize app
onMounted(async () => {
  connectSocket()
  
  // Wait a bit for socket connection
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Join all rooms
  rooms.value.forEach(room => {
    if (socket.value) {
      socket.value.emit('joinRoom', room.id)
    }
  })
  
  // Fetch initial room states
  await fetchRoomStates()
})

onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect()
  }
})
</script>

<style>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
