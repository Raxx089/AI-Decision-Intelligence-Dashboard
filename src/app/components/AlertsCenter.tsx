import { useState } from "react";
import { alpha } from "../lib/color";
import {
  Bell, AlertTriangle, Zap, Shield, GitBranch, DollarSign,
  X, Check, ChevronRight, Filter, Clock, Volume2, VolumeX,
  AlertCircle, Info, CheckCircle2, Search, Settings
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type AlertLevel = "critical" | "warning" | "info" | "success";
type AlertCategory = "financial" | "operational" | "security" | "workflow" | "compliance" | "ai";

interface Alert {
  id: string;
  title: string;
  description: string;
  level: AlertLevel;
  category: AlertCategory;
  timestamp: string;
  read: boolean;
  muted: boolean;
  actions?: { label: string; variant: "primary" | "secondary" }[];
}

const initialAlerts: Alert[] = [
  {
    id: "a1", level: "critical", category: "security",
    title: "Security: Unusual API Access Detected",
    description: "4,200 API calls from unrecognized IP range (KR: 175.45.xx.xx) between 02:00-04:00 UTC. Rate limiting activated. Potential credential compromise.",
    timestamp: "30 min ago", read: false, muted: false,
    actions: [{ label: "Review Access Logs", variant: "primary" }, { label: "Block IP", variant: "secondary" }],
  },
  {
    id: "a2", level: "critical", category: "operational",
    title: "APAC Supply Chain: Critical Disruption Alert",
    description: "Singapore port congestion has reached 94% capacity. 23 shipments delayed. Estimated $1.2M revenue impact if not mitigated within 48 hours.",
    timestamp: "2 hours ago", read: false, muted: false,
    actions: [{ label: "Activate Contingency Plan", variant: "primary" }, { label: "View Risk Dashboard", variant: "secondary" }],
  },
  {
    id: "a3", level: "warning", category: "financial",
    title: "Budget Variance: Q2 Marketing Overspend",
    description: "Marketing department has spent 87% of Q2 budget with 6 weeks remaining. AI predicts 23% overspend if current trajectory continues.",
    timestamp: "4 hours ago", read: false, muted: false,
    actions: [{ label: "Review Budget", variant: "primary" }],
  },
  {
    id: "a4", level: "warning", category: "ai",
    title: "AI Model Drift Detected — Revenue Forecaster",
    description: "Revenue forecasting model accuracy dropped from 97% to 89% over past 2 weeks. Retraining with Q2 data recommended.",
    timestamp: "6 hours ago", read: false, muted: false,
    actions: [{ label: "Retrain Model", variant: "primary" }],
  },
  {
    id: "a5", level: "warning", category: "workflow",
    title: "3 Decision Workflows Approaching Deadline",
    description: "Q3 Budget Reallocation, APAC Market Expansion, and Supply Chain Optimization are due within 72 hours with no approver action.",
    timestamp: "8 hours ago", read: true, muted: false,
    actions: [{ label: "Review Workflows", variant: "primary" }],
  },
  {
    id: "a6", level: "warning", category: "compliance",
    title: "DORA Compliance: Control Gap Identified",
    description: "3 IT risk management controls flagged as non-compliant ahead of June 2026 DORA deadline. Remediation plans required.",
    timestamp: "1 day ago", read: true, muted: false,
    actions: [{ label: "Open Compliance Tracker", variant: "primary" }],
  },
  {
    id: "a7", level: "info", category: "ai",
    title: "New AI Insight: European Pricing Opportunity",
    description: "AI has identified a $340K revenue opportunity through EUR pricing optimization. View the full analysis in the AI Insights Center.",
    timestamp: "1 day ago", read: true, muted: false,
    actions: [{ label: "View Insight", variant: "primary" }],
  },
  {
    id: "a8", level: "success", category: "workflow",
    title: "ISO 27001 Audit: All Findings Resolved",
    description: "Security team has successfully remediated all 4 critical findings from the annual ISO 27001 audit. Certification renewal on track.",
    timestamp: "2 days ago", read: true, muted: false,
  },
  {
    id: "a9", level: "success", category: "financial",
    title: "Q2 Revenue Target Exceeded",
    description: "May revenue reached $6.8M, exceeding the Q2 monthly target of $6.2M by 9.7%. AI attributes success to North America enterprise expansion.",
    timestamp: "3 days ago", read: true, muted: false,
  },
];

const levelConfig: Record<AlertLevel, { color: string; bg: string; icon: React.ElementType; label: string }> = {
  critical: { color: "var(--error)", bg: "var(--error-container)", icon: AlertCircle, label: "Critical" },
  warning: { color: "var(--warning)", bg: "var(--warning-container)", icon: AlertTriangle, label: "Warning" },
  info: { color: "var(--primary)", bg: "var(--primary-container)", icon: Info, label: "Info" },
  success: { color: "var(--success)", bg: "var(--success-container)", icon: CheckCircle2, label: "Success" },
};

const categoryConfig: Record<AlertCategory, { label: string; icon: React.ElementType }> = {
  financial: { label: "Financial", icon: DollarSign },
  operational: { label: "Operational", icon: Zap },
  security: { label: "Security", icon: Shield },
  workflow: { label: "Workflow", icon: GitBranch },
  compliance: { label: "Compliance", icon: CheckCircle2 },
  ai: { label: "AI System", icon: Bell },
};

export function AlertsCenter() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [activeLevel, setActiveLevel] = useState<AlertLevel | "all">("all");
  const [activeCategory, setActiveCategory] = useState<AlertCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = alerts.filter((a) => {
    if (a.muted) return false;
    if (activeLevel !== "all" && a.level !== activeLevel) return false;
    if (activeCategory !== "all" && a.category !== activeCategory) return false;
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const unread = alerts.filter((a) => !a.read && !a.muted).length;
  const criticalCount = alerts.filter((a) => a.level === "critical" && !a.muted).length;

  const markRead = (id: string) => setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, read: true } : a));
  const markAllRead = () => setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  const dismiss = (id: string) => setAlerts((prev) => prev.filter((a) => a.id !== id));
  const muteAlert = (id: string) => setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, muted: true } : a));

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>Alerts Center</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            {unread} unread alerts · {criticalCount} critical requiring immediate action
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="text-xs font-medium px-3 py-1.5 rounded-xl transition-colors hover:bg-muted"
            style={{ color: "var(--primary)", border: "1px solid var(--primary-container)", backgroundColor: "var(--primary-tint)" }}
          >
            Mark all read
          </button>
          <button className="p-2 rounded-xl hover:bg-muted" style={{ color: "var(--muted-foreground)", border: "1px solid var(--surface-track)", backgroundColor: "var(--card)" }}>
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Critical Banner */}
      {criticalCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-2xl"
          style={{ background: "linear-gradient(135deg, var(--error), var(--on-error-container))", boxShadow: "0 4px 20px color-mix(in srgb, var(--error) 25%, transparent)" }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary-foreground/20 flex-shrink-0">
            <AlertCircle size={20} color="var(--primary-foreground)" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-primary-foreground text-sm">{criticalCount} Critical Alert{criticalCount > 1 ? "s" : ""} Require Immediate Action</p>
            <p className="text-xs text-primary-foreground/75 mt-0.5">Security breach attempt and APAC supply chain disruption detected. Action required within 48 hours.</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-card text-xs font-semibold" style={{ color: "var(--error)" }}>
            Review Now
          </button>
        </motion.div>
      )}

      {/* Level Summary */}
      <div className="grid grid-cols-4 gap-3">
        {(["critical", "warning", "info", "success"] as AlertLevel[]).map((level) => {
          const cfg = levelConfig[level];
          const count = alerts.filter((a) => a.level === level && !a.muted).length;
          const Icon = cfg.icon;
          return (
            <button
              key={level}
              onClick={() => setActiveLevel(activeLevel === level ? "all" : level)}
              className="flex items-center gap-2 p-3 rounded-xl transition-all hover:shadow-sm text-left"
              style={{
                backgroundColor: activeLevel === level ? cfg.bg : "var(--card)",
                border: `1px solid ${activeLevel === level ? alpha(cfg.color, "55") : "var(--surface-track)"}`,
              }}
            >
              <Icon size={16} style={{ color: cfg.color }} />
              <div>
                <div className="text-sm font-bold" style={{ color: cfg.color }}>{count}</div>
                <div className="text-xs" style={{ color: "var(--outline)" }}>{cfg.label}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search + Category Filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--outline)" }} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alerts..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none"
            style={{ border: "1px solid var(--outline-variant)", backgroundColor: "var(--card)", color: "var(--foreground)" }}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "financial", "operational", "security", "workflow", "compliance", "ai"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all"
              style={{
                backgroundColor: activeCategory === cat ? "var(--primary)" : "var(--card)",
                color: activeCategory === cat ? "var(--card)" : "var(--muted-foreground)",
                border: `1px solid ${activeCategory === cat ? "var(--primary)" : "var(--outline-variant)"}`,
              }}
            >
              {cat === "all" ? "All Categories" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((alert, i) => {
            const cfg = levelConfig[alert.level];
            const catCfg = categoryConfig[alert.category];
            const CatIcon = catCfg.icon;
            const LevelIcon = cfg.icon;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => markRead(alert.id)}
                className="bg-card rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md"
                style={{
                  borderTop: `1px solid ${alert.read ? "var(--surface-track)" : alpha(cfg.color, "44")}`,
                  borderRight: `1px solid ${alert.read ? "var(--surface-track)" : alpha(cfg.color, "44")}`,
                  borderBottom: `1px solid ${alert.read ? "var(--surface-track)" : alpha(cfg.color, "44")}`,
                  borderLeft: `4px solid ${cfg.color}`,
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Level Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: cfg.bg }}
                  >
                    <LevelIcon size={18} style={{ color: cfg.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {!alert.read && (
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
                          )}
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: cfg.bg, color: cfg.color }}
                          >
                            {cfg.label}
                          </span>
                          <span className="flex items-center gap-1 text-xs" style={{ color: "var(--outline)" }}>
                            <CatIcon size={11} />
                            {catCfg.label}
                          </span>
                          <span className="text-xs flex items-center gap-0.5 ml-auto" style={{ color: "var(--outline)" }}>
                            <Clock size={11} />
                            {alert.timestamp}
                          </span>
                        </div>
                        <p className="font-semibold text-sm mb-1.5" style={{ color: "var(--foreground)" }}>{alert.title}</p>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{alert.description}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    {(alert.actions?.length || true) && (
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        {alert.actions?.map((action) => (
                          <button
                            key={action.label}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                            style={{
                              backgroundColor: action.variant === "primary" ? cfg.color : "var(--primary-foreground)",
                              color: action.variant === "primary" ? "var(--card)" : cfg.color,
                              border: action.variant === "primary" ? "none" : `1px solid ${alpha(cfg.color, "55")}`,
                            }}
                          >
                            {action.label}
                          </button>
                        ))}
                        <div className="ml-auto flex items-center gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); muteAlert(alert.id); }}
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                            title="Mute alert"
                            style={{ color: "var(--outline)" }}
                          >
                            <VolumeX size={13} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); dismiss(alert.id); }}
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                            title="Dismiss"
                            style={{ color: "var(--outline)" }}
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <CheckCircle2 size={40} className="mx-auto mb-3" style={{ color: "var(--success)" }} />
          <p className="font-medium" style={{ color: "var(--muted-foreground)" }}>All caught up!</p>
          <p className="text-sm" style={{ color: "var(--outline)" }}>No alerts match your current filters.</p>
        </div>
      )}
    </div>
  );
}
