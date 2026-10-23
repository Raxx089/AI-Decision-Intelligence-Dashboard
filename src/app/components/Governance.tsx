import { useState } from "react";
import { alpha } from "../lib/color";
import {
  Shield, User, CheckCircle2, AlertTriangle,
  Clock, FileText, Activity, Key, Database,
  ChevronRight, Download, Search
} from "lucide-react";
import { motion } from "motion/react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";

const complianceData = [
  { subject: "Data Privacy", score: 94 },
  { subject: "Access Control", score: 87 },
  { subject: "Audit Logging", score: 92 },
  { subject: "Encryption", score: 96 },
  { subject: "AI Governance", score: 83 },
  { subject: "Risk Mgmt", score: 89 },
];

const auditLogs = [
  { id: "l1", user: "Jane Doe", action: "Approved APAC Budget Reallocation decision", resource: "Decision #W001", time: "10:32 AM", level: "medium", ip: "192.168.1.45" },
  { id: "l2", user: "AI System", action: "Generated executive intelligence briefing", resource: "Dashboard", time: "9:00 AM", level: "low", ip: "Internal" },
  { id: "l3", user: "Sarah Chen", action: "Downloaded Q2 Financial Report", resource: "Report #R-2026-Q2", time: "8:45 AM", level: "medium", ip: "10.0.2.88" },
  { id: "l4", user: "Mike Torres", action: "Modified user permissions for James Lee", resource: "User Management", time: "Yesterday 4:15 PM", level: "high", ip: "192.168.1.72" },
  { id: "l5", user: "System", action: "API rate limiting triggered (suspicious activity)", resource: "API Gateway", time: "Yesterday 2:00 AM", level: "critical", ip: "175.45.x.x" },
  { id: "l6", user: "David Kim", action: "Connected new data integration: AWS CloudWatch", resource: "Integrations", time: "May 12, 3:20 PM", level: "medium", ip: "10.0.3.11" },
  { id: "l7", user: "Lisa Park", action: "Exported customer segment data to CSV", resource: "Analytics Export", time: "May 12, 1:00 PM", level: "high", ip: "10.0.1.55" },
  { id: "l8", user: "James Lee", action: "Completed ISO 27001 audit remediation", resource: "Compliance Tracker", time: "May 11, 5:30 PM", level: "low", ip: "10.0.2.33" },
];

const roles = [
  {
    role: "CEO / Executive", permissions: {
      dashboard: "Full", analytics: "Full", reports: "Export", workflows: "Approve",
      admin: "View", integrations: "View", governance: "Full",
    },
    users: 2, color: "var(--primary)",
  },
  {
    role: "Operations Manager", permissions: {
      dashboard: "Full", analytics: "Full", reports: "Edit", workflows: "Create",
      admin: "None", integrations: "View", governance: "View",
    },
    users: 8, color: "var(--success)",
  },
  {
    role: "Finance Analyst", permissions: {
      dashboard: "View", analytics: "Finance Only", reports: "Finance", workflows: "Comment",
      admin: "None", integrations: "None", governance: "View",
    },
    users: 15, color: "var(--warning)",
  },
  {
    role: "Data Analyst", permissions: {
      dashboard: "View", analytics: "Full", reports: "View", workflows: "View",
      admin: "None", integrations: "View", governance: "None",
    },
    users: 24, color: "var(--ai)",
  },
  {
    role: "BI Developer", permissions: {
      dashboard: "Edit", analytics: "Full", reports: "Edit", workflows: "View",
      admin: "Limited", integrations: "Configure", governance: "None",
    },
    users: 6, color: "var(--info)",
  },
];

const permissionColumns = ["dashboard", "analytics", "reports", "workflows", "admin", "integrations", "governance"];

const permColor = (val: string) =>
  val === "Full" || val === "Export" || val === "Approve" || val === "Configure"
    ? "var(--success)"
    : val === "Edit" || val === "Create" || val === "Finance Only" || val === "Finance"
    ? "var(--warning)"
    : val === "View" || val === "Limited" || val === "Comment"
    ? "var(--primary)"
    : "var(--error)";

export function Governance() {
  const [activeTab, setActiveTab] = useState<"overview" | "permissions" | "audit" | "compliance">("overview");
  const [searchLogs, setSearchLogs] = useState("");

  const filteredLogs = auditLogs.filter((l) =>
    !searchLogs || l.user.toLowerCase().includes(searchLogs.toLowerCase()) ||
    l.action.toLowerCase().includes(searchLogs.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>Governance & Security</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Enterprise compliance, access control, and audit trail</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: "var(--success-container)", border: "1px solid var(--success-container)" }}>
          <CheckCircle2 size={16} style={{ color: "var(--success)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--success)" }}>Security Score: 91/100</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: "var(--muted)" }}>
        {[
          { id: "overview", label: "Overview", icon: Shield },
          { id: "permissions", label: "Permissions", icon: Key },
          { id: "audit", label: "Audit Logs", icon: FileText },
          { id: "compliance", label: "Compliance", icon: CheckCircle2 },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: activeTab === id ? "var(--card)" : "transparent",
              color: activeTab === id ? "var(--primary)" : "var(--muted-foreground)",
              boxShadow: activeTab === id ? "0 1px 4px color-mix(in srgb, var(--scrim) 10%, transparent)" : "none",
            }}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Security Health Radar */}
            <div className="bg-card rounded-2xl p-5 lg:col-span-1" style={{ border: "1px solid var(--surface-track)" }}>
              <h3 className="font-semibold mb-1" style={{ color: "var(--foreground)" }}>Security Health</h3>
              <p className="text-xs mb-4" style={{ color: "var(--outline)" }}>Compliance coverage across 6 domains</p>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={complianceData}>
                  <PolarGrid stroke="var(--surface-track)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <Radar dataKey="score" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.15} strokeWidth={2} isAnimationActive={false} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Compliance Indicators */}
            <div className="bg-card rounded-2xl p-5 lg:col-span-2" style={{ border: "1px solid var(--surface-track)" }}>
              <h3 className="font-semibold mb-4" style={{ color: "var(--foreground)" }}>Compliance Status</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "SOC 2 Type II", status: "Certified", date: "Expires Dec 2026", color: "var(--success)", bg: "var(--success-container)" },
                  { label: "GDPR", status: "Compliant", date: "Annual review Jul 2026", color: "var(--success)", bg: "var(--success-container)" },
                  { label: "ISO 27001", status: "Certified", date: "Renewal in progress", color: "var(--success)", bg: "var(--success-container)" },
                  { label: "DORA (EU)", status: "In Progress", date: "Deadline: Jun 2026", color: "var(--warning)", bg: "var(--warning-container)" },
                  { label: "HIPAA", status: "Not Required", date: "Not applicable", color: "var(--outline)", bg: "var(--muted)" },
                  { label: "PCI DSS", status: "Compliant", date: "Level 1 certified", color: "var(--success)", bg: "var(--success-container)" },
                ].map(({ label, status, date, color, bg }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ backgroundColor: bg }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: alpha(color, "22") }}>
                      <CheckCircle2 size={16} style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{label}</p>
                      <p className="text-xs" style={{ color }}>{status}</p>
                      <p className="text-xs" style={{ color: "var(--outline)" }}>{date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Active Users", value: "247", icon: User, color: "var(--primary)", bg: "var(--primary-container)" },
              { label: "API Keys Active", value: "34", icon: Key, color: "var(--success)", bg: "var(--success-container)" },
              { label: "Audit Events (24h)", value: "1,842", icon: Activity, color: "var(--warning)", bg: "var(--warning-container)" },
              { label: "Security Alerts", value: "2", icon: AlertTriangle, color: "var(--error)", bg: "var(--error-container)" },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-card rounded-2xl p-4" style={{ border: "1px solid var(--surface-track)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                    <Icon size={17} style={{ color }} />
                  </div>
                  <div>
                    <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>{value}</p>
                    <p className="text-xs" style={{ color: "var(--outline)" }}>{label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === "permissions" && (
        <div className="bg-card rounded-2xl overflow-hidden" style={{ border: "1px solid var(--surface-track)" }}>
          <div className="p-5" style={{ borderBottom: "1px solid var(--surface-track)" }}>
            <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>Role-Based Access Control (RBAC)</h3>
            <p className="text-xs mt-1" style={{ color: "var(--outline)" }}>Permission matrix for all user roles</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--page)" }}>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)", minWidth: 160 }}>Role</th>
                  {permissionColumns.map((col) => (
                    <th key={col} className="px-3 py-3 text-xs font-semibold uppercase tracking-wider capitalize" style={{ color: "var(--muted-foreground)", minWidth: 90 }}>
                      {col}
                    </th>
                  ))}
                  <th className="px-3 py-3 text-xs font-semibold uppercase" style={{ color: "var(--muted-foreground)" }}>Users</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role, i) => (
                  <tr
                    key={role.role}
                    style={{ borderTop: "1px solid var(--muted)" }}
                    className="hover:bg-page transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: role.color }} />
                        <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{role.role}</span>
                      </div>
                    </td>
                    {permissionColumns.map((col) => {
                      const val = role.permissions[col as keyof typeof role.permissions] || "None";
                      const color = permColor(val);
                      return (
                        <td key={col} className="px-3 py-3 text-center">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: alpha(color, "15"), color }}
                          >
                            {val}
                          </span>
                        </td>
                      );
                    })}
                    <td className="px-3 py-3 text-center">
                      <span className="text-xs font-bold" style={{ color: "var(--muted-foreground)" }}>{role.users}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === "audit" && (
        <div className="bg-card rounded-2xl overflow-hidden" style={{ border: "1px solid var(--surface-track)" }}>
          <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--surface-track)" }}>
            <div>
              <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>Audit Log</h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--outline)" }}>Complete audit trail of all system actions</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--outline)" }} />
                <input
                  value={searchLogs}
                  onChange={(e) => setSearchLogs(e.target.value)}
                  placeholder="Search logs..."
                  className="pl-8 pr-3 py-1.5 rounded-xl text-xs outline-none"
                  style={{ border: "1px solid var(--outline-variant)", backgroundColor: "var(--page)", color: "var(--foreground)", width: 180 }}
                />
              </div>
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
                style={{ border: "1px solid var(--outline-variant)", color: "var(--muted-foreground)" }}
              >
                <Download size={12} />
                Export
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ backgroundColor: "var(--page)" }}>
                  {["Time", "User", "Action", "Resource", "IP Address", "Level"].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 font-semibold uppercase tracking-wider" style={{ color: "var(--outline)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => {
                  const levelColors: Record<string, { color: string; bg: string }> = {
                    critical: { color: "var(--error)", bg: "var(--error-container)" },
                    high: { color: "var(--warning)", bg: "var(--warning-container)" },
                    medium: { color: "var(--primary)", bg: "var(--primary-container)" },
                    low: { color: "var(--success)", bg: "var(--success-container)" },
                  };
                  const lc = levelColors[log.level];
                  return (
                    <tr key={log.id} className="hover:bg-page transition-colors" style={{ borderTop: "1px solid var(--muted)" }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1" style={{ color: "var(--outline)" }}>
                          <Clock size={11} />
                          {log.time}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium" style={{ color: "var(--foreground)" }}>{log.user}</td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="truncate" style={{ color: "var(--muted-foreground)" }}>{log.action}</p>
                      </td>
                      <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>{log.resource}</td>
                      <td className="px-4 py-3 font-mono" style={{ color: "var(--outline)" }}>{log.ip}</td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-0.5 rounded-full capitalize font-semibold"
                          style={{ backgroundColor: lc.bg, color: lc.color }}
                        >
                          {log.level}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === "compliance" && (
        <div className="space-y-4">
          {[
            {
              framework: "SOC 2 Type II", score: 96, status: "Certified", expires: "Dec 31, 2026",
              controls: [
                { name: "Availability", status: "pass" }, { name: "Security", status: "pass" },
                { name: "Confidentiality", status: "pass" }, { name: "Processing Integrity", status: "pass" },
              ],
              color: "var(--success)",
            },
            {
              framework: "DORA (EU Digital Operational Resilience)", score: 74, status: "In Progress", expires: "Jun 15, 2026",
              controls: [
                { name: "ICT Risk Management", status: "pass" }, { name: "Incident Classification", status: "pass" },
                { name: "Digital Testing Program", status: "warning" }, { name: "Third-Party Risk", status: "fail" },
              ],
              color: "var(--warning)",
            },
            {
              framework: "GDPR", score: 94, status: "Compliant", expires: "Jul 1, 2026",
              controls: [
                { name: "Data Minimization", status: "pass" }, { name: "Right to Erasure", status: "pass" },
                { name: "Consent Management", status: "pass" }, { name: "DPA Agreements", status: "warning" },
              ],
              color: "var(--primary)",
            },
          ].map((fw) => (
            <div key={fw.framework} className="bg-card rounded-2xl p-5" style={{ border: "1px solid var(--surface-track)" }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>{fw.framework}</h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--outline)" }}>Next review: {fw.expires}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: fw.color }}>{fw.score}%</p>
                    <p className="text-xs" style={{ color: fw.color }}>{fw.status}</p>
                  </div>
                </div>
              </div>
              <div className="h-2 rounded-full overflow-hidden mb-4" style={{ backgroundColor: "var(--surface-track)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${fw.score}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: fw.color }}
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {fw.controls.map((ctrl) => (
                  <div
                    key={ctrl.name}
                    className="flex items-center gap-2 p-2.5 rounded-xl"
                    style={{
                      backgroundColor: ctrl.status === "pass" ? "var(--success-container)" : ctrl.status === "warning" ? "var(--warning-container)" : "var(--error-container)",
                    }}
                  >
                    <CheckCircle2
                      size={13}
                      style={{ color: ctrl.status === "pass" ? "var(--success)" : ctrl.status === "warning" ? "var(--warning)" : "var(--error)", flexShrink: 0 }}
                    />
                    <span className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>{ctrl.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
