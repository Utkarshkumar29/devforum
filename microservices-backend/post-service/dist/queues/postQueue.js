"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postQueue = void 0;
const bullmq_1 = require("bullmq");
const redisBull_1 = require("../redis/redisBull");
exports.postQueue = new bullmq_1.Queue("scheduled-posts", {
    connection: redisBull_1.redisBullConfig,
});
