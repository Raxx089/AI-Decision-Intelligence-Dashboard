import { useState } from "react";
import { Eye, EyeOff, Brain, TrendingUp, BarChart3, Zap, Shield, CheckCircle2, ArrowRight, Sparkles, Moon, Sun, Monitor } from "lucide-react";
import { motion } from "motion/react";
import { useTheme, type Theme } from "../context/ThemeContext";

interface LoginScreenProps {
  onLogin: () => void;
}

const floatingData = [
  { label: "Revenue +12%", color: "var(--primary-container)", text: "var(--primary)", x: "10%", y: "15%", delay: 0 },
  { label: "Risk Score: Low", color: "var(--success-container)", text: "var(--success)", x: "70%", y: "22%", delay: 0.3 },
  { label: "AI Confidence 94%", color: "var(--warning-container)", text: "var(--warning)", x: "15%", y: "60%", delay: 0.6 },
  { label: "Churn -8%", color: "var(--error-container)", text: "var(--error)", x: "65%", y: "72%", delay: 0.9 },
  { label: "Forecast Accuracy 97%", color: "var(--ai-container)", text: "var(--ai)", x: "35%", y: "82%", delay: 1.2 },
];

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const themeCycle: Theme[] = ["light", "dark", "system"];
  const nextTheme = themeCycle[(themeCycle.indexOf(theme) + 1) % themeCycle.length];
  const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden" style={{ backgroundColor: "var(--page)" }}>
      <button
        type="button"
        onClick={() => setTheme(nextTheme)}
        aria-label={`Theme: ${theme}. Switch to ${nextTheme} theme`}
        title={`Theme: ${theme}`}
        className="absolute right-6 top-6 z-20 flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--outline-variant)",
          color: "var(--foreground)",
        }}
      >
        <ThemeIcon size={16} />
        <span className="capitalize">{theme}</span>
      </button>
      {/* Left Panel - AI Visualization */}
      <div
        className="hidden lg:flex flex-col relative overflow-hidden"
        style={{
          width: "58%",
          background: "linear-gradient(135deg, var(--on-primary-container) 0%, var(--primary) 45%, var(--info) 100%)",
        }}
      >
        {/* Background grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(color-mix(in srgb, var(--primary-foreground) 10%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--primary-foreground) 10%, transparent) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Radial glow */}
        <div
          className="absolute"
          style={{
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, color-mix(in srgb, var(--primary-foreground) 8%, transparent) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />

        {/* Network nodes visualization */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 800 600">
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="color-mix(in srgb, var(--primary-foreground) 50%, transparent)" />
            </marker>
          </defs>
          {/* Connection lines */}
          {[
            [400, 300, 150, 120], [400, 300, 650, 150], [400, 300, 680, 420],
            [400, 300, 200, 480], [400, 300, 120, 320], [400, 300, 580, 280],
            [150, 120, 280, 200], [650, 150, 580, 280], [200, 480, 320, 400],
            [680, 420, 580, 280], [120, 320, 200, 480],
          ].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="color-mix(in srgb, var(--primary-foreground) 40%, transparent)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
          ))}
          {/* Nodes */}
          {[
            [400, 300, 20], [150, 120, 12], [650, 150, 12], [680, 420, 12],
            [200, 480, 12], [120, 320, 12], [580, 280, 10], [320, 400, 10], [280, 200, 10],
          ].map(([cx, cy, r], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r={(r as number) + 8} fill="color-mix(in srgb, var(--primary-foreground) 5%, transparent)" />
              <circle cx={cx} cy={cy} r={r} fill="color-mix(in srgb, var(--primary-foreground) 30%, transparent)" stroke="color-mix(in srgb, var(--primary-foreground) 60%, transparent)" strokeWidth="1.5" />
            </g>
          ))}
          {/* Center pulse */}
          <circle cx="400" cy="300" r="30" fill="none" stroke="color-mix(in srgb, var(--primary-foreground) 30%, transparent)" strokeWidth="2">
            <animate attributeName="r" values="20;40;20" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
          </circle>
        </svg>

        {/* Floating metric chips */}
        {floatingData.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: item.delay + 0.5, duration: 0.5, type: "spring" }}
            className="absolute flex items-center gap-2 px-3 py-2 rounded-xl shadow-lg backdrop-blur-sm"
            style={{
              left: item.x,
              top: item.y,
              backgroundColor: "color-mix(in srgb, var(--primary-foreground) 12%, transparent)",
              border: "1px solid color-mix(in srgb, var(--primary-foreground) 20%, transparent)",
            }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-primary-foreground text-xs font-medium">{item.label}</span>
          </motion.div>
        ))}

        {/* Main content */}
        <div className="relative z-10 flex flex-col justify-center flex-1 px-16 py-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "color-mix(in srgb, var(--primary-foreground) 20%, transparent)" }}
              >
                <Brain size={24} color="var(--primary-foreground)" />
              </div>
              <span className="text-2xl font-bold text-primary-foreground tracking-tight">DecisionOS AI</span>
            </div>

            <h1 className="text-4xl font-bold text-primary-foreground leading-tight mb-4">
              Enterprise Intelligence,<br />
              <span style={{ color: "var(--primary-soft)" }}>Reimagined.</span>
            </h1>
            <p className="text-lg mb-10" style={{ color: "color-mix(in srgb, var(--primary-foreground) 75%, transparent)" }}>
              AI-powered decisions. Predictive intelligence.<br />
              Real-time operational clarity.
            </p>

            {/* Feature highlights */}
            <div className="space-y-4">
              {[
                { icon: Sparkles, text: "AI-generated executive insights & summaries" },
                { icon: TrendingUp, text: "Predictive forecasting with 97% accuracy" },
                { icon: Zap, text: "Decision workflows 3× faster than traditional BI" },
                { icon: BarChart3, text: "Real-time operational intelligence dashboard" },
              ].map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.15 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "color-mix(in srgb, var(--primary-foreground) 15%, transparent)" }}
                  >
                    <Icon size={16} color="var(--primary-foreground)" />
                  </div>
                  <span className="text-sm" style={{ color: "color-mix(in srgb, var(--primary-foreground) 80%, transparent)" }}>{text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom stats */}
        <div
          className="relative z-10 flex gap-8 px-16 py-8"
          style={{ borderTop: "1px solid color-mix(in srgb, var(--primary-foreground) 10%, transparent)" }}
        >
          {[
            { value: "500+", label: "Enterprise Clients" },
            { value: "99.9%", label: "Uptime SLA" },
            { value: "$2.4B", label: "Decisions Supported" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-2xl font-bold text-primary-foreground">{value}</div>
              <div className="text-xs" style={{ color: "color-mix(in srgb, var(--primary-foreground) 60%, transparent)" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-col w-full lg:w-[42%] items-center justify-center bg-card relative px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "var(--primary)" }}>
              <Brain size={20} color="var(--primary-foreground)" />
            </div>
            <span className="text-xl font-bold" style={{ color: "var(--foreground)" }}>DecisionOS AI</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--foreground)" }}>Welcome back</h2>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Sign in to your enterprise workspace</p>
          </div>

          {/* SSO Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all hover:shadow-md active:scale-[0.98]"
              style={{ borderColor: "var(--outline-variant)", color: "var(--muted-foreground)", backgroundColor: "var(--card)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google SSO
            </button>
            <button
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all hover:shadow-md active:scale-[0.98]"
              style={{ borderColor: "var(--outline-variant)", color: "var(--muted-foreground)", backgroundColor: "var(--card)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#0078D4">
                <path d="M11.4 24H0V12.6L11.4 24zM24 24H12.6L0 11.4V0h11.4L24 12.6V24z" />
              </svg>
              Continue with Microsoft SSO
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--outline-variant)" }} />
            <span className="text-xs" style={{ color: "var(--outline)" }}>or sign in with email</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--outline-variant)" }} />
          </div>

          {/* Email field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                border: "1.5px solid var(--outline-variant)",
                color: "var(--foreground)",
                backgroundColor: "var(--page)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--outline-variant)")}
            />
          </div>

          {/* Password field */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all pr-12"
                style={{
                  border: "1.5px solid var(--outline-variant)",
                  color: "var(--foreground)",
                  backgroundColor: "var(--page)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--outline-variant)")}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                style={{ color: "var(--outline)" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded"
                style={{ accentColor: "var(--primary)" }}
              />
              <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>Remember me</span>
            </label>
            <button className="text-sm font-medium" style={{ color: "var(--primary)" }}>
              Forgot password?
            </button>
          </div>

          {/* Login CTA */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-80"
            style={{
              background: loading
                ? "var(--primary)"
                : "linear-gradient(135deg, var(--primary) 0%, var(--primary-strong) 100%)",
              boxShadow: "0 2px 12px color-mix(in srgb, var(--primary) 35%, transparent)",
            }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-card border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign in to DecisionOS
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Security trust indicators */}
          <div
            className="mt-6 p-4 rounded-xl flex items-center gap-3"
            style={{ backgroundColor: "var(--page)", border: "1px solid var(--surface-track)" }}
          >
            <Shield size={16} style={{ color: "var(--success)", flexShrink: 0 }} />
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              Protected with enterprise-grade 256-bit AES encryption and multi-factor authentication.
            </p>
          </div>
        </motion.div>

        {/* Compliance badges */}
        <div className="absolute bottom-8 flex flex-wrap justify-center gap-3 px-4">
          {["SOC 2 Type II", "GDPR Compliant", "ISO 27001"].map((badge) => (
            <div
              key={badge}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: "var(--success-container)", border: "1px solid var(--success-container)" }}
            >
              <CheckCircle2 size={12} style={{ color: "var(--success)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--success)" }}>{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
