module.exports = function planExecution(tasks) {

  const completed = new Set(
    tasks
      .filter(t => t.status === "Completed")
      .map(t => t._id.toString())
  );

  const executionOrder = [];
  const blockedTasks = [];
  const skippedTasks = [];

  const usedResources = new Set();

  // ✅ SORT FIRST
  const sortedTasks = [...tasks].sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    if (a.estimatedHours !== b.estimatedHours)
      return a.estimatedHours - b.estimatedHours;
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  for (let task of sortedTasks) {

    // ❌ Skip failed/blocked
    if (task.status === "Blocked" || task.status === "Failed") {
      skippedTasks.push(task);
      continue;
    }

    // 🔒 Dependency check
    const depsMet = task.dependencies.every(dep =>
      completed.has(dep.toString())
    );

    if (!depsMet) {
      blockedTasks.push(task);
      continue;
    }

    // ⚠️ Resource conflict (ONLY THIS)
    if (usedResources.has(task.resourceTag)) {
      skippedTasks.push(task);
      continue;
    }

    // ✅ Eligible
    executionOrder.push(task);
    usedResources.add(task.resourceTag);
  }

  return {
    executionOrder,
    blockedTasks,
    skippedTasks
  };
};