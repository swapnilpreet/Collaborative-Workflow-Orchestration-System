const Project = require("../models/Project");
const InviteToken = require("../models/InviteToken");
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");

exports.createProject = async (req, res) => {
  const project = await Project.create({
    name: req.body.name,
    owner: req.user.id,
    members: [req.user.id]
  });

  res.json(project);
};

exports.getProjects = async (req, res) => {
  const projects = await Project.find({
    members: req.user.id
  });

  res.json(projects);
};

exports.generateInvite = async (req, res) => {
  const token = jwt.sign(
    { projectId: req.params.projectId },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }
  );

  res.json({ token });
};

exports.joinProject = async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);

    const project = await Project.findById(decoded.projectId);

    if (!project.members.includes(req.user.id)) {
      project.members.push(req.user.id);
      await project.save();
    }

    res.json(project);
  } catch {
    res.status(400).json({ msg: "Invalid or expired token" });
  }
};