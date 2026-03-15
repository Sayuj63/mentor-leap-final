import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageSquare, Bot, Sparkles, User } from "lucide-react";

const GROQ_API_KEY = "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";

const SYSTEM_PROMPT = `
You are Misha, a friendly and professional AI assistant for MentorLeap (https://app.mentorleap.co/).
MentorLeap is a premium platform for career growth and personality development.

Key Information:
- Flagship Course: Personality Development by Mridu Bhandari.
- Goal: Boost confidence, communication, and leadership.
- Upcoming Session: 15th March 2026, 07:30 PM - 08:30 PM IST.
- Pricing: The upcoming Personality Development course is currently FREE.
- Contact: If you don't know an answer, tell them to contact phone: +1 (234) 567-890 or email: support@mentorleap.co.

Always be supportive, concise, and professional. Use markdown for bolding important parts.
`;

export default function MishaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm **Misha**, your AI career mentor. How can I help you excel today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const history = [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
        userMsg
      ];

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: history,
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      if (!response.ok) throw new Error("Failed to get response");
      const data = await response.json();
      const botResponse = data.choices[0].message.content;

      setMessages(prev => [...prev, { role: "assistant", content: botResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again later!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[350px] sm:w-[400px] h-[500px] bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-3xl overflow-hidden flex flex-col mb-4"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm flex items-center gap-1.5">
                    MISHA
                    <Sparkles className="w-3 h-3 fill-white" />
                  </h3>
                  <p className="text-white/70 text-[10px] font-medium tracking-wide">AI Career Mentor</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${
                      msg.role === "user" ? "bg-blue-600" : "bg-white border border-slate-200"
                    }`}>
                      {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div
                      className={`p-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: msg.content
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\n/g, "<br>")
                      }}
                    />
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me about the masterclass..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 text-sm rounded-2xl pl-4 pr-12 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1.5 bottom-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-50 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[9px] text-center text-slate-400 mt-2 font-medium uppercase tracking-widest">Powered by Groq AI</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all ${
          isOpen ? "bg-slate-900 rotate-90" : "bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700"
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="relative">
            <Bot className="w-7 h-7 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          </div>
        )}
      </motion.button>
    </div>
  );
}
