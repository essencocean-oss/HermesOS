export class SecurityError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly action: "allow" | "warn" | "block" = "block",
  ) {
    super(message);
    this.name = "SecurityError";
  }
}

export class AuditError extends SecurityError {
  constructor(message: string) {
    super(message, "AUDIT_ERROR", "block");
  }
}
