const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const config = require('./config/config');
const TimerService = require('./services/TimerService');
const SocketController = require('./controllers/SocketController');
const createRoomsRouter = require('./routes/rooms');

class Server {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketIo(this.server, {
      cors: {
        origin: config.CORS_ORIGIN,
        methods: ["GET", "POST"]
      }
    });

    this.timerService = new TimerService();
    this.socketController = new SocketController(this.timerService);

    this.setupMiddleware();
    this.setupRoutes();
    this.setupSocket();
    this.startTimerUpdates();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // API routes
    this.app.use('/api/rooms', createRoomsRouter(this.timerService));

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });
  }

  setupSocket() {
    this.io.on('connection', (socket) => {
      this.socketController.handleConnection(socket, this.io);
    });
  }

  startTimerUpdates() {
    this.timerService.startTimerUpdates(this.io);
  }

  start() {
    this.server.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
      console.log(`Environment: ${config.NODE_ENV}`);
      console.log(`CORS Origin: ${config.CORS_ORIGIN}`);
    });
  }

  stop() {
    this.timerService.stopTimerUpdates();
    this.server.close();
  }
}

module.exports = Server;
