export type RiskLevel = "allow" | "warn" | "block";

export interface ScanContext {
  kind: "tool_call" | "command" | "skill_install" | "registry_entry" | "memory_in" | "skill_payload";
  actor?: string;
  profile?: string;
  payload: Record<string, unknown>;
}

export interface ScanFinding {
  id: string;
  ruleId: string;
  level: RiskLevel;
  title: string;
  detail?: string;
  action: string;
  meta?: Record<string, unknown>;
}

export type GuardAction = "allow" | "approval" | "block" | "redact";

export interface GuardResult {
  action: GuardAction;
  findings: ScanFinding[];
  redactions?: Record<string, string>;
}

export interface AuditRecord {
  ts: string;
  event: string;
  decision: GuardAction;
  findings: ScanFinding[];
  context: ScanContext;
  actor?: string;
  profile?: string;
  hashes: {
    context: string;
    record: string;
  };
}

export interface WindowsAdapter {
  isDefenderSmartAppControlEnabled(): Promise<boolean>;
  isAppLockerEnabled(): Promise<boolean>;
  createAppContainer(options: { name: string }): Promise<string>;
  destroyAppContainer(token: string): Promise<void>;
  monitorProcessCreate(pid: number): Promise<void>;
  monitorNetworkAccess(pid: number): Promise<void>;
  monitorFileWrite(path: string): Promise<void>;
}
