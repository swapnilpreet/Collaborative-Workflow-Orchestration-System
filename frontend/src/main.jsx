import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { ProjectProvider } from "./context/ProjectProvider.jsx";
import { TaskProvider } from "./context/TaskProvider.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuditProvider } from "./context/AuditProvider.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuditProvider>
      <AuthProvider>
        <ProjectProvider>
          <TaskProvider>
            <App />
          </TaskProvider>
        </ProjectProvider>
      </AuthProvider>
    </AuditProvider>
  </BrowserRouter>,
);
