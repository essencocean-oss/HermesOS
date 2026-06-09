import type { ScanContext, ScanResult } from "./types";

interface Rule {
  id: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  match(ctx: ScanContext): boolean;
}

const MIN_SECRET_LENGTH = 12;
const SUSPICIOUS_TOKENS = [
  /\b(?<![A-Za-z])[A-Za-z0-9+/]{40,}={0,2}(?![A-Za-z0-9+/])\b/,
  /\b(?:sk|pk|gh|xox|AKIA|AIza|GOCSPX)-[A-Za-z0-9_\-]{10,}\b/,
  /\b(?:api[_-]?key|secret|token|password|passwd)\s*[:=]\s*.{8,}/i,
  /\b(?:BEGIN\s+[A-Z ]+\s+PRIVATE\s+KEY)\b/,
];

const DANGEROUS_COMMANDS = /(?:(?:\^)|\/F\s+\/[sS])|(?:\/\s*[sS]\s*\/)|(?:\/s\s*\/)|(?:fatal\s+force)|(?:chmod\s+[0-7]{3,4}\s+\/)|(?:net\s+localgroup|net\s+user)|(?:powershell\s+-enc)/i;

const NETWORK_SINK_PATTERNS = /(?:curl\s|wget\s|Invoke-WebRequest|Invoke-RestMethod|powershell\s+-encode|netsh\s+firewall|net\s+use)/i;

function containsSecret(text: string): boolean {
  if (!text || text.length > 4000) return false;
  return SUSPICIOUS_TOKENS.some((re) => re.test(text));
}

function isDangerousCommand(text: string): boolean {
  return DANGEROUS_COMMANDS.test(text);
}

function isUnapprovedNetwork(text: string): boolean {
  if (!NETWORK_SINK_PATTERNS.test(text)) return false;
  const ctx = text.toLowerCase();
  return !/\b(?:web_search|web_extract|read_file|browser_navigate|fetch|http\.get|http\.request)\b/.test(ctx);
}

function detectPromptInjection(text: string): boolean {
  const patterns = [
    /ignore\s+(?:all\s+)?(?:previous|prior)\s+instructions/i,
    /disregard\s+(?:the\s+)?(?:above|prior|earlier)\s+(?:instructions|guidelines|rules)/i,
    /new\s+instruction/i,
    /\b(?:override|bypass|circumvent)\s+(?:all\s+)?(?:security|restrictions|rules|policy)/i,
    /\b(?:you\s+are\s+now|act\s+as|pretend|role)\b/i,
  ];
  return patterns.some((re) => re.test(text));
}

function detectDataExfil(text: string): boolean {
  return /(?:send|dump|exfil|post|publish)\s+(?:all\s+)?(?:logs|secrets|passwords|keys|tokens|credentials)/i.test(text);
}

function detectPrivilegeEscalation(text: string): boolean {
  return /(?:sudo\s|chmod\s+\+|set\s+uid|set\s+cap|adduser\s+sudo|net\s+localgroup\s+administrators|runas\s+\/user)/i.test(text);
}

export function evaluateContext(ctx: ScanContext): ScanResult {
  const text = JSON.stringify(ctx.payload ?? {});
  let highest: "low" | "medium" | "high" | "critical" = "low";

  if (containsSecret(text)) highest = "critical";
  if (isDangerousCommand(text)) highest = "critical";
  if (isUnapprovedNetwork(text)) highest = Math.max(highest, "medium") as typeof highest;
  if (detectPromptInjection(text)) highest = Math.max(highest, "high") as typeof highest;
  if (detectDataExfil(text)) highest = Math.max(highest, "critical") as typeof highest;
  if (detectPrivilegeEscalation(text)) highest = Math.max(highest, "critical") as typeof highest;

  return {
    risk: highest,
    requiresApproval: highest === "high" || highest === "critical",
    block: highest === "critical",
    reason: `Rule=${highest} kind=${ctx.kind}`,
  };
}
