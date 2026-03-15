import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Set up Nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ═══════════════════════════════════════════════════════════════
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyTR6ZkqamEl_8z7e7Jeb31TRxo8nCUBxPr_X-c5CV95LWvZaks3-KXEdrtSOR1OQ91Pg/exec";
const ADMIN_PASSWORD = "mentorleap2026";

const STATE_FILE = join(__dirname, 'live_state.json');

// ── Persistent State Logic ──
function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const data = fs.readFileSync(STATE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to load state:", err);
  }
  return null;
}

function saveState() {
  try {
    const state = {
      currentViews,
      chatMessages,
      messageIdCounter,
      pollVotes,
      pollSubmissions,
      activePoll
    };
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  } catch (err) {
    console.error("Failed to save state:", err);
  }
}

const savedState = loadState();

// ── State ──
let currentViews = savedState?.currentViews || 0;
let messageIdCounter = savedState?.messageIdCounter || 2000; 
let chatMessages = savedState?.chatMessages || [
  { id: 999, sender: "MentorLeap", initials: "ML", text: "Welcome to the live session! Ask your questions here 🎉", time: new Date().toISOString(), color: "#3b82f6" }
];
let simulationRunning = false;
let simulationInterval = null;
let chatSpeed = 3000; // ms between bot msgs
let autoViewerGrowth = false;
let autoViewerInterval = null;
let botActivityLevel = 5; // 1–10

// ── Poll State ──
let activePoll = savedState?.activePoll || null; 
let pollVotes = savedState?.pollVotes || {}; 
let pollSubmissions = savedState?.pollSubmissions || {}; 

const PREDEFINED_POLLS = {
  opportunities: {
    id: "opportunities",
    type: "poll",
    title: "Why do people with ordinary talents get extraordinary opportunities?",
    options: [
      { key: "A", text: "They communicate their ideas more confidently" },
      { key: "B", text: "They build stronger relationships and networks" },
      { key: "C", text: "They project confidence and leadership presence" },
      { key: "D", text: "They actively seek opportunities instead of waiting" },
      { key: "E", text: "All of the above" }
    ],
    mockResults: { A: 15, B: 10, C: 20, D: 15, E: 40 }
  },
  skill: {
    id: "skill",
    type: "poll",
    title: "Which personality skill matters most today?",
    options: [
      { key: "A", text: "Confidence" },
      { key: "B", text: "Communication" },
      { key: "C", text: "Emotional Intelligence" },
      { key: "D", text: "Leadership Presence" },
      { key: "E", text: "All of the Above" }
    ],
    mockResults: { A: 20, B: 25, C: 15, D: 10, E: 30 }
  },
  sentence: {
    id: "sentence",
    type: "fill",
    title: "Introduce yourself in one powerful sentence.",
    format: "I help ___ achieve ___ by doing ___.",
    mockEntries: [
      "I help small businesses achieve growth by doing digital marketing.",
      "I help students achieve confidence by doing public speaking workshops.",
      "I help CEOs achieve clarity by doing strategic consulting."
    ]
  }
};

// ── Bot Pool ──
let BOT_USERS = [];
try {
  const botsData = fs.readFileSync(join(__dirname, 'bot_pool.json'), 'utf-8');
  BOT_USERS = JSON.parse(botsData);
} catch (err) {
  console.error("Failed to load bot_pool.json, using fallback bot", err);
  BOT_USERS = [{ name: "MentorLeap Bot", initials: "MB", color: "#3b82f6" }];
}

// ── Mood-Based Message Pools ──
const MOOD_MESSAGES = {
  greetings: [
    "Hi everyone! 👋", "Hello from Mumbai!", "Good evening all", "Can you hear us clearly?",
    "Joining from Bangalore 🙌", "First time here!", "Excited for this session ✨",
    "Hi mentor!", "Audio is clear 🔊", "Hello from Delhi!", "Is this starting now?",
    "Am I late? 😅", "Where are you all joining from?", "Hey everyone! Ready to learn",
    "Hi from Hyderabad!", "Just joined, what did I miss?", "Hello hello! 🎉",
    "Good evening from Pune", "Joining from Chennai!", "Hi from Kolkata 👋",
    "Hello from Ahmedabad!", "Finally made it! Excited!", "Hey team! 🚀",
    "Good evening ma'am!", "Joining from Lucknow", "Hello from Jaipur!",
    "Namaste everyone 🙏", "Hi from Kochi", "Just logged in!",
    "Excited to be here tonight!", "Hello from abroad! 🌍",
    "Aur sab kaise ho? 🙌", "Hello ji!", "Kaise ho sab log?",
    "Bhai kya haal chal", "Sab badiya?", "Hello boss!", "Kaha se join kiye ho sab?",
    "Namaste ma'am 🙏"
  ],

  platform_intro: [
    "Interesting concept 💡", "AI mentor sounds cool!", "Is this like ChatGPT for leadership?",
    "200 professionals from 13 countries wow 🌍", "This looks useful for working professionals",
    "Does it work for students too?", "Is MISHA available already?",
    "Is it part of the bootcamp?", "The platform looks impressive",
    "When was MentorLeap launched?", "How is this different from other platforms?",
    "AI-powered mentoring sounds fascinating", "Can MISHA give personalized feedback?",
    "Is there a mobile app too?", "Love the concept of AI mentoring 🤖",
    "Bhai kya mast platform hai", "Bohot sahi lag raha hai", "Badhiya concept hai yaar",
    "Sahi idea hai boss", "Mast platform banaya hai", "Ekdum fresh concept hai"
  ],

  founder_intro: [
    "Great experience! 👏", "TV journalist wow", "Chevening scholar impressive 🎓",
    "Looking forward to learning", "I have seen your LinkedIn videos",
    "Let's start the learning please", "Impressive background!",
    "Your TEDx talk was amazing!", "Following you on LinkedIn already",
    "Love your content on YouTube", "What an inspiring journey!",
    "Aray waah ma'am", "Kya baat hai 👏", "Bohot badhiya profile hai",
    "Sahi experience hai boss", "Inspiring ekdum!"
  ],

  engagement_q1: [
    "Improve communication 💬", "Confidence building", "Public speaking fear 😰",
    "Leadership skills", "Career growth 📈", "Networking", "Want to speak better in meetings",
    "Confidence ke liye", "Public speaking improve karna hai", "Communication skills",
    "Getting over stage fright", "Want to lead better at work", "Improve my presentation skills",
    "Build executive presence", "Better negotiation skills", "Overcome fear of judgment",
    "Want to be more assertive", "Career switch guidance", "Soft skills development",
    "Learn to handle tough conversations", "Improve body language",
    "Public speaking ka darr bhagana hai", "Confidence chahiye office mein",
    "Meeting me bol nahi paate", "English weak hai thodi", "Log kya kahenge ye darr lagta hai"
  ],

  poll_answers: [
    "E", "All of the above ✅", "Definitely communication", "Confidence matters most",
    "Networking also important", "I think communication is biggest factor",
    "Talent alone isn't enough", "Communication for sure!", "All options are important",
    "B and C together", "Communication + confidence combo", "D - networking is underrated",
    "I'll go with E", "Voted! 🗳️", "Hard to pick just one",
    "Aray E hoga bhai", "Merko C lagta hai bhali", "Sab jaroori hai yaar",
    "Baat toh sahi hai boss", "Sahi jawab E hai bilkul"
  ],

  framework_3c: [
    "This makes sense 💯", "Communication is underrated", "So true!",
    "Clarity matters a lot", "How do we improve communication?",
    "Any books you recommend? 📚", "Great explanation!", "Love this framework ❤️",
    "Noted this 📝", "The 3C framework is brilliant", "Taking screenshots of this slide!",
    "This is gold! 🏆", "Never thought about it this way", "Mind blown 🤯",
    "Can you repeat that?", "Writing this down immediately",
    "This applies perfectly to my workplace", "How to build character?",
    "Capability without communication = invisible", "So relatable!",
    "Bhai 3C toh kamaal chiz hai", "Mindblowing ekdum 🤯", "Kya sahi samjhaya ma'am ne",
    "Baat mein toh dum hai", "Screenshot le liya maine", "Real life mein ekdum sach hai ye"
  ],

  personality_dev: [
    "Confidence 💪", "Communication", "Mindset", "Body language",
    "Self awareness", "How you present yourself", "Self confidence",
    "Communication aur mindset", "Body language bhi important hai",
    "It's about overall presentation", "Discipline + consistency",
    "How you make others feel", "Personality = communication + confidence",
    "It's about your attitude", "Growth mindset is key",
    "Leadership quality", "Emotional intelligence", "Being authentic",
    "Body language ekdum jaruri hai", "Confidence hi sabkuch hai",
    "Dikhna bhi matter karta hai boss", "Smart lagna padhta hai"
  ],

  johari_window: [
    "Interesting framework! 🪟", "Blind spot part is powerful",
    "Never heard of Johari window before", "How do we find our blind spots?",
    "Can feedback really help?", "This is eye-opening",
    "I need to work on my blind spots", "Love this model!",
    "Going to try this with my team", "Self-awareness is underrated",
    "The hidden area is scary 😅", "Great tool for self-reflection",
    "This should be taught in every company",
    "Yeh naya sunne mila", "Bohot deep tha yeh johari", "Sahi framework hai boss",
    "Mujhe toh mere blind spots pata hi nahi the", "Badhiya exercise hai"
  ],

  mindset_section: [
    "Growth mindset 💯", "Fear of criticism is real 😟",
    "This hit me hard", "I avoid public speaking because of this",
    "Public speaking is uncomfortable for me", "I avoided presentations all my life",
    "So relatable!", "Fixed mindset is my problem",
    "Need to change my thinking", "Carol Dweck's concept right?",
    "Growth mindset changes everything", "Fear of failure holds me back",
    "I need to hear this", "This is exactly my problem!",
    "Working on overcoming this", "Slowly getting better at this",
    "Sachi mein darr lagta hai bahut", "Sahi baat batai ekdum",
    "Dimag ka khel hai sab", "Log kya bolenge yahi sabse bada issue hai yaar"
  ],

  communication_framework: [
    "Point → Explanation → Example is a good formula 📋",
    "Speaking slower is a great tip", "I always speak too fast! 😅",
    "How do we practice this?", "Is this covered in the bootcamp?",
    "The PEE framework is simple but powerful", "Going to try this tomorrow in my meeting",
    "I ramble too much, this will help", "Clarity > complexity ✅",
    "Short sentences work better", "Voice modulation matters so much",
    "Will practice this daily", "Pausing between points is key",
    "Bhai note karlo yeh", "Sahi technique hai", "Try karke dekhenge", 
    "Bohot useful hai boss", "Point explanation example.. badhiya formula hai"
  ],

  executive_presence: [
    "Eye contact is hard on camera 😓", "Posture really matters",
    "Never thought about voice pace", "The 7-second rule is powerful!",
    "First impressions matter!", "Need to improve my body language",
    "Camera presence is a skill", "Standing straight makes such a difference",
    "Voice projection tips please", "How to maintain eye contact naturally?",
    "This is so practical!", "Dressing also plays a role right?",
    "Eye contact mushkil hota hai yaar call par", "Straight khade rehna imp hai", 
    "Baat mein wazan hona chahiye boss thoda", "Sahi bola camera pe ajeeb lagta hai"
  ],

  conversion_moment: [
    "When does bootcamp start? 📅", "Is recording available?",
    "50% off sounds good! 💰", "Seats filling fast?", "Just registered! ✅",
    "I am joining!", "Looks worth it", "Is there EMI option?",
    "Student discount available?", "This feels like a good investment",
    "Link please! 🔗", "Where to pay?", "How many seats left?",
    "Worth every rupee!", "Signed up! See you there 🚀",
    "Don't miss this guys!", "Best investment in yourself",
    "₹3999 is a steal for this content", "Just paid! Excited for bootcamp",
    "Can I get invoice?", "Same here, just registered!",
    "My friend also wants to join", "Group discount available?",
    "Bhai discount milega aur kya?", "EMI ka option hai kya isme?",
    "Price thoda high lag raha hai", "Students ke liye kuch sasta kardo?",
    "Lelu kya bhai log?", "Bhai value for money toh pakka lag raha hai",
    "Le liya maine! Done boss."
  ],

  final_engagement: [
    "Great challenge idea! 💡", "Will try this", "Following on LinkedIn 🔗",
    "Thank you for this session! 🙏", "Amazing masterclass",
    "Best 90 minutes I've spent", "Please do more sessions like this",
    "Share your Instagram please", "When is the next free session?",
    "This was incredibly useful", "Learned so much today!",
    "Thank you Mridu ma'am!", "🔥🔥🔥 session",
    "Bohot maza aaya aaj", "Ekdum mast session ma'am", "Thank you ji 🙏", 
    "Sahi laga ajka time, totally worth it"
  ],

  supportive: [
    "Great session! 🔥", "Amazing explanation! 👏", "Very helpful content",
    "Learning a lot today 📚", "This is incredible!", "Best webinar I've attended",
    "Love this content ❤️", "Keep going, this is great!", "Absolutely brilliant!",
    "More sessions like this please 🙏", "You're an amazing speaker!",
    "This is exactly what I needed", "Gold content right here! 🏆",
    "Taking notes furiously 📝", "Sharing this with my team",
    "Every professional should watch this", "This should be mandatory in colleges",
    "Mridu ma'am you're amazing!", "So much value for free!",
    "Mind = blown 🤯", "This is changing my perspective",
    "Aray mast samajh aaya", "Bohot badhiya samjhaya", "Superb session boss",
    "Sahi jaa rahe ho", "Number 1 session ekdum!", "Kya faadu explanation diya hai"
  ],

  questions: [
    "How to apply this at work? 🤔", "Any recommended books?",
    "Is this in the bootcamp?", "Can you share the slides?",
    "Will recording be available?", "How long is the bootcamp?",
    "Is this beginner friendly?", "Where can we register?",
    "Do you offer 1-on-1 coaching?", "How often do you do these sessions?",
    "What's the best way to practice daily?", "Any tips for introverts?",
    "How to handle workplace conflict?", "Is there a community to join?",
    "Can we get a certificate?", "What age group is this for?",
    "Does this work for freshers too?", "How to overcome imposter syndrome?",
    "Bhai bootcamp Hindi mein hoga kya?", "Classes ka time kya rahega ma'am?", 
    "Miss kiya toh recording milega na?", "1 on 1 baat kar sakte hai kya ma'am se baadme?"
  ],

  trolls: [
    "Speak louder please 🔊", "Too slow, speed up",
    "Can't see the slides clearly", "Audio is breaking for me",
    "This feels scripted 🤷", "Get to the point",
    "Less theory more practical please", "When will the actual content start?",
    "Bhai kab start hoga proper?", "This is just basics",
    "Aray bore mat karo thoda aage badho na", "Awaaz nahi aa rahi boss", 
    "Kitna pakaoge yaar kab shuru hoga", "Bhai jaldi jaldi aage badho time ni hai", 
    "Paka raha hai thoda chat me"
  ],

  spam: [
    "Check my YouTube channel 📺", "Subscribe to my page guys",
    "Join my Telegram group", "Follow me on Instagram",
    "I make similar content check it out", "DM me for collab",
    "Visit my website for more", "Free resources on my channel",
    "Mere channel ko bhi subscribe karo bhai log", "Sab aaja mere page par"
  ],

  hindi: [
    "Hindi me bolo 🙏", "Hindi samajh nahi aata kisi ko?",
    "Koi Hindi me explain karega?", "Ma'am Hindi please",
    "Hindi me samjhao na", "Thoda Hindi me bhi bolo",
    "English difficult hai ma'am", "Hindi version hoga kya?",
    "Hindi me notes milenge?", "Subtitles hindi me mil sakte?",
    "Bilingual session rakhiye next time", "Hindi me karo na yaar",
    "Shuddh Hindi mein boliye na thoda", "Bhai dono language mix karke bolo",
    "Thoda hindi use karo yaar samajhne me problem ho rahi hai english sirf",
    "Hindi please we Indians na", "Ma'am ek baar hindi mein short mein batao"
  ],

  abuse: [
    "This is useless 😒", "Stop wasting time", "Worst stream ever honestly",
    "Nothing new here", "Same old motivational stuff",
    "I've heard all this before", "Not what I expected",
    "Clickbait title, basic content"
  ],
  hard_abuse: [
    "This is a total SCAM!! 😡", 
    "FRAUD ALERT! Don't listen to her!!",
    "Pure garbage content. Literal waste of time.",
    "She has no idea what she's talking about. 🤡",
    "Fake stories, fake followers, fake coaching.",
    "Lootne aaye hai sab ko!! (Came here to rob everyone!)",
    "Aray band karo ye drama! (Stop this drama!)",
    "Worst speaker I have ever seen. Disgusting.",
    "Total lack of ethics. This should be reported.",
    "SHAME ON YOU for charging for this!! 🤮",
    "This stream is a cancer. Get a real job.",
    "Mental harassment session. Totally useless.",
    "Diabolical fraud being played here.",
    "Khaali jhoot bol rahi hai! (Only telling lies!)",
    "Bohot bade thug ho tum sab. (You all are big thugs.)",
    "Report this stream immediately!!",
    "Absolute disgrace to the profession.",
    "Bhai ye toh loot macha rakhi hai!! 😠",
    "Sab chor hain yahan, don't pay anything!",
    "Pagalo ki tarah chilla rahi hai bas ma'am.",
    "Saram karo thoda, logo ka paisa kha rahe ho.",
    "Bohot ganda content hai, un-subscribe karo sab.",
    "Fraud ma'am, fraud company!!",
    "Chuna laga rahi hai sabko. (Applying lime to everyone/Tricking everyone)",
    "Bheek mangne ka naya tarika hai ye? 🤬",
    "Duniya bhar ka kachra bhara hai is masterclass mein.",
    "Ghatiya aur diabolical plan hai ye logo ko thagne ka.",
    "Iska muh band karo koi, bohot paka rahi hai.",
    "Kaminey log hain sab MentorLeap vale."
  ]
};

// ── Helpers ──
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickRandomBot() {
  return pickRandom(BOT_USERS);
}

function addChatMessage(sender, initials, text, color) {
  const msg = {
    id: ++messageIdCounter,
    sender,
    initials,
    text,
    time: new Date().toISOString(),
    color: color || "#3b82f6"
  };
  chatMessages.push(msg);
  if (chatMessages.length > 500) chatMessages = chatMessages.slice(-500); 
  saveState(); // Save on every message
  return msg;
}

function sendBotMessage(mood) {
  const pool = MOOD_MESSAGES[mood];
  if (!pool || pool.length === 0) return null;
  const bot = pickRandomBot();
  const text = pickRandom(pool);
  return addChatMessage(bot.name, bot.initials, text, bot.color);
}

// Weighted mood selection for realistic chat
function getWeightedMood() {
  const weights = [
    { mood: "supportive", weight: 25 },
    { mood: "greetings", weight: 15 },
    { mood: "questions", weight: 15 },
    { mood: "framework_3c", weight: 8 },
    { mood: "engagement_q1", weight: 8 },
    { mood: "personality_dev", weight: 5 },
    { mood: "mindset_section", weight: 5 },
    { mood: "communication_framework", weight: 4 },
    { mood: "hindi", weight: 4 },
    { mood: "trolls", weight: 4 },
    { mood: "conversion_moment", weight: 3 },
    { mood: "spam", weight: 2 },
    { mood: "abuse", weight: 2 },
  ];
  const total = weights.reduce((s, w) => s + w.weight, 0);
  let r = Math.random() * total;
  for (const w of weights) {
    r -= w.weight;
    if (r <= 0) return w.mood;
  }
  return "supportive";
}

// ── Simulation Controls ──
function startSimulation() {
  if (simulationRunning) return;
  simulationRunning = true;
  simulationInterval = setInterval(() => {
    let mood = getWeightedMood();
    
    // If a poll is active, 30% chance to switch to poll_answers mood
    sendBotMessage(mood);

    // ✅ Gradual Poll Growth Simulation
    if (activePoll && activePoll.type === 'poll') {
      const pollId = activePoll.id;
      if (!pollVotes[pollId]) pollVotes[pollId] = {};
      
      // Simulate multiple votes per tick for activity
      const batchSize = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < batchSize; i++) {
        const r = Math.random() * 100;
        let acc = 0;
        let pickedKey = activePoll.options[0].key;
        for (const opt of activePoll.options) {
          acc += (activePoll.mockResults[opt.key] || 0);
          if (r <= acc) {
            pickedKey = opt.key;
            break;
          }
        }
        pollVotes[pollId][pickedKey] = (pollVotes[pollId][pickedKey] || 0) + 1;
      }
    }
    // random viewer fluctuations
    const fluctuation = Math.floor(Math.random() * 5) - 1; // -1 to +3 (biased upwards)
    currentViews = Math.max(10, currentViews + fluctuation); 
    
    saveState();
  }, chatSpeed / Math.max(1, botActivityLevel / 5));
}

function stopSimulation() {
  simulationRunning = false;
  if (simulationInterval) { clearInterval(simulationInterval); simulationInterval = null; }
}

function startAutoViewerGrowth() {
  if (autoViewerGrowth) return;
  autoViewerGrowth = true;
  autoViewerInterval = setInterval(() => {
    const delta = Math.floor(Math.random() * 21) - 7; // -7 to +13
    currentViews = Math.max(100, currentViews + delta);
  }, 10000 + Math.random() * 10000);
}

function stopAutoViewerGrowth() {
  autoViewerGrowth = false;
  if (autoViewerInterval) { clearInterval(autoViewerInterval); autoViewerInterval = null; }
}

// ═══════════════════════════════════════════════════════════════
// LIVE API ROUTES (Public)
// ═══════════════════════════════════════════════════════════════

app.post('/api/join-live', (req, res) => {
  currentViews += 1;
  saveState();
  res.status(200).json({ success: true, views: currentViews });
});

app.get('/api/live-data', (req, res) => {
  res.status(200).json({ views: currentViews, messages: chatMessages.slice(-80) });
});

app.post('/api/chat', (req, res) => {
  const { sender, initials, text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });
  const msg = addChatMessage(sender || "User", initials || "U", text, "#3b82f6");
  res.status(200).json({ success: true, message: msg });
});

app.get('/api/poll', (req, res) => {
  if (activePoll && activePoll.type === 'poll') {
    const votes = pollVotes[activePoll.id] || {};
    const total = Object.values(votes).reduce((a, b) => a + b, 0) || 1;
    const dynamicResults = {};
    activePoll.options.forEach(opt => {
      dynamicResults[opt.key] = Math.round(((votes[opt.key] || 0) / total) * 100);
    });
    return res.status(200).json({ 
      activePoll: { 
        ...activePoll, 
        currentResults: dynamicResults,
        totalVotes: total 
      } 
    });
  }
  res.status(200).json({ activePoll });
});

app.post('/api/poll/vote', (req, res) => {
  const { pollId, vote, text } = req.body;
  if (!activePoll || activePoll.id !== pollId) return res.status(400).json({ error: "Poll not active" });
  
  if (activePoll.type === 'poll') {
    if (!pollVotes[pollId]) pollVotes[pollId] = {};
    pollVotes[pollId][vote] = (pollVotes[pollId][vote] || 0) + 1;
  } else {
    if (!pollSubmissions[pollId]) pollSubmissions[pollId] = [];
    pollSubmissions[pollId].push(text);
  }
  res.status(200).json({ success: true });
});

// ═══════════════════════════════════════════════════════════════
// COMMAND PANEL API ROUTES (Admin)
// ═══════════════════════════════════════════════════════════════

// Auth
app.post('/api/command/auth', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ success: false, error: "Invalid password" });
  }
});

// Get full state
app.get('/api/command/state', (req, res) => {
  res.status(200).json({
    views: currentViews,
    messages: chatMessages.slice(-80),
    simulationRunning,
    chatSpeed,
    autoViewerGrowth,
    botActivityLevel,
    totalMessages: chatMessages.length,
  });
});

// Set viewer count
app.post('/api/command/viewers', (req, res) => {
  const { delta, absolute } = req.body;
  if (typeof absolute === 'number') {
    currentViews = Math.max(0, absolute);
  } else if (typeof delta === 'number') {
    currentViews = Math.max(0, currentViews + delta);
  }
  res.status(200).json({ success: true, views: currentViews });
});

// Trigger mood burst
app.post('/api/command/mood', (req, res) => {
  const { mood, count } = req.body;
  const n = Math.min(count || 5, 20);
  const pool = MOOD_MESSAGES[mood];
  if (!pool || pool.length === 0) return res.status(400).json({ error: "Unknown mood: " + mood });

  // Shuffle a copy of the pool to ensure uniqueness in the burst
  const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
  const selectedBots = [...BOT_USERS].sort(() => 0.5 - Math.random());

  // stagger messages
  for (let i = 0; i < n; i++) {
    setTimeout(() => {
      // Pick unique text from pool (modulo to loop if n > pool size)
      const text = shuffledPool[i % shuffledPool.length];
      // Pick unique bot (modulo to loop if n > bot pool size)
      const bot = selectedBots[i % selectedBots.length];
      
      addChatMessage(bot.name, bot.initials, text, bot.color);
    }, i * (300 + Math.random() * 700));
  }
  res.status(200).json({ success: true, queued: n });
});

// Send custom admin message
app.post('/api/command/admin-msg', (req, res) => {
  const { text, triggerBotReply } = req.body;
  if (!text) return res.status(400).json({ error: "Text required" });
  const msg = addChatMessage("MentorLeap", "ML", text, "#3b82f6");

  // auto bot responses to admin message
  if (triggerBotReply) {
    const replies = [
      "Yes!! 🙌", "Absolutely!", "Let's go! 🚀", "Yes yes yes!",
      "100% 💯", "Count me in!", "Yesss!", "Sure!", "Definitely!",
      "Of course!", "Ready! 🔥", "I'm in!", "Yes please!", "Let's do it!",
      "Excited! ✨", "Yes mentor!", "Bring it on!", "Can't wait!",
      "Totally agree!", "Yes ma'am!"
    ];
    const replyCount = 5 + Math.floor(Math.random() * 8);
    for (let i = 0; i < replyCount; i++) {
      setTimeout(() => {
        const bot = pickRandomBot();
        addChatMessage(bot.name, bot.initials, pickRandom(replies), bot.color);
      }, 800 + i * (400 + Math.random() * 800));
    }
  }
  res.status(200).json({ success: true, message: msg });
});

// Toggle simulation
app.post('/api/command/simulation', (req, res) => {
  const { action } = req.body;
  if (action === 'start') startSimulation();
  else if (action === 'stop') stopSimulation();
  res.status(200).json({ success: true, running: simulationRunning });
});

// Chat speed
app.post('/api/command/chat-speed', (req, res) => {
  const { speed } = req.body;
  if (typeof speed === 'number' && speed >= 500) {
    chatSpeed = speed;
    if (simulationRunning) { stopSimulation(); startSimulation(); }
  }
  res.status(200).json({ success: true, chatSpeed });
});

// Bot activity level
app.post('/api/command/bot-activity', (req, res) => {
  const { level } = req.body;
  if (typeof level === 'number' && level >= 1 && level <= 10) {
    botActivityLevel = level;
    if (simulationRunning) { stopSimulation(); startSimulation(); }
  }
  res.status(200).json({ success: true, botActivityLevel });
});

// Auto viewer growth
app.post('/api/command/auto-viewers', (req, res) => {
  const { enabled } = req.body;
  if (enabled) startAutoViewerGrowth();
  else stopAutoViewerGrowth();
  res.status(200).json({ success: true, autoViewerGrowth });
});

// Clear chat
app.post('/api/command/clear-chat', (req, res) => {
  chatMessages = [
    { id: Date.now(), sender: "MentorLeap", initials: "ML", text: "Chat cleared by admin. Welcome back! 🎉", time: new Date().toISOString(), color: "#3b82f6" }
  ];
  res.status(200).json({ success: true });
});

// Export chat
app.get('/api/command/export-chat', (req, res) => {
  const lines = chatMessages.map(m => `[${new Date(m.time).toLocaleTimeString()}] ${m.sender}: ${m.text}`);
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', 'attachment; filename=chat-export.txt');
  res.send(lines.join('\n'));
});

// Poll commands
app.post('/api/command/poll/activate', (req, res) => {
  const { pollId } = req.body;
  if (pollId === 'close' || !pollId) {
    activePoll = null;
  } else {
    activePoll = JSON.parse(JSON.stringify(PREDEFINED_POLLS[pollId]));
    // Reset votes for fresh growth
    pollVotes[activePoll.id] = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    // Start with a small seed
    activePoll.options.forEach(opt => {
      pollVotes[activePoll.id][opt.key] = Math.floor(Math.random() * 5);
    });
  }
  res.status(200).json({ success: true, activePoll });
});

app.get('/api/command/poll/results', (req, res) => {
  res.status(200).json({ votes: pollVotes, submissions: pollSubmissions });
});

// Get available moods
app.get('/api/command/moods', (req, res) => {
  const moods = Object.keys(MOOD_MESSAGES).map(key => ({
    key,
    count: MOOD_MESSAGES[key].length,
    sample: MOOD_MESSAGES[key].slice(0, 3)
  }));
  res.status(200).json({ moods });
});

// ═══════════════════════════════════════════════════════════════
// EMAIL / LEAD API ROUTE (unchanged)
// ═══════════════════════════════════════════════════════════════

app.post('/api/send-email', async (req, res) => {
  const { name, email, phone, profession, location, program_interest, message } = req.body;

  currentViews += 1;

  if (process.env.GOOGLE_SHEET_WEBHOOK_URL) {
    fetch(process.env.GOOGLE_SHEET_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, profession, location, program_interest, message }),
    })
    .then(r => r.text())
    .then(body => console.log('Sheets OK:', body))
    .catch(err => console.error('Sheets error (non-blocking):', err));
  }

  try {
    const userMailOptions = {
      from: `"MentorLeap" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Confirmation: Application Received - MentorLeap',
      html: `
        <div style="font-family: sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #2563eb;">Hi ${name} 👋</h2>
          <p>Thank you for registering for the <strong>FREE Personality Development Masterclass</strong> by Mridu Bhandari.</p>
          <p>In this live session, you will learn practical tools and frameworks to help you:</p>
          <ul style="list-style-type: none; padding-left: 0;">
            <li>• Speak with confidence in meetings</li>
            <li>• Improve your communication and executive presence</li>
            <li>• Present your ideas clearly and authoritatively</li>
            <li>• Build a strong professional personality in the workplace</li>
          </ul>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>📅 Date:</strong> 15th March 2026</p>
            <p style="margin: 5px 0;"><strong>⏰ Time:</strong> 07:30 PM – 08:30 PM</p>
            <p style="margin: 5px 0;"><strong>🌐 Live Session:</strong> <a href="https://mentorleap.co/" style="color: #2563eb; text-decoration: none;">https://mentorleap.co/</a></p>
          </div>
          <p>We hope you will keep yourself free at this time and join the session.</p>
          <p>Looking forward to seeing you! 🚀</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #64748b; font-size: 0.9em;">— Team MentorLeap</p>
        </div>
      `,
    };

    const adminMailOptions = {
      from: `"MentorLeap Website" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `New Lead: ${name} - ${program_interest}`,
      html: `
        <h2>New Lead Application Details:</h2>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Profession:</strong> ${profession}</li>
          <li><strong>Location:</strong> ${location}</li>
          <li><strong>Program:</strong> ${program_interest}</li>
          <li><strong>Message:</strong> ${message || 'N/A'}</li>
        </ul>
      `
    };

    await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(adminMailOptions)
    ]);
    console.log('Emails sent successfully.');
  } catch (emailError) {
    console.error('Email failed (lead still saved to Sheets):', emailError);
  }

  res.status(200).json({ success: true, message: 'Application submitted successfully' });
});

export default app;
