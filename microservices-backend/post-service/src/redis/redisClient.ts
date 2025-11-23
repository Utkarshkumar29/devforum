import { createClient } from "redis"

export const redisClient= createClient({
    url:process.env.REDIS_URL || "redis://localhost:6379"
})

redisClient.on("error",(err)=>{
    console.log("Redix error:",err)
})

redisClient.on("connect",()=>{
    console.log("Redis Connected")
})

redisClient.connect()