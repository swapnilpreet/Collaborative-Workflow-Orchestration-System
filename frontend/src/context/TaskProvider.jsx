import { useState, useEffect } from "react";
import { TaskContext } from "./TaskContext";
import api from "../api/axios";
import { socket } from "../socket";
 
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const joinProject = (projectId) => {
    socket.emit("join_project", projectId);
  };

  const fetchTasks = async (projectId) => {
    const { data } = await api.get(`/tasks/${projectId}`);
    setTasks(data);
    joinProject(projectId);
  };

  // ================= UPDATE TASK =================
  const updateTask = async (taskId, updates) => {
    try {
      const { data } = await api.put(`/tasks/${taskId}`, updates);

      setTasks(prev =>
        prev.map(t => (t._id === taskId ? data : t))
      );
    } catch (err) {
      alert(err.response?.data?.msg || "Update failed");
    }
  };

  // ================= RETRY TASK =================
  const retryTask = async (taskId) => {
    try {
      const { data } = await api.post(`/tasks/retry/${taskId}`);

      setTasks(prev =>
        prev.map(t => (t._id === taskId ? data : t))
      );
    } catch (err) {
      alert(err.response?.data?.msg || "Retry failed");
    }
  };

  // ================= DELETE TASK =================
  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);

      setTasks(prev => prev.filter(t => t._id !== taskId));
    } catch (err) {
      alert(err.response?.data?.msg || "Delete failed");
    }
  };

  // ================= SOCKET =================
  useEffect(() => {
    socket.on("task_created", (task) => {
      setTasks(prev => [...prev, task]);
    });

    socket.on("task_updated", (task) => {
      setTasks(prev =>
        prev.map(t => (t._id === task._id ? task : t))
      );
    });

    socket.on("status_changed", (task) => {
      setTasks(prev =>
        prev.map(t => (t._id === task._id ? task : t))
      );
    });

    socket.on("retry_attempted", (task) => {
      setTasks(prev =>
        prev.map(t => (t._id === task._id ? task : t))
      );
    });

    socket.on("task_deleted", (task) => {
      setTasks(prev => prev.filter(t => t._id !== task._id));
    });

    return () => socket.off();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        fetchTasks,
        updateTask,   // ✅ added
        retryTask,    // ✅ added
        deleteTask    // ✅ added
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};