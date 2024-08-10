import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./ResetPassword.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons/faSignOutAlt";
import apiClient from "../../api/client";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [validatePassword, setValidatePassword] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!newPassword || !validatePassword) {
      Swal.fire({
        icon: "error",
        title: "Please enter and validate the new password",
      });
      return;
    }

    if (newPassword !== validatePassword) {
      Swal.fire({
        icon: "error",
        title: "Passwords do not match",
      });
      return;
    }

    try {
      const response = await apiClient.post("/auth//reset-password", {
        token,
        newPassword,
      });
      console.log(response.data);
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

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/login");
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
      <input
        type="password"
        placeholder="Validate new password"
        value={validatePassword}
        onChange={(e) => setValidatePassword(e.target.value)}
      />
      <button onClick={handleResetPassword}>Reset Password</button>
      <button onClick={handleLogout}>
        Cencel
        <FontAwesomeIcon icon={faSignOutAlt} />
      </button>
    </div>
  );
};

export default ResetPassword;
