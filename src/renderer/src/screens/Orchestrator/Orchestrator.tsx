import { useState, useCallback } from "react";

type AgentStatus = "idle" | "running" | "done" | "error";

interface AgentStub {
  id: string;
  name: string;
  status: AgentStatus;
  taskCount: number;
}

interface TaskFlow {
  id: string;
  title: string;
  owner: string;
  status: AgentStatus;
}

const INITIAL_AGENTS: AgentStub[] = [
  { id: "researcher", name: "Researcher", status: "idle", taskCount: 0 },
  { id: "writer", name: "Writer", status: "idle", taskCount: 0 },
  { id: "reviewer", name: "Reviewer", status: "idle", taskCount: 0 },
];

const INITIAL_FLOW: TaskFlow[] = [
  { id: "plan", title: "Plan use case", owner: "researcher", status: "idle" },
  { id: "draft", title: "Draft report", owner: "writer", status: "idle" },
  { id: "review", title: "Review report", owner: "reviewer", status: "idle" },
];

export default function OrchestratorView({}: { profile?: string }): React.ReactElement {
  const [agents, setAgents] = useState<AgentStub[]>(INITIAL_AGENTS);
  const [flows, setFlows] = useState<TaskFlow[]>(INITIAL_FLOW);
  const [logs, setLogs] = useState<string[]>([]);

  const appendLog = useCallback((line: string) => {
    setLogs((prev) => [...prev.slice(-50), `[${new Date().toLocaleTimeString()}] ${line}`]);
  }, []);

  const runAgents = useCallback(async () => {
    setAgents((prev) => prev.map((a) => ({ ...a, status: "running" as AgentStatus })));
    setFlows((prev) =>
      prev.map((f, idx) => (idx === 0 ? { ...f, status: "running" as AgentStatus } : f)),
    );
    appendLog("Starting multi-agent workflow.");

    await new Promise((resolve) => setTimeout(resolve, 800));

    setAgents((prev) => prev.map((a) => ({ ...a, status: "done" as AgentStatus })));
    setFlows((prev) =>
      prev.map((f, idx) => (idx === 0 ? { ...f, status: "done" as AgentStatus } : f)),
    );
    appendLog("Researcher completed.");
    await new Promise((resolve) => setTimeout(resolve, 800));

    setAgents((prev) =>
      prev.map((a) => (a.id === "writer" ? { ...a, status: "running" as AgentStatus, taskCount: a.taskCount + 1 } : a)),
    );
    setFlows((prev) =>
      prev.map((f) => (f.id === "draft" ? { ...f, status: "running" as AgentStatus } : f)),
    );
    await new Promise((resolve) => setTimeout(resolve, 900));

    setAgents((prev) => prev.map((a) => (a.id === "writer" ? { ...a, status: "done" as AgentStatus } : a)));
    setFlows((prev) => prev.map((f) => (f.id === "draft" ? { ...f, status: "done" as AgentStatus } : f)));
    appendLog("Writer completed.");
    await new Promise((resolve) => setTimeout(resolve, 700));

    setAgents((prev) =>
      prev.map((a) => (a.id === "reviewer" ? { ...a, status: "running" as AgentStatus, taskCount: a.taskCount + 1 } : a)),
    );
    setFlows((prev) =>
      prev.map((f) => (f.id === "review" ? { ...f, status: "running" as AgentStatus } : f)),
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setAgents((prev) => prev.map((a) => (a.id === "reviewer" ? { ...a, status: "done" as AgentStatus } : a)));
    setFlows((prev) => prev.map((f) => (f.id === "review" ? { ...f, status: "done" as AgentStatus } : f)));
    appendLog("Reviewer completed. Artifact: reports/test_output.md.");
  }, [appendLog]);

  const reset = useCallback(() => {
    setAgents(INITIAL_AGENTS);
    setFlows(INITIAL_FLOW);
    setLogs((prev) => [...prev, "Workflow reset."]);
  }, []);

  return (
    <div className="marketplace">
      <div className="page-header">
        <h1>Multi-Agent Orchestrator</h1>
        <div className="agents-actions">
          <button className="btn btn-primary btn-sm" onClick={runAgents}>
            Run workflow
          </button>
          <button className="btn btn-secondary btn-sm" onClick={reset}>
            Reset
          </button>
        </div>
      </div>

      <div className="agent-grid">
        {agents.map((agent) => (
          <div className="agent-card" key={agent.id}>
            <div className="agent-card-header">
              <div className="agent-card-name">{agent.name}</div>
              <span className={`status-tag ${agent.status}`}>{agent.status}</span>
            </div>
            <div className="agent-meta">Tasks: {agent.taskCount}</div>
          </div>
        ))}
      </div>

      <div className="task-flow">
        {flows.map((task) => (
          <div className="task-row" key={task.id}>
            <div className="task-title">{task.title}</div>
            <div className="task-owner">{task.owner}</div>
            <div className={`status-tag ${task.status}`}>{task.status}</div>
          </div>
        ))}
      </div>

      <div className="flow-logs">
        {logs.map((line) => (
          <div className="flow-log-line" key={line}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
