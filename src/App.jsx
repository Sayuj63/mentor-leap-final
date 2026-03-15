import { useState, useEffect, useRef } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Calendar, Users, Briefcase, TrendingUp, Target, Zap, CheckCircle2, ArrowRight, BookOpen, Mic, Star, Award, PlayCircle, Video, X } from "lucide-react";
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import PopUp from "./components/PopUp";
import LeadForm from "./components/form";
// eslint-disable-next-line no-unused-vars
import { motion, useMotionValue, useTransform } from "framer-motion";
import logo from "./assets/logo.png";
import heroImage from "./assets/img2.jpg";
import program1 from "./assets/img4.jpeg";
import program2 from "./assets/img5.JPG";
import section2Image from "./assets/1.JPG";
import aiModelImage from "./assets/ai-model.png";
import hire from "./assets/img7.JPG";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const masterclassFeatures = [
  "Communication Blueprint Framework",
  "Mindset Reset Methodology",
  "Practical Implementation Steps",
  "Live Q&A with Industry Expert",
];

const bootcampFeatures = [
  "Executive Communication Mastery",
  "Leadership Presence Workshop",
  "Strategic Storytelling",
  "Personal Brand Architecture",
  "Live Pitch & Feedback Rounds",
  "Lifetime Community Access",
];

const programs = [
  {
    delay: 0,
    badge: "Flagship Free Session",
    badgeBg: "rgba(16, 185, 129, 0.12)",
    badgeColor: "#10b981",
    badgeBorder: "rgba(16, 185, 129, 0.3)",
    seatLabel: "Limited Seats",
    title: "Free Personality Development Masterclass",
    description: "This one-hour live and interactive masterclass introduces practical frameworks professionals can apply immediately in meetings, presentations and workplace discussions to increase their influence..",
    cardBg: "linear-gradient(145deg, #ffffff 0%, #f0fdf9 100%)",
    borderColor: "rgba(16, 185, 129, 0.2)",
    shadow: "0 8px 40px rgba(16, 185, 129, 0.08)",
    shadowHover: "0 24px 60px rgba(16, 185, 129, 0.18)",
    accentGlow: "radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)",
    accent: "#059669",
    titleColor: "#0f172a",
    descColor: "#475569",
    divider: "rgba(16, 185, 129, 0.15)",
    tileBg: "rgba(16, 185, 129, 0.06)",
    tileBorder: "rgba(16, 185, 129, 0.15)",
    date: "15 March 2026, 07:30 PM",
    price: "Free",
    originalPrice: "Value Rs 2,999",
    priceNote: null,
    features: masterclassFeatures,
    checkBg: "rgba(16,185,129,0.15)",
    checkColor: "#059669",
    btnBg: "linear-gradient(135deg, #059669, #0d9488)",
    btnColor: "#fff",
    cta: "Enroll Free - Reserve My Spot",
  },
  {
    delay: 0.1,
    badge: "Premium Intensive",
    badgeBg: "rgba(99, 102, 241, 0.12)",
    badgeColor: "#6366f1",
    badgeBorder: "rgba(99, 102, 241, 0.3)",
    seatLabel: "Limited Seats",
    title: "Speak with Impact Bootcamp",
    description: "The Speak with Impact Bootcamp is a two-day immersive learning experience designed to help professionals develop confident communication and structured thinking for the modern workplace.",
    cardBg: "linear-gradient(145deg, #ffffff 0%, #f5f3ff 100%)",
    borderColor: "rgba(99, 102, 241, 0.2)",
    shadow: "0 8px 40px rgba(99, 102, 241, 0.08)",
    shadowHover: "0 24px 60px rgba(99, 102, 241, 0.2)",
    accentGlow: "radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)",
    accent: "#6366f1",
    titleColor: "#0f172a",
    descColor: "#475569",
    divider: "rgba(99, 102, 241, 0.15)",
    tileBg: "rgba(99, 102, 241, 0.06)",
    tileBorder: "rgba(99, 102, 241, 0.15)",
    date: "28–29 March 2026",
    price: "₹3,999",
    originalPrice: "₹7,999",
    priceNote: "50% Early Bird Discount",
    features: bootcampFeatures,
    checkBg: "rgba(99,102,241,0.12)",
    checkColor: "#6366f1",
    btnBg: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    btnColor: "#fff",
    cta: "🚀 Reserve My Seat – ₹3,999",
    isBootcamp: true,
    paymentLink: "https://rzp.io/l/xyXPRm3",
  },
];

// Countdown + seat counter for bootcamp card
const RAZORPAY_LINK = "https://rzp.io/l/xyXPRm3";
const TOTAL_SEATS = 50;
const INITIAL_SEATS_SOLD = 13;
// Early bird ends March 14 2026 23:59:59 IST
const EARLY_BIRD_END = new Date("2026-03-14T23:59:59+05:30").getTime();

function getTimeLeft() {
  const diff = EARLY_BIRD_END - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, over: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, over: false };
}

function pad(n) { return String(n).padStart(2, "0"); }

function BootcampUrgencyBlock() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [seatsLeft, setSeatsLeft] = useState(TOTAL_SEATS - INITIAL_SEATS_SOLD);
  const seatsRef = useRef(seatsLeft);

  useEffect(() => {
    const clockId = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(clockId);
  }, []);

  useEffect(() => {
    // Decrease seats every 30–60 s, but never below 10
    const scheduleDecrement = () => {
      const delay = 30000 + Math.random() * 30000;
      return setTimeout(() => {
        if (seatsRef.current > 10) {
          seatsRef.current -= 1;
          setSeatsLeft(seatsRef.current);
        }
        timerId.current = scheduleDecrement();
      }, delay);
    };
    const timerId = { current: scheduleDecrement() };
    return () => clearTimeout(timerId.current);
  }, []);

  return (
    <div style={{ margin: "0 0 18px", display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* Seat counter */}
      <div style={{
        display: "flex", alignItems: "center", gap: "8px",
        background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
        borderRadius: "10px", padding: "9px 14px",
      }}>
        <span style={{ fontSize: "16px" }}>⚡</span>
        <span style={{ fontSize: "13px", fontWeight: 700, color: "#dc2626", letterSpacing: "0.01em" }}>
          Only {seatsLeft} / {TOTAL_SEATS} seats left
        </span>
        <div style={{ flex: 1, height: "6px", borderRadius: "99px", background: "rgba(239,68,68,0.15)", overflow: "hidden", marginLeft: "4px" }}>
          <div style={{ height: "100%", width: `${(seatsLeft / TOTAL_SEATS) * 100}%`, background: "linear-gradient(90deg,#ef4444,#f87171)", borderRadius: "99px", transition: "width 1s ease" }} />
        </div>
      </div>
      {/* Countdown */}
      {!timeLeft.over && (
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.22)",
          borderRadius: "10px", padding: "9px 14px",
        }}>
          <span style={{ fontSize: "15px" }}>⏳</span>
          <span style={{ fontSize: "12px", color: "#6366f1", fontWeight: 600 }}>Early bird ends in&nbsp;</span>
          <span style={{ fontSize: "13px", fontWeight: 800, color: "#4f46e5", fontVariantNumeric: "tabular-nums" }}>
            {pad(timeLeft.days)}d : {pad(timeLeft.hours)}h : {pad(timeLeft.minutes)}m : {pad(timeLeft.seconds)}s
          </span>
        </div>
      )}
    </div>
  );
}

function ProgramCard({ program }) {
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-30, 30], [5, -5]);
  const rotateY = useTransform(x, [-30, 30], [-5, 5]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: program.delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ fontFamily: "'DM Sans', sans-serif", rotateX, rotateY, transformStyle: "preserve-3d" }}
    >
      <div
        style={{
          position: "relative",
          background: program.cardBg,
          borderRadius: "24px",
          border: `1px solid ${program.borderColor}`,
          overflow: "hidden",
          height: "100%",
          transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          boxShadow: hovered ? program.shadowHover : program.shadow,
        }}
      >
        {program.isBootcamp && (
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              color: "#fff",
              padding: "16px 32px",
              borderRadius: "100px",
              fontWeight: 800,
              fontSize: "18px",
              boxShadow: "0 10px 30px rgba(99,102,241,0.4)",
              transform: "rotate(-5deg)",
              border: "4px solid rgba(255,255,255,0.8)",
              textAlign: "center"
            }}>
              🤫 Surprise!<br />
              <span style={{ fontSize: "14px", fontWeight: 600 }}>Revealing on 15th March</span>
            </div>
          </div>
        )}

        <div style={{ position: "absolute", top: 0, right: 0, width: "200px", height: "200px", background: program.accentGlow, borderRadius: "0 24px 0 100%", opacity: 0.4, pointerEvents: "none" }} />

        <div style={{ padding: "28px 32px 0", position: "relative" }}>
          {/* Early Bird badge — only for bootcamp */}
          {program.isBootcamp && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "14px",
            }}>
              <span style={{
                background: "linear-gradient(135deg,#f59e0b,#ef4444)",
                color: "#fff", fontSize: "12px", fontWeight: 800,
                letterSpacing: "0.08em", padding: "7px 18px",
                borderRadius: "100px", textTransform: "uppercase",
                boxShadow: "0 2px 12px rgba(239,68,68,0.35)",
                animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
              }}>
                🔥 50% OFF – Early Bird
              </span>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <span style={{ background: program.badgeBg, color: program.badgeColor, fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", padding: "6px 14px", borderRadius: "100px", textTransform: "uppercase", border: `1px solid ${program.badgeBorder}` }}>
              {program.badge}
            </span>
            <span style={{ color: program.accent, fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "5px" }}>
              <StarIcon /> {program.seatLabel}
            </span>
          </div>

          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 3vw, 30px)", fontWeight: 700, color: program.titleColor, lineHeight: 1.2, marginBottom: "12px" }}>
            {program.title}
          </h3>
          <p style={{ color: program.descColor, fontSize: "15px", lineHeight: 1.7, marginBottom: "24px" }}>
            {program.description}
          </p>
          <div style={{ height: "1px", background: program.divider, marginBottom: "24px" }} />
        </div>

        <div style={{ padding: "0 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
          <div style={{ background: program.tileBg, borderRadius: "14px", padding: "16px", border: `1px solid ${program.tileBorder}` }}>
            <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: program.accent, fontWeight: 700, marginBottom: "6px" }}>Date</p>
            <p style={{ color: program.titleColor, fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ color: program.accent }}><CalendarIcon /></span> {program.date}
            </p>
          </div>
          <div style={{ background: program.tileBg, borderRadius: "14px", padding: "16px", border: `1px solid ${program.tileBorder}` }}>
            <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: program.accent, fontWeight: 700, marginBottom: "6px" }}>Investment</p>
            <p style={{ color: program.titleColor, fontWeight: 800, fontSize: "20px" }}>{program.price}</p>
            {program.originalPrice && <p style={{ color: program.descColor, fontSize: "12px", textDecoration: "line-through" }}>{program.originalPrice}</p>}
            {program.priceNote && <p style={{ color: program.accent, fontSize: "12px", fontWeight: 600 }}>{program.priceNote}</p>}
          </div>
        </div>

        <div style={{ padding: "0 32px", marginBottom: "28px" }}>
          <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: program.accent, fontWeight: 700, marginBottom: "14px" }}>
            What's included
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {program.features.map((feature) => (
              <div key={feature} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: program.checkBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke={program.checkColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ color: program.descColor, fontSize: "14px" }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "0 32px 32px" }}>
          {/* Urgency block for bootcamp only */}
          {program.isBootcamp && <BootcampUrgencyBlock accent={program.accent} />}

          {program.isBootcamp ? (
            <motion.a
              href={RAZORPAY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: "100%", padding: "18px 24px",
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                color: "#fff", border: "none", borderRadius: "14px",
                fontSize: "16px", fontWeight: 800,
                fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "10px", letterSpacing: "0.01em",
                boxShadow: "0 4px 20px rgba(99,102,241,0.45)",
                textDecoration: "none",
                transition: "filter 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "brightness(1.12)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "brightness(1)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(99,102,241,0.45)";
              }}
            >
              {program.cta} <ArrowRightIcon />
            </motion.a>
          ) : (
            <motion.a
              href="#lead-form"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ width: "100%", padding: "18px 24px", background: program.btnBg, color: program.btnColor, border: "none", borderRadius: "14px", fontSize: "16px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "filter 0.2s", letterSpacing: "0.01em", textDecoration: "none" }}
              onMouseEnter={(event) => { event.currentTarget.style.filter = "brightness(1.08)"; }}
              onMouseLeave={(event) => { event.currentTarget.style.filter = "brightness(1)"; }}
            >
              {program.cta} <ArrowRightIcon />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const MASTERCLASS_DATE = new Date("2026-03-15T19:30:00+05:30").getTime();

function MasterclassAnnouncementBar() {
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = MASTERCLASS_DATE - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, over: true };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      over: false
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = MASTERCLASS_DATE - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, over: true });
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
          over: false
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (timeLeft.over) return null;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-2.5 px-4 sm:px-6 relative z-[60]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-sm">

        <div className="flex items-center justify-center gap-2 text-center md:text-left hidden sm:flex">
          <span className="animate-pulse">🔥</span>
          <span className="font-bold tracking-wide text-xs sm:text-sm uppercase text-yellow-300">
            Hurry! Free Masterclass Starts In:
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 rounded-md px-3 py-1 font-mono text-sm sm:text-base shadow-inner">
          <div className="flex flex-col items-center w-6">
            <span className="font-bold text-blue-300 leading-none">{pad(timeLeft.days)}</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 mt-0.5">d</span>
          </div>
          <span className="text-slate-500 font-bold mb-1">:</span>
          <div className="flex flex-col items-center w-6">
            <span className="font-bold text-blue-300 leading-none">{pad(timeLeft.hours)}</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 mt-0.5">h</span>
          </div>
          <span className="text-slate-500 font-bold mb-1">:</span>
          <div className="flex flex-col items-center w-6">
            <span className="font-bold text-blue-300 leading-none">{pad(timeLeft.minutes)}</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 mt-0.5">m</span>
          </div>
          <span className="text-slate-500 font-bold mb-1">:</span>
          <div className="flex flex-col items-center w-6">
            <span className="font-bold text-emerald-400 leading-none">{pad(timeLeft.seconds)}</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 mt-0.5">s</span>
          </div>
        </div>

        <Button asChild size="sm" className="h-8 bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-lg text-xs font-bold tracking-wide md:w-auto mt-0">
          <a href="#lead-form">Enroll Now</a>
        </Button>
      </div>
    </div>
  );
}

function LivePopup() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[100] flex flex-col items-end gap-3 pointer-events-none">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl p-4 shadow-2xl border border-red-100 flex flex-col gap-2 max-w-[300px] pointer-events-auto"
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="font-bold text-slate-800 text-sm">MentorLeap is LIVE!</span>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          The masterclass is currently running. Don't miss out, join the session right away!
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="pointer-events-auto w-full flex justify-end"
      >
        <a 
          href="/live"
          className="rounded-full shadow-lg shadow-red-500/30 bg-red-500 hover:bg-red-600 text-white font-bold px-8 h-12 transition-all hover:scale-105 flex items-center gap-2 text-base"
        >
          <Video className="w-5 h-5" />
          Join Live
        </a>
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* <LivePopup /> Hidden for now */}
      <PopUp />

      <div className="sticky top-0 z-[60] flex flex-col w-full shadow-sm">
        {/* Promotional Banner */}
        <MasterclassAnnouncementBar />

        {/* Navigation */}
        <nav className="bg-white/90 backdrop-blur-lg border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <img src={logo} alt="MentorLeap" className="w-12 h-12" />
              <span className="text-2xl font-bold text-slate-800">MentorLeap</span>
            </motion.div>
            <div className="hidden md:flex gap-8">
              <a href="#about" className="text-slate-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#misha" className="text-slate-600 hover:text-blue-600 transition-colors">MISHA</a>
              <a href="#programs" className="text-slate-600 hover:text-blue-600 transition-colors">Programs</a>
              <a href="#corporate" className="text-slate-600 hover:text-blue-600 transition-colors">Corporate</a>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <a href="#lead-form">Enroll Now</a>
            </Button>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-20"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 flex justify-center lg:justify-start"
          >
            <div className="group inline-flex items-center gap-3 rounded-full border border-blue-200 bg-white/90 backdrop-blur px-4 py-2 shadow-lg shadow-blue-100/80">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                <Zap className="w-4 h-4" />
              </span>
              <p className="text-sm md:text-base font-semibold text-slate-800">
                Join <span className="text-blue-600">Personality Development Course</span>
              </p>
            </div>
          </motion.div> */}

          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Heading - Order 1 on mobile */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight order-1 lg:col-span-1"
            >
              Learn to <span className="text-blue-600">Communicate</span> with Confidence & Clarity
            </motion.h1>

            {/* Right Side - Image with Floating Elements - Order 2 on mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative lg:h-[600px] flex items-center justify-center order-2 lg:row-span-3"
            >
              {/* Main Image */}
              <div className="relative z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-3xl blur-2xl opacity-20"></div>
                <img
                  src={heroImage}
                  alt="Mridu Bhandari - Leadership Mentor"
                  className="relative rounded-3xl shadow-2xl w-full max-w-md object-cover  aspect-3/4"
                />
              </div>

              {/* Floating Badge - Top Right */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="hidden md:block absolute top-1 right-1 lg:right-0 z-20"
              >
                <div className="bg-white rounded-2xl shadow-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">From basics to</p>
                      <p className="text-sm font-bold text-slate-900">Pro Communication</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge - Left Side */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="hidden md:block absolute top-32 left-0 lg:-left-8 z-20"
              >
                <div className="bg-white rounded-2xl shadow-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                      <PlayCircle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-900">2000+</p>
                      <p className="text-xs text-slate-500">Students Enrolled</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge - Bottom */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="absolute -bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20 w-[90%] sm:w-auto"
              >
                <div className="bg-white rounded-2xl shadow-xl px-4 py-3 md:px-6 md:py-3 border border-slate-200">
                  <p className="text-center">
                    <span className="text-sm text-slate-600">with</span> <span className="font-bold text-slate-900 text-lg">Mridu Bhandari</span>
                  </p>
                  <p className="text-xs text-slate-500 text-center">Award-Winning Journalist & Leadership Communication Coach</p>
                </div>
              </motion.div>

              {/* Floating Icon - Top Left */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="hidden md:block absolute top-20 left-8 z-10"
              >
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg rotate-12">
                  <Mic className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              {/* Floating Icon - Bottom Right */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="hidden md:block absolute bottom-24 right-8 z-10"
              >
                <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg -rotate-12">
                  <Target className="w-7 h-7 text-white" />
                </div>
              </motion.div>
            </motion.div>

            {/* Remaining Content - Order 3 on mobile */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="space-y-8 order-3"
            >
              <motion.div variants={fadeInUp} className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-900">AI-Powered Learning with MISHA</p>
                    <p className="text-slate-600">24×7 intelligent mentorship support</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-900">Live Bootcamps & Masterclasses</p>
                    <p className="text-slate-600">Interactive sessions with industry experts</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-900">Proven Leadership Frameworks</p>
                    <p className="text-slate-600">Build executive presence & career confidence</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Button asChild size="lg" className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg px-10 py-7 rounded-full shadow-lg hover:shadow-xl transition-all">
                  <a href="#lead-form">
                    Enroll Now - It's FREE
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </Button>
              </motion.div>

              {/* Social Proof */}
              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-6 pt-4"
              >
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-indigo-500 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-purple-500 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-pink-500 border-2 border-white"></div>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">500+ professionals</span> transformed their communication
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 text-center">
              <p className="text-3xl font-bold text-blue-600 mb-1">15 Mar</p>
              <p className="text-sm text-slate-600">Free Masterclass</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 text-center">
              <p className="text-3xl font-bold text-blue-600 mb-1">28-29 Mar</p>
              <p className="text-sm text-slate-600">Leadership Bootcamp</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 text-center">
              <p className="text-3xl font-bold text-blue-600 mb-1 line-through decoration-slate-400">₹2,999</p>
              <p className="text-sm text-slate-600">Course Value</p>
              <p className="text-xs font-semibold text-green-600">FREE Now!</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 text-center">
              <p className="text-3xl font-bold text-blue-600 mb-1">24×7</p>
              <p className="text-sm text-slate-600">AI Support</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative order-2 lg:order-1"
            >
              <ImageWithFallback
                src={section2Image}
                alt="Business mentoring session"
                className="rounded-2xl shadow-lg w-full object-cover aspect-[4/3]"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6 order-1 lg:order-2"
            >
              <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                About MentorLeap
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
                Bridge the Gap Between <span className="text-blue-600">Knowledge and Influence</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Many professionals have strong expertise but struggle to communicate ideas with clarity and confidence.
                MentorLeap provides structured frameworks that help individuals express ideas effectively,
                build executive presence, and lead conversations with authority.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Founded by <span className="font-semibold text-blue-600">award-winning journalist and leadership moderator Mridu Bhandari</span>,
                the platform combines real-world communication experience with AI-powered learning tools.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MISHA Section with AI Background */}
      <section id="misha" className="py-20 px-6 relative overflow-hidden">
        {/* AI Background Image */}
        <div className="absolute inset-0 ">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50"></div>
          <ImageWithFallback
            src={aiModelImage}
            alt="AI Technology Background"
            className="w-full h-full object-contain  opacity-50"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6 shadow-lg">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Meet MISHA</h2>
            <p className="text-xl text-slate-600">Your AI Powered Learning Assistant</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg h-full">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">The MISHA Framework</h3>
                  <div className="space-y-4">
                    {[
                      { letter: "M", title: "Master your narrative", desc: "Craft and own your professional story" },
                      { letter: "I", title: "Increase your visibility", desc: "Build your professional presence" },
                      { letter: "S", title: "Strengthen your voice", desc: "Communicate with clarity and confidence" },
                      { letter: "H", title: "Humanise your leadership", desc: "Lead with empathy and authenticity" },
                      { letter: "A", title: "Accelerate your growth", desc: "Fast-track your professional development" }
                    ].map((item, index) => (
                      <motion.div
                        key={item.letter}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4"
                      >
                        <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xl text-white flex-shrink-0">
                          {item.letter}
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg text-slate-900">{item.title}</h4>
                          <p className="text-slate-600">{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg h-full">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">What MISHA Helps You Do</h3>
                  <div className="space-y-4">
                    {[
                      "Interview preparation",
                      "Presentation and keynote structuring",
                      "Investor pitch refinement",
                      "Professional communication improvement",
                      "Career clarity and leadership development"
                    ].map((item, index) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                        <p className="text-lg text-slate-700">{item}</p>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-center text-slate-700">
                      <Zap className="w-5 h-5 inline mr-2 text-blue-600" />
                      <span className="font-semibold">24×7 Learning Support</span> within the MentorLeap platform
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs Section with Images */}
      <section id="programs" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 mb-4">
              Our Programs
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Transform Your <span className="text-blue-600">Leadership Journey</span>
            </h2>
          </motion.div>

          <div className="space-y-8">
            {/* Executive Coaching */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden border-slate-200 hover:shadow-xl transition-shadow">
                <div className="grid md:grid-cols-2">
                  <CardContent className="p-8 flex flex-col justify-center">
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-3">Executive Coaching</h3>
                    <p className="text-lg text-slate-600 mb-4">
                      Personalized coaching programs focused on leadership communication and executive presence.
                      One-on-one sessions designed to elevate your professional impact.
                    </p>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white w-fit">
                      <a href="#lead-form">Learn More</a>
                    </Button>
                  </CardContent>
                  <div className="relative h-64 md:h-auto ">
                    <ImageWithFallback
                      // src="https://images.unsplash.com/photo-1745970347652-8f22f5d7d3ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleGVjdXRpdmUlMjBidXNpbmVzcyUyMGNvYWNoaW5nJTIwb2ZmaWNlfGVufDF8fHx8MTc3MjY5MjczNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      src={program1}
                      alt="Executive Coaching"
                      className="w-full h-full object-cover "
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Live Events */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="overflow-hidden border-slate-200 hover:shadow-xl transition-shadow">
                <div className="grid md:grid-cols-2">
                  <div className="relative h-64 md:h-auto order-2 md:order-1">
                    <ImageWithFallback
                      // src="https://images.unsplash.com/photo-1765438863717-49fca900f861?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjB0cmFpbmluZyUyMGNvbmZlcmVuY2V8ZW58MXx8fHwxNzcyNjkyNzM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      src={program2}
                      alt="Live Events"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-8 flex flex-col justify-center order-1 md:order-2">
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-3">Live Events</h3>
                    <p className="text-lg text-slate-600 mb-4">
                      Bootcamps and masterclasses designed to develop confidence and communication clarity.
                      Immersive learning experiences with real-time practice.
                    </p>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white w-fit">
                      <a href="#lead-form">View Schedule</a>
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </motion.div>

            {/* Resource Library */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="overflow-hidden border-slate-200 hover:shadow-xl transition-shadow">
                <div className="grid md:grid-cols-2">
                  <CardContent className="p-8 flex flex-col justify-center">
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-3">Resource Library</h3>
                    <p className="text-lg text-slate-600 mb-4">
                      Digital courses and structured leadership frameworks. Access curated content and proven
                      methodologies at your own pace.
                    </p>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white w-fit">
                      <a href="#lead-form">Browse Resources</a>
                    </Button>
                  </CardContent>
                  <div className="relative h-64 md:h-auto">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1628130421517-649b3ecaf514?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGxpYnJhcnklMjByZXNvdXJjZXMlMjBib29rc3xlbnwxfHx8fDE3NzI2OTI3Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Resource Library"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Hire Mridu */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="overflow-hidden border-slate-200 hover:shadow-xl transition-shadow">
                <div className="grid md:grid-cols-2">
                  <div className="relative h-64 md:h-auto order-2 md:order-1">
                    <ImageWithFallback
                      src={hire}
                      // src="https://images.unsplash.com/photo-1720874129553-1d2e66076b16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGtleW5vdGUlMjBzcGVha2VyfGVufDF8fHx8MTc3MjY5MjczNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Hire Mridu"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-8 flex flex-col justify-center order-1 md:order-2">
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                      <Mic className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-3">Hire Mridu</h3>
                    <p className="text-lg text-slate-600 mb-4">
                      Professional moderation, event hosting, and leadership speaking engagements.
                      Bring award-winning expertise to your next event.
                    </p>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white w-fit">
                      <a href="#lead-form">Book Mridu</a>
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Programs */}
      <section
        className="programs-section"
        style={{
          background: "linear-gradient(160deg, #0a0f1e 0%, #0d1529 40%, #0c1a2e 100%)",
          padding: "100px 24px",
          position: "relative",
          overflow: "hidden",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');
          .programs-section * { box-sizing: border-box; }
        `}</style>

        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              "repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 1px, transparent 1px, transparent 80px), repeating-linear-gradient(0deg, #ffffff 0px, #ffffff 1px, transparent 1px, transparent 80px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "-80px",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "-100px",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: "1180px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: "center", marginBottom: "72px" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "24px" }}>
              <div style={{ height: "1px", width: "48px", background: "linear-gradient(to right, transparent, rgba(6,182,212,0.7))" }} />
              <span style={{ color: "#22d3ee", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                Upcoming Programs
              </span>
              <div style={{ height: "1px", width: "48px", background: "linear-gradient(to left, transparent, rgba(6,182,212,0.7))" }} />
            </div>

            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 800,
                color: "#f8fafc",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: "20px",
              }}
            >
              Your Next{" "}
              <span
                style={{
                  fontStyle: "italic",
                  background: "linear-gradient(135deg, #22d3ee, #818cf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Leadership Leap
              </span>
              <br />
              Starts Here
            </h2>

            <p style={{ color: "#94a3b8", fontSize: "17px", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto" }}>
              Two high-impact learning experiences designed to sharpen communication, confidence, and executive presence.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "28px" }}>
            {programs.map((program) => (
              <ProgramCard key={program.title} program={program} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            style={{ marginTop: "52px", display: "flex", alignItems: "center", justifyContent: "center", gap: "32px", flexWrap: "wrap" }}
          >
            {["200+ Alumni", "Live Interactive Sessions", "Expert-Led Curriculum", "Certificate of Completion"].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", fontSize: "13px", fontWeight: 500 }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22d3ee", flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose MentorLeap */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Why Professionals Choose <span className="text-blue-600">MentorLeap</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Target, title: "Clarity in Communication", desc: "Structured frameworks for expressing ideas clearly." },
              { icon: Zap, title: "Strategic Thinking", desc: "Approaches that help professionals think and communicate effectively." },
              { icon: Briefcase, title: "AI Learning Support", desc: "Continuous guidance through MISHA." },
              { icon: Users, title: "Leadership Presence", desc: "Build confidence to lead discussions and influence teams." },
              { icon: TrendingUp, title: "Career Growth", desc: "Develop the skills required for long-term professional advancement." }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Training */}
      <section id="corporate" className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Badge className="bg-white/20 text-white border-white/30">
                Corporate Solutions
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold">Corporate Leadership Training</h2>
              <p className="text-xl text-slate-300 leading-relaxed">
                MentorLeap delivers high-impact communication training for organizations and leadership teams.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed">
                Programs focus on executive communication, leadership presence, team confidence, and strategic thinking.
              </p>
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6">
                <a href="#lead-form">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Book Corporate Training
                </a>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758873268631-fa944fc5cad2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwcHJvZmVzc2lvbmFscyUyMHRlYW13b3JrfGVufDF8fHx8MTc3MjY5MTg2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Corporate training"
                className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <LeadForm />

      {/* Final CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Begin Your Leadership Transformation
          </h2>
          <p className="text-xl text-blue-100 leading-relaxed">
            Join professionals preparing to strengthen their communication, leadership presence, and career clarity with MentorLeap and MISHA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6">
              <a href="#lead-form">
                <Calendar className="w-5 h-5 mr-2" />
                Join Free Course
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-white text-white bg-white/10 text-lg px-8 py-6">
              <a href="#lead-form">
                Register for Bootcamp
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row justify-center gap-6 text-blue-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Free Masterclass — 15 March 2026</span>
            </div>
            <div className="hidden sm:block">•</div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Leadership Bootcamp — 28–29 March 2026</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={logo} alt="MentorLeap" className="w-10 h-10" />
            <span className="text-2xl font-bold text-white">MentorLeap</span>
          </div>
          <p className="text-slate-400">Elevate Your Voice. Lead With Clarity.</p>
          <p className="text-slate-500 text-sm mt-4">© 2026 MentorLeap. Founded by Mridu Bhandari.</p>
        </div>
      </footer>

      {/* Copyright Attribution */}
      <div className="bg-slate-950 py-6 px-6 text-center border-t border-slate-800/50">
        <p className="text-slate-500 text-xs tracking-widest uppercase">
          Powered by <a href="https://www.marktaleworld.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 font-medium transition-colors duration-300">Marktale</a>
        </p>
      </div>

      {/* Floating WhatsApp MISHA Button */}
      <a
        href="https://wa.me/919892322427"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3.5 rounded-full shadow-2xl shadow-blue-900/30 hover:shadow-blue-900/50 transition-all hover:-translate-y-1 border border-white/20"
      >
        <div className="bg-white/20 p-1.5 rounded-full flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" fill="currentColor" />
        </div>
        <span className="font-bold text-sm tracking-wider">ASK ANYTHING</span>
      </a>
    </div>
  );
}
