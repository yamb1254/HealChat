import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./ResetPassword.css";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const handleResetPassword = async () => {
    if (!newPassword) {
      Swal.fire({
        icon: "error",
        title: "Please enter a new password",
      });
      return;
    }

    try {
      await axios.post("${API_BASE_URL}/api/auth/reset-password", {
        token,
        newPassword,
      });
      Swal.fire({
        icon: "success",
        title: "Password reset successful",
      }).then(() => {
        navigate("/login");
      });
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

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleResetPassword}>Reset Password</button>
    </div>
  );
};

export default ResetPassword;
