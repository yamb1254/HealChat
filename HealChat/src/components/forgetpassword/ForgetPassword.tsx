import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./ForgetPassword.css";
import apiClient from "../../api/client";

interface ForgotPassword {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPassword: React.FC<ForgotPassword> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");

  const handleSend = async () => {
    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Please enter your email address",
      });
      return;
    }

    try {
      await apiClient.post("auth/forgot-password", {
        email,
      });
      Swal.fire({
        icon: "success",
        title: "Password sent to your email",
      });
      onClose();
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
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ForgotPassword;
