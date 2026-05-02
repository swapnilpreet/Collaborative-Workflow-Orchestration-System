# 🚀 Collaborative Workflow Orchestration System (Backend)

A powerful backend system to manage **collaborative workflows**, task dependencies, execution planning, and real-time updates using Node.js, Express, MongoDB, and Socket.IO.

---

## ⚙️ Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Socket.IO (Real-time)
- bcrypt (Password hashing)

---

## 📁 Project Structure
backend/
│── controllers/
│── routes/
│── middleware/
│── models/
│── utils/
│── config/


---

## 🔐 Authentication

All protected routes require:
Authorisation: Bearer <token>


---

## 🧠 Core Features

- 🔁 Task Dependency Management (DAG)
- 🚫 Cycle Detection
- 🔄 Task Versioning
- 🔐 Encrypted Task Data
- 📊 Execution Planning & Simulation
- 🔔 Webhook Trigger System
- ⚡ Real-time Updates (Socket.IO)
- 📜 Audit Logging
- 🔁 Retry Mechanism for Failed Tasks

---

## 🔁 Task Status

- Pending
- Running
- Completed
- Failed
- Blocked

---

## ⚡ Real-time Events

- `task_created`
- `task_updated`
- `task_deleted`
- `status_changed`
- `retry_attempted`
- `webhook_triggered`
- `Audit_logs`

---

## 🛡️ Error Response

{
"message": "Error message"
}


---

## 🚀 Getting Started

### Install Dependencies
npm install


### Run Server

npm run dev


---

## 🔑 Environment Variables


PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key

---

## 📌 Notes

- All APIs are secured using JWT
- Task descriptions are encrypted before storing
- System ensures no circular dependencies
- Supports collaborative real-time workflow execution

---

## 👨‍💻 Author

Swapnil Ramteke
