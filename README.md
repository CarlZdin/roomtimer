# Timer Rooms Application - Component-Based Architecture

An interactive web application with 3 rooms that have countdown timers (5 minutes each) with start, stop, and restart functionality. Built with industry-standard component-based architecture.

## ✅ **Completed Features**

- **3 Timer Rooms**: Each room has an independent 5-minute countdown timer  
- **Start/Stop/Restart Controls**: Interactive buttons to control each timer  
- **Real-time Updates**: Live timer updates using Socket.IO  
- **Persistence**: Timers continue counting even after page refresh  
- **Alarm Sound**: Audio notification when timer reaches 00:00  
- **Component-Based Architecture**: Industry-standard modular design

## 🏗️ **Architecture Overview**

### Frontend Structure (Component-Based)
```
frontend/
├── components/
│   ├── ui/
│   │   └── Button.vue           # Reusable button component
│   ├── TimerDisplay.vue         # Timer display with status
│   ├── TimerControls.vue        # Start/Stop/Restart buttons
│   ├── RoomCard.vue             # Individual room container
│   └── RoomsGrid.vue            # Grid layout for rooms
├── composables/
│   └── useSocket.ts             # Socket.IO composable
├── types/
│   └── timer.ts                 # TypeScript interfaces
├── utils/
│   └── timer.ts                 # Helper functions
├── stores/
│   └── timer.ts                 # Pinia store (ready for use)
└── app.vue                      # Main application component
```

### Backend Structure (Service-Based)
```
backend/
├── src/
│   ├── config/
│   │   └── config.js            # Application configuration
│   ├── models/
│   │   └── Room.js              # Room data model
│   ├── services/
│   │   └── TimerService.js      # Business logic
│   ├── controllers/
│   │   └── SocketController.js  # Socket event handlers
│   ├── routes/
│   │   └── rooms.js             # REST API routes
│   └── server.js                # Server setup and configuration
└── app.js                       # Application entry point
```

## 🚀 **Tech Stack**

### Frontend
- **Nuxt 3** - Vue.js framework with SSR disabled for SPA mode
- **Vue 3** - Composition API with TypeScript support
- **Socket.IO Client** - Real-time communication
- **Component Architecture** - Modular, reusable components
- **Composables** - Vue 3 composition functions for logic reuse
- **TypeScript** - Type safety (optional interfaces created)

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.IO** - Real-time WebSocket communication
- **Service Layer** - Business logic separation
- **Controller Pattern** - Request handling
- **Model Classes** - Data representation

## 📂 **Component Design Patterns**

### 1. **UI Components** (`components/ui/`)
- **Button.vue**: Reusable button with variants (primary, secondary, danger, success)
- Prop-based customization
- Event emission for parent communication

### 2. **Feature Components**
- **TimerDisplay.vue**: Shows timer and status with visual feedback
- **TimerControls.vue**: Manages timer control buttons
- **RoomCard.vue**: Combines display and controls for a single room
- **RoomsGrid.vue**: Layout component with loading/error states

### 3. **Composables** (`composables/`)
- **useSocket.ts**: Encapsulates Socket.IO logic
- Reactive connection state
- Event listener management
- Clean API for socket operations

### 4. **Utilities** (`utils/`)
- **timer.ts**: Pure functions for time formatting, alarm sounds
- Configuration constants
- Reusable helper functions

## 🔧 **Backend Architecture Patterns**

### 1. **Service Layer**
- **TimerService.js**: Manages all timer business logic
- Room state management
- Timer update intervals
- Data persistence logic

### 2. **Controller Pattern**
- **SocketController.js**: Handles WebSocket events
- Clean separation of concerns
- Event-driven architecture

### 3. **Model Classes**
- **Room.js**: Encapsulates room data and behavior
- State management methods
- Business logic at model level

### 4. **Configuration Management**
- Centralized configuration
- Environment-based settings
- Easy deployment configuration

## 🛠️ **Installation & Setup**

### Prerequisites
- Node.js (v16 or higher)
- npm

### Quick Start
```bash
# Clone or navigate to project directory
cd "interview question"

# Install and start backend
cd backend
npm install
npm start
# Backend runs on http://localhost:3001

# In a new terminal, install and start frontend
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

## 🎯 **Component Usage Examples**

### Button Component
```vue
<UiButton 
  variant="success" 
  :disabled="isRunning" 
  @click="startTimer"
>
  Start
</UiButton>
```

### Room Card Component
```vue
<RoomCard
  :room="roomData"
  @start="handleStart"
  @stop="handleStop"
  @restart="handleRestart"
/>
```

## 🔄 **Data Flow**

```
1. Frontend Component → Emit Event
2. Parent Component → Socket.IO Call
3. Backend Service → Process Logic
4. Database/Memory → Update State
5. Socket.IO → Broadcast Update
```

## 📝 **API Documentation**

### REST Endpoints
- `GET /api/rooms` - Get all room states
- `GET /api/rooms/:roomId` - Get specific room state
- `GET /health` - Health check

### Socket Events
- `joinRoom(roomId)` - Join room for updates
- `startTimer(roomId)` - Start room timer
- `stopTimer(roomId)` - Stop room timer
- `restartTimer(roomId)` - Restart room timer
- `timerUpdate` - Receive timer updates
- `timerFinished` - Timer reached 00:00

This architecture follows industry best practices and provides a solid foundation for scaling and maintaining the application. The component-based approach makes it easy to add new features, test individual parts, and integrate modern UI frameworks.
