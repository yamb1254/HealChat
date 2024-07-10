import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./ForgetPassword.css";

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

  const handleValidate = async () => {
    if (!username || !email) {
      Swal.fire({
        icon: "error",
        title: "Please enter your username and email",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/validate-user",
        { username, email }
      );
      Swal.fire({
        icon: "success",
        title: "Validation successful",
      });
      onValidated(response.data.token);
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
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
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
