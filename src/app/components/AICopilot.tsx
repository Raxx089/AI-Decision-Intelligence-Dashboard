import { useState, useRef, useEffect } from "react";
import {
  Send, Bot, User, Sparkles, BarChart2, TrendingUp,
  ExternalLink, ThumbsUp, ThumbsDown, Copy, RefreshCw,
  ChevronRight, Lightbulb, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  chart?: string;
  confidence?: number;
  sources?: string[];
  timestamp: Date;
}

const suggestedPrompts = [
  "Why did revenue drop in Europe last quarter?",
  "Forecast Q4 growth with current trends",
  "Show top 5 operational risks this week",
  "Which customers are at churn risk?",
  "Compare APAC vs North America performance",
  "What drove the profit margin improvement?",
];

const chartMap: Record<string, React.ReactNode> = {
  revenue_drop: (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={[
        { region: "Jan", eu: 1.8, na: 2.4 }, { region: "Feb", eu: 1.6, na: 2.6 },
        { region: "Mar", eu: 1.2, na: 2.5 }, { region: "Apr", eu: 0.9, na: 2.7 },
        { region: "May", eu: 1.1, na: 2.9 }, { region: "Jun", eu: 1.4, na: 3.1 },
      ]} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
        <XAxis interval={0} dataKey="region" tick={{ fill: "var(--outline)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis interval={0} tick={{ fill: "var(--outline)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}M`} />
        <Tooltip />
        <Legend />
        <Bar dataKey="eu" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Europe" />
        <Bar dataKey="na" fill="var(--success)" radius={[4, 4, 0, 0]} name="North America" />
      </BarChart>
    </ResponsiveContainer>
  ),
  q4_forecast: (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={[
        { month: "Jul", base: 7.2, optimistic: 7.6, pessimistic: 6.8 },
        { month: "Aug", base: 7.6, optimistic: 8.1, pessimistic: 7.1 },
        { month: "Sep", base: 8.1, optimistic: 8.7, pessimistic: 7.5 },
        { month: "Oct", base: 8.6, optimistic: 9.3, pessimistic: 7.9 },
        { month: "Nov", base: 9.2, optimistic: 10.0, pessimistic: 8.4 },
        { month: "Dec", base: 9.8, optimistic: 10.8, pessimistic: 8.9 },
      ]} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
        <XAxis interval={0} dataKey="month" tick={{ fill: "var(--outline)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis interval={0} tick={{ fill: "var(--outline)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}M`} />
        <Tooltip />
        <Area type="monotone" dataKey="pessimistic" stroke="var(--warning)" strokeWidth={1.5} fill="none" strokeDasharray="4 4" name="Pessimistic" />
        <Area type="monotone" dataKey="base" stroke="var(--primary)" strokeWidth={2.5} fill="url(#baseGrad)" name="Base Case" />
        <Area type="monotone" dataKey="optimistic" stroke="var(--success)" strokeWidth={1.5} fill="none" strokeDasharray="4 4" name="Optimistic" />
      </AreaChart>
    </ResponsiveContainer>
  ),
  operational_risks: (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart layout="vertical" data={[
        { area: "APAC Logistics", score: 67 },
        { area: "EU Compliance", score: 45 },
        { area: "Supply Chain", score: 58 },
        { area: "Cyber Security", score: 32 },
        { area: "Credit Risk", score: 28 },
      ]} margin={{ top: 5, right: 30, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
        <XAxis interval={0} type="number" tick={{ fill: "var(--outline)", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
        <YAxis interval={0} dataKey="area" type="category" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
        <Tooltip />
        <Bar dataKey="score" radius={[0, 4, 4, 0]} name="Risk Score"
          fill="var(--error)"
          label={{ position: 'right', fill: 'var(--error)', fontSize: 11, fontWeight: 500 }}
        />
      </BarChart>
    </ResponsiveContainer>
  ),
};

const aiResponses: Record<string, { content: string; chart?: string; confidence: number; sources: string[] }> = {
  "Why did revenue drop in Europe last quarter?": {
    content: `**Root Cause Analysis: European Revenue Decline**

Based on my analysis of 847 data points across your EU operations, the revenue decline in Europe was primarily driven by three interconnected factors:

1. **Currency headwinds (€/$ exchange rate -8.3%)** — contributed ~$340K impact on reported revenue
2. **Delayed enterprise renewals** — 12 major accounts pushed Q1 renewals to Q2 due to budget cycles
3. **Increased competition from local SaaS vendors** — particularly in DACH region

**Root cause**: The primary driver was macroeconomic currency pressure compounded by sales cycle elongation. The underlying business metrics (retention, NPS, product adoption) remain strong at 94%.

**Recommended actions:**
- Implement EUR-denominated pricing for key accounts
- Accelerate renewal pipeline for 8 at-risk accounts
- Launch DACH-specific competitive displacement campaign`,
    chart: "revenue_drop",
    confidence: 92,
    sources: ["Salesforce CRM", "Stripe Revenue Data", "FX Market Feed", "Support Tickets"],
  },
  "Forecast Q4 growth with current trends": {
    content: `**Q4 2026 Revenue Forecast Analysis**

Using ensemble ML models (XGBoost + Prophet + ARIMA) trained on 36 months of historical data:

**Base Case:** $9.8M (+44% YoY)
**Optimistic:** $10.8M (+59% YoY) — if APAC recovery succeeds
**Pessimistic:** $8.9M (+31% YoY) — if churn prevention fails

**Key growth drivers:**
- Enterprise expansion pipeline: $4.2M in late-stage deals
- New product launches: Estimated $1.1M contribution
- APAC market recovery: $600K upside potential

**Risk factors:**
- Customer churn headwind: -$280K if not addressed
- EU macro uncertainty: ±$400K variance`,
    chart: "q4_forecast",
    confidence: 87,
    sources: ["Revenue Data", "CRM Pipeline", "Product Analytics", "Market Intelligence"],
  },
  "Show top 5 operational risks this week": {
    content: `**Top 5 Operational Risks — Week of May 13, 2026**

I've analyzed real-time signals across your operational systems and identified the following critical risks:

1. **🔴 APAC Logistics Disruption (67% probability)** — Port congestion in Singapore affecting 23 supply chain nodes. Estimated impact: $1.2M revenue delay.

2. **🟡 Supply Chain Concentration (58%)** — Over-dependence on 2 tier-1 suppliers for 71% of critical components. Diversification required.

3. **🟡 EU Regulatory Compliance (45%)** — DORA compliance deadline June 2026. 3 processes need remediation.

4. **🟢 Cybersecurity Posture (32%)** — Minor vulnerability in API gateway (CVE-2026-1247). Patch available and scheduled.

5. **🟢 Credit Risk Exposure (28%)** — 2 enterprise clients with deteriorating payment patterns. AR monitoring recommended.

**Total risk-weighted financial exposure:** $3.4M`,
    chart: "operational_risks",
    confidence: 94,
    sources: ["Operations DB", "Supply Chain Monitor", "Compliance Tracker", "Security Scanner"],
  },
};

const defaultResponse = {
  content: `I've analyzed your query using DecisionOS AI's intelligence engine. Based on the available data across your connected data sources, here's what I found:\n\nThe data suggests a complex interplay of operational and market factors. I'd recommend diving deeper into the Predictive Analytics module for more granular forecasting, or the Decision Workflows section to take action on these insights.\n\nWould you like me to generate a detailed report or set up an alert for this metric?`,
  confidence: 78,
  sources: ["Internal Data Warehouse", "CRM System"],
};

export function AICopilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello Jane! I'm your DecisionOS AI Copilot. I can analyze your business data, generate insights, forecast trends, and help you make faster, smarter decisions. What would you like to explore today?",
      confidence: 100,
      sources: [],
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeChart, setActiveChart] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = aiResponses[text] || defaultResponse;
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        chart: response.chart,
        confidence: response.confidence,
        sources: response.sources,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      if (response.chart) setActiveChart(response.chart);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const formatContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <p key={i} className="font-semibold mt-3 mb-1" style={{ color: "var(--foreground)" }}>{line.slice(2, -2)}</p>;
      }
      if (line.startsWith("- ") || line.match(/^\d+\. /)) {
        return <li key={i} className="ml-4 text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{line.replace(/^- |^\d+\. /, "")}</li>;
      }
      if (line.trim() === "") return <br key={i} />;
      return <p key={i} className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{line}</p>;
    });
  };

  return (
    <div className="flex h-full" style={{ backgroundColor: "var(--page)" }}>
      {/* Chat Panel */}
      <div className="flex flex-col w-full lg:w-[50%] bg-card" style={{ borderRight: "1px solid var(--surface-track)" }}>
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: "1px solid var(--surface-track)" }}>
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--info))" }}
          >
            <Bot size={20} color="var(--primary-foreground)" />
          </div>
          <div>
            <h2 className="font-semibold" style={{ color: "var(--foreground)" }}>AI Copilot</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Online · GPT-4 Turbo + Custom Models</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="p-2 rounded-xl hover:bg-muted transition-colors" style={{ color: "var(--outline)" }}>
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                style={{
                  background: msg.role === "assistant"
                    ? "linear-gradient(135deg, var(--primary), var(--info))"
                    : "linear-gradient(135deg, var(--ai), var(--ai))",
                }}
              >
                {msg.role === "assistant" ? <Bot size={15} color="var(--primary-foreground)" /> : <User size={15} color="var(--primary-foreground)" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div
                  className="rounded-2xl px-4 py-3"
                  style={{
                    backgroundColor: msg.role === "user" ? "var(--primary)" : "var(--card)",
                    border: msg.role === "user" ? "none" : "1px solid var(--surface-track)",
                    color: msg.role === "user" ? "var(--card)" : "var(--muted-foreground)",
                    boxShadow: msg.role === "assistant" ? "0 1px 4px color-mix(in srgb, var(--scrim) 6%, transparent)" : "none",
                  }}
                >
                  {msg.role === "assistant" ? (
                    <ul className="space-y-0.5 list-none">{formatContent(msg.content)}</ul>
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                </div>

                {/* AI metadata */}
                {msg.role === "assistant" && msg.confidence && (
                  <div className="flex items-center gap-3 px-1">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="h-1.5 w-16 rounded-full overflow-hidden"
                        style={{ backgroundColor: "var(--surface-track)" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${msg.confidence}%`,
                            backgroundColor: msg.confidence > 90 ? "var(--success)" : msg.confidence > 75 ? "var(--warning)" : "var(--error)",
                          }}
                        />
                      </div>
                      <span className="text-xs" style={{ color: "var(--outline)" }}>{msg.confidence}% confident</span>
                    </div>
                    {msg.sources?.length ? (
                      <span className="text-xs" style={{ color: "var(--outline)" }}>
                        {msg.sources.length} sources
                      </span>
                    ) : null}
                    <div className="flex items-center gap-1 ml-auto">
                      <button className="p-1 rounded hover:bg-muted" style={{ color: "var(--outline)" }}><ThumbsUp size={11} /></button>
                      <button className="p-1 rounded hover:bg-muted" style={{ color: "var(--outline)" }}><ThumbsDown size={11} /></button>
                      <button className="p-1 rounded hover:bg-muted" style={{ color: "var(--outline)" }}><Copy size={11} /></button>
                    </div>
                  </div>
                )}

                {/* Sources */}
                {msg.sources?.length ? (
                  <div className="flex flex-wrap gap-1.5 px-1">
                    {msg.sources.map((s) => (
                      <span
                        key={s}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "var(--primary-container)", color: "var(--primary)" }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex gap-3"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, var(--primary), var(--info))" }}
                >
                  <Bot size={15} color="var(--primary-foreground)" />
                </div>
                <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--surface-track)" }}>
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "var(--primary)" }}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:shadow-sm active:scale-95"
                style={{
                  backgroundColor: "var(--muted)",
                  color: "var(--muted-foreground)",
                  border: "1px solid var(--outline-variant)",
                }}
              >
                <Sparkles size={11} style={{ color: "var(--primary)" }} />
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="px-4 pb-4">
          <div
            className="flex items-end gap-3 p-3 rounded-2xl"
            style={{ border: "1.5px solid var(--outline-variant)", backgroundColor: "var(--card)" }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Ask anything about your business data..."
              className="flex-1 resize-none outline-none text-sm"
              style={{ color: "var(--foreground)", maxHeight: 120, minHeight: 24 }}
              rows={1}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-40"
              style={{
                background: input.trim() ? "linear-gradient(135deg, var(--primary), var(--info))" : "var(--muted)",
                color: input.trim() ? "var(--card)" : "var(--outline)",
              }}
            >
              <Send size={15} />
            </button>
          </div>
          <p className="text-center text-xs mt-2" style={{ color: "var(--outline)" }}>
            AI may make mistakes. Verify critical decisions.
          </p>
        </div>
      </div>

      {/* Visualization Panel */}
      <div className="hidden lg:flex flex-col flex-1 p-6 space-y-4">
        {/* Panel Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>Data Visualization</h3>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Dynamically generated from AI analysis</p>
          </div>
          {activeChart && (
            <button
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl transition-colors hover:bg-muted"
              style={{ color: "var(--primary)", border: "1px solid var(--primary-container)", backgroundColor: "var(--primary-tint)" }}
            >
              <ExternalLink size={12} />
              Open in Reports
            </button>
          )}
        </div>

        {activeChart && chartMap[activeChart] ? (
          <motion.div
            key={activeChart}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-card rounded-2xl p-5"
            style={{ border: "1px solid var(--surface-track)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={16} style={{ color: "var(--primary)" }} />
              <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                {activeChart === "revenue_drop" ? "European Revenue vs North America" :
                 activeChart === "q4_forecast" ? "Q4 Revenue Forecast — 3 Scenarios" :
                 "Operational Risk Heat Map"}
              </span>
            </div>
            {chartMap[activeChart]}
          </motion.div>
        ) : (
          <div
            className="flex-1 rounded-2xl flex flex-col items-center justify-center gap-4 p-8"
            style={{ border: "2px dashed var(--surface-track)", backgroundColor: "var(--page)" }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "var(--primary-container)" }}
            >
              <BarChart2 size={28} style={{ color: "var(--primary)" }} />
            </div>
            <div className="text-center">
              <p className="font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>Ask a data question</p>
              <p className="text-sm" style={{ color: "var(--outline)" }}>Visualizations will appear here as you explore your data with the AI Copilot</p>
            </div>
            <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
              {suggestedPrompts.slice(0, 3).map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="flex items-center gap-2 p-3 rounded-xl text-sm text-left transition-all hover:shadow-sm active:scale-[0.98]"
                  style={{ backgroundColor: "var(--card)", border: "1px solid var(--surface-track)", color: "var(--muted-foreground)" }}
                >
                  <Lightbulb size={14} style={{ color: "var(--warning)", flexShrink: 0 }} />
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Insight cards below chart */}
        {activeChart && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Key Insight", value: "Currency impact: -$340K", icon: AlertCircle, color: "var(--error)", bg: "var(--error-container)" },
              { label: "Recommendation", value: "EUR pricing strategy needed", icon: Lightbulb, color: "var(--warning)", bg: "var(--warning-container)" },
              { label: "Confidence", value: "92% accuracy", icon: TrendingUp, color: "var(--success)", bg: "var(--success-container)" },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="p-3 rounded-xl" style={{ backgroundColor: bg }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={12} style={{ color }} />
                  <span className="text-xs" style={{ color }}>{label}</span>
                </div>
                <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
