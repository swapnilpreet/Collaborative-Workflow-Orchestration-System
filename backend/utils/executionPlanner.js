module.exports = function planExecution(tasks) {

  const completed = new Set(
    tasks.filter(t => t.status === "Completed")
         .map(t => t._id.toString())
  );

  const runningTags = new Set(
    tasks.filter(t => t.status === "Running")
         .map(t => t.resourceTag)
  );

  const executionOrder = [];
  const blockedTasks = [];
  const skippedTasks = [];

  for (let task of tasks) {

    // ❌ Skip blocked tasks directly
    if (task.status === "Blocked") {
      skippedTasks.push(task);
      continue;
    }

    // ❌ Failed tasks → skipped
    if (task.status === "Failed") {
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

    // ⚠️ Resource conflict
    if (runningTags.has(task.resourceTag)) {
      skippedTasks.push(task);
      continue;
    }

    // ✅ Eligible for execution
    executionOrder.push(task);
  }

  // 🔥 SORT execution order
  executionOrder.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    if (a.estimatedHours !== b.estimatedHours)
      return a.estimatedHours - b.estimatedHours;
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  return {
    executionOrder,
    blockedTasks,
    skippedTasks
  };
};