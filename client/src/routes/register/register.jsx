import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";

function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("")
    setIsLoading(true);
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await apiRequest.post("/auth/register", {
        username,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="registerPage">
      <div className="formContainer">
        <form onSubmit={handleSubmit} className="registerForm">
          <h1 className="registerTitle">Create an Account</h1>
          <p className="registerDesc">Sign up to get started with your real estate journey!</p>
          <div className="formGroup">
            <label htmlFor="username">Username</label>
            <input id="username" name="username" type="text" placeholder="Enter your username" autoComplete="username" required />
          </div>
          <div className="formGroup">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="Enter your email" autoComplete="email" required />
          </div>
          <div className="formGroup">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Enter your password" autoComplete="new-password" required />
          </div>
          <button className="registerBtn" disabled={isLoading}>
            {isLoading ? <span className="spinner"></span> : "Register"}
          </button>
          {error && <div className="registerError">{error}</div>}
          <div className="registerFooter">
            <span>Already have an account?</span> <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="Background" />
      </div>
    </div>
  );
}

export default Register;
