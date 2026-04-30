import { useState } from "react";
import { ProjectContext } from "./ProjectContext";
import API from "../api/axios";

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null); // ✅ NEW

  const fetchProjects = async () => {
    try {
      const { data } = await API.get("/projects");
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  const createProject = async (name) => {
    try {
      const { data } = await API.post("/projects", { name });
      setProjects((prev) => [...prev, data]);
      return data;
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to create project");
    }
  };

  const generateInvite = async (projectId) => {
    try {
      const { data } = await API.post(`/projects/${projectId}/invite`);
      return data.token;
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to generate invite");
    }
  };

  const joinProject = async (token) => {
    try {
      const { data } = await API.post(`/projects/join`, { token });

      // avoid duplicate project add
      setProjects((prev) => {
        const exists = prev.find((p) => p._id === data._id);
        return exists ? prev : [...prev, data];
      });

      return data;
    } catch (err) {
      alert(err.response?.data?.msg || "Join failed");
    }
  };

  // ✅ NEW: Get Project By ID
  const fetchProjectById = async (projectId) => {
    try {
      const { data } = await API.get(`/projects/${projectId}`);

      setCurrentProject(data); // store current project
      return data;
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to fetch project");
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,       // ✅ expose
        fetchProjects,
        createProject,
        generateInvite,
        joinProject,
        fetchProjectById,     // ✅ expose
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};