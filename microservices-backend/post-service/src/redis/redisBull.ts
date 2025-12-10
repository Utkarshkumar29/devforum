import { RedisOptions } from "ioredis" 

export const redisBullConfig: RedisOptions = {
    url: process.env.REDIS_URL,
} as RedisOptions