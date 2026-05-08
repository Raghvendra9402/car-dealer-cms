import { Redis } from "@upstash/redis";

let _redis: Redis | null = null;

export function getRedis(): Redis {
  if (!_redis) {
    _redis = Redis.fromEnv(); // Only called at request time
  }
  return _redis;
}
