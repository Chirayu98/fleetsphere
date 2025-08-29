# 🚚 Jobsy – Delivery Job Connector Platform

**Jobsy** is a full-stack platform that connects delivery job seekers (for companies like Swiggy, Zomato, Zepto, etc.) with hiring recruiters. It simplifies job discovery, application, and communication through a clean interface and real-time chat system.

---

## 📌 Features

- 👥 Role-based login: Delivery partners & recruiters
- 📝 Job posting by recruiters with filters
- 💼 Instant job application system
- 💬 Real-time chat between job seekers and companies
- 🔔 Notifications for new jobs, chat, and status updates
- 📱 Mobile-friendly responsive design

---

## 🛠️ Tech Stack

| Layer      | Technologies Used                |
|------------|----------------------------------|
| Frontend   | HTML, CSS, JavaScript *(optional: React)* |
| Backend    | Node.js, Express.js              |
| Database   | MongoDB, Mongoose                |
| Realtime   | Socket.IO (chat)                 |
| Auth       | JWT-based authentication         |

---

## 🧑‍💻 Local Setup

```bash
# Clone the repo
git clone https://github.com/Chirayu98/Jobsy.git
cd Jobsy

# Backend setup
cd jobsy-backend
npm install
cp .env.example .env      
npm start

# Frontend
cd ../jobsy-frontend
# open index.html in browser OR run via live server
