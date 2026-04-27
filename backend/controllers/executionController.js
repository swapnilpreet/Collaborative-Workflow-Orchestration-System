const Task = require("../models/Task");
const planExecution = require("../utils/executionPlanner");
const simulate = require("../utils/simulationEngine");

// EXECUTION PLAN
exports.computeExecution = async (req, res) => {
  const tasks = await Task.find({ project: req.params.projectId });

  const plan = planExecution(tasks);

  res.json(plan);
};

// SIMULATION
exports.simulateExecution = async (req, res) => {
  const { availableHours } = req.body;

  const tasks = await Task.find({ project: req.params.projectId });

  const result = simulate(tasks, availableHours);

  res.json(result);
};