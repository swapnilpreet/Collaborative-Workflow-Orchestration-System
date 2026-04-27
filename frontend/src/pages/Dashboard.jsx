import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectContext } from "../context/ProjectContext";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const {
    projects,
    fetchProjects,
    createProject,
    generateInvite,
    joinProject
  } = useContext(ProjectContext);

  const [name, setName] = useState("");
  const [inviteToken, setInviteToken] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  // ✅ CREATE PROJECT
  const handleCreate = async () => {
    if (!name.trim()) {
      return alert("Project name required");
    }

    try {
      setLoading(true);

      const newProject = await createProject(name);
      setName("");

      navigate(`/project/${newProject._id}`);
    } catch (err) {
      alert("Failed to create project",err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ GENERATE INVITE
  const handleInvite = async (projectId) => {
    try {
      const token = await generateInvite(projectId);

      if (token) {
        await navigator.clipboard.writeText(token);
        alert("✅ Invite token copied!");
      }
    } catch {
      alert("Failed to generate invite");
    }
  };

  // ✅ JOIN PROJECT
  const handleJoin = async () => {
    if (!inviteToken.trim()) {
      return alert("Enter invite token");
    }

    try {
      setLoading(true);

      const project = await joinProject(inviteToken);

      if (project) {
        setInviteToken("");
        navigate(`/project/${project._id}`);
      }
    } catch {
      alert("Join failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <Navbar />

      <div className="dashboard-container">
        <h2 className="dashboard-title">📁 Your Projects</h2>

        {/* CREATE PROJECT */}
        <div className="card">
          <h3>Create Project</h3>

          <div className="input-group">
            <input
              placeholder="Enter project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button onClick={handleCreate} disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </div>

        {/* JOIN PROJECT */}
        <div className="card">
          <h3>Join Project</h3>

          <div className="input-group">
            <input
              placeholder="Paste invite token"
              value={inviteToken}
              onChange={(e) => setInviteToken(e.target.value)}
            />

            <button onClick={handleJoin} disabled={loading}>
              {loading ? "Joining..." : "Join"}
            </button>
          </div>
        </div>

        {/* PROJECT LIST */}
        <div className="card">
          <h3>My Projects</h3>

          {projects.length === 0 ? (
            <p>No projects yet</p>
          ) : (
            projects.map((p) => (
              <div key={p._id} className="project-item">
                <span
                  className="project-name"
                  onClick={() => navigate(`/project/${p._id}`)}
                >
                  📁 {p.name}
                </span>

                <button
                  className="invite-btn"
                  onClick={() => handleInvite(p._id)}
                >
                  Invite
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}