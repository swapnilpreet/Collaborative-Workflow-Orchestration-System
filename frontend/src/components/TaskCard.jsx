import { useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import "../styles/Task.css";

export default function TaskCard({ task }) {
  const { updateTask, retryTask, deleteTask } = useContext(TaskContext);

  const changeStatus = (status) => {
    updateTask(task._id, {
      status,
      versionNumber: task.versionNumber
    });
  };

  return (
    <div className="task-card">
      {/* TITLE */}
      <h4>{task.title}</h4>

      {/* STATUS */}
      <p className={`status ${task.status}`}>
        {task.status}
      </p>

      {/* DESCRIPTION */}
      <p className="task-desc">
        {task.description || "No description"}
      </p>

      {/* DETAILS */}
      <div className="task-details">
        <p><strong>Priority:</strong> {task.priority}</p>
        <p><strong>Estimated Hours:</strong> {task.estimatedHours}</p>
        <p><strong>Resource:</strong> {task.resourceTag}</p>
        <p><strong>Retries:</strong> {task.retryCount}/{task.maxRetries}</p>
        <p><strong>Version:</strong> {task.versionNumber}</p>
      </div>

      {/* DEPENDENCIES */}
      <div className="task-deps">
        <strong>Dependencies:</strong>
        {task.dependencies.length > 0 ? (
          task.dependencies.map(dep => (
            <span key={dep} className="dep-badge">
              {dep}
            </span>
          ))
        ) : (
          <span className="no-deps">None</span>
        )}
      </div>

      {/* DATES */}
      <div className="task-dates">
        <p>
          <strong>Created:</strong>{" "}
          {new Date(task.createdAt).toLocaleString()}
        </p>
        <p>
          <strong>Updated:</strong>{" "}
          {new Date(task.updatedAt).toLocaleString()}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="task-actions">
        <button className="btn-run" onClick={() => changeStatus("Running")}>
          Run
        </button>

        <button className="btn-complete" onClick={() => changeStatus("Completed")}>
          Done
        </button>

        <button className="btn-fail" onClick={() => changeStatus("Failed")}>
          Fail
        </button>

        <button
          className="btn-retry"
          onClick={() => retryTask(task._id)}
        >
          Retry
        </button>

        <button
          className="btn-delete"
          onClick={() => deleteTask(task._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}