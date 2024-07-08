"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupChatSocket = void 0;
const setupChatSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("A user connected");
        socket.on("send_message", (message) => {
            io.emit("receive_message", message);
        });
        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });
};
exports.setupChatSocket = setupChatSocket;
