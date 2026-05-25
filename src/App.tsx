import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  PhoneCall, 
  MessageSquare, 
  Megaphone, 
  Bot, 
  Sparkles, 
  Sliders, 
  FileText, 
  Globe, 
  ArrowRight, 
  Menu, 
  X, 
  ChevronDown, 
  Check, 
  Mail, 
  Send, 
  Users, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  PhoneCall as PhoneIcon,
  MessageCircle,
  HelpCircle,
  Award,
  Zap,
  CheckCircle2,
  DollarSign
} from "lucide-react";

import LiveConsultantChat from "./components/LiveConsultantChat";
import LeadCRMConsole from "./components/LeadCRMConsole";
import ServiceDemoModal from "./components/ServiceDemoModal";
import PremiumUPIPayment from "./components/PremiumUPIPayment";
import { ServiceItem, FAQ, Testimonial } from "./types";

// Services list mapping
const services: ServiceItem[] = [
  {
    id: "ser_voice",
    title: "AI Voice Calling Agent",
    description: "Automated phone dialers programmed to make qualifying inbound/outbound calls, log summaries, and schedule bookings.",
    detailedPoints: ["Make 500+ qualifying calls per hour", "Accept standard voice inputs and reason logically", "Instant calendar sync for booking calendars"],
    metrics: "Save 80% on support payroll",
    iconName: "voice",
    demoType: "voice"
  },
  {
    id: "ser_whatsapp",
    title: "WhatsApp Automation",
    description: "Automate bulk notifications, conversational customer intake, and responsive lead qualifiers natively on WhatsApp.",
    detailedPoints: ["Intelligent follow-up broadcasts", "Conversational AI chatbots responding under 0.5s", "Full contact intake fields sync"],
    metrics: "3x DM engagement rate",
    iconName: "whatsapp",
    demoType: "whatsapp"
  },
  {
    id: "ser_ads",
    title: "Instagram & Facebook Ads",
    description: "Run highly aligned meta campaigns connected directly to automatic chatbots capturing prospective user metrics.",
    detailedPoints: ["Dynamic ad generation for high CPC optimization", "Automated capture funnels inside Instagram DMs", "Instant pre-qualification quizzes"],
    metrics: "35% lower cost-per-lead",
    iconName: "ads",
    demoType: "ads"
  },
  {
    id: "ser_chatbots",
    title: "AI Chatbots",
    description: "Deploy smart, ultra-luxury website chat widgets programmed to capture emails, resolve customer FAQs, and schedule demos.",
    detailedPoints: ["Tailored product recommendation scripts", "Multi-language support over 20+ tongues", "Perfect desktop & mobile responsive alignment"],
    metrics: "95% support queries automated",
    iconName: "chatbots",
    demoType: "chat"
  },
  {
    id: "ser_leads",
    title: "Lead Generation",
    description: "Acquire pre-qualified, warm, high-intent client portfolios tailored to your exact industry criteria.",
    detailedPoints: ["Scrape and scoring of B2B databases", "Targeted cold outbound vectors on autopilot", "Highest converting funnel projection algorithms"],
    metrics: "+300% monthly inquiries",
    iconName: "leads",
    demoType: "leads"
  },
  {
    id: "ser_automation",
    title: "Business Automation",
    description: "Systemize repetitive administrative operational burdens and connect applications seamlessly using custom scripts.",
    detailedPoints: ["Eliminate daily copy-pasting spreadsheet tasks", "Auto trigger SMS updates and invoice creation", "Safe secure localized credential bridges"],
    metrics: "Save 15+ hours weekly",
    iconName: "automation",
    demoType: "leads"
  },
  {
    id: "ser_content",
    title: "AI Content Creation",
    description: "Generate highly engaging localized blog posts, captions, newsletters, and marketing materials instantly.",
    detailedPoints: ["Draft 30 days of social templates in under 5 minutes", "Custom copywriting tuned to brand voice constraints", "Dynamic script layout generation for vertical reels"],
    metrics: "10x faster output delivery",
    iconName: "content",
    demoType: "chat"
  },
  {
    id: "ser_website",
    title: "AI Website Solutions",
    description: "Modern, stunning business landing pages and interactive products integrated with custom conversational AI scripts on-screen.",
    detailedPoints: ["High impact display typography pairings", "Instant mobile configurations", "Built-in visual checkout elements"],
    metrics: "Ready in under 48 hours",
    iconName: "website",
    demoType: "leads"
  }
];

// Map string names to premium Lucide visuals
const renderServiceIcon = (name: string) => {
  const cls = "w-6 h-6 text-purple-400 shrink-0";
  switch (name) {
    case "voice": return <PhoneIcon className={cls} />;
    case "whatsapp": return <MessageCircle className={cls} />;
    case "ads": return <Megaphone className={cls} />;
    case "chatbots": return <Bot className={cls} />;
    case "leads": return <Sparkles className={cls} />;
    case "automation": return <Sliders className={cls} />;
    case "content": return <FileText className={cls} />;
    case "website": return <Globe className={cls} />;
    default: return <Sparkles className={cls} />;
  }
};

// Why choose us bullet layouts
const choices = [
  { title: "Modern AI Technology", desc: "Equipped with advanced Large Language Models for natural logic and instant speech synthesis capabilities.", icon: <Zap className="w-5 h-5 text-purple-400" /> },
  { title: "Affordable Pricing", desc: "No executive overhead bloats. We provide top-tier Silicon Valley digital scaling blueprints at transparent affordable modular prices.", icon: <Award className="w-5 h-5 text-blue-400" /> },
  { title: "Fast Setup", desc: "Initiate operational templates in under 48 hours for standard WhatsApp channels and 10 business days for complex call agents.", icon: <Clock className="w-5 h-5 text-indigo-400" /> },
  { title: "24/7 Support", desc: "Our virtual digital technicians operate indefinitely, and our live team responds to email/WhatsApp dialogs under 30 mins.", icon: <HelpCircle className="w-5 h-5 text-purple-400" /> },
  { title: "Custom AI Solutions", desc: "Bespoke, hand-configured operational integrations programmed to adapt directly to your business guidelines.", icon: <Sparkles className="w-5 h-5 text-blue-400" /> },
  { title: "Result Driven Strategy", desc: "Continuous conversion monitoring, A/B ad framework tweaks, and absolute dashboard visibility.", icon: <TrendingUp className="w-5 h-5 text-indigo-400" /> },
  { title: "Business Growth Focused", desc: "Systematically designed to save payroll hours and double outbound prospective call intake metrics.", icon: <Users className="w-5 h-5 text-purple-400" /> },
  { title: "Professional Team", desc: "SaaS automation specialists and copywriters committed to bringing your business into the predictive AI future.", icon: <ShieldCheck className="w-5 h-5 text-blue-400" /> }
];

// Testimonial quotes
const testimonials: Testimonial[] = [
  {
    id: "test_1",
    name: "Harsh Vardhan",
    role: "Founder & CEO",
    company: "Vardhan Coaching Network",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
    text: "Salesman 2.0 automated our customer support entirely on WhatsApp. In less than 15 days, our hot inbound lead volume surged by 45% and cost-per-lead plummeted!",
    glowColor: "border-purple-500/30"
  },
  {
    id: "test_2",
    name: "Sanjana Roy",
    role: "Operations Director",
    company: "Dwell Real Estate Groups",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80",
    text: "The voice calling agent is incredible. It qualifies prospects, logs their house-buying budget criteria, and places bookings seamlessly into our agents' calendars.",
    glowColor: "border-blue-500/30"
  },
  {
    id: "test_3",
    name: "Jameson Carter",
    role: "Marketing Architect",
    company: "Vitals E-commerce Store",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80",
    text: "Truly professional AI solutions combined with stellar, high-converting checkout landing structures. Our operational support overhead was cut by half.",
    glowColor: "border-indigo-500/30"
  }
];

// Frequent questions
const faqs: FAQ[] = [
  {
    id: "faq_1",
    question: "What AI services do you provide?",
    answer: "We deliver full-suite operational business automation. Our primary pillars include Outbound/Inbound Conversational AI Voice Calling Agents, custom WhatsApp Broadcast/CRM integrations, Meta/Instagram dynamic targeting Ads campaigns, conversational chatbots, and bespoke full-stack landing pages."
  },
  {
    id: "faq_2",
    question: "How does AI automation work?",
    answer: "We audit your manual workflows (answering support FAQs, booking discovery phone calls, copying billing spreadsheets) and implement automatic API routers or LLM agents to communicate 24/7. Your data stays organized and secure on server databases, accessible via your CRM."
  },
  {
    id: "faq_3",
    question: "Can AI help increase sales?",
    answer: "Yes, significantly. Standard local businesses miss about 30-40% of leads that arrive during off-hours or on weekends. Salesman 2.0 automation dials up leads under 2 seconds, captures support details immediately, and secures customer checkouts securely 24/7 on autopilot."
  },
  {
    id: "faq_4",
    question: "Do you provide custom solutions?",
    answer: "Absolutely. Every CRM flow, voice prompt, and ad template is custom-written, scored, and iterated for your industry context, brand tone parameters, and unique target demographic constraints."
  },
  {
    id: "faq_5",
    question: "Is support included?",
    answer: "Yes, standard technical maintenance and service optimizations are included. Starter plan clients receive basic email support, while our Business and Premium plan clients enjoy direct Priority/Dedicated engineering channels on Slack or WhatsApp."
  }
];

export default function App() {
  // Mobile navigation state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Billing connection states for interactive plan checkout
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "business" | "premium">("business");
  const [showPayment, setShowPayment] = useState(false);

  const handleSelectPlan = (plan: "starter" | "business" | "premium") => {
    setSelectedPlan(plan);
    setShowPayment(true);
    // Scroll smoothly downward to ensure prompt visual alignment
    setTimeout(() => {
      document.getElementById("payment-portal")?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  // Active service demo modal states
  const [demoOpen, setDemoOpen] = useState(false);
  const [activeDemoType, setActiveDemoType] = useState<any>("");
  const [activeServiceTitle, setActiveServiceTitle] = useState("");

  // CRM submissions state
  const [leadForm, setLeadForm] = useState({
    name: "",
    businessName: "",
    phone: "",
    email: "",
    message: "",
    service: "General Consultation"
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  // Interactive FAQ active index
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  // Animated micro counters
  const [daysCounter, setDaysCounter] = useState(0);
  const [leadsSaved, setLeadsSaved] = useState(0);

  useEffect(() => {
    // Elegant micro animations for key statistics on screen load
    const timerDays = setInterval(() => {
      setDaysCounter((prev) => (prev < 365 ? prev + 15 : 365));
    }, 40);
    const timerLeads = setInterval(() => {
      setLeadsSaved((prev) => (prev < 14850 ? prev + 450 : 14850));
    }, 40);

    return () => {
      clearInterval(timerDays);
      clearInterval(timerLeads);
    };
  }, []);

  // Handle lead submission
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone) {
      setFormError("Kindly supply Name and Phone Number to configure secure registration.");
      return;
    }

    setFormError("");
    setFormSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadForm),
      });

      if (response.ok) {
        // Post details to client's Formspree notification platform for instant email routing
        try {
          await fetch("https://formspree.io/f/mzdwvrko", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              "Notification Type": "Free Demo Booking Invitation",
              "Client Representative": leadForm.name,
              "Corporate Entity": leadForm.businessName || "N/A",
              "Inbound Mobile Link": leadForm.phone,
              "Official Email": leadForm.email || "N/A",
              "Message Log": leadForm.message || "No message provided",
              "Selected Service Mode": leadForm.service,
              "Platform Source": "Salesman 2.0 Corporate Core",
              "Status": "DEMO_BOOKED_AUTO_QUALIFIED",
              "Registration Date": new Date().toUTCString()
            })
          });
          console.log("Free Demo booked successfully and notification dispatched via Formspree.");
        } catch (fErr) {
          console.error("Formspree email routing error:", fErr);
        }

        setFormSuccess(true);
        setLeadForm({
          name: "",
          businessName: "",
          phone: "",
          email: "",
          message: "",
          service: "General Consultation"
        });
        // Scroll to CRM console to see real-time synchronization
        setTimeout(() => {
          document.getElementById("interactive-crm-dashboard")?.scrollIntoView({ behavior: "smooth" });
        }, 1500);
      } else {
        throw new Error("Lead submission failed on database server.");
      }
    } catch (err: any) {
      setFormError(err.message || "Network timeout under secure lead gate.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleLaunchDemo = (type: any, title: string) => {
    setActiveDemoType(type);
    setActiveServiceTitle(title);
    setDemoOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#020205] text-slate-200 font-sans selection:bg-indigo-600 selection:text-white relative overflow-x-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* STICKY GLASSMORPHISM NAVBAR */}
      <nav className="sticky top-0 z-40 w-full bg-[#020205]/70 backdrop-blur-md border-b border-white/5 font-sans" id="sticky-navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-900/40 border border-indigo-400/20">
                <div className="w-3.5 h-3.5 border-2 border-white rounded-sm"></div>
              </div>
              <a href="#" className="font-display font-bold text-xl tracking-tight text-white">
                SALESMAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-extrabold">2.0</span>
              </a>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center lg:gap-8 md:gap-5 text-sm font-medium text-slate-400">
              <a href="#services" className="hover:text-white transition-colors">Services</a>
              <a href="#why-choose" className="hover:text-white transition-colors">Why Salesman</a>
              <a href="#pricing" className="hover:text-white transition-colors">Plans</a>
              <a href="#interactive-crm-dashboard" className="hover:text-indigo-300 font-semibold font-mono text-indigo-400 bg-indigo-500/5 px-2.5 py-1 rounded-md border border-indigo-500/10 transition-colors">
                Live CRM Dashboard
              </a>
              <a
                href="#payment-portal"
                onClick={() => setShowPayment(true)}
                className="hover:text-white transition-colors"
              >
                Direct Checkout
              </a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            </div>

            {/* Header Booking CTA Button */}
            <div className="hidden md:block">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 font-display text-xs font-semibold px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer active:scale-95"
              >
                Book Free Demo <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Mobile Menu Trigger Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#020205]/95 backdrop-blur-xl p-5 space-y-4">
            <div className="flex flex-col space-y-3.5 text-sm font-medium text-slate-300">
              <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white py-1">Services</a>
              <a href="#why-choose" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white py-1">Why Salesman</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white py-1">Plans</a>
              <a href="#interactive-crm-dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-indigo-400 font-mono font-semibold py-1">Live CRM Dashboard</a>
              <a
                href="#payment-portal"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setShowPayment(true);
                }}
                className="hover:text-white py-1"
              >
                Direct Checkout
              </a>
              <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white py-1">FAQ</a>
            </div>
            
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full justify-center inline-flex items-center gap-2 font-display text-xs font-semibold px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white cursor-pointer text-center"
            >
              Book Free Demo <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </nav>

      {/* FLOATING WHATSAPP BUTTON (Connected to +91 9351426533) */}
      <div className="fixed bottom-6 left-6 z-50 font-sans" id="whatsapp-support">
        <a
          href="https://wa.me/9351426533"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 px-4 items-center justify-center gap-2 rounded-full bg-[#25D366] text-white font-semibold text-xs border border-green-400/25 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[120px] transition-all duration-300 ease-out font-display tracking-wide ml-1">
            WhatsApp Support
          </span>
        </a>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-10 pb-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10" id="hero-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero details left column */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full text-xs font-mono font-bold text-indigo-300 leading-normal">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>THE FUTURE OF DIGITAL SALES</span>
            </div>
            
            {/* Big Headline */}
            <div className="space-y-3">
              <span className="block text-xs text-indigo-400 font-mono tracking-widest uppercase font-bold">SALESMAN 2.0 AGENCY SYSTEMS</span>
              <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-5xl text-white tracking-tight leading-[1.08]">
                Grow Your Business <br />
                With <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-extrabold">AI Automation</span>
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed font-sans max-w-xl">
                We help businesses automate marketing, sales and customer support using modern AI solutions. Optimize conversions, qualify leads under 2 seconds, and operate 24/7 on complete autopilot.
              </p>
            </div>

            {/* Interactive stats row */}
            <div className="grid grid-cols-2 gap-4 pb-2 border-b border-white/5">
              <div>
                <span className="block font-display font-medium text-white text-3xl sm:text-4xl">
                  {daysCounter}+ Days
                </span>
                <span className="text-[11px] text-indigo-300 font-mono">CONTINUOUS 24/7 ACTIVE TIME</span>
              </div>
              
              <div>
                <span className="block font-display font-medium text-white text-3xl sm:text-4xl">
                  {leadsSaved ? `₹${(leadsSaved * 75).toLocaleString()}` : "Loading..."}
                </span>
                <span className="text-[11px] text-purple-300 font-mono">MORTGAGE SAVINGS GENERATED</span>
              </div>
            </div>

            {/* CTA buttons box */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-display">
              <a
                href="#contact"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 border border-indigo-400/20 text-white font-bold tracking-wide hover:scale-105 transition-transform shadow-[0_0_20px_rgba(79,70,229,0.4)] cursor-pointer text-center flex items-center gap-2"
              >
                Book Free Demo
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#pricing"
                className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-bold tracking-wide cursor-pointer text-center transition-all text-xs"
              >
                Get Started
              </a>

              <a
                href="#contact"
                className="px-4 py-3 text-slate-400 hover:text-white transition-colors text-xs font-medium"
              >
                Contact Us
              </a>
            </div>

            {/* Trust highlights block */}
            <div className="space-y-2.5 pt-2">
              <span className="block text-[10px] tracking-wider uppercase text-gray-500 font-mono">Trusted by ambitious businesses globally</span>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-400 font-medium font-mono">
                <span>⚡ eCommerce Stores</span>
                <span>•</span>
                <span>🏡 Real Estate</span>
                <span>•</span>
                <span>🎯 Top Advisors & Coaching Hubs</span>
                <span>•</span>
                <span>💈 Local Retail</span>
              </div>
            </div>
          </div>

          {/* Hero Digital Assistant Graphic column */}
          <div className="lg:col-span-6 relative mt-6 lg:mt-0">
            {/* Absolute visual neon ambient light blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-gradient-to-tr from-purple-500/20 to-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="relative glassmorphism rounded-3xl p-4 sm:p-5 border border-white/5 overflow-hidden shadow-2xl space-y-4">
              {/* Card Title Header */}
              <div className="flex items-center justify-between text-xs border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-ping"></span>
                  <span className="font-mono text-purple-300 font-bold uppercase tracking-wide">ACTIVE ENGINE PREVIEW: AI CORE_V2</span>
                </div>
                
                <span className="text-[10px] text-gray-500 font-mono">SYSTEM: AUTOPILOT</span>
              </div>

              {/* Generated premium tech asset image */}
              <div className="relative rounded-2xl overflow-hidden h-60 sm:h-72 lg:h-80 border border-white/10">
                <img
                  src="/src/assets/images/ai_digital_assistant_1779547256008.png"
                  alt="Salesman 2.0 AI Robot Illustration"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover select-none pointer-events-none hover:scale-102 transition-transform duration-700"
                />
                
                {/* Embedded floating metrics shard */}
                <div className="absolute bottom-3 left-3 bg-[#030712]/90 border border-purple-500/25 rounded-xl p-3 shadow-lg flex items-center gap-3 glassmorphism-light">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20 shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[9px] text-gray-400 font-mono leading-none m-0.5">QUALIFYING INTAKE SPEED</span>
                    <span className="text-xs font-bold text-white font-mono uppercase tracking-tight">Under 1.8 seconds</span>
                  </div>
                </div>

                <div className="absolute top-3 right-3 bg-green-500/10 border border-green-500/20 rounded-md py-1 px-2.5 flex items-center gap-1.5 backdrop-blur-md">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
                  <span className="text-[9px] font-mono text-green-400 font-bold uppercase tracking-wide">Voice Agent Live</span>
                </div>
              </div>

              {/* Quick simulation bar details */}
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono py-2 bg-black/40 rounded-xl border border-white/5">
                <div>
                  <span className="block text-gray-500">CONV RATE</span>
                  <span className="text-green-400 font-bold">+28.4%</span>
                </div>
                <div>
                  <span className="block text-gray-500">SUPPORT COSTS</span>
                  <span className="text-purple-400 font-bold">-75% AVG</span>
                </div>
                <div>
                  <span className="block text-gray-500">SETUP WAIT</span>
                  <span className="text-blue-400 font-bold">48 Hrs</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-20 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5" id="services">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest bg-purple-500/5 px-3 py-1.5 rounded-full border border-purple-500/10">
            OUR TECHNICAL SERVICES
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Premium AI Automation Built To Scale
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed font-sans">
            We deliver the future. Click **"Launch Demo Sandbox"** on any of the cards below to test customized simulated features of our systems in real-time.
          </p>
        </div>

        {/* Bento grid layout for 8 services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((ser) => (
            <div
              key={ser.id}
              className="group rounded-2xl glassmorphism border border-white/5 p-5 flex flex-col justify-between hover:border-purple-500/35 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              {/* Card top elements */}
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center shrink-0">
                  {renderServiceIcon(ser.iconName)}
                </div>
                
                <div>
                  <h3 className="font-display font-bold text-white text-base tracking-tight">{ser.title}</h3>
                  <p className="text-xs text-gray-400 mt-1.5 leading-relaxed font-sans">
                    {ser.description}
                  </p>
                </div>

                {/* Micro checklist of capabilities */}
                <div className="space-y-1 pt-1.5 border-t border-white/5">
                  {ser.detailedPoints.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-1.5 text-[10px] text-gray-400">
                      <Check className="w-3 h-3 text-purple-400 shrink-0" />
                      <span className="truncate leading-normal">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Launch CTA trigger */}
              <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between gap-1.5">
                <span className="text-[10px] font-mono text-purple-300 uppercase font-semibold">
                  {ser.metrics}
                </span>

                <button
                  onClick={() => handleLaunchDemo(ser.demoType, ser.title)}
                  className="text-[10px] font-display font-bold bg-purple-600 hover:bg-purple-500 text-white px-2.5 py-1.5 rounded-md cursor-pointer transition-colors active:scale-95"
                >
                  Launch Demo
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT SALESMAN 2.0 SECTION */}
      <section className="py-20 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5" id="about">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* About graphics columns */}
          <div className="lg:col-span-6 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="grid grid-cols-2 gap-4">
              {/* Block 1 */}
              <div className="p-5 rounded-2xl glassmorphism border border-white/5 space-y-1.5 text-left">
                <span className="block text-xs font-mono text-purple-300">ESTABLISHED MODEL</span>
                <span className="block font-display font-extrabold text-white text-3xl">100%</span>
                <p className="text-xs text-gray-400 leading-normal font-sans">
                  Autopilot execution rate across standard support pipelines.
                </p>
              </div>

              {/* Block 2 */}
              <div className="p-5 rounded-2xl glassmorphism border border-[#7A49D1]/20 bg-purple-950/5 space-y-1.5 text-left">
                <span className="block text-xs font-mono text-blue-300">PAYROLL SAVINGS</span>
                <span className="block font-display font-extrabold text-white text-3xl">₹50K+</span>
                <p className="text-xs text-gray-400 leading-normal font-sans">
                  Consolidated average user support salary savings monthly.
                </p>
              </div>

              {/* Block 3 */}
              <div className="p-5 rounded-2xl glassmorphism border border-[#7A49D1]/20 bg-[#0c132c] space-y-1.5 text-left">
                <span className="block text-xs font-mono text-indigo-300">FOLLOWUP DELAYS</span>
                <span className="block font-display font-extrabold text-white text-3xl">0.0s</span>
                <p className="text-xs text-gray-400 leading-normal font-sans">
                  Outbound calls dialed immediately on prospective submission.
                </p>
              </div>

              {/* Block 4 */}
              <div className="p-5 rounded-2xl glassmorphism border border-white/5 space-y-1.5 text-left">
                <span className="block text-xs font-mono text-purple-300">CONVERSION MULTIPLE</span>
                <span className="block font-display font-extrabold text-white text-3xl">3.5x</span>
                <p className="text-xs text-gray-400 leading-normal font-sans">
                  Average increase in direct organic schedule conversion results.
                </p>
              </div>
            </div>
          </div>

          {/* About copy descriptions */}
          <div className="lg:col-span-6 text-left space-y-6 sm:space-y-8">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest block">
              CORES & FOUNDATIONS
            </span>
            
            <div className="space-y-3">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
                About Salesman 2.0
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-sans">
                Salesman 2.0 is a modern AI Automation & Marketing Agency helping businesses grow faster using advanced AI technology. We provide smart AI systems that automate marketing, customer support, sales and lead generation.
              </p>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-sans">
                We bridge the critical execution gap between qualified prospective users and business checkouts. Our synthesized calling assets dial candidates instantly, answer customer FAQs recursively, and securely manage cash transactions so you can step away from manual administrative grind.
              </p>
            </div>

            {/* Mission outline */}
            <div className="p-4 sm:p-5 rounded-xl border border-white/5 bg-black/40 text-left space-y-2">
              <span className="text-[10px] text-purple-400 font-mono font-semibold uppercase tracking-wider block">OUR PRIMARY MISSION STATEMENT</span>
              <p className="font-display text-white text-sm font-semibold">
                "Helping businesses save time, compress support operational overhead, and increase relative conversions using modern AI vectors."
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-20 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5" id="why-choose">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
            THE UNIQUE SALESMAN ADVANTAGE
          </span>
          <h2 className="font-display font-black text-3xl text-white tracking-tight">
            Why Choose Salesman 2.0?
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            We reject complex, expensive, fragile code architectures. We deliver blazing-fast, high-converting checkout results with zero tech bottlenecks.
          </p>
        </div>

        {/* 8 Grid Cells why choose us */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {choices.map((choice, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl glassmorphism border border-white/5 hover:border-purple-500/25 transition-all text-left space-y-3"
            >
              <div className="w-9 h-9 rounded-lg bg-white/2 border border-white/5 flex items-center justify-center shrink-0">
                {choice.icon}
              </div>
              <h4 className="font-display font-bold text-white text-sm">{choice.title}</h4>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">{choice.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS TIMELINE SECTION */}
      <section className="py-20 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5" id="process">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest block bg-indigo-500/5 px-3 py-1.5 rounded-full border border-indigo-500/10 w-fit mx-auto">
            TIMELINE MODEL
          </span>
          <h2 className="font-display font-black text-3xl text-white tracking-tight">
            4-Step Automation Process
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Incredibly clean onboarding alignment designed to take your traditional operation fully digital in under 10 business days.
          </p>
        </div>

        {/* Timeline representation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          
          {/* Timeline connecting vector bar */}
          <div className="hidden md:block absolute top-[44px] left-[50px] right-[50px] h-0.5 bg-gradient-to-r from-purple-500/40 via-indigo-500/40 to-blue-500/40 z-0"></div>

          {/* Step 1 */}
          <div className="p-5 rounded-2xl glassmorphism border border-white/5 space-y-3 text-left relative z-10">
            <span className="w-9 h-9 rounded-full bg-purple-600/10 border border-purple-500 flex items-center justify-center text-purple-400 text-sm font-mono font-bold">1</span>
            <h4 className="font-display font-medium text-white text-base leading-tight">Consultation</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              We catalog your administrative flows (calls, FAQs, campaigns) and design structural optimization bottlenecks.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl glassmorphism border border-white/5 space-y-3 text-left relative z-10">
            <span className="w-9 h-9 rounded-full bg-indigo-600/10 border border-indigo-400 flex items-center justify-center text-indigo-300 text-sm font-mono font-bold">2</span>
            <h4 className="font-display font-medium text-white text-base leading-tight">Strategy Planning</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              We author highly persuasive conversational dialog trees, API routes, and score ad campaign targeting bounds.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl glassmorphism border border-white/5 space-y-3 text-left relative z-10">
            <span className="w-9 h-9 rounded-full bg-blue-600/10 border border-blue-400 flex items-center justify-center text-blue-300 text-sm font-mono font-bold">3</span>
            <h4 className="font-display font-medium text-white text-base leading-tight">AI Setup & Automation</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              We deploy the LLM pipelines, WhatsApp API routers, website chat widgets, and synchronize client databases.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-2xl glassmorphism border border-white/5 space-y-3 text-left relative z-10">
            <span className="w-9 h-9 rounded-full bg-green-600/10 border border-green-500 flex items-center justify-center text-green-400 text-sm font-mono font-bold">4</span>
            <h4 className="font-display font-medium text-white text-base leading-tight">Business Growth</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Real-time monitoring active. Your virtual dialers book warm candidates into your schedule 24/7 on autopilot.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING MATRIX SECTION */}
      <section className="py-20 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5" id="pricing">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest block bg-purple-500/5 px-3 py-1.5 rounded-full border border-purple-500/10 w-fit mx-auto">
            SERVICE ACTIVATION LICENSES
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Transparent Flexible Subscription Plans
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Pay simple competitive pricing on complete secure modules. Selecting any plan opens the direct UPI checkout system automatically below.
          </p>
        </div>

        {/* Side-by-side matrices */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Plan 1 */}
          <div className="p-6 rounded-3xl glassmorphism border border-white/5 text-left flex flex-col justify-between relative group hover:border-purple-500/15 duration-350 transition-all">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono text-purple-300 font-semibold block uppercase">Starter Package</span>
                <h3 className="font-display font-bold text-white text-xl mt-1">Growth Pilot</h3>
                <p className="text-xs text-gray-400 mt-1">Excellent for single founders and boutique agencies starting automation.</p>
              </div>

              <div className="border-t border-b border-white/5 py-3 flex items-baseline gap-1">
                <span className="font-display font-black text-3xl text-white">₹4,999</span>
                <span className="text-xs text-gray-400">/ month</span>
              </div>

              <div className="space-y-3">
                <span className="block text-[11px] font-mono uppercase text-gray-500 tracking-wider">Plan Inclusions:</span>
                <div className="space-y-2.5 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>WhatsApp Automation (CRM Onboarding)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Basic AI Web Chatbot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Basic Email Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Standard Database Captures</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => handleSelectPlan("starter")}
                className="w-full justify-center inline-flex items-center gap-1.5 font-display text-xs font-semibold px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white cursor-pointer active:scale-95 transition-all outline-none"
              >
                Activate Starter License
              </button>
            </div>
          </div>

          {/* Plan 2: POPULAR */}
          <div className="p-6 rounded-3xl glassmorphism border-2 border-purple-500 text-left flex flex-col justify-between relative group shadow-purple-950/20 shadow-2xl overflow-hidden md:scale-102 lg:-translate-y-2">
            
            {/* Ambient Purple glow flare inside Popular card */}
            <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-purple-500/10 blur-2xl pointer-events-none"></div>

            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-purple-300 font-bold uppercase">Business Package</span>
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-mono text-[9px] px-2.5 py-1 rounded-full font-bold uppercase">MOST CHOSEN</span>
              </div>
              
              <div>
                <h3 className="font-display font-bold text-white text-xl mt-1">Enterprise Autopilot</h3>
                <p className="text-xs text-gray-400 mt-1">Perfect for high-growth startups and established real estate realtors.</p>
              </div>

              <div className="border-t border-b border-white/5 py-3 flex items-baseline gap-1">
                <span className="font-display font-black text-3xl text-white">₹14,999</span>
                <span className="text-xs text-gray-400">/ month</span>
              </div>

              <div className="space-y-3">
                <span className="block text-[11px] font-mono uppercase text-gray-400 tracking-wider">Plan Inclusions:</span>
                <div className="space-y-2.5 text-xs text-gray-200">
                  <div className="flex items-center gap-2">
                    <Check className="w-4.5 h-4.5 text-purple-400 shrink-0" />
                    <span className="font-semibold text-white">Outbound/Inbound AI Voice Agent Dialer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>WhatsApp Broadcasters & Automated Flows</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Instagram & Facebook Ads Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Lead Generation Scoring Scrapes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Priority Technical Support (Under 30m Response)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 relative z-10 font-display">
              <button
                onClick={() => handleSelectPlan("business")}
                className="w-full justify-center inline-flex items-center gap-1.5 font-display text-xs font-semibold px-4 py-3 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 border border-purple-400/20 text-white cursor-pointer active:scale-95 transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] placeholder:outline-none"
              >
                Activate Business License
              </button>
            </div>
          </div>

          {/* Plan 3 */}
          <div className="p-6 rounded-3xl glassmorphism border border-white/5 text-left flex flex-col justify-between relative group hover:border-purple-500/15 duration-350 transition-all">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono text-purple-300 font-semibold block uppercase">Premium Package</span>
                <h3 className="font-display font-bold text-white text-xl mt-1">Omnipresent Growth Matrix</h3>
                <p className="text-xs text-gray-400 mt-1">For corporate teams wanting bespoke AI models integrated offline.</p>
              </div>

              <div className="border-t border-b border-white/5 py-3 flex items-baseline gap-1">
                <span className="font-display font-black text-3xl text-white">₹29,999</span>
                <span className="text-xs text-gray-400">/ month</span>
              </div>

              <div className="space-y-3">
                <span className="block text-[11px] font-mono uppercase text-gray-500 tracking-wider">Plan Inclusions:</span>
                <div className="space-y-2.5 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Full Omnipresent Business Automation CRM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Bespoke Natural Speech Calling Voice Pipelines</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Dedicated Technical Engineer (Slack Standby)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Complete Custom Landing Page Solutions</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => handleSelectPlan("premium")}
                className="w-full justify-center inline-flex items-center gap-1.5 font-display text-xs font-semibold px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white cursor-pointer active:scale-95 transition-all outline-none"
              >
                Activate Premium License
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LUXURY UPI SYSTEM INTEGRATION (PhonePe scannables) */}
      <section className="py-20 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5" id="payment-portal">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-mono font-bold text-green-400 uppercase tracking-widest block bg-green-500/5 px-2.5 py-1.5 rounded-full border border-green-500/10 w-fit mx-auto">
            SECURE CHECKOUT TERMINAL
          </span>
          <h2 className="font-display font-black text-3xl text-white tracking-tight">
            Direct UPI Secured Payment Portal
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Scan below to configure transactions immediately. Submited payments check in real-time under standard NPCI protocols.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!showPayment ? (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0, scale: 0.99, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.99, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="w-full max-w-4xl mx-auto rounded-3xl border border-dashed border-white/10 bg-black/40 backdrop-blur-md p-8 sm:p-12 text-center relative overflow-hidden flex flex-col items-center justify-center space-y-6">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>
                
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-lg relative shrink-0">
                  <span className="absolute -inset-1 rounded-full bg-indigo-500/10 blur animate-pulse"></span>
                  <ShieldCheck className="w-8 h-8 text-indigo-400" />
                </div>

                <div className="space-y-2 max-w-lg">
                  <h3 className="font-display font-semibold text-white text-lg tracking-tight">
                    Secure Payment Terminal Locked
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Please select a target subscription license above to configure the secured payment terminal. Click on any plan's activation button to automatically generate your secure UPI/Card node.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
                  <button
                    onClick={() => handleSelectPlan("starter")}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-medium hover:text-white transition-all cursor-pointer active:scale-95"
                  >
                    ⚡ Trial Starter (₹4,999)
                  </button>
                  <button
                    onClick={() => handleSelectPlan("business")}
                    className="px-4 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/15 border border-purple-500/20 text-xs text-purple-300 font-semibold hover:text-purple-200 transition-all cursor-pointer active:scale-95"
                  >
                    💎 Elite Business (₹14,999)
                  </button>
                  <button
                    onClick={() => handleSelectPlan("premium")}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-medium hover:text-white transition-all cursor-pointer active:scale-95"
                  >
                    👑 Enterprise Premium (₹29,999)
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="payment"
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -15 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            >
              <PremiumUPIPayment selectedPlan={selectedPlan} onPlanChange={setSelectedPlan} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* LEAD MONITORING DASHBOARD (Real-time tabular visual check) */}
      <section className="py-20 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5" id="interactive-crm-dashboard">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest block bg-purple-500/5 px-2.5 py-1.5 rounded-full border border-purple-500/10 w-fit mx-auto">
            LIVE CRM MONITORING SYSTEM
          </span>
          <h2 className="font-display font-black text-3xl text-white tracking-tight animate-pulse">
            Salesman 2.0 Inbound Leads Console
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Witness how inquiries completed in our contact form instantly materialise in our database on-screen, mapping channels and selected objectives!
          </p>
        </div>

        <LeadCRMConsole />
      </section>

      {/* CLIENT TESTIMONIALS */}
      <section className="py-20 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5" id="testimonials">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
            CLIENT LEDGER LOGS
          </span>
          <h2 className="font-display font-black text-3xl text-white tracking-tight">
            Loved By Growing Startups
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed font-sans">
            Hear directly from operations managers who doubled conversion schedules while eliminating administrative burdens.
          </p>
        </div>

        {/* 3 Grid testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className={`p-6 bg-black/40 border rounded-2xl text-left space-y-4 hover:border-purple-500/15 duration-300 transition-all ${test.glowColor}`}
            >
              <p className="text-xs sm:text-sm text-gray-300 italic leading-relaxed">
                "{test.text}"
              </p>
              
              <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                <img
                  src={test.image}
                  alt={test.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-white/10"
                />
                <div className="font-sans">
                  <span className="block text-xs font-semibold text-white leading-tight">{test.name}</span>
                  <span className="text-[10px] text-gray-500 font-mono">{test.role} • {test.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT FORM AND DEMO BOOKING MODULE */}
      <section className="py-20 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5" id="contact">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-5xl mx-auto">
          
          {/* Left instructions list */}
          <div className="lg:col-span-5 text-left space-y-6 sm:space-y-8">
            <div>
              <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest block mb-1">
                DOCK INTAKE CHANNELS
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
                Secure Free Advisory Briefing
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed">
                Provide your workspace credentials, pick an objective, and watch your registration lock in our interactive CRM matrix live!
              </p>
            </div>

            {/* Direct support coordinates text */}
            <div className="space-y-4 text-xs font-sans">
              <span className="block text-[10px] uppercase text-gray-500 font-mono">SUPPORT DIRECTLINE</span>
              
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-purple-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-slate-500 font-mono text-[9px] leading-none">EMAIL US</span>
                  <a href="mailto:jahidkhan46173@gmail.com" className="text-xs font-semibold text-gray-200 hover:text-white transition-colors select-all">
                    jahidkhan46173@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-blue-400 shrink-0">
                  <MessageCircle className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="block text-slate-500 font-mono text-[9px] leading-none">WHATSAPP DIRECT</span>
                  <a href="https://wa.me/9351426533" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-gray-200 hover:text-white transition-colors">
                    +91 9351426533
                  </a>
                </div>
              </div>
            </div>

            {/* Interactive platform anchors */}
            <div className="space-y-2">
              <span className="block text-[10px] uppercase text-gray-500 font-mono">Social platforms</span>
              <div className="flex gap-3 text-xs text-gray-400 font-semibold font-display">
                <a href="https://wa.me/9351426533" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">WhatsApp</a>
                <span>•</span>
                <a href="#" className="hover:text-purple-400 transition-colors">Instagram</a>
                <span>•</span>
                <a href="#" className="hover:text-blue-400 transition-colors">Facebook</a>
              </div>
            </div>
          </div>

          {/* Right form container */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl glassmorphism border border-white/5 relative">
              {formSuccess ? (
                <div className="text-center py-10 space-y-4 animate-[fadeIn_0.3s_ease-out]" id="success-screen">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/35 flex items-center justify-center text-green-400 mx-auto">
                    <CheckCircle2 className="w-8 h-8 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-white text-base">Test Client Registered Successfully!</h3>
                    <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto leading-normal">
                      We've committed your business data into our server-side database. It is now live in our **CRM Leads Console** list! Let our automation dial you up shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => setFormSuccess(false)}
                    className="text-xs font-mono font-medium text-purple-400 hover:text-purple-300 border border-purple-500/20 rounded-lg px-4 py-2 bg-purple-500/5 hover:bg-purple-500/10 transition-colors cursor-pointer"
                  >
                    Register Another Test Lead
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="block text-xs text-gray-400">Your Full Name:</label>
                      <input
                        type="text"
                        required
                        value={leadForm.name}
                        onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                        placeholder="John Parker"
                        className="w-full text-xs text-white bg-black/40 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors font-sans"
                      />
                    </div>

                    {/* Business */}
                    <div className="space-y-1">
                      <label className="block text-xs text-gray-400">Business Name:</label>
                      <input
                        type="text"
                        value={leadForm.businessName}
                        onChange={(e) => setLeadForm({ ...leadForm, businessName: e.target.value })}
                        placeholder="Parker Agency Co."
                        className="w-full text-xs text-white bg-black/40 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="block text-xs text-gray-400">Phone (with Whatsapp):</label>
                      <input
                        type="tel"
                        required
                        value={leadForm.phone}
                        onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                        placeholder="+91 93514 26533"
                        className="w-full text-xs text-white bg-black/40 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors font-sans"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="block text-xs text-gray-400">Work Email Address:</label>
                      <input
                        type="email"
                        value={leadForm.email}
                        onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                        placeholder="john@parkeragency.com"
                        className="w-full text-xs text-white bg-black/40 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors font-sans"
                      />
                    </div>
                  </div>

                  {/* Service selector */}
                  <div className="space-y-1">
                    <label className="block text-xs text-gray-400">Core Goal Objective of Interest:</label>
                    <div className="relative">
                      <select
                        value={leadForm.service}
                        onChange={(e) => setLeadForm({ ...leadForm, service: e.target.value })}
                        className="w-full text-xs text-white bg-[#0e142c] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 appearance-none font-sans"
                      >
                        <option value="General Consultation">General Strategy & Coaching</option>
                        <option value="AI Voice Calling Agent">Outbound AI Voice Calling Agent</option>
                        <option value="WhatsApp Automation">WhatsApp Automation & CRM API</option>
                        <option value="Instagram & Facebook Ads">Target Dynamic Meta Social Ads</option>
                        <option value="AI Chatbots">Smart Website AI Chatbots</option>
                        <option value="Lead Generation">Bulk Lead Scraping & Verification</option>
                        <option value="Business Automation">Repetitive Database Automation</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Memo text area */}
                  <div className="space-y-1">
                    <label className="block text-xs text-gray-400">Brief Message or Bottleneck Description:</label>
                    <textarea
                      rows={3}
                      value={leadForm.message}
                      onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                      placeholder="We lose support leads during Sunday hours, need an automated chatbot..."
                      className="w-full text-xs text-white bg-black/40 border border-white/5 rounded-xl p-4 focus:outline-none focus:border-purple-500 transition-colors font-sans resize-none"
                    ></textarea>
                  </div>

                  {formError && (
                    <div className="text-xs text-red-400 flex items-center gap-1.5 font-mono">
                      <X className="w-4 text-red-400" />
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 pt-2 font-display">
                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="w-full font-display font-semibold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-500/20 py-3 rounded-xl cursor-pointer hover:opacity-90 active:scale-95 transition-all text-center"
                    >
                      {formSubmitting ? "Locking intake..." : "Book Free Demo"}
                    </button>
                    
                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="w-full font-display font-semibold text-xs text-gray-300 hover:text-white bg-white/5 border border-white/10 py-3 rounded-xl cursor-pointer hover:bg-white/10 active:scale-95 transition-all text-center"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ACCORDION FAQ SECTION */}
      <section className="py-20 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 border-t border-white/5" id="faq">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest block bg-purple-500/5 px-2.5 py-1.5 rounded-full border border-purple-500/10 w-fit mx-auto">
            KNOWLEDGE BASE FAQ
          </span>
          <h2 className="font-display font-black text-3xl text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Quick, standard answers to operational bounds and system questions.
          </p>
        </div>

        {/* FAQ list */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="rounded-xl glassmorphism border border-white/5 overflow-hidden transition-all duration-300 text-left"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                className="w-full p-5 flex items-center justify-between text-left cursor-pointer focus:outline-none font-sans"
              >
                <span className="font-display font-bold text-white text-sm sm:text-base pr-3">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-purple-400 shrink-0 transition-transform duration-300 ${activeFaq === faq.id ? "rotate-180" : ""}`} />
              </button>
              
              {activeFaq === faq.id && (
                <div className="px-5 pb-5 animate-[fadeIn_0.2s_ease-out]">
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pl-0.5 pt-1.5 border-t border-white/5 font-sans">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="bg-black/80 border-t border-white/5 relative z-10 font-sans" id="footer-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            
            {/* Branding left panel */}
            <div className="md:col-span-4 text-left space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-extrabold shadow-sm">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <span className="font-display font-extrabold text-white text-lg tracking-tight">Salesman 2.0</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed font-sans">
                Salesman 2.0 is a modern AI Automation & Marketing Agency helping businesses grow faster using advanced AI technology. We save you manual payroll hours and qualify hot prospects 24/7.
              </p>
              <p className="text-[10px] text-gray-600 font-mono">
                © {new Date().getFullYear()} Salesman 2.0 Corp • ALL RIGHTS SECURED
              </p>
            </div>

            {/* Middle Services index */}
            <div className="md:col-span-4 text-left">
              <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider mb-4">Autonomous Services</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 font-sans">
                <a href="#services" className="hover:text-purple-400 transition-colors">AI Voice Calling</a>
                <a href="#services" className="hover:text-purple-400 transition-colors">WhatsApp CRM</a>
                <a href="#services" className="hover:text-purple-400 transition-colors">Meta Social Ads</a>
                <a href="#services" className="hover:text-purple-400 transition-colors">Bespoke Chatbots</a>
                <a href="#services" className="hover:text-purple-400 transition-colors">Lead Scorers</a>
                <a href="#services" className="hover:text-purple-400 transition-colors">Flow Automation</a>
              </div>
            </div>

            {/* Right quick navigations links */}
            <div className="md:col-span-4 text-left space-y-4">
              <div>
                <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider mb-3">Quick Navigation</h4>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500 font-sans">
                  <a href="#" className="hover:text-white transition-colors">Home</a>
                  <a href="#services" className="hover:text-white transition-colors">Services</a>
                  <a href="#why-choose" className="hover:text-white transition-colors">Why Salesman</a>
                  <a href="#pricing" className="hover:text-white transition-colors">Pricing Plans</a>
                  <a href="#contact" className="hover:text-white transition-colors">Contact Matrix</a>
                </div>
              </div>

              {/* Secure certification check info */}
              <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-mono">
                <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                <span>SERVER: SYSTEM_NODE_ACTIVE • LATENCY: NORMAL</span>
              </div>
            </div>

          </div>
        </div>
      </footer>

      {/* SERVER-SIDE GEMINI LIVE CONSULTING CHAT INTERFACE */}
      <LiveConsultantChat />

      {/* SERVICE SANDBOX DEMO MODAL COMPONENT */}
      <ServiceDemoModal
        isOpen={demoOpen}
        onClose={() => setDemoOpen(false)}
        demoType={activeDemoType}
        serviceTitle={activeServiceTitle}
      />
    </div>
  );
}
