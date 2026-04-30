module.exports = function simulate(tasks, availableHours, failedIds = []) {
  const failedSet = new Set(failedIds.map(id => id.toString()));

  const result = {
    executionOrder: [],
    selectedTasks: [],
    blockedTasks: [],
    skippedTasks: [],
    totalPriorityScore: 0
  };

  let time = 0;

  // Map for quick lookup
  const taskMap = new Map();
  tasks.forEach(t => taskMap.set(t._id.toString(), t));

  const completed = new Set();

  // Helper → check dependencies
  const areDepsMet = (task) => {
    return task.dependencies.every(dep =>
      completed.has(dep.toString())
    );
  };

  // Step 1: filter failed tasks
  const availableTasks = tasks.filter(
    t => !failedSet.has(t._id.toString())
  );

  // Step 2: sort by priority per hour (better than plain priority)
  availableTasks.sort((a, b) => {
    const aScore = a.priority / a.estimatedHours;
    const bScore = b.priority / b.estimatedHours;
    return bScore - aScore;
  });

  // Step 3: iterative execution (dependency aware)
  let progress = true;

  while (progress) {
    progress = false;

    for (let task of availableTasks) {
      const id = task._id.toString();

      // already processed
      if (
        completed.has(id) ||
        result.selectedTasks.find(t => t._id.toString() === id)
      ) {
        continue;
      }

      // dependency check
      if (!areDepsMet(task)) {
        continue;
      }

      // time check
      if (time + task.estimatedHours <= availableHours) {
        result.selectedTasks.push(task);
        result.executionOrder.push(task._id);

        result.totalPriorityScore += task.priority;
        time += task.estimatedHours;

        completed.add(id);
        progress = true;
      }
    }
  }

  // Step 4: classify remaining tasks
  for (let task of tasks) {
    const id = task._id.toString();

    if (failedSet.has(id)) {
      result.blockedTasks.push(task);
      continue;
    }

    if (!completed.has(id)) {
      const depsMet = task.dependencies.every(dep =>
        completed.has(dep.toString())
      );

      if (!depsMet) {
        result.blockedTasks.push(task);
      } else {
        result.skippedTasks.push(task);
      }
    }
  }

  return result;
};