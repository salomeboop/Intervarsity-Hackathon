import { useState } from "react"; 
import { useNavigate, useLocation } from "react-router-dom";
import { verifyMFA, resendMFA } from "../services/api";
import "../styles/MFA.css";

export default function MFA() {
  const location = useLocation();
  const email = location.state?.email;
  const token = location.state?.token;

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setInfo("");

    try {
      const data = await verifyMFA(email, code, token);

      if (data.error) throw new Error(data.error);

      alert(data.message);
      navigate("/AdminDashboard"); // Or user dashboard route
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResend = async () => {
    setError(""); setInfo("");

    try {
      const data = await resendMFA(email);

      if (data.error) throw new Error(data.error);

      setInfo(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mfa-container">
      <h2>Enter Verification Code</h2>
      <p className="instructions">Please enter the code sent to your email.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Verification code"
            className={error ? "error" : ""}
          />
        </div>
        <button type="submit">Verify</button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {info && <p className="info-message">{info}</p>}

      <p>
        Didn't receive a code?{" "}
        <button
          onClick={handleResend}
          style={{
            background: "none",
            border: "none",
            color: "blue",
            textDecoration: "underline",
            cursor: "pointer",
            padding: 0,
            fontSize: "1em"
          }}
        >
          Resend
        </button>
      </p>
    </div>
  );
}
