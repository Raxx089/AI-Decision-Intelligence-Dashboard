import { useState } from "react";
import {
  Hash, MessageSquare, Plus, Send, Smile, Paperclip,
  BarChart2, Brain, AtSign, Bell, Users, Check, CheckCheck,
  ThumbsUp, Heart, Star, Bookmark
} from "lucide-react";
import { motion } from "motion/react";

interface Message {
  id: string;
  author: string;
  initials: string;
  color: string;
  content: string;
  timestamp: string;
  reactions?: { emoji: string; count: number }[];
  aiGenerated?: boolean;
  hasChart?: boolean;
  replies?: number;
}

const channels = [
  { id: "general", name: "general", unread: 0, icon: Hash },
  { id: "executive", name: "executive-briefing", unread: 3, icon: Hash },
  { id: "analytics", name: "analytics-insights", unread: 12, icon: Hash },
  { id: "apac", name: "apac-operations", unread: 7, icon: Hash },
  { id: "decisions", name: "decision-approvals", unread: 5, icon: Hash },
  { id: "risk", name: "risk-alerts", unread: 2, icon: Hash },
];

const messagesByChannel: Record<string, Message[]> = {
  executive: [
    {
      id: "m1", author: "Jane Doe", initials: "JD", color: "var(--primary)",
      content: "Morning all — quick heads up: APAC supply chain situation is escalating. AI has flagged a 67% disruption probability. Sarah, can you activate the contingency plan B today?",
      timestamp: "9:14 AM", reactions: [{ emoji: "👍", count: 4 }, { emoji: "🚨", count: 2 }],
    },
    {
      id: "m2", author: "Sarah Chen", initials: "SC", color: "var(--success)",
      content: "On it. Already looped in our logistics partners in KL. We're routing 40% of the affected shipments via alternative carriers. ETA for full mitigation: 36 hours.",
      timestamp: "9:22 AM", reactions: [{ emoji: "✅", count: 6 }],
    },
    {
      id: "m3", author: "AI Copilot", initials: "AI", color: "var(--ai)",
      content: "**AI Summary for #executive-briefing — May 13, 2026**\n\nKey action items from today's discussion:\n• APAC logistics contingency activated (Owner: Sarah Chen, ETA: 36hrs)\n• Budget reallocation decision pending (Due: May 15)\n• Q2 revenue exceeds target by 9.7%\n\nNext recommended decision: Review EU pricing strategy proposal by EOD.",
      timestamp: "9:30 AM", aiGenerated: true, reactions: [{ emoji: "🤖", count: 3 }],
    },
    {
      id: "m4", author: "Mike Torres", initials: "MT", color: "var(--warning)",
      content: "Great work Sarah. @Jane I've also shared the churn prevention analysis in #analytics-insights. We need to action the 142 at-risk accounts by Friday.",
      timestamp: "9:45 AM", replies: 3,
    },
    {
      id: "m5", author: "David Kim", initials: "DK", color: "var(--error)",
      content: "Sharing the updated supply chain risk report. The new carrier diversification plan reduces our single-vendor exposure from 71% to 38%. Significant improvement.",
      timestamp: "10:02 AM", hasChart: true, reactions: [{ emoji: "📊", count: 5 }, { emoji: "👍", count: 3 }],
    },
    {
      id: "m6", author: "Lisa Park", initials: "LP", color: "var(--info)",
      content: "EU pricing strategy proposal is ready for review. 5% increase in DACH markets is supported by demand elasticity data. Projected net impact: +$340K Q3.",
      timestamp: "10:15 AM", replies: 2,
    },
  ],
  analytics: [
    {
      id: "m7", author: "Data Team", initials: "DT", color: "var(--primary)",
      content: "Q2 forecasting models updated with May actuals. Revenue forecast for Q3 revised upward to $9.1M baseline. Confidence: 89%.",
      timestamp: "8:30 AM",
    },
    {
      id: "m8", author: "AI Copilot", initials: "AI", color: "var(--ai)",
      content: "**Automated Insight Alert**: Customer churn risk analysis complete. 142 accounts in critical zone. Recommended action: Launch retention campaign within 48 hours. Potential ARR saved: $2.8M.",
      timestamp: "9:00 AM", aiGenerated: true,
    },
  ],
};

const teamMembers = [
  { name: "Jane Doe", initials: "JD", color: "var(--primary)", role: "CEO", online: true },
  { name: "Sarah Chen", initials: "SC", color: "var(--success)", role: "COO", online: true },
  { name: "Mike Torres", initials: "MT", color: "var(--warning)", role: "VP Sales", online: true },
  { name: "David Kim", initials: "DK", color: "var(--error)", role: "Head of Ops", online: false },
  { name: "Lisa Park", initials: "LP", color: "var(--info)", role: "VP Finance", online: true },
  { name: "James Lee", initials: "JL", color: "var(--ai)", role: "CISO", online: false },
  { name: "AI Copilot", initials: "AI", color: "var(--ai)", role: "AI Assistant", online: true },
];

export function TeamCollab() {
  const [activeChannel, setActiveChannel] = useState("executive");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(messagesByChannel);

  const channelMessages = messages[activeChannel] || messages.executive;

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      author: "Jane Doe", initials: "JD", color: "var(--primary)",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMsg],
    }));
    setInput("");
  };

  return (
    <div className="flex h-full overflow-hidden" style={{ backgroundColor: "var(--page)" }}>
      {/* Channel Sidebar */}
      <div
        className="hidden sm:flex flex-col w-56 flex-shrink-0"
        style={{ backgroundColor: "var(--foreground)", borderRight: "1px solid color-mix(in srgb, var(--primary-foreground) 6%, transparent)" }}
      >
        <div className="px-4 py-4" style={{ borderBottom: "1px solid color-mix(in srgb, var(--primary-foreground) 6%, transparent)" }}>
          <p className="text-sm font-bold text-primary-foreground">Acme Corp</p>
          <p className="text-xs" style={{ color: "color-mix(in srgb, var(--primary-foreground) 45%, transparent)" }}>Team Workspace</p>
        </div>

        <div className="flex-1 overflow-y-auto py-3">
          <div className="px-4 mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "color-mix(in srgb, var(--primary-foreground) 35%, transparent)" }}>Channels</span>
            <button style={{ color: "color-mix(in srgb, var(--primary-foreground) 45%, transparent)" }}><Plus size={14} /></button>
          </div>
          {channels.map((ch) => {
            const Icon = ch.icon;
            const isActive = activeChannel === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className="w-full flex items-center justify-between px-4 py-2 text-sm transition-colors text-left"
                style={{
                  backgroundColor: isActive ? "color-mix(in srgb, var(--primary) 20%, transparent)" : "transparent",
                  color: isActive ? "var(--primary-soft)" : "color-mix(in srgb, var(--primary-foreground) 55%, transparent)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Icon size={14} />
                  <span className="truncate">{ch.name}</span>
                </div>
                {ch.unread > 0 && (
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: "var(--error)", color: "var(--primary-foreground)" }}
                  >
                    {ch.unread}
                  </span>
                )}
              </button>
            );
          })}

          {/* Direct Messages */}
          <div className="px-4 mt-4 mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "color-mix(in srgb, var(--primary-foreground) 35%, transparent)" }}>Direct Messages</span>
          </div>
          {teamMembers.slice(0, 4).map((member) => (
            <button
              key={member.name}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-primary-foreground/5"
              style={{ color: "color-mix(in srgb, var(--primary-foreground) 55%, transparent)" }}
            >
              <div className="relative">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-primary-foreground flex-shrink-0"
                  style={{ backgroundColor: member.color, fontSize: "var(--text-2xs)", fontWeight: 500 }}
                >
                  {member.initials}
                </div>
                {member.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-success border border-foreground" />
                )}
              </div>
              <span className="truncate text-xs">{member.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex flex-col flex-1 min-w-0 bg-card">
        {/* Channel Header */}
        <div
          className="flex items-center justify-between px-5 py-3 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--surface-track)" }}
        >
          <div className="flex items-center gap-2">
            <Hash size={18} style={{ color: "var(--muted-foreground)" }} />
            <span className="font-semibold" style={{ color: "var(--foreground)" }}>
              {channels.find((c) => c.id === activeChannel)?.name || "executive-briefing"}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--muted)", color: "var(--outline)" }}>
              {teamMembers.filter((m) => m.online).length} online
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
              style={{ backgroundColor: "var(--primary-container)", color: "var(--primary)" }}
            >
              <Brain size={12} />
              AI Summary
            </button>
            <button className="p-2 rounded-xl hover:bg-muted" style={{ color: "var(--outline)" }}>
              <Bell size={16} />
            </button>
            <button className="p-2 rounded-xl hover:bg-muted" style={{ color: "var(--outline)" }}>
              <Users size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {channelMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 group"
            >
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-primary-foreground font-bold flex-shrink-0 mt-0.5"
                style={{ backgroundColor: msg.color, fontSize: "var(--text-xs)" }}
              >
                {msg.initials}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{msg.author}</span>
                  {msg.aiGenerated && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: "var(--ai-container)", color: "var(--ai)" }}>
                      AI Generated
                    </span>
                  )}
                  <span className="text-xs" style={{ color: "var(--outline)" }}>{msg.timestamp}</span>
                </div>

                {/* Content */}
                {msg.aiGenerated ? (
                  <div
                    className="p-3 rounded-xl text-sm"
                    style={{ backgroundColor: "var(--ai-container)", border: "1px solid var(--ai-container)" }}
                  >
                    {msg.content.split("\n").map((line, i) => (
                      <p key={i} className={`leading-relaxed ${line.startsWith("**") ? "font-semibold text-xs" : "text-xs"}`}
                        style={{ color: line.startsWith("**") ? "var(--ai)" : "var(--on-ai-container)" }}>
                        {line.replace(/\*\*/g, "")}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                    {msg.content.split("@").map((part, i) => i === 0 ? part : (
                      <span key={i}>
                        <span className="font-medium" style={{ color: "var(--primary)" }}>
                          @{part.split(" ")[0]}
                        </span>
                        {" " + part.split(" ").slice(1).join(" ")}
                      </span>
                    ))}
                  </p>
                )}

                {/* Fake chart attachment */}
                {msg.hasChart && (
                  <div
                    className="mt-2 p-3 rounded-xl flex items-center gap-3"
                    style={{ backgroundColor: "var(--page)", border: "1px solid var(--surface-track)" }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--primary-container)" }}>
                      <BarChart2 size={16} style={{ color: "var(--primary)" }} />
                    </div>
                    <div>
                      <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>Supply_Chain_Risk_Report_May2026.pdf</p>
                      <p className="text-xs" style={{ color: "var(--outline)" }}>2.4 MB · 12 pages</p>
                    </div>
                    <button className="ml-auto text-xs font-medium" style={{ color: "var(--primary)" }}>Open</button>
                  </div>
                )}

                {/* Reactions */}
                {msg.reactions?.length ? (
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {msg.reactions.map((r) => (
                      <button
                        key={r.emoji}
                        className="flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all hover:scale-105"
                        style={{ backgroundColor: "var(--muted)", border: "1px solid var(--surface-track)" }}
                      >
                        <span>{r.emoji}</span>
                        <span style={{ color: "var(--muted-foreground)" }}>{r.count}</span>
                      </button>
                    ))}
                    <button
                      className="p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
                      style={{ color: "var(--outline)" }}
                    >
                      <Smile size={13} />
                    </button>
                  </div>
                ) : null}

                {/* Thread */}
                {msg.replies ? (
                  <button
                    className="flex items-center gap-1.5 mt-1.5 text-xs font-medium"
                    style={{ color: "var(--primary)" }}
                  >
                    <MessageSquare size={11} />
                    {msg.replies} replies
                  </button>
                ) : null}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="px-5 pb-5 flex-shrink-0">
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1.5px solid var(--outline-variant)" }}
          >
            <div className="flex items-center gap-2 px-3 py-1.5" style={{ borderBottom: "1px solid var(--muted)" }}>
              <button className="p-1 rounded hover:bg-muted" style={{ color: "var(--outline)" }}><Brain size={14} /></button>
              <button className="p-1 rounded hover:bg-muted" style={{ color: "var(--outline)" }}><Paperclip size={14} /></button>
              <button className="p-1 rounded hover:bg-muted" style={{ color: "var(--outline)" }}><AtSign size={14} /></button>
              <button className="p-1 rounded hover:bg-muted" style={{ color: "var(--outline)" }}><Smile size={14} /></button>
            </div>
            <div className="flex items-end gap-2 px-4 py-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                placeholder={`Message #${channels.find((c) => c.id === activeChannel)?.name}...`}
                className="flex-1 outline-none text-sm"
                style={{ color: "var(--foreground)" }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
                style={{ background: input.trim() ? "linear-gradient(135deg, var(--primary), var(--info))" : "var(--muted)" }}
              >
                <Send size={14} color={input.trim() ? "var(--card)" : "var(--outline)"} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Members Panel */}
      <div
        className="hidden xl:flex flex-col w-52 flex-shrink-0"
        style={{ borderLeft: "1px solid var(--surface-track)", backgroundColor: "var(--card)" }}
      >
        <div className="px-4 py-4" style={{ borderBottom: "1px solid var(--surface-track)" }}>
          <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Team Members</p>
        </div>
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          <p className="text-xs font-semibold px-1 mb-2 uppercase tracking-wider" style={{ color: "var(--outline)" }}>
            Online — {teamMembers.filter((m) => m.online).length}
          </p>
          {teamMembers.filter((m) => m.online).map((m) => (
            <div key={m.name} className="flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-page cursor-pointer">
              <div className="relative">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-primary-foreground flex-shrink-0"
                  style={{ backgroundColor: m.color, fontSize: "var(--text-2xs)", fontWeight: 500 }}
                >
                  {m.initials}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card" style={{ backgroundColor: "var(--success)" }} />
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{m.name}</p>
                <p className="text-xs" style={{ color: "var(--outline)" }}>{m.role}</p>
              </div>
            </div>
          ))}
          <p className="text-xs font-semibold px-1 mt-3 mb-2 uppercase tracking-wider" style={{ color: "var(--outline)" }}>
            Offline — {teamMembers.filter((m) => !m.online).length}
          </p>
          {teamMembers.filter((m) => !m.online).map((m) => (
            <div key={m.name} className="flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-page cursor-pointer opacity-60">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-primary-foreground flex-shrink-0"
                style={{ backgroundColor: m.color, fontSize: "var(--text-2xs)", fontWeight: 500 }}
              >
                {m.initials}
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{m.name}</p>
                <p className="text-xs" style={{ color: "var(--outline)" }}>{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
