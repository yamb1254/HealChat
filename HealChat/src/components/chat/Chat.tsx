import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import "./Chat.css";

const socket: Socket = io("http://localhost:4000"); // Backend WebSocket endpoint

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { content: string; sender: string }[]
  >([]);

  useEffect(() => {
    socket.on(
      "receive_message",
      (message: { content: string; sender: string }) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    );

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const newMessage = { content: message, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      socket.emit("send_message", newMessage);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Live Chat</div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg.sender === "other" && (
              <img src="/path/to/other-avatar.png" alt="Avatar" />
            )}
            <div className={`message-content ${msg.sender}`}>{msg.content}</div>
            {msg.sender === "user" && (
              <img src="/path/to/user-avatar.png" alt="Avatar" />
            )}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <textarea
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
