import { useMemo, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

const WHATSAPP_NUMBER = "919999999999";

const quickQuestions = [
  "How do I claim my FREE spot for the masterclass?",
  "What is the exact schedule for the upcoming programs?",
  "Is the Leadership Bootcamp online or offline?",
  "What support does MISHA provide after enrollment?",
  "How can I connect with your team directly?",
];

export default function WhatsAppBot() {
  const [open, setOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState("");

  const headerMessage = useMemo(
    () =>
      "Hi! I am the MentorLeap assistant. Tap any question below and I will open WhatsApp with your message ready.",
    [],
  );

  const openWhatsApp = (question) => {
    const text = encodeURIComponent(question);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  const sendCustomMessage = () => {
    const message = customMessage.trim();
    if (!message) return;
    openWhatsApp(message);
    setCustomMessage("");
  };

  return (
    <div className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-[80]">
      {open ? (
        <div className="w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-emerald-200 bg-white shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">MentorLeap WhatsApp Bot</p>
              <p className="text-xs text-emerald-100">Typically replies in a few minutes</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition"
              aria-label="Close WhatsApp bot"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 bg-slate-50">
            <div className="bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-700 mb-3">
              {headerMessage}
            </div>

            <div className="space-y-2">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => openWhatsApp(question)}
                  className="w-full text-left rounded-lg border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50 px-3 py-2 text-sm text-slate-700 transition"
                >
                  {question}
                </button>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={customMessage}
                onChange={(event) => setCustomMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    sendCustomMessage();
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={sendCustomMessage}
                className="h-10 w-10 rounded-lg bg-emerald-600 text-white inline-flex items-center justify-center hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!customMessage.trim()}
                aria-label="Send custom WhatsApp message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="mt-3 ml-auto h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition inline-flex items-center justify-center"
        aria-label="Open WhatsApp bot"
      >
        <MessageCircle className="h-7 w-7" />
      </button>
    </div>
  );
}
