class SocketController {
  constructor(timerService) {
    this.timerService = timerService;
  }

  handleConnection(socket, io) {
    console.log('User connected:', socket.id);

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);
      
      const room = this.timerService.getRoom(roomId);
      if (room) {
        socket.emit('timerUpdate', {
          roomId,
          timeLeft: room.timeLeft,
          isRunning: room.isRunning
        });
      }
    });

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
