NEU Library Visitor Log

A web application for New Era University Library visitor tracking. It allows students and faculty to log their visits, select their purpose, and provides administrators with a dashboard to view and analyze visitor data.

🚀 Live Application

Deployed App Link

📖 Features

NEU email login (restricted to @neu.edu.ph addresses)

Visitor Dashboard: select purpose (Reading, Borrowing, Research, Other)

Admin Dashboard: view all visitor logs with email, college, major, purpose, and timestamp

MongoDB database integration for persistent storage

🛠 Tech Stack

Frontend: React

Backend: Node.js + Express

Database: MongoDB

Authentication: Google OAuth (optional for production)

🛠 Setup Instructions

1. Clone the Repository

git clone https://github.com/yourusername/neu-library-visitor-log.git
cd neu-library-visitor-log

2. Install Node Modules

# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm start

3. Environment Variables

Create a .env file inside the backend/ folder:

MONGO_URI=your_mongodb_connection_string
COOKIE_KEY=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

📊 Admin Dashboard

Admins can view visitor logs with filters for:

Email

College

Major

Purpose

Date
