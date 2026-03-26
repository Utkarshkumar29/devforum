"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    firebase_uid: {
        type: String
    },
    email_verified: {
        type: Boolean,
        default: false
    },
    display_name: {
        type: String,
        required: true
    },
    photo_url: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    last_login_at: {
        type: Date,
        default: Date.now,
    },
    password: {
        type: String,
        default: null
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    }
}, { timestamps: true });
exports.User = mongoose_1.default.model("User", userSchema);
