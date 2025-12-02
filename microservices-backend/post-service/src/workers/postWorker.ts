import { Worker } from "bullmq";
import Post from "../models/postSchema"
import { redisBullConfig } from "../redis/redisClient"

new Worker(
    "scheduled-posts",
    async(job)=>{
        const { postId }=job.data,

        const post=await Post.findById(postId)
        if(post) return

        if(!post.published_at){
            post.published_at = new Date()
            await post.save()
        }
    },
    {
    connection: redisBullConfig,
  }
)