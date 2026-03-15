import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Clock, X, Sparkles, Zap } from "lucide-react";

const TARGET_TIME = new Date("2026-03-15T19:30:00+05:30").getTime();

export default function PopUp() {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Show popup immediately to lock the screen
    setIsOpen(true);
  }, []);

  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      const diff = TARGET_TIME - now;
      
      if (diff <= 0) {
        return { over: true };
      }

      return {
        over: false,
        total: diff,
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calculateTime());

    const interval = setInterval(() => {
      const time = calculateTime();
      setTimeLeft(time);
      if (time.over) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Remember that user closed it for this session
    localStorage.setItem("mentorleap_popup_closed", "true");
  };

  const pad = (n) => String(n).padStart(2, "0");

  if (!isOpen || !timeLeft) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-hidden">
        {/* Ultra Deep Blurred Overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ backdropFilter: "blur(24px)" }}
          className="absolute inset-0 bg-slate-950/80"
        />

        {/* Popup Container */}
        <motion.div
          initial={{ scale: 0.9, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 40, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white w-full max-w-[440px] rounded-[40px] shadow-[0_40px_120px_rgba(0,0,0,0.5)] border border-white/20 overflow-hidden"
        >

          {/* Animated Header/Top Part */}
          <div className="relative h-48 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 flex items-center justify-center overflow-hidden">
             {/* Abstract background shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[120%] bg-white rounded-full blur-[80px]" />
                <div className="absolute bottom-[-30%] right-[-10%] w-[70%] h-[130%] bg-blue-400 rounded-full blur-[90px]" />
            </div>

            <div className="relative z-10 text-center flex flex-col items-center">
              <motion.div 
                animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="bg-white/20 p-4 rounded-3xl backdrop-blur-md border border-white/30 shadow-xl mb-4"
              >
                <Video className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-white font-black text-2xl uppercase tracking-wider">Going Live Soon</h3>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8 pt-10 text-center">
            <div className="space-y-8">
              {/* Event Info */}
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-[0.15em] border border-blue-100 mb-3">
                  <Sparkles className="w-3.5 h-3.5" /> Special Masterclass
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 leading-tight px-4">
                  Personality Development<br/>with Mridu Bhandari
                </h2>
              </div>

              {/* Countdown Section */}
              <div className="bg-slate-50/80 rounded-[32px] p-6 py-8 border border-slate-100 relative">
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full border border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest shadow-sm">
                    Time Remaining
                 </div>

                {!timeLeft.over ? (
                  <div className="flex justify-center items-center gap-8">
                    <div className="flex flex-col items-center min-w-[70px]">
                      <div className="text-5xl font-black text-slate-800 tabular-nums animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {pad(timeLeft.minutes)}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Minutes</div>
                    </div>
                    
                    <div className="text-4xl font-black text-blue-200 self-start mt-1">:</div>
                    
                    <div className="flex flex-col items-center min-w-[70px]">
                      <div className="text-5xl font-black text-blue-600 tabular-nums">
                        {pad(timeLeft.seconds)}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Seconds</div>
                    </div>
                  </div>
                ) : (
                  <div className="py-2">
                    <div className="text-3xl font-black text-emerald-500 animate-pulse">WE ARE LIVE! 🚀</div>
                    <p className="text-sm text-slate-500 mt-2">The session has already started.</p>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    handleClose();
                    navigate("/live");
                  }}
                  className="group relative w-full bg-slate-900 text-white font-bold py-5 rounded-[24px] overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-blue-500/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                    {timeLeft.over ? "Join Stream Now" : "Secure Your Free Seat"}
                    <Zap className="w-5 h-5 fill-white group-hover:animate-bounce" />
                  </span>
                </button>
                <p className="text-[11px] text-slate-400 mt-4 font-medium flex items-center justify-center gap-2">
                   <Clock className="w-3 h-3" /> 15th March • 7:30 PM IST • Online
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
