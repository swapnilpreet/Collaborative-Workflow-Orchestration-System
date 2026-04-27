module.exports = function buildGraph(tasks) {
  const graph = {};

  tasks.forEach(task => {
    graph[task._id] = task.dependencies || [];
  });

  return graph;
};