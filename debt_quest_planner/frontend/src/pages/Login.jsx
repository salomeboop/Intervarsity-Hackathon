import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import "../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validateEmail = (value) => {
    const regex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9.]+$/;
    return regex.test(value) && !/(;|SELECT|FROM|WHERE|INSERT|DELETE|UPDATE)/i.test(value);
  };

  const validatePassword = (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#$%&@*]).{8,}$/;
    return regex.test(value) && !/(;|SELECT|FROM|WHERE|INSERT|DELETE|UPDATE)/i.test(value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");

    if (!validateEmail(email) || !validatePassword(password)) return;

    try {
      const data = await loginUser({ email, password });

      if (data.error) throw new Error(data.error);

      const mfaToken = data.mfaToken;
      alert("Verification code sent to your email");

      navigate("/mfa", { state: { email, token: mfaToken } });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="content">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={submitted ? (validateEmail(email) ? "success" : "error") : ""}
          />
          {submitted && email.trim() === "" && <p className="error-message">Email is required</p>}
          {submitted && email.trim() !== "" && !validateEmail(email) && <p className="error-message">Invalid email format</p>}
        </div>

        <div className="form-group">
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={submitted ? (validatePassword(password) ? "success" : "error") : ""}
          />
          {submitted && password.trim() === "" && <p className="error-message">Password is required</p>}
          {submitted && password.trim() !== "" && !validatePassword(password) && (
            <p className="error-message">
              Password must be at least 8 chars, include uppercase, number & special char
            </p>
          )}
        </div>

        <button type="submit">Login</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <p>
        Don’t have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}
