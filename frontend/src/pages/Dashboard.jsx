import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectContext } from "../context/ProjectContext";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";
import { toast } from "react-toastify";
import { FaProjectDiagram } from "react-icons/fa";
import { FaUser, FaUsers } from "react-icons/fa6";
import { FcTimeline } from "react-icons/fc";
import { VscGitPullRequestCreate } from "react-icons/vsc";
import { TbArrowsJoin } from "react-icons/tb";
import { FaNetworkWired } from "react-icons/fa";

export default function Dashboard() {
  const {
    projects,
    fetchProjects,
    createProject,
    generateInvite,
    joinProject,
  } = useContext(ProjectContext);

  const [name, setName] = useState("");
  const [inviteToken, setInviteToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingjoin, setLoadingjoin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  // ✅ CREATE PROJECT
 const handleCreate = async () => {
      if (!name.trim()) {
        toast.error("Project name required");
        return;
      }

      try {
        setLoading(true);

        const newProject = await createProject(name);
        setName("");

        navigate(`/project/${newProject._id}`);
      } catch (err) {
        console.log(err);
        toast.error("Failed to create project");
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
        toast.success("Invite token copied!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to generate invite");
    }
  };

  // ✅ JOIN PROJECT
  const handleJoin = async () => {
    if (!inviteToken.trim()) {
      return toast.error("Enter invite token");
    }
    try {
      setLoadingjoin(true);
      const project = await joinProject(inviteToken);

      if (project) {
        setInviteToken("");
        navigate(`/project/${project._id}`);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to join project");
    } finally {
      setLoadingjoin(false);
    }
  };

  return (
    <div className="dashboard">
      <Navbar />

      <div className="dashboard-container">
        <h2 className="dashboard-title"><FcTimeline size={30}/> Your Projects</h2>

        {/* CREATE PROJECT */}
        <div className="card">
          <h3><VscGitPullRequestCreate size={25} /> Create Project</h3>

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
          <h3><TbArrowsJoin size={25}/> Join Project</h3>

          <div className="input-group">
            <input
              placeholder="Paste invite token"
              value={inviteToken}
              onChange={(e) => setInviteToken(e.target.value)}
            />

            <button onClick={handleJoin} disabled={loadingjoin}>
              {loadingjoin ? "Joining..." : "Join"}
            </button>
          </div>
        </div>

        {/* PROJECT LIST */}
        <div className="card">
          <h3><FaNetworkWired  size={25}/> My Projects</h3>

          {projects.length === 0 ? (
            <p>No projects yet</p>
          ) : (
            projects.map((p) => (
              <div key={p._id} className="project-item">
                {/* make first latter of project name uppercase */}
                <span
                  className="project-name"
                  onClick={() => navigate(`/project/${p._id}`)}
                >
                  <FaProjectDiagram /> {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                </span>

                <span className="member-count">
                  {p.members.length}  {p.members.length !== 1 ? <FaUsers/> : <FaUser/>}
                </span>

                <button
                  className="invite-btn"
                  onClick={() => handleInvite(p._id)}
                >
                  Copy Invite Token
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
