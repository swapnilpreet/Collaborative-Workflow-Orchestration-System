import { useEffect, useContext } from "react";
import { AuditContext } from "../context/AuditContext";
import "../styles/AuditLog.css";
import Navbar from "../components/Navbar";

const AuditLog = () => {
  const { logs, fetchLogs } = useContext(AuditContext);

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <>
    <Navbar/>
    <div className="audit-container">
      <h2>🧾 Audit Logs</h2>

      <div className="audit-table">
        <div className="audit-header">
          <span>User</span>
          <span>Action</span>
          <span>Entity</span>
          <span>Time</span>
        </div>

        {logs.map((log) => (
          <div key={log._id} className="audit-row">
            <span>{log.actor?.name || "Unknown"}</span>
            <span className={`action ${log.action}`}>
              {log.action}
            </span>
            <span>{log.entity}</span>
            <span>{new Date(log.createdAt).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default AuditLog;