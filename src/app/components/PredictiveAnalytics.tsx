import { useState } from "react";
import { alpha } from "../lib/color";
import {
  TrendingUp, TrendingDown, AlertTriangle, Brain,
  RefreshCw, Download
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { motion } from "motion/react";

const revenueforecast = [
  { month: "Jan", actual: 5.9, p10: undefined, p50: undefined, p90: undefined },
  { month: "Feb", actual: 6.2, p10: undefined, p50: undefined, p90: undefined },
  { month: "Mar", actual: 6.4, p10: undefined, p50: undefined, p90: undefined },
  { month: "Apr", actual: 6.1, p10: undefined, p50: undefined, p90: undefined },
  { month: "May", actual: 6.8, p10: 6.8, p50: 6.8, p90: 6.8 },
  { month: "Jun", actual: undefined, p10: 7.0, p50: 7.3, p90: 7.7 },
  { month: "Jul", actual: undefined, p10: 7.2, p50: 7.7, p90: 8.2 },
  { month: "Aug", actual: undefined, p10: 7.5, p50: 8.1, p90: 8.7 },
  { month: "Sep", actual: undefined, p10: 7.8, p50: 8.6, p90: 9.4 },
  { month: "Oct", actual: undefined, p10: 8.1, p50: 9.1, p90: 10.1 },
];

const churnData = [
  { month: "Jul", predicted: 5.2, actual: 5.0 },
  { month: "Aug", predicted: 5.4, actual: 5.1 },
  { month: "Sep", predicted: 5.8, actual: 5.7 },
  { month: "Oct", predicted: 6.1, actual: 6.3 },
  { month: "Nov", predicted: 6.4, actual: 6.2 },
  { month: "Dec", predicted: 5.9, actual: 5.8 },
  { month: "Jan", predicted: 5.6, actual: 5.5 },
  { month: "Feb", predicted: 6.2, actual: undefined },
  { month: "Mar", predicted: 7.1, actual: undefined },
  { month: "Apr", predicted: 7.8, actual: undefined },
  { month: "May", predicted: 8.2, actual: undefined },
];

const supplyChainData = [
  { week: "W1", on_time: 94, risk_score: 22 },
  { week: "W2", on_time: 91, risk_score: 31 },
  { week: "W3", on_time: 87, risk_score: 45 },
  { week: "W4", on_time: 82, risk_score: 58 },
  { week: "W5", on_time: 78, risk_score: 67 },
  { week: "W6", on_time: 76, risk_score: 71 },
  { week: "W7", on_time: undefined, risk_score: 75 },
  { week: "W8", on_time: undefined, risk_score: 72 },
];

const scenarioData = (pricingIncrease: number, marketingSpend: number) => [
  { quarter: "Q2 25", revenue: 6.8 },
  { quarter: "Q3 25", revenue: +(7.2 * (1 + pricingIncrease / 100) * (1 + marketingSpend / 200)).toFixed(2) },
  { quarter: "Q4 25", revenue: +(8.1 * (1 + pricingIncrease / 100) * (1 + marketingSpend / 200)).toFixed(2) },
  { quarter: "Q1 26", revenue: +(9.0 * (1 + pricingIncrease / 100) * (1 + marketingSpend / 200)).toFixed(2) },
];

const PredictionCard = ({
  title, value, trend, change, confidence, children, color = "var(--primary)"
}: {
  title: string; value: string; trend: "up" | "down" | "neutral";
  change: string; confidence: number; children: React.ReactNode; color?: string;
}) => (
  <div className="bg-card rounded-2xl overflow-hidden" style={{ border: "1px solid var(--surface-track)" }}>
    <div className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--outline)" }}>{title}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{value}</span>
            <span
              className="text-xs font-semibold flex items-center gap-0.5"
              style={{ color: trend === "up" ? "var(--success)" : trend === "down" ? "var(--error)" : "var(--warning)" }}
            >
              {trend === "up" ? <TrendingUp size={12} /> : trend === "down" ? <TrendingDown size={12} /> : null}
              {change}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs" style={{ color: "var(--outline)" }}>Confidence</span>
          <div className="flex items-center gap-1.5">
            <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--surface-track)" }}>
              <div className="h-full rounded-full" style={{ width: `${confidence}%`, backgroundColor: color }} />
            </div>
            <span className="text-xs font-bold" style={{ color }}>{confidence}%</span>
          </div>
        </div>
      </div>
    </div>
    <div className="px-5 pb-5">{children}</div>
  </div>
);

export function PredictiveAnalytics() {
  const [pricingSlider, setPricingSlider] = useState(5);
  const [marketingSlider, setMarketingSlider] = useState(10);
  const [hiringSlider, setHiringSlider] = useState(20);

  const currentScenario = scenarioData(pricingSlider, marketingSlider);
  const baseScenario = scenarioData(0, 0);
  const projectedQ1 = currentScenario[currentScenario.length - 1].revenue;
  const baseQ1 = baseScenario[baseScenario.length - 1].revenue;
  const uplift = (((projectedQ1 - baseQ1) / baseQ1) * 100).toFixed(1);

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>Predictive Analytics</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>AI-powered forecasting & scenario simulation</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:shadow-sm"
            style={{ border: "1px solid var(--outline-variant)", color: "var(--muted-foreground)", backgroundColor: "var(--card)" }}
          >
            <RefreshCw size={14} />
            Refresh Models
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-primary-foreground transition-all hover:shadow-md"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-strong))" }}
          >
            <Download size={14} />
            Export Forecast
          </button>
        </div>
      </div>

      {/* Forecast Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Forecast */}
        <PredictionCard
          title="Revenue Forecast" value="$9.1M" trend="up" change="+34% by Oct"
          confidence={89} color="var(--primary)"
        >
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={revenueforecast} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="pred-rangeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
              <XAxis interval={0} dataKey="month" tick={{ fill: "var(--outline)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis interval={0} tick={{ fill: "var(--outline)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}M`} domain={[5, 11]} />
              <Tooltip formatter={(v: any) => v ? `$${v}M` : "N/A"} />
              <ReferenceLine x="May" stroke="var(--outline-variant)" strokeDasharray="4 4" label={{ value: "Now", fill: "var(--outline)", fontSize: 11 }} />
              <Area type="monotone" dataKey="p90" stroke="none" fill="var(--primary-container)" fillOpacity={0.5} name="90th pct" isAnimationActive={false} />
              <Area type="monotone" dataKey="p10" stroke="none" fill="var(--primary-foreground)" name="10th pct" isAnimationActive={false} />
              <Line type="monotone" dataKey="actual" stroke="var(--primary-strong)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--primary-strong)" }} name="Actual" connectNulls={false} />
              <Line type="monotone" dataKey="p50" stroke="var(--primary)" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 3, fill: "var(--primary)" }} name="Forecast" connectNulls={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 flex gap-3">
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--muted-foreground)" }}>
              <div className="w-8 h-0.5" style={{ backgroundColor: "var(--primary-strong)" }} />P50 Forecast
            </div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--muted-foreground)" }}>
              <div className="w-8 h-3 rounded-sm opacity-40" style={{ backgroundColor: "var(--primary)" }} />P10–P90 Range
            </div>
          </div>
        </PredictionCard>

        {/* Churn Prediction */}
        <PredictionCard
          title="Customer Churn Prediction" value="8.2%" trend="down" change="+2.3pts risk"
          confidence={91} color="var(--error)"
        >
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={churnData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
              <XAxis interval={0} dataKey="month" tick={{ fill: "var(--outline)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis interval={0} tick={{ fill: "var(--outline)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v: any) => v ? `${v}%` : "N/A"} />
              <ReferenceLine y={7} stroke="var(--error)" strokeDasharray="3 3" label={{ value: "Risk Threshold", fill: "var(--error)", fontSize: 11 }} />
              <Line type="monotone" dataKey="actual" stroke="var(--muted-foreground)" strokeWidth={2} dot={{ r: 3 }} name="Actual" connectNulls={false} />
              <Line type="monotone" dataKey="predicted" stroke="var(--error)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: "var(--error)" }} name="AI Predicted" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 p-2.5 rounded-xl flex items-start gap-2" style={{ backgroundColor: "var(--error-container)" }}>
            <AlertTriangle size={13} style={{ color: "var(--error)", marginTop: 1, flexShrink: 0 }} />
            <p className="text-xs" style={{ color: "var(--error)" }}>
              <strong>142 high-value customers</strong> flagged as at-risk. Proactive outreach recommended within 7 days.
            </p>
          </div>
        </PredictionCard>

        {/* Supply Chain Risk */}
        <PredictionCard
          title="Supply Chain Reliability" value="76%" trend="down" change="-18% from baseline"
          confidence={87} color="var(--warning)"
        >
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={supplyChainData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="pred-riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--error)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--error)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pred-otGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
              <XAxis interval={0} dataKey="week" tick={{ fill: "var(--outline)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis interval={0} tick={{ fill: "var(--outline)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="on_time" stroke="var(--success)" strokeWidth={2} fill="url(#pred-otGrad)" name="On-Time Delivery %" connectNulls={false} isAnimationActive={false} />
              <Area type="monotone" dataKey="risk_score" stroke="var(--error)" strokeWidth={2} fill="url(#pred-riskGrad)" strokeDasharray="4 4" name="Risk Score" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 p-2.5 rounded-xl flex items-start gap-2" style={{ backgroundColor: "var(--warning-container)" }}>
            <AlertTriangle size={13} style={{ color: "var(--warning)", marginTop: 1, flexShrink: 0 }} />
            <p className="text-xs" style={{ color: "var(--on-warning-container)" }}>
              Singapore port congestion reaching critical levels. Diversify to Kuala Lumpur route.
            </p>
          </div>
        </PredictionCard>

        {/* What-If Simulation */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-5"
          style={{ border: "1px solid var(--surface-track)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--ai), var(--ai))" }}
            >
              <Brain size={16} color="var(--primary-foreground)" />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>What-If Simulation</p>
              <p className="text-xs" style={{ color: "var(--outline)" }}>Adjust variables to model outcomes</p>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-5 mb-5">
            {[
              {
                label: "Pricing Increase", value: pricingSlider, min: 0, max: 20,
                onChange: setPricingSlider, unit: "%", color: "var(--primary)",
              },
              {
                label: "Marketing Spend Increase", value: marketingSlider, min: 0, max: 50,
                onChange: setMarketingSlider, unit: "%", color: "var(--success)",
              },
              {
                label: "Engineering Hiring", value: hiringSlider, min: 0, max: 100,
                onChange: setHiringSlider, unit: "FTEs", color: "var(--ai)",
              },
            ].map(({ label, value, min, max, onChange, unit, color }) => (
              <div key={label}>
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>{label}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: alpha(color, "22"), color }}>
                    +{value}{unit}
                  </span>
                </div>
                <input
                  type="range" min={min} max={max} value={value}
                  onChange={(e) => onChange(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: color }}
                />
              </div>
            ))}
          </div>

          {/* Scenario Result */}
          <div
            className="p-4 rounded-xl"
            style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--ai) 100%)" }}
          >
            <p className="text-xs text-primary-foreground/70 mb-1">Projected Q1 2026 Revenue</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary-foreground">${projectedQ1}M</span>
              <span className="text-sm font-semibold text-success">+{uplift}% vs base</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { label: "ROI", value: `${(pricingSlider * 9.2).toFixed(0)}%` },
                { label: "Payback", value: `${Math.max(1, 18 - pricingSlider)}mo` },
                { label: "Confidence", value: "86%" },
              ].map(({ label, value }) => (
                <div key={label} className="text-center p-2 rounded-lg bg-primary-foreground/10">
                  <div className="text-sm font-bold text-primary-foreground">{value}</div>
                  <div className="text-xs text-primary-foreground/60">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={100} className="mt-3">
            <BarChart data={currentScenario} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
              <XAxis interval={0} dataKey="quarter" tick={{ fill: "var(--outline)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis interval={0} tick={{ fill: "var(--outline)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}M`} />
              <Tooltip formatter={(v: any) => `$${v}M`} />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]} name="Projected Revenue" fill="var(--primary)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
