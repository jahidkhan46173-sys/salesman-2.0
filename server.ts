import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Add Request Logger Middleware
  app.use((req, res, next) => {
    console.log(`[Express API Trace] ${req.method} ${req.url}`);
    next();
  });

  const LEADS_FILE = path.join(process.cwd(), "data", "leads.json");

  // Ensure data directory exists
  if (!fs.existsSync(path.join(process.cwd(), "data"))) {
    fs.mkdirSync(path.join(process.cwd(), "data"), { recursive: true });
  }
  if (!fs.existsSync(LEADS_FILE) || fs.readFileSync(LEADS_FILE, "utf-8").trim() === "[]" || fs.readFileSync(LEADS_FILE, "utf-8").trim() === "") {
    const bootstrapLeads = [
      {
        id: "lead_1",
        name: "Rajesh Sharma",
        businessName: "Sharma Organic Foods",
        phone: "+91 98452 11092",
        email: "rajesh@sharmaorganics.in",
        message: "We need automated WhatsApp followup for shopping cart abandonment flow.",
        service: "WhatsApp Automation",
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        status: "Qualified"
      },
      {
        id: "lead_2",
        name: "Amanda Cole",
        businessName: "Cole Coaching Hub",
        phone: "+1 (555) 430-9921",
        email: "amanda@colecoaching.com",
        message: "Interested in outbound AI Voice agents to qualify booking consultation files.",
        service: "AI Voice Calling Agent",
        createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
        status: "Demo Scheduled"
      },
      {
        id: "lead_3",
        name: "Akash Verma",
        businessName: "Noida Prime Apartments",
        phone: "+91 93112 40591",
        email: "sales@primeapartments.com",
        message: "Looking for instant chatbot captures on social campaigns.",
        service: "AI Chatbots",
        createdAt: new Date(Date.now() - 3600000 * 44).toISOString(),
        status: "New"
      }
    ];
    fs.writeFileSync(LEADS_FILE, JSON.stringify(bootstrapLeads, null, 2));
  }

  // API Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API to submit lead
  app.post("/api/leads", (req, res) => {
    try {
      const { name, businessName, phone, email, message, service } = req.body;
      if (!name || !phone) {
        return res.status(400).json({ error: "Name and Phone Number are required." });
      }
      const rawData = fs.readFileSync(LEADS_FILE, "utf-8");
      const leads = JSON.parse(rawData);
      
      const newLead = {
        id: "lead_" + Date.now(),
        name,
        businessName: businessName || "N/A",
        phone,
        email: email || "N/A",
        message: message || "No message provided",
        service: service || "General Consultation",
        createdAt: new Date().toISOString(),
        status: "New"
      };
      
      leads.push(newLead);
      fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
      res.json({ success: true, lead: newLead });
    } catch (err: any) {
      console.error("Leads storage error:", err);
      res.status(500).json({ error: "Could not record lead registration." });
    }
  });

  // API to fetch leads
  app.get("/api/leads", (req, res) => {
    try {
      const rawData = fs.readFileSync(LEADS_FILE, "utf-8");
      const leads = JSON.parse(rawData);
      res.json(leads);
    } catch (err) {
      res.json([]);
    }
  });

  // API Gemini chat route
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.json({
          text: `⚡ **Welcome to the Salesman 2.0 Briefing Room!**\n\nI am running in **Demo Mode** since the \`GEMINI_API_KEY\` hasn't been added to the application settings. However, let me brief you on how we can skyrocket your business:\n\n1. 📞 **Outbound AI Voice Agents**: We deploy conversational phone models that make 500+ qualifying calls per hour, booking qualified prospects into your calendar 24/7.\n2. 💬 **WhatsApp CRM Flows**: Automated conversational onboarding and lead nurtures operating entirely on autopilot.\n3. 🎯 **Predictive Ad Campaigns**: Smart Facebook & Instagram funnels that feed high-intent leads straight to your CRM.\n\nOur packages start at just **₹4,999/month**. Try booking a mockup demo under the Contact form or select a plan to view secure UPI checkout instructions!`,
          isDemo: true
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      const systemPrompt = `You are "Salesman 2.0 AI Agency Agent", a brilliant, charismatic, futuristic AI growth consultant representing "Salesman 2.0" (a world-class ultra-luxury AI automation and marketing agency).
Our mission: Automate customer support, sales, and lead generation using advanced AI technologies.
Our services:
- Outbound AI Voice Calling Agent (qualified lead follow-up, customer support, scheduling, 24/7 calls)
- WhatsApp Automation (answering FAQs, booking intakes, broadcasts on Autopilot)
- Instagram & Facebook Ads (targeted visual placement, instant bot capture inside DMs)
- Custom Business Automation & Content Engines (writing newsletters, scripts, posts)

Rules:
- Speak briefly, elegantly, and with confidence. Highlight ROI and digital growth.
- Format responses beautifully with markdown bullet points and visual spacing.
- Invite the visitor to submit their lead in our Contact Form so our digital voice agent can automatically dial them up!
- If the visitor wants pricing info, outline: Starter (₹4,999/mo), Business (₹14,999/mo), Premium (₹29,999/mo).`;

      const contents = [];
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          if (msg.role === "user") {
            contents.push({ role: "user", parts: [{ text: msg.text }] });
          } else if (msg.role === "model" || msg.role === "assistant") {
            contents.push({ role: "model", parts: [{ text: msg.text }] });
          }
        }
      }
      contents.push({ role: "user", parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text || "I apologize, I didn't get that. How can I help you automate today?" });
    } catch (err: any) {
      console.error("Gemini Error:", err);
      res.status(500).json({ error: err.message || "Something went wrong in the AI engine" });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("FATAL: Express server failed to start:", err);
});
