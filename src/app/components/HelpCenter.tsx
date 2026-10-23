import { useState } from "react";
import { alpha } from "../lib/color";
import {
  X, BookOpen, Keyboard, HelpCircle, Sparkles, CheckCircle2,
  LayoutDashboard, Bot, TrendingUp, GitBranch, FileBarChart,
  ChevronDown, ChevronRight, ExternalLink, Play, Zap, Shield,
  Bell, Star, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../context/ThemeContext";

const TABS = [
  { id: "start", label: "Getting Started", icon: BookOpen },
  { id: "shortcuts", label: "Shortcuts", icon: Keyboard },
  { id: "faq", label: "FAQ", icon: HelpCircle },
  { id: "whats-new", label: "What's New", icon: Sparkles },
];

const startSteps = [
  {
    icon: LayoutDashboard,
    color: "var(--primary)",
    bg: "var(--primary-container)",
    title: "Explore your Dashboard",
    desc: "Get a real-time overview of KPIs, revenue trends, and AI-powered risk signals.",
    action: "Open Dashboard",
    done: true,
  },
  {
    icon: Bot,
    color: "var(--ai)",
    bg: "var(--ai-container)",
    title: "Ask the AI Copilot",
    desc: "Type natural language questions like \"Why did revenue dip in April?\" and get instant answers.",
    action: "Try AI Copilot",
    done: true,
  },
  {
    icon: TrendingUp,
    color: "var(--success)",
    bg: "var(--success-container)",
    title: "Run a forecast simulation",
    desc: "Use the What-If sliders in Predictive Analytics to model business outcomes.",
    action: "Open Analytics",
    done: false,
  },
  {
    icon: GitBranch,
    color: "var(--warning)",
    bg: "var(--warning-container)",
    title: "Review pending decisions",
    desc: "Workflows awaiting your approval are flagged. Act on them with one click.",
    action: "View Workflows",
    done: false,
  },
  {
    icon: FileBarChart,
    color: "var(--info)",
    bg: "var(--info-container)",
    title: "Generate your first report",
    desc: "Choose a template, let AI populate it, then export or schedule delivery.",
    action: "Create Report",
    done: false,
  },
];

const shortcuts = [
  { keys: ["⌘", "K"], label: "Open command palette" },
  { keys: ["⌘", "/"], label: "Focus search bar" },
  { keys: ["G", "D"], label: "Go to Dashboard" },
  { keys: ["G", "C"], label: "Go to AI Copilot" },
  { keys: ["G", "R"], label: "Go to Reports" },
  { keys: ["G", "W"], label: "Go to Workflows" },
  { keys: ["⌘", "⇧", "N"], label: "New report" },
  { keys: ["⌘", "⇧", "E"], label: "Export current view" },
  { keys: ["⌘", "⇧", "S"], label: "Share current view" },
  { keys: ["?"], label: "Open this help panel" },
  { keys: ["Esc"], label: "Close modals / panels" },
  { keys: ["⌘", "T"], label: "Toggle theme" },
];

const faqs = [
  {
    q: "How does the AI generate forecasts?",
    a: "DecisionOS AI combines your connected data sources with proprietary ML models trained on 10M+ enterprise decision patterns. Forecasts include confidence intervals (P10/P50/P90) and automatically update as new data arrives.",
  },
  {
    q: "How current is the data shown?",
    a: "By default, data refreshes every 15 minutes. You can configure refresh intervals per integration in Data Integrations settings. Real-time streaming is available for Salesforce, HubSpot, and Snowflake.",
  },
  {
    q: "Can I customize the dashboard layout?",
    a: "Yes — in any report builder, you can drag widgets, resize panels, and choose from 7+ widget types. Your layout is saved automatically and can be shared with teammates.",
  },
  {
    q: "How do I invite team members?",
    a: "Go to Admin Panel → User Management → Invite Users. You can assign roles (Admin, Analyst, Viewer) and scoped data access per user or group.",
  },
  {
    q: "Is my data secure?",
    a: "DecisionOS AI is SOC 2 Type II certified, GDPR compliant, and ISO 27001 certified. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We never train on your data.",
  },
  {
    q: "How do scheduled reports work?",
    a: "In the Reports module, open any report, click Schedule, and set frequency (daily/weekly/monthly), time, and recipients. Reports are generated fresh at delivery time and sent as PDF attachments.",
  },
];

const releases = [
  {
    version: "v2.4.0",
    date: "May 13, 2026",
    badge: "Latest",
    badgeColor: "var(--success)",
    items: [
      { icon: Sparkles, text: "AI Report Generation — auto-populate reports from natural language prompts" },
      { icon: Shield, text: "Enhanced Governance module with real-time audit stream" },
      { icon: Bell, text: "Smart alert grouping — reduces notification noise by 60%" },
      { icon: Zap, text: "What-If Simulation now supports 8 variables simultaneously" },
    ],
  },
  {
    version: "v2.3.0",
    date: "April 28, 2026",
    badge: null,
    badgeColor: "",
    items: [
      { icon: TrendingUp, text: "Predictive confidence intervals (P10/P50/P90) for all forecasts" },
      { icon: GitBranch, text: "Workflow approval chains with multi-stakeholder sign-off" },
      { icon: Star, text: "Pinnable KPI cards on Dashboard" },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const { isDark } = useTheme();
  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{ border: `1px solid ${"var(--surface-track)"}` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
        style={{ backgroundColor: "var(--card)" }}
      >
        <span className="text-sm font-medium pr-4" style={{ color: "var(--foreground)" }}>{q}</span>
        {open ? (
          <ChevronDown size={15} style={{ color: "var(--outline)", flexShrink: 0 }} />
        ) : (
          <ChevronRight size={15} style={{ color: "var(--outline)", flexShrink: 0 }} />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="px-4 pb-4 text-sm leading-relaxed"
              style={{
                color: "var(--muted-foreground)",
                backgroundColor: "var(--page)",
              }}
            >
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function HelpCenter({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("start");
  const { isDark } = useTheme();

  const surface = "var(--card)";
  const border = "var(--surface-track)";
  const text = "var(--foreground)";
  const textSub = "var(--muted-foreground)";
  const bg = "var(--page)";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex"
      style={{ backgroundColor: "color-mix(in srgb, var(--scrim) 50%, transparent)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="ml-auto h-full w-full max-w-xl flex flex-col overflow-hidden"
        style={{ backgroundColor: surface }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: `1px solid ${border}` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--primary), var(--info))" }}
            >
              <HelpCircle size={18} color="var(--primary-foreground)" />
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: text }}>Help Center</h2>
              <p className="text-xs" style={{ color: textSub }}>DecisionOS AI v2.4.0</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-colors hover:bg-muted"
            style={{ color: textSub }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex px-4 pt-3 gap-1 flex-shrink-0"
          style={{ borderBottom: `1px solid ${border}` }}
        >
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-medium transition-all"
              style={{
                color: activeTab === id ? "var(--primary)" : textSub,
                backgroundColor: activeTab === id ? ("var(--primary-tint)") : "transparent",
                borderBottom: activeTab === id ? "2px solid var(--primary)" : "2px solid transparent",
              }}
            >
              <Icon size={13} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ backgroundColor: bg }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="p-5 space-y-3"
            >
              {/* GETTING STARTED */}
              {activeTab === "start" && (
                <>
                  <div
                    className="p-4 rounded-2xl mb-4"
                    style={{ background: "linear-gradient(135deg, var(--primary), var(--info))" }}
                  >
                    <p className="text-sm font-bold text-primary-foreground mb-1">Welcome to DecisionOS AI</p>
                    <p className="text-xs text-primary-foreground/80 leading-relaxed">
                      Follow these steps to unlock the full power of AI-driven decision intelligence for your enterprise.
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-primary-foreground/20">
                        <div className="h-full w-2/5 rounded-full bg-card" />
                      </div>
                      <span className="text-xs text-primary-foreground font-medium">2 of 5 complete</span>
                    </div>
                  </div>
                  {startSteps.map((step, i) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-4 p-4 rounded-2xl transition-all"
                        style={{
                          backgroundColor: surface,
                          border: `1px solid ${step.done ? alpha(step.color, "33") : border}`,
                          opacity: step.done ? 0.8 : 1,
                        }}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: step.bg }}
                        >
                          {step.done ? (
                            <CheckCircle2 size={18} style={{ color: step.color }} />
                          ) : (
                            <Icon size={18} style={{ color: step.color }} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-semibold" style={{ color: text }}>{step.title}</p>
                            {step.done && (
                              <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: "var(--success-container)", color: "var(--success)" }}>Done</span>
                            )}
                          </div>
                          <p className="text-xs leading-relaxed mb-2" style={{ color: textSub }}>{step.desc}</p>
                          {!step.done && (
                            <button
                              className="flex items-center gap-1 text-xs font-semibold"
                              style={{ color: step.color }}
                            >
                              {step.action}
                              <ArrowRight size={11} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {/* SHORTCUTS */}
              {activeTab === "shortcuts" && (
                <>
                  <p className="text-xs mb-4" style={{ color: textSub }}>
                    Speed up your workflow with these keyboard shortcuts.
                  </p>
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{ border: `1px solid ${border}` }}
                  >
                    {shortcuts.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-primary-tint/30"
                        style={{
                          borderBottom: i < shortcuts.length - 1 ? `1px solid ${border}` : "none",
                          backgroundColor: i % 2 === 0 ? surface : ("var(--page)"),
                        }}
                      >
                        <span className="text-sm" style={{ color: text }}>{s.label}</span>
                        <div className="flex items-center gap-1">
                          {s.keys.map((k, j) => (
                            <kbd
                              key={j}
                              className="px-2 py-0.5 rounded-md text-xs font-mono font-semibold"
                              style={{
                                backgroundColor: "var(--muted)",
                                border: `1px solid ${border}`,
                                color: "var(--muted-foreground)",
                              }}
                            >
                              {k}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    className="mt-4 p-4 rounded-2xl flex items-start gap-3"
                    style={{ backgroundColor: "var(--primary-tint)" }}
                  >
                    <Keyboard size={15} style={{ color: "var(--primary)", marginTop: 2 }} />
                    <p className="text-xs leading-relaxed" style={{ color: "var(--primary-strong)" }}>
                      On Windows/Linux, replace <kbd className="px-1 rounded font-mono" style={{ backgroundColor: "var(--primary-container)" }}>⌘</kbd> with <kbd className="px-1 rounded font-mono" style={{ backgroundColor: "var(--primary-container)" }}>Ctrl</kbd>.
                    </p>
                  </div>
                </>
              )}

              {/* FAQ */}
              {activeTab === "faq" && (
                <>
                  <p className="text-xs mb-4" style={{ color: textSub }}>
                    Frequently asked questions about DecisionOS AI.
                  </p>
                  <div className="space-y-2">
                    {faqs.map((f, i) => (
                      <FAQItem key={i} q={f.q} a={f.a} />
                    ))}
                  </div>
                  <div
                    className="mt-4 p-4 rounded-2xl flex items-center gap-3"
                    style={{ backgroundColor: "var(--page)", border: `1px solid ${border}` }}
                  >
                    <ExternalLink size={15} style={{ color: "var(--primary)" }} />
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: text }}>Need more help?</p>
                      <p className="text-xs" style={{ color: textSub }}>Visit our full documentation at docs.decisionos.ai</p>
                    </div>
                    <button
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl"
                      style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
                    >
                      Open Docs
                    </button>
                  </div>
                </>
              )}

              {/* WHAT'S NEW */}
              {activeTab === "whats-new" && (
                <>
                  {releases.map((rel, ri) => (
                    <div key={ri} className="mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm font-bold" style={{ color: text }}>{rel.version}</span>
                        {rel.badge && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-semibold"
                            style={{ backgroundColor: alpha(rel.badgeColor, "22"), color: rel.badgeColor }}
                          >
                            {rel.badge}
                          </span>
                        )}
                        <span className="text-xs ml-auto" style={{ color: textSub }}>{rel.date}</span>
                      </div>
                      <div
                        className="rounded-2xl overflow-hidden"
                        style={{ border: `1px solid ${border}` }}
                      >
                        {rel.items.map((item, i) => {
                          const Icon = item.icon;
                          return (
                            <div
                              key={i}
                              className="flex items-start gap-3 px-4 py-3"
                              style={{
                                borderBottom: i < rel.items.length - 1 ? `1px solid ${border}` : "none",
                                backgroundColor: surface,
                              }}
                            >
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                                style={{ backgroundColor: "var(--primary-container)" }}
                              >
                                <Icon size={13} style={{ color: "var(--primary)" }} />
                              </div>
                              <p className="text-sm leading-relaxed" style={{ color: textSub }}>{item.text}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <div
                    className="p-4 rounded-2xl flex items-center gap-3 mt-2"
                    style={{ background: "linear-gradient(135deg, var(--primary), var(--ai))" }}
                  >
                    <Play size={16} color="var(--primary-foreground)" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-primary-foreground">Watch the v2.4 walkthrough</p>
                      <p className="text-xs text-primary-foreground/70">3-minute overview of new features</p>
                    </div>
                    <ArrowRight size={16} color="var(--primary-foreground)" />
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div
          className="px-5 py-3 flex items-center justify-between flex-shrink-0"
          style={{ borderTop: `1px solid ${border}`, backgroundColor: surface }}
        >
          <p className="text-xs" style={{ color: textSub }}>DecisionOS AI · Enterprise v2.4.0</p>
          <button className="text-xs font-medium" style={{ color: "var(--primary)" }}>
            Send feedback →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
