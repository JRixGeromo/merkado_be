'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.getOrSetCache = getOrSetCache;
exports.invalidateCache = invalidateCache;
// src/services/cacheService.ts
const redisClient_1 = __importDefault(require('../redis/redisClient'));
// Helper function to get or set cache
function getOrSetCache(key, fetchFunction, ttl) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const cachedData = yield redisClient_1.default.get(key); // No need to promisify
      if (cachedData) {
        return JSON.parse(cachedData); // Return parsed cached data
      }
      // If no cached data, fetch fresh data
      const result = yield fetchFunction();
      // Store in Redis with TTL (set expiration)
      yield redisClient_1.default.set(key, JSON.stringify(result), {
        EX: ttl, // TTL value in seconds
      });
      return result; // Return fresh data
    } catch (err) {
      throw new Error(`Error in cache or fetch: ${err}`);
    }
  });
}
// Function to invalidate a cache key
function invalidateCache(key) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const result = yield redisClient_1.default.del(key);
      if (result === 1) {
        console.log(`Cache invalidated for key: ${key}`);
      } else {
        console.log(`Key ${key} not found in cache`);
      }
    } catch (err) {
      console.error(`Failed to invalidate cache for key: ${key}`, err);
    }
  });
}
