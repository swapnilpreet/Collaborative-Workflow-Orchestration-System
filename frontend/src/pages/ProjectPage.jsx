import { useEffect, useContext, useState } from "react";
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
import { ProjectContext } from "../context/ProjectContext";
import { FcWorkflow } from "react-icons/fc";
import { FaUsers } from "react-icons/fa";

export default function ProjectPage() {
  const { id: projectId } = useParams();
  const { fetchTasks, tasks } = useContext(TaskContext);
  const { currentProject, fetchProjectById } = useContext(ProjectContext);
  const [showMembers, setShowMembers] = useState(false);

  useEffect(() => {
    fetchProjectById(projectId);
    fetchTasks(projectId);
    console.log("Joining project room:", fetchTasks);

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
        <h2 className="title">
          <FcWorkflow size={35} /> Orchest Dashboard
        </h2>
        <div className="project-info">
          <div className="info-left">
            <h1><FcWorkflow size={35} /> {currentProject?.name.charAt(0).toUpperCase() + currentProject?.name.slice(1)}</h1>
            <p>Admin: {currentProject?.owner?.name.charAt(0).toUpperCase() + currentProject?.owner?.name.slice(1)}</p>

            {/* Members Header with Icon */}
            <div className="members-header">
              <p>Members</p>
              <span
                className="members-icon"
                onClick={() => setShowMembers(true)}
              >
                <FaUsers />
              </span>
            </div>

            <p>Project ID: {projectId}</p>
            <p> Created: {new Date(currentProject?.createdAt).toLocaleString()}</p>
          </div>

          {/*Modal */}
          {showMembers && (
            <div
              className="modal-overlay"
              onClick={() => setShowMembers(false)}
            >
              <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <h2><FaUsers /> Project Members</h2>

                {currentProject?.members?.map((m) => (
                  <div key={m._id} className="member-item">
                    <p>
                      <strong>{m.name}</strong>
                    </p>
                    <p>{m.email}</p>
                  </div>
                ))}

                <button onClick={() => setShowMembers(false)}>Close</button>
              </div>
            </div>
          )}

          <div className="info-right">
            <div className="stat-card total">
              <span>Total Tasks</span>
              <h3>{tasks.length}</h3>
            </div>

            <div className="stat-card running">
              <span>Running</span>
              <h3>{tasks.filter((t) => t.status === "Running").length}</h3>
            </div>

            <div className="stat-card completed">
              <span>Completed</span>
              <h3>{tasks.filter((t) => t.status === "Completed").length}</h3>
            </div>

            <div className="stat-card pending">
              <span>Pending</span>
              <h3>{tasks.filter((t) => t.status === "Pending").length}</h3>
            </div>
          </div>
        </div>

        <div className="grid">
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
              <h3>🔗 Tasks</h3>
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
