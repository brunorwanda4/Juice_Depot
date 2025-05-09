import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("WORKER");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    setIsLoading(true);

    if (!username || !password || !userType) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3004/api/signup", {
        username,
        password,
        userType,
      });

      // Successful response
      setMessage(response.data.message || "Registration successful!");
      setMessageType("success");

      // Reset form
      setUsername("");
      setPassword("");
      setUserType("WORKER");
      navigate("/")
    } catch (error) {
      if (error.response) {
        const serverMsg =
          error.response.data.message ||
          error.response.data.error ||
          "Registration failed.";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100 rounded-box">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

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

          <form onSubmit={handleRegisterSubmit}>
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
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">User Type</span>
              </label>
              <select
                className="select select-bordered w-full rounded-box"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                required
                disabled={isLoading}
              >
                <option value="WORKER">WORKER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full rounded-box ${
                  isLoading ? "loading" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>

          {/* Optional login link */}
          <div className="mt-6 text-center">
            <Link to={"/"} className="btn btn-link">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
