import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client"; // Import the axios instance
import Swal from "sweetalert2";
import "./SignUp.css";
import axios from "axios";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password: string) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    return re.test(password);
  };

  const validateUsername = (username: string) => {
    const re = /^[A-Za-z][A-Za-z\d]{0,10}$/;
    return re.test(username);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid email format",
      });
      return;
    }
    if (!validatePassword(password)) {
      Swal.fire({
        icon: "error",
        title:
          "Password must be 8-16 characters long and contain letters and numbers",
      });
      return;
    }
    if (!validateUsername(username)) {
      Swal.fire({
        icon: "error",
        title:
          "Username must be no more than 8 characters and start with a letter",
      });
      return;
    }

    try {
      await apiClient.post("/auth/signup", { email, password, username });
      Swal.fire({
        icon: "success",
        title: "Sign up successful",
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
        title: "Sign up error",
        text: errorMessage,
      });
    }
  };

  return (
    <div className="wrapper">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <span className="icon">👤</span>
        </div>
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
        <button type="submit">Sign Up</button>
        <div className="register-link">
          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
