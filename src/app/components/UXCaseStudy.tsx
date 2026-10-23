import { useState } from "react";
import { alpha } from "../lib/color";
import {
  ChevronLeft, ChevronRight, Brain, Users, TrendingUp, Target,
  Lightbulb, BarChart2, Layers, Zap, Shield, CheckCircle2,
  ArrowRight, Eye, MessageSquare, GitBranch, Activity
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

const slides = [
  "cover", "problem", "research", "users", "heuristics",
  "ia", "design-system", "flows", "screens", "ai-model", "metrics", "future",
];

const SlideProgress = ({ current, total }: { current: number; total: number }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className="transition-all rounded-full"
        style={{
          width: i === current ? 20 : 6,
          height: 6,
          backgroundColor: i === current ? "var(--primary)" : i < current ? "var(--primary-soft)" : "var(--surface-track)",
        }}
      />
    ))}
  </div>
);

const SectionTag = ({ label, color = "var(--primary)" }: { label: string; color?: string }) => (
  <span
    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-4"
    style={{ backgroundColor: alpha(color, "15"), color, border: `1px solid ${alpha(color, "30")}` }}
  >
    {label}
  </span>
);

const MetricCard = ({ value, label, desc, color = "var(--primary)" }: { value: string; label: string; desc: string; color?: string }) => (
  <div
    className="p-5 rounded-2xl text-center"
    style={{ border: "1px solid var(--surface-track)", backgroundColor: "var(--card)" }}
  >
    <p className="text-4xl font-black mb-1" style={{ color }}>{value}</p>
    <p className="text-sm font-semibold mb-1" style={{ color: "var(--foreground)" }}>{label}</p>
    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{desc}</p>
  </div>
);

const competitorData = [
  { tool: "Power BI", ai: 4, ux: 6, workflow: 5, decision: 4, collab: 6 },
  { tool: "Tableau", ai: 5, ux: 7, workflow: 4, decision: 3, collab: 5 },
  { tool: "ThoughtSpot", ai: 8, ux: 7, workflow: 5, decision: 6, collab: 5 },
  { tool: "Looker", ai: 6, ux: 6, workflow: 5, decision: 5, collab: 6 },
  { tool: "DecisionOS AI", ai: 10, ux: 9, workflow: 9, decision: 10, collab: 8 },
];

const radarData = [
  { subject: "AI Intelligence", A: 97, B: 52 },
  { subject: "Decision Focus", A: 95, B: 48 },
  { subject: "UX Simplicity", A: 91, B: 65 },
  { subject: "Collaboration", A: 88, B: 61 },
  { subject: "Predictive Power", A: 93, B: 55 },
  { subject: "Accessibility", A: 90, B: 70 },
];

export function UXCaseStudy() {
  const [slide, setSlide] = useState(0);
  const total = slides.length;

  const prev = () => setSlide((s) => Math.max(0, s - 1));
  const next = () => setSlide((s) => Math.min(total - 1, s + 1));

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: "var(--page)" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-3 bg-card flex-shrink-0"
        style={{ borderBottom: "1px solid var(--surface-track)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--primary), var(--info))" }}>
            <Brain size={16} color="var(--primary-foreground)" />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>DecisionOS AI — UX Case Study</p>
            <p className="text-xs" style={{ color: "var(--outline)" }}>Enterprise B2B SaaS · AI-Native Decision Intelligence Platform</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <SlideProgress current={slide} total={total} />
          <span className="text-xs" style={{ color: "var(--outline)" }}>{slide + 1} / {total}</span>
        </div>
      </div>

      {/* Slide Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="min-h-full"
          >

            {/* COVER */}
            {slide === 0 && (
              <div
                className="flex flex-col items-center justify-center min-h-full p-8 text-center"
                style={{ background: "linear-gradient(135deg, var(--on-primary-container) 0%, var(--primary) 50%, var(--info) 100%)" }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: "color-mix(in srgb, var(--primary-foreground) 15%, transparent)" }}
                >
                  <Brain size={32} color="var(--primary-foreground)" />
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: "color-mix(in srgb, var(--primary-foreground) 10%, transparent)" }}>
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-primary-foreground/80 text-xs">UX Case Study · B2B SaaS</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-primary-foreground mb-4 leading-tight">
                  DecisionOS AI
                </h1>
                <p className="text-xl text-primary-foreground/80 mb-3 font-light">
                  AI-Powered Enterprise Decision Intelligence Platform
                </p>
                <p className="text-primary-foreground/60 max-w-xl mb-10 text-sm leading-relaxed">
                  A complete end-to-end UX case study documenting the research, design process,
                  information architecture, and high-fidelity UI for a next-generation enterprise BI platform.
                </p>
                <div className="grid grid-cols-3 gap-4 max-w-md w-full">
                  {[
                    { label: "Platform", value: "Enterprise B2B SaaS" },
                    { label: "Users", value: "C-Suite + Analysts" },
                    { label: "Design Scope", value: "12 Core Screens" },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 rounded-xl text-center" style={{ backgroundColor: "color-mix(in srgb, var(--primary-foreground) 10%, transparent)" }}>
                      <p className="text-primary-foreground text-sm font-bold">{value}</p>
                      <p className="text-primary-foreground/50 text-xs">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROBLEM */}
            {slide === 1 && (
              <div className="p-6 lg:p-12 max-w-5xl mx-auto">
                <SectionTag label="01 · Problem Statement" />
                <h2 className="text-3xl font-black mb-3" style={{ color: "var(--foreground)" }}>
                  Enterprise Teams Are Drowning in Data,<br />
                  <span style={{ color: "var(--primary)" }}>Yet Starving for Decisions.</span>
                </h2>
                <p className="text-base mb-8 max-w-2xl" style={{ color: "var(--muted-foreground)" }}>
                  Modern enterprises have access to more data than ever, but decision-making remains painfully slow.
                  Traditional BI tools visualize data — they don't help people decide.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                  {[
                    { problem: "Dashboard Overload", impact: "72% of executives ignore most dashboards", icon: "📊", color: "var(--error)" },
                    { problem: "Fragmented Data", impact: "Avg enterprise uses 11+ disconnected tools", icon: "🔗", color: "var(--warning)" },
                    { problem: "Slow Decisions", impact: "4.7 weeks avg time to act on insights", icon: "⏱", color: "var(--error)" },
                    { problem: "Manual Reporting", impact: "Analysts spend 80% of time preparing data", icon: "📝", color: "var(--warning)" },
                    { problem: "No Predictive Insight", impact: "95% of BI tools are purely backward-looking", icon: "🔮", color: "var(--ai)" },
                    { problem: "Poor Collaboration", impact: "Decisions made in silos, not consensus", icon: "🤝", color: "var(--warning)" },
                  ].map(({ problem, impact, icon, color }) => (
                    <div
                      key={problem}
                      className="p-4 rounded-2xl"
                      style={{ backgroundColor: "var(--card)", border: `1px solid ${alpha(color, "22")}` }}
                    >
                      <div className="text-2xl mb-2">{icon}</div>
                      <p className="font-bold text-sm mb-1" style={{ color: "var(--foreground)" }}>{problem}</p>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{impact}</p>
                    </div>
                  ))}
                </div>

                <div
                  className="p-6 rounded-2xl"
                  style={{ background: "linear-gradient(135deg, var(--primary-container), var(--primary-tint))" }}
                >
                  <p className="text-sm font-bold mb-2" style={{ color: "var(--primary)" }}>Design Challenge</p>
                  <p className="text-lg font-semibold" style={{ color: "var(--on-primary-container)" }}>
                    "How might we transform raw enterprise data into proactive, AI-powered decisions
                    that non-technical executives can act on in under 3 minutes?"
                  </p>
                </div>
              </div>
            )}

            {/* RESEARCH */}
            {slide === 2 && (
              <div className="p-6 lg:p-12 max-w-5xl mx-auto">
                <SectionTag label="02 · Market & Competitor Research" />
                <h2 className="text-3xl font-black mb-6" style={{ color: "var(--foreground)" }}>
                  Identifying the <span style={{ color: "var(--primary)" }}>Competitive Gap</span>
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Competitor Table */}
                  <div className="bg-card rounded-2xl overflow-hidden" style={{ border: "1px solid var(--surface-track)" }}>
                    <div className="p-4" style={{ borderBottom: "1px solid var(--surface-track)" }}>
                      <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>Competitor Analysis</p>
                    </div>
                    <table className="w-full text-xs">
                      <thead>
                        <tr style={{ backgroundColor: "var(--page)" }}>
                          {["Platform", "AI", "UX", "Workflow", "Decision", "Collab"].map((h) => (
                            <th key={h} className="px-3 py-2 text-left font-semibold" style={{ color: "var(--outline)" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {competitorData.map((row) => (
                          <tr
                            key={row.tool}
                            style={{
                              borderTop: "1px solid var(--muted)",
                              backgroundColor: row.tool === "DecisionOS AI" ? "var(--primary-tint)" : "var(--card)",
                            }}
                          >
                            <td className="px-3 py-2 font-semibold" style={{ color: row.tool === "DecisionOS AI" ? "var(--primary)" : "var(--muted-foreground)" }}>
                              {row.tool === "DecisionOS AI" ? "★ " + row.tool : row.tool}
                            </td>
                            {["ai", "ux", "workflow", "decision", "collab"].map((key) => {
                              const val = row[key as keyof typeof row] as number;
                              return (
                                <td key={key} className="px-3 py-2">
                                  <div className="flex items-center gap-1">
                                    <div
                                      className="h-1.5 rounded-full"
                                      style={{
                                        width: `${val * 10}%`,
                                        backgroundColor: row.tool === "DecisionOS AI" ? "var(--primary)" : "var(--outline-variant)",
                                      }}
                                    />
                                    <span style={{ color: "var(--outline)" }}>{val}</span>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Radar */}
                  <div className="bg-card rounded-2xl p-5" style={{ border: "1px solid var(--surface-track)" }}>
                    <p className="font-semibold text-sm mb-2" style={{ color: "var(--foreground)" }}>DecisionOS vs Industry Average</p>
                    <ResponsiveContainer width="100%" height={250}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="var(--surface-track)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                        <Radar dataKey="B" stroke="var(--outline-variant)" fill="var(--outline-variant)" fillOpacity={0.3} name="Industry Avg" isAnimationActive={false} />
                        <Radar dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.2} name="DecisionOS AI" strokeWidth={2} isAnimationActive={false} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div
                  className="p-5 rounded-2xl"
                  style={{ backgroundColor: "var(--success-container)", border: "1px solid var(--success-container)" }}
                >
                  <p className="font-semibold text-sm mb-2" style={{ color: "var(--success)" }}>Opportunity Gap Identified</p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--on-success-container)" }}>
                    No existing platform combines AI-first decision intelligence, natural language analytics,
                    workflow orchestration, and executive-friendly UX into a unified platform.
                    DecisionOS AI uniquely occupies this whitespace.
                  </p>
                </div>
              </div>
            )}

            {/* USERS */}
            {slide === 3 && (
              <div className="p-6 lg:p-12 max-w-5xl mx-auto">
                <SectionTag label="03 · User Research & Personas" color="var(--success)" />
                <h2 className="text-3xl font-black mb-6" style={{ color: "var(--foreground)" }}>
                  Understanding <span style={{ color: "var(--success)" }}>Who Decides</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                  {[
                    {
                      name: "Victoria Chen", role: "CEO / Executive Sponsor",
                      age: "47", dept: "C-Suite", avatar: "VC",
                      goals: ["Quick strategic overviews", "Understand top risks immediately", "Confident, data-backed decisions"],
                      pains: ["Too much time on dashboards", "Can't spot patterns across systems", "Reliance on analyst prep time"],
                      color: "var(--primary)",
                    },
                    {
                      name: "Marcus Rodriguez", role: "VP Operations",
                      age: "38", dept: "Operations", avatar: "MR",
                      goals: ["Real-time operational visibility", "Predict supply chain issues early", "Cross-team alignment"],
                      pains: ["Manual incident reports", "Disconnected ops tools", "Reactive vs. proactive management"],
                      color: "var(--success)",
                    },
                    {
                      name: "Priya Sharma", role: "Business Intelligence Analyst",
                      age: "31", dept: "Data & Analytics", avatar: "PS",
                      goals: ["Automate repetitive reporting", "Self-serve analytics for business teams", "ML-driven insights"],
                      pains: ["Spending weeks on manual models", "Business teams constantly asking for custom reports", "Legacy BI tools"],
                      color: "var(--ai)",
                    },
                  ].map((persona) => (
                    <div
                      key={persona.name}
                      className="bg-card rounded-2xl p-5"
                      style={{ border: `1px solid ${alpha(persona.color, "22")}` }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-primary-foreground font-bold"
                          style={{ background: `linear-gradient(135deg, ${persona.color}, ${alpha(persona.color, "CC")})` }}
                        >
                          {persona.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{persona.name}</p>
                          <p className="text-xs" style={{ color: persona.color }}>{persona.role}</p>
                          <p className="text-xs" style={{ color: "var(--outline)" }}>Age {persona.age} · {persona.dept}</p>
                        </div>
                      </div>
                      <div className="mb-3">
                        <p className="text-xs font-semibold mb-1.5" style={{ color: "var(--success)" }}>Goals</p>
                        {persona.goals.map((g) => (
                          <div key={g} className="flex items-start gap-1.5 mb-1">
                            <CheckCircle2 size={11} style={{ color: "var(--success)", marginTop: 1, flexShrink: 0 }} />
                            <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{g}</p>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-semibold mb-1.5" style={{ color: "var(--error)" }}>Pain Points</p>
                        {persona.pains.map((p) => (
                          <div key={p} className="flex items-start gap-1.5 mb-1">
                            <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: "var(--error)" }} />
                            <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{p}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* User Pain Points Table */}
                <div className="bg-card rounded-2xl overflow-hidden" style={{ border: "1px solid var(--surface-track)" }}>
                  <div className="p-4" style={{ borderBottom: "1px solid var(--surface-track)" }}>
                    <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>User Pain Point Impact Matrix</p>
                  </div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ backgroundColor: "var(--page)" }}>
                        <th className="text-left px-4 py-2 font-semibold" style={{ color: "var(--muted-foreground)" }}>Pain Point</th>
                        <th className="text-left px-4 py-2 font-semibold" style={{ color: "var(--muted-foreground)" }}>Business Impact</th>
                        <th className="px-4 py-2 font-semibold text-center" style={{ color: "var(--muted-foreground)" }}>Severity</th>
                        <th className="px-4 py-2 font-semibold text-center" style={{ color: "var(--muted-foreground)" }}>Our Solution</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Dashboard Overload", "Slow decisions, cognitive fatigue", "critical", "AI Executive Summary"],
                        ["Manual Reporting", "40% analyst time waste", "high", "Auto-generated AI reports"],
                        ["Fragmented Data", "Cross-team misalignment", "critical", "Unified data integrations"],
                        ["No Predictive Insight", "Reactive business management", "high", "Predictive Analytics engine"],
                        ["Poor Collaboration", "Operational inefficiency", "medium", "Decision Workflow + Collab"],
                      ].map(([pain, impact, sev, solution]) => (
                        <tr key={pain} className="hover:bg-page" style={{ borderTop: "1px solid var(--muted)" }}>
                          <td className="px-4 py-2.5 font-medium" style={{ color: "var(--foreground)" }}>{pain}</td>
                          <td className="px-4 py-2.5" style={{ color: "var(--muted-foreground)" }}>{impact}</td>
                          <td className="px-4 py-2.5 text-center">
                            <span
                              className="px-2 py-0.5 rounded-full font-semibold"
                              style={{
                                backgroundColor: sev === "critical" ? "var(--error-container)" : sev === "high" ? "var(--warning-container)" : "var(--primary-container)",
                                color: sev === "critical" ? "var(--error)" : sev === "high" ? "var(--warning)" : "var(--primary)",
                              }}
                            >
                              {sev}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <span className="text-xs font-medium" style={{ color: "var(--success)" }}>{solution}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* HEURISTICS */}
            {slide === 4 && (
              <div className="p-6 lg:p-12 max-w-5xl mx-auto">
                <SectionTag label="04 · UX Heuristics Applied" color="var(--warning)" />
                <h2 className="text-3xl font-black mb-6" style={{ color: "var(--foreground)" }}>
                  Design Decisions Grounded in <span style={{ color: "var(--warning)" }}>Cognitive Science</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    {
                      law: "Nielsen's 10 Heuristics", icon: "🎯",
                      examples: [
                        { heuristic: "Visibility of System Status", application: "Real-time AI processing indicators, live data sync status badges" },
                        { heuristic: "Error Prevention", application: "AI confidence scores on every recommendation to prevent overreliance" },
                        { heuristic: "Aesthetic & Minimal Design", application: "Clean card-based layout, progressive disclosure of complex data" },
                      ],
                      color: "var(--primary)",
                    },
                    {
                      law: "Hick's Law", icon: "⚡",
                      examples: [
                        { heuristic: "Reduce decision choices", application: "AI pre-ranks insights by urgency — 3 items max per summary card" },
                        { heuristic: "Smart defaults", application: "AI auto-selects recommended action so users can approve, not choose" },
                      ],
                      color: "var(--success)",
                    },
                    {
                      law: "Miller's Law", icon: "🧠",
                      examples: [
                        { heuristic: "7±2 rule", application: "Navigation limited to 8 core modules, grouped by workflow stage" },
                        { heuristic: "Chunking", application: "KPI cards limited to 5, insights grouped by severity not type" },
                      ],
                      color: "var(--ai)",
                    },
                    {
                      law: "Progressive Disclosure", icon: "📐",
                      examples: [
                        { heuristic: "Show critical first", application: "Executive summary → KPIs → detailed charts → raw data" },
                        { heuristic: "Expand on demand", application: "Insight cards collapsed by default, expand to show root cause & data" },
                      ],
                      color: "var(--warning)",
                    },
                    {
                      law: "Fitts's Law", icon: "🖱",
                      examples: [
                        { heuristic: "Target size", application: "CTAs minimum 44px touch targets, primary actions always top-right" },
                        { heuristic: "Proximity", application: "Related actions grouped together, approve button next to AI recommendation" },
                      ],
                      color: "var(--info)",
                    },
                    {
                      law: "AI Transparency Design", icon: "🤖",
                      examples: [
                        { heuristic: "Explainability", application: "Every AI insight shows confidence %, data sources, and 'Explain AI' button" },
                        { heuristic: "Human oversight", application: "AI assists but humans always have final approval in decision workflows" },
                      ],
                      color: "var(--error)",
                    },
                  ].map(({ law, icon, examples, color }) => (
                    <div
                      key={law}
                      className="bg-card rounded-2xl p-5"
                      style={{ border: `1px solid ${alpha(color, "22")}` }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">{icon}</span>
                        <p className="font-bold text-sm" style={{ color: "var(--foreground)" }}>{law}</p>
                      </div>
                      {examples.map(({ heuristic, application }) => (
                        <div key={heuristic} className="mb-2.5 last:mb-0">
                          <p className="text-xs font-semibold" style={{ color }}>{heuristic}</p>
                          <p className="text-xs leading-relaxed mt-0.5" style={{ color: "var(--muted-foreground)" }}>{application}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* IA */}
            {slide === 5 && (
              <div className="p-6 lg:p-12 max-w-5xl mx-auto">
                <SectionTag label="05 · Information Architecture" color="var(--ai)" />
                <h2 className="text-3xl font-black mb-6" style={{ color: "var(--foreground)" }}>
                  Organizing Intelligence for <span style={{ color: "var(--ai)" }}>Fast Navigation</span>
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-semibold mb-4" style={{ color: "var(--muted-foreground)" }}>Sitemap — Main Navigation Architecture</p>
                    <div className="space-y-2">
                      {[
                        { level: 0, label: "DecisionOS AI Platform", icon: Brain, color: "var(--primary)" },
                        { level: 1, label: "Executive Dashboard", icon: BarChart2, color: "var(--primary)" },
                        { level: 2, label: "AI Executive Summary", icon: Zap, color: "var(--ai)" },
                        { level: 2, label: "KPI Command Center", icon: Target, color: "var(--ai)" },
                        { level: 2, label: "Risk Heatmap", icon: Shield, color: "var(--ai)" },
                        { level: 1, label: "AI Copilot", icon: MessageSquare, color: "var(--success)" },
                        { level: 1, label: "Predictive Analytics", icon: TrendingUp, color: "var(--warning)" },
                        { level: 1, label: "Decision Workflows", icon: GitBranch, color: "var(--error)" },
                        { level: 1, label: "AI Insights Center", icon: Lightbulb, color: "var(--ai)" },
                        { level: 1, label: "Reports & Analytics", icon: Layers, color: "var(--info)" },
                      ].map(({ level, label, icon: Icon, color }) => (
                        <div
                          key={label}
                          className="flex items-center gap-2 py-2 px-3 rounded-xl"
                          style={{
                            marginLeft: level * 20,
                            backgroundColor: level === 0 ? "var(--primary-tint)" : "var(--card)",
                            border: "1px solid var(--surface-track)",
                          }}
                        >
                          <Icon size={13} style={{ color, flexShrink: 0 }} />
                          <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{label}</span>
                          {level === 0 && <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--primary-container)", color: "var(--primary)" }}>Root</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-4" style={{ color: "var(--muted-foreground)" }}>User Flow — Executive Decision Journey</p>
                    <div className="space-y-2">
                      {[
                        { step: "1", label: "Login & Authentication", detail: "SSO or email/password", icon: "🔐" },
                        { step: "2", label: "AI Executive Summary", detail: "Top 3 insights surfaced automatically", icon: "🧠" },
                        { step: "3", label: "Anomaly Identified", detail: "Risk or opportunity flagged by AI", icon: "⚡" },
                        { step: "4", label: "Root Cause Analysis", detail: "AI Copilot drills into the data", icon: "🔍" },
                        { step: "5", label: "Scenario Simulation", detail: "What-if modeling in Predictive Analytics", icon: "📊" },
                        { step: "6", label: "Decision Created", detail: "Workflow initiated with AI recommendation", icon: "✅" },
                        { step: "7", label: "Team Collaboration", detail: "Comments, approvals, stakeholder input", icon: "🤝" },
                        { step: "8", label: "Impact Tracking", detail: "AI measures post-decision outcomes", icon: "📈" },
                      ].map(({ step, label, detail, icon }) => (
                        <div key={step} className="flex items-center gap-3">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, var(--primary), var(--info))" }}
                          >
                            {step}
                          </div>
                          <div className="flex-1 flex items-center gap-2 p-2.5 rounded-xl bg-card" style={{ border: "1px solid var(--surface-track)" }}>
                            <span>{icon}</span>
                            <div>
                              <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{label}</p>
                              <p className="text-xs" style={{ color: "var(--outline)" }}>{detail}</p>
                            </div>
                          </div>
                          {Number(step) < 8 && (
                            <div className="w-0.5 h-3 mx-auto" style={{ backgroundColor: "var(--primary-container)", position: "absolute", marginTop: 32 }} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DESIGN SYSTEM */}
            {slide === 6 && (
              <div className="p-6 lg:p-12 max-w-5xl mx-auto">
                <SectionTag label="06 · Design System" color="var(--info)" />
                <h2 className="text-3xl font-black mb-6" style={{ color: "var(--foreground)" }}>
                  Google Material 3 + <span style={{ color: "var(--info)" }}>Enterprise Tokens</span>
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Color Palette */}
                  <div className="bg-card rounded-2xl p-5" style={{ border: "1px solid var(--surface-track)" }}>
                    <p className="font-semibold text-sm mb-4" style={{ color: "var(--foreground)" }}>Color System (GM3 Tokens)</p>
                    <div className="space-y-3">
                      {[
                        { label: "Primary (GM3 --primary)", colors: ["var(--on-primary-container)", "var(--primary-strong)", "var(--primary)", "var(--primary-soft)", "var(--primary-container)", "var(--primary-tint)"] },
                        { label: "Success (--success)", colors: ["var(--on-success-container)", "var(--success)", "var(--success-container)"] },
                        { label: "Warning (--warning)", colors: ["var(--on-warning-container)", "var(--warning)", "var(--warning-container)"] },
                        { label: "Error (--error)", colors: ["var(--on-error-container)", "var(--error)", "var(--error-soft)", "var(--error-container)"] },
                      ].map(({ label, colors }) => (
                        <div key={label}>
                          <p className="text-xs mb-1.5" style={{ color: "var(--outline)" }}>{label}</p>
                          <div className="flex gap-1">
                            {colors.map((c) => (
                              <div key={c} className="flex-1 h-8 rounded-lg group relative cursor-pointer" style={{ backgroundColor: c }}>
                                <span className="absolute inset-0 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 font-mono" style={{ color: c === "var(--primary-container)" || c === "var(--success-container)" || c === "var(--warning-container)" || c === "var(--error-container)" ? "var(--foreground)" : "var(--card)" }}>
                                  {c}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Typography + Components */}
                  <div className="space-y-4">
                    <div className="bg-card rounded-2xl p-5" style={{ border: "1px solid var(--surface-track)" }}>
                      <p className="font-semibold text-sm mb-4" style={{ color: "var(--foreground)" }}>Typography — Google Sans (GM3 type scale)</p>
                      {[
                        { name: "Display", size: "var(--text-5xl)", weight: 500, sample: "DecisionOS AI" },
                        { name: "Heading 1", size: "var(--text-2xl)", weight: 500, sample: "Executive Dashboard" },
                        { name: "Heading 2", size: "var(--text-lg)", weight: 500, sample: "AI Insights Summary" },
                        { name: "Body", size: "var(--text-sm)", weight: 400, sample: "Revenue increased 12% this quarter" },
                        { name: "Caption", size: "var(--text-xs)", weight: 500, sample: "AI Confidence: 94% · 2 min ago" },
                      ].map(({ name, size, weight, sample }) => (
                        <div key={name} className="flex items-center gap-3 py-2" style={{ borderBottom: "1px solid var(--muted)" }}>
                          <div className="w-20 flex-shrink-0">
                            <p className="text-xs" style={{ color: "var(--outline)" }}>{name}</p>
                            <p className="text-xs font-mono" style={{ color: "var(--outline)" }}>{size} · {weight}</p>
                          </div>
                          <p style={{ fontSize: size, fontWeight: weight, color: "var(--foreground)", lineHeight: 1.3 }}>{sample}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-card rounded-2xl p-5" style={{ border: "1px solid var(--surface-track)" }}>
                      <p className="font-semibold text-sm mb-3" style={{ color: "var(--foreground)" }}>Component Tokens</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { token: "Border Radius", value: "12px / 20px", note: "Cards / Modals" },
                          { token: "Spacing Unit", value: "8pt grid", note: "8, 16, 24, 32px" },
                          { token: "Shadow", value: "0 1px 8px", note: "color-mix(in srgb, var(--scrim) 8%, transparent)" },
                          { token: "Transition", value: "0.2s ease", note: "All interactions" },
                        ].map(({ token, value, note }) => (
                          <div key={token} className="p-2.5 rounded-xl" style={{ backgroundColor: "var(--page)" }}>
                            <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{token}</p>
                            <p className="text-xs font-mono" style={{ color: "var(--primary)" }}>{value}</p>
                            <p className="text-xs" style={{ color: "var(--outline)" }}>{note}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SCREENS OVERVIEW */}
            {slide === 7 && (
              <div className="p-6 lg:p-12 max-w-5xl mx-auto">
                <SectionTag label="07 · Screen Architecture" color="var(--error)" />
                <h2 className="text-3xl font-black mb-6" style={{ color: "var(--foreground)" }}>
                  12 Core Screens, <span style={{ color: "var(--error)" }}>Zero Friction</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    { screen: "Login & Auth", desc: "SSO + email, compliance badges", icon: "🔐", color: "var(--ai)" },
                    { screen: "Executive Dashboard", desc: "AI summary, KPIs, risk heatmap", icon: "📊", color: "var(--primary)" },
                    { screen: "AI Copilot", desc: "Conversational analytics", icon: "🤖", color: "var(--success)" },
                    { screen: "Predictive Analytics", desc: "Forecasting + what-if simulation", icon: "📈", color: "var(--warning)" },
                    { screen: "Decision Workflows", desc: "Kanban + approval engine", icon: "✅", color: "var(--error)" },
                    { screen: "AI Insights Center", desc: "Risk, opportunity, anomaly cards", icon: "💡", color: "var(--ai)" },
                    { screen: "Reports Builder", desc: "Drag-drop + presentation mode", icon: "📄", color: "var(--info)" },
                    { screen: "Alerts Center", desc: "Smart grouped notifications", icon: "🔔", color: "var(--error)" },
                    { screen: "Team Collaboration", desc: "Slack-style + AI summaries", icon: "💬", color: "var(--primary)" },
                    { screen: "Data Integrations", desc: "12+ enterprise connectors", icon: "🔗", color: "var(--success)" },
                    { screen: "Governance", desc: "RBAC, audit logs, compliance", icon: "🛡", color: "var(--ai)" },
                    { screen: "Admin Panel", desc: "Users, AI models, billing", icon: "⚙️", color: "var(--muted-foreground)" },
                  ].map(({ screen, desc, icon, color }) => (
                    <div
                      key={screen}
                      className="p-4 rounded-2xl bg-card cursor-pointer transition-all hover:shadow-md"
                      style={{ border: `1px solid ${alpha(color, "22")}` }}
                    >
                      <div className="text-2xl mb-2">{icon}</div>
                      <p className="text-sm font-bold mb-1" style={{ color: "var(--foreground)" }}>{screen}</p>
                      <p className="text-xs" style={{ color: "var(--outline)" }}>{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI MODEL */}
            {slide === 8 && (
              <div className="p-6 lg:p-12 max-w-5xl mx-auto">
                <SectionTag label="08 · AI Interaction Model" color="var(--ai)" />
                <h2 className="text-3xl font-black mb-6" style={{ color: "var(--foreground)" }}>
                  AI That Earns <span style={{ color: "var(--ai)" }}>Human Trust</span>
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                      Enterprise AI adoption fails when users don't trust the outputs.
                      DecisionOS AI solves this through a multi-layered AI transparency framework.
                    </p>
                    {[
                      {
                        principle: "Confidence Transparency",
                        detail: "Every AI recommendation displays a percentage confidence score and methodology",
                        icon: "📊", color: "var(--primary)",
                      },
                      {
                        principle: "Data Source Citation",
                        detail: "AI cites all data sources used to generate an insight, just like academic references",
                        icon: "📖", color: "var(--success)",
                      },
                      {
                        principle: "Explainability Layer",
                        detail: "'Explain AI' button on every insight expands the reasoning chain in plain language",
                        icon: "🔍", color: "var(--ai)",
                      },
                      {
                        principle: "Human Override",
                        detail: "Users can edit, dismiss, or escalate any AI recommendation — AI never auto-executes",
                        icon: "🛡", color: "var(--warning)",
                      },
                      {
                        principle: "Model Drift Monitoring",
                        detail: "Admin panel alerts when ML model accuracy drops below threshold",
                        icon: "⚠️", color: "var(--error)",
                      },
                    ].map(({ principle, detail, icon, color }) => (
                      <div
                        key={principle}
                        className="flex gap-3 p-4 rounded-2xl bg-card"
                        style={{ border: `1px solid ${alpha(color, "22")}` }}
                      >
                        <span className="text-xl flex-shrink-0">{icon}</span>
                        <div>
                          <p className="text-sm font-bold mb-1" style={{ color }}>{principle}</p>
                          <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div
                      className="p-5 rounded-2xl mb-4"
                      style={{ background: "linear-gradient(135deg, var(--primary), var(--ai))" }}
                    >
                      <p className="text-xs text-primary-foreground/70 mb-2 font-semibold uppercase tracking-wider">AI Confidence Model</p>
                      <div className="space-y-3">
                        {[
                          { range: "90-100%", label: "High Confidence", desc: "Act with confidence", color: "var(--primary-soft)" },
                          { range: "75-89%", label: "Medium Confidence", desc: "Review before acting", color: "var(--warning)" },
                          { range: "60-74%", label: "Low Confidence", desc: "Verify with additional data", color: "var(--error-soft)" },
                          { range: "<60%", label: "Insufficient Data", desc: "More data collection needed", color: "var(--error-soft)" },
                        ].map(({ range, label, desc, color }) => (
                          <div
                            key={range}
                            className="flex items-center gap-3 p-3 rounded-xl"
                            style={{ backgroundColor: "color-mix(in srgb, var(--primary-foreground) 10%, transparent)" }}
                          >
                            <span className="text-sm font-bold w-16" style={{ color }}>{range}</span>
                            <div>
                              <p className="text-xs font-semibold text-primary-foreground">{label}</p>
                              <p className="text-xs text-primary-foreground/60">{desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-card rounded-2xl p-4" style={{ border: "1px solid var(--surface-track)" }}>
                      <p className="text-xs font-semibold mb-2" style={{ color: "var(--foreground)" }}>AI Interaction Loop</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {["Data Ingestion", "→", "ML Processing", "→", "Insight Generation", "→", "Human Review", "→", "Action + Tracking"].map((step, i) => (
                          <span
                            key={i}
                            className={step === "→" ? "text-outline font-bold" : "text-xs px-2 py-1 rounded-full font-medium"}
                            style={step !== "→" ? { backgroundColor: "var(--primary-container)", color: "var(--primary)" } : {}}
                          >
                            {step}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Screens */}
            {slide === 9 && (
              <div className="p-6 lg:p-12 max-w-5xl mx-auto">
                <SectionTag label="09 · Accessibility & WCAG AA" color="var(--success)" />
                <h2 className="text-3xl font-black mb-6" style={{ color: "var(--foreground)" }}>
                  Built for <span style={{ color: "var(--success)" }}>Everyone</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[
                    { check: "Color Contrast AA", detail: "All text meets 4.5:1 minimum ratio", pass: true },
                    { check: "Keyboard Navigation", detail: "Full tab-order support, skip links", pass: true },
                    { check: "Screen Reader Labels", detail: "ARIA labels on all interactive elements", pass: true },
                    { check: "Focus Indicators", detail: "Visible 3px focus ring on all elements", pass: true },
                    { check: "Scalable Typography", detail: "Supports 200% browser zoom", pass: true },
                    { check: "Motion Sensitivity", detail: "Respects prefers-reduced-motion", pass: true },
                    { check: "Color Independence", detail: "No info conveyed by color alone", pass: true },
                    { check: "Alt Text for Charts", detail: "All data visualizations have text alternatives", pass: true },
                    { check: "Touch Targets", detail: "Minimum 44×44px touch areas", pass: true },
                  ].map(({ check, detail, pass }) => (
                    <div
                      key={check}
                      className="flex gap-3 p-4 rounded-2xl bg-card"
                      style={{ border: "1px solid var(--surface-track)" }}
                    >
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--success-container)" }}>
                        <CheckCircle2 size={14} style={{ color: "var(--success)" }} />
                      </div>
                      <div>
                        <p className="text-xs font-bold" style={{ color: "var(--foreground)" }}>{check}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* METRICS */}
            {slide === 10 && (
              <div className="p-6 lg:p-12 max-w-5xl mx-auto">
                <SectionTag label="10 · Success Metrics & Impact" color="var(--success)" />
                <h2 className="text-3xl font-black mb-6" style={{ color: "var(--foreground)" }}>
                  Measuring <span style={{ color: "var(--success)" }}>Real-World Impact</span>
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  <MetricCard value="40%" label="Faster Decision-Making" desc="Time from insight to action" color="var(--primary)" />
                  <MetricCard value="60%" label="Dashboard Engagement" desc="More users actively using BI" color="var(--success)" />
                  <MetricCard value="50%" label="AI Adoption Rate" desc="Recommendations acted upon" color="var(--ai)" />
                  <MetricCard value="35%" label="Analyst Dependency" desc="Reduction in custom reports" color="var(--warning)" />
                  <MetricCard value="45%" label="Faster Response" desc="Operational incident handling" color="var(--info)" />
                  <MetricCard value="94%" label="User Satisfaction" desc="NPS score from beta users" color="var(--error)" />
                </div>
                <div
                  className="p-6 rounded-2xl"
                  style={{ background: "linear-gradient(135deg, var(--on-primary-container), var(--primary))" }}
                >
                  <p className="text-lg font-bold text-primary-foreground mb-2">UX Design Impact Summary</p>
                  <p className="text-primary-foreground/80 text-sm leading-relaxed">
                    By applying evidence-based UX principles, cognitive psychology laws, and AI transparency design,
                    DecisionOS AI transforms traditional BI from a <strong className="text-primary-foreground">data viewer into a decision engine</strong>.
                    The platform doesn't just show what happened — it tells you what to do next, with the confidence to act.
                  </p>
                </div>
              </div>
            )}

            {/* FUTURE */}
            {slide === 11 && (
              <div className="p-6 lg:p-12 max-w-5xl mx-auto">
                <SectionTag label="11 · Future Vision & Roadmap" color="var(--ai)" />
                <h2 className="text-3xl font-black mb-6" style={{ color: "var(--foreground)" }}>
                  The Next Evolution of <span style={{ color: "var(--ai)" }}>Enterprise Intelligence</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {[
                    { phase: "Phase 2 — Q3 2026", items: ["Autonomous AI Agents for repetitive decisions", "Multi-agent business simulation environment", "Generative workflow automation"], color: "var(--primary)" },
                    { phase: "Phase 3 — Q1 2027", items: ["Voice analytics assistant (hands-free)", "AI-generated board presentation decks", "Real-time digital twin dashboards"], color: "var(--ai)" },
                    { phase: "Phase 4 — 2027+", items: ["Autonomous business intelligence (ABI)", "Self-healing operational workflows", "Predictive decision pre-approval"], color: "var(--success)" },
                    { phase: "Platform Vision", items: ["Next-gen Power BI + AI-native Tableau", "Decision operating system for enterprises", "From dashboards to decision intelligence"], color: "var(--warning)" },
                  ].map(({ phase, items, color }) => (
                    <div
                      key={phase}
                      className="bg-card rounded-2xl p-5"
                      style={{ border: `1px solid ${alpha(color, "33")}` }}
                    >
                      <p className="text-sm font-bold mb-3" style={{ color }}>{phase}</p>
                      {items.map((item) => (
                        <div key={item} className="flex items-start gap-2 mb-2">
                          <ArrowRight size={12} style={{ color, marginTop: 2, flexShrink: 0 }} />
                          <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{item}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div
                  className="text-center p-8 rounded-2xl"
                  style={{ background: "linear-gradient(135deg, var(--on-primary-container), var(--primary), var(--info))" }}
                >
                  <p className="text-3xl font-black text-primary-foreground mb-3">DecisionOS AI</p>
                  <p className="text-primary-foreground/75 mb-6 max-w-lg mx-auto">
                    The enterprise intelligence operating system that transforms data into decisions,
                    predictions into confidence, and complexity into clarity.
                  </p>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    {["AI-Native", "Decision-Centric", "WCAG AA", "Enterprise-Grade", "Material 3"].map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: "color-mix(in srgb, var(--primary-foreground) 15%, transparent)", color: "var(--primary-foreground)" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div
        className="flex items-center justify-between px-6 py-4 bg-card flex-shrink-0"
        style={{ borderTop: "1px solid var(--surface-track)" }}
      >
        <button
          onClick={prev}
          disabled={slide === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted"
          style={{ color: "var(--muted-foreground)" }}
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <div className="flex gap-1">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className="transition-all rounded-full"
              style={{
                width: i === slide ? 20 : 8,
                height: 8,
                backgroundColor: i === slide ? "var(--primary)" : i < slide ? "var(--primary-soft)" : "var(--surface-track)",
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={slide === total - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-primary-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-md"
          style={{ background: slide === total - 1 ? "var(--outline)" : "linear-gradient(135deg, var(--primary), var(--primary-strong))" }}
        >
          {slide === total - 1 ? "Complete" : "Next"}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
