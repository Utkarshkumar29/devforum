"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Worker file logic (scheduled-posts.worker.ts or similar)
const bullmq_1 = require("bullmq");
const postSchema_1 = __importDefault(require("../models/postSchema"));
const redisBull_1 = require("../redis/redisBull");
new bullmq_1.Worker("scheduled-posts", async (job) => {
    const { postId } = job.data;
    // 1. Find the post
    const post = await postSchema_1.default.findById(postId);
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
    }
    else {
        // Optional: Log if the job runs for an already published post (shouldn't happen with proper queue setup)
        console.log(`Post ID: ${postId} was already published at ${post.published_at}`);
    }
}, {
    connection: redisBull_1.redisBullConfig,
});
