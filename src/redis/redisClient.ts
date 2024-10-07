import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://localhost:6379',  // Your Redis URL
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

redisClient.connect();

export default redisClient;
