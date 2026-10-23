import { useState } from "react";
import {
  Users, Brain, CreditCard, ToggleLeft, ToggleRight,
  Plus, Search, Edit, Trash2, Shield, Activity,
  X, Download, Upload
} from "lucide-react";
import { motion } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const users = [
  { id: "1", name: "Jane Doe", email: "jane@acmecorp.com", role: "Admin", department: "Executive", status: "active", lastLogin: "Today 10:32 AM", mfa: true },
  { id: "2", name: "Sarah Chen", email: "sarah@acmecorp.com", role: "Manager", department: "Operations", status: "active", lastLogin: "Today 9:15 AM", mfa: true },
  { id: "3", name: "Mike Torres", email: "mike@acmecorp.com", role: "Manager", department: "Sales", status: "active", lastLogin: "Today 8:44 AM", mfa: true },
  { id: "4", name: "David Kim", email: "david@acmecorp.com", role: "Analyst", department: "Operations", status: "active", lastLogin: "Yesterday", mfa: false },
  { id: "5", name: "Lisa Park", email: "lisa@acmecorp.com", role: "Manager", department: "Finance", status: "active", lastLogin: "Today 10:01 AM", mfa: true },
  { id: "6", name: "James Lee", email: "james@acmecorp.com", role: "Viewer", department: "Security", status: "inactive", lastLogin: "May 10", mfa: true },
  { id: "7", name: "Alex Wright", email: "alex@acmecorp.com", role: "Analyst", department: "Data", status: "active", lastLogin: "Today 9:55 AM", mfa: false },
  { id: "8", name: "Jordan Smith", email: "jordan@acmecorp.com", role: "Viewer", department: "Marketing", status: "pending", lastLogin: "Never", mfa: false },
];

const usageData = [
  { month: "Jan", activeUsers: 182, aiQueries: 4200 },
  { month: "Feb", activeUsers: 196, aiQueries: 5100 },
  { month: "Mar", activeUsers: 210, aiQueries: 6300 },
  { month: "Apr", activeUsers: 224, aiQueries: 7200 },
  { month: "May", activeUsers: 247, aiQueries: 9400 },
];

const aiModels = [
  { name: "Revenue Forecasting", version: "v3.2", accuracy: 97, status: "active", lastRetrained: "May 1, 2026" },
  { name: "Churn Prediction", version: "v2.8", accuracy: 91, status: "active", lastRetrained: "Apr 15, 2026" },
  { name: "Risk Assessment", version: "v4.1", accuracy: 94, status: "active", lastRetrained: "May 5, 2026" },
  { name: "Anomaly Detection", version: "v2.3", accuracy: 89, status: "drift", lastRetrained: "Mar 20, 2026" },
  { name: "NLP Copilot", version: "v1.5", accuracy: 92, status: "active", lastRetrained: "May 10, 2026" },
];

const featureFlags = [
  { id: "ai_copilot", label: "AI Copilot (Beta)", description: "Conversational analytics assistant", enabled: true },
  { id: "predictive_v2", label: "Predictive Analytics v2", description: "Enhanced ML forecasting models", enabled: true },
  { id: "auto_insights", label: "Auto-Generated Insights", description: "Hourly AI insight generation", enabled: true },
  { id: "ai_reports", label: "AI Report Generation", description: "One-click AI report writing", enabled: false },
  { id: "voice_analytics", label: "Voice Analytics (Alpha)", description: "Voice-driven data queries", enabled: false },
  { id: "digital_twin", label: "Digital Twin Dashboard", description: "Real-time business simulation", enabled: false },
];

const roleColors: Record<string, { color: string; bg: string }> = {
  Admin: { color: "var(--error)", bg: "var(--error-container)" },
  Manager: { color: "var(--primary)", bg: "var(--primary-container)" },
  Analyst: { color: "var(--success)", bg: "var(--success-container)" },
  Viewer: { color: "var(--outline)", bg: "var(--muted)" },
};

const statusColors: Record<string, { color: string; bg: string }> = {
  active: { color: "var(--success)", bg: "var(--success-container)" },
  inactive: { color: "var(--outline)", bg: "var(--muted)" },
  pending: { color: "var(--warning)", bg: "var(--warning-container)" },
};

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<"users" | "ai_models" | "billing" | "features">("users");
  const [searchUsers, setSearchUsers] = useState("");
  const [flags, setFlags] = useState(featureFlags);

  const filteredUsers = users.filter(
    (u) => !searchUsers || u.name.toLowerCase().includes(searchUsers.toLowerCase()) || u.email.toLowerCase().includes(searchUsers.toLowerCase())
  );

  const toggleFlag = (id: string) => {
    setFlags((prev) => prev.map((f) => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>Admin Panel</h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Workspace management, AI models, and enterprise controls</p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
          style={{ backgroundColor: "var(--primary-container)", color: "var(--primary)" }}
        >
          <Shield size={14} />
          Enterprise Plan · 247 Seats
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: "247", icon: Users, color: "var(--primary)", bg: "var(--primary-container)" },
          { label: "Active Today", value: "183", icon: Activity, color: "var(--success)", bg: "var(--success-container)" },
          { label: "AI Queries (Today)", value: "9,400", icon: Brain, color: "var(--ai)", bg: "var(--ai-container)" },
          { label: "Monthly Cost", value: "$18,400", icon: CreditCard, color: "var(--warning)", bg: "var(--warning-container)" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-card rounded-2xl p-4 flex items-center gap-3" style={{ border: "1px solid var(--surface-track)" }}>
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

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: "var(--muted)" }}>
        {[
          { id: "users", label: "User Management", icon: Users },
          { id: "ai_models", label: "AI Models", icon: Brain },
          { id: "billing", label: "Billing", icon: CreditCard },
          { id: "features", label: "Feature Flags", icon: ToggleLeft },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: activeTab === id ? "var(--card)" : "transparent",
              color: activeTab === id ? "var(--primary)" : "var(--muted-foreground)",
              boxShadow: activeTab === id ? "0 1px 4px color-mix(in srgb, var(--scrim) 10%, transparent)" : "none",
            }}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="bg-card rounded-2xl overflow-hidden" style={{ border: "1px solid var(--surface-track)" }}>
          <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--surface-track)" }}>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--outline)" }} />
              <input
                value={searchUsers}
                onChange={(e) => setSearchUsers(e.target.value)}
                placeholder="Search users..."
                className="pl-8 pr-3 py-1.5 rounded-xl text-xs outline-none"
                style={{ border: "1px solid var(--outline-variant)", backgroundColor: "var(--page)", color: "var(--foreground)", width: 200 }}
              />
            </div>
            <div className="flex gap-2">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
                style={{ border: "1px solid var(--outline-variant)", color: "var(--muted-foreground)" }}
              >
                <Upload size={12} />
                Import CSV
              </button>
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-primary-foreground"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-strong))" }}
              >
                <Plus size={12} />
                Invite User
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--page)" }}>
                  {["Name", "Email", "Role", "Department", "Status", "Last Login", "MFA", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const rc = roleColors[user.role];
                  const sc = statusColors[user.status];
                  return (
                    <tr key={user.id} className="hover:bg-page transition-colors" style={{ borderTop: "1px solid var(--muted)" }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-primary-foreground flex-shrink-0"
                            style={{ backgroundColor: "var(--primary)", fontSize: "var(--text-2xs)", fontWeight: 500 }}
                          >
                            {user.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{user.email}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: rc.bg, color: rc.color }}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>{user.department}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: sc.bg, color: sc.color }}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--outline)" }}>{user.lastLogin}</td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: user.mfa ? "var(--success-container)" : "var(--error-container)", color: user.mfa ? "var(--success)" : "var(--error)" }}
                        >
                          {user.mfa ? "Enabled" : "Disabled"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-muted" style={{ color: "var(--primary)" }}><Edit size={13} /></button>
                          <button className="p-1.5 rounded-lg hover:bg-error-container" style={{ color: "var(--error)" }}><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Models Tab */}
      {activeTab === "ai_models" && (
        <div className="space-y-4">
          {/* Usage Chart */}
          <div className="bg-card rounded-2xl p-5" style={{ border: "1px solid var(--surface-track)" }}>
            <h3 className="font-semibold mb-4" style={{ color: "var(--foreground)" }}>AI Usage Analytics</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={usageData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
                <XAxis interval={0} dataKey="month" tick={{ fill: "var(--outline)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis interval={0} tick={{ fill: "var(--outline)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="aiQueries" fill="var(--primary)" radius={[4, 4, 0, 0]} name="AI Queries" />
                <Bar dataKey="activeUsers" fill="var(--primary-container)" radius={[4, 4, 0, 0]} name="Active Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {aiModels.map((model) => (
              <div key={model.name} className="bg-card rounded-2xl p-5" style={{ border: "1px solid var(--surface-track)" }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--primary), var(--ai))" }}>
                      <Brain size={18} color="var(--primary-foreground)" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{model.name}</p>
                      <p className="text-xs" style={{ color: "var(--outline)" }}>Version {model.version} · Last retrained: {model.lastRetrained}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-bold" style={{ color: model.accuracy > 93 ? "var(--success)" : "var(--warning)" }}>
                        {model.accuracy}%
                      </p>
                      <p className="text-xs" style={{ color: "var(--outline)" }}>Accuracy</p>
                    </div>
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: model.status === "active" ? "var(--success-container)" : "var(--warning-container)",
                        color: model.status === "active" ? "var(--success)" : "var(--warning)",
                      }}
                    >
                      {model.status === "drift" ? "⚠ Model Drift" : "● Active"}
                    </span>
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
                      style={{ border: "1px solid var(--outline-variant)", color: "var(--muted-foreground)" }}
                    >
                      Retrain
                    </button>
                  </div>
                </div>
                <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--surface-track)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${model.accuracy}%`,
                      backgroundColor: model.accuracy > 93 ? "var(--success)" : "var(--warning)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === "billing" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-card rounded-2xl p-6" style={{ border: "1px solid var(--surface-track)" }}>
            <h3 className="font-semibold mb-4" style={{ color: "var(--foreground)" }}>Subscription Overview</h3>
            <div
              className="p-5 rounded-2xl mb-5"
              style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-strong))" }}
            >
              <p className="text-primary-foreground/70 text-sm mb-1">Current Plan</p>
              <p className="text-2xl font-bold text-primary-foreground mb-1">Enterprise Plus</p>
              <p className="text-primary-foreground/70 text-sm">247 of 500 seats · Renews Dec 1, 2026</p>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-4xl font-bold text-primary-foreground">$18,400</span>
                <span className="text-primary-foreground/70">/month</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Seats Used", value: "247/500", pct: 49.4 },
                { label: "API Calls (May)", value: "284K/1M", pct: 28.4 },
                { label: "Storage Used", value: "1.2TB/5TB", pct: 24 },
              ].map(({ label, value, pct }) => (
                <div key={label} className="p-3 rounded-xl" style={{ backgroundColor: "var(--page)" }}>
                  <p className="text-xs mb-2" style={{ color: "var(--outline)" }}>{label}</p>
                  <p className="text-sm font-bold mb-1.5" style={{ color: "var(--foreground)" }}>{value}</p>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--surface-track)" }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: "var(--primary)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-card rounded-2xl p-5" style={{ border: "1px solid var(--surface-track)" }}>
              <h3 className="font-semibold mb-3" style={{ color: "var(--foreground)" }}>Add-ons</h3>
              {[
                { name: "AI Copilot Pro", price: "$2,400/mo", active: true },
                { name: "Advanced ML Suite", price: "$1,800/mo", active: true },
                { name: "Executive Reporting", price: "$600/mo", active: false },
              ].map(({ name, price, active }) => (
                <div key={name} className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid var(--muted)" }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{name}</p>
                    <p className="text-xs" style={{ color: "var(--outline)" }}>{price}</p>
                  </div>
                  <span
                    className="text-xs font-medium px-2 py-1 rounded-full"
                    style={{ backgroundColor: active ? "var(--success-container)" : "var(--muted)", color: active ? "var(--success)" : "var(--outline)" }}
                  >
                    {active ? "Active" : "Add"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Feature Flags Tab */}
      {activeTab === "features" && (
        <div className="bg-card rounded-2xl overflow-hidden" style={{ border: "1px solid var(--surface-track)" }}>
          <div className="p-5" style={{ borderBottom: "1px solid var(--surface-track)" }}>
            <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>Feature Flags & Controls</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--outline)" }}>Toggle features for your workspace</p>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--muted)" }}>
            {flags.map((flag) => (
              <div key={flag.id} className="flex items-center justify-between p-5 hover:bg-page transition-colors">
                <div className="flex-1 mr-4">
                  <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{flag.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--outline)" }}>{flag.description}</p>
                </div>
                <button
                  onClick={() => toggleFlag(flag.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{
                    backgroundColor: flag.enabled ? "var(--primary-container)" : "var(--muted)",
                    color: flag.enabled ? "var(--primary)" : "var(--outline)",
                  }}
                >
                  {flag.enabled ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  {flag.enabled ? "Enabled" : "Disabled"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
