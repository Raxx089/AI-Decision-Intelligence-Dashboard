import { useState } from "react";
import { alpha } from "../lib/color";
import {
  AlertTriangle, TrendingUp, Lightbulb, Zap, Filter, Brain,
  ChevronRight, ArrowUpRight, Clock, BarChart2, Eye, Shield,
  RefreshCw, Search
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type InsightType = "risk" | "opportunity" | "anomaly" | "recommendation";
type Severity = "critical" | "high" | "medium" | "low";

interface Insight {
  id: string;
  type: InsightType;
  title: string;
  summary: string;
  severity: Severity;
  confidence: number;
  department: string;
  businessUnit: string;
  timestamp: string;
  supporting: string[];
  action: string;
  impact: string;
}

const insights: Insight[] = [
  {
    id: "1", type: "risk", title: "APAC Supply Chain Critical Disruption Risk",
    summary: "AI detected a 67% probability of supply chain disruption affecting APAC operations. Singapore port congestion + monsoon season compounding effects identified across 23 logistics nodes.",
    severity: "critical", confidence: 94, department: "Operations", businessUnit: "APAC",
    timestamp: "2 hours ago", supporting: ["Port congestion data", "Weather forecasts", "Carrier delays (+340%)"],
    action: "Activate contingency logistics plan B and engage 2 backup carriers",
    impact: "$1.2M potential delay exposure",
  },
  {
    id: "2", type: "anomaly", title: "Unusual Enterprise Spend Pattern Detected",
    summary: "3 enterprise accounts showing 300%+ expense increase this month vs. historical patterns. AI flagged potential unauthorized procurement activity.",
    severity: "high", confidence: 88, department: "Finance", businessUnit: "North America",
    timestamp: "4 hours ago", supporting: ["Expense reports", "PO system", "Approval logs"],
    action: "Trigger automated audit workflow for flagged accounts",
    impact: "$380K at risk",
  },
  {
    id: "3", type: "opportunity", title: "Mid-Market Expansion Window in Germany",
    summary: "Competitor exit from DACH market creates a $4.2M pipeline opportunity. AI identified 87 high-fit accounts with no current vendor.",
    severity: "high", confidence: 87, department: "Sales", businessUnit: "Europe",
    timestamp: "6 hours ago", supporting: ["Competitor news", "CRM gap analysis", "Market intelligence"],
    action: "Deploy targeted outbound campaign to 87 identified accounts",
    impact: "+$4.2M ARR potential",
  },
  {
    id: "4", type: "recommendation", title: "Optimize Cloud Infrastructure Spend",
    summary: "AI analysis of AWS billing data found $180K in annual savings through right-sizing and reserved instance optimization.",
    severity: "medium", confidence: 96, department: "Engineering", businessUnit: "All",
    timestamp: "8 hours ago", supporting: ["AWS Cost Explorer", "Utilization metrics", "Right-sizing analysis"],
    action: "Implement 3-step optimization plan (reserved instances, spot usage, auto-scaling)",
    impact: "$180K annual savings",
  },
  {
    id: "5", type: "risk", title: "Customer Churn Acceleration Signal",
    summary: "Product usage telemetry shows declining engagement among 142 enterprise accounts. Login frequency down 40%, feature adoption plateau detected 3 weeks ago.",
    severity: "high", confidence: 91, department: "Customer Success", businessUnit: "All",
    timestamp: "12 hours ago", supporting: ["Product analytics", "Support tickets (+65%)", "NPS trend"],
    action: "Initiate Executive Business Review for top 20 at-risk accounts",
    impact: "$2.8M ARR at risk",
  },
  {
    id: "6", type: "opportunity", title: "Upsell Opportunity: Advanced AI Module",
    summary: "48 existing customers using Basic plan have trigger patterns matching Advanced AI buyers. Average expansion revenue: $24K per account.",
    severity: "medium", confidence: 82, department: "Sales", businessUnit: "North America",
    timestamp: "1 day ago", supporting: ["Usage analytics", "Expansion playbook data", "Success patterns"],
    action: "Schedule QBR with CSM team to identify conversation-ready accounts",
    impact: "+$1.15M expansion potential",
  },
  {
    id: "7", type: "anomaly", title: "Security: Unusual API Access Pattern",
    summary: "Automated systems detected 4,200 API calls from an unrecognized IP range in South Korea between 02:00-04:00 UTC. Rate limiting triggered.",
    severity: "critical", confidence: 97, department: "Security", businessUnit: "Infrastructure",
    timestamp: "30 minutes ago", supporting: ["API gateway logs", "IP intelligence", "Threat database"],
    action: "Block IP range, review access logs, notify security team",
    impact: "Potential data breach risk",
  },
  {
    id: "8", type: "recommendation", title: "Sales Velocity Improvement: Proposal Automation",
    summary: "Analysis shows 3.2-day reduction in deal velocity when proposals are auto-generated vs. manual. 68% of AEs still using manual templates.",
    severity: "low", confidence: 89, department: "Sales", businessUnit: "All",
    timestamp: "2 days ago", supporting: ["CRM data", "Win/loss analysis", "Time tracking"],
    action: "Roll out proposal automation tool to all AEs with training program",
    impact: "23% faster deal velocity",
  },
];

const typeConfig: Record<InsightType, { color: string; bg: string; icon: React.ElementType; label: string }> = {
  risk: { color: "var(--error)", bg: "var(--error-container)", icon: AlertTriangle, label: "Risk Alert" },
  opportunity: { color: "var(--success)", bg: "var(--success-container)", icon: TrendingUp, label: "Opportunity" },
  anomaly: { color: "var(--warning)", bg: "var(--warning-container)", icon: Zap, label: "Anomaly" },
  recommendation: { color: "var(--primary)", bg: "var(--primary-container)", icon: Lightbulb, label: "AI Recommendation" },
};

const severityConfig: Record<Severity, { color: string; bg: string }> = {
  critical: { color: "var(--error)", bg: "var(--error-container)" },
  high: { color: "var(--warning)", bg: "var(--warning-container)" },
  medium: { color: "var(--primary)", bg: "var(--primary-container)" },
  low: { color: "var(--success)", bg: "var(--success-container)" },
};

export function InsightsCenter() {
  const [activeFilter, setActiveFilter] = useState<InsightType | "all">("all");
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = insights.filter((i) => {
    const typeMatch = activeFilter === "all" || i.type === activeFilter;
    const sevMatch = severityFilter === "all" || i.severity === severityFilter;
    const searchMatch = !searchQuery || i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatch && sevMatch && searchMatch;
  });

  const counts = {
    risk: insights.filter((i) => i.type === "risk").length,
    opportunity: insights.filter((i) => i.type === "opportunity").length,
    anomaly: insights.filter((i) => i.type === "anomaly").length,
    recommendation: insights.filter((i) => i.type === "recommendation").length,
    critical: insights.filter((i) => i.severity === "critical").length,
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>AI Insights Center</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            {insights.length} AI-generated insights · {counts.critical} critical require action
          </p>
        </div>
        <button
          className="flex items-center gap-2 p-2 rounded-xl transition-colors hover:bg-muted"
          style={{ color: "var(--outline)", border: "1px solid var(--surface-track)", backgroundColor: "var(--card)" }}
        >
          <RefreshCw size={14} />
          <span className="text-xs font-medium hidden sm:block">Refresh</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Total Insights", value: insights.length, color: "var(--muted-foreground)", bg: "var(--muted)" },
          { label: "Risk Alerts", value: counts.risk, color: "var(--error)", bg: "var(--error-container)" },
          { label: "Opportunities", value: counts.opportunity, color: "var(--success)", bg: "var(--success-container)" },
          { label: "Anomalies", value: counts.anomaly, color: "var(--warning)", bg: "var(--warning-container)" },
          { label: "Recommendations", value: counts.recommendation, color: "var(--primary)", bg: "var(--primary-container)" },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            className="flex items-center gap-3 p-4 rounded-xl bg-card cursor-pointer transition-all hover:shadow-sm"
            style={{ border: "1px solid var(--surface-track)" }}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ backgroundColor: bg, color }}>
              {value}
            </div>
            <span className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--outline)" }} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search insights..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none"
            style={{ border: "1px solid var(--outline-variant)", backgroundColor: "var(--card)", color: "var(--foreground)" }}
          />
        </div>

        {/* Type filter */}
        <div className="flex gap-1.5 flex-wrap">
          {([["all", "All Types"], ["risk", "Risk"], ["opportunity", "Opportunity"], ["anomaly", "Anomaly"], ["recommendation", "Recommendation"]] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setActiveFilter(val)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                backgroundColor: activeFilter === val ? "var(--primary)" : "var(--card)",
                color: activeFilter === val ? "var(--card)" : "var(--muted-foreground)",
                border: activeFilter === val ? "none" : "1px solid var(--outline-variant)",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Severity filter */}
        <div className="flex gap-1.5">
          {([["all", "All"], ["critical", "Critical"], ["high", "High"], ["medium", "Medium"]] as const).map(([val, label]) => {
            const cfg = val !== "all" ? severityConfig[val] : null;
            return (
              <button
                key={val}
                onClick={() => setSeverityFilter(val)}
                className="px-2.5 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  backgroundColor: severityFilter === val ? (cfg?.bg || "var(--muted)") : "var(--card)",
                  color: severityFilter === val ? (cfg?.color || "var(--muted-foreground)") : "var(--muted-foreground)",
                  border: `1px solid ${severityFilter === val ? (alpha(cfg?.color, "55") || "var(--outline-variant)") : "var(--outline-variant)"}`,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((insight, i) => {
          const tc = typeConfig[insight.type];
          const sc = severityConfig[insight.severity];
          const Icon = tc.icon;
          const isExpanded = expandedId === insight.id;

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-md"
              style={{ border: `1px solid ${alpha(tc.color, "22")}` }}
              onClick={() => setExpandedId(isExpanded ? null : insight.id)}
            >
              {/* Card top color bar */}
              <div className="h-1" style={{ backgroundColor: tc.color }} />

              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: tc.bg }}>
                      <Icon size={15} style={{ color: tc.color }} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold" style={{ color: tc.color }}>{tc.label}</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className="text-xs font-medium px-1.5 py-0.5 rounded-full capitalize"
                          style={{ backgroundColor: sc.bg, color: sc.color }}
                        >
                          {insight.severity}
                        </span>
                        <span className="text-xs" style={{ color: "var(--outline)" }}>{insight.department}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-bold" style={{ color: "var(--primary)" }}>{insight.confidence}%</div>
                    <div className="text-xs" style={{ color: "var(--outline)" }}>confidence</div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-sm leading-snug mb-2" style={{ color: "var(--foreground)" }}>
                  {insight.title}
                </h3>

                {/* Summary */}
                <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--muted-foreground)" }}>
                  {isExpanded ? insight.summary : insight.summary.slice(0, 100) + "..."}
                </p>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden space-y-3"
                    >
                      {/* Supporting data */}
                      <div>
                        <p className="text-xs font-semibold mb-1.5" style={{ color: "var(--muted-foreground)" }}>Supporting Data</p>
                        <div className="flex flex-wrap gap-1.5">
                          {insight.supporting.map((s) => (
                            <span
                              key={s}
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Impact */}
                      <div className="p-3 rounded-xl" style={{ backgroundColor: "var(--page)" }}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <BarChart2 size={12} style={{ color: "var(--muted-foreground)" }} />
                          <span className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Estimated Impact</span>
                        </div>
                        <p className="text-sm font-bold" style={{ color: "var(--foreground)" }}>{insight.impact}</p>
                      </div>

                      {/* Recommended Action */}
                      <div
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: tc.bg, border: `1px solid ${alpha(tc.color, "33")}` }}
                      >
                        <p className="text-xs font-semibold mb-1" style={{ color: tc.color }}>Recommended Action</p>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{insight.action}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Footer */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 text-xs" style={{ color: "var(--outline)" }}>
                    <Clock size={10} />
                    {insight.timestamp}
                  </div>
                  <button
                    className="flex items-center gap-1 text-xs font-medium"
                    style={{ color: tc.color }}
                  >
                    {isExpanded ? "See less" : "See more"}
                    <ChevronRight size={12} style={{ transform: isExpanded ? "rotate(90deg)" : "none" }} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Lightbulb size={40} className="mx-auto mb-3" style={{ color: "var(--outline-variant)" }} />
          <p className="font-medium" style={{ color: "var(--muted-foreground)" }}>No insights found</p>
          <p className="text-sm" style={{ color: "var(--outline)" }}>Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
