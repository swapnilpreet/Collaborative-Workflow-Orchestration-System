import ReactFlow from "reactflow";
import "reactflow/dist/style.css";

export default function DependencyGraph({ tasks }) {

  // 🔥 convert tasks → nodes
  const nodes = tasks.map((task, index) => ({
    id: task._id,
    data: {
  label: (
    <div style={{
      padding: "10px",
      borderRadius: "8px",
      background: "#f5f7fb",
      border: "1px solid #ddd"
    }}>
      <strong>{task.title}</strong>
      <br />
      <small>Status: {task.status}</small>
    </div>
  )
},
    position: {
      x: (index % 3) * 250,
      y: Math.floor(index / 3) * 120
    }
  }));

  // 🔥 convert dependencies → edges (ARROWS)
  const edges = [];

  tasks.forEach(task => {
    task.dependencies.forEach(depId => {
      edges.push({
        id: `${depId}-${task._id}`,
        source: depId,     // 👉 from dependency
        target: task._id,  // 👉 to current task
        animated: true
      });
    });
  });

  return (
    <div style={{ height: "500px", background: "#fff", borderRadius: "10px" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView />
    </div>
  );
}