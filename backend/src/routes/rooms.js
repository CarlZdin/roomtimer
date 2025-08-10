const express = require('express');
const router = express.Router();

class RoomsController {
  constructor(timerService) {
    this.timerService = timerService;
  }

  getAllRooms(req, res) {
    try {
      this.timerService.updateRoomStates();
      const rooms = this.timerService.getAllRooms();
      res.json(rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  getRoom(req, res) {
    try {
      const { roomId } = req.params;
      const room = this.timerService.getRoom(roomId);
      
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      res.json(room.getState());
    } catch (error) {
      console.error('Error fetching room:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

function createRoomsRouter(timerService) {
  const controller = new RoomsController(timerService);
  
  router.get('/', (req, res) => controller.getAllRooms(req, res));
  router.get('/:roomId', (req, res) => controller.getRoom(req, res));
  
  return router;
}

module.exports = createRoomsRouter;
