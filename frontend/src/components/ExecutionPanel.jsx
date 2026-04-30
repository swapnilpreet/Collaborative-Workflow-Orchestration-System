import { useState } from "react";
import api from "../api/axios";
import "../styles/ExecutionPanel.css";
import { toast } from "react-toastify";

export default function ExecutionPanel({ projectId }) {
  const [execution, setExecution] = useState(null);
  const [simulation, setSimulation] = useState(null);
  const [hours, setHours] = useState();
  const [loading, setLoading] = useState(false);

  const runExecution = async () => {
    try {
      setLoading(true);

      const { data } = await api.post(
        `/execution/${projectId}/compute-execution`,
      );

      setExecution(data);
    } catch (err) {
      console.log(err.response?.data?.msg)
      toast.error("Execution failed");
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async () => {
    try {
      const { data } = await api.post(`/execution/${projectId}/simulate`, {
        availableHours: hours,
      });

      setSimulation(data);
    } catch (err) {
      console.log(err.response?.data?.msg)
      toast.error("Simulation failed");
    }
  };

  return (
    <div className="execution-panel">
      <h3>🔗 Execution Engine</h3>
      <div className="execution-actions">
        <button onClick={runExecution} disabled={loading}>
          {loading ? "Running..." : "Compute Execution"}
        </button>
      </div>

      <div className="execution-input">
        <label htmlFor="hours">Available Hours:</label>
        <input 
          placeholder="Add Available Hours for Simulation"
          type="number"
          id="hours"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
        />
        <button onClick={runSimulation}>Simulate</button>
      </div>

      {/* EXECUTION */}
      {execution && (
        <div>
          <div className="execution-box">
            <h4>Execution Order</h4>
            {execution?.executionOrder?.length ? (
              execution?.executionOrder?.map((t) => (
                <div className="execution-item order" key={t?._id}>
                  {t?.title} (P:{t?.priority})
                </div>
              ))
            ) : (
              <div className="execution-empty">No tasks</div>
            )}
          </div>
          <div className="execution-box">
            <h4>Blocked Tasks</h4>
            {execution.blockedTasks?.map((t) => (
              <div className="execution-item blocked" key={t._id}>
                {t.title}
              </div>
            ))}
          </div>

          <div className="execution-box">
            <h4>Skipped Tasks</h4>
            {execution.skippedTasks?.map((t) => (
              <div className="execution-item skipped" key={t._id}>
                {t.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SIMULATION */}
      {simulation && (
        <div className="execution-box">
          <h4>Simulation Result</h4>

          <div className="execution-score">
            Total Score: {simulation.totalPriorityScore}
          </div>

          <h5>Selected Tasks</h5>
          {simulation.selectedTasks?.map((t) => (
            <div className="execution-item selected" key={t._id}>
              {t.title} {`(P:${t.priority}, H:${t.estimatedHours})`}
            </div>
          ))}

          <h5>Blocked</h5>
          {simulation.blockedTasks?.map((t) => (
            <div className="execution-item blocked" key={t._id}>
              {t.title} {`(P:${t.priority}, H:${t.estimatedHours})`}
            </div>
          ))}

          <h5>Skipped</h5>
          {simulation.skippedTasks?.map((t) => (
            <div className="execution-item skipped" key={t._id}>
              {t.title} {`(P:${t.priority}, H:${t.estimatedHours})`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
