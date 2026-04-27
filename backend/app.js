const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/execution", require("./routes/executionRoutes"));
app.use("/api/webhooks", require("./routes/webhookRoutes")); // ✅ ADD THIS

const errorMiddleware = require("./middleware/errorMiddleware");
app.use(errorMiddleware);

module.exports = app;