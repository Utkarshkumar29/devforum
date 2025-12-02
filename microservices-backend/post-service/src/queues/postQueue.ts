import { Queue } from "bullmq";
import { redisBullConfig } from "../redis/redisBull";

export const postQueue = new Queue("scheduled-posts", {
  connection: redisBullConfig,
})