// src/redis/redisClient.ts

import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://localhost:6379', // Your Redis URL or replace with environment variable
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));

(async () => {
  try {
    await redisClient.connect(); // Ensure the connection is awaited
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
})();

export default redisClient;
