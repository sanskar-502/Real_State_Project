import { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {updateUser} = useContext(AuthContext)

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/login", {
        username,
        password,
      });

      updateUser(res.data)

      navigate("/");
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit} className="loginForm">
          <h1 className="loginTitle">Welcome Back</h1>
          <p className="loginDesc">Log in to continue your real estate journey!</p>
          <div className="formGroup">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              required
              minLength={3}
              maxLength={20}
              type="text"
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>
          <div className="formGroup">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
          <button className="loginBtn" disabled={isLoading}>
            {isLoading ? <span className="spinner"></span> : "Login"}
          </button>
          {error && <div className="loginError">{error}</div>}
          <div className="loginFooter">
            <span>Don&apos;t have an account?</span> <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="Background" />
      </div>
    </div>
  );
}

export default Login;
