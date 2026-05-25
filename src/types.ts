export interface Lead {
  id: string;
  name: string;
  businessName: string;
  phone: string;
  email: string;
  message: string;
  service: string;
  createdAt: string;
  status: "New" | "Contacted" | "Qualified" | "Demo Scheduled";
}

export interface ChatMessage {
  id: string;
  role: "user" | "model" | "assistant";
  text: string;
  timestamp: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  detailedPoints: string[];
  metrics: string;
  iconName: string; // We map string to Lucide Icons
  demoType: "chat" | "voice" | "ads" | "content" | "automation" | "website" | "whatsapp" | "leads";
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  text: string;
  glowColor: string;
}

export interface PricingPlan {
  name: string;
  priceINR: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  glowClass: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}
