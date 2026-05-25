import React, { useState, useEffect } from "react";
import { X, Phone, Play, Volume2, Square, Bot, Send, Sparkles, MessageCircle, Sliders, CheckCircle, TrendingUp, DollarSign } from "lucide-react";

interface ServiceDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  demoType: "chat" | "voice" | "ads" | "content" | "automation" | "website" | "whatsapp" | "leads" | "";
  serviceTitle: string;
}

export default function ServiceDemoModal({ isOpen, onClose, demoType, serviceTitle }: ServiceDemoModalProps) {
  if (!isOpen) return null;

  // Custom States for each demo type
  const [voiceCallState, setVoiceCallState] = useState<"idle" | "dialing" | "connected" | "ended">("idle");
  const [voiceCallTranscript, setVoiceCallTranscript] = useState<string[]>([]);
  const [voiceWave, setVoiceWave] = useState<number[]>(new Array(16).fill(12));
  const [activeSpeech, setActiveSpeech] = useState<"agent" | "prospect" | "none">("none");

  // WhatsApp chat simulation state
  const [waMessages, setWaMessages] = useState<Array<{ sender: "user" | "bot"; text: string; time: string }>>([
    { sender: "bot", text: "👋 Welcome to Salesman 2.0 Automated WhatsApp Onboarding! Let us know how we can serve your business growth objectives.", time: "14:40" }
  ]);
  const [waInput, setWaInput] = useState("");
  const [waTyping, setWaTyping] = useState(false);

  // AI Ads Generator State
  const [adsIndustry, setAdsIndustry] = useState<"ecommerce" | "realestate" | "coaching" | "local">("ecommerce");
  const [adStatusMsg, setAdStatusMsg] = useState("");
  const [adsGenerated, setAdsGenerated] = useState({
    headline: "👉 Automate Your Shopify Shipments to 100% Autopilot",
    hook: "Tired of spending 3 hours daily typing address copies and updating tracking codes? 🛍️ Let our Salesman 2.0 CRM take over. Zero delays, happier clients.",
    badge: "AI Powered • 4.9★",
    imageKeyword: "minimalist metallic boxes logistics setup gradient"
  });

  // Funnel Analytics ROI calculator
  const [trafficVal, setTrafficVal] = useState(5000);
  const [convVal, setConvVal] = useState(1);

  // Handle active waveforms for Voice simulation
  useEffect(() => {
    let waveInterval: any;
    if (voiceCallState === "connected") {
      waveInterval = setInterval(() => {
        setVoiceWave((prev) =>
          prev.map(() => Math.floor(Math.random() * 22) + 4)
        );
      }, 100);
    } else {
      setVoiceWave(new Array(16).fill(12));
    }
    return () => clearInterval(waveInterval);
  }, [voiceCallState]);

  // Voice Transcript timeline simulator
  useEffect(() => {
    if (voiceCallState !== "dialing") return;

    const timer = setTimeout(() => {
      setVoiceCallState("connected");
      setVoiceCallTranscript(["🤖 Agent: Hello there! This is Salesman 2.0 Outbound Agent dialer. Am I speaking with the founder?"]);
      setActiveSpeech("agent");
    }, 2200);

    return () => clearTimeout(timer);
  }, [voiceCallState]);

  useEffect(() => {
    if (voiceCallState !== "connected") return;

    const script = [
      { speaker: "prospect", text: "👤 Prospect: Uh, yes, this is. Who is this?", delay: 3500 },
      { speaker: "agent", text: "🤖 Agent: I represent Salesman 2.0! We help small business owners automate up to 90% of their customer followups entirely using voice AI vectors. How would you rate your current followup speeds?", delay: 7000 },
      { speaker: "prospect", text: "👤 Prospect: Honestly, we miss a lot of leads in the weekends. Can this actually speak like a real human with logic?", delay: 11000 },
      { speaker: "agent", text: "🤖 Agent: Absolutely. I am programmed to qualify leads, book calendar slots into your Calendly, and accept UPI details on the fly. Would it be okay if I booked your scheduling consultation for next Monday at 10 AM?", delay: 15500 },
      { speaker: "prospect", text: "👤 Prospect: Wow, that took zero seconds. Sure, book it!", delay: 19500 },
      { speaker: "agent", text: "🤖 Agent: Magnificent choice! Booking slot... Transaction locked. You'll receive a WhatsApp summary in exactly 2 seconds. Have an amazing business day!", delay: 23000 }
    ];

    const intervals = script.map((item) => {
      return setTimeout(() => {
        setVoiceCallTranscript((prev) => [...prev, item.text]);
        setActiveSpeech(item.speaker as any);
      }, item.delay);
    });

    return () => {
      intervals.forEach((i) => clearTimeout(i));
    };
  }, [voiceCallState]);

  const triggerCallSimulation = () => {
    setVoiceCallState("dialing");
    setVoiceCallTranscript([]);
    setActiveSpeech("none");
  };

  const endCallSimulation = () => {
    setVoiceCallState("ended");
    setActiveSpeech("none");
  };

  // WhatsApp reply mapping
  const handleWaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waInput.trim() || waTyping) return;

    const userText = waInput;
    setWaMessages((prev) => [...prev, { sender: "user", text: userText, time: "14:41" }]);
    setWaInput("");
    setWaTyping(true);

    setTimeout(() => {
      let reply = "💬 Custom AI solutions have been triggered. Let's schedule your dashboard demonstration right now!";
      const lower = userText.toLowerCase();
      if (lower.includes("price") || lower.includes("cost") || lower.includes("rate") || lower.includes("how much")) {
        reply = "💰 Salesman 2.0 WhatsApp engines start at ₹4,999/month for full basic chatbot support, and range up to ₹29,999 for customized premium growth plans! Shall I register you for a Starter Trial?";
      } else if (lower.includes("setup") || lower.includes("time") || lower.includes("fast")) {
        reply = "⚡ Core deployment takes less than 48 hours for standard CRM systems. Bespoke natural speech calling pipelines are initialized and customized within 7-10 business days!";
      } else if (lower.includes("demo") || lower.includes("free") || lower.includes("book")) {
        reply = "🏆 Absolutely! Standard bookings are free. Please fill the main CRM lead registration form directly behind this panel to instantly register your business name.";
      }

      setWaMessages((prev) => [
        ...prev,
        { sender: "bot", text: reply, time: "14:41" }
      ]);
      setWaTyping(false);
    }, 1200);
  };

  // Switch Ad campaign industries
  const updateAdIndustry = (ind: typeof adsIndustry) => {
    setAdsIndustry(ind);
    if (ind === "ecommerce") {
      setAdsGenerated({
        headline: "👉 Automate Your Shopify Shipments to 100% Autopilot",
        hook: "Tired of spending 3 hours daily typing address copies and updating tracking codes? 🛍️ Let our Salesman 2.0 CRM take over. Zero delays, happier clients.",
        badge: "AI Powered • 4.9★ Customer Review",
        imageKeyword: "minimalist metallic boxes logistics setup gradient"
      });
    } else if (ind === "realestate") {
      setAdsGenerated({
        headline: "🏡 Automated Leads Booking Engine for High-Ticket Realtors",
        hook: "Qualify house buyers 24/7 without manual calls. Our Outbound audio bot queries credit scores, budgets, and pre-approval status on autopilot.",
        badge: "Immediate ROI • Real Estate Pro",
        imageKeyword: "luxury modern glassvilla twilight purple glow"
      });
    } else if (ind === "coaching") {
      setAdsGenerated({
        headline: "🎯 Book 45+ High-Ticket Discovery Calls Seamlessly Weekly",
        hook: "Stop chatting inside DMs manually. Our AI funnel targets, pre-qualifies, and books direct calendar appointments straight into Google Calendar.",
        badge: "Scale Coaching • 10x ROI Goal",
        imageKeyword: "glowing holographic mentor network matrix"
      });
    } else {
      setAdsGenerated({
        headline: "💇 Trigger 3x Foot Traffic to Your Salon/Clinic This Friday",
        hook: "We automate location-based Google & IG ads integrated with instant chat bots booking bookings immediately. Keep your chairs full, always.",
        badge: "Local Business Growth • Laser Target",
        imageKeyword: "sophisticated premium modern desk room neon"
      });
    }
  };

  const currentConvRate = convVal;
  const optimizedConvRate = convVal * 2.5;
  const standardClientValue = 2000;
  const standardRevenue = trafficVal * (currentConvRate / 100) * standardClientValue;
  const optimizedRevenue = trafficVal * (optimizedConvRate / 100) * standardClientValue;
  const incrementRevenue = optimizedRevenue - standardRevenue;

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="w-full max-w-2xl bg-[#020205] rounded-2xl border border-indigo-500/30 overflow-hidden shadow-2xl flex flex-col h-[580px]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-950/45 via-[#0e122b]/45 to-blue-950/45 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg text-white">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="text-xs text-indigo-400 font-mono font-semibold uppercase tracking-widest">Interactive Sandbox Demo</span>
              <h3 className="font-display font-bold text-white text-base tracking-tight">{serviceTitle}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Scroll Container */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-[#020205]/95">
          
          {/* 1. Voice Call Simulation Interface */}
          {demoType === "voice" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-b from-[#0e122b]/30 to-blue-950/15 border border-indigo-500/20 text-center">
                <span className="text-xs text-indigo-300 font-mono uppercase tracking-wider block mb-1">Simulated Inbound / Outbound Agent Gateway</span>
                <p className="text-xs text-slate-400 max-w-md mx-auto font-sans">
                  Watch exactly how our voice agent dialogues call prospects to qualify, schedule, and close live leads.
                </p>
              </div>

              {/* Dial Panel console */}
              <div className="p-5 rounded-xl border border-white/5 bg-black/40 flex flex-col items-center">
                {voiceCallState === "idle" && (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 rounded-full bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto mb-4 animate-[pulse_2s_infinite]">
                      <Phone className="w-8 h-8" />
                    </div>
                    <button
                      onClick={triggerCallSimulation}
                      className="font-display font-semibold text-xs bg-gradient-to-r from-indigo-600 to-blue-600 hover:opacity-90 tracking-wide text-white px-5 py-2.5 rounded-lg border border-indigo-400/20 shadow-lg cursor-pointer flex items-center gap-2 mx-auto active:scale-95 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      Initiate Voice Demo Line
                    </button>
                  </div>
                )}

                {voiceCallState === "dialing" && (
                  <div className="text-center py-6">
                    <div className="relative w-16 h-16 mx-auto mb-4 font-sans">
                      <div className="absolute inset-0 rounded-full border border-indigo-500 animate-[ping_1.5s_infinite]"></div>
                      <div className="absolute inset-2 rounded-full bg-indigo-800/20 border border-indigo-400 flex items-center justify-center text-indigo-300">
                        <Phone className="w-6 h-6 animate-pulse" />
                      </div>
                    </div>
                    <p className="text-xs font-mono text-indigo-400 mb-1">STATUS: ESTABLISHING VECTOR TRUNK LINE...</p>
                    <p className="text-[11px] text-slate-500">Connecting synthesized call node to representative model.</p>
                  </div>
                )}

                {voiceCallState === "connected" && (
                  <div className="w-full space-y-5">
                    {/* Active call header details */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <p className="text-xs text-green-400 font-mono">CONNECTION ACTIVE • SECURE TRANSLATOR</p>
                      </div>
                      
                      <button
                        onClick={endCallSimulation}
                        className="text-[10px] text-red-400 hover:text-red-300 font-mono flex items-center gap-1 bg-red-950/20 border border-red-500/20 px-2.5 py-1 rounded cursor-pointer"
                      >
                        <Square className="w-2.5 h-2.5 fill-red-400" />
                        Disengage Call
                      </button>
                    </div>

                    {/* Spectrogram anim */}
                    <div className="flex justify-center items-center gap-1.5 h-16">
                      {voiceWave.map((h, i) => (
                        <div
                          key={i}
                          className={`w-1.5 rounded-t-full transition-all duration-100 ${
                            activeSpeech === "agent"
                              ? "bg-indigo-500"
                              : activeSpeech === "prospect"
                              ? "bg-blue-400"
                              : "bg-neutral-750"
                          }`}
                          style={{ height: `${h * 2}px` }}
                        ></div>
                      ))}
                    </div>

                    {/* Speech display monitor */}
                    <div className="h-44 overflow-y-auto rounded-lg border border-white/5 bg-black/60 p-3.5 space-y-2.5 font-sans scrollbar-none">
                      {voiceCallTranscript.map((t, i) => (
                        <div key={i} className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                          t.startsWith("🤖") ? "bg-[#0e122b]/40 border-l-2 border-indigo-500 text-slate-200" : "bg-blue-950/10 border-l-2 border-blue-400 text-slate-300"
                        }`}>
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {voiceCallState === "ended" && (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 rounded-full bg-red-950/25 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto mb-3">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-mono text-red-300 mb-4">CALL COMPLETED SUCCESSFULLY</p>
                    <button
                      onClick={triggerCallSimulation}
                      className="font-display font-medium text-xs text-indigo-300 hover:text-white border border-indigo-500/20 px-4 py-2 bg-indigo-500/5 hover:bg-indigo-500/10 rounded-lg transition-all cursor-pointer font-sans"
                    >
                      Restart Call Simulation
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. WhatsApp Onboarding Simulation Bot */}
          {demoType === "whatsapp" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-b from-green-950/20 to-blue-950/25 border border-green-500/20 text-center">
                <span className="text-xs text-green-300 font-mono uppercase tracking-wider block mb-1">Simulated WhatsApp Auto-Engagement Sandbox</span>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Type questions you'd expect prospects to ask (pricing, setup timelines, custom solutions) and see how Salesman 2.0 chats instantly!
                </p>
              </div>

              {/* Simulated Mobile Mock */}
              <div className="mx-auto w-[330px] rounded-2xl border-4 border-gray-800 bg-[#070b19] flex flex-col h-[320px] overflow-hidden shadow-xl">
                {/* Mobile Header bar */}
                <div className="p-3 bg-gradient-to-r from-green-950/80 to-teal-950/80 border-b border-white/5 flex items-center gap-2">
                  <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold font-mono">
                    S2
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold text-white leading-none">Salesman 2.0 Support Bot</span>
                    <span className="text-[9px] text-green-400 font-mono tracking-wide">● ONLINE • ACTIVE</span>
                  </div>
                </div>

                {/* Mobile Message Area */}
                <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-black/30 scrollbar-none">
                  {waMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`p-2 rounded-lg text-[11px] max-w-[85%] leading-relaxed ${
                        msg.sender === "user" ? "bg-green-600 font-sans text-white rounded-tr-none" : "bg-[#161c2e] text-gray-200 border border-white/5 rounded-tl-none"
                      }`}>
                        <p>{msg.text}</p>
                        <span className="block text-[8px] text-gray-400 text-right mt-0.5">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                  
                  {waTyping && (
                    <div className="flex justify-start">
                      <div className="p-2 bg-[#161c2e] rounded-lg rounded-tl-none border border-white/5">
                        <span className="text-[10px] text-green-400 animate-pulse font-mono flex items-center gap-1">
                          Auto responding...
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile quick-prompt suggestions */}
                <div className="p-1 px-2 border-t border-white/5 bg-[#090e1f] flex gap-1.5 overflow-x-auto scrollbar-none shrink-0 text-[9px]">
                  <button
                    onClick={() => setWaInput("What is the pricing setup?")}
                    className="bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded-full shrink-0 cursor-pointer text-[9px]"
                  >
                    💰 pricing?
                  </button>
                  <button
                    onClick={() => setWaInput("How fast is setup time?")}
                    className="bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded-full shrink-0 cursor-pointer text-[9px]"
                  >
                    ⚡ setup?
                  </button>
                </div>

                {/* Mobile Form input */}
                <form onSubmit={handleWaSubmit} className="p-2 bg-black/55 border-t border-white/5 flex gap-1.5 shrink-0">
                  <input
                    type="text"
                    value={waInput}
                    onChange={(e) => setWaInput(e.target.value)}
                    placeholder="Type customized chat..."
                    disabled={waTyping}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 text-[11px] text-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!waInput.trim() || waTyping}
                    className="bg-green-600 text-white p-1 rounded-lg hover:opacity-90 cursor-pointer flex items-center justify-center shrink-0 w-7 h-7"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 3. AI Ads Dynamic Campaign Generator */}
          {demoType === "ads" && (
            <div className="space-y-4 font-sans">
              <div className="p-4 rounded-xl bg-gradient-to-b from-blue-950/20 to-purple-950/25 border border-blue-500/20 text-center">
                <span className="text-xs text-blue-300 font-mono uppercase tracking-wider block mb-1">Target AI Facebook / Instagram ad designer</span>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Click different industries to generate smart ad copy formats and simulated targeting models generated by our automation engines.
                </p>
              </div>

              {/* Selector toggler tabs */}
              <div className="flex flex-wrap gap-2 justify-center mb-3 text-xs">
                {(["ecommerce", "realestate", "coaching", "local"] as const).map((ind) => (
                  <button
                    key={ind}
                    onClick={() => {
                      updateAdIndustry(ind);
                      setAdStatusMsg("");
                    }}
                    className={`px-3 py-1.5 rounded-lg border font-medium capitalize cursor-pointer transition-all ${
                      adsIndustry === ind
                        ? "bg-gradient-to-r from-indigo-600 to-blue-600 border-indigo-500 text-white shadow-lg"
                        : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    {ind === "ecommerce" ? "🛍️ Shopify / E-com" : ind === "realestate" ? "🏡 Real Estate" : ind === "coaching" ? "🎯 Coach / Tutor" : "💈 Local Salon"}
                  </button>
                ))}
              </div>

              {/* Ad Card Copy Canvas representation */}
              <div className="max-w-[380px] mx-auto rounded-xl border border-white/10 bg-[#0d1430]/90 shadow-xl overflow-hidden text-xs">
                {/* Meta platform header */}
                <div className="p-3 bg-black/40 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                      f
                    </div>
                    <span className="font-semibold text-slate-200">Meta Sponsored Feed Ads</span>
                  </div>
                  <span className="text-[10px] bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 px-1.5 py-0.5 rounded font-mono uppercase">AI DESIGNER</span>
                </div>

                {/* Dynamic Copy Text Content */}
                <div className="p-4 space-y-3 font-sans">
                  {/* Text hook */}
                  <p className="text-slate-300 leading-normal text-[11px] font-sans">
                    {adsGenerated.hook}
                  </p>

                  {/* Generated Visual simulation container */}
                  <div className="relative rounded-lg h-36 bg-slate-900 border border-white/5 overflow-hidden flex items-center justify-center">
                    {/* Placeholder design details */}
                    <img
                      src={`https://picsum.photos/seed/${adsGenerated.imageKeyword}/600/350`}
                      alt="AI Ad representation"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover opacity-65 mix-blend-color-dodge transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent"></div>
                    <div className="relative z-10 text-center px-4 space-y-1">
                      <span className="inline-block text-[9px] font-mono text-indigo-350 bg-indigo-950/80 border border-indigo-400/30 px-2 py-0.5 rounded-full uppercase">
                        {adsGenerated.badge}
                      </span>
                      <p className="font-display font-bold text-white text-xs tracking-tight line-clamp-1">
                        {adsGenerated.headline}
                      </p>
                    </div>
                  </div>

                  {/* Call to action panel */}
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] text-slate-400">TARGET: SOCIALS AD MATRIX</span>
                      <span className="text-[11px] font-semibold text-white">Click button to test funnel response</span>
                    </div>
                    <button
                      onClick={() => setAdStatusMsg("✓ DM sequence triggered! Funnel bot is waiting behind this simulator.")}
                      className="bg-indigo-600 text-white font-semibold font-sans px-3 py-1.5 rounded-md hover:bg-indigo-500 transition-colors text-[10px] cursor-pointer"
                    >
                      Book Free Demo
                    </button>
                  </div>

                  {adStatusMsg && (
                    <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-[10.5px] text-center font-mono leading-relaxed">
                      {adStatusMsg}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 4. Lead Funnel Projector & Calculator */}
          {demoType === "leads" && (
            <div className="space-y-5 font-sans">
              <div className="p-4 rounded-xl bg-gradient-to-b from-indigo-950/20 to-blue-950/25 border border-indigo-500/20 text-center">
                <span className="text-xs text-indigo-300 font-mono uppercase tracking-wider block mb-1">ROI & Funnel Improvement Projector</span>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Drag the sliders to project how automated AI customer support qualifies leads and increases direct conversion returns!
                </p>
              </div>

              {/* Sliders matrix card */}
              <div className="p-5 rounded-xl border border-white/5 bg-black/40 space-y-4">
                {/* Traffic controller */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Monthly Website / Campaign Traffic</span>
                    <span className="font-mono font-bold text-indigo-400">{trafficVal.toLocaleString()} visitors</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="50000"
                    step="1000"
                    value={trafficVal}
                    onChange={(e) => setTrafficVal(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-505"
                    style={{ accentColor: "#6366f1" }}
                  />
                </div>

                {/* Conversion percent controller */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Your Current Conversion Rate</span>
                    <span className="font-mono font-bold text-blue-300">{convVal}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="5"
                    step="0.5"
                    value={convVal}
                    onChange={(e) => setConvVal(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>

              {/* Comparison visual cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Standard card */}
                <div className="p-4 rounded-xl border border-white/5 bg-red-950/5 text-left space-y-2">
                  <span className="text-[10px] text-red-400 font-mono uppercase font-semibold">Current Pipeline Model</span>
                  <div>
                    <span className="block text-slate-400 text-xs">Monthly Inquiries</span>
                    <span className="font-display font-semibold text-gray-200 text-base">{(trafficVal * (currentConvRate / 100)).toFixed(0)} Leads</span>
                  </div>
                  <div className="border-t border-white/5 pt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Est. Value Revenue:</span>
                    <span className="font-mono text-red-300">₹{standardRevenue.toLocaleString()}</span>
                  </div>
                </div>

                {/* Optimized card */}
                <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/10 text-left space-y-2 relative overflow-hidden">
                  <div className="absolute right-2 top-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-mono text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
                    2.5x Increase
                  </div>
                  <span className="text-[10px] text-indigo-405 font-mono uppercase font-semibold">Salesman 2.0 Automation Model</span>
                  <div>
                    <span className="block text-slate-400 text-xs">Monthly Inquiries</span>
                    <span className="font-display font-semibold text-white text-base">{(trafficVal * (optimizedConvRate / 100)).toFixed(0)} Leads</span>
                  </div>
                  <div className="border-t border-white/5 pt-2 flex items-center justify-between text-xs text-gray-100 font-sans">
                    <span className="font-medium">Est. Value Revenue:</span>
                    <span className="font-mono text-green-400 font-semibold">₹{optimizedRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Incremental metrics breakdown */}
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left font-sans">
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-5 h-5 text-green-400 shrink-0" />
                  <div>
                    <span className="text-[11px] text-green-300 block">Projected Revenue Growth Autopilot Increments</span>
                    <span className="text-sm font-semibold text-white font-sans">+₹{incrementRevenue.toLocaleString()} Added Value</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="bg-green-600 hover:bg-green-500 font-semibold text-[11px] text-white px-3.5 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer font-sans"
                >
                  Book Free Setup Model
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom control bar */}
        <div className="p-4 bg-black/35 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interactive Node active in secure isolation</span>
          </div>
          <span>Salesman 2.0 Technology Stack</span>
        </div>
      </div>
    </div>
  );
}
