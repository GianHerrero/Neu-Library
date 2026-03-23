import React, { useState } from "react";
import "./Dashboard.css";
import neuLogo from "../assets/neu-logo.png";

export default function Home({ onLogin }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass email back to parent (App.js) or navigate to /purpose
    onLogin(email);
  };

  return (
    <div className="dashboard">
      <div className="overlay">
        <div className="welcome-box">
          <img src={neuLogo} alt="NEU Logo" className="neu-logo" />
          <h1>WELCOME TO NEU LIBRARY</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your NEU email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input"
              required
            />
            <button type="submit" className="login-btn">Continue</button>
          </form>
        </div>
      </div>
    </div>
  );
}
