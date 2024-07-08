import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faPaperclip,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./Chat.css";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { content: string; sender: string; imageUrl?: string }[]
  >([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const username = "JohnDoe"; // Example username, replace with actual logic
  const navigate = useNavigate();

  const sendMessage = async () => {
    if (message.trim() !== "" || selectedImage) {
      const userMessage = { content: message, sender: "user", imageUrl: "" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        formData.append("content", message);
        formData.append("userId", "1"); // Replace with actual user ID

        // Handle image upload and message sending
        fetch("http://localhost:5000/api/messages", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
          });
      } else {
        try {
          const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer YOUR_OPENAI_API_KEY`,
              },
              body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: message }],
              }),
            }
          );
          const data = await response.json();
          const aiMessage = {
            content: data.choices[0].message.content,
            sender: "other",
          };
          setMessages((prevMessages) => [...prevMessages, aiMessage]);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }

      setMessage("");
      setSelectedImage(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
    // Clear user session and redirect to login page
    localStorage.removeItem("token");
    navigate("/login");
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
          <div key={index} className="message">
            {msg.sender === "other" && (
              <div className="avatar">{getInitials("OtherUser")}</div>
            )}
            <div className={`message-content ${msg.sender}`}>
              {msg.imageUrl ? (
                <img src={msg.imageUrl} alt="Uploaded" />
              ) : (
                msg.content
              )}
            </div>
            {msg.sender === "user" && (
              <div className="avatar">{getInitials(username)}</div>
            )}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <label htmlFor="imageUpload" className="image-upload-label">
          <FontAwesomeIcon icon={faPaperclip} />
        </label>
        <input type="file" id="imageUpload" onChange={handleImageChange} />
        <textarea
          placeholder="Message Code Copilot"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage} className="send-button">
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
