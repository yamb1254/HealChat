import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login/Login";
import SignUp from "./components/signup/SignUp";
import Chat from "./components/chat/Chat";
import ResetPassword from "./components/resetpassword/ResetPassword";

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/" element={<Login />} />
    </Routes>
  </Router>
);

export default App;
