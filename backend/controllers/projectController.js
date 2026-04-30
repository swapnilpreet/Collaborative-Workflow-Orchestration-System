const Project = require("../models/Project");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");


// ✅ Create Project
exports.createProject = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const project = new Project({
      name: req.body.name,
      owner: userId,
      members: [userId],
    });

    await project.save();

    res.json(project);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};


// ✅ Get All Projects (for logged-in user)
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.id,
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// ✅ Generate Invite Token
exports.generateInvite = async (req, res) => {
  try {
    const token = jwt.sign(
      { projectId: req.params.projectId },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// ✅ Join Project using Token
exports.joinProject = async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);

    const project = await Project.findById(decoded.projectId);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // ✅ Fix ObjectId comparison
    const isMember = project.members.some(
      (id) => id.toString() === req.user.id
    );

    if (!isMember) {
      project.members.push(new mongoose.Types.ObjectId(req.user.id));
      await project.save();
    }

    res.json(project);
  } catch (err) {
    res.status(400).json({ msg: "Invalid or expired token" });
  }
};


// ✅ Get Single Project By ID (FIXED POPULATE)
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    console.log("RAW PROJECT:", project);

    const populated = await Project.findById(req.params.projectId)
      .populate("owner")
      .populate("members");

    console.log("POPULATED:", populated);

    res.json(populated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};