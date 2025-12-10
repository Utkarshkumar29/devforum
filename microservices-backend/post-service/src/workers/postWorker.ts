// Worker file logic (scheduled-posts.worker.ts or similar)
import { Worker } from "bullmq";
import Post from "../models/postSchema";
import { redisBullConfig } from "../redis/redisBull";

new Worker(
    "scheduled-posts",
    async (job) => {
        const { postId } = job.data;

        // 1. Find the post
        const post = await Post.findById(postId);
        
        // 2. If the post is NOT found, then we stop.
        // The original code was: if(post) return, which stopped if found.
        if (!post) {
            console.error(`Scheduled post with ID ${postId} not found.`);
            return; // Stop processing if post does not exist
        }

        // 3. If the post is found AND has not been published yet, set published_at and save.
        // Note: The logic `if(!post.published_at)` is correct for publishing the post.
        if (!post.published_at) {
            post.published_at = new Date();
            await post.save();
            console.log(`Successfully published scheduled post ID: ${postId}`);
        } else {
            // Optional: Log if the job runs for an already published post (shouldn't happen with proper queue setup)
            console.log(`Post ID: ${postId} was already published at ${post.published_at}`);
        }
    },
    {
        connection: redisBullConfig,
    }
);