//import { Component, useState } from "react";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignUp from "./components/SignUp/SignUp";
import Login from "./components/Login/Login";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
