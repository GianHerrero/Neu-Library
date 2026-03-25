import React from "react";
import "./Dashboard.css"; // we'll style separately
import neuLogo from "c:\Users\GIAN HERRERO\Downloads\neu-logo.png"; // place your NEU logo in /src/assets

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="overlay">
        <div className="welcome-box">
          <img src={neuLogo} alt="NEU Logo" className="neu-logo" />
          <h1>WELCOME TO NEU LIBRARY</h1>
          <input
            type="email"
            placeholder="Enter your NEU email"
            className="email-input"
          />
        </div>
      </div>
    </div>
  );
}