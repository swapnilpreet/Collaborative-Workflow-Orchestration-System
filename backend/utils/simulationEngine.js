module.exports = function simulate(tasks, availableHours, failedIds = []) {
  const failedSet = new Set(failedIds);

  const result = {
    executionOrder: [],
    selectedTasks: [],
    blockedTasks: [],
    skippedTasks: [],
    totalPriorityScore: 0
  };

  let time = 0;
  const completed = new Set();

  for (let task of tasks.sort((a, b) => b.priority - a.priority)) {

    if (failedSet.has(task._id.toString())) {
      result.blockedTasks.push(task);
      continue;
    }

    const depsMet = task.dependencies.every(d =>
      completed.has(d.toString())
    );

    if (!depsMet) {
      result.blockedTasks.push(task);
      continue;
    }

    if (time + task.estimatedHours <= availableHours) {
      result.selectedTasks.push(task);
      result.executionOrder.push(task._id);
      result.totalPriorityScore += task.priority;
      time += task.estimatedHours;
      completed.add(task._id.toString());
    } else {
      result.skippedTasks.push(task);
    }
  }

  return result;
};