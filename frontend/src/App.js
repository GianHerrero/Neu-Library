import { useState, useEffect } from "react";
import axios from "axios";
import "./dashboard.css";
import neuLogo from "./neu-logo.png";

const collegeMajors = { /* ... keep your mapping here ... */ };

const API_BASE = process.env.REACT_APP_API_URL;

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [major, setMajor] = useState("");

  useEffect(() => {
    axios.get(`${API_BASE}/api/user`, { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "jcesperanza@neu.edu.ph") {
      setUser({ email, college, major, role: "admin" });
    } else {
      setUser({ email, college, major, role: "visitor" });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmail("");
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
              {/* email, college, major inputs */}
              {/* continue button */}
            </form>
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
  // ... keep your visitor dashboard code ...
}

function AdminDashboard({ onLogout }) {
  // ... keep your admin dashboard code ...
}

export default App;
