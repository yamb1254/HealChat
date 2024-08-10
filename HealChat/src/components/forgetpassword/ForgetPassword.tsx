import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./ForgetPassword.css";
import apiClient from "../../api/client";
import logo from "../../assets/icon.png";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onValidated: (token: string) => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onValidated,
}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleValidate = async () => {
    setIsLoading(true);
    if (!username || !email) {
      Swal.fire({
        icon: "error",
        title: "Please enter your username and email",
      });
      return;
    }

    try {
      const response = await apiClient.post("/auth/validate-user", {
        email,
        username,
      });
      Swal.fire({
        icon: "success",
        title: "Validation successful",
      });
      onValidated(response.data.token);
      setIsLoading(false);
    } catch (error: unknown) {
      let errorMessage = "An error occurred. Please try again.";
      if (axios.isAxiosError(error) && error.response?.data.message) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <img src={logo} alt="Loading..." />
          </div>
        </div>
      )}
      <div className="modal">
        <h2>Forgot Password</h2>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleValidate}>Validate</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
