const Room = require('../models/Room');
const { TIMER_CONFIG } = require('../config/config');

class TimerService {
  constructor() {
    this.rooms = new Map();
    this.intervalId = null;
    this.initializeRooms();
  }

  initializeRooms() {
    // Initialize default rooms
    const defaultRooms = [
      { id: 'room1', name: 'Room 1' },
      { id: 'room2', name: 'Room 2' },
      { id: 'room3', name: 'Room 3' }
    ];

    defaultRooms.forEach(roomData => {
      const room = new Room(roomData.id, roomData.name);
      this.rooms.set(roomData.id, room);
    });
  }

  startTimerUpdates(io) {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {
      this.rooms.forEach((room) => {
        const updateResult = room.updateTime();
        
        if (updateResult === 'updated') {
          io.to(room.id).emit('timerUpdate', {
            roomId: room.id,
            timeLeft: room.timeLeft,
            isRunning: room.isRunning
          });
        } else if (updateResult === 'finished') {
          io.to(room.id).emit('timerFinished', { roomId: room.id });
          io.to(room.id).emit('timerUpdate', {
            roomId: room.id,
            timeLeft: room.timeLeft,
            isRunning: room.isRunning
          });
        }
      });
    }, TIMER_CONFIG.UPDATE_INTERVAL);
  }

  stopTimerUpdates() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  getAllRooms() {
    const roomStates = {};
    this.rooms.forEach((room, id) => {
      roomStates[id] = room.getState();
    });
    return roomStates;
  }

  startTimer(roomId) {
    const room = this.getRoom(roomId);
    if (room) {
      return room.start();
    }
    return false;
  }

  stopTimer(roomId) {
    const room = this.getRoom(roomId);
    if (room) {
      return room.stop();
    }
    return false;
  }

  restartTimer(roomId) {
    const room = this.getRoom(roomId);
    if (room) {
      return room.restart();
    }
    return false;
  }
}

module.exports = TimerService;
