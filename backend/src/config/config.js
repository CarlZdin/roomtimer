module.exports = {
  PORT: process.env.PORT || 3001,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  TIMER_CONFIG: {
    INITIAL_TIME: 300, // 5 minutes in seconds
    UPDATE_INTERVAL: 1000, // 1 second
  },
  NODE_ENV: process.env.NODE_ENV || 'development'
};
