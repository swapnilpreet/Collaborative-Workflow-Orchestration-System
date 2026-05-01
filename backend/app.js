const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://collaborative-workflow-orchestratio.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is healthy",
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

/* ROUTES */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/execution", require("./routes/executionRoutes"));
app.use("/api/webhooks", require("./routes/webhookRoutes"));
app.use("/api/audit", require("./routes/auditRoutes"));
const errorMiddleware = require("./middleware/errorMiddleware");
app.use(errorMiddleware);

module.exports = app;