import { useState } from "react";
import { alpha } from "../lib/color";
import {
  Plus, MoreHorizontal, Clock, User, AlertTriangle, CheckCircle,
  MessageSquare, Paperclip, ChevronRight, Brain, TrendingUp,
  Search, X, Sparkles, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type WorkflowStatus = "pending" | "review" | "approved" | "implemented";

interface Workflow {
  id: string;
  title: string;
  description: string;
  owner: string;
  ownerInitials: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  riskScore: number;
  impact: string;
  dueDate: string;
  comments: number;
  attachments: number;
  aiRecommendation: string;
  confidence: number;
  status: WorkflowStatus;
  tags: string[];
}

const initialWorkflows: Workflow[] = [
  {
    id: "w1", title: "Q3 Budget Reallocation — APAC Risk Mitigation",
    description: "Reallocate $2.4M from EU expansion budget to APAC supply chain stabilization.",
    owner: "Sarah Chen", ownerInitials: "SC", priority: "Critical", riskScore: 85, impact: "$2.4M",
    dueDate: "May 15", comments: 8, attachments: 3,
    aiRecommendation: "AI strongly recommends proceeding. 92% probability of reducing APAC risk by 40%.",
    confidence: 92, status: "pending", tags: ["Finance", "APAC", "Q3"],
  },
  {
    id: "w2", title: "Customer Churn Prevention Initiative",
    description: "Launch targeted retention campaign for 142 at-risk enterprise accounts.",
    owner: "Mike Torres", ownerInitials: "MT", priority: "High", riskScore: 72, impact: "$1.8M ARR",
    dueDate: "May 20", comments: 12, attachments: 5,
    aiRecommendation: "Personalized outreach shown to reduce churn by 34% in similar cohorts.",
    confidence: 88, status: "pending", tags: ["Customer Success", "Revenue"],
  },
  {
    id: "w3", title: "EU Pricing Strategy Optimization",
    description: "Implement dynamic EUR pricing to hedge FX exposure and improve margin.",
    owner: "Lisa Park", ownerInitials: "LP", priority: "Medium", riskScore: 45, impact: "+$340K",
    dueDate: "May 28", comments: 6, attachments: 2,
    aiRecommendation: "5% price increase in Germany/France markets supported by demand elasticity data.",
    confidence: 84, status: "review", tags: ["Pricing", "Europe"],
  },
  {
    id: "w4", title: "Supply Chain Diversification",
    description: "Onboard 2 alternative logistics partners in Southeast Asia.",
    owner: "David Kim", ownerInitials: "DK", priority: "High", riskScore: 78, impact: "$950K savings",
    dueDate: "Jun 1", comments: 4, attachments: 7,
    aiRecommendation: "Diversification reduces single-vendor dependency from 71% to under 40%.",
    confidence: 90, status: "review", tags: ["Operations", "Supply Chain"],
  },
  {
    id: "w5", title: "AI Model Retraining — Q2 Data",
    description: "Retrain forecasting models with Q2 actuals for improved prediction accuracy.",
    owner: "AI Team", ownerInitials: "AT", priority: "Medium", riskScore: 20, impact: "+3% accuracy",
    dueDate: "May 25", comments: 3, attachments: 1,
    aiRecommendation: "Regular retraining cycle maintains 97%+ prediction confidence.",
    confidence: 97, status: "approved", tags: ["AI", "Data Science"],
  },
  {
    id: "w6", title: "ISO 27001 Compliance Audit",
    description: "Complete annual security audit and remediate 3 identified control gaps.",
    owner: "James Lee", ownerInitials: "JL", priority: "High", riskScore: 55, impact: "Compliance",
    dueDate: "Jun 15", comments: 9, attachments: 12,
    aiRecommendation: "All critical findings have remediation plans. Certification renewal expected.",
    confidence: 95, status: "approved", tags: ["Security", "Compliance"],
  },
  {
    id: "w7", title: "North America Sales Expansion",
    description: "Hire 15 enterprise AEs to capture identified $12M pipeline opportunity.",
    owner: "Revenue Ops", ownerInitials: "RO", priority: "High", riskScore: 35, impact: "+$12M ARR",
    dueDate: "Q3 2026", comments: 15, attachments: 4,
    aiRecommendation: "Market timing optimal. Competitor analysis shows 18-month window.",
    confidence: 82, status: "implemented", tags: ["Sales", "Growth"],
  },
  {
    id: "w8", title: "Product Analytics Revamp",
    description: "Migrate from legacy analytics to real-time data pipeline.",
    owner: "Engineering", ownerInitials: "ENG", priority: "Low", riskScore: 18, impact: "Efficiency",
    dueDate: "Jul 1", comments: 7, attachments: 3,
    aiRecommendation: "Migration reduces data latency from 4h to <5min. High ROI.",
    confidence: 94, status: "implemented", tags: ["Engineering", "Data"],
  },
];

const columns: { id: WorkflowStatus; label: string; color: string; bg: string }[] = [
  { id: "pending", label: "Pending Review", color: "var(--warning)", bg: "var(--warning-container)" },
  { id: "review", label: "Under Review", color: "var(--primary)", bg: "var(--primary-container)" },
  { id: "approved", label: "Approved", color: "var(--success)", bg: "var(--success-container)" },
  { id: "implemented", label: "Implemented", color: "var(--muted-foreground)", bg: "var(--muted)" },
];

const priorityColors: Record<string, { color: string; bg: string }> = {
  Critical: { color: "var(--error)", bg: "var(--error-container)" },
  High: { color: "var(--warning)", bg: "var(--warning-container)" },
  Medium: { color: "var(--primary)", bg: "var(--primary-container)" },
  Low: { color: "var(--success)", bg: "var(--success-container)" },
};

interface NewDecisionModalProps {
  onClose: () => void;
  onSubmit: (w: Workflow) => void;
}

function NewDecisionModal({ onClose, onSubmit }: NewDecisionModalProps) {
  const [step, setStep] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", owner: "", ownerInitials: "",
    priority: "High" as Workflow["priority"], impact: "", dueDate: "",
    tags: [] as string[], tagInput: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const runAnalysis = () => {
    setStep(3);
    setAnalyzing(true);
    setTimeout(() => { setAnalyzing(false); setAnalyzed(true); }, 2200);
  };

  const handleSubmit = () => {
    const initials = form.owner.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "??";
    const newW: Workflow = {
      id: `w${Date.now()}`,
      title: form.title,
      description: form.description,
      owner: form.owner,
      ownerInitials: initials,
      priority: form.priority,
      riskScore: Math.floor(Math.random() * 40) + 40,
      impact: form.impact,
      dueDate: form.dueDate,
      comments: 0,
      attachments: 0,
      aiRecommendation: "AI analysis complete. Decision queued for review based on business impact and risk profile.",
      confidence: Math.floor(Math.random() * 15) + 80,
      status: "pending",
      tags: form.tags,
    };
    onSubmit(newW);
    onClose();
  };

  const addTag = () => {
    if (form.tagInput.trim() && !form.tags.includes(form.tagInput.trim())) {
      setForm((f) => ({ ...f, tags: [...f.tags, f.tagInput.trim()], tagInput: "" }));
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all";
  const inputStyle = { border: "1.5px solid var(--outline-variant)", backgroundColor: "var(--page)", color: "var(--foreground)" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "color-mix(in srgb, var(--scrim) 50%, transparent)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="bg-card rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--surface-track)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-strong))" }}>
              <Plus size={18} color="var(--primary-foreground)" />
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: "var(--foreground)" }}>New Decision</h2>
              <p className="text-xs" style={{ color: "var(--outline)" }}>Step {step} of 3</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <X size={18} style={{ color: "var(--muted-foreground)" }} />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex gap-0 px-6 pt-4">
          {["Details", "Context", "AI Analysis"].map((label, i) => {
            const active = step === i + 1;
            const done = step > i + 1;
            return (
              <div key={label} className="flex-1 flex flex-col items-center">
                <div className="flex items-center w-full">
                  {i > 0 && <div className="flex-1 h-px" style={{ backgroundColor: done || active ? "var(--primary)" : "var(--surface-track)" }} />}
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      backgroundColor: done ? "var(--primary)" : active ? "var(--primary)" : "var(--surface-track)",
                      color: done || active ? "var(--card)" : "var(--outline)",
                    }}
                  >
                    {done ? <CheckCircle size={12} /> : i + 1}
                  </div>
                  {i < 2 && <div className="flex-1 h-px" style={{ backgroundColor: done ? "var(--primary)" : "var(--surface-track)" }} />}
                </div>
                <span className="text-xs mt-1" style={{ color: active ? "var(--primary)" : "var(--outline)" }}>{label}</span>
              </div>
            );
          })}
        </div>

        <div className="p-6 space-y-4">
          {/* Step 1: Details */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>Decision Title *</label>
                <input
                  className={inputClass}
                  style={inputStyle}
                  placeholder="e.g. Q3 Market Expansion — LATAM"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>Description *</label>
                <textarea
                  className={inputClass}
                  style={{ ...inputStyle, resize: "none" }}
                  rows={3}
                  placeholder="Describe the decision, its scope, and the key question to be answered..."
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>Priority</label>
                  <select
                    className={inputClass}
                    style={inputStyle}
                    value={form.priority}
                    onChange={(e) => set("priority", e.target.value)}
                  >
                    {["Critical", "High", "Medium", "Low"].map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>Due Date</label>
                  <input
                    type="date"
                    className={inputClass}
                    style={inputStyle}
                    value={form.dueDate}
                    onChange={(e) => set("dueDate", e.target.value)}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Context */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>Decision Owner *</label>
                <input
                  className={inputClass}
                  style={inputStyle}
                  placeholder="Full name (e.g. Sarah Chen)"
                  value={form.owner}
                  onChange={(e) => set("owner", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>Business Impact</label>
                <input
                  className={inputClass}
                  style={inputStyle}
                  placeholder="e.g. $2.4M, +15% efficiency, Compliance"
                  value={form.impact}
                  onChange={(e) => set("impact", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>Tags</label>
                <div className="flex gap-2">
                  <input
                    className={inputClass}
                    style={{ ...inputStyle, flex: 1 }}
                    placeholder="Add tag..."
                    value={form.tagInput}
                    onChange={(e) => set("tagInput", e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                  />
                  <button onClick={addTag} className="px-3 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: "var(--primary-tint)", color: "var(--primary)" }}>
                    Add
                  </button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.tags.map((t) => (
                      <span key={t} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "var(--primary-tint)", color: "var(--primary)" }}>
                        {t}
                        <button onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }))}>
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: AI Analysis */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              {analyzing && (
                <div className="flex flex-col items-center py-6 space-y-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-strong))" }}>
                    <Brain size={26} color="var(--primary-foreground)" />
                  </div>
                  <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>AI is analyzing your decision...</div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, var(--primary), var(--info))" }}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, ease: "linear" }}
                    />
                  </div>
                  {["Fetching market signals...", "Cross-referencing historical decisions...", "Computing risk score...", "Generating recommendation..."].map((msg, i) => (
                    <motion.div key={msg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.5 }}
                      className="text-xs" style={{ color: "var(--outline)" }}>
                      {msg}
                    </motion.div>
                  ))}
                </div>
              )}
              {analyzed && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl" style={{ background: "linear-gradient(135deg, var(--primary-tint), var(--primary-container))", border: "1px solid var(--primary-soft)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={14} style={{ color: "var(--primary)" }} />
                      <span className="text-xs font-semibold" style={{ color: "var(--primary)" }}>AI Recommendation</span>
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
                        {Math.floor(Math.random() * 15) + 80}% confidence
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: "var(--primary-strong)" }}>
                      Based on current market conditions and historical performance, this decision has moderate-to-high business impact. Recommend proceeding to structured review with stakeholder alignment by the due date.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Risk Score", value: `${Math.floor(Math.random() * 40) + 40}%`, color: "var(--warning)" },
                      { label: "Impact", value: "High", color: "var(--success)" },
                      { label: "Timeline", value: "On track", color: "var(--primary)" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="p-3 rounded-xl text-center" style={{ backgroundColor: "var(--page)", border: "1px solid var(--surface-track)" }}>
                        <div className="text-sm font-bold" style={{ color }}>{value}</div>
                        <div className="text-xs" style={{ color: "var(--outline)" }}>{label}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: "var(--outline)" }}>
                    Decision will be added to the <strong>Pending Review</strong> column. You can drag it through the pipeline as it progresses.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: "var(--surface-track)", backgroundColor: "var(--page)" }}>
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-muted"
            style={{ color: "var(--muted-foreground)" }}
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>
          {step < 3 && (
            <button
              onClick={() => step === 2 ? runAnalysis() : setStep(step + 1)}
              disabled={step === 1 && (!form.title.trim() || !form.description.trim())}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-primary-foreground transition-all hover:shadow-md disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-strong))" }}
            >
              {step === 2 ? <><Sparkles size={14} /> Run AI Analysis</> : <>Next <ArrowRight size={14} /></>}
            </button>
          )}
          {step === 3 && analyzed && (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-primary-foreground transition-all hover:shadow-md"
              style={{ background: "linear-gradient(135deg, var(--success), var(--success))" }}
            >
              <CheckCircle size={14} />
              Create Decision
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function WorkflowEngine() {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<WorkflowStatus | null>(null);
  const [newDecisionOpen, setNewDecisionOpen] = useState(false);

  const filtered = workflows.filter((w) =>
    w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getColumnWorkflows = (status: WorkflowStatus) =>
    filtered.filter((w) => w.status === status);

  const handleDragStart = (id: string) => setDraggedId(id);
  const handleDragOver = (e: React.DragEvent, col: WorkflowStatus) => {
    e.preventDefault();
    setDragOverCol(col);
  };
  const handleDrop = (col: WorkflowStatus) => {
    if (!draggedId) return;
    setWorkflows((prev) => prev.map((w) => w.id === draggedId ? { ...w, status: col } : w));
    setDraggedId(null);
    setDragOverCol(null);
  };

  return (
    <div className="flex h-full overflow-hidden" style={{ backgroundColor: "var(--page)" }}>
      {/* Main Kanban */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>Decision Workflow Engine</h1>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              {workflows.length} total decisions · {workflows.filter((w) => w.status === "pending").length} pending approval
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--outline)" }} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search workflows..."
                className="pl-9 pr-4 py-2 rounded-xl text-sm outline-none"
                style={{ border: "1px solid var(--outline-variant)", backgroundColor: "var(--card)", color: "var(--foreground)", width: 200 }}
              />
            </div>
            <button
              onClick={() => setNewDecisionOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-primary-foreground transition-all hover:shadow-md"
              style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-strong))" }}
            >
              <Plus size={14} />
              New Decision
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-4 h-full min-w-max pb-4">
            {columns.map((col) => {
              const colWorkflows = getColumnWorkflows(col.id);
              const isDragTarget = dragOverCol === col.id;
              return (
                <div
                  key={col.id}
                  className="flex flex-col rounded-2xl overflow-hidden transition-all"
                  style={{
                    width: 300,
                    backgroundColor: isDragTarget ? col.bg : "var(--muted)",
                    border: isDragTarget ? `2px dashed ${col.color}` : "2px solid transparent",
                  }}
                  onDragOver={(e) => handleDragOver(e, col.id)}
                  onDrop={() => handleDrop(col.id)}
                  onDragLeave={() => setDragOverCol(null)}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid color-mix(in srgb, var(--scrim) 6%, transparent)" }}>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                      <span className="text-sm font-semibold" style={{ color: "var(--muted-foreground)" }}>{col.label}</span>
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: alpha(col.color, "22"), color: col.color }}
                      >
                        {colWorkflows.length}
                      </span>
                    </div>
                    <button className="p-1 rounded-lg hover:bg-primary-foreground/50 transition-colors" style={{ color: "var(--outline)" }}>
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {colWorkflows.map((wf) => {
                      const pc = priorityColors[wf.priority];
                      return (
                        <motion.div
                          key={wf.id}
                          layoutId={wf.id}
                          draggable
                          onDragStart={() => handleDragStart(wf.id)}
                          onDragEnd={() => setDraggedId(null)}
                          onClick={() => setSelectedWorkflow(wf)}
                          className="bg-card rounded-xl p-4 cursor-pointer transition-all hover:shadow-md"
                          style={{
                            border: "1px solid var(--surface-track)",
                            opacity: draggedId === wf.id ? 0.5 : 1,
                          }}
                          whileHover={{ y: -2 }}
                        >
                          {/* Priority + Risk */}
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className="text-xs font-semibold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: pc.bg, color: pc.color }}
                            >
                              {wf.priority}
                            </span>
                            <div
                              className="flex items-center gap-1 text-xs font-semibold"
                              style={{ color: wf.riskScore > 70 ? "var(--error)" : wf.riskScore > 45 ? "var(--warning)" : "var(--success)" }}
                            >
                              <AlertTriangle size={10} />
                              Risk {wf.riskScore}%
                            </div>
                          </div>

                          <p className="text-sm font-semibold leading-snug mb-1.5" style={{ color: "var(--foreground)" }}>
                            {wf.title}
                          </p>

                          {/* AI Rec */}
                          <div className="flex items-start gap-1.5 mb-3 p-2 rounded-lg" style={{ backgroundColor: "var(--page)" }}>
                            <Brain size={10} style={{ color: "var(--primary)", marginTop: 2, flexShrink: 0 }} />
                            <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                              {wf.aiRecommendation.slice(0, 80)}...
                            </p>
                          </div>

                          {/* Meta */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <div
                                className="w-5 h-5 rounded-full flex items-center justify-center text-primary-foreground flex-shrink-0"
                                style={{ backgroundColor: "var(--primary)", fontSize: "var(--text-2xs)", fontWeight: 500 }}
                              >
                                {wf.ownerInitials}
                              </div>
                              <span className="text-xs" style={{ color: "var(--outline)" }}>{wf.owner}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs" style={{ color: "var(--outline)" }}>
                              <span className="flex items-center gap-0.5"><MessageSquare size={10} />{wf.comments}</span>
                              <span className="flex items-center gap-0.5"><Clock size={10} />{wf.dueDate}</span>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {wf.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-1.5 py-0.5 rounded-full"
                                style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}
                    {colWorkflows.length === 0 && (
                      <div
                        className="flex flex-col items-center justify-center py-8 rounded-xl border-2 border-dashed"
                        style={{ borderColor: "var(--outline-variant)" }}
                      >
                        <p className="text-xs" style={{ color: "var(--outline)" }}>Drop workflows here</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedWorkflow && (
          <motion.div
            initial={{ x: 380, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 380, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-80 xl:w-96 bg-card flex-shrink-0 flex flex-col overflow-hidden"
            style={{ borderLeft: "1px solid var(--surface-track)" }}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--surface-track)" }}>
              <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>Decision Details</h3>
              <button onClick={() => setSelectedWorkflow(null)} className="p-1.5 rounded-lg hover:bg-muted" style={{ color: "var(--muted-foreground)" }}>
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Priority + Risk */}
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: priorityColors[selectedWorkflow.priority].bg,
                    color: priorityColors[selectedWorkflow.priority].color,
                  }}
                >
                  {selectedWorkflow.priority} Priority
                </span>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}
                >
                  Impact: {selectedWorkflow.impact}
                </span>
              </div>

              <h2 className="font-bold leading-snug" style={{ color: "var(--foreground)" }}>
                {selectedWorkflow.title}
              </h2>

              <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                {selectedWorkflow.description}
              </p>

              {/* AI Recommendation */}
              <div
                className="p-4 rounded-xl"
                style={{ background: "linear-gradient(135deg, var(--primary-container), var(--primary-tint))", border: "1px solid var(--primary-soft)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Brain size={14} style={{ color: "var(--primary)" }} />
                  <span className="text-xs font-semibold" style={{ color: "var(--primary)" }}>AI Recommendation</span>
                  <span className="text-xs ml-auto px-1.5 py-0.5 rounded-full bg-primary-foreground/60 font-medium" style={{ color: "var(--primary-strong)" }}>
                    {selectedWorkflow.confidence}% confidence
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--primary-strong)" }}>
                  {selectedWorkflow.aiRecommendation}
                </p>
              </div>

              {/* Risk Score */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Risk Score</span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: selectedWorkflow.riskScore > 70 ? "var(--error)" : selectedWorkflow.riskScore > 45 ? "var(--warning)" : "var(--success)" }}
                  >
                    {selectedWorkflow.riskScore}/100
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--surface-track)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedWorkflow.riskScore}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: selectedWorkflow.riskScore > 70 ? "var(--error)" : selectedWorkflow.riskScore > 45 ? "var(--warning)" : "var(--success)",
                    }}
                  />
                </div>
              </div>

              {/* Owner + Due */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Owner", value: selectedWorkflow.owner, icon: User },
                  { label: "Due Date", value: selectedWorkflow.dueDate, icon: Clock },
                  { label: "Comments", value: `${selectedWorkflow.comments}`, icon: MessageSquare },
                  { label: "Attachments", value: `${selectedWorkflow.attachments} files`, icon: Paperclip },
                ].map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: "var(--page)", border: "1px solid var(--surface-track)" }}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon size={11} style={{ color: "var(--outline)" }} />
                      <span className="text-xs" style={{ color: "var(--outline)" }}>{label}</span>
                    </div>
                    <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div>
                <p className="text-xs font-medium mb-2" style={{ color: "var(--muted-foreground)" }}>Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedWorkflow.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: "var(--primary-container)", color: "var(--primary)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 space-y-2" style={{ borderTop: "1px solid var(--surface-track)" }}>
              {selectedWorkflow.status === "pending" && (
                <button
                  onClick={() => {
                    setWorkflows((prev) => prev.map((w) => w.id === selectedWorkflow.id ? { ...w, status: "review" } : w));
                    setSelectedWorkflow({ ...selectedWorkflow, status: "review" });
                  }}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-primary-foreground transition-all hover:shadow-md"
                  style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-strong))" }}
                >
                  Start Review
                </button>
              )}
              {selectedWorkflow.status === "review" && (
                <button
                  onClick={() => {
                    setWorkflows((prev) => prev.map((w) => w.id === selectedWorkflow.id ? { ...w, status: "approved" } : w));
                    setSelectedWorkflow({ ...selectedWorkflow, status: "approved" });
                  }}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-primary-foreground transition-all hover:shadow-md"
                  style={{ background: "linear-gradient(135deg, var(--success), var(--success))" }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle size={15} />
                    Approve Decision
                  </div>
                </button>
              )}
              {selectedWorkflow.status === "approved" && (
                <button
                  onClick={() => {
                    setWorkflows((prev) => prev.map((w) => w.id === selectedWorkflow.id ? { ...w, status: "implemented" } : w));
                    setSelectedWorkflow({ ...selectedWorkflow, status: "implemented" });
                  }}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-primary-foreground transition-all hover:shadow-md"
                  style={{ background: "linear-gradient(135deg, var(--muted-foreground), var(--muted-foreground))" }}
                >
                  Mark Implemented
                </button>
              )}
              <button
                className="w-full py-2 rounded-xl text-sm font-medium transition-colors hover:bg-muted"
                style={{ color: "var(--muted-foreground)", border: "1px solid var(--surface-track)" }}
              >
                Add Comment
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {newDecisionOpen && (
          <NewDecisionModal
            onClose={() => setNewDecisionOpen(false)}
            onSubmit={(w) => setWorkflows((prev) => [w, ...prev])}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
