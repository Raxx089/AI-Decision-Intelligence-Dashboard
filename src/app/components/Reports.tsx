import { useState, useEffect, useRef } from "react";
import {
  BarChart2, TrendingUp, PieChart as PieIcon, Table as TableIcon, Plus,
  Download, Share2, Play, Calendar, Grip, X, FileText, Sparkles,
  ChevronDown, LayoutGrid, CheckCircle2, Clock, Send, Link2,
  Copy, Trash2, MoreHorizontal, Eye, ArrowLeft, RefreshCw,
  FileBarChart, AlertCircle
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../context/ThemeContext";

// ─── Data ────────────────────────────────────────────────────────────────────
const revenueData = [
  { month: "Jan", revenue: 5.9, expenses: 4.3 },
  { month: "Feb", revenue: 6.2, expenses: 4.5 },
  { month: "Mar", revenue: 6.4, expenses: 4.6 },
  { month: "Apr", revenue: 6.1, expenses: 4.4 },
  { month: "May", revenue: 6.8, expenses: 4.8 },
];

const trendData = [
  { month: "Jun", value: 4.2 }, { month: "Jul", value: 4.5 },
  { month: "Aug", value: 4.1 }, { month: "Sep", value: 4.8 },
  { month: "Oct", value: 5.2 }, { month: "Nov", value: 5.6 },
  { month: "Dec", value: 5.1 }, { month: "Jan", value: 5.9 },
  { month: "Feb", value: 6.2 }, { month: "Mar", value: 6.4 },
  { month: "Apr", value: 6.1 }, { month: "May", value: 6.8 },
];

const segmentData = [
  { name: "Enterprise", value: 52, color: "var(--primary)" },
  { name: "Mid-Market", value: 31, color: "var(--success)" },
  { name: "SMB", value: 17, color: "var(--warning)" },
];

const riskData = [
  { region: "North America", value: 15, color: "var(--success)" },
  { region: "Europe", value: 28, color: "var(--warning)" },
  { region: "APAC", value: 67, color: "var(--error)" },
  { region: "LatAm", value: 35, color: "var(--warning)" },
];

const tableData = [
  { region: "North America", q1: "$2.4M", q2: "$2.8M", change: "+16.7%", status: "On Track" },
  { region: "Europe", q1: "$1.8M", q2: "$2.1M", change: "+16.7%", status: "On Track" },
  { region: "APAC", q1: "$1.2M", q2: "$1.4M", change: "+16.7%", status: "At Risk" },
  { region: "Latin America", q1: "$0.5M", q2: "$0.5M", change: "+0%", status: "Behind" },
];

// ─── Types ────────────────────────────────────────────────────────────────────
type WidgetType = "kpi_card" | "bar_chart" | "line_chart" | "pie_chart" | "data_table" | "ai_insight" | "text_block";

type CanvasWidget = {
  id: string;
  type: WidgetType;
  label: string;
  colSpan: number;
};

type ReportStatus = "generated" | "scheduled" | "draft";

type SavedReport = {
  id: string;
  title: string;
  template: string;
  templateIcon: string;
  status: ReportStatus;
  lastUpdated: string;
  widgetCount: number;
  recipients: string[];
  nextScheduled: string | null;
};

// ─── Templates ────────────────────────────────────────────────────────────────
const TEMPLATES = [
  { id: "exec", label: "Executive Summary", icon: "📊", description: "Board-ready KPI overview" },
  { id: "revenue", label: "Revenue Report", icon: "💰", description: "Full revenue analysis" },
  { id: "operations", label: "Ops Dashboard", icon: "⚙️", description: "Operational metrics" },
  { id: "risk", label: "Risk Assessment", icon: "🛡️", description: "AI risk intelligence" },
];

const TEMPLATE_WIDGETS: Record<string, CanvasWidget[]> = {
  exec: [
    { id: "e1", type: "kpi_card", label: "Total Revenue: $6.8M", colSpan: 1 },
    { id: "e2", type: "kpi_card", label: "Profit Margin: 23.6%", colSpan: 1 },
    { id: "e3", type: "kpi_card", label: "Customers: 1,847", colSpan: 1 },
    { id: "e4", type: "bar_chart", label: "Revenue vs Expenses", colSpan: 2 },
    { id: "e5", type: "pie_chart", label: "Revenue by Segment", colSpan: 1 },
    { id: "e6", type: "ai_insight", label: "AI Executive Summary", colSpan: 3 },
  ],
  revenue: [
    { id: "r1", type: "kpi_card", label: "Total Revenue: $6.8M", colSpan: 1 },
    { id: "r2", type: "kpi_card", label: "YoY Growth: +12.4%", colSpan: 1 },
    { id: "r3", type: "kpi_card", label: "Forecast Q4: $9.1M", colSpan: 1 },
    { id: "r4", type: "line_chart", label: "Revenue Trend (12 months)", colSpan: 2 },
    { id: "r5", type: "pie_chart", label: "Revenue by Segment", colSpan: 1 },
    { id: "r6", type: "data_table", label: "Revenue by Region", colSpan: 3 },
    { id: "r7", type: "ai_insight", label: "AI Revenue Insights", colSpan: 3 },
  ],
  operations: [
    { id: "o1", type: "kpi_card", label: "Operational Health: 87/100", colSpan: 1 },
    { id: "o2", type: "kpi_card", label: "On-Time Delivery: 94%", colSpan: 1 },
    { id: "o3", type: "kpi_card", label: "Efficiency Score: 91%", colSpan: 1 },
    { id: "o4", type: "bar_chart", label: "Ops by Department", colSpan: 2 },
    { id: "o5", type: "pie_chart", label: "Resource Allocation", colSpan: 1 },
    { id: "o6", type: "data_table", label: "KPI Breakdown", colSpan: 3 },
  ],
  risk: [
    { id: "k1", type: "kpi_card", label: "AI Risk Score: Low 2.4", colSpan: 1 },
    { id: "k2", type: "kpi_card", label: "Critical Alerts: 3", colSpan: 1 },
    { id: "k3", type: "kpi_card", label: "Compliance: 94%", colSpan: 1 },
    { id: "k4", type: "bar_chart", label: "Risk by Region", colSpan: 2 },
    { id: "k5", type: "pie_chart", label: "Risk by Category", colSpan: 1 },
    { id: "k6", type: "ai_insight", label: "AI Risk Assessment", colSpan: 3 },
  ],
};

const WIDGET_CATALOG = [
  { id: "kpi_card" as WidgetType, label: "KPI Card", icon: TrendingUp, category: "Metrics" },
  { id: "bar_chart" as WidgetType, label: "Bar Chart", icon: BarChart2, category: "Charts" },
  { id: "line_chart" as WidgetType, label: "Line Chart", icon: TrendingUp, category: "Charts" },
  { id: "pie_chart" as WidgetType, label: "Pie Chart", icon: PieIcon, category: "Charts" },
  { id: "data_table" as WidgetType, label: "Data Table", icon: TableIcon, category: "Data" },
  { id: "ai_insight" as WidgetType, label: "AI Insight", icon: Sparkles, category: "AI" },
  { id: "text_block" as WidgetType, label: "Text Block", icon: FileText, category: "Layout" },
];

const SAVED_REPORTS: SavedReport[] = [
  {
    id: "rep1", title: "Q2 2026 Executive Intelligence Report", template: "exec", templateIcon: "📊",
    status: "generated", lastUpdated: "May 13, 2026", widgetCount: 6,
    recipients: ["board@acmecorp.com"], nextScheduled: null,
  },
  {
    id: "rep2", title: "May 2026 Revenue Analysis", template: "revenue", templateIcon: "💰",
    status: "scheduled", lastUpdated: "May 12, 2026", widgetCount: 7,
    recipients: ["finance@acmecorp.com", "cfo@acmecorp.com"], nextScheduled: "May 20, 2026",
  },
  {
    id: "rep3", title: "APAC Risk Assessment — Q2", template: "risk", templateIcon: "🛡️",
    status: "draft", lastUpdated: "May 10, 2026", widgetCount: 4,
    recipients: [], nextScheduled: null,
  },
  {
    id: "rep4", title: "Operations Dashboard — Weekly", template: "operations", templateIcon: "⚙️",
    status: "generated", lastUpdated: "May 9, 2026", widgetCount: 6,
    recipients: ["ops@acmecorp.com"], nextScheduled: null,
  },
];

const AI_STEPS = [
  "Connecting to 47 data sources…",
  "Analyzing revenue trends & KPI deltas…",
  "Running risk & anomaly detection…",
  "Generating natural language insights…",
  "Building report layout…",
  "Report ready!",
];

// ─── Widget Renderer ──────────────────────────────────────────────────────────
function WidgetPreview({ type, label }: { type: WidgetType; label: string }) {
  const { isDark } = useTheme();
  const text = "var(--foreground)";
  const sub = "var(--muted-foreground)";
  const axisTick = "var(--outline)";
  const gridStroke = "var(--muted)";

  if (type === "kpi_card") {
    const isRevenue = label.includes("$") && label.includes("Revenue");
    const isMargin = label.includes("%");
    const isRisk = label.includes("Risk");
    const val = isRevenue ? "$6.8M" : isMargin ? "23.6%" : isRisk ? "Low 2.4" : label.split(":")[1]?.trim() || "—";
    const delta = isRevenue ? "+12.4%" : isMargin ? "+2.1%" : isRisk ? "Stable" : "+8.3%";
    const color = isRisk ? "var(--warning)" : "var(--success)";
    return (
      <div className="p-4">
        <p className="text-xs mb-1.5" style={{ color: sub }}>{label.split(":")[0]}</p>
        <p className="text-2xl font-bold mb-1" style={{ color: text }}>{val}</p>
        <p className="text-xs font-semibold" style={{ color }}>{delta} vs last period</p>
      </div>
    );
  }

  if (type === "bar_chart") {
    const data = label.includes("Risk") ? riskData.map(d => ({ name: d.region, value: d.value })) : revenueData;
    const isRisk = label.includes("Risk");
    return (
      <div className="p-2">
        <p className="text-xs font-medium mb-2" style={{ color: sub }}>{label}</p>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis interval={0} dataKey={isRisk ? "name" : "month"} tick={{ fontSize: 11, fill: axisTick }} axisLine={false} tickLine={false} />
            <YAxis interval={0} tick={{ fontSize: 11, fill: axisTick }} axisLine={false} tickLine={false} tickFormatter={(v) => isRisk ? `${v}%` : `$${v}M`} />
            <Tooltip />
            {isRisk ? (
              <Bar dataKey="value" fill="var(--error)" radius={[3, 3, 0, 0]} isAnimationActive={false} />
            ) : (
              <>
                <Bar dataKey="revenue" fill="var(--primary)" radius={[3, 3, 0, 0]} isAnimationActive={false} />
                <Bar dataKey="expenses" fill="var(--primary-container)" radius={[3, 3, 0, 0]} isAnimationActive={false} />
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === "line_chart") {
    return (
      <div className="p-2">
        <p className="text-xs font-medium mb-2" style={{ color: sub }}>{label}</p>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={trendData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis interval={0} dataKey="month" tick={{ fontSize: 11, fill: axisTick }} axisLine={false} tickLine={false} />
            <YAxis interval={0} tick={{ fontSize: 11, fill: axisTick }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}M`} />
            <Tooltip formatter={(v: any) => `$${v}M`} />
            <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === "pie_chart") {
    return (
      <div className="p-2">
        <p className="text-xs font-medium mb-1" style={{ color: sub }}>{label}</p>
        <div className="flex items-center gap-2">
          <ResponsiveContainer width="60%" height={100}>
            <PieChart>
              <Pie data={segmentData} cx="50%" cy="50%" innerRadius={22} outerRadius={42} dataKey="value" isAnimationActive={false}>
                {segmentData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1">
            {segmentData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-xs" style={{ color: sub }}>{s.name}: <span style={{ color: text, fontWeight: 500 }}>{s.value}%</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "data_table") {
    return (
      <div className="p-2 overflow-hidden">
        <p className="text-xs font-medium mb-2" style={{ color: sub }}>{label}</p>
        <table className="w-full text-xs">
          <thead>
            <tr style={{ borderBottom: `1px solid ${"var(--surface-track)"}` }}>
              {["Region", "Q1", "Q2", "Change", "Status"].map(h => (
                <th key={h} className="pb-1.5 text-left font-semibold" style={{ color: "var(--outline)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${"var(--muted)"}` }}>
                <td className="py-1.5 font-medium" style={{ color: text }}>{row.region}</td>
                <td className="py-1.5" style={{ color: sub }}>{row.q1}</td>
                <td className="py-1.5" style={{ color: sub }}>{row.q2}</td>
                <td className="py-1.5 font-semibold" style={{ color: row.change === "+0%" ? "var(--outline)" : "var(--success)" }}>{row.change}</td>
                <td className="py-1.5">
                  <span
                    className="px-1.5 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: row.status === "On Track" ? "var(--success-container)" : row.status === "At Risk" ? "var(--warning-container)" : "var(--error-container)",
                      color: row.status === "On Track" ? "var(--success)" : row.status === "At Risk" ? "var(--warning)" : "var(--error)",
                    }}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (type === "ai_insight") {
    return (
      <div
        className="p-3 m-2 rounded-xl"
        style={{ background: "linear-gradient(135deg, var(--primary-container), var(--primary-tint))" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} style={{ color: "var(--primary)" }} />
          <span className="text-xs font-semibold" style={{ color: "var(--primary)" }}>AI Analysis</span>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>96% confidence</span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "var(--primary-strong)" }}>
          Revenue grew 12.4% QoQ driven by Enterprise expansion in North America. APAC operational risk at 67% requires immediate attention. AI forecasts $9.1M revenue by Q4 with 89% confidence. Customer churn risk elevated — proactive outreach recommended for 142 high-value accounts.
        </p>
      </div>
    );
  }

  if (type === "text_block") {
    return (
      <div className="p-4">
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          {label === "Text Block" ? "Click to edit this text block. Add commentary, context, or narrative to your report." : label}
        </p>
      </div>
    );
  }

  return <div className="p-4 text-xs" style={{ color: "var(--outline)" }}>{label}</div>;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ReportStatus }) {
  const cfg = {
    generated: { label: "Generated", color: "var(--success)", bg: "var(--success-container)", Icon: CheckCircle2 },
    scheduled: { label: "Scheduled", color: "var(--primary)", bg: "var(--primary-container)", Icon: Clock },
    draft: { label: "Draft", color: "var(--outline)", bg: "var(--muted)", Icon: FileText },
  }[status];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      <cfg.Icon size={10} />
      {cfg.label}
    </span>
  );
}

// ─── AI Generate Modal ────────────────────────────────────────────────────────
function AIGenerateModal({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    let i = 0;
    const tick = setInterval(() => {
      i++;
      setStep(i);
      if (i >= AI_STEPS.length - 1) {
        clearInterval(tick);
        setDone(true);
      }
    }, 700);
    return () => clearInterval(tick);
  }, []);

  const surface = "var(--card)";
  const text = "var(--foreground)";
  const sub = "var(--muted-foreground)";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "color-mix(in srgb, var(--scrim) 60%, transparent)" }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: surface }}
      >
        <div className="p-6 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--ai))" }}
          >
            <Sparkles size={28} color="var(--primary-foreground)" />
          </div>
          <h3 className="text-base font-bold mb-1" style={{ color: text }}>
            {done ? "Report Ready!" : "Generating with AI"}
          </h3>
          <p className="text-sm mb-6" style={{ color: sub }}>
            {done ? "Your report has been generated successfully." : "Analyzing your data across all connected sources…"}
          </p>

          <div className="space-y-2 mb-6 text-left">
            {AI_STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    backgroundColor: i < step ? "var(--success)" : i === step ? "var(--primary)" : ("var(--muted)"),
                  }}
                >
                  {i < step ? (
                    <CheckCircle2 size={12} color="var(--primary-foreground)" />
                  ) : i === step ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw size={10} color="var(--primary-foreground)" />
                    </motion.div>
                  ) : null}
                </div>
                <span
                  className="text-sm transition-all"
                  style={{
                    color: i < step ? ("var(--outline)") : i === step ? text : ("var(--outline-variant)"),
                    fontWeight: i === step ? 600 : 400,
                  }}
                >
                  {s}
                </span>
              </div>
            ))}
          </div>

          {!done ? (
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--surface-track)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: "var(--primary)" }}
                animate={{ width: `${((step + 1) / AI_STEPS.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-muted"
                style={{ border: `1px solid ${"var(--surface-track)"}`, color: "var(--muted-foreground)" }}
              >
                Close
              </button>
              <button
                onClick={onComplete}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-strong))" }}
              >
                View Report
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Schedule Modal ───────────────────────────────────────────────────────────
function ScheduleModal({ onClose }: { onClose: () => void }) {
  const { isDark } = useTheme();
  const [freq, setFreq] = useState("weekly");
  const [time, setTime] = useState("09:00");
  const [email, setEmail] = useState("board@acmecorp.com");
  const [saved, setSaved] = useState(false);

  const surface = "var(--card)";
  const border = "var(--surface-track)";
  const text = "var(--foreground)";
  const sub = "var(--muted-foreground)";
  const inputBg = "var(--page)";

  const handleSave = () => {
    setSaved(true);
    setTimeout(onClose, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "color-mix(in srgb, var(--scrim) 60%, transparent)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: surface }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${border}` }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--primary-container)" }}>
              <Calendar size={16} style={{ color: "var(--primary)" }} />
            </div>
            <h3 className="text-base font-bold" style={{ color: text }}>Schedule Report</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors" style={{ color: sub }}>
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Frequency */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: sub }}>DELIVERY FREQUENCY</label>
            <div className="grid grid-cols-3 gap-2">
              {["daily", "weekly", "monthly"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFreq(f)}
                  className="py-2 rounded-xl text-sm font-medium capitalize transition-all"
                  style={{
                    backgroundColor: freq === f ? "var(--primary)" : inputBg,
                    color: freq === f ? "var(--card)" : text,
                    border: `1px solid ${freq === f ? "var(--primary)" : border}`,
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: sub }}>DELIVERY TIME</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none"
              style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: text }}
            />
          </div>

          {/* Recipients */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: sub }}>RECIPIENTS (comma-separated)</label>
            <textarea
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
              style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: text }}
            />
          </div>

          {/* Format */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: sub }}>EXPORT FORMAT</label>
            <div className="flex gap-2">
              {["PDF", "PowerPoint", "Excel"].map((fmt) => (
                <button
                  key={fmt}
                  className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
                  style={{
                    backgroundColor: fmt === "PDF" ? "var(--primary-tint)" : inputBg,
                    color: fmt === "PDF" ? "var(--primary)" : text,
                    border: `1px solid ${fmt === "PDF" ? "var(--primary)" : border}`,
                  }}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{ border: `1px solid ${border}`, color: text }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground flex items-center justify-center gap-2 transition-all"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-strong))" }}
          >
            {saved ? <CheckCircle2 size={15} /> : <Send size={15} />}
            {saved ? "Scheduled!" : "Save Schedule"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Share Modal ──────────────────────────────────────────────────────────────
function ShareModal({ onClose }: { onClose: () => void }) {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSent, setInviteSent] = useState(false);
  const link = "https://app.decisionos.ai/reports/q2-2026-exec?token=share_abc123";

  const surface = "var(--card)";
  const border = "var(--surface-track)";
  const text = "var(--foreground)";
  const sub = "var(--muted-foreground)";
  const inputBg = "var(--page)";

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = () => {
    if (!inviteEmail) return;
    setInviteSent(true);
    setTimeout(() => { setInviteSent(false); setInviteEmail(""); }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "color-mix(in srgb, var(--scrim) 60%, transparent)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: surface }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${border}` }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--success-container)" }}>
              <Share2 size={16} style={{ color: "var(--success)" }} />
            </div>
            <h3 className="text-base font-bold" style={{ color: text }}>Share Report</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors" style={{ color: sub }}>
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Shareable Link */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: sub }}>SHAREABLE LINK</label>
            <div className="flex gap-2">
              <div
                className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl text-xs overflow-hidden"
                style={{ backgroundColor: inputBg, border: `1px solid ${border}` }}
              >
                <Link2 size={12} style={{ color: "var(--outline)", flexShrink: 0 }} />
                <span className="truncate" style={{ color: sub }}>{link}</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{
                  backgroundColor: copied ? "var(--success-container)" : "var(--primary-container)",
                  color: copied ? "var(--success)" : "var(--primary)",
                }}
              >
                {copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Permission */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: sub }}>LINK PERMISSIONS</label>
            <div
              className="flex items-center justify-between px-3 py-2.5 rounded-xl"
              style={{ backgroundColor: inputBg, border: `1px solid ${border}` }}
            >
              <span className="text-sm" style={{ color: text }}>Anyone with link</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium" style={{ color: "var(--primary)" }}>Can view</span>
                <ChevronDown size={13} style={{ color: sub }} />
              </div>
            </div>
          </div>

          {/* Invite */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: sub }}>INVITE BY EMAIL</label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="colleague@acmecorp.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
                style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: text }}
              />
              <button
                onClick={handleInvite}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-primary-foreground transition-all"
                style={{ background: inviteSent ? "var(--success)" : "linear-gradient(135deg, var(--primary), var(--primary-strong))" }}
              >
                {inviteSent ? <CheckCircle2 size={14} /> : <Send size={14} />}
                {inviteSent ? "Sent!" : "Invite"}
              </button>
            </div>
          </div>

          {/* Current Access */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: sub }}>PEOPLE WITH ACCESS</label>
            {["board@acmecorp.com", "cfo@acmecorp.com", "ops@acmecorp.com"].map((e) => (
              <div key={e} className="flex items-center gap-3 py-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground" style={{ backgroundColor: "var(--primary)" }}>
                  {e[0].toUpperCase()}
                </div>
                <span className="text-sm flex-1" style={{ color: text }}>{e}</span>
                <span className="text-xs" style={{ color: sub }}>Viewer</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Export Modal ─────────────────────────────────────────────────────────────
function ExportModal({ reportTitle, onClose }: { reportTitle: string; onClose: () => void }) {
  const { isDark } = useTheme();
  const [format, setFormat] = useState("pdf");
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);

  const surface = "var(--card)";
  const border = "var(--surface-track)";
  const text = "var(--foreground)";
  const sub = "var(--muted-foreground)";

  const formats = [
    { id: "pdf", label: "PDF Report", icon: "📄", desc: "Formatted, print-ready PDF" },
    { id: "ppt", label: "PowerPoint", icon: "📊", desc: "Editable slide deck" },
    { id: "xlsx", label: "Excel Data", icon: "📋", desc: "Raw data + charts" },
    { id: "html", label: "Web Page", icon: "🌐", desc: "Interactive HTML report" },
  ];

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setDone(true);
      if (format === "pdf") {
        window.print();
      }
    }, 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "color-mix(in srgb, var(--scrim) 60%, transparent)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: surface }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${border}` }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--primary-tint)" }}>
              <Download size={16} style={{ color: "var(--primary)" }} />
            </div>
            <h3 className="text-base font-bold" style={{ color: text }}>Export Report</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors" style={{ color: sub }}>
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <p className="text-xs" style={{ color: sub }}>Exporting: <span style={{ color: text, fontWeight: 500 }}>{reportTitle}</span></p>

          {formats.map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => setFormat(fmt.id)}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
              style={{
                border: `1px solid ${format === fmt.id ? "var(--primary)" : border}`,
                backgroundColor: format === fmt.id ? ("var(--primary-tint)") : "transparent",
              }}
            >
              <span className="text-xl">{fmt.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: format === fmt.id ? "var(--primary)" : text }}>{fmt.label}</p>
                <p className="text-xs" style={{ color: sub }}>{fmt.desc}</p>
              </div>
              {format === fmt.id && <CheckCircle2 size={16} style={{ color: "var(--primary)" }} />}
            </button>
          ))}

          <button
            onClick={handleExport}
            disabled={exporting}
            className="w-full py-3 rounded-xl text-sm font-semibold text-primary-foreground flex items-center justify-center gap-2 transition-all mt-2"
            style={{
              background: done ? "var(--success)" : "linear-gradient(135deg, var(--primary), var(--primary-strong))",
              opacity: exporting ? 0.8 : 1,
            }}
          >
            {exporting ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <RefreshCw size={15} />
                </motion.div>
                Generating {format.toUpperCase()}…
              </>
            ) : done ? (
              <>
                <CheckCircle2 size={15} />
                Download Ready!
              </>
            ) : (
              <>
                <Download size={15} />
                Export as {format.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Report Settings Panel ────────────────────────────────────────────────────
interface SettingsPanelProps {
  reportTitle: string;
  setReportTitle: (v: string) => void;
  activeTemplate: string;
  canvasWidgets: CanvasWidget[];
  onAI: () => void;
  onSchedule: () => void;
  onShare: () => void;
  onExport: () => void;
  onPresent: () => void;
}

function ReportSettingsPanel({
  reportTitle, setReportTitle, activeTemplate, canvasWidgets,
  onAI, onSchedule, onShare, onExport, onPresent,
}: SettingsPanelProps) {
  const { isDark } = useTheme();
  const [tab, setTab] = useState<"general" | "delivery" | "appearance">("general");
  const [dateRange, setDateRange] = useState("30d");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState("15m");
  const [recipients, setRecipients] = useState(["board@acmecorp.com", "cfo@acmecorp.com"]);
  const [recipientInput, setRecipientInput] = useState("");
  const [exportFormat, setExportFormat] = useState("pdf");
  const [frequency, setFrequency] = useState("weekly");
  const [pageTheme, setPageTheme] = useState("light");
  const [pageSize, setPageSize] = useState("a4");
  const [showLogo, setShowLogo] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [accentColor, setAccentColor] = useState("var(--primary)");
  const [savedToast, setSavedToast] = useState(false);

  const surface = "var(--card)";
  const surfaceAlt = "var(--page)";
  const border = "var(--surface-track)";
  const text = "var(--foreground)";
  const sub = "var(--muted-foreground)";
  const inputBg = "var(--page)";
  const divider = "var(--muted)";

  const TABS = [
    { id: "general" as const, label: "General" },
    { id: "delivery" as const, label: "Delivery" },
    { id: "appearance" as const, label: "Style" },
  ];

  const DATE_RANGES = [
    { id: "7d", label: "Last 7 days" },
    { id: "30d", label: "Last 30 days" },
    { id: "90d", label: "Last 90 days" },
    { id: "ytd", label: "Year to date" },
    { id: "custom", label: "Custom range" },
  ];

  const REFRESH_INTERVALS = [
    { id: "5m", label: "5 min" },
    { id: "15m", label: "15 min" },
    { id: "1h", label: "1 hour" },
    { id: "24h", label: "Daily" },
  ];

  const addRecipient = () => {
    if (recipientInput.trim() && !recipients.includes(recipientInput.trim())) {
      setRecipients((p) => [...p, recipientInput.trim()]);
      setRecipientInput("");
    }
  };

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className="relative flex-shrink-0 transition-colors"
      style={{
        width: 32, height: 18,
        borderRadius: "var(--radius-md)",
        backgroundColor: on ? "var(--primary)" : ("var(--outline-variant)"),
      }}
    >
      <span
        className="absolute top-0.5 transition-all"
        style={{
          left: on ? 15 : 2,
          width: 14, height: 14,
          borderRadius: "50%",
          backgroundColor: "var(--card)",
          boxShadow: "0 1px 3px color-mix(in srgb, var(--scrim) 20%, transparent)",
        }}
      />
    </button>
  );

  const SelectRow = ({ label, value, options, onChange }: {
    label: string; value: string;
    options: { id: string; label: string }[];
    onChange: (v: string) => void;
  }) => (
    <div>
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: sub }}>{label}</label>
      <div
        className="relative w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between cursor-pointer"
        style={{ border: `1px solid ${border}`, color: text, backgroundColor: inputBg }}
        onClick={() => {
          const idx = options.findIndex(o => o.id === value);
          onChange(options[(idx + 1) % options.length].id);
        }}
      >
        <span>{options.find(o => o.id === value)?.label ?? value}</span>
        <ChevronDown size={11} style={{ color: sub }} />
      </div>
    </div>
  );

  const templateLabel = TEMPLATES.find(t => t.id === activeTemplate)?.label ?? "Custom";

  return (
    <div
      className="hidden xl:flex flex-col w-60 flex-shrink-0"
      style={{ backgroundColor: surface, borderLeft: `1px solid ${border}` }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold" style={{ color: text }}>Report Settings</p>
          <button
            onClick={handleSave}
            className="text-xs px-2.5 py-1 rounded-lg font-semibold transition-all"
            style={{
              backgroundColor: savedToast ? "var(--success-container)" : "var(--primary-container)",
              color: savedToast ? "var(--success)" : "var(--primary)",
            }}
          >
            {savedToast ? "✓ Saved" : "Save"}
          </button>
        </div>
        {/* Tabs */}
        <div className="flex gap-0.5 p-0.5 rounded-xl" style={{ backgroundColor: surfaceAlt }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                backgroundColor: tab === t.id ? surface : "transparent",
                color: tab === t.id ? "var(--primary)" : sub,
                boxShadow: tab === t.id ? "0 1px 4px color-mix(in srgb, var(--scrim) 8%, transparent)" : "none",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.15 }}
            className="p-4 space-y-4"
          >

            {/* ── GENERAL ── */}
            {tab === "general" && (
              <>
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: sub }}>Title</label>
                  <input
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs outline-none"
                    style={{ border: `1px solid ${border}`, color: text, backgroundColor: inputBg }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: sub }}>Description</label>
                  <textarea
                    rows={2}
                    placeholder="Add a short description…"
                    className="w-full px-3 py-2 rounded-xl text-xs outline-none resize-none"
                    style={{ border: `1px solid ${border}`, color: text, backgroundColor: inputBg }}
                    defaultValue="Q2 executive intelligence brief covering revenue, risk, and AI-generated forecasts."
                  />
                </div>

                {/* Date Range */}
                <SelectRow
                  label="Date Range"
                  value={dateRange}
                  options={DATE_RANGES}
                  onChange={setDateRange}
                />

                {/* Auto Refresh */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: sub }}>Auto-Refresh</label>
                    <Toggle on={autoRefresh} onToggle={() => setAutoRefresh(!autoRefresh)} />
                  </div>
                  {autoRefresh && (
                    <div className="flex gap-1">
                      {REFRESH_INTERVALS.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => setRefreshInterval(r.id)}
                          className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                          style={{
                            backgroundColor: refreshInterval === r.id ? "var(--primary)" : inputBg,
                            color: refreshInterval === r.id ? "var(--card)" : sub,
                            border: `1px solid ${refreshInterval === r.id ? "var(--primary)" : border}`,
                          }}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Report Info */}
                <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${border}` }}>
                  {[
                    { label: "Template", value: templateLabel },
                    { label: "Widgets", value: `${canvasWidgets.length}` },
                    { label: "Data sources", value: "47 connected" },
                    { label: "Last saved", value: "Just now" },
                  ].map(({ label, value }, i, arr) => (
                    <div
                      key={label}
                      className="flex items-center justify-between px-3 py-2 text-xs"
                      style={{ borderBottom: i < arr.length - 1 ? `1px solid ${divider}` : "none", backgroundColor: i % 2 === 0 ? surface : surfaceAlt }}
                    >
                      <span style={{ color: sub }}>{label}</span>
                      <span style={{ color: text, fontWeight: 500 }}>{value}</span>
                    </div>
                  ))}
                </div>

                {canvasWidgets.length === 0 && (
                  <div
                    className="p-3 rounded-xl flex items-start gap-2"
                    style={{ backgroundColor: "var(--warning-container)", border: `1px solid color-mix(in srgb, var(--warning) 27%, transparent)` }}
                  >
                    <AlertCircle size={12} style={{ color: "var(--warning)", flexShrink: 0, marginTop: 1 }} />
                    <p className="text-xs leading-relaxed" style={{ color: "var(--on-warning-container)" }}>
                      Canvas is empty. Add widgets or pick a template.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* ── DELIVERY ── */}
            {tab === "delivery" && (
              <>
                {/* Export Format */}
                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: sub }}>Export Format</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: "pdf", label: "PDF", icon: "📄" },
                      { id: "ppt", label: "PowerPoint", icon: "📊" },
                      { id: "xlsx", label: "Excel", icon: "📋" },
                      { id: "html", label: "Web Page", icon: "🌐" },
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        onClick={() => setExportFormat(fmt.id)}
                        className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all"
                        style={{
                          border: `1px solid ${exportFormat === fmt.id ? "var(--primary)" : border}`,
                          backgroundColor: exportFormat === fmt.id ? ("var(--primary-tint)") : inputBg,
                          color: exportFormat === fmt.id ? "var(--primary)" : text,
                        }}
                      >
                        <span>{fmt.icon}</span>
                        <span>{fmt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: sub }}>Schedule</label>
                  <div className="flex gap-1">
                    {["one-time", "daily", "weekly", "monthly"].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFrequency(f)}
                        className="flex-1 py-1.5 rounded-lg text-xs capitalize transition-all"
                        style={{
                          backgroundColor: frequency === f ? "var(--primary)" : inputBg,
                          color: frequency === f ? "var(--card)" : sub,
                          border: `1px solid ${frequency === f ? "var(--primary)" : border}`,
                          fontSize: "var(--text-2xs)",
                        }}
                      >
                        {f === "one-time" ? "Once" : f}
                      </button>
                    ))}
                  </div>
                  {frequency !== "one-time" && (
                    <div
                      className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
                      style={{ backgroundColor: "var(--primary-tint)" }}
                    >
                      <Calendar size={11} style={{ color: "var(--primary)" }} />
                      <span style={{ color: "var(--primary)" }}>
                        Next: {frequency === "daily" ? "Tomorrow 9:00 AM" : frequency === "weekly" ? "Mon May 20, 9:00 AM" : "Jun 1, 9:00 AM"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Recipients */}
                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: sub }}>
                    Recipients ({recipients.length})
                  </label>
                  <div className="space-y-1.5 mb-2">
                    {recipients.map((r) => (
                      <div
                        key={r}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                        style={{ backgroundColor: surfaceAlt, border: `1px solid ${border}` }}
                      >
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0"
                          style={{ backgroundColor: "var(--primary)", fontSize: "var(--text-2xs)" }}
                        >
                          {r[0].toUpperCase()}
                        </div>
                        <span className="text-xs flex-1 truncate" style={{ color: text }}>{r}</span>
                        <button
                          onClick={() => setRecipients((p) => p.filter((x) => x !== r))}
                          className="flex-shrink-0 transition-colors hover:text-error"
                          style={{ color: sub }}
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="email"
                      placeholder="Add email…"
                      value={recipientInput}
                      onChange={(e) => setRecipientInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addRecipient()}
                      className="flex-1 px-3 py-1.5 rounded-xl text-xs outline-none min-w-0"
                      style={{ border: `1px solid ${border}`, color: text, backgroundColor: inputBg }}
                    />
                    <button
                      onClick={addRecipient}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-primary-foreground flex-shrink-0"
                      style={{ backgroundColor: "var(--primary)" }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Send Now */}
                <button
                  onClick={onExport}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-primary-foreground"
                  style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-strong))" }}
                >
                  <Send size={12} />
                  Send Report Now
                </button>
              </>
            )}

            {/* ── APPEARANCE ── */}
            {tab === "appearance" && (
              <>
                {/* Page Theme */}
                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: sub }}>Page Theme</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: "light", label: "Light", preview: "var(--card)" },
                      { id: "dark", label: "Dark", preview: "var(--inverse-surface)" },
                      { id: "brand", label: "Brand Blue", preview: "var(--primary)" },
                      { id: "slate", label: "Slate", preview: "var(--on-primary-container)" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setPageTheme(t.id)}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-all"
                        style={{
                          border: `1px solid ${pageTheme === t.id ? "var(--primary)" : border}`,
                          backgroundColor: pageTheme === t.id ? ("var(--primary-tint)") : inputBg,
                          color: pageTheme === t.id ? "var(--primary)" : text,
                        }}
                      >
                        <div
                          className="w-4 h-4 rounded-md flex-shrink-0"
                          style={{
                            backgroundColor: t.preview,
                            border: t.preview === "var(--card)" ? `1px solid ${border}` : "none",
                          }}
                        />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent Color */}
                <div>
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: sub }}>Accent Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {["var(--primary)", "var(--success)", "var(--error)", "var(--warning)", "var(--ai)", "var(--info)"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setAccentColor(c)}
                        className="w-7 h-7 rounded-xl transition-all"
                        style={{
                          backgroundColor: c,
                          outline: accentColor === c ? `3px solid ${"color-mix(in srgb, var(--scrim) 20%, transparent)"}` : "none",
                          outlineOffset: 2,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Page Size */}
                <SelectRow
                  label="Page Size"
                  value={pageSize}
                  options={[
                    { id: "a4", label: "A4 (210 × 297 mm)" },
                    { id: "letter", label: "Letter (8.5 × 11 in)" },
                    { id: "wide", label: "Widescreen (16:9)" },
                  ]}
                  onChange={setPageSize}
                />

                {/* Toggles */}
                <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${border}` }}>
                  {[
                    { label: "Company Logo", sub: "Show in header", on: showLogo, toggle: () => setShowLogo(!showLogo) },
                    { label: "Footer", sub: "Page number & date", on: showFooter, toggle: () => setShowFooter(!showFooter) },
                  ].map(({ label, sub: desc, on, toggle }, i, arr) => (
                    <div
                      key={label}
                      className="flex items-center justify-between px-3 py-2.5"
                      style={{ borderBottom: i < arr.length - 1 ? `1px solid ${divider}` : "none", backgroundColor: i % 2 === 0 ? surface : surfaceAlt }}
                    >
                      <div>
                        <p className="text-xs font-medium" style={{ color: text }}>{label}</p>
                        <p style={{ fontSize: "var(--text-2xs)", color: sub }}>{desc}</p>
                      </div>
                      <Toggle on={on} onToggle={toggle} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="p-3 space-y-1.5 flex-shrink-0" style={{ borderTop: `1px solid ${border}`, backgroundColor: surface }}>
        <button
          onClick={onAI}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-primary-foreground"
          style={{ background: "linear-gradient(135deg, var(--ai), var(--ai))" }}
        >
          <Sparkles size={12} />
          Generate with AI
        </button>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={onPresent}
            className="flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-medium transition-all hover:bg-primary-tint/30"
            style={{ border: `1px solid ${border}`, color: text }}
          >
            <Play size={13} style={{ color: "var(--success)" }} />
            Present
          </button>
          <button
            onClick={onShare}
            className="flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-medium transition-all hover:bg-primary-tint/30"
            style={{ border: `1px solid ${border}`, color: text }}
          >
            <Share2 size={13} style={{ color: "var(--primary)" }} />
            Share
          </button>
          <button
            onClick={onExport}
            className="flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-medium transition-all hover:bg-primary-tint/30"
            style={{ border: `1px solid ${border}`, color: text }}
          >
            <Download size={13} style={{ color: "var(--warning)" }} />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Reports Component ───────────────────────────────────────────────────
export function Reports() {
  const { isDark } = useTheme();
  const [view, setView] = useState<"library" | "builder">("library");
  const [activeTemplate, setActiveTemplate] = useState("exec");
  const [reportTitle, setReportTitle] = useState("Q2 2026 Executive Intelligence Report");
  const [canvasWidgets, setCanvasWidgets] = useState<CanvasWidget[]>(TEMPLATE_WIDGETS["exec"]);
  const [savedReports, setSavedReports] = useState<SavedReport[]>(SAVED_REPORTS);
  const [dragOver, setDragOver] = useState(false);
  const [dragItemId, setDragItemId] = useState<string | null>(null);
  const [presentMode, setPresentMode] = useState(false);
  const [modals, setModals] = useState({ ai: false, schedule: false, share: false, export: false });
  const dropRef = useRef<HTMLDivElement>(null);

  const surface = "var(--card)";
  const surfaceAlt = "var(--page)";
  const bg = "var(--page)";
  const border = "var(--surface-track)";
  const text = "var(--foreground)";
  const sub = "var(--muted-foreground)";
  const inputBg = "var(--page)";

  const setModal = (key: keyof typeof modals, val: boolean) =>
    setModals((m) => ({ ...m, [key]: val }));

  const removeWidget = (id: string) => setCanvasWidgets((p) => p.filter((w) => w.id !== id));

  const addWidget = (type: WidgetType) => {
    const catalog = WIDGET_CATALOG.find((w) => w.id === type);
    setCanvasWidgets((p) => [
      ...p,
      {
        id: `w-${Date.now()}`,
        type,
        label: catalog?.label ?? type,
        colSpan: ["ai_insight", "data_table", "line_chart"].includes(type) ? 3 : 1,
      },
    ]);
  };

  const loadTemplate = (id: string) => {
    setActiveTemplate(id);
    const tmpl = TEMPLATES.find((t) => t.id === id);
    setCanvasWidgets(TEMPLATE_WIDGETS[id] ?? []);
    setReportTitle(tmpl ? `${tmpl.label} — Acme Corp` : "Untitled Report");
  };

  const openReport = (report: SavedReport) => {
    setActiveTemplate(report.template);
    setReportTitle(report.title);
    setCanvasWidgets(TEMPLATE_WIDGETS[report.template] ?? []);
    setView("builder");
  };

  const deleteReport = (id: string) =>
    setSavedReports((p) => p.filter((r) => r.id !== id));

  // ─── Presentation Mode ────────────────────────────────────────────────────
  if (presentMode) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "linear-gradient(135deg, var(--on-primary-container) 0%, var(--primary) 100%)" }}>
        <div className="flex items-center justify-between px-8 py-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <FileBarChart size={18} color="var(--primary-foreground)" />
            <span className="font-bold text-primary-foreground">{reportTitle}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setModal("export", true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
              style={{ backgroundColor: "color-mix(in srgb, var(--primary-foreground) 15%, transparent)", color: "var(--primary-foreground)" }}
            >
              <Download size={14} />
              Export
            </button>
            <button
              onClick={() => setPresentMode(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
              style={{ backgroundColor: "color-mix(in srgb, var(--primary-foreground) 15%, transparent)", color: "var(--primary-foreground)" }}
            >
              <X size={14} />
              Exit
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-sm text-primary-foreground/60 mb-1">CONFIDENTIAL · ACME CORP</p>
              <h1 className="text-4xl font-black text-primary-foreground mb-2">{reportTitle}</h1>
              <p className="text-primary-foreground/60">AI-Generated · May 13, 2026 · 47 Data Sources</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {canvasWidgets.map((w) => (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    gridColumn: `span ${w.colSpan}`,
                    backgroundColor: "color-mix(in srgb, var(--primary-foreground) 95%, transparent)",
                    minHeight: 120,
                  }}
                >
                  <WidgetPreview type={w.type} label={w.label} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {modals.export && <ExportModal reportTitle={reportTitle} onClose={() => setModal("export", false)} />}
        </AnimatePresence>
      </div>
    );
  }

  // ─── Library View ─────────────────────────────────────────────────────────
  if (view === "library") {
    return (
      <div className="p-4 lg:p-6 space-y-6" style={{ backgroundColor: bg, minHeight: "100%" }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: text }}>Reports</h1>
            <p className="text-sm" style={{ color: sub }}>AI-powered report builder & delivery</p>
          </div>
          <button
            onClick={() => { loadTemplate("exec"); setView("builder"); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground transition-all hover:shadow-md"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-strong))" }}
          >
            <Plus size={15} />
            New Report
          </button>
        </div>

        {/* Templates Row */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: sub }}>Start from a template</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => { loadTemplate(tmpl.id); setView("builder"); }}
                className="p-4 rounded-2xl text-left transition-all hover:shadow-md group"
                style={{ backgroundColor: surface, border: `1px solid ${border}` }}
              >
                <span className="text-2xl mb-2 block">{tmpl.icon}</span>
                <p className="text-sm font-semibold mb-0.5" style={{ color: text }}>{tmpl.label}</p>
                <p className="text-xs" style={{ color: sub }}>{tmpl.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Saved Reports */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: sub }}>My Reports ({savedReports.length})</p>
          <div className="space-y-2">
            {savedReports.map((report) => (
              <motion.div
                key={report.id}
                layout
                className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:shadow-sm group"
                style={{ backgroundColor: surface, border: `1px solid ${border}` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: "var(--muted)" }}
                >
                  {report.templateIcon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold truncate" style={{ color: text }}>{report.title}</p>
                    <StatusBadge status={report.status} />
                  </div>
                  <div className="flex items-center gap-3 text-xs" style={{ color: sub }}>
                    <span>{report.widgetCount} widgets</span>
                    <span>·</span>
                    <span>Updated {report.lastUpdated}</span>
                    {report.nextScheduled && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          Next: {report.nextScheduled}
                        </span>
                      </>
                    )}
                    {report.recipients.length > 0 && (
                      <>
                        <span>·</span>
                        <span>{report.recipients.length} recipient{report.recipients.length > 1 ? "s" : ""}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openReport(report)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors hover:bg-primary-tint"
                    style={{ color: "var(--primary)" }}
                    title="Open"
                  >
                    <Eye size={13} />
                    Open
                  </button>
                  <button
                    className="p-1.5 rounded-xl transition-colors hover:bg-muted"
                    style={{ color: sub }}
                    title="More options"
                  >
                    <MoreHorizontal size={15} />
                  </button>
                  <button
                    onClick={() => deleteReport(report.id)}
                    className="p-1.5 rounded-xl transition-colors hover:bg-error-container"
                    style={{ color: "var(--error)" }}
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {modals.ai && (
            <AIGenerateModal
              onClose={() => setModal("ai", false)}
              onComplete={() => { setModal("ai", false); setView("builder"); }}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ─── Builder View ─────────────────────────────────────────────────────────
  return (
    <div className="flex h-full overflow-hidden" style={{ backgroundColor: bg }}>
      {/* Left: Widget Library */}
      <div
        className="hidden lg:flex flex-col w-52 flex-shrink-0 overflow-y-auto"
        style={{ backgroundColor: surface, borderRight: `1px solid ${border}` }}
      >
        <div className="p-4" style={{ borderBottom: `1px solid ${border}` }}>
          <p className="text-sm font-semibold" style={{ color: text }}>Widget Library</p>
          <p className="text-xs" style={{ color: sub }}>Click to add to canvas</p>
        </div>

        {/* Templates */}
        <div className="p-3" style={{ borderBottom: `1px solid ${border}` }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: sub }}>Templates</p>
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => loadTemplate(tmpl.id)}
              className="w-full flex items-center gap-2 p-2 rounded-xl text-left mb-1 transition-all"
              style={{
                backgroundColor: activeTemplate === tmpl.id ? "var(--primary-container)" : "transparent",
                color: activeTemplate === tmpl.id ? "var(--primary)" : text,
              }}
            >
              <span>{tmpl.icon}</span>
              <span className="text-xs">{tmpl.label}</span>
            </button>
          ))}
        </div>

        {/* Widgets */}
        {["Metrics", "Charts", "Data", "AI", "Layout"].map((cat) => (
          <div key={cat} className="p-3" style={{ borderBottom: `1px solid ${"var(--muted)"}` }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: sub }}>{cat}</p>
            {WIDGET_CATALOG.filter((w) => w.category === cat).map((widget) => {
              const Icon = widget.icon;
              return (
                <button
                  key={widget.id}
                  onClick={() => addWidget(widget.id)}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-left mb-1 transition-all hover:bg-primary-tint/30 active:scale-95"
                  style={{ border: `1px dashed ${"var(--outline-variant)"}` }}
                >
                  <Icon size={13} style={{ color: "var(--primary)" }} />
                  <span className="text-xs" style={{ color: text }}>{widget.label}</span>
                  <Plus size={11} className="ml-auto" style={{ color: sub }} />
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Center: Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Toolbar */}
        <div
          className="flex items-center gap-2 px-4 py-3 flex-shrink-0 flex-wrap"
          style={{ backgroundColor: surface, borderBottom: `1px solid ${border}` }}
        >
          <button
            onClick={() => setView("library")}
            className="flex items-center gap-1.5 p-2 rounded-xl transition-colors hover:bg-muted"
            style={{ color: sub }}
          >
            <ArrowLeft size={15} />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <LayoutGrid size={15} style={{ color: "var(--primary)" }} />
            <input
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="text-sm font-semibold outline-none flex-1 min-w-0"
              style={{ color: text, backgroundColor: "transparent" }}
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setModal("ai", true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-primary-foreground"
              style={{ background: "linear-gradient(135deg, var(--ai), var(--ai))" }}
            >
              <Sparkles size={12} />
              Generate AI
            </button>
            <button
              onClick={() => setModal("schedule", true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
              style={{ border: `1px solid ${border}`, color: text, backgroundColor: "transparent" }}
            >
              <Calendar size={12} />
              Schedule
            </button>
            <button
              onClick={() => setModal("share", true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
              style={{ border: `1px solid ${border}`, color: text, backgroundColor: "transparent" }}
            >
              <Share2 size={12} />
              Share
            </button>
            <button
              onClick={() => setModal("export", true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
              style={{ border: `1px solid ${border}`, color: text, backgroundColor: "transparent" }}
            >
              <Download size={12} />
              Export
            </button>
            <button
              onClick={() => setPresentMode(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-primary-foreground"
              style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-strong))" }}
            >
              <Play size={12} />
              Present
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-y-auto p-4">
          <div
            ref={dropRef}
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: "var(--card)", border: `1px solid ${border}`, minHeight: 500 }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={() => setDragOver(false)}
          >
            {/* Report Header */}
            <div
              className="text-center p-5"
              style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-strong))" }}
            >
              <p className="text-xs text-primary-foreground/70 mb-1">CONFIDENTIAL · ACME CORP</p>
              <h2 className="text-xl font-bold text-primary-foreground mb-1">{reportTitle}</h2>
              <p className="text-xs text-primary-foreground/70">AI-Generated · May 13, 2026 · 47 Data Sources</p>
            </div>

            {/* Widgets Grid */}
            <div className="p-4 grid grid-cols-3 gap-3">
              <AnimatePresence mode="popLayout">
                {canvasWidgets.map((widget) => (
                  <motion.div
                    key={widget.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    draggable
                    onDragStart={() => setDragItemId(widget.id)}
                    onDragEnd={() => setDragItemId(null)}
                    className="group relative rounded-xl overflow-hidden"
                    style={{
                      gridColumn: `span ${widget.colSpan}`,
                      border: `1px solid ${dragItemId === widget.id ? "var(--primary)" : border}`,
                      backgroundColor: surface,
                      minHeight: 100,
                      opacity: dragItemId === widget.id ? 0.6 : 1,
                    }}
                  >
                    <button
                      onClick={() => removeWidget(widget.id)}
                      className="absolute top-2 right-2 w-5 h-5 rounded-full items-center justify-center bg-card shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 flex"
                      style={{ border: `1px solid ${border}`, color: "var(--outline)" }}
                    >
                      <X size={10} />
                    </button>
                    <div
                      className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
                      style={{ color: sub }}
                    >
                      <Grip size={12} />
                    </div>
                    <WidgetPreview type={widget.type} label={widget.label} />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Drop / Add zone */}
              <button
                onClick={() => addWidget("kpi_card")}
                className="rounded-xl flex flex-col items-center justify-center gap-2 py-8 transition-all"
                style={{
                  border: `2px dashed ${dragOver ? "var(--primary)" : ("var(--outline-variant)")}`,
                  backgroundColor: dragOver ? ("var(--primary-tint)") : "transparent",
                  minHeight: 100,
                }}
              >
                <Plus size={20} style={{ color: dragOver ? "var(--primary)" : sub }} />
                <span className="text-xs" style={{ color: sub }}>Add widget</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Settings Panel */}
      <ReportSettingsPanel
        reportTitle={reportTitle}
        setReportTitle={setReportTitle}
        activeTemplate={activeTemplate}
        canvasWidgets={canvasWidgets}
        onAI={() => setModal("ai", true)}
        onSchedule={() => setModal("schedule", true)}
        onShare={() => setModal("share", true)}
        onExport={() => setModal("export", true)}
        onPresent={() => setPresentMode(true)}
      />

      {/* Modals */}
      <AnimatePresence>
        {modals.ai && (
          <AIGenerateModal
            onClose={() => setModal("ai", false)}
            onComplete={() => {
              setModal("ai", false);
              loadTemplate(activeTemplate);
            }}
          />
        )}
        {modals.schedule && <ScheduleModal onClose={() => setModal("schedule", false)} />}
        {modals.share && <ShareModal onClose={() => setModal("share", false)} />}
        {modals.export && <ExportModal reportTitle={reportTitle} onClose={() => setModal("export", false)} />}
      </AnimatePresence>
    </div>
  );
}
