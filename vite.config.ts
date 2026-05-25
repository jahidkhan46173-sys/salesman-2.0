import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

function apiFallbackPlugin() {
  return {
    name: 'api-fallback',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        // Only handle active /api routes
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const LEADS_FILE = path.join(process.cwd(), "data", "leads.json");

        // GET /api/leads
        if (req.method === 'GET' && req.url === '/api/leads') {
          res.setHeader('Content-Type', 'application/json');
          try {
            if (fs.existsSync(LEADS_FILE)) {
              const data = fs.readFileSync(LEADS_FILE, 'utf-8');
              res.end(data);
            } else {
              res.end(JSON.stringify([]));
            }
          } catch (e) {
            res.end(JSON.stringify([]));
          }
          return;
        }

        // POST /api/leads
        if (req.method === 'POST' && req.url === '/api/leads') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              const { name, businessName, phone, email, message, service } = payload;
              
              if (!name || !phone) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "Name and Phone Number are required." }));
                return;
              }

              let leads = [];
              if (fs.existsSync(LEADS_FILE)) {
                try {
                  leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8'));
                } catch (_) {}
              }

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

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, lead: newLead }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: "Could not record lead registration." }));
            }
          });
          return;
        }

        // POST /api/gemini/chat
        if (req.method === 'POST' && req.url === '/api/gemini/chat') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });
          req.on('end', async () => {
            res.setHeader('Content-Type', 'application/json');
            try {
              const payload = JSON.parse(body);
              const { message, history } = payload;
              if (!message) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "Message is required" }));
                return;
              }

              const apiKey = process.env.GEMINI_API_KEY;
              if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
                res.end(JSON.stringify({
                  text: `⚡ **Welcome to the Salesman 2.0 Briefing Room!**\n\nI am running in **Demo Mode** since the \`GEMINI_API_KEY\` hasn't been added to the application settings. However, let me brief you on how we can skyrocket your business:\n\n1. 📞 **Outbound AI Voice Agents**: We deploy conversational phone models that make 500+ qualifying calls per hour, booking qualified prospects into your calendar 24/7.\n2. 💬 **WhatsApp CRM Flows**: Automated conversational onboarding and lead nurtures operating entirely on autopilot.\n3. 🎯 **Predictive Ad Campaigns**: Smart Facebook & Instagram funnels that feed high-intent leads straight to your CRM.\n\nOur packages start at just **₹4,999/month**. Try booking a mockup demo under the Contact form or select a plan to view secure UPI checkout instructions!`,
                  isDemo: true
                }));
                return;
              }

              const { GoogleGenAI } = await import("@google/genai");
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

              res.end(JSON.stringify({ text: response.text || "I apologize, I didn't get that. How can I help you automate today?" }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message || "Something went wrong in the AI engine" }));
            }
          });
          return;
        }

        // GET /api/health
        if (req.method === 'GET' && req.url === '/api/health') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: "ok", time: new Date().toISOString() }));
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiFallbackPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
