module.exports = function hasCycle(tasks) {
  const graph = {};

  tasks.forEach(t => {
    graph[t._id] = t.dependencies || [];
  });

  const visited = new Set();
  const stack = new Set();

  function dfs(node) {
    if (stack.has(node)) return true;
    if (visited.has(node)) return false;

    visited.add(node);
    stack.add(node);

    for (let neighbor of graph[node] || []) {
      if (dfs(neighbor.toString())) return true;
    }

    stack.delete(node);
    return false;
  }

  return Object.keys(graph).some(dfs);
};