import React, { useState } from 'react';

// Assume Tailwind CSS and DaisyUI are set up in your project.
// You might need to install them:
// npm install -D tailwindcss postcss autoprefixer
// npx tailwindcss init -p
// npm install daisyui

// Then add daisyui to your tailwind.config.js:
// module.exports = {
//   plugins: [require('daisyui')],
// }
// And include Tailwind directives in your main CSS file (e.g., index.css):
// @tailwind base;
// @tailwind components;
// @tailwind utilities;


const LoginForm = () => {
  // State for form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // State for displaying messages (e.g., success or error)
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Function to handle login form submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    setMessageType('');

    // Basic validation
    if (!username || !password) {
      setMessage('Please enter username and password.');
      setMessageType('error');
      return;
    }

    // In a real application, you would send a request to your backend login endpoint here.
    // Example using fetch (requires a backend endpoint like /api/login):
    /*
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) { // Assuming your backend sends { success: true, token: '...' } on success
        setMessage('Login successful!');
        setMessageType('success');
        // Store token, redirect user, etc.
      } else {
        setMessage(data.message || 'Login failed.'); // Assuming backend sends { message: '...' } on failure
        setMessageType('error');
      }
    })
    .catch((error) => {
      console.error('Login error:', error);
      setMessage('An error occurred during login.');
      setMessageType('error');
    });
    */

    // Placeholder for demonstration
    console.log('Login Attempt:', { username, password });
    setMessage('Login attempt processed (frontend only).');
    setMessageType('success');

    // Clear form fields after submission (optional)
    // setUsername('');
    // setPassword('');
  };

  return (
    // Container div centered on the page
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {/* Card container from daisyUI */}
      <div className="card w-full max-w-sm shadow-2xl bg-base-100 rounded-box">
        <div className="card-body">
          {/* Title */}
          <h2 className="text-2xl font-bold text-center mb-6">
            Login
          </h2>

          {/* Display messages */}
          {message && (
            <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-error'} mb-4`}>
              <div>
                 {/* You can add icons here using lucide-react or similar */}
                <span>{message}</span>
              </div>
            </div>
          )}

          {/* Login Form */}
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
              />
              {/* Optional: Forgot password link */}
              {/* <label className="label">
                <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
              </label> */}
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary rounded-box">Login</button>
            </div>
          </form>

          {/* Optional: Link to registration form */}
          {/* <div className="mt-6 text-center">
            <button className="btn btn-link">
              Need an account? Register
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
