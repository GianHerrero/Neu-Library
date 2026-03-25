import { useState, useEffect } from "react";
import axios from "axios";
import "./dashboard.css";
import neuLogo from "./neu-logo.png";

const collegeMajors = {
  "College of Accountancy": ["Faculty Staff Member", "BS Accountancy", "BS Accounting Information System",],
  "College of Agriculture": ["Faculty Staff Member", "BS Agriculture"],
  "College of Arts and Sciences": ["Faculty Staff Member", "AB Economics","AB Political Science","BS Biology","BS Psychology","Bachelor of Public Administration"],
  "College of Business Administration": ["Faculty Staff Member", "BSBA – Financial Management","BSBA – Human Resource Development Management","BSBA – Legal Management",
    "BSBA – Marketing Management","BS Entrepreneurship","BS Real Estate Management"],
  "College of Communication": ["Faculty Staff Member", "AB Broadcasting","AB Communication","AB Journalism"],
  "College of Informatics and Computing Studies (CICS)": 
    ["Faculty Staff Member", "Bachelor of Library and Information Science","BS Computer Science",
    "BS Entertainment & Multimedia Computing (Digital Animation)",
    "BS Entertainment & Multimedia Computing (Game Development)",
    "BS Information Technology","BS Information System"],
  "College of Criminology": ["Faculty Staff Member", "BS Criminology"],
  "College of Education": 
    ["Faculty Staff Member", "BEED (Elementary Education)","Preschool Education","Special Education",
    "BSED English","BSED Filipino","BSED Mathematics","BSED Science","BSED Social Studies","BSED MAPEH","BSED TLE"],
  "College of Engineering and Architecture": [
    "Faculty Staff Member", "BS Architecture","BS Astronomy","BS Civil Engineering","BS Electrical Engineering",
    "BS Electronics Engineering","BS Industrial Engineering","BS Mechanical Engineering"
  ],
  "College of Medical Technology": ["Faculty Staff Member", "BS Medical Technology"],
  "College of Midwifery": ["Faculty Staff Member", "Diploma in Midwifery"],
  "College of Music": [
    "Faculty Staff Member", "Bachelor of Music – Choral Conducting","Bachelor of Music – Music Education",
    "Bachelor of Music – Piano","Bachelor of Music – Voice"
  ],
  "College of Nursing": ["Faculty Staff Member", "BS Nursing"],
  "College of Physical Therapy": ["Faculty Staff Member", "BS Physical Therapy"],
  "College of Respiratory Therapy": ["Faculty Staff Member", "BS Respiratory Therapy"],
  "School of International Relations": ["Faculty Staff Member", "AB Foreign Service"]
};

const API_BASE = process.env.REACT_APP_API_URL;

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [major, setMajor] = useState("");
  const [showAdminWarning, setShowAdminWarning] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE}/api/user`, { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "jcesperanza@neu.edu.ph") {
      setShowAdminWarning(true); // show warning instead of logging in directly
    } else {
      setUser({ email, college, major, role: "visitor" });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmail("");
    setCollege("");
    setMajor("");
    setShowAdminWarning(false);
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
                <option value="">Select Role</option>
                {college && collegeMajors[college].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              <button type="submit" className="login-btn">Continue</button>
            </form>

            {showAdminWarning && (
              <div className="admin-warning">
                <p>⚠️ Admin dashboard detected for this email.</p>
                <button
                  className="login-btn"
                  onClick={() => setUser({ email, college, major, role: "admin" })}
                >
                  Continue as Admin
                </button>
                <button
                  className="login-btn"
                  style={{ backgroundColor: "#555" }}
                  onClick={() => setUser({ email, college, major, role: "visitor" })}
                >
                  Continue as Visitor
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {user.role === "admin" ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <VisitorDashboard
          onLogout={handleLogout}
          email={user.email}
          college={user.college}
          major={user.major}
        />
      )}
    </div>
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
