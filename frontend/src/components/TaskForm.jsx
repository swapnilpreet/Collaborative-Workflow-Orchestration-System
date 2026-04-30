import { useState, useContext } from "react";
import api from "../api/axios";
import { TaskContext } from "../context/TaskContext";
import { toast } from "react-toastify";
import "../styles/TaskUI.css";

export default function TaskForm({ projectId }) {
  const { tasks } = useContext(TaskContext);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "",
    estimatedHours: "",
    dependencies: [],
    resourceTag: "",
    maxRetries: "",
  });

  // ✅ VALIDATION FUNCTION
  const validate = () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return false;
    }

     if (!form.description.trim()) {
      toast.error("Description is required");
      return false;
    }


    if (!form.priority || form.priority < 1 || form.priority > 5) {
      toast.error("Priority must be between 1 and 5");
      return false;
    }

    if (!form.estimatedHours || form.estimatedHours <= 0) {
      toast.error("Estimated hours must be > 0");
      return false;
    }

    if (!form.resourceTag.trim()) {
      toast.error("Resource tag required");
      return false;
    }

    if (form.maxRetries < 0) {
      toast.error("Max retries cannot be negative");
      return false;
    }

    return true;
  };

  // ✅ SUBMIT
  const submit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await api.post(`/tasks/${projectId}`, form);

      toast.success("Task created successfully 🚀");

      // reset form
      setForm({
        title: "",
        description: "",
        priority: "",
        estimatedHours: "",
        dependencies: [],
        resourceTag: "",
        maxRetries: "",
      });

    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  // ✅ DEPENDENCY TOGGLE
  const toggleDependency = (id) => {
    setForm((prev) => ({
      ...prev,
      dependencies: prev.dependencies.includes(id)
        ? prev.dependencies.filter((d) => d !== id)
        : [...prev.dependencies, id],
    }));
  };

  return (
    <div className="task-form">
      <h3>🔗 Create Task</h3>

      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <input
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        type="number"
        placeholder="Priority"
        value={form.priority}
        onChange={(e) =>
          setForm({ ...form, priority: Number(e.target.value) })
        }
      />

      <input
        type="number"
        placeholder="Estimated Hours"
        value={form.estimatedHours}
        onChange={(e) =>
          setForm({ ...form, estimatedHours: Number(e.target.value) })
        }
      />

      <input
        placeholder="Resource Tag"
        value={form.resourceTag}
        onChange={(e) => setForm({ ...form, resourceTag: e.target.value })}
      />

      <input
        type="number"
        placeholder="Max Retries"
        value={form.maxRetries}
        onChange={(e) =>
          setForm({ ...form, maxRetries: Number(e.target.value) })
        }
      />

      {/* DEPENDENCIES */}
      <div className="dependency-box">
        <h4>Dependencies</h4>

        {tasks.length === 0 && <p>No tasks available</p>}

        {tasks.map((t) => (
          <label key={t._id}>
            <input
              type="checkbox"
              checked={form.dependencies.includes(t._id)}
              onChange={() => toggleDependency(t._id)}
            />
            {t.title}
          </label>
        ))}
      </div>

      <button onClick={submit} disabled={loading}>
        {loading ? "Creating..." : "Create Task"}
      </button>
    </div>
  );
}