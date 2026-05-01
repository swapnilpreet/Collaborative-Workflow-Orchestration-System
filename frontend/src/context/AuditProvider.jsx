import { useState, useEffect } from "react";
import { AuditContext } from "./AuditContext";
import api from "../api/axios";
import { socket } from "../socket";

export const AuditProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);

  // Fetch logs
  const fetchLogs = async () => {
    try {
      const { data } = await api.get("/audit");
      setLogs(data);
    } catch (err) {
      console.error("Audit fetch error:", err);
    }
  };

  // ================= SOCKET =================
  useEffect(() => {
    socket.on("audit_log_created", (log) => {
      setLogs(prev => [log, ...prev]);
    });

    return () => socket.off("audit_log_created");
  }, []);

  return (
    <AuditContext.Provider value={{ logs, fetchLogs }}>
      {children}
    </AuditContext.Provider>
  );
};