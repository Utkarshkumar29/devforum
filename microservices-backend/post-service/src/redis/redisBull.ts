import { RedisOptions } from "ioredis" 

export const redisBullConfig: RedisOptions = {
  host: process.env.REDIS_URL || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
}
