import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Google Apps Script URL
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyTR6ZkqamEl_8z7e7Jeb31TRxo8nCUBxPr_X-c5CV95LWvZaks3-KXEdrtSOR1OQ91Pg/exec";

const COUNTRY_CODES = [
  { code: "+91", flag: "🇮🇳", label: "India", name: "India" },
  { code: "+1", flag: "🇺🇸", label: "US/Canada", name: "United States" },
  { code: "+44", flag: "🇬🇧", label: "United Kingdom", name: "United Kingdom" },
  { code: "+61", flag: "🇦🇺", label: "Australia", name: "Australia" },
  { code: "+971", flag: "🇦🇪", label: "UAE", name: "UAE" },
  { code: "+65", flag: "🇸🇬", label: "Singapore", name: "Singapore" },
  { code: "+60", flag: "🇲🇾", label: "Malaysia", name: "Malaysia" },
  { code: "+880", flag: "🇧🇩", label: "Bangladesh", name: "Bangladesh" },
  { code: "+94", flag: "🇱🇰", label: "Sri Lanka", name: "Sri Lanka" },
  { code: "+977", flag: "🇳🇵", label: "Nepal", name: "Nepal" },
  { code: "+92", flag: "🇵🇰", label: "Pakistan", name: "Pakistan" },
  { code: "+49", flag: "🇩🇪", label: "Germany", name: "Germany" },
  { code: "+33", flag: "🇫🇷", label: "France", name: "France" },
  { code: "+81", flag: "🇯🇵", label: "Japan", name: "Japan" },
  { code: "+86", flag: "🇨🇳", label: "China", name: "China" },
  { code: "+7", flag: "🇷🇺", label: "Russia", name: "Russia" },
  { code: "+55", flag: "🇧🇷", label: "Brazil", name: "Brazil" },
  { code: "+27", flag: "🇿🇦", label: "South Africa", name: "South Africa" },
  { code: "+234", flag: "🇳🇬", label: "Nigeria", name: "Nigeria" },
  { code: "+254", flag: "🇰🇪", label: "Kenya", name: "Kenya" },
];

// ✅ Phone length rules per country code
const PHONE_LENGTHS = {
  "+91": { min: 10, max: 10 },
  "+1": { min: 10, max: 10 },
  "+44": { min: 10, max: 10 },
  "+61": { min: 9, max: 9 },
  "+971": { min: 9, max: 9 },
  "+65": { min: 8, max: 8 },
  "+60": { min: 9, max: 10 },
  "+880": { min: 10, max: 10 },
  "+94": { min: 9, max: 9 },
  "+977": { min: 10, max: 10 },
  "+92": { min: 10, max: 10 },
  "+49": { min: 10, max: 11 },
  "+33": { min: 9, max: 9 },
  "+81": { min: 10, max: 10 },
  "+86": { min: 11, max: 11 },
  "+7": { min: 10, max: 10 },
  "+55": { min: 10, max: 11 },
  "+27": { min: 9, max: 9 },
  "+234": { min: 10, max: 10 },
  "+254": { min: 9, max: 9 },
};

function PollInteractive() {
  const [activePoll, setActivePoll] = useState(null);
  const [voted, setVoted] = useState(null);
  const [fillData, setFillData] = useState({ p1: "", p2: "", p3: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await fetch('/api/poll');
        const data = await res.json();
        setActivePoll(data.activePoll);
      } catch (err) {
        console.error("Poll fetch error:", err);
      }
    };
    fetchPoll();
    const interval = setInterval(fetchPoll, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleVote = async (key) => {
    if (loading || !activePoll) return;
    setLoading(true);
    try {
      await fetch('/api/poll/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId: activePoll.id, vote: key })
      });
      setVoted({ pollId: activePoll.id, choice: key });
    } catch (err) {
      console.error("Vote error:", err);
    }
    setLoading(false);
  };

  const handleFillSubmit = async (e) => {
    e.preventDefault();
    if (loading || !activePoll) return;
    const text = `I help "${fillData.p1}" achieve "${fillData.p2}" by doing "${fillData.p3}".`;
    setLoading(true);
    try {
      await fetch('/api/poll/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId: activePoll.id, text })
      });
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      setVoted({ pollId: activePoll.id, text });
    } catch (err) {
      console.error("Fill submit error:", err);
    }
    setLoading(false);
  };

  if (!activePoll) return null;

  const isAlreadyVoted = voted && voted.pollId === activePoll.id;

  return (
    <div className="bg-[#1a2b45] border border-blue-500/30 rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-right-4 duration-500">
      <div className="p-5 border-b border-blue-500/20 bg-blue-600/5">
        <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border border-blue-500/30 mb-3">
          <span className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
          Live Interaction
        </span>
        <h3 className="text-lg font-bold text-white leading-tight">{activePoll.title}</h3>
      </div>

      <div className="p-5">
        {activePoll.type === 'poll' ? (
          <div className="space-y-3">
            {!isAlreadyVoted ? (
              activePoll.options.map((opt) => (
                <button
                  key={opt.key}
                  disabled={loading}
                  onClick={() => handleVote(opt.key)}
                  className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-blue-500 hover:bg-blue-600/10 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded border-2 border-slate-600 flex-shrink-0 group-hover:border-blue-500 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-sm bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />
                    </div>
                    <span className="text-sm text-slate-200">{opt.key}. {opt.text}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="space-y-4 py-2">
                {activePoll.options.map((opt) => {
                  const pct = activePoll.currentResults?.[opt.key] || 0;
                  return (
                    <div key={opt.key} className="relative">
                      <div className="flex justify-between items-center mb-1.5 px-1">
                        <span className="text-xs font-semibold text-slate-300">{opt.text}</span>
                        <span className="text-xs font-bold text-blue-400">{pct}%</span>
                      </div>
                      <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                <p className="text-center text-xs font-bold text-emerald-400 mt-4 animate-bounce">✓ Vote Recorded! Thank you for participating.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {!isAlreadyVoted ? (
              <form onSubmit={handleFillSubmit} className="space-y-4">
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 space-y-3">
                  <p className="text-sm text-slate-400 font-medium">I help...</p>
                  <input
                    placeholder="e.g. Students"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors"
                    value={fillData.p1} onChange={e => setFillData({ ...fillData, p1: e.target.value })}
                  />
                  <p className="text-sm text-slate-400 font-medium">achieve...</p>
                  <input
                    placeholder="e.g. Confidence"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors"
                    value={fillData.p2} onChange={e => setFillData({ ...fillData, p2: e.target.value })}
                  />
                  <p className="text-sm text-slate-400 font-medium">by doing...</p>
                  <input
                    placeholder="e.g. Masterclasses"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors"
                    value={fillData.p3} onChange={e => setFillData({ ...fillData, p3: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !fillData.p1 || !fillData.p2 || !fillData.p3}
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-orange-500 text-white font-black rounded-xl transition-all shadow-lg active:scale-95 text-sm uppercase tracking-wider"
                >
                  {loading ? "Submitting..." : "Submit to Chat"}
                </button>
              </form>
            ) : (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-xl text-center">
                <p className="text-emerald-400 font-bold mb-1">Awesome! 🚀</p>
                <p className="text-slate-400 text-xs">Your introduction has been sent to the live chat.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


function RegistrationForm({ onSuccess }) {
  const [form, setForm] = useState({ fname: "", lname: "", email: "", countryCode: "+91", phone: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  // ✅ ONLY CHANGE: smart per-country phone validation
  const validate = () => {
    const e = {};
    if (!form.fname.trim()) e.fname = "First name is required.";
    if (!form.lname.trim()) e.lname = "Last name is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";

    const phoneDigits = form.phone.trim();
    const selectedCountry = COUNTRY_CODES.find((c) => c.code === form.countryCode);
    const lengths = PHONE_LENGTHS[form.countryCode] || { min: 6, max: 15 };

    if (!phoneDigits) {
      e.phone = "Phone number is required.";
    } else if (!/^\d+$/.test(phoneDigits)) {
      e.phone = "Digits only — do not include the country code.";
    } else if (phoneDigits.length < lengths.min || phoneDigits.length > lengths.max) {
      e.phone = lengths.min === lengths.max
        ? `Enter a valid ${lengths.min}-digit number for ${selectedCountry?.name || "this country"}.`
        : `Enter a ${lengths.min}–${lengths.max} digit number for ${selectedCountry?.name || "this country"}.`;
    }

    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    const country = COUNTRY_CODES.find((c) => c.code === form.countryCode)?.name || "Unknown";
    const userData = {
      name: `${form.fname} ${form.lname}`,
      email: form.email,
      phone: `${form.countryCode} ${form.phone}`,
      country
    };

    // ✅ Post directly to Google Apps Script to write lead into Google Sheets
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userData,
          phone: "'" + userData.phone,
          timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
          source: "Live Registration"
        })
      });
    } catch (err) {
      console.error("Failed to write lead to Google Sheets:", err);
    }

    // ✅ Restore backend call for live viewer count
    try {
      await fetch('/api/join-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
    } catch (err) {
      console.error("Failed to update live viewers:", err);
    }

    localStorage.setItem("mentorleap_v2_user", JSON.stringify({ name: userData.name, country: userData.country }));

    setTimeout(() => {
      onSuccess(userData);
    }, 600);
  };

  const inputBase = "w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all bg-slate-50 text-slate-900 placeholder:text-slate-400";
  const normalBorder = "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white";
  const errorBorder = "border-red-400 ring-2 ring-red-400/20 bg-red-50/50";

  return (
    <div className="min-h-[calc(100vh-61px)] flex items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 50%, #ecfdf5 100%)" }}>
      <div className="w-full max-w-[500px] bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 sm:p-10 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-red-200 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block" />
            Live Today · 15 March 2026
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-2">
            Join the FREE Personality<br />Development Masterclass
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Enter your details below to unlock the live session with Mridu Bhandari.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {["📅 15 March 2026", "⏰ 7:30 PM IST", "🌐 Live Online"].map((chip) => (
              <span key={chip} className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-full px-3 py-1">{chip}</span>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">First Name *</label>
              <input value={form.fname} onChange={set("fname")} placeholder="First name"
                className={`${inputBase} ${errors.fname ? errorBorder : normalBorder}`} />
              {errors.fname && <p className="text-red-500 text-xs mt-1">{errors.fname}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Last Name *</label>
              <input value={form.lname} onChange={set("lname")} placeholder="Last name"
                className={`${inputBase} ${errors.lname ? errorBorder : normalBorder}`} />
              {errors.lname && <p className="text-red-500 text-xs mt-1">{errors.lname}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address *</label>
            <input value={form.email} onChange={set("email")} type="email" placeholder="you@example.com"
              className={`${inputBase} ${errors.email ? errorBorder : normalBorder}`} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Phone with country code */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number *</label>
            <div className="flex gap-2">
              <select value={form.countryCode} onChange={set("countryCode")}
                className={`${inputBase} ${normalBorder} cursor-pointer`}
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", appearance: "none", paddingRight: "28px", flexBasis: "100px", flexShrink: 0, flexGrow: 0, minWidth: 0 }}>
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))}
              </select>
              <input value={form.phone} onChange={set("phone")} type="tel" inputMode="numeric"
                placeholder="9876543210"
                className={`${inputBase} ${errors.phone ? errorBorder : normalBorder} min-w-0 flex-1`} />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            <p className="text-xs text-slate-400 mt-1">
              Your location is auto-detected from the country code above.
            </p>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-4 mt-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-75 disabled:cursor-not-allowed">
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Joining…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                Watch Live Now — It&apos;s FREE
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-400 pt-1">🔒 We respect your privacy. No spam, ever.</p>
        </form>
      </div>
    </div>
  );
}

function LiveChat({ userName }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [views, setViews] = useState(0);
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const shouldAutoScroll = useRef(true);

  const handleScroll = () => {
    const el = chatContainerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    shouldAutoScroll.current = atBottom;
  };

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const res = await fetch('/api/live-data');
        if (res.ok) {
          const data = await res.json();
          setViews(data.views);
          // ✅ Deduplicate and merge: keep local optimistic messages until server returns them
          setMessages(prev => {
            const serverMsgs = data.messages;
            const newMsgs = [...prev];

            serverMsgs.forEach(sMsg => {
              if (!newMsgs.find(m => m.id === sMsg.id)) {
                newMsgs.push(sMsg);
              }
            });

            // Keep only latest 100 to avoid bloat
            return newMsgs.sort((a, b) => a.id - b.id).slice(-100);
          });
        }
      } catch (err) {
        console.error("Failed to fetch live data:", err);
      }
    };
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 1000); // Polling faster (1s) for smoother feel
    return () => clearInterval(interval);
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const formatTime = (timeStr) => {
    if (!timeStr || timeStr === "just now") return "just now";
    try {
      const d = new Date(timeStr);
      const now = new Date();
      const diffSec = Math.floor((now - d) / 1000);
      if (diffSec < 5) return "just now";
      if (diffSec < 60) return `${diffSec}s ago`;
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return "just now";
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    const initials = getInitials(userName);

    // ✅ Optimistic Update
    const tempId = Date.now();
    const optimisticMsg = {
      id: tempId,
      sender: userName || "You",
      initials: initials,
      text,
      time: new Date().toISOString(),
      color: "#3b82f6",
      isOptimistic: true
    };
    setMessages(prev => [...prev, optimisticMsg]);
    setInputValue("");

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: userName || "User",
          initials: initials,
          text
        })
      });
      if (res.ok) {
        const data = await res.json();
        // Replace optimistic msg with real one from server
        setMessages(prev => prev.map(m => m.id === tempId ? data.message : m));
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      // Remove optimistic msg on failure
      setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  useEffect(() => {
    if (shouldAutoScroll.current && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl flex flex-col h-[400px]">
      {/* Chat header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5 rounded-t-2xl">
        <h3 className="font-bold text-slate-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live Chat
        </h3>
        <span className="text-xs text-slate-400 font-mono">{views.toLocaleString()} watching</span>
      </div>

      {/* Chat messages */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3 space-y-2.5"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
      >
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-slate-500 text-center">No messages yet.<br />Be the first to say hi!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex gap-2.5 animate-fade-in group">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white text-[10px]"
                style={{ backgroundColor: msg.color || "#3b82f6" }}
              >
                {msg.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs leading-relaxed">
                  <span className="font-semibold" style={{ color: msg.color || "#94a3b8" }}>{msg.sender}</span>
                  <span className="text-slate-500 ml-1.5 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">{formatTime(msg.time)}</span>
                </p>
                <p className="text-sm text-slate-200 leading-snug break-words">{msg.text}</p>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-3 border-t border-white/10 bg-black/20 rounded-b-2xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Chat as ${userName || "User"}...`}
            className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-colors"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-4 font-bold flex items-center justify-center transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function LiveStream({ name, country }) {
  const navigate = useNavigate();

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: "MentorLeap Live Masterclass", text: "🚀 Join me for a FREE Personality Development Masterclass!", url });
    } else {
      navigator.clipboard.writeText(url).then(() => alert("Link copied! Share it with friends 🎉"));
    }
  };

  return (
    <div className="min-h-[calc(100vh-61px)] bg-[#0a0f1a] text-white px-4 py-6 pb-12">
      {/* Top bar */}
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg sm:text-2xl font-extrabold leading-tight">FREE Personality Development Masterclass</h2>
          <p className="text-slate-400 text-sm mt-0.5">with Mridu Bhandari · 15 March 2026 · 7:30 PM IST</p>
        </div>
        <span className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block" />
          Live on YouTube
        </span>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">
        {/* Left Column: Video + Chat */}
        <div className="flex flex-col gap-5 w-full">
          {/* Video */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
            <iframe
              src="https://www.youtube.com/embed/cXaj4cDnNwI?autoplay=1&rel=0&modestbranding=1"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              title="MentorLeap Live Masterclass"
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>

          {/* Chat Box */}
          <LiveChat userName={name} />
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Active Interaction */}
          <PollInteractive />

          {/* Welcome */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">👋 Welcome</p>
            <p className="text-xl font-extrabold text-blue-400">{name}</p>
            {country && <p className="text-xs text-slate-400 mt-0.5">Joining from {country}</p>}
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">You&apos;re in! Sit back and enjoy the session. Comment on YouTube to ask questions.</p>
          </div>

          {/* Agenda */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">📋 Today&apos;s Agenda</p>
            <ul className="space-y-2.5">
              {[
                "Communication Blueprint Framework",
                "Mindset Reset Methodology",
                "Executive Presence Techniques",
                "Live Q&A with Mridu",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-xs font-bold flex-shrink-0">{i + 1}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Share */}
          <button onClick={handleShare}
            className="w-full py-3 rounded-xl bg-emerald-600/15 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-600/25 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share with a Friend
          </button>

          {/* Back link */}
          <button onClick={() => navigate("/")} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            ← Back to MentorLeap
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LivePage() {
  const [viewer, setViewer] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("mentorleap_v2_user");
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setViewer(JSON.parse(saved));
      } catch {
        localStorage.removeItem("mentorleap_v2_user");
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-center gap-3">
          <span className="text-xl font-extrabold text-slate-900">
            Mentor<span className="text-blue-600">Leap</span>
          </span>
          <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block" />
            Live Now
          </span>
        </div>
      </nav>

      {!viewer ? (
        <RegistrationForm onSuccess={(data) => setViewer(data)} />
      ) : (
        <LiveStream name={viewer.name} country={viewer.country} />
      )}
    </div>
  );
}
