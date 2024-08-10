import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";
import Swal from "sweetalert2";
import axios from "axios";
import "./Login.css";
import ForgotPasswordModal from "../forgetpassword/ForgetPassword";
import logo from "../../assets/icon.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiClient.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);

      if (rememberMe) {
        localStorage.setItem("email", email);
      } else {
        localStorage.removeItem("email");
      }

      Swal.fire({
        icon: "success",
        title: "Login successful",
      }).then(() => {
        setIsLoading(false); // Hide loading indicator
        navigate("/chat");
      });
    } catch (error: unknown) {
      let errorMessage = "An error occurred. Please try again.";
      if (axios.isAxiosError(error) && error.response?.data.message) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Login error",
        text: errorMessage,
      });
      setIsLoading(false); // Hide loading indicator
    }
  };

  const openForgotPasswordModal = () => {
    setIsModalOpen(true);
  };

  const closeForgotPasswordModal = () => {
    setIsModalOpen(false);
  };

  const handleValidated = (token: string) => {
    setIsModalOpen(false);
    navigate(`/reset-password/${token}`);
  };

  return (
    <div className="wrapper">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <img src={logo} alt="Loading..." />
          </div>
        </div>
      )}
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span className="icon">@</span>
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="icon">🔒</span>
        </div>
        <div className="remember-forget">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMeChange}
            />{" "}
            Remember me
          </label>
          <a href="#" onClick={openForgotPasswordModal}>
            Forgot password?
          </a>
        </div>
        <button type="submit">Login</button>
        <div className="register-link">
          <p>
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </form>
      <ForgotPasswordModal
        isOpen={isModalOpen}
        onClose={closeForgotPasswordModal}
        onValidated={handleValidated}
      />
    </div>
  );
};

export default Login;
