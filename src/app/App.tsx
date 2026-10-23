import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { LoginScreen } from "./components/LoginScreen";
import { AppShell, type ViewType } from "./components/AppShell";
import { Dashboard } from "./components/Dashboard";
import { AICopilot } from "./components/AICopilot";
import { PredictiveAnalytics } from "./components/PredictiveAnalytics";
import { WorkflowEngine } from "./components/WorkflowEngine";
import { InsightsCenter } from "./components/InsightsCenter";
import { Reports } from "./components/Reports";
import { AlertsCenter } from "./components/AlertsCenter";
import { TeamCollab } from "./components/TeamCollab";
import { DataIntegrations } from "./components/DataIntegrations";
import { Governance } from "./components/Governance";
import { AdminPanel } from "./components/AdminPanel";
import { UXCaseStudy } from "./components/UXCaseStudy";

function AppInner() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard onViewChange={(v) => setCurrentView(v as ViewType)} />;
      case "copilot":
        return <AICopilot />;
      case "analytics":
        return <PredictiveAnalytics />;
      case "workflows":
        return <WorkflowEngine />;
      case "insights":
        return <InsightsCenter />;
      case "reports":
        return <Reports />;
      case "alerts":
        return <AlertsCenter />;
      case "teams":
        return <TeamCollab />;
      case "integrations":
        return <DataIntegrations />;
      case "governance":
        return <Governance />;
      case "admin":
        return <AdminPanel />;
      case "ux-case-study":
        return <UXCaseStudy />;
      default:
        return <Dashboard onViewChange={(v) => setCurrentView(v as ViewType)} />;
    }
  };

  return (
    <AppShell
      currentView={currentView}
      onViewChange={setCurrentView}
      onLogout={() => setIsLoggedIn(false)}
    >
      {renderView()}
    </AppShell>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
