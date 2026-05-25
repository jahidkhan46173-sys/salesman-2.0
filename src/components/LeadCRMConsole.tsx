import React, { useState, useEffect } from "react";
import { Users, Mail, Phone, Calendar, ArrowRight, ShieldCheck, Clock, RefreshCw } from "lucide-react";
import { Lead } from "../types";

export default function LeadCRMConsole() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/leads");
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
        setError(null);
      } else {
        throw new Error(`Server returned status ${response.status}`);
      }
    } catch (err: any) {
      console.error("Error loading leads:", err);
      setError(err?.message || "Failed to fetch");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    // Poll for new leads every 8 seconds
    const interval = setInterval(fetchLeads, 8000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "New":
        return <span className="bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase">NEW LEAD</span>;
      default:
        return <span className="bg-green-950/40 border border-green-500/30 text-green-300 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase">COMPLETE</span>;
    }
  };

  return (
    <div className="w-full rounded-2xl glassmorphism border border-white/5 overflow-hidden shadow-2xl font-sans" id="crm-lead-console">
      {/* Dashboard Top Header */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0e122b]/40 to-[#020205] border-b border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-indigo-400" />
            <h3 className="font-display font-bold text-white text-lg tracking-tight">Active Inbound CRM Leads</h3>
          </div>
          <p className="text-xs text-slate-400">
            Real-time lead monitoring powered by Salesman 2.0 automation pipelines.
          </p>
        </div>
        
        <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
          <button
            onClick={fetchLeads}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 text-xs bg-white/5 hover:bg-white/10 text-slate-200 active:scale-95 px-3 py-1.5 rounded-lg border border-white/5 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-indigo-400" : ""}`} />
            Refresh Portal
          </button>
          
          <div className="flex items-center gap-1.5 text-xs bg-green-500/10 text-green-400 px-3 py-1.5 rounded-lg border border-green-500/20">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Capture Active
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="p-5 sm:p-6">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-gray-400">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-mono text-purple-300/60">Booting secure lead tunnel...</p>
          </div>
        ) : error ? (
          <div className="py-12 px-6 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-xl bg-red-950/45 border border-red-500/20 flex items-center justify-center text-red-400 mb-4 animate-pulse">
              <span className="text-lg">⚠️</span>
            </div>
            <p className="font-display font-medium text-white mb-1 text-sm">Tunnel Offline</p>
            <p className="text-xs text-red-300/70 mb-5 leading-normal">
              {error.includes("Failed to fetch") 
                ? "Failed to synchronize leads from server. The full-stack engine might still be starting up." 
                : error}
            </p>
            <button
              onClick={() => {
                setIsLoading(true);
                fetchLeads();
              }}
              className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium border border-purple-500/20 rounded-lg px-3.5 py-1.5 bg-purple-500/5 hover:bg-purple-500/10 cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : leads.length === 0 ? (
          <div className="py-12 px-6 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 animate-bounce">
              <Users className="w-6 h-6" />
            </div>
            <p className="font-display font-medium text-white mb-1 text-sm">No Active User Leads Yet</p>
            <p className="text-xs text-gray-400 mb-5 leading-normal">
              Any contact query or demo request submitted on this page is immediately synchronized server-side and pops up in this central database stream.
            </p>
            <a
              href="#contact-section"
              className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium border border-purple-500/20 rounded-lg px-3.5 py-1.5 bg-purple-500/5 hover:bg-purple-500/10"
            >
              Submit Test Submission <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[11px] text-gray-400 font-mono tracking-wider uppercase bg-white/2">
                  <th className="py-3 px-4 font-medium">Client Info</th>
                  <th className="py-3 px-4 font-medium">Business / Goal</th>
                  <th className="py-3 px-4 font-medium">Contact Channel</th>
                  <th className="py-3 px-4 font-medium">Selected Service</th>
                  <th className="py-3 px-4 font-medium text-right">Trench</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/2 transition-colors text-sm">
                    {/* User profile details */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white font-sans">{lead.name}</span>
                        <span className="text-[11px] text-gray-500 font-mono flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 shrink-0" />
                          {new Date(lead.createdAt).toLocaleDateString()} @ {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    
                    {/* Business description */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col max-w-[200px]">
                        <span className="text-gray-200 font-medium truncate">{lead.businessName}</span>
                        <span className="text-xs text-gray-400 truncate mt-0.5 italic">"{lead.message}"</span>
                      </div>
                    </td>
                    
                    {/* Access credentials */}
                    <td className="py-4 px-4 font-mono text-xs">
                      <div className="flex flex-col space-y-0.5">
                        <div className="flex items-center gap-1 text-purple-300">
                          <Phone className="w-3 h-3 shrink-0" />
                          <span>{lead.phone}</span>
                        </div>
                        {lead.email !== "N/A" && (
                          <div className="flex items-center gap-1 text-gray-400">
                            <Mail className="w-3 h-3 shrink-0" />
                            <span>{lead.email}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* Active target service */}
                    <td className="py-4 px-4">
                      <span className="inline-block bg-indigo-950/50 border border-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-md text-xs font-medium">
                        {lead.service}
                      </span>
                    </td>
                    
                    {/* Check Status */}
                    <td className="py-4 px-4 text-right">
                      {getStatusBadge(lead.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Trust Badging Footer */}
      <div className="px-5 py-3 bg-black/40 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-sans">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span>Server Database Protected by SSL & AES-256 Block Storage</span>
        </div>
        <span className="text-[10px] text-gray-500 font-mono">
          ENDPOINT: SECURE_LEAD_RECEIVER_2.0
        </span>
      </div>
    </div>
  );
}
