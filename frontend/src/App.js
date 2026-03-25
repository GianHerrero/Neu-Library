import { useState, useEffect } from "react";
import axios from "axios";
import "./dashboard.css";
import neuLogo from "./neu-logo.png";

const collegeMajors = {
  "College of Accountancy": ["BS Accountancy", "BS Accounting Information System"],
  "College of Agriculture": ["BS Agriculture"],
  "College of Arts and Sciences": [
    "AB Economics","AB Political Science","BS Biology","BS Psychology","Bachelor of Public Administration"
  ],
  "College of Business Administration": [
    "BSBA – Financial Management","BSBA – Human Resource Development Management","BSBA – Legal Management",
    "BSBA – Marketing Management","BS Entrepreneurship","BS Real Estate Management"
  ],
  "College of Communication": ["AB Broadcasting","AB Communication","AB Journalism"],
  "College of Informatics and Computing Studies (CICS)": [
    "Bachelor of Library and Information Science","BS Computer Science",
    "BS Entertainment & Multimedia Computing (Digital Animation)",
    "BS Entertainment & Multimedia Computing (Game Development)",
    "BS Information Technology","BS Information System"
  ],
  "College of Criminology": ["BS Criminology"],
  "College of Education": [
    "BEED (Elementary Education)","Preschool Education","Special Education",
    "BSED English","BSED Filipino","BSED Mathematics","BSED Science","BSED Social Studies","BSED MAPEH","BSED TLE"
  ],
  "College of Engineering and Architecture": [
    "BS Architecture","BS Astronomy","BS Civil Engineering","BS Electrical Engineering",
    "BS Electronics Engineering","BS Industrial Engineering","BS Mechanical Engineering"
  ],
  "College of Medical Technology": ["BS Medical Technology"],
  "College of Midwifery": ["Diploma in Midwifery"],
  "College of Music": [
    "Bachelor of Music – Choral Conducting","Bachelor of Music – Music Education",
    "Bachelor of Music – Piano","Bachelor of Music – Voice"
  ],
  "College of Nursing": ["BS Nursing"],
  "College of Physical Therapy": ["BS Physical Therapy"],
  "College of Respiratory Therapy": ["BS Respiratory Therapy"],
  "School of International Relations": ["AB Foreign Service"]
};

const API_BASE = process.env.REACT_APP_API_URL;

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(""); // NEW: role selection
  const [college, setCollege] = useState("");
  const [major, setMajor] = useState("");
}

  useEffect(() => {
    axios.get(`${API_BASE}/api/user`, { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "jcesperanza@neu.edu.ph") {
      setUser({ email, role: "admin" });
    } else if (role === "faculty") {
      setUser({ email, role: "faculty" });
    } else if (role === "student") {
      setUser({ email, role: "student" });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmail("");
    setRole("");
    setCollege("");
    setMajor("");
  };

  if (!user) {
    return (
      <div className="dashboard">
        <div className="overlay">
          <div className="welcome-box">
            <img src={neuLogo} alt="NEU Logo" className="neu-logo" />
            <h1>WELCOME TO NEU LIBRARY</h1>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Enter your NEU email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="email-input"
                required
              />

              {/* Role selection */}
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="email-input"
                required
              >
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty Member</option>
              </select>

              <button type="submit" className="login-btn">Continue</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  function StudentDashboard({ onLogout, email, college, setCollege, major, setMajor }) {
  const [step, setStep] = useState("select");
  const [message, setMessage] = useState("");

  const handleSelectPurpose = (purpose) => {
    axios.post(`${API_BASE}/api/visitor`, { email, college, major, purpose })
      .then(() => {
        setMessage("Access Granted");
        setTimeout(() => { onLogout(); }, 2000);
      })
      .catch(err => console.error(err));
  };

  if (step === "select") {
    return (
      <div className="dashboard">
        <div className="overlay">
          <div className="welcome-box">
            <h1>Select College and Major</h1>
            <select
              value={college}
              onChange={(e) => { setCollege(e.target.value); setMajor(""); }}
              className="email-input"
              required
            >
              <option value="">Select College</option>
              {Object.keys(collegeMajors).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="email-input"
              required
              disabled={!college}
            >
              <option value="">Select Major</option>
              {college && collegeMajors[college].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <button className="login-btn" onClick={() => setStep("purpose")}>
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <VisitorDashboard
      onLogout={onLogout}
      email={email}
      college={college}
      major={major}
    />
  );
}

function VisitorDashboard({ onLogout, email, college, major }) {
  const [message, setMessage] = useState("");

  const handleSelect = (purpose) => {
    axios.post(`${API_BASE}/api/visitor`, { email, college, major, purpose })
      .then(() => {
        setMessage("Access Granted");
        setTimeout(() => { onLogout(); }, 2000);
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="dashboard">
      <div className="overlay">
        <div className="welcome-box">
          <h1>What is your purpose today?</h1>
          <div className="cards">
            <div className="card" onClick={() => handleSelect("Reading/Studying")}>📚 Reading / Studying</div>
            <div className="card" onClick={() => handleSelect("Borrowing/Returning")}>📖 Borrowing / Returning</div>
            <div className="card" onClick={() => handleSelect("Research/Computer Use")}>💻 Research / Computer Use</div>
            <div className="card" onClick={() => handleSelect("Other")}>➕ Other Purposes</div>
          </div>
          {message && <p className="access-msg">{message}</p>}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ onLogout }) {
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/api/admin/visitors`, { withCredentials: true })
      .then(res => setVisitors(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="dashboard">
      <div className="overlay">
        <div className="welcome-box">
          <h1>Admin Dashboard</h1>
          <button onClick={onLogout} className="logout-btn">Logout</button>

          <div className="table-container">
            <table className="visitor-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>College</th>
                  <th>Major</th>
                  <th>Purpose</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((v, i) => (
                  <tr key={i}>
                    <td>{v.email}</td>
                    <td>{v.college}</td>
                    <td>{v.major}</td>
                    <td>{v.purpose}</td>
                    <td>{new Date(v.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
