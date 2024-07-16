import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faPaperclip, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "./Chat.css";


const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { content: string; sender: string; imageUrl?: string }[]
  >([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [username, setUsername] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const sendMessage = async () => {
    if (message.trim() !== "" || selectedImage) {
      const userMessage = { content: message, sender: "user", imageUrl: "" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      const formData = new FormData();
      formData.append("content", message);
      formData.append("username", localStorage.getItem("username") || "");
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      try {
        // Call the Flask server
        const response = await fetch("https://093b-104-154-83-69.ngrok-free.app/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: message }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const aiMessage = {
          content: data.response,
          sender: "other",
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
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
    localStorage.removeItem("token");
    localStorage.removeItem("username");
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
