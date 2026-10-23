import { useState } from "react";
import { alpha } from "../lib/color";
import {
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Brain, Zap,
  ArrowUpRight, ArrowDownRight, MoreHorizontal, RefreshCw, ExternalLink,
  ChevronRight, Sparkles, Activity, Users, DollarSign, Shield, Clock,
  X, Database, Eye, BarChart2, Target, Cpu, Lock
} from "lucide-react";
import {
  ComposedChart, AreaChart, Area, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceDot
} from "recharts";
import { motion, AnimatePresence } from "motion/react";

const revenueData = [
  { month: "Jun", revenue: 4.2, target: 4.0 },
  { month: "Jul", revenue: 4.5, target: 4.3 },
  { month: "Aug", revenue: 4.1, target: 4.5 },
  { month: "Sep", revenue: 4.8, target: 4.6 },
  { month: "Oct", revenue: 5.2, target: 4.8 },
  { month: "Nov", revenue: 5.6, target: 5.0 },
  { month: "Dec", revenue: 5.1, target: 5.2 },
  { month: "Jan", revenue: 5.9, target: 5.3 },
  { month: "Feb", revenue: 6.2, target: 5.5 },
  { month: "Mar", revenue: 6.4, target: 5.8 },
  { month: "Apr", revenue: 6.1, target: 6.0 },
  { month: "May", revenue: 6.8, target: 6.2 },
];

const forecastData = [
  { month: "May", forecast: 6.8 },
  { month: "Jun", forecast: 7.2 },
  { month: "Jul", forecast: 7.6 },
  { month: "Aug", forecast: 7.9 },
  { month: "Sep", forecast: 8.3 },
  { month: "Oct", forecast: 8.8 },
];

const riskData = [
  { region: "North America", risk: 15, color: "var(--success)" },
  { region: "Europe", risk: 28, color: "var(--warning)" },
  { region: "APAC", risk: 67, color: "var(--error)" },
  { region: "Latin America", risk: 35, color: "var(--warning)" },
  { region: "Middle East", risk: 42, color: "var(--orange)" },
];

const kpiCards = [
  {
    title: "Total Revenue", value: "$6.8M", change: "+12.4%", positive: true,
    icon: DollarSign, color: "var(--primary)", bgColor: "var(--primary-container)",
    sparkData: [3.2, 3.8, 4.1, 4.5, 5.2, 5.6, 6.1, 6.8],
  },
  {
    title: "Profit Margin", value: "23.6%", change: "+2.1%", positive: true,
    icon: TrendingUp, color: "var(--success)", bgColor: "var(--success-container)",
    sparkData: [18, 19.5, 20, 21, 22, 22.5, 23, 23.6],
  },
  {
    title: "Customer Retention", value: "94.2%", change: "-0.8%", positive: false,
    icon: Users, color: "var(--warning)", bgColor: "var(--warning-container)",
    sparkData: [95.8, 95.5, 95, 94.8, 95.1, 94.5, 94.3, 94.2],
  },
  {
    title: "Operational Health", value: "87/100", change: "+5pts", positive: true,
    icon: Activity, color: "var(--info)", bgColor: "var(--info-container)",
    sparkData: [72, 75, 79, 80, 83, 84, 86, 87],
  },
  {
    title: "AI Risk Score", value: "Low 2.4", change: "Stable", positive: true,
    icon: Shield, color: "var(--ai)", bgColor: "var(--ai-container)",
    sparkData: [3.8, 3.5, 3.1, 2.9, 2.7, 2.6, 2.5, 2.4],
  },
];

const workflows = [
  { title: "Q3 Budget Reallocation", owner: "Finance Team", priority: "High", risk: 85, due: "May 15", status: "urgent" },
  { title: "APAC Market Expansion", owner: "Strategy Team", priority: "Medium", risk: 62, due: "May 22", status: "review" },
  { title: "Supply Chain Optimization", owner: "Operations", priority: "High", risk: 78, due: "May 18", status: "urgent" },
];

const aiRecommendations = [
  {
    title: "Reduce APAC operational risk",
    summary: "AI detected 67% risk increase in APAC. Recommend immediate review of logistics partners.",
    confidence: 94, type: "risk", color: "var(--error)", bg: "var(--error-container)",
  },
  {
    title: "Optimize European pricing",
    summary: "Price sensitivity analysis suggests 5% increase can boost EU revenue by ~$480K.",
    confidence: 87, type: "opportunity", color: "var(--success)", bg: "var(--success-container)",
  },
  {
    title: "Customer churn prevention",
    summary: "142 high-value customers flagged as churn risk. Proactive outreach recommended.",
    confidence: 91, type: "alert", color: "var(--warning)", bg: "var(--warning-container)",
  },
];

const MiniSparkline = ({ data, color }: { data: number[]; color: string }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80, h = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h} className="opacity-70">
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-card rounded-xl shadow-xl p-3 border text-sm" style={{ borderColor: "var(--surface-track)" }}>
        <p className="font-semibold mb-1" style={{ color: "var(--foreground)" }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <span className="font-medium">{typeof p.value === 'number' ? `$${p.value}M` : p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function ExplainAIModal({ onClose }: { onClose: () => void }) {
  const dataSources = [
    { icon: Database, label: "Snowflake Data Warehouse", desc: "2.4B rows ingested daily", color: "var(--info)" },
    { icon: BarChart2, label: "Salesforce CRM", desc: "142K accounts · Real-time sync", color: "var(--info)" },
    { icon: Activity, label: "Operational Metrics", desc: "48 AWS services monitored", color: "var(--warning)" },
    { icon: Users, label: "HR & Workforce Data", desc: "Employee performance signals", color: "var(--success)" },
  ];
  const modelSteps = [
    { icon: Cpu, label: "Data Ingestion", desc: "Raw signals from 12 connected sources are normalized and validated in real-time." },
    { icon: Eye, label: "Feature Extraction", desc: "300+ business features extracted: revenue trends, churn signals, risk indicators, market factors." },
    { icon: Brain, label: "Ensemble Prediction", desc: "XGBoost + LSTM neural network ensemble generates probabilistic forecasts with uncertainty bands." },
    { icon: Target, label: "Confidence Scoring", desc: "Calibrated via Platt scaling. Scores reflect true probability — 92% confidence means ~92% historical accuracy." },
    { icon: Lock, label: "Explainability Layer", desc: "SHAP values computed per decision so every recommendation traces to specific contributing factors." },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "color-mix(in srgb, var(--scrim) 50%, transparent)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "var(--surface-track)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-strong))" }}>
                <Brain size={20} color="var(--primary-foreground)" />
              </div>
              <div>
                <h2 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>How DecisionOS AI Works</h2>
                <p className="text-xs" style={{ color: "var(--outline)" }}>Model v2.4 · Updated May 2026 · ISO 27001 Certified</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
              <X size={18} style={{ color: "var(--muted-foreground)" }} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Accuracy Banner */}
            <div className="rounded-xl p-4 flex items-center gap-4" style={{ background: "linear-gradient(135deg, var(--primary-tint), var(--primary-container))" }}>
              <div className="text-center">
                <div className="text-3xl font-black" style={{ color: "var(--primary)" }}>97.2%</div>
                <div className="text-xs font-medium" style={{ color: "var(--primary-strong)" }}>Prediction Accuracy</div>
              </div>
              <div className="w-px h-12 bg-primary-container" />
              <div className="text-center">
                <div className="text-3xl font-black" style={{ color: "var(--primary)" }}>340ms</div>
                <div className="text-xs font-medium" style={{ color: "var(--primary-strong)" }}>Avg Inference Time</div>
              </div>
              <div className="w-px h-12 bg-primary-container" />
              <div className="text-center">
                <div className="text-3xl font-black" style={{ color: "var(--primary)" }}>2.4B</div>
                <div className="text-xs font-medium" style={{ color: "var(--primary-strong)" }}>Training Data Points</div>
              </div>
              <div className="flex-1 text-sm leading-relaxed" style={{ color: "var(--primary-strong)" }}>
                Validated against 18 months of historical decisions across 200+ enterprise customers.
              </div>
            </div>

            {/* Data Sources */}
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>Data Sources</h3>
              <div className="grid grid-cols-2 gap-3">
                {dataSources.map(({ icon: Icon, label, desc, color }) => (
                  <div key={label} className="flex items-center gap-3 p-3 rounded-xl" style={{ border: "1px solid var(--surface-track)", backgroundColor: "var(--page)" }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: alpha(color, "22") }}>
                      <Icon size={15} style={{ color }} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{label}</div>
                      <div className="text-xs" style={{ color: "var(--outline)" }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Model Pipeline */}
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>How Recommendations Are Generated</h3>
              <div className="space-y-2">
                {modelSteps.map(({ icon: Icon, label, desc }, idx) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-strong))" }}>
                        <Icon size={14} color="var(--primary-foreground)" />
                      </div>
                      {idx < modelSteps.length - 1 && <div className="w-px flex-1 mt-1" style={{ backgroundColor: "var(--outline-variant)", minHeight: 16 }} />}
                    </div>
                    <div className="pb-3">
                      <div className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{label}</div>
                      <div className="text-xs leading-relaxed mt-0.5" style={{ color: "var(--muted-foreground)" }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Confidence Guide */}
            <div className="rounded-xl p-4" style={{ backgroundColor: "var(--page)", border: "1px solid var(--surface-track)" }}>
              <h3 className="text-xs font-semibold mb-3" style={{ color: "var(--foreground)" }}>Confidence Score Guide</h3>
              <div className="space-y-2">
                {[
                  { range: "90–100%", label: "High Confidence", desc: "Act on recommendation; model highly certain", color: "var(--success)" },
                  { range: "75–89%", label: "Moderate Confidence", desc: "Review supporting evidence before acting", color: "var(--warning)" },
                  { range: "< 75%", label: "Exploratory", desc: "Use as signal, apply additional judgment", color: "var(--error)" },
                ].map(({ range, label, desc, color }) => (
                  <div key={range} className="flex items-center gap-3">
                    <div className="w-16 text-xs font-bold" style={{ color }}>{range}</div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{label}</div>
                      <div className="text-xs" style={{ color: "var(--outline)" }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function Dashboard({ onViewChange }: { onViewChange: (v: string) => void }) {
  const [aiExpanded, setAiExpanded] = useState(false);
  const [explainAIOpen, setExplainAIOpen] = useState(false);

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-screen-2xl mx-auto">
      {/* AI Executive Summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-strong) 60%, var(--on-primary-container) 100%)",
          boxShadow: "0 4px 24px color-mix(in srgb, var(--primary) 30%, transparent)",
        }}
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "color-mix(in srgb, var(--primary-foreground) 15%, transparent)" }}
              >
                <Brain size={20} color="var(--primary-foreground)" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wider">AI Executive Summary</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary-foreground/20 text-primary-foreground font-medium">Live • Updated 2m ago</span>
                </div>
                <h2 className="text-lg font-bold text-primary-foreground mt-0.5">Good morning, Jane. Here's your business intelligence brief.</h2>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setExplainAIOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10"
                style={{ border: "1px solid color-mix(in srgb, var(--primary-foreground) 20%, transparent)" }}
              >
                <Sparkles size={13} />
                Explain AI
              </button>
              <button
                onClick={() => onViewChange("reports")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-primary-foreground transition-all hover:bg-primary-foreground/20 active:scale-95"
                style={{ backgroundColor: "color-mix(in srgb, var(--primary-foreground) 15%, transparent)" }}
              >
                Generate Report
                <ArrowUpRight size={13} />
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                icon: TrendingUp, color: "var(--primary-soft)",
                text: "Revenue increased 12.4% this quarter — strongest Q2 performance in 3 years.",
              },
              {
                icon: AlertTriangle, color: "var(--warning)",
                text: "Operational risk detected in APAC region. Logistics disruption probability at 67%.",
              },
              {
                icon: Activity, color: "var(--success-container)",
                text: "AI predicts customer churn may increase by 8% next month without intervention.",
              },
            ].map(({ icon: Icon, color, text }, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ backgroundColor: "color-mix(in srgb, var(--primary-foreground) 10%, transparent)" }}
              >
                <Icon size={16} style={{ color, flexShrink: 0, marginTop: 2 }} />
                <p className="text-sm text-primary-foreground/85 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          {/* AI Confidence */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-primary-foreground/70">AI Confidence Score:</span>
              <span className="text-xs font-bold text-primary-foreground">96%</span>
            </div>
            <div className="h-1.5 flex-1 rounded-full bg-primary-foreground/10 max-w-32">
              <div className="h-full rounded-full bg-primary-foreground/60" style={{ width: "96%" }} />
            </div>
            <span className="text-xs text-primary-foreground/50">Based on 47 data sources</span>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              className="bg-card rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md group"
              style={{ border: "1px solid var(--surface-track)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: kpi.bgColor }}
                >
                  <Icon size={15} style={{ color: kpi.color }} />
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--outline)" }}>
                  <MoreHorizontal size={14} />
                </button>
              </div>
              <div className="text-2xl font-bold mb-0.5" style={{ color: "var(--foreground)" }}>{kpi.value}</div>
              <div className="text-xs mb-2" style={{ color: "var(--outline)" }}>{kpi.title}</div>
              <div className="flex items-center justify-between">
                <span
                  className="flex items-center gap-0.5 text-xs font-medium"
                  style={{ color: kpi.positive ? "var(--success)" : "var(--error)" }}
                >
                  {kpi.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {kpi.change}
                </span>
                <MiniSparkline data={kpi.sparkData} color={kpi.color} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-card rounded-2xl p-5 lg:col-span-2"
          style={{ border: "1px solid var(--surface-track)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>Revenue Trend</h3>
              <p className="text-xs" style={{ color: "var(--outline)" }}>Actual vs Target · Last 12 months</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--muted-foreground)" }}>
                <div className="w-3 h-0.5 rounded" style={{ backgroundColor: "var(--primary)" }} />
                Actual
              </div>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--muted-foreground)" }}>
                <div className="w-3 h-0.5 rounded border-dashed border-t-2" style={{ borderColor: "var(--outline-variant)" }} />
                Target
              </div>
              <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" style={{ color: "var(--outline)" }}>
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={revenueData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="dash-revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
              <XAxis interval={0} dataKey="month" tick={{ fill: "var(--outline)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis interval={0} tick={{ fill: "var(--outline)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}M`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2.5} fill="url(#dash-revGrad)" name="Revenue" dot={false} activeDot={{ r: 5, fill: "var(--primary)" }} isAnimationActive={false} />
              <Line type="monotone" dataKey="target" stroke="var(--outline-variant)" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Risk Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-card rounded-2xl p-5"
          style={{ border: "1px solid var(--surface-track)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>Regional Risk Score</h3>
              <p className="text-xs" style={{ color: "var(--outline)" }}>AI-assessed operational risk</p>
            </div>
            <button onClick={() => onViewChange("analytics")} style={{ color: "var(--primary)" }}>
              <ExternalLink size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {riskData.map((item) => (
              <div key={item.region}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: "var(--muted-foreground)" }}>{item.region}</span>
                  <span className="font-semibold" style={{ color: item.color }}>{item.risk}%</span>
                </div>
                <div className="h-2 rounded-full" style={{ backgroundColor: "var(--muted)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.risk}%` }}
                    transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-xl" style={{ backgroundColor: "var(--error-container)" }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} style={{ color: "var(--error)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--error)" }}>APAC requires immediate attention</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Forecast + Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Predictive Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-2xl p-5"
          style={{ border: "1px solid var(--surface-track)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>Revenue Forecast</h3>
              <p className="text-xs" style={{ color: "var(--outline)" }}>AI-predicted next 6 months</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: "var(--primary-container)", color: "var(--primary)" }}>
              97% confidence
            </span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={forecastData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="dash-foreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
              <XAxis interval={0} dataKey="month" tick={{ fill: "var(--outline)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis interval={0} tick={{ fill: "var(--outline)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}M`} />
              <Tooltip formatter={(v: any) => `$${v}M`} />
              <ReferenceLine x="May" stroke="var(--outline-variant)" strokeDasharray="3 3" label={{ value: "Now", fill: "var(--outline)", fontSize: 11 }} />
              <Area type="monotone" dataKey="forecast" stroke="var(--success)" strokeWidth={2} strokeDasharray="5 5" fill="url(#dash-foreGrad)" dot={{ r: 3, fill: "var(--success)" }} name="Forecast" isAnimationActive={false} />
              <ReferenceDot x="May" y={6.8} r={5} fill="var(--primary)" stroke="var(--primary-foreground)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: "var(--success-container)" }}>
            <TrendingUp size={14} style={{ color: "var(--success)" }} />
            <span className="text-xs font-medium" style={{ color: "var(--success)" }}>+29% growth projected by Q4</span>
          </div>
        </motion.div>

        {/* Active Workflows */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-card rounded-2xl p-5"
          style={{ border: "1px solid var(--surface-track)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>Active Workflows</h3>
            <button
              onClick={() => onViewChange("workflows")}
              className="text-xs font-medium flex items-center gap-1"
              style={{ color: "var(--primary)" }}
            >
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div className="space-y-3">
            {workflows.map((wf, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl cursor-pointer hover:bg-page transition-colors"
                style={{ border: "1px solid var(--muted)" }}
              >
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: wf.status === "urgent" ? "var(--error)" : "var(--warning)" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>{wf.title}</p>
                  <p className="text-xs" style={{ color: "var(--outline)" }}>{wf.owner}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div
                    className="text-xs font-semibold"
                    style={{ color: wf.risk > 60 ? "var(--error)" : "var(--warning)" }}
                  >
                    Risk: {wf.risk}%
                  </div>
                  <div className="flex items-center gap-1 text-xs" style={{ color: "var(--outline)" }}>
                    <Clock size={10} />
                    {wf.due}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card rounded-2xl p-5"
          style={{ border: "1px solid var(--surface-track)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>AI Recommendations</h3>
            <button
              onClick={() => onViewChange("insights")}
              className="text-xs font-medium flex items-center gap-1"
              style={{ color: "var(--primary)" }}
            >
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div className="space-y-3">
            {aiRecommendations.map((rec, i) => (
              <div
                key={i}
                className="p-3 rounded-xl cursor-pointer transition-all hover:shadow-sm"
                style={{ backgroundColor: rec.bg, border: `1px solid ${alpha(rec.color, "22")}` }}
              >
                <div className="flex items-start gap-2 mb-1.5">
                  <Zap size={13} style={{ color: rec.color, marginTop: 2, flexShrink: 0 }} />
                  <p className="text-xs font-semibold" style={{ color: rec.color }}>{rec.title}</p>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{rec.summary}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs" style={{ color: "var(--outline)" }}>Confidence: {rec.confidence}%</span>
                  <button className="text-xs font-medium" style={{ color: rec.color }}>
                    Take action →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {explainAIOpen && <ExplainAIModal onClose={() => setExplainAIOpen(false)} />}
    </div>
  );
}
