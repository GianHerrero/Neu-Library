# NEU Library Visitor Log

A web application for New Era University Library visitor tracking with **Google OAuth login**, **role-based access control**, and an **admin analytics dashboard**.

---

## 🚀 Live Application
[Deployed App Link](https://neu-library-log.onrender.com)

---

## 📌 Features
- **Google Login**: Secure authentication using Google OAuth.
- **Role-Based Access Control**:
  - **Regular User** (`jcesperanza@neu.edu.ph`):
    - Greeted with: *“Welcome to NEU Library!”*
  - **Admin** (`jcesperanza@neu.edu.ph`):
    - Access to visitor statistics dashboard.
    - Stats displayed in **cards** (Today, Week, Date Range).
    - Filters by:
      - Reason for visiting the library
      - College
      - Employee status (teacher/staff)

---

## 🛠️ Tech Stack
- **Frontend**: React.js, Axios
- **Backend**: Node.js, Express.js, Passport.js (Google OAuth)
- **Database**: MongoDB (Mongoose)
- **Deployment**: Render (backend), Netlify/Vercel (frontend)

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/neu-library-visitor-log.git
cd neu-library-visitor-log
