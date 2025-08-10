<template>
  <div class="max-w-7xl mx-auto p-4">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
      <p class="text-gray-600 text-lg font-medium">Loading rooms...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-16">
      <div class="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
        <div class="flex items-center mb-4">
          <svg class="w-6 h-6 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <h3 class="text-lg font-semibold text-red-800">Connection Error</h3>
        </div>
        <p class="text-red-700 mb-4">{{ error }}</p>
        <UiButton 
          variant="danger" 
          @click="$emit('retry')"
          class="w-full"
        >
          <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1z"/>
          </svg>
          Retry Connection
        </UiButton>
      </div>
    </div>
    
    <!-- Rooms Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      <RoomCard
        v-for="room in rooms"
        :key="room.id"
        :room="room"
        @start="$emit('start-timer', $event)"
        @stop="$emit('stop-timer', $event)"
        @restart="$emit('restart-timer', $event)"
        class="animate-fade-in"
        :style="{ animationDelay: `${rooms.indexOf(room) * 0.1}s` }"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  rooms: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})

defineEmits(['start-timer', 'stop-timer', 'restart-timer', 'retry'])
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
  opacity: 0;
}
</style>
