import { useState, useEffect } from "react";
import api from "../api/axios";
import "../styles/Webhook.css";
import { socket } from "../socket";
import { toast } from "react-toastify";

export default function WebhookPanel({ projectId }) {
  const [url, setUrl] = useState("");
  const [hooks, setHooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHooks = async () => {
    try {
      const { data } = await api.get(`/webhooks/${projectId}`);
      setHooks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHooks();
    socket.emit("join_project", projectId);

    socket.on("webhook_triggered", () => {
      fetchHooks();
      toast.success("Webhook triggered");
    });

    return () => {
      socket.off("webhook_triggered");
    };
  }, [projectId]);

  const addWebhook = async () => {
    if (!url){
      toast.error("Enter URL");
       return;
    }
    try {
      setLoading(true);
      await api.post(`/webhooks/${projectId}`, { url });
      setUrl("");
      fetchHooks();
    } catch (err) {
      console.error(err?.response?.data?.msg);
       toast.error("Failed to add webhook");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="webhook-container">
      <h3>🔗 Webhooks</h3>

      {/* ADD WEBHOOK */}
      <div className="webhook-form">
        <input
          placeholder="Enter webhook URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={addWebhook} disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      {/* LIST */}
      <div className="webhook-list">
        {hooks.map((h) => (
          <div key={h._id} className="webhook-card">
            <p className="webhook-url">{h.url}</p>

            <p className="retry">Retries: {h.retries} / 3</p>

            {/* DELIVERY LOGS */}
            <div className="logs">
              <h4>Logs</h4>

              {h.deliveryLogs.length === 0 ? (
                <p className="no-logs">No logs yet</p>
              ) : (
                h.deliveryLogs
                  .slice()
                  .reverse()
                  .map((log, i) => (
                    <div
                      key={i}
                      className={`log ${log.status === "SUCCESS" ? "success" : "fail"}`}
                    >
                      <span>{log.status}</span>
                      <span>{log.response}</span>
                      <span>
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}