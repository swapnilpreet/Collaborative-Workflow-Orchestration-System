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

## 🔐 Authentication APIs

### Signup
POST `/api/auth/signup`

### Login
POST `/api/auth/login`

### Get Current User
GET `/api/auth/me` (Protected)

---

## 👥 Project APIs

### Create Project
POST `/api/projects` (Protected)

### Get All Projects
GET `/api/projects` (Protected)

### Get Project By ID
GET `/api/projects/:projectId` (Protected)

### Generate Invite Token
POST `/api/projects/:projectId/invite` (Protected)

### Join Project
POST `/api/projects/join` (Protected)

---

## ✅ Task APIs

### Create Task
POST `/api/tasks/:projectId` (Protected)

### Get Tasks
GET `/api/tasks/:projectId` (Protected)

### Update Task
PUT `/api/tasks/:taskId` (Protected)

### Edit Full Task
PUT `/api/tasks/edit/:taskId` (Protected)

### Delete Task
DELETE `/api/tasks/:taskId` (Protected)

### Retry Task
POST `/api/tasks/retry/:taskId` (Protected)

### Task History
GET `/api/tasks/history/:taskId` (Protected)

---

## ⚡ Execution APIs

### Compute Execution Plan
POST `/api/execution/:projectId/compute-execution` (Protected)

### Simulate Execution
POST `/api/execution/:projectId/simulate` (Protected)

---

## 🔔 Webhook APIs

### Add Webhook
POST `/api/webhooks/:projectId` (Protected)

### Get Webhooks
GET `/api/webhooks/:projectId` (Protected)

---

## 🔐 Authentication

All protected routes require:
Authorization: Bearer <token>


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
