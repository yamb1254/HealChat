import { Server } from "socket.io";

export const setupChatSocket = (io: Server) => {
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
