export default function DependencyGraph({ tasks }) {

  const renderTask = (task, level = 0) => {
    return (
      <div key={task._id} style={{ marginLeft: level * 20 }}>
        <div style={{
          padding: "8px 12px",
          margin: "5px 0",
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "6px"
        }}>
          <strong>{task.title}</strong> ({task.status})
        </div>

        {tasks
          .filter(t => t.dependencies.includes(task._id))
          .map(child => renderTask(child, level + 1))}
      </div>
    );
  };

  // root tasks (no dependencies)
  const roots = tasks.filter(t => t.dependencies.length === 0);

  return (
    <div>
      <h3>Dependency Tree</h3>
      {roots.map(root => renderTask(root))}
    </div>
  );
}