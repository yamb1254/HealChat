import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./Login.css";
import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [showVerificationInput, setShowVerificationInput] = useState(false);

  useEffect(() => {
    document.body.classList.add("login");
    return () => {
      document.body.classList.remove("login");
    };
  }, []);
  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault(); // Prevent the default form submission
    setSuccess(true);
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    setSuccess(false);

    if (data.success) {
      localStorage.setItem("Email", data.email);
      localStorage.setItem("UserRole", data.role);
      Swal.fire({
        icon: "success",
        title: "",
        text: ` ${email} : קוד אימות נשלח אלייך למייל `,
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        setEmail("");
        setidNumber("");
        setShowVerificationInput(true);
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "התחברות נכשלה",
        text: "נסיון ההתחברות שלך לא הצליח. אנא נסה שנית.",
        confirmButtonText: "סגור",
      }).then(() => {
        setEmail("");
        setidNumber("");
      });
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>you are logged in!</h1>
          <br />
          <p>
            <a href="#">Go to Home</a>
          </p>
        </section>
      ) : (
        <div className="wrapper">
          <p
            //ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <form action="" onSubmit={handleSubmit}>
            <h1> HealChat Login </h1>
            <div className="input-box">
              <input
                type="text"
                id="email"
                //ref={errRef}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email"
                required
              />
              <FaEnvelope className="icon" />
            </div>
            <div className="input-box">
              <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={password}
                placeholder="Password"
                required
              />
              <FaLock className="icon" />
            </div>
            <div className="remember-forget">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#">Forget Password</a>
            </div>
            <button type="submit">Sign-In</button>
            <div className="register-link">
              <p>
                Don't have an account? <Link to="/SignUp">SignUp</Link>
              </p>
            </div>
            <hr />
            <div>
              <button type="button">
                Continue with Google
                <FaGoogle className="social-icon" />
              </button>
            </div>
            <div>
              <button type="button">Continue with SCE</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Login;
