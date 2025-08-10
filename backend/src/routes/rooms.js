const express = require('express');
const router = express.Router();

function createRoomsRouter(timerService) {
  // GET /api/rooms - Get all room states
  router.get('/', (req, res) => {
    try {
      const rooms = timerService.getAllRooms();
      res.json(rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  return router;
}

module.exports = createRoomsRouter;
