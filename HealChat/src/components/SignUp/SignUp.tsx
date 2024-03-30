import React from "react";
import "./SignUp.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="wrapper">
      <form action="">
        <h1> Sign-up HealChat </h1>
        <div className="input-box">
          <input type="email" placeholder="Email" required />
          <FaEnvelope className="icon" />
        </div>
        <div className="input-box">
          <input type="password" placeholder="Password" required />
          <FaLock className="icon" />
        </div>
        <div className="input-box">
          <input type="password" placeholder="Confirm Password" required />
          <FaLock className="icon" />
        </div>

        <button type="submit">Sign-up</button>
        <div className="register-link">
          <p>
            Do you have already account? <Link to="/Login">Login</Link>
          </p>
        </div>
        <hr />
      </form>
    </div>
  );
};

export default SignUp;
