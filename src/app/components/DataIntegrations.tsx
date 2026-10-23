import { useState } from "react";
import { alpha } from "../lib/color";
import {
  Check, X, RefreshCw, Plus, ExternalLink, Clock, Database,
  Zap, Shield, AlertTriangle, Settings, Activity, Search,
  ArrowRight, ChevronLeft, Wifi, Key, TestTube, CheckCircle,
  Globe, Lock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type ConnectionStatus = "connected" | "error" | "syncing" | "disconnected";

interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  status: ConnectionStatus;
  lastSync?: string;
  records?: string;
  icon: string;
  color: string;
  bg: string;
  popular?: boolean;
}

const integrations: Integration[] = [
  {
    id: "salesforce", name: "Salesforce", category: "CRM",
    description: "Sync CRM pipeline, accounts, and opportunities for revenue intelligence.",
    status: "connected", lastSync: "2 min ago", records: "142,890 records",
    icon: "SF", color: "#00A1E0", bg: "#E0F7FF", popular: true,
  },
  {
    id: "snowflake", name: "Snowflake", category: "Data Warehouse",
    description: "Enterprise data warehouse for advanced analytics and ML pipelines.",
    status: "connected", lastSync: "5 min ago", records: "2.4B rows",
    icon: "❄️", color: "#29B5E8", bg: "#E0F4FD", popular: true,
  },
  {
    id: "hubspot", name: "HubSpot", category: "Marketing",
    description: "Marketing automation, lead generation, and attribution analytics.",
    status: "connected", lastSync: "15 min ago", records: "28,450 contacts",
    icon: "HS", color: "#FF7A59", bg: "#FFF0EC",
  },
  {
    id: "google-analytics", name: "Google Analytics 4", category: "Analytics",
    description: "Website and product analytics with conversion tracking.",
    status: "syncing", lastSync: "In progress",
    icon: "GA", color: "#E37400", bg: "#FEF3E2",
  },
  {
    id: "jira", name: "Jira", category: "Project Management",
    description: "Engineering sprint data, velocity metrics, and delivery tracking.",
    status: "connected", lastSync: "1 hour ago", records: "4,230 issues",
    icon: "JR", color: "#0052CC", bg: "#EBF0FF",
  },
  {
    id: "slack", name: "Slack", category: "Communication",
    description: "Team communication, decision notifications, and alert routing.",
    status: "connected", lastSync: "Real-time", records: "Active",
    icon: "SL", color: "#4A154B", bg: "#F4EEF5",
  },
  {
    id: "sap", name: "SAP ERP", category: "ERP",
    description: "Enterprise resource planning — finance, HR, and operations data.",
    status: "error", lastSync: "Failed 3 hours ago",
    icon: "SAP", color: "#0070F2", bg: "#EBF4FF",
  },
  {
    id: "aws", name: "Amazon Web Services", category: "Cloud",
    description: "Cloud infrastructure, cost monitoring, and resource utilization.",
    status: "connected", lastSync: "Real-time", records: "48 services",
    icon: "AWS", color: "#FF9900", bg: "#FFF3DC", popular: true,
  },
  {
    id: "azure", name: "Microsoft Azure", category: "Cloud",
    description: "Azure services, active directory, and compliance reporting.",
    status: "disconnected",
    icon: "AZ", color: "#0089D6", bg: "#E5F3FB",
  },
  {
    id: "stripe", name: "Stripe", category: "Payments",
    description: "Revenue data, subscription metrics, and payment analytics.",
    status: "connected", lastSync: "Real-time", records: "$6.8M processed",
    icon: "ST", color: "#635BFF", bg: "#F0F0FF",
  },
  {
    id: "zendesk", name: "Zendesk", category: "Support",
    description: "Customer support tickets, CSAT scores, and resolution analytics.",
    status: "disconnected",
    icon: "ZD", color: "#03363D", bg: "#E8F0F0",
  },
  {
    id: "looker", name: "Looker / BigQuery", category: "Analytics",
    description: "Google Cloud data platform for business intelligence reporting.",
    status: "disconnected",
    icon: "LK", color: "#4285F4", bg: "#E8F0FE",
  },
];

const statusConfig: Record<ConnectionStatus, { color: string; bg: string; label: string; icon: React.ElementType }> = {
  connected: { color: "#0F9D58", bg: "#E8F5E9", label: "Connected", icon: Check },
  error: { color: "#D93025", bg: "#FCE8E6", label: "Error", icon: AlertTriangle },
  syncing: { color: "var(--primary)", bg: "var(--primary-container)", label: "Syncing", icon: RefreshCw },
  disconnected: { color: "#80868B", bg: "#F1F3F4", label: "Disconnected", icon: X },
};

const categories = ["All", "CRM", "Data Warehouse", "Analytics", "Cloud", "ERP", "Marketing", "Support", "Payments"];

const Plug2 = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22v-5" /><path d="M9 8V2" /><path d="M15 8V2" /><path d="M18 8H6a2 2 0 0 0-2 2v3a6 6 0 0 0 12 0v-3a2 2 0 0 0-2-2Z" />
  </svg>
);

const availableProviders = [
  { id: "tableau", name: "Tableau", category: "Analytics", icon: "TB", color: "#E97627", bg: "#FFF0E5", popular: true },
  { id: "dbt", name: "dbt Cloud", category: "Data Warehouse", icon: "dbt", color: "#FF694A", bg: "#FFF0EE" },
  { id: "fivetran", name: "Fivetran", category: "ETL", icon: "FT", color: "#1F5EFF", bg: "#EBF0FF", popular: true },
  { id: "databricks", name: "Databricks", category: "AI/ML", icon: "DB", color: "#FF3621", bg: "#FFF0EE" },
  { id: "okta", name: "Okta", category: "Identity", icon: "OK", color: "#007DC1", bg: "#E5F3FB", popular: true },
  { id: "powerbi", name: "Power BI", category: "Analytics", icon: "PBI", color: "#F2C811", bg: "#FDFBEC" },
  { id: "mongodb", name: "MongoDB Atlas", category: "Database", icon: "MDB", color: "#00ED64", bg: "#E5FDF3" },
  { id: "twilio", name: "Twilio", category: "Communication", icon: "TW", color: "#F22F46", bg: "#FEE8EB" },
  { id: "intercom", name: "Intercom", category: "Support", icon: "IC", color: "#1F8DED", bg: "#E5F2FD" },
  { id: "mixpanel", name: "Mixpanel", category: "Analytics", icon: "MX", color: "#7856FF", bg: "#F0EDFF" },
  { id: "amplitude", name: "Amplitude", category: "Analytics", icon: "AM", color: "#0094FF", bg: "#E5F2FF" },
  { id: "segment", name: "Segment", category: "CDP", icon: "SG", color: "#52BD95", bg: "#EDFAF5", popular: true },
];

function AddIntegrationWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<typeof availableProviders[0] | null>(null);
  const [providerSearch, setProviderSearch] = useState("");
  const [testing, setTesting] = useState(false);
  const [testPassed, setTestPassed] = useState(false);
  const [creds, setCreds] = useState({ apiKey: "", clientId: "", clientSecret: "", region: "us-east-1" });
  const [syncConfig, setSyncConfig] = useState({ frequency: "15 minutes", objects: ["All objects"], format: "JSON" });

  const filteredProviders = availableProviders.filter((p) =>
    !providerSearch || p.name.toLowerCase().includes(providerSearch.toLowerCase()) || p.category.toLowerCase().includes(providerSearch.toLowerCase())
  );

  const runTest = () => {
    setTesting(true);
    setTestPassed(false);
    setTimeout(() => { setTesting(false); setTestPassed(true); }, 2500);
  };

  const steps = [
    { label: "Choose Provider", icon: Globe },
    { label: "Configure", icon: Key },
    { label: "Test Connection", icon: TestTube },
    { label: "Sync Settings", icon: Settings },
  ];

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
        className="bg-card rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden"
        style={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: "var(--surface-track)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-strong))" }}>
              <Plug2 size={18} color="var(--primary-foreground)" />
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: "var(--foreground)" }}>Add Integration</h2>
              <p className="text-xs" style={{ color: "var(--outline)" }}>Step {step} of 4 · {steps[step - 1].label}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <X size={18} style={{ color: "var(--muted-foreground)" }} />
          </button>
        </div>

        {/* Step Progress */}
        <div className="flex items-center gap-0 px-6 pt-4 flex-shrink-0">
          {steps.map(({ label, icon: Icon }, i) => {
            const active = step === i + 1;
            const done = step > i + 1;
            return (
              <div key={label} className="flex-1 flex flex-col items-center">
                <div className="flex items-center w-full">
                  {i > 0 && <div className="flex-1 h-px" style={{ backgroundColor: done ? "var(--primary)" : "var(--surface-track)" }} />}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: done ? "var(--success)" : active ? "var(--primary)" : "var(--surface-track)" }}
                  >
                    {done ? <Check size={13} color="var(--primary-foreground)" /> : <Icon size={13} color={active ? "var(--card)" : "var(--outline)"} />}
                  </div>
                  {i < steps.length - 1 && <div className="flex-1 h-px" style={{ backgroundColor: done ? "var(--primary)" : "var(--surface-track)" }} />}
                </div>
                <span className="text-xs mt-1 text-center" style={{ color: active ? "var(--primary)" : "var(--outline)" }}>{label}</span>
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Choose Provider */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--outline)" }} />
                <input
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ border: "1.5px solid var(--outline-variant)", backgroundColor: "var(--page)", color: "var(--foreground)" }}
                  placeholder="Search integrations..."
                  value={providerSearch}
                  onChange={(e) => setProviderSearch(e.target.value)}
                />
              </div>
              {!providerSearch && (
                <div className="text-xs font-semibold" style={{ color: "var(--outline)" }}>POPULAR</div>
              )}
              <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
                {filteredProviders.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className="flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                    style={{
                      border: `2px solid ${selected?.id === p.id ? "var(--primary)" : "var(--surface-track)"}`,
                      backgroundColor: selected?.id === p.id ? "var(--primary-tint)" : "var(--page)",
                    }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ backgroundColor: p.bg, color: p.color }}>
                      {p.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate" style={{ color: "var(--foreground)" }}>{p.name}</div>
                      <div className="text-xs" style={{ color: "var(--outline)" }}>{p.category}</div>
                    </div>
                    {selected?.id === p.id && <Check size={14} style={{ color: "var(--primary)", marginLeft: "auto", flexShrink: 0 }} />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Configure */}
          {step === 2 && selected && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "var(--page)", border: "1px solid var(--surface-track)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ backgroundColor: selected.bg, color: selected.color }}>
                  {selected.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{selected.name}</div>
                  <div className="text-xs" style={{ color: "var(--outline)" }}>{selected.category} · OAuth 2.0 + API Key</div>
                </div>
              </div>

              {[
                { key: "apiKey", label: "API Key", placeholder: "sk-••••••••••••••••", type: "password" },
                { key: "clientId", label: "Client ID", placeholder: "client_••••••••", type: "text" },
                { key: "clientSecret", label: "Client Secret", placeholder: "secret_••••••••••", type: "password" },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold mb-1.5 flex items-center gap-1" style={{ color: "var(--foreground)" }}>
                    <Lock size={10} style={{ color: "var(--outline)" }} /> {label}
                  </label>
                  <input
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none font-mono"
                    style={{ border: "1.5px solid var(--outline-variant)", backgroundColor: "var(--page)", color: "var(--foreground)" }}
                    placeholder={placeholder}
                    type={type}
                    value={creds[key as keyof typeof creds]}
                    onChange={(e) => setCreds((c) => ({ ...c, [key]: e.target.value }))}
                  />
                </div>
              ))}
              <div className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: "var(--success-container)", border: "1px solid var(--success-container)" }}>
                <Lock size={12} style={{ color: "var(--success)" }} />
                <p className="text-xs" style={{ color: "var(--success)" }}>
                  Credentials are encrypted with AES-256 and never stored in plaintext. SOC 2 Type II certified.
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Test Connection */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              {!testing && !testPassed && (
                <div className="flex flex-col items-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-strong))" }}>
                    <Wifi size={28} color="var(--primary-foreground)" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Ready to test connection</div>
                    <div className="text-xs mt-1" style={{ color: "var(--outline)" }}>
                      We'll verify your credentials and check API access permissions for {selected?.name}.
                    </div>
                  </div>
                  <button
                    onClick={runTest}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg"
                    style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-strong))" }}
                  >
                    <TestTube size={15} />
                    Test Connection
                  </button>
                </div>
              )}
              {testing && (
                <div className="flex flex-col items-center py-6 space-y-3">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse" style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-strong))" }}>
                    <RefreshCw size={28} color="var(--primary-foreground)" className="animate-spin" />
                  </div>
                  <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Testing connection...</div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, var(--primary), var(--info))" }}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.3, ease: "linear" }}
                    />
                  </div>
                  {["Validating credentials...", "Checking API permissions...", "Verifying data access..."].map((msg, i) => (
                    <motion.div key={msg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.7 }}
                      className="text-xs" style={{ color: "var(--outline)" }}>{msg}</motion.div>
                  ))}
                </div>
              )}
              {testPassed && (
                <div className="space-y-3">
                  <div className="flex flex-col items-center py-4 space-y-2">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--success-container)" }}>
                      <CheckCircle size={32} style={{ color: "var(--success)" }} />
                    </div>
                    <div className="text-sm font-bold" style={{ color: "var(--success)" }}>Connection Successful!</div>
                  </div>
                  {[
                    { label: "API Authentication", status: "Passed", color: "var(--success)" },
                    { label: "Read Permissions", status: "Passed", color: "var(--success)" },
                    { label: "Write Permissions", status: "Passed", color: "var(--success)" },
                    { label: "Webhook Access", status: "Optional", color: "var(--warning)" },
                  ].map(({ label, status, color }) => (
                    <div key={label} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: "var(--page)", border: "1px solid var(--surface-track)" }}>
                      <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{label}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: alpha(color, "22"), color }}>{status}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Step 4: Sync Settings */}
          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>Sync Frequency</label>
                <select
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ border: "1.5px solid var(--outline-variant)", backgroundColor: "var(--page)", color: "var(--foreground)" }}
                  value={syncConfig.frequency}
                  onChange={(e) => setSyncConfig((c) => ({ ...c, frequency: e.target.value }))}
                >
                  {["Real-time", "5 minutes", "15 minutes", "30 minutes", "1 hour", "Daily"].map((f) => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--foreground)" }}>Objects to Sync</label>
                <div className="space-y-2">
                  {["All objects", "Accounts & Contacts", "Opportunities", "Activities", "Custom objects"].map((obj) => (
                    <label key={obj} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={syncConfig.objects.includes(obj)}
                        onChange={(e) => setSyncConfig((c) => ({
                          ...c,
                          objects: e.target.checked ? [...c.objects, obj] : c.objects.filter((o) => o !== obj)
                        }))}
                        className="rounded"
                      />
                      <span className="text-sm" style={{ color: "var(--foreground)" }}>{obj}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-xl" style={{ background: "linear-gradient(135deg, var(--primary-tint), var(--primary-container))", border: "1px solid var(--primary-soft)" }}>
                <div className="text-xs font-semibold mb-1" style={{ color: "var(--primary)" }}>Ready to activate</div>
                <p className="text-xs" style={{ color: "var(--primary-strong)" }}>
                  {selected?.name} will begin syncing {syncConfig.frequency === "Real-time" ? "immediately" : `every ${syncConfig.frequency}`}. First sync may take 5–10 minutes.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t flex-shrink-0" style={{ borderColor: "var(--surface-track)", backgroundColor: "var(--page)" }}>
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-muted flex items-center gap-1"
            style={{ color: "var(--muted-foreground)" }}
          >
            {step > 1 && <ChevronLeft size={14} />}
            {step === 1 ? "Cancel" : "Back"}
          </button>
          {step < 4 ? (
            <button
              onClick={() => { if (step === 3 && !testPassed) { runTest(); } else { setStep(step + 1); } }}
              disabled={(step === 1 && !selected) || (step === 3 && testing)}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-primary-foreground transition-all hover:shadow-md disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-strong))" }}
            >
              {step === 3 && !testPassed ? <><TestTube size={14} /> Test First</> : <>Next <ArrowRight size={14} /></>}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-primary-foreground transition-all hover:shadow-md"
              style={{ background: "linear-gradient(135deg, var(--success), var(--success))" }}
            >
              <CheckCircle size={14} />
              Activate Integration
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function DataIntegrations() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [connecting, setConnecting] = useState<string | null>(null);
  const [addIntegrationOpen, setAddIntegrationOpen] = useState(false);

  const connectedCount = integrations.filter((i) => i.status === "connected").length;
  const filtered = integrations.filter((i) => {
    const catMatch = activeCategory === "All" || i.category === activeCategory;
    const searchMatch = !searchQuery || i.name.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && searchMatch;
  });

  const handleConnect = (id: string) => {
    setConnecting(id);
    setTimeout(() => setConnecting(null), 2000);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>Data Integrations</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            {connectedCount} of {integrations.length} integrations active · Last full sync 5 min ago
          </p>
        </div>
        <button
          onClick={() => setAddIntegrationOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-primary-foreground transition-all hover:shadow-md"
          style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-strong))" }}
        >
          <Plus size={14} />
          Add Integration
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Connected", value: connectedCount, color: "var(--success)", bg: "var(--success-container)", icon: Check },
          { label: "Syncing", value: integrations.filter((i) => i.status === "syncing").length, color: "var(--primary)", bg: "var(--primary-container)", icon: RefreshCw },
          { label: "Errors", value: integrations.filter((i) => i.status === "error").length, color: "var(--error)", bg: "var(--error-container)", icon: AlertTriangle },
          { label: "Total Records", value: "2.6B+", color: "var(--muted-foreground)", bg: "var(--muted)", icon: Database },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-3 p-4 rounded-2xl bg-card"
            style={{ border: "1px solid var(--surface-track)" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>{value}</p>
              <p className="text-xs" style={{ color: "var(--outline)" }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--outline)" }} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search integrations..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none"
            style={{ border: "1px solid var(--outline-variant)", backgroundColor: "var(--card)", color: "var(--foreground)" }}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                backgroundColor: activeCategory === cat ? "var(--primary)" : "var(--card)",
                color: activeCategory === cat ? "var(--card)" : "var(--muted-foreground)",
                border: `1px solid ${activeCategory === cat ? "var(--primary)" : "var(--outline-variant)"}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((integration, i) => {
          const sc = statusConfig[integration.status];
          const StatusIcon = sc.icon;
          const isConnecting = connecting === integration.id;

          return (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card rounded-2xl p-5 transition-all hover:shadow-md"
              style={{ border: "1px solid var(--surface-track)" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Integration Icon */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: integration.bg, color: integration.color }}
                  >
                    {integration.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{integration.name}</p>
                      {integration.popular && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--warning-container)", color: "var(--warning)" }}>
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: "var(--outline)" }}>{integration.category}</p>
                  </div>
                </div>
                {/* Status badge */}
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: sc.bg, color: sc.color }}
                >
                  <StatusIcon size={10} className={integration.status === "syncing" ? "animate-spin" : ""} />
                  {sc.label}
                </div>
              </div>

              <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--muted-foreground)" }}>
                {integration.description}
              </p>

              {/* Sync info */}
              {integration.status === "connected" || integration.status === "syncing" ? (
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--outline)" }}>
                    <Clock size={11} />
                    {integration.lastSync}
                  </div>
                  {integration.records && (
                    <div className="flex items-center gap-1 text-xs" style={{ color: "var(--outline)" }}>
                      <Database size={11} />
                      {integration.records}
                    </div>
                  )}
                </div>
              ) : integration.status === "error" ? (
                <div
                  className="flex items-center gap-2 p-2.5 rounded-xl mb-4"
                  style={{ backgroundColor: "var(--error-container)" }}
                >
                  <AlertTriangle size={12} style={{ color: "var(--error)" }} />
                  <p className="text-xs" style={{ color: "var(--error)" }}>{integration.lastSync}</p>
                </div>
              ) : null}

              {/* Actions */}
              <div className="flex gap-2">
                {integration.status === "connected" ? (
                  <>
                    <button
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all hover:bg-muted"
                      style={{ border: "1px solid var(--surface-track)", color: "var(--muted-foreground)" }}
                    >
                      <Settings size={12} />
                      Configure
                    </button>
                    <button
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all"
                      style={{ backgroundColor: "var(--primary-container)", color: "var(--primary)" }}
                    >
                      <RefreshCw size={12} />
                      Sync Now
                    </button>
                  </>
                ) : integration.status === "error" ? (
                  <button
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold"
                    style={{ backgroundColor: "var(--error-container)", color: "var(--error)" }}
                  >
                    <RefreshCw size={12} />
                    Retry Connection
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(integration.id)}
                    disabled={isConnecting}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-primary-foreground transition-all hover:shadow-md"
                    style={{ background: isConnecting ? "var(--outline)" : "linear-gradient(135deg, var(--primary), var(--primary-strong))" }}
                  >
                    {isConnecting ? (
                      <><RefreshCw size={12} className="animate-spin" /> Connecting...</>
                    ) : (
                      <><Plus size={12} /> Connect</>
                    )}
                  </button>
                )}
                <button
                  className="p-2 rounded-xl transition-colors hover:bg-muted"
                  style={{ color: "var(--outline)", border: "1px solid var(--surface-track)" }}
                >
                  <ExternalLink size={12} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {addIntegrationOpen && (
          <AddIntegrationWizard onClose={() => setAddIntegrationOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
