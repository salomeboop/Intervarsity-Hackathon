import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import "../styles/Register.css";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", surname: "", email: "", password: "" });
  const [validity, setValidity] = useState({ name: null, surname: null, email: null, password: null });
  const [passwordRules, setPasswordRules] = useState({ lowercase: false, uppercase: false, digit: false, specialChar: false, minLength: false });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const regex = {
    email: /^[a-zA-Z0-9!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9.]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$%&@^*]).{8,}$/
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (value.trim() === "") { setValidity({ ...validity, [name]: false }); return; }

    if (name === "email") setValidity({ ...validity, email: regex.email.test(value) });
    else if (name === "password") {
      const valueRules = {
        lowercase: /[a-z]/.test(value),
        uppercase: /[A-Z]/.test(value),
        digit: /[0-9]/.test(value),
        specialChar: /[!#$%&@^*]/.test(value),
        minLength: value.length >= 8,
      };
      setPasswordRules(valueRules);
      setValidity({ ...validity, password: Object.values(valueRules).every(Boolean) });
    } else setValidity({ ...validity, [name]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Object.values(validity).every(Boolean)) { alert("Please fill in all fields correctly."); return; }
    try {
      const data = await registerUser(formData);
      if (data.error) setError(data.error);
      else { setSuccess(data.message || "Registration successful!"); setError(""); setFormData({ name:"", surname:"", email:"", password:"" }); setTimeout(() => navigate("/"), 2000); }
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} style={{ borderColor: validity.name === null ? "#ccc" : validity.name ? "green" : "red" }} />
          <input type="text" name="surname" placeholder="Surname" value={formData.surname} onChange={handleChange} style={{ borderColor: validity.surname === null ? "#ccc" : validity.surname ? "green" : "red" }} />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} style={{ borderColor: validity.email === null ? "#ccc" : validity.email ? "green" : "red" }} />

          <div className="password-wrapper">
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} style={{ borderColor: validity.password === null ? "#ccc" : validity.password ? "green" : "red" }} />
            <div className="passinformation">
              <p>Password Requirements:</p>
              <ul>
                <li style={{ color: passwordRules.lowercase ? "green" : "red" }}>Lower case letter</li>
                <li style={{ color: passwordRules.uppercase ? "green" : "red" }}>Upper case letter</li>
                <li style={{ color: passwordRules.digit ? "green" : "red" }}>At least one digit</li>
                <li style={{ color: passwordRules.specialChar ? "green" : "red" }}>At least one special character: !, #, $, %, & @</li>
                <li style={{ color: passwordRules.minLength ? "green" : "red" }}>Minimum 8 characters</li>
              </ul>
            </div>
          </div>

          <button type="submit" disabled={!Object.values(validity).every(v => v)}>Register</button>
        </form>
        <p className="text-sm text-center mt-4">
          Already have an account? <Link to="/" className="text-blue-600 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}
