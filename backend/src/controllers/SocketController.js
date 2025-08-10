class SocketController {
  constructor(timerService) {
    this.timerService = timerService;
  }

  handleConnection(socket, io) {
    console.log('User connected:', socket.id);

    // Join a room
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);
      
      // Send current room state
      const room = this.timerService.getRoom(roomId);
      if (room) {
        socket.emit('timerUpdate', {
          roomId,
          timeLeft: room.timeLeft,
          isRunning: room.isRunning
        });
      }
    });

    // Start timer
    socket.on('startTimer', (roomId) => {
      const success = this.timerService.startTimer(roomId);
      if (success) {
        const room = this.timerService.getRoom(roomId);
        io.to(roomId).emit('timerUpdate', {
          roomId,
          timeLeft: room.timeLeft,
          isRunning: room.isRunning
        });
        console.log(`Timer started for room: ${roomId}`);
      }
    });

    // Stop timer
    socket.on('stopTimer', (roomId) => {
      const success = this.timerService.stopTimer(roomId);
      if (success) {
        const room = this.timerService.getRoom(roomId);
        io.to(roomId).emit('timerUpdate', {
          roomId,
          timeLeft: room.timeLeft,
          isRunning: room.isRunning
        });
        console.log(`Timer stopped for room: ${roomId}`);
      }
    });

    // Restart timer
    socket.on('restartTimer', (roomId) => {
      const success = this.timerService.restartTimer(roomId);
      if (success) {
        const room = this.timerService.getRoom(roomId);
        io.to(roomId).emit('timerUpdate', {
          roomId,
          timeLeft: room.timeLeft,
          isRunning: room.isRunning
        });
        console.log(`Timer restarted for room: ${roomId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  }
}

module.exports = SocketController;
