import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faPaperclip,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./Chat.css";
import ReactMarkdown from "react-markdown";
import logo from "../../assets/icon.png";
import apiClient from "../../api/client";

interface Message {
  content: string;
  sender: string;
  imageUrl?: string;
}

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [username, setUsername] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Ref for the textarea
  const navigate = useNavigate();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isSending) {
      textareaRef.current?.focus();
    }
  }, [isSending]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const sendMessage = async () => {
    if (isSending || (message.trim() === "" && !selectedImage)) {
      return;
    }

    setIsSending(true);

    const userMessage: Message = {
      content: message,
      sender: "user",
      imageUrl: "",
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const formData = new FormData();
    formData.append("content", message);
    formData.append("username", localStorage.getItem("username") || "");
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      setIsTyping(true);
      const response = await apiClient.post("/chat/send", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Network response was not ok");
      }

      const data = response.data;
      const aiMessage: Message = {
        content: data.modelResponse,
        sender: "other",
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsTyping(false);
      setIsSending(false);
      setMessage("");
      textareaRef.current?.focus();
    }

    setSelectedImage(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isSending) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const getInitials = (name: string) => {
    const names = name.split(" ");
    const initials = names.map((name) => name[0]).join("");
    return initials.slice(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
    return (
      <div className={`message ${message.sender}`}>
        {message.sender === "other" && (
          <div className="avatar">
            <img src={logo} alt="HealChat Logo" className="avatar-logo" />
          </div>
        )}
        <div className={`message-content ${message.sender}`}>
          {message.imageUrl ? (
            <img src={message.imageUrl} alt="Uploaded" />
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
        </div>
        {message.sender === "user" && (
          <div className="avatar">{getInitials(username)}</div>
        )}
      </div>
    );
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        Heal Chat
        <button className="logout-button" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isTyping && (
          <div className="message other">
            <div className="avatar">
              <img src={logo} alt="HealChat Logo" className="avatar-logo" />
            </div>
            <div className="message-content other typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <label htmlFor="imageUpload" className="image-upload-label">
          <FontAwesomeIcon icon={faPaperclip} />
        </label>
        <input type="file" id="imageUpload" onChange={handleImageChange} />
        <textarea
          ref={textareaRef}
          placeholder="Message HealChat"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isSending}
        />
        <button
          onClick={sendMessage}
          className="send-button"
          disabled={isSending}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
