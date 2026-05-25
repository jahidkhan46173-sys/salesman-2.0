import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, AlertCircle } from "lucide-react";
import { ChatMessage } from "../types";

export default function LiveConsultantChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "⚡ **Greetings!** I am the Salesman 2.0 Digital Onboarding Agent.\n\nI am engineered to analyze your operations and recommend high-converting **AI Call Agents**, **WhatsApp Chatbots**, and **Automated Marketing Campaign architectures**.\n\nTell me: **What is your business name and what bottleneck are you trying to automate today?**",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsgText = input;
    setInput("");

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const chatHistory = messages.map(msg => ({
        role: msg.role === "assistant" ? "model" : msg.role,
        text: msg.text
      }));

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsgText, history: chatHistory }),
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with the Salesman 2.0 system");
      }

      const data = await response.json();

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "model",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Chat Error:", error);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "model",
        text: "⚠️ **System Communication Interrupted**\n\nI am experiencing high localized latency. However, let me assure you that **Salesman 2.0** specializes in WhatsApp automation, bespoke AI chatbots, and predictive paid traffic layouts. \n\nYou can dial us directly on **+91 9351426533** or book a free consultation form right on our website for instant onboarding!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="ai-consultant-widget">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
          title="Consult with Salesman 2.0"
        >
          <div className="absolute inset-0 rounded-full bg-indigo-500 opacity-20 blur-md group-hover:opacity-45 transition-opacity"></div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <MessageSquare className="w-7 h-7 relative z-10 animate-pulse" />
        </button>
      )}

      {/* Chat Console Window */}
      {isOpen && (
        <div className="w-[380px] sm:w-[420px] h-[550px] rounded-2xl glassmorphism shadow-2xl flex flex-col overflow-hidden animate-[fadeIn_0.2s_ease-out] border border-indigo-500/30">
          {/* Header Banner */}
          <div className="p-4 bg-gradient-to-r from-indigo-900/45 via-[#0e122b]/45 to-[#020205] border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg relative">
                <Bot className="w-6 h-6 text-white" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border border-gray-900"></div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-white tracking-tight text-sm">AGENCY_AGENT_2.0</span>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
                </div>
                <p className="text-[11px] text-indigo-300/80 font-mono tracking-wide">SYSTEM: ACTIVE • SECURE</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message List Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-[#020205] to-[#0d122b]/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role !== "user" && (
                  <div className="w-8 h-8 rounded-full bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center self-start shrink-0 text-indigo-400">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div className="max-w-[80%] flex flex-col">
                  <div
                    className={`p-3 rounded-2xl text-[13.5px] leading-relaxed shadow-lg ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-tr-none border border-indigo-400/20"
                        : "bg-white/5 border border-white/10 text-slate-200 rounded-tl-none whitespace-pre-line"
                    }`}
                  >
                    {/* Format simple bolding markdown representation */}
                    {msg.text.split("\n").map((line, idx) => {
                      // Process basic markdown style tags (e.g. **text**)
                      let content: React.ReactNode = line;
                      const boldPattern = /\*\*(.*?)\*\*/g;
                      if (boldPattern.test(line)) {
                        const parts = line.split(boldPattern);
                        content = parts.map((part, pIdx) => 
                          pIdx % 2 === 1 ? <strong key={pIdx} className="text-indigo-300 font-semibold">{part}</strong> : part
                        );
                      }
                      return <p key={idx} className={`${idx > 0 ? "mt-1.5" : ""}`}>{content}</p>;
                    })}
                  </div>
                  <span className={`text-[10px] text-slate-500 mt-1 font-mono ${msg.role === "user" ? "text-right" : "text-left"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Thinking / Loading Animation */}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center self-start shrink-0 text-indigo-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-2xl rounded-tl-none bg-white/5 border border-white/10 text-slate-200 shadow-lg">
                  <div className="flex space-x-1.5 items-center h-4">
                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2.5 h-2.5 bg-[#4f46e5] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Consultation Starters */}
          {messages.length === 1 && (
            <div className="px-4 py-2 bg-slate-950/50 flex flex-nowrap gap-2 overflow-x-auto border-t border-white/5 scrollbar-none scroll-smooth">
              <button
                onClick={() => setInput("How does the Voice Agent qualify leads?")}
                className="text-[11px] bg-indigo-950/30 border border-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full hover:bg-indigo-900/40 shrink-0 cursor-pointer transition-colors"
              >
                🤖 Voice qualification?
              </button>
              <button
                onClick={() => setInput("What is WhatsApp Automation pricing?")}
                className="text-[11px] bg-blue-950/30 border border-blue-500/20 text-blue-300 px-2.5 py-1 rounded-full hover:bg-blue-900/40 shrink-0 cursor-pointer transition-colors"
              >
                💬 WhatsApp pricing?
              </button>
              <button
                onClick={() => setInput("Show me the Starter vs Premium setup.")}
                className="text-[11px] bg-indigo-950/30 border border-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full hover:bg-indigo-900/40 shrink-0 cursor-pointer transition-colors"
              >
                📈 Automation setup?
              </button>
            </div>
          )}

          {/* Fixed Footer Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-black/50 border-t border-white/5 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Salesman 2.0 system..."
              disabled={isLoading}
              className="flex-1 bg-[#020205] border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/60 font-sans transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none disabled:scale-100"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
