"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const allowedOrigins = process.env.CLIENT_URL.split(",");
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        console.log("❌ CORS Blocked (Post Service):", origin);
        return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true
}));
app.use(express_1.default.json());
app.use("/api/posts", postRoutes_1.default);
app.get("/", (req, res) => {
    res.send("Post Service Running");
});
mongoose_1.default.connect(process.env.MONGODB_URI)
    .then(() => console.log("Post DB connected"))
    .catch((err) => console.error("Post DB connection error:", err));
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Post Service running on port ${PORT}`));
