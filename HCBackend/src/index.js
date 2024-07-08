"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const database_1 = __importDefault(require("./config/database"));
const envConfig_1 = require("./config/envConfig");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const chatSocket_1 = require("./sockets/chatSocket");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // Adjust the origin as needed
        methods: ["GET", "POST"],
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", authRoutes_1.default);
app.use("/api/chat", chatRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
database_1.default
    .authenticate()
    .then(() => {
    console.log("Database connected...");
    return database_1.default.sync();
})
    .then(() => {
    console.log("Database synchronized...");
    server.listen(envConfig_1.config.port, () => {
        console.log(`Server running on port ${envConfig_1.config.port}`);
    });
})
    .catch((err) => {
    console.error("Unable to connect to the database:", err);
});
(0, chatSocket_1.setupChatSocket)(io);
