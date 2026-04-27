import { useState } from "react";
// import api from "../../api/axios";
import { ProjectContext } from "./ProjectContext";
import API from "../api/axios";

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);

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

      // add joined project to list
      setProjects((prev) => [...prev, data]);

      return data;
    } catch (err) {
      alert(err.response?.data?.msg || "Join failed");
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        fetchProjects,
        createProject,
        generateInvite,
        joinProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
