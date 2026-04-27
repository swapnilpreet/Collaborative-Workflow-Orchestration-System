import { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import DependencyGraph from "../components/DependencyGraph";
import TaskList from "../components/TaskList";
import ExecutionPanel from "../components/ExecutionPanel";
import TaskForm from "../components/TaskForm";
import { socket } from "../socket";
import { TaskContext } from "../context/TaskContext";
import Navbar from "../components/Navbar";
import WebhookPanel from "../components/WebhookPanel";
import "../styles/ProjectPage.css";

export default function ProjectPage() {
  const { id: projectId } = useParams();
  const { fetchTasks , tasks} = useContext(TaskContext);

  useEffect(() => {
    fetchTasks(projectId);

    socket.emit("join_project", projectId);
    socket.on("task_created", () => fetchTasks(projectId));
    socket.on("task_updated", () => fetchTasks(projectId));
    socket.on("status_changed", () => fetchTasks(projectId));
    socket.on("retry_attempted", () => fetchTasks(projectId));

    return () => socket.off();
  }, [projectId]);

  return (
  <div className="project-page">
    <Navbar />

    <div className="container">
      <h2 className="title">🚀 Workflow Dashboard</h2>

      <div className="grid">
        {/* LEFT SIDE */}
        <div className="left">
          <div className="card">
            <TaskForm projectId={projectId} />
          </div>

          <div className="card">
            <ExecutionPanel projectId={projectId} />
          </div>

          <div className="card">
            <WebhookPanel projectId={projectId} />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right">
          <div className="card">
            <h3>📋 Tasks</h3>
            <TaskList />
          </div>

          <div className="card">
            <h3>🔗 Dependency Graph</h3>
            <DependencyGraph tasks={tasks} />
          </div>
        </div>
      </div>
    </div>
  </div>
);
}