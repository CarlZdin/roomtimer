class Room {
  constructor(id, name, timeLeft = 300) {
    this.id = id;
    this.name = name;
    this.timeLeft = timeLeft;
    this.isRunning = false;
    this.lastStartTime = null;
  }

  start() {
    if (this.timeLeft > 0 && !this.isRunning) {
      this.isRunning = true;
      this.lastStartTime = Date.now();
      return true;
    }
    return false;
  }

  stop() {
    if (this.isRunning) {
      const elapsed = Math.floor((Date.now() - this.lastStartTime) / 1000);
      this.timeLeft = Math.max(0, this.timeLeft - elapsed);
      this.isRunning = false;
      this.lastStartTime = null;
      return true;
    }
    return false;
  }

  restart() {
    this.timeLeft = 300; // Reset to 5 minutes
    this.isRunning = false;
    this.lastStartTime = null;
    return true;
  }

  updateTime() {
    if (this.isRunning && this.lastStartTime) {
      const elapsed = Math.floor((Date.now() - this.lastStartTime) / 1000);
      const newTimeLeft = Math.max(0, this.timeLeft - elapsed);
      
      if (newTimeLeft !== this.timeLeft) {
        this.timeLeft = newTimeLeft;
        this.lastStartTime = Date.now();
        
        if (this.timeLeft === 0) {
          this.isRunning = false;
          return 'finished';
        }
        return 'updated';
      }
    }
    return 'no-change';
  }

  getState() {
    return {
      id: this.id,
      name: this.name,
      timeLeft: this.timeLeft,
      isRunning: this.isRunning,
      lastStartTime: this.lastStartTime
    };
  }
}

module.exports = Room;
