"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    slug: {
        type: String,
        unique: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageArray: [
        {
            type: String,
        },
    ],
    video: {
        type: String,
    },
    likes: [
        {
            user: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "User",
            },
            reactionType: {
                type: String,
                default: "like",
            },
        },
    ],
    comments: [
        {
            text: {
                type: String,
                required: true,
            },
            user: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    repost: [
        {
            user: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            repost_description: {
                type: String,
            },
        },
    ],
    document: {
        type: String,
    },
    poll: {
        poll_description: {
            type: String,
        },
        options: {
            type: [
                {
                    _id: { type: mongoose_1.default.Schema.Types.ObjectId, auto: true },
                    optionText: String,
                    votes: { type: Number, default: 0 },
                },
            ],
            default: [],
        },
        voters: {
            type: [
                {
                    userId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
                    optionId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
                },
            ],
            default: [],
        },
    },
    schedule_time: {
        type: Date,
        default: null,
    },
    published_at: {
        type: Date,
        default: null,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Post", postSchema);
