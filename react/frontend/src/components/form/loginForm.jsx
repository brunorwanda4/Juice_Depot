import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    setIsLoading(true);

    if (!username || !password) {
      setMessage("Please enter username and password.");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3004/api/login", {
        username,
        password,
      });

      setMessage(response.data.message || "Login successful!");
      setMessageType("success");

      // Example: Store token or redirect
      // localStorage.setItem("token", response.data.token);
      // navigate("/dashboard");

    } catch (error) {
      if (error.response) {
        const serverMsg =
          error.response.data.message ||
          error.response.data.error ||
          "Login failed.";
        setMessage(serverMsg);
      } else {
        setMessage(`An error occurred: ${error.message}`);
      }
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center  p-4">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100 rounded-box">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

          {message && (
            <div
              className={`alert ${
                messageType === "success" ? "alert-success" : "alert-error"
              } mb-4`}
            >
              <div>
                <span>{message}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                placeholder="username"
                className="input input-bordered w-full rounded-box"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered w-full rounded-box"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full rounded-box ${
                  isLoading ? "loading" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          {/* Optional link to register */}
          <div className="mt-6 text-center">
            <Link to={"/register"} className="btn btn-link">
              Need an account? Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
