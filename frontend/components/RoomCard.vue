<template>
  <div class="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
    <div class="text-center mb-4">
      <h2 class="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
        {{ room.name }}
      </h2>
      <div class="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-2"></div>
    </div>
    
    <TimerDisplay 
      :time-left="room.timeLeft"
      :is-running="room.isRunning"
    />
    
    <TimerControls
      :is-running="room.isRunning"
      :time-left="room.timeLeft"
      @start="$emit('start', room.id)"
      @stop="$emit('stop', room.id)"
      @restart="$emit('restart', room.id)"
    />
    
    <!-- Status indicator -->
    <div class="flex justify-center mt-6">
      <div class="flex items-center space-x-2">
        <div :class="statusIndicatorClass"></div>
        <span :class="statusTextClass">{{ statusText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  room: {
    type: Object,
    required: true
  }
})

defineEmits(['start', 'stop', 'restart'])

const statusText = computed(() => {
  if (props.room.timeLeft === 0) return 'Timer Finished'
  return props.room.isRunning ? 'Timer Running' : 'Timer Stopped'
})

const statusIndicatorClass = computed(() => {
  const baseClass = 'w-2 h-2 rounded-full'
  
  if (props.room.timeLeft === 0) {
    return `${baseClass} bg-red-500 animate-pulse`
  } else if (props.room.isRunning) {
    return `${baseClass} bg-green-500 animate-pulse`
  } else {
    return `${baseClass} bg-gray-400`
  }
})

const statusTextClass = computed(() => {
  const baseClass = 'text-sm font-medium'
  
  if (props.room.timeLeft === 0) {
    return `${baseClass} text-red-600`
  } else if (props.room.isRunning) {
    return `${baseClass} text-green-600`
  } else {
    return `${baseClass} text-gray-600`
  }
})
</script>
