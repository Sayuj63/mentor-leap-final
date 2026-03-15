import { useState, useRef, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// MOOD CONFIG — label, emoji, description, color for each mood
// ═══════════════════════════════════════════════════════════════
const MOOD_CONFIG = {
  greetings:               { label: "Say Hi 👋",           color: "#22c55e", desc: "Greetings & hellos" },
  platform_intro:          { label: "Platform Intro 🤖",   color: "#06b6d4", desc: "Reactions to MentorLeap/MISHA" },
  founder_intro:           { label: "Founder Intro 🎓",    color: "#8b5cf6", desc: "Mridu Bhandari reactions" },
  engagement_q1:           { label: "Why Here? 🎯",        color: "#f97316", desc: "What brought you here" },
  poll_answers:            { label: "Poll Answers 🗳️",     color: "#eab308", desc: "Poll responses" },
  framework_3c:            { label: "3C Framework 💡",     color: "#3b82f6", desc: "Capability+Communication+Character" },
  personality_dev:         { label: "Personality 🧠",      color: "#a855f7", desc: "Personality development answers" },
  johari_window:           { label: "Johari Window 🪟",    color: "#14b8a6", desc: "Self-awareness framework" },
  mindset_section:         { label: "Mindset 🌱",          color: "#84cc16", desc: "Growth vs fixed mindset" },
  communication_framework: { label: "Communication 💬",    color: "#0ea5e9", desc: "Clarity/Confidence/Connection" },
  executive_presence:      { label: "Exec Presence 👔",    color: "#6366f1", desc: "7-second rule reactions" },
  conversion_moment:       { label: "Conversion 🚀",      color: "#ef4444", desc: "Sales moment / registration" },
  final_engagement:        { label: "Final 🎉",           color: "#ec4899", desc: "Challenge & closing" },
  supportive:              { label: "Supportive ❤️",       color: "#10b981", desc: "Positive / encouraging" },
  questions:               { label: "Questions ❓",        color: "#f59e0b", desc: "Genuine viewer questions" },
  trolls:                  { label: "Trolls 🤡",          color: "#f43f5e", desc: "Mildly disruptive" },
  spam:                    { label: "Spam 📢",            color: "#d946ef", desc: "Self-promotion" },
  hindi:                   { label: "Hindi 🇮🇳",          color: "#fb923c", desc: "Hindi language requests" },
  abuse:                   { label: "Abuse 💢",           color: "#991b1b", desc: "Negative / harsh" },
  hard_abuse:              { label: "HARD ABUSE 🤬",       color: "#450a0a", desc: "Diabolical / Intense" },
};

const STREAM_PHASES = [
  { label: "Opening (0–5 min)", moods: ["greetings"], burstCount: 8 },
  { label: "Platform Intro (5–10 min)", moods: ["platform_intro", "questions"], burstCount: 6 },
  { label: "Founder Intro (10–15 min)", moods: ["founder_intro", "trolls"], burstCount: 5 },
  { label: "Engagement Q1 (15–20 min)", moods: ["engagement_q1", "hindi"], burstCount: 10 },
  { label: "Poll (20–25 min)", moods: ["poll_answers"], burstCount: 8 },
  { label: "3C Framework (25–40 min)", moods: ["framework_3c", "supportive", "questions"], burstCount: 7 },
  { label: "Personality Dev (40–50 min)", moods: ["personality_dev", "hindi"], burstCount: 6 },
  { label: "Johari Window (50–60 min)", moods: ["johari_window", "questions"], burstCount: 5 },
  { label: "Mindset (60–70 min)", moods: ["mindset_section", "supportive"], burstCount: 6 },
  { label: "Communication (70–80 min)", moods: ["communication_framework", "questions"], burstCount: 6 },
  { label: "Exec Presence (80–85 min)", moods: ["executive_presence", "supportive"], burstCount: 5 },
  { label: "Conversion! (85–90 min)", moods: ["conversion_moment", "questions", "trolls"], burstCount: 12 },
  { label: "Final (90+ min)", moods: ["final_engagement", "supportive"], burstCount: 8 },
];

// ═══════════════════════════════════════════════════════════════
// PASSWORD GATE
// ═══════════════════════════════════════════════════════════════
function PasswordGate({ onAuth }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/command/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const data = await res.json();
      if (data.success) onAuth();
      else setError("Invalid password.");
    } catch {
      setError("Connection failed.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-white">Command Panel</h2>
            <p className="text-slate-400 text-sm mt-1">Enter admin password to continue</p>
          </div>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password"
            className="w-full bg-white/10 border border-white/20 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 transition-colors mb-3"
            autoFocus
          />
          {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-sm transition-all hover:shadow-lg hover:shadow-red-500/30 active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "Authenticating..." : "Unlock Panel"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMMAND PANEL
// ═══════════════════════════════════════════════════════════════
function CommandDashboard() {
  const [state, setState] = useState({
    views: 0, messages: [], simulationRunning: false,
    chatSpeed: 3000, autoViewerGrowth: false, botActivityLevel: 5, totalMessages: 0,
  });
  const [customMsg, setCustomMsg] = useState("");
  const [triggerReply, setTriggerReply] = useState(true);
  const [viewerInput, setViewerInput] = useState("");
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Poll state every 2s
  const fetchState = useCallback(async () => {
    try {
      const res = await fetch("/api/command/state");
      if (res.ok) {
        const data = await res.json();
        setState(data);
      }
    } catch (err) {
      console.error("Failed to fetch state:", err);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchState();
    const i = setInterval(fetchState, 2000);
    return () => clearInterval(i);
  }, [fetchState]);

  // Auto scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [state.messages]);

  // ── API Helpers ──
  const api = async (endpoint, body) => {
    try {
      await fetch(`/api/command/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setTimeout(fetchState, 300);
    } catch (err) {
      console.error(`API error ${endpoint}:`, err);
    }
  };

  const adjustViewers = (delta) => api("viewers", { delta });
  const setAbsoluteViewers = () => {
    const n = parseInt(viewerInput, 10);
    if (!isNaN(n)) api("viewers", { absolute: n });
    setViewerInput("");
  };
  const triggerMood = (mood, count) => api("mood", { mood, count: count || 5 });
  const sendAdminMsg = () => {
    if (!customMsg.trim()) return;
    api("admin-msg", { text: customMsg.trim(), triggerBotReply: triggerReply });
    setCustomMsg("");
  };
  const toggleSimulation = () => api("simulation", { action: state.simulationRunning ? "stop" : "start" });
  const toggleAutoViewers = () => api("auto-viewers", { enabled: !state.autoViewerGrowth });
  const clearChat = () => api("clear-chat", {});
  const setChatSpeed = (speed) => api("chat-speed", { speed });
  const setBotActivity = (level) => api("bot-activity", { level });
  const activatePoll = (pollId) => api("poll/activate", { pollId });

  const triggerPhaseBurst = async (phase) => {
    for (const mood of phase.moods) {
      const count = Math.ceil(phase.burstCount / phase.moods.length);
      await api("mood", { mood, count });
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    try {
      const d = new Date(timeStr);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      {/* Top Bar */}
      <div className="border-b border-white/10 bg-white/[0.02] backdrop-blur sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 19h20L12 2zm0 4l6.5 11h-13L12 6z"/></svg>
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight">MentorLeap Command Panel</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Livestream Simulator</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <span className={`w-2 h-2 rounded-full ${state.simulationRunning ? "bg-emerald-500 animate-pulse" : "bg-slate-600"}`}></span>
              <span className="text-xs font-semibold">{state.simulationRunning ? "SIM ACTIVE" : "SIM PAUSED"}</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black font-mono tabular-nums text-blue-400">{state.views.toLocaleString()}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">viewers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 py-5">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-5">
          {/* ── LEFT: Controls ── */}
          <div className="space-y-5">

            {/* Row 1: Viewer + Simulation Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Viewer Controls */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">👁️ Viewer Count</h3>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    ["+10", 10], ["+20", 20], ["+100", 100], ["+500", 500],
                    ["-10", -10], ["-20", -20], ["-100", -100], ["-500", -500],
                  ].map(([label, delta]) => (
                    <button
                      key={label}
                      onClick={() => adjustViewers(delta)}
                      className={`py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                        delta > 0
                          ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25"
                          : "bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={viewerInput}
                    onChange={(e) => setViewerInput(e.target.value)}
                    placeholder="Set exact count"
                    className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-slate-500 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
                  />
                  <button onClick={setAbsoluteViewers} className="px-4 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-colors active:scale-95">
                    Set
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Auto viewer fluctuations</span>
                  <button
                    onClick={toggleAutoViewers}
                    className={`w-11 h-6 rounded-full transition-colors relative ${state.autoViewerGrowth ? "bg-emerald-500" : "bg-slate-600"}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${state.autoViewerGrowth ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                </div>
              </div>

              {/* Simulation Controls */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">⚡ Simulation</h3>
                <button
                  onClick={toggleSimulation}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] mb-4 ${
                    state.simulationRunning
                      ? "bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25"
                      : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25"
                  }`}
                >
                  {state.simulationRunning ? "⏹ Stop Simulation" : "▶ Start Auto Simulation"}
                </button>

                {/* Chat Speed */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Chat Speed</span>
                    <span className="text-xs font-mono text-slate-300">{(state.chatSpeed / 1000).toFixed(1)}s</span>
                  </div>
                  <input
                    type="range" min="500" max="8000" step="500"
                    value={state.chatSpeed}
                    onChange={(e) => setChatSpeed(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                    <span>Fast</span><span>Slow</span>
                  </div>
                </div>

                {/* Bot Activity */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Bot Activity Level</span>
                    <span className="text-xs font-mono text-slate-300">{state.botActivityLevel}/10</span>
                  </div>
                  <input
                    type="range" min="1" max="10" step="1"
                    value={state.botActivityLevel}
                    onChange={(e) => setBotActivity(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                    <span>Calm</span><span>Chaotic</span>
                  </div>
                </div>

                {/* Actions row */}
                <div className="flex gap-2 mt-4">
                  <button onClick={clearChat} className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs font-semibold hover:bg-white/10 transition-colors">
                    🗑️ Clear Chat
                  </button>
                  <a href="/api/command/export-chat" target="_blank" rel="noopener noreferrer"
                    className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs font-semibold hover:bg-white/10 transition-colors text-center">
                    📥 Export Chat
                  </a>
                </div>
              </div>
            </div>

            {/* Row 2: Mood Trigger Buttons */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">🎭 Chat Mood Triggers</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {Object.entries(MOOD_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => triggerMood(key, 5)}
                    className="group relative py-3 px-3 rounded-xl border transition-all active:scale-95 text-left"
                    style={{
                      backgroundColor: `${cfg.color}10`,
                      borderColor: `${cfg.color}30`,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${cfg.color}25`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = `${cfg.color}10`; }}
                  >
                    <p className="text-sm font-bold" style={{ color: cfg.color }}>{cfg.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{cfg.desc}</p>
                    <div className="absolute top-1.5 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); triggerMood(key, 3); }}
                        className="w-6 h-6 rounded-md bg-white/10 text-[10px] font-bold text-white hover:bg-white/20 transition-colors"
                        title="Send 3"
                      >3</button>
                      <button
                        onClick={(e) => { e.stopPropagation(); triggerMood(key, 10); }}
                        className="w-6 h-6 rounded-md bg-white/10 text-[10px] font-bold text-white hover:bg-white/20 transition-colors"
                        title="Send 10"
                      >10</button>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Row 3: Stream Phases */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">🎬 Stream Phases — One-Click Burst</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {STREAM_PHASES.map((phase, i) => (
                  <button
                    key={i}
                    onClick={() => triggerPhaseBurst(phase)}
                    className="py-3 px-3 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-left hover:border-blue-500/40 hover:bg-blue-500/5 transition-all active:scale-95"
                  >
                    <p className="text-xs font-bold text-slate-200">{phase.label}</p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {phase.moods.map(m => MOOD_CONFIG[m]?.label || m).join(" + ")}
                    </p>
                    <p className="text-[10px] text-blue-400 mt-0.5">{phase.burstCount} msgs</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Poll Controls */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">🗳️ Interactive Polls</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => activatePoll("opportunities")}
                  className="py-3 px-4 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 text-xs font-bold hover:bg-blue-600/20 transition-all active:scale-95 text-center"
                >
                  Push this Poll: Opportunities
                </button>
                <button
                  onClick={() => activatePoll("skill")}
                  className="py-3 px-4 rounded-xl bg-purple-600/10 border border-purple-500/30 text-purple-400 text-xs font-bold hover:bg-purple-600/20 transition-all active:scale-95 text-center"
                >
                  Push this Poll: Skills
                </button>
                <button
                  onClick={() => activatePoll("sentence")}
                  className="py-3 px-4 rounded-xl bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-600/20 transition-all active:scale-95 text-center"
                >
                  Push this Task: Introduction
                </button>
                <button
                  onClick={() => activatePoll("close")}
                  className="py-3 px-4 rounded-xl bg-red-600/10 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-600/20 transition-all active:scale-95 text-center"
                >
                  Close Current Poll
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-3 italic text-center">Activating a poll will show it instantly to all live viewers.</p>
            </div>

            {/* Row 4: Custom Admin Message */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">💬 Send Admin Message</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") sendAdminMsg(); }}
                  placeholder="e.g. Drop YES in chat if you are excited!"
                  className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-colors"
                />
                <button onClick={sendAdminMsg} className="px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95">
                  Send
                </button>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={triggerReply}
                  onChange={(e) => setTriggerReply(e.target.checked)}
                  className="w-4 h-4 rounded accent-blue-500"
                />
                <span className="text-xs text-slate-400">Auto-trigger bot replies (5–12 bots respond with enthusiasm)</span>
              </label>
            </div>
          </div>

          {/* ── RIGHT: Live Chat Preview ── */}
          <div className="xl:sticky xl:top-[65px] h-fit">
            <div className="bg-white/5 border border-white/10 rounded-2xl flex flex-col" style={{ height: "calc(100vh - 100px)" }}>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5 rounded-t-2xl">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live Chat Preview
                </h3>
                <div className="text-right">
                  <span className="text-xs font-mono text-slate-400">{state.views.toLocaleString()} viewers</span>
                  <p className="text-[10px] text-slate-600">{state.totalMessages} total msgs</p>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-3 space-y-2"
                style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
              >
                {state.messages.map((msg) => (
                  <div key={msg.id} className="flex gap-2 animate-fade-in">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white text-[9px]"
                      style={{ backgroundColor: msg.color || "#3b82f6" }}
                    >
                      {msg.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] leading-relaxed">
                        <span className="font-semibold" style={{ color: msg.color || "#94a3b8" }}>{msg.sender}</span>
                        <span className="text-slate-600 ml-1.5 text-[9px]">{formatTime(msg.time)}</span>
                      </p>
                      <p className="text-xs text-slate-300 leading-snug break-words">{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="p-3 border-t border-white/10 bg-black/20 rounded-b-2xl">
                <div className="flex gap-1.5 flex-wrap">
                  {["greetings", "supportive", "questions", "conversion_moment"].map((mood) => {
                    const cfg = MOOD_CONFIG[mood];
                    return (
                      <button
                        key={mood}
                        onClick={() => triggerMood(mood, 3)}
                        className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all active:scale-95"
                        style={{ backgroundColor: `${cfg.color}20`, color: cfg.color, border: `1px solid ${cfg.color}30` }}
                      >
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════
export default function CommandPanel() {
  const [authed, setAuthed] = useState(false);

  // CTRL+SHIFT+L shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "L") {
        setAuthed(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />;
  return <CommandDashboard />;
}
