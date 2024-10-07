// src/services/cacheService.ts
import redisClient from '../redis/redisClient';

// Helper function to get or set cache
export async function getOrSetCache<T>(
  key: string,
  fetchFunction: () => Promise<T>,
  ttl: number
): Promise<T> {
  try {
    const cachedData = await redisClient.get(key); // No need to promisify
    if (cachedData) {
      return JSON.parse(cachedData) as T; // Return parsed cached data
    }

    // If no cached data, fetch fresh data
    const result = await fetchFunction();

    // Store in Redis with TTL (set expiration)
    await redisClient.set(key, JSON.stringify(result), {
      EX: ttl, // TTL value in seconds
    });

    return result; // Return fresh data
  } catch (err) {
    throw new Error(`Error in cache or fetch: ${err}`);
  }
}

// Function to invalidate a cache key
export async function invalidateCache(key: string): Promise<void> {
  try {
    const result = await redisClient.del(key);
    if (result === 1) {
      console.log(`Cache invalidated for key: ${key}`);
    } else {
      console.log(`Key ${key} not found in cache`);
    }
  } catch (err) {
    console.error(`Failed to invalidate cache for key: ${key}`, err);
  }
}
