import { useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import TaskCard from "./TaskCard";
import "../styles/TaskUI.css";

export default function TaskList() {
  const { tasks } = useContext(TaskContext);

  return (
    <div className="task-list">
      {tasks.map((t) => (
        <TaskCard key={t._id} task={t} />
      ))}
    </div>
  );
}