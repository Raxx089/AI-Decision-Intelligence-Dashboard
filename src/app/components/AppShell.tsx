import { useState, useRef, useEffect } from "react";
import { alpha } from "../lib/color";
import {
  LayoutDashboard, Bot, TrendingUp, GitBranch, Lightbulb, FileBarChart,
  Bell, Users, Plug, Shield, Settings, Search, ChevronDown, Menu, X,
  Brain, ChevronLeft, ChevronRight, BookOpen, LogOut, HelpCircle, Moon, Sun, Monitor
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme, type Theme } from "../context/ThemeContext";
import { HelpCenter } from "./HelpCenter";

export type ViewType =
  | "dashboard" | "copilot" | "analytics" | "workflows" | "insights"
  | "reports" | "alerts" | "teams" | "integrations" | "governance"
  | "admin" | "ux-case-study";

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "copilot", label: "AI Copilot", icon: Bot, badge: "AI", badgeColor: "var(--primary)" },
  { id: "analytics", label: "Predictive Analytics", icon: TrendingUp },
  { id: "workflows", label: "Decision Workflows", icon: GitBranch, badge: "5", badgeColor: "var(--warning)" },
  { id: "insights", label: "AI Insights", icon: Lightbulb, badge: "12", badgeColor: "var(--error)" },
  { id: "reports", label: "Reports", icon: FileBarChart },
  { id: "alerts", label: "Alerts Center", icon: Bell, badge: "3", badgeColor: "var(--error)" },
  { id: "teams", label: "Team Collaboration", icon: Users },
  { id: "integrations", label: "Data Integrations", icon: Plug },
  { id: "governance", label: "Governance", icon: Shield },
  { id: "admin", label: "Admin Panel", icon: Settings },
  { id: "ux-case-study", label: "UX Case Study", icon: BookOpen, badge: "New", badgeColor: "var(--success)" },
];

interface AppShellProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const THEME_CYCLE: Theme[] = ["light", "dark", "system"];
const THEME_ICONS = { light: Sun, dark: Moon, system: Monitor };
const THEME_LABELS = { light: "Light", dark: "Dark", system: "System" };

const SEARCH_CORPUS = [
  { label: "Q3 Revenue Dashboard", type: "Report", view: "reports" as ViewType, desc: "Monthly revenue trends and KPIs" },
  { label: "APAC Risk Mitigation", type: "Decision", view: "workflows" as ViewType, desc: "Q3 budget reallocation workflow" },
  { label: "Customer Churn Prevention", type: "Decision", view: "workflows" as ViewType, desc: "142 at-risk enterprise accounts" },
  { label: "Revenue Forecast — Q3", type: "Insight", view: "analytics" as ViewType, desc: "Predictive model · 94% confidence" },
  { label: "EU Pricing Strategy", type: "Decision", view: "workflows" as ViewType, desc: "Dynamic EUR pricing optimization" },
  { label: "SAP ERP Connection Error", type: "Alert", view: "alerts" as ViewType, desc: "Integration failed 3 hours ago" },
  { label: "Supply Chain Disruption Risk", type: "Alert", view: "alerts" as ViewType, desc: "APAC logistics — 67% risk" },
  { label: "AI Model Accuracy Report", type: "Report", view: "reports" as ViewType, desc: "97.2% accuracy · v2.4 model" },
  { label: "Governance Policy Update", type: "Policy", view: "governance" as ViewType, desc: "AI decision audit framework" },
  { label: "Salesforce Integration", type: "Integration", view: "integrations" as ViewType, desc: "CRM sync · 142K accounts" },
  { label: "ISO 27001 Compliance Audit", type: "Decision", view: "workflows" as ViewType, desc: "Annual security certification" },
  { label: "Team Q2 Performance", type: "Report", view: "teams" as ViewType, desc: "Cross-functional team metrics" },
  { label: "Churn Risk Analysis", type: "Insight", view: "analytics" as ViewType, desc: "8% churn increase predicted" },
  { label: "North America Sales Expansion", type: "Decision", view: "workflows" as ViewType, desc: "+$12M ARR opportunity" },
  { label: "Snowflake Data Warehouse", type: "Integration", view: "integrations" as ViewType, desc: "2.4B rows · Real-time sync" },
];

const TYPE_COLORS: Record<string, { color: string; bg: string }> = {
  Report: { color: "var(--primary)", bg: "var(--primary-tint)" },
  Decision: { color: "var(--warning)", bg: "var(--warning-container)" },
  Insight: { color: "var(--success)", bg: "var(--success-container)" },
  Alert: { color: "var(--error)", bg: "var(--error-container)" },
  Policy: { color: "var(--ai)", bg: "var(--ai-container)" },
  Integration: { color: "var(--info)", bg: "var(--info-container)" },
};

export function AppShell({ currentView, onViewChange, onLogout, children }: AppShellProps) {
  const { theme, isDark, setTheme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [notifications] = useState(7);
  const searchRef = useRef<HTMLInputElement>(null);

  const searchResults = searchQuery.trim()
    ? SEARCH_CORPUS.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SEARCH_CORPUS.slice(0, 6);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
      if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const currentNavItem = navItems.find((n) => n.id === currentView);
  const ThemeIcon = THEME_ICONS[theme];

  // Theme-aware colors
  const headerBg = "var(--card)";
  const headerBorder = "var(--surface-track)";
  const contentBg = "var(--page)";
  const searchBg = searchFocused
    ? ("var(--card)")
    : ("var(--muted)");
  const searchBorder = searchFocused ? "var(--primary)" : "transparent";
  const textPrimary = "var(--foreground)";
  const textSub = "var(--muted-foreground)";
  const textTertiary = "var(--outline)";
  const dropdownBg = "var(--card)";
  const dropdownBorder = "var(--surface-track)";

  const cycleTheme = () => {
    const idx = THEME_CYCLE.indexOf(theme);
    setTheme(THEME_CYCLE[(idx + 1) % THEME_CYCLE.length]);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: contentBg }}>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ backgroundColor: "color-mix(in srgb, var(--scrim) 50%, transparent)" }}
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 72 : 240 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden lg:flex flex-col h-full relative z-30 flex-shrink-0"
        style={{
          backgroundColor: "var(--sidebar)",
          borderRight: "1px solid color-mix(in srgb, var(--sidebar-foreground) 6%, transparent)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center px-4 flex-shrink-0"
          style={{ height: 64, borderBottom: "1px solid color-mix(in srgb, var(--sidebar-foreground) 6%, transparent)" }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--info))" }}
          >
            <Brain size={18} color="var(--primary-foreground)" />
          </div>
          {!sidebarCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-3 overflow-hidden">
              <div className="text-sm font-bold text-sidebar-foreground leading-tight">DecisionOS</div>
              <div className="text-xs" style={{ color: "color-mix(in srgb, var(--sidebar-foreground) 45%, transparent)" }}>AI Enterprise</div>
            </motion.div>
          )}
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="ml-auto p-1.5 rounded-lg transition-colors hover:bg-sidebar-foreground/10"
              style={{ color: "color-mix(in srgb, var(--sidebar-foreground) 45%, transparent)" }}
            >
              <ChevronLeft size={14} />
            </button>
          )}
        </div>

        {/* Workspace Selector */}
        {!sidebarCollapsed && (
          <div className="px-3 py-3">
            <button
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors hover:bg-sidebar-foreground/5"
              style={{ border: "1px solid color-mix(in srgb, var(--sidebar-foreground) 10%, transparent)" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-primary-foreground"
                  style={{ backgroundColor: "var(--error)" }}
                >
                  A
                </div>
                <div>
                  <div className="text-xs font-medium text-sidebar-foreground">Acme Corp</div>
                  <div className="text-xs" style={{ color: "color-mix(in srgb, var(--sidebar-foreground) 40%, transparent)" }}>Enterprise Plan</div>
                </div>
              </div>
              <ChevronDown size={12} style={{ color: "color-mix(in srgb, var(--sidebar-foreground) 40%, transparent)" }} />
            </button>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { onViewChange(item.id); setMobileSidebarOpen(false); }}
                title={sidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 rounded-xl transition-all text-left relative py-2.5 ${sidebarCollapsed ? "px-3 justify-center" : "px-3"}`}
                style={{
                  backgroundColor: isActive ? "color-mix(in srgb, var(--primary) 18%, transparent)" : "transparent",
                  color: isActive ? "var(--primary-soft)" : "color-mix(in srgb, var(--sidebar-foreground) 65%, transparent)",
                }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "color-mix(in srgb, var(--sidebar-foreground) 6%, transparent)"; }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
              >
                <Icon size={17} style={{ flexShrink: 0 }} />
                {!sidebarCollapsed && (
                  <>
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    {item.badge && (
                      <span
                        className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: alpha(item.badgeColor, "22"),
                          color: item.badgeColor,
                          border: `1px solid ${alpha(item.badgeColor, "44")}`,
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {sidebarCollapsed && item.badge && (
                  <div
                    className="absolute right-1 top-1 w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.badgeColor }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Bottom */}
        <div className="px-2 pb-4 space-y-0.5" style={{ borderTop: "1px solid color-mix(in srgb, var(--sidebar-foreground) 6%, transparent)", paddingTop: 8 }}>
          <button
            onClick={() => setHelpOpen(true)}
            title={sidebarCollapsed ? "Help" : undefined}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-sidebar-foreground/6"
            style={{ color: "color-mix(in srgb, var(--sidebar-foreground) 45%, transparent)" }}
          >
            <HelpCircle size={17} />
            {!sidebarCollapsed && <span className="text-sm">Help & Support</span>}
          </button>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-sidebar-foreground/6"
            style={{ color: "color-mix(in srgb, var(--sidebar-foreground) 45%, transparent)" }}
          >
            <Menu size={17} />
            {!sidebarCollapsed && <span className="text-sm">Collapse menu</span>}
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-sidebar-foreground/6"
            style={{ color: "color-mix(in srgb, var(--sidebar-foreground) 45%, transparent)" }}
          >
            <LogOut size={17} />
            {!sidebarCollapsed && <span className="text-sm">Sign out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Navigation */}
        <header
          className="flex items-center gap-3 px-4 lg:px-6 flex-shrink-0"
          style={{
            height: 64,
            backgroundColor: headerBg,
            borderBottom: `1px solid ${headerBorder}`,
            boxShadow: "0 1px 3px color-mix(in srgb, var(--scrim) 5%, transparent)",
          }}
        >
          {/* Mobile menu */}
          <button
            className="lg:hidden p-2 rounded-xl"
            style={{ color: textTertiary }}
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-sm" style={{ color: textTertiary }}>Acme Corp</span>
            <span style={{ color: "var(--outline-variant)" }}>/</span>
            <span className="text-sm font-medium" style={{ color: textPrimary }}>{currentNavItem?.label}</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-auto relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: textTertiary }} />
            <input
              type="text"
              readOnly
              placeholder="Search insights, reports, workflows… (⌘K)"
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none transition-all cursor-pointer"
              style={{
                backgroundColor: searchFocused ? ("var(--card)") : ("var(--muted)"),
                border: `1.5px solid ${searchFocused ? "var(--primary)" : "transparent"}`,
                color: textPrimary,
              }}
              onFocus={() => { setSearchFocused(true); setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }}
              onBlur={() => setSearchFocused(false)}
              onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }}
            />
          </div>

          <div className="flex items-center gap-1 ml-auto">
            {/* AI Copilot */}
            <button
              onClick={() => onViewChange("copilot")}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:shadow-md active:scale-[0.97]"
              style={{ background: "linear-gradient(135deg, var(--primary), var(--info))", color: "var(--primary-foreground)" }}
            >
              <Bot size={14} />
              AI Copilot
            </button>

            {/* Theme Toggle */}
            <div className="relative">
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="p-2 rounded-xl transition-colors"
                style={{
                  color: textTertiary,
                  backgroundColor: themeMenuOpen ? ("var(--muted)") : "transparent",
                }}
                title={`Theme: ${THEME_LABELS[theme]}`}
              >
                <ThemeIcon size={17} />
              </button>

              <AnimatePresence>
                {themeMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.14 }}
                    className="absolute right-0 top-full mt-2 w-44 rounded-2xl shadow-xl overflow-hidden z-50"
                    style={{ backgroundColor: dropdownBg, border: `1px solid ${dropdownBorder}` }}
                    onMouseLeave={() => setThemeMenuOpen(false)}
                  >
                    <div className="px-3 py-2" style={{ borderBottom: `1px solid ${dropdownBorder}` }}>
                      <p className="text-xs font-semibold" style={{ color: textTertiary }}>APPEARANCE</p>
                    </div>
                    {(["light", "dark", "system"] as Theme[]).map((t) => {
                      const Icon = THEME_ICONS[t];
                      const active = theme === t;
                      return (
                        <button
                          key={t}
                          onClick={() => { setTheme(t); setThemeMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                          style={{
                            backgroundColor: active ? ("var(--primary-tint)") : "transparent",
                            color: active ? "var(--primary)" : textPrimary,
                          }}
                        >
                          <Icon size={15} />
                          <span className="flex-1">{THEME_LABELS[t]}</span>
                          {active && (
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--primary)" }} />
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <button
              onClick={() => onViewChange("alerts")}
              className="relative p-2 rounded-xl transition-colors"
              style={{ color: textTertiary }}
            >
              <Bell size={17} />
              {notifications > 0 && (
                <span
                  className="absolute top-1 right-1 w-4 h-4 rounded-full text-primary-foreground flex items-center justify-center"
                  style={{ fontSize: "var(--text-2xs)", fontWeight: 500, backgroundColor: "var(--error)" }}
                >
                  {notifications}
                </span>
              )}
            </button>

            {/* Help */}
            <button
              onClick={() => setHelpOpen(true)}
              className="hidden lg:block p-2 rounded-xl transition-colors"
              style={{ color: textTertiary }}
            >
              <HelpCircle size={17} />
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl transition-colors"
                style={{ backgroundColor: profileOpen ? ("var(--muted)") : "transparent" }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground"
                  style={{ background: "linear-gradient(135deg, var(--primary), var(--info))" }}
                >
                  JD
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold leading-tight" style={{ color: textPrimary }}>Jane Doe</div>
                  <div className="text-xs" style={{ color: textTertiary }}>CEO</div>
                </div>
                <ChevronDown size={13} style={{ color: textTertiary }} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-xl overflow-hidden z-50"
                    style={{ backgroundColor: dropdownBg, border: `1px solid ${dropdownBorder}` }}
                  >
                    <div className="px-4 py-3" style={{ borderBottom: `1px solid ${dropdownBorder}` }}>
                      <div className="text-sm font-semibold" style={{ color: textPrimary }}>Jane Doe</div>
                      <div className="text-xs" style={{ color: textSub }}>jane@acmecorp.com</div>
                    </div>

                    {/* Theme submenu in profile */}
                    <div className="px-4 py-2.5" style={{ borderBottom: `1px solid ${dropdownBorder}` }}>
                      <p className="text-xs font-semibold mb-2" style={{ color: textTertiary }}>THEME</p>
                      <div className="flex gap-1">
                        {(["light", "dark", "system"] as Theme[]).map((t) => {
                          const Icon = THEME_ICONS[t];
                          return (
                            <button
                              key={t}
                              onClick={() => { setTheme(t); setProfileOpen(false); }}
                              className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-medium transition-all"
                              style={{
                                backgroundColor: theme === t ? "var(--primary)" : ("var(--muted)"),
                                color: theme === t ? "var(--card)" : textSub,
                              }}
                            >
                              <Icon size={13} />
                              {THEME_LABELS[t]}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {[
                      { label: "Profile Settings", icon: Settings, action: undefined as (() => void) | undefined },
                      { label: "Admin Panel", icon: Shield, action: () => { onViewChange("admin"); setProfileOpen(false); } },
                      { label: "Help Center", icon: HelpCircle, action: () => { setHelpOpen(true); setProfileOpen(false); } },
                    ].map(({ label, icon: Icon, action }) => (
                      <button
                        key={label}
                        onClick={action}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                        style={{ color: textPrimary }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--page)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <Icon size={14} />
                        {label}
                      </button>
                    ))}

                    <div style={{ borderTop: `1px solid ${dropdownBorder}` }}>
                      <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                        style={{ color: "var(--error)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--error-container)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <LogOut size={14} />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: contentBg }}>
          {children}
        </main>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25 }}
            className="fixed left-0 top-0 h-full w-72 z-50 flex flex-col lg:hidden"
            style={{ backgroundColor: "var(--sidebar)" }}
          >
            <div
              className="flex items-center justify-between px-4 py-4"
              style={{ borderBottom: "1px solid color-mix(in srgb, var(--sidebar-foreground) 6%, transparent)" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--primary), var(--info))" }}>
                  <Brain size={16} color="var(--primary-foreground)" />
                </div>
                <span className="font-bold text-sidebar-foreground">DecisionOS AI</span>
              </div>
              <button onClick={() => setMobileSidebarOpen(false)} style={{ color: "color-mix(in srgb, var(--sidebar-foreground) 50%, transparent)" }}>
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
              {navItems.map((item) => {
                const isActive = currentView === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => { onViewChange(item.id); setMobileSidebarOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors"
                    style={{
                      backgroundColor: isActive ? "color-mix(in srgb, var(--primary) 18%, transparent)" : "transparent",
                      color: isActive ? "var(--primary-soft)" : "color-mix(in srgb, var(--sidebar-foreground) 65%, transparent)",
                    }}
                  >
                    <Icon size={17} />
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.badge && (
                      <span
                        className="ml-auto text-xs font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: alpha(item.badgeColor, "22"), color: item.badgeColor }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
            {/* Mobile theme toggle */}
            <div className="px-4 pb-4 pt-2" style={{ borderTop: "1px solid color-mix(in srgb, var(--sidebar-foreground) 6%, transparent)" }}>
              <div className="flex gap-1 mb-2">
                {(["light", "dark", "system"] as Theme[]).map((t) => {
                  const Icon = THEME_ICONS[t];
                  return (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all"
                      style={{
                        backgroundColor: theme === t ? "var(--primary)" : "color-mix(in srgb, var(--sidebar-foreground) 8%, transparent)",
                        color: theme === t ? "var(--card)" : "color-mix(in srgb, var(--sidebar-foreground) 50%, transparent)",
                      }}
                    >
                      <Icon size={13} />
                      {THEME_LABELS[t]}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => { setHelpOpen(true); setMobileSidebarOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors"
                style={{ color: "color-mix(in srgb, var(--sidebar-foreground) 50%, transparent)", backgroundColor: "color-mix(in srgb, var(--sidebar-foreground) 4%, transparent)" }}
              >
                <HelpCircle size={15} />
                Help & Support
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Center Slide-over */}
      <AnimatePresence>
        {helpOpen && <HelpCenter onClose={() => setHelpOpen(false)} />}
      </AnimatePresence>

      {/* Global Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4"
            style={{ backgroundColor: "color-mix(in srgb, var(--scrim) 50%, transparent)", backdropFilter: "blur(4px)" }}
            onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden"
              style={{ backgroundColor: "var(--card)", border: `1px solid ${"var(--surface-track)"}` }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: `1px solid ${"var(--surface-track)"}` }}>
                <Search size={18} style={{ color: "var(--primary)", flexShrink: 0 }} />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search decisions, reports, insights, integrations..."
                  className="flex-1 text-sm outline-none bg-transparent"
                  style={{ color: textPrimary }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="p-1 rounded-lg hover:bg-muted transition-colors">
                    <X size={14} style={{ color: textTertiary }} />
                  </button>
                )}
                <kbd className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--muted)", color: textTertiary, fontFamily: "var(--font-mono)" }}>ESC</kbd>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {!searchQuery && (
                  <div className="px-4 py-2">
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: textTertiary }}>Recent & Suggested</p>
                  </div>
                )}
                {searchResults.length === 0 ? (
                  <div className="flex flex-col items-center py-10 space-y-2">
                    <Search size={24} style={{ color: textTertiary }} />
                    <p className="text-sm" style={{ color: textTertiary }}>No results for "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="py-2">
                    {searchResults.map((item, i) => {
                      const tc = TYPE_COLORS[item.type] || { color: "var(--muted-foreground)", bg: "var(--muted)" };
                      return (
                        <button
                          key={i}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-opacity-50"
                          style={{ backgroundColor: "transparent" }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--page)")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                          onClick={() => { onViewChange(item.view); setSearchOpen(false); setSearchQuery(""); }}
                        >
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: tc.bg, color: tc.color }}>
                            {item.type}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate" style={{ color: textPrimary }}>{item.label}</div>
                            <div className="text-xs truncate" style={{ color: textTertiary }}>{item.desc}</div>
                          </div>
                          <ChevronRight size={14} style={{ color: textTertiary, flexShrink: 0 }} />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer hint */}
              <div className="flex items-center gap-4 px-4 py-2 text-xs" style={{ borderTop: `1px solid ${"var(--surface-track)"}`, color: textTertiary }}>
                <span><kbd style={{ fontFamily: "var(--font-mono)" }}>↵</kbd> to navigate</span>
                <span><kbd style={{ fontFamily: "var(--font-mono)" }}>ESC</kbd> to close</span>
                <span className="ml-auto">⌘K to open</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
