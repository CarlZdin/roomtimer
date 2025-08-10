<template>
  <div class="flex flex-col items-center p-6">
    <div :class="timerClass">
      {{ displayTime }}
    </div>
    <div :class="statusClass">
      {{ statusText }}
    </div>
  </div>
</template>

<script setup>
import { formatTime } from '~/utils/timer'

const props = defineProps({
  timeLeft: {
    type: Number,
    required: true
  },
  isRunning: {
    type: Boolean,
    default: false
  }
})

const displayTime = computed(() => formatTime(props.timeLeft))

const statusText = computed(() => {
  if (props.timeLeft === 0) return 'Finished'
  return props.isRunning ? 'Running' : 'Stopped'
})

const timerClass = computed(() => {
  const baseClass = 'text-6xl md:text-7xl font-mono font-bold transition-all duration-300 mb-2'
  
  if (props.timeLeft === 0) {
    return `${baseClass} text-red-500 animate-pulse drop-shadow-lg`
  } else if (props.isRunning) {
    return `${baseClass} text-green-500 drop-shadow-lg`
  } else {
    return `${baseClass} text-gray-600 drop-shadow-lg`
  }
})

const statusClass = computed(() => {
  const baseClass = 'text-lg font-semibold uppercase tracking-wider'
  
  if (props.timeLeft === 0) {
    return `${baseClass} text-red-500`
  } else if (props.isRunning) {
    return `${baseClass} text-green-500`
  } else {
    return `${baseClass} text-gray-600`
  }
})
</script>
