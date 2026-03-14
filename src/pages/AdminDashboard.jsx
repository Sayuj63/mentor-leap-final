import { useState } from "react";
import { Users, MessageSquare, Video, Settings, LayoutDashboard, ChevronRight, LogOut, Search, Bell } from "lucide-react";

const MOCK_MESSAGES = [
  { id: 1, sender: "Rahul Sharma", text: "The frameworks discussed earlier are very practical. Can we get the slides later?", time: "2 mins ago", avatar: "RS", color: "bg-blue-500" },
  { id: 2, sender: "Priya Jain", text: "I struggle with confidence during presentations. Excited for the mindset methodology part!", time: "just now", avatar: "PJ", color: "bg-purple-500" },
  { id: 3, sender: "Arjun Kumar", text: "This makes so much sense. I used to think speaking fast meant speaking confidently.", time: "just now", avatar: "AK", color: "bg-orange-500" },
  { id: 4, sender: "Neha Gupta", text: "Will there be a recording available for this?", time: "1 min ago", avatar: "NG", color: "bg-pink-500" },
  { id: 5, sender: "Vivek Singh", text: "Can you elaborate more on the executive presence technique?", time: "just now", avatar: "VS", color: "bg-emerald-500" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("chats"); // "chats" | "stream" | "overview"

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col h-screen sticky top-0">
        <div className="p-6 flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-lg">M</div>
           <span className="text-xl font-bold text-white tracking-wide">MentorLeap</span>
        </div>
        
        <div className="px-4 pb-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Dashboard</p>
          <nav className="flex flex-col gap-1">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === "overview" ? "bg-blue-600/10 text-blue-400 font-medium" : "hover:bg-slate-800 hover:text-white"}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Overview
            </button>
            <button 
              onClick={() => setActiveTab("chats")}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${activeTab === "chats" ? "bg-blue-600/10 text-blue-400 font-medium" : "hover:bg-slate-800 hover:text-white"}`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5" />
                Live Chats
              </div>
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">New</span>
            </button>
            <button 
              onClick={() => setActiveTab("stream")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === "stream" ? "bg-blue-600/10 text-blue-400 font-medium" : "hover:bg-slate-800 hover:text-white"}`}
            >
              <Video className="w-5 h-5" />
              Stream View
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-slate-800 hover:text-white">
              <Users className="w-5 h-5" />
              Attendees
            </button>
          </nav>
        </div>

        <div className="px-4 py-4 mt-auto border-t border-slate-800">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-slate-800 hover:text-white w-full text-left">
            <Settings className="w-5 h-5" />
            Settings
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-red-500/10 hover:text-red-400 text-slate-400 w-full text-left mt-1">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <span className="hover:text-slate-800 cursor-pointer">Admin</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-slate-800 capitalize">
              {activeTab === "chats" ? "Live Stream Moderation" : activeTab === "stream" ? "Stream Monitoring" : "Dashboard Overview"}
            </span>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64 transition-all"
              />
            </div>
            <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2h-2 rounded-full bg-red-500 w-2.5 h-2.5 border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-2 cursor-pointer">
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-inner"></div>
            </div>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-auto p-8 bg-slate-50/50">
          
          {/* Header Title */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 capitalize">
                {activeTab === "chats" ? "Live Chat Moderation" : activeTab === "stream" ? "Stream Monitor" : "Overview"}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {activeTab === "chats" ? "Monitor and moderate live chat messages in real-time." : "View the currently broadcasting stream directly from the dashboard."}
              </p>
            </div>
            
            {(activeTab === "chats" || activeTab === "stream") && (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200 text-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                LIVE NOW
              </div>
            )}
          </div>

          {/* ACTIVE TAB CONTENT */}
          {activeTab === "chats" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-200px)]">
              <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800">Total Viewers</span>
                    <span className="text-2xl font-bold text-blue-600">1,204</span>
                  </div>
                  <div className="w-px bg-slate-200 mx-2"></div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800">Chat Rate</span>
                    <span className="text-2xl font-bold text-slate-700">18 <span className="text-sm text-slate-500 font-normal">msg/min</span></span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-sm px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium text-slate-700 transition-colors">Export Chat</button>
                  <button className="text-sm px-4 py-2 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 font-medium text-red-600 transition-colors">Clear All</button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                {MOCK_MESSAGES.map((msg) => (
                  <div key={msg.id} className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full ${msg.color} flex items-center justify-center flex-shrink-0 font-bold text-white shadow-sm`}>
                      {msg.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-semibold text-slate-900">{msg.sender}</span>
                        <span className="text-xs text-slate-400">{msg.time}</span>
                      </div>
                      <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-slate-700 text-sm inline-block">
                        {msg.text}
                      </div>
                    </div>
                    <div className="opacity-0 hover:opacity-100 flex items-center gap-2 transition-opacity">
                      <button className="text-xs font-semibold text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors">Delete</button>
                      <button className="text-xs font-semibold text-slate-600 hover:bg-slate-100 px-2 py-1 rounded transition-colors">Reply</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "stream" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-4">
                <div className="bg-black rounded-2xl overflow-hidden shadow-lg aspect-video w-full relative group">
                  <iframe
                    src="https://www.youtube.com/embed/I6XgYzorrSY?autoplay=1&rel=0&modestbranding=1&mute=1"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title="MentorLeap Live Masterclass Admin View"
                    className="absolute inset-0 w-full h-full border-0"
                  />
                  {/* Overlay for admin controls */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    Admin Preview Mode
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="font-semibold text-slate-900 text-lg mb-1">Stream Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-500 uppercase font-semibold">Status</p>
                      <p className="font-bold text-emerald-600">Excellent (1080p)</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-500 uppercase font-semibold">Uptime</p>
                      <p className="font-bold text-slate-800">01:24:45</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-500 uppercase font-semibold">Bitrate</p>
                      <p className="font-bold text-slate-800">4,500 kbps</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-500 uppercase font-semibold">Dropped</p>
                      <p className="font-bold text-slate-800">0 frames</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 h-fit">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-blue-500" /> Waitlist Actions
                </h3>
                <div className="space-y-4">
                   <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm text-sm">
                     Push "Enroll Now" CTA
                   </button>
                   <button className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-xl transition-colors text-sm">
                     Show Poll: Feedback
                   </button>
                   <button className="w-full py-3 bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 font-medium rounded-xl transition-colors text-sm">
                     End Stream
                   </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "overview" && (
            <div className="flex flex-col items-center justify-center p-12 text-center h-64 bg-white rounded-2xl shadow-sm border border-slate-200">
               <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                  <LayoutDashboard className="w-8 h-8" />
               </div>
               <h2 className="text-xl font-bold text-slate-800 mb-2">Welcome to Admin Dashboard</h2>
               <p className="text-slate-500 max-w-md">Navigate to Live Chats to moderate the ongoing masterclass discussions, or use the Stream View to monitor the broadcast quality.</p>
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
}
