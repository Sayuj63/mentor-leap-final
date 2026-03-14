import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

function RegistrationForm({ onSuccess }) {
  const [form, setForm] = useState({ fname: "", lname: "", email: "", countryCode: "+91", phone: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.fname.trim()) e.fname = "First name is required.";
    if (!form.lname.trim()) e.lname = "Last name is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.phone.trim() || !/^\d{6,15}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    const country = COUNTRY_CODES.find((c) => c.code === form.countryCode)?.name || "Unknown";
    setTimeout(() => {
      onSuccess({ name: `${form.fname} ${form.lname}`, country });
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
                className={`${inputBase} ${normalBorder} flex-shrink-0 w-[130px] cursor-pointer`}
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", appearance: "none", paddingRight: "28px" }}>
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))}
              </select>
              <input value={form.phone} onChange={set("phone")} type="tel" inputMode="numeric"
                placeholder="9876543210"
                className={`${inputBase} ${errors.phone ? errorBorder : normalBorder} flex-1`} />
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
        {/* Video */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
          <iframe
            src="https://www.youtube.com/embed/I6XgYzorrSY?autoplay=1&rel=0&modestbranding=1"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title="MentorLeap Live Masterclass"
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
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
