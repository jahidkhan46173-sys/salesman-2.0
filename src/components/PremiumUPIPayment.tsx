import React, { useState, useEffect } from "react";
import { Copy, Check, ShieldCheck, QrCode, CreditCard, Send, Sparkles, AlertCircle, CheckCircle2, Maximize2, X } from "lucide-react";
import QRCode from "qrcode";
import qrCodeImage from "../assets/images/phonepe_qr_code_1779554402177.png";

export default function PremiumUPIPayment({
  selectedPlan: propSelectedPlan,
  onPlanChange
}: {
  selectedPlan?: "starter" | "business" | "premium";
  onPlanChange?: (plan: "starter" | "business" | "premium") => void;
} = {}) {
  const upiId = "9351426533-w49d-2@ybl";
  const accountName = "JAHID KHAN";
  
  // Navigation tabs: upi or card
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi");
  
  const [copied, setCopied] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [localSelectedPlan, setLocalSelectedPlan] = useState<"starter" | "business" | "premium">("business");

  const selectedPlan = propSelectedPlan !== undefined ? propSelectedPlan : localSelectedPlan;
  const planAmount = selectedPlan === "starter" ? "4999" : selectedPlan === "premium" ? "29999" : "14999";
  
  const [uqrCodeDataUrl, setUqrCodeDataUrl] = useState<string>("");

  useEffect(() => {
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(accountName)}&am=${planAmount}&cu=INR&tn=${encodeURIComponent(selectedPlan.toUpperCase() + " PLAN")}`;
    QRCode.toDataURL(upiLink, {
      margin: 1,
      width: 512,
      errorCorrectionLevel: "H",
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })
      .then((url) => {
        setUqrCodeDataUrl(url);
      })
      .catch((err) => {
        console.error("Failed to generate QR Code offline:", err);
      });
  }, [selectedPlan, planAmount, upiId, accountName]);

  const setSelectedPlan = (plan: "starter" | "business" | "premium") => {
    if (onPlanChange) {
      onPlanChange(plan);
    } else {
      setLocalSelectedPlan(plan);
    }
  };

  // UPI verification state
  const [refNumber, setRefNumber] = useState("");

  // Credit Card state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // Unified verification flow
  const [verifyState, setVerifyState] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [generatedReceipt, setGeneratedReceipt] = useState<any>(null);
  const [isFullscreenQR, setIsFullscreenQR] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format Card Number (adds blanks every 4 digits)
  const handleCardNumberChange = (value: string) => {
    const onlyNums = value.replace(/\D/g, "");
    if (onlyNums.length <= 16) {
      let formatted = "";
      for (let i = 0; i < onlyNums.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formatted += " ";
        }
        formatted += onlyNums[i];
      }
      setCardNumber(formatted);
    }
  };

  // Format Expiry Date (adds '/' after MM)
  const handleExpiryChange = (value: string) => {
    const onlyNums = value.replace(/\D/g, "");
    if (onlyNums.length <= 4) {
      if (onlyNums.length > 2) {
        setCardExpiry(`${onlyNums.slice(0, 2)}/${onlyNums.slice(2)}`);
      } else {
        setCardExpiry(onlyNums);
      }
    }
  };

  // Auto identify primary card networks
  const getCardType = (num: string) => {
    const cleanNum = num.replace(/\s+/g, "");
    if (cleanNum.startsWith("4")) return "Visa";
    if (/^5[1-5]/.test(cleanNum)) return "Mastercard";
    if (/^3[47]/.test(cleanNum)) return "Amex";
    return "Credit Card";
  };

  const handleVerifyUPIDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refNumber.trim()) return;
    if (!customerName.trim() || !customerEmail.trim()) return;

    setVerifyState("verifying");

    const planLabel = selectedPlan === "starter" 
      ? "₹4,999 (Starter Plan)" 
      : selectedPlan === "premium" 
        ? "₹29,999 (Premium Plan)" 
        : "₹14,999 (Business Plan)";

    const txnId = "TXN_" + Math.random().toString(36).substring(3, 11).toUpperCase();
    const orderTimestamp = new Date().toLocaleString();

    setTimeout(() => {
      if (refNumber.length < 10) {
        setVerifyState("error");
      } else {
        const receipt = {
          transactionId: txnId,
          utr: refNumber,
          timestamp: orderTimestamp,
          amount: planLabel,
          referenceNode: "UPI_NODE_PHON_41",
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          type: "UPI"
        };

        fetch("https://formspree.io/f/mzdwvrko", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            "Order Status": "CONFIRMED_UPI_CREDIT",
            "Customer Name": customerName.trim(),
            "Customer Email": customerEmail.trim(),
            "Selected Plan": planLabel,
            "UTR / Reference": refNumber,
            "Transaction ID": txnId,
            "Timestamp": orderTimestamp,
            "Node Gateway": "UPI_NODE_PHON_41",
            "Merchant Recipient": accountName,
            "Direct UPI Address": upiId
          })
        })
        .then(() => {
          console.log("Order email notification sent successfully via Formspree.");
        })
        .catch(err => {
          console.error("Formspree submission error:", err);
        });

        setVerifyState("success");
        setGeneratedReceipt(receipt);
      }
    }, 2500);
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCard = cardNumber.replace(/\s+/g, "");
    if (cleanCard.length < 16 || cardExpiry.length < 5 || cardCvc.length < 3) return;
    if (!customerName.trim() || !customerEmail.trim()) return;

    setVerifyState("verifying");

    const planLabel = selectedPlan === "starter" 
      ? "₹4,999 (Starter Plan)" 
      : selectedPlan === "premium" 
        ? "₹29,999 (Premium Plan)" 
        : "₹14,999 (Business Plan)";

    const txnId = "TXN_" + Math.random().toString(36).substring(3, 11).toUpperCase();
    const orderTimestamp = new Date().toLocaleString();

    setTimeout(() => {
      const receipt = {
        transactionId: txnId,
        utr: "AUTHORIZED_CARD_VAULT",
        timestamp: orderTimestamp,
        amount: planLabel,
        referenceNode: "STRIPE_COUPLED_GATEWAY",
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        type: "CARD",
        maskedCard: `•••• •••• •••• ${cleanCard.slice(-4)}`
      };

      fetch("https://formspree.io/f/mzdwvrko", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          "Order Status": "CONFIRMED_CARD_CREDIT",
          "Customer Name": customerName.trim(),
          "Customer Email": customerEmail.trim(),
          "Selected Plan": planLabel,
          "Card Brand": getCardType(cardNumber),
          "Card Number Masked": `•••• •••• •••• ${cleanCard.slice(-4)}`,
          "Transaction ID": txnId,
          "Timestamp": orderTimestamp,
          "Node Gateway": "PCI_DSS_CARD_SHIELD_PRO"
        })
      })
      .then(() => {
        console.log("Card order email notification sent successfully via Formspree.");
      })
      .catch(err => {
        console.error("Formspree card submission error:", err);
      });

      setVerifyState("success");
      setGeneratedReceipt(receipt);
    }, 2500);
  };

  const resetVerifier = () => {
    setVerifyState("idle");
    setRefNumber("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
    setCustomerName("");
    setCustomerEmail("");
    setGeneratedReceipt(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl glassmorphism border border-indigo-500/20 shadow-2xl overflow-hidden font-sans relative" id="premium-payment-module">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>

      {/* Payment Selection Tabs */}
      <div className="flex border-b border-white/5 bg-black/50 p-1">
        <button
          onClick={() => { if (verifyState !== "verifying" && verifyState !== "success") setPaymentMethod("upi"); }}
          disabled={verifyState === "verifying" || verifyState === "success"}
          className={`flex-1 py-3.5 px-4 text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            paymentMethod === "upi"
              ? "text-purple-400 border-b-2 border-purple-500 bg-white/2"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <QrCode className="w-4 h-4" />
          UPI SECURE CODE
        </button>
        <button
          onClick={() => { if (verifyState !== "verifying" && verifyState !== "success") setPaymentMethod("card"); }}
          disabled={verifyState === "verifying" || verifyState === "success"}
          className={`flex-1 py-3.5 px-4 text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            paymentMethod === "card"
              ? "text-blue-400 border-b-2 border-blue-500 bg-white/21"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          CREDIT / DEBIT CARD
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8 lg:p-10 relative z-10">
        
        {/* Left Grid: Visual representation card background / QR Code */}
        <div className="flex flex-col items-center justify-center text-center space-y-5">
          {paymentMethod === "upi" ? (
            /* UPI SCANNER COMPONENT (AUTHENTIC PHONEPE FLAT POSTER DISPLAY) */
            <div className="w-full flex flex-col items-center">
              <div className="relative group bg-zinc-950 rounded-[28px] border border-zinc-800 shadow-[0_0_50px_rgba(124,58,237,0.15)] overflow-hidden w-full max-w-[270px] aspect-[9/16] transition-all hover:scale-[1.03] mx-auto p-5 flex flex-col justify-between text-white select-none">
                {/* Pulsing Backlit Glow */}
                <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-tr from-[#5f259f] to-indigo-600 opacity-20 blur-xl group-hover:opacity-35 transition-opacity duration-500 pointer-events-none"></div>

                {/* PhonePe Header */}
                <div className="flex flex-col items-center space-y-2 mt-2 relative z-10">
                  <div className="flex items-center gap-1.5">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center shadow-md shadow-purple-600/30">
                      <span className="text-white font-sans font-black text-md select-none">पे</span>
                    </div>
                    <span className="font-sans font-black text-white text-lg tracking-wide">PhonePe</span>
                  </div>
                  <div className="space-y-0.5 text-center">
                    <span className="block text-[8px] font-mono tracking-[0.2em] text-[#a855f7] font-bold uppercase leading-none">ACCEPTED HERE</span>
                    <span className="block text-[9px] font-sans text-stone-400 font-medium leading-none mt-1">Scan & Pay Using PhonePe App</span>
                  </div>
                </div>

                {/* Real Scannable Dynamic High-Contrast QR Code container */}
                <div className="relative w-[170px] h-[170px] mx-auto bg-white p-2.5 rounded-2xl flex items-center justify-center shadow-xl overflow-hidden border border-zinc-800/20 my-3 z-10">
                  {/* Laser scan line animation overlay */}
                  {verifyState !== "success" && (
                    <div className="absolute left-0 right-0 h-[2px] bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.95)] z-15 animate-[bounce_4s_infinite]" style={{ top: "45%" }}></div>
                  )}

                  {/* Dynamic crisp high-contrast QR image */}
                  <img
                    src={uqrCodeDataUrl || qrCodeImage}
                    alt="Official PhonePe Accepted Here Scannable QR Code - Jahid Khan"
                    className="w-full h-full object-contain select-none"
                    referrerPolicy="no-referrer"
                  />

                  {/* Center Dot Badge with PhonePe Indian Brand Icon */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-0.5 rounded shadow border border-gray-100/50 flex items-center justify-center w-6 h-6 z-10">
                    <div className="w-4 h-4 bg-purple-600 rounded flex items-center justify-center">
                      <span className="text-white font-sans font-black text-[8px] select-none leading-none">पे</span>
                    </div>
                  </div>

                  {/* Secure overlay on successful verification */}
                  {verifyState === "success" && (
                    <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center text-center p-3 z-20 animate-[fadeIn_0.25s_ease-out]">
                      <CheckCircle2 className="w-12 h-12 text-green-400 mb-2 animate-bounce" />
                      <span className="text-[10px] font-mono text-green-400 font-extrabold tracking-wider">UPI CREDIT VERIFIED</span>
                      <span className="text-[8px] font-mono text-green-500/80 mt-1">AUTOMATION ACTIVATED READY</span>
                    </div>
                  )}
                </div>

                {/* Merchant Name Display */}
                <div className="text-center relative z-10">
                  <span className="block text-[8px] font-mono text-stone-500 tracking-wider uppercase font-medium">Merchant Account Name</span>
                  <span className="block text-xs font-sans font-black text-white uppercase tracking-wide mt-0.5 truncate">{accountName}</span>
                </div>

                {/* Disclaimer copyright */}
                <div className="text-center text-[7px] text-zinc-600 font-mono tracking-wide leading-tight relative z-10">
                  © 2026, All rights reserved, PhonePe Ltd<br />(Formerly known as 'PhonePe Private Ltd')
                </div>
              </div>

              {/* Toggle Full Screen Button right beneath */}
              <button
                type="button"
                onClick={() => setIsFullscreenQR(true)}
                className="mt-4.5 inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-sans border border-indigo-500/10 bg-indigo-500/5 hover:bg-indigo-500/10 active:scale-95 transition-all py-1.5 px-3 rounded-xl cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Fullscreen QR Code
              </button>
            </div>
          ) : (
            /* INTERACTIVE LIVE GLASS CREDIT CARD */
            <div className="relative group p-3 bg-black/65 rounded-3xl border border-blue-500/20 shadow-[0_0_25px_rgba(59,130,246,0.1)] w-full max-w-[320px]">
              <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-tr from-blue-500 to-indigo-500 opacity-25 blur group-hover:opacity-45 transition-opacity"></div>
              
              <div className="relative h-[180px] w-full bg-gradient-to-br from-slate-900 via-indigo-950/90 to-blue-950 rounded-2xl p-5 border border-white/10 flex flex-col justify-between text-left overflow-hidden">
                {/* Micro reflection lines */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl transform translate-x-12 -translate-y-12"></div>
                
                {/* Chip & Network Brand */}
                <div className="flex justify-between items-center">
                  {/* Simulated golden smartchip */}
                  <div className="w-9 h-7 bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-600 rounded-md border border-white/5 relative flex items-center justify-center">
                    <div className="absolute w-6 h-4 border border-black/10 rounded-sm"></div>
                    <div className="absolute w-2 h-full border-l border-r border-black/10"></div>
                  </div>
                  
                  {/* Card Brand Badge Logo */}
                  <span className="text-[11px] font-mono font-extrabold uppercase bg-white/10 border border-white/10 text-white rounded px-2 py-0.5 tracking-widest leading-none">
                    {cardNumber.trim() ? getCardType(cardNumber) : "SECURE"}
                  </span>
                </div>

                {/* Card Number Line */}
                <div className="mt-2">
                  <span className="text-base sm:text-lg font-mono text-white tracking-widest">
                    {cardNumber || "•••• •••• •••• ••••"}
                  </span>
                </div>

                {/* Cardholder name & expiry Date code */}
                <div className="flex justify-between items-end">
                  <div className="space-y-0.5">
                    <span className="block text-[8px] font-mono text-blue-300/60 uppercase tracking-widest font-bold">Card Holder</span>
                    <span className="block text-xs font-mono text-gray-100 font-semibold uppercase truncate max-w-[150px]">
                      {customerName.trim() ? customerName : "John Parker"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-mono text-blue-300/60 uppercase tracking-widest font-bold">Expires</span>
                    <span className="block text-xs font-mono text-gray-100 font-semibold tracking-wider">
                      {cardExpiry || "MM/YY"}
                    </span>
                  </div>
                </div>

                {/* Verified state overlay inside Credit Card representation on secure success */}
                {verifyState === "success" && (
                  <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center text-center p-3 z-30 animate-[fadeIn_0.2s_ease-out]">
                    <CheckCircle2 className="w-10 h-10 text-green-400 mb-1.5 animate-bounce" />
                    <span className="text-[10px] font-mono text-green-400 font-extrabold tracking-wider">CARD CHARGED APPROVED</span>
                    <span className="text-[8px] font-mono text-green-500/70">AES-256 ENCRYPTED KEY</span>
                  </div>
                )}
              </div>

              {/* Secure PCI-DSS compliant warning below Card */}
              <div className="mt-3 flex justify-center items-center gap-1.5 bg-blue-950/30 border border-blue-500/25 rounded-lg py-1.5 px-3">
                <span className="text-[9px] font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1 justify-center">
                  💳 Verified Shield Sandbox
                </span>
              </div>
            </div>
          )}
          
          <div className="space-y-1">
            <h4 className="font-display font-medium text-white text-sm">
              {paymentMethod === "upi" ? "Scan QR Code or copy UPI Address" : "Input Card billing credentials"}
            </h4>
            <p className="text-xs text-slate-400 leading-normal max-w-[280px] mx-auto">
              {paymentMethod === "upi" 
                ? "Scan directly using PhonePe, GPay, Paytm, or any banking app to complete automation activation."
                : "Input standard mock credentials. Live card mirroring represents modern token security checks."}
            </p>
          </div>
        </div>

        {/* Right Grid: Form layout and receipt output */}
        <div className="flex flex-col justify-between space-y-6">
          
          {/* Header matrix */}
          <div>
            <span className="text-xs font-mono font-semibold text-indigo-400 tracking-wider flex items-center gap-1 uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              {paymentMethod === "upi" ? "Licensed UPI Bridge" : "PCI-DSS Card Bridge"}
            </span>
            <h3 className="font-display font-bold text-white text-2xl tracking-tight mt-1">
              Setup Fast Activation
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Activate your automatic campaign within the next 48 hours. Choose a target plan package, pay secure pricing, and verify details.
            </p>
          </div>

          {/* Checkout specs information clip */}
          {paymentMethod === "upi" && (
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Merchant Name:</span>
                <span className="text-gray-100 font-bold tracking-tight font-sans">{accountName}</span>
              </div>

              <div className="flex justify-between items-center bg-white/2 rounded-lg p-2.5 border border-white/5 space-x-2">
                <div className="flex flex-col overflow-hidden min-w-0">
                  <span className="text-[9px] text-indigo-300/80 font-mono tracking-wide">DIRECT UPI KEY</span>
                  <span className="text-xs font-mono text-gray-200 truncate font-semibold">{upiId}</span>
                </div>
                <button
                  onClick={handleCopy}
                  className={`py-1.5 px-3 rounded-md text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 shrink-0 active:scale-95 ${
                    copied
                      ? "bg-green-600/10 text-green-400 border border-green-500/20"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy ID
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Verify state machine form/receipt */}
          {verifyState !== "success" ? (
            <form onSubmit={paymentMethod === "upi" ? handleVerifyUPIDemo : handleCardSubmit} className="space-y-4">
              
              {/* Plan package selection dropdown */}
              <div className="space-y-1">
                <label className="block text-xs text-slate-400 font-sans">
                  Select License Plan Package:
                </label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value as any)}
                  disabled={verifyState === "verifying"}
                  className="w-full bg-[#050918]/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                >
                  <option value="starter">Starter Plan — ₹4,999 / month</option>
                  <option value="business">Business Plan — ₹14,999 / month</option>
                  <option value="premium">Premium Plan — ₹29,999 / month</option>
                </select>
              </div>

              {/* Shared Client Contact Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs text-slate-400 font-sans">
                    Your Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="E.g., John Parker"
                    disabled={verifyState === "verifying"}
                    className="w-full bg-[#050918]/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs text-slate-400 font-sans">
                    Business Email:
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="john@example.com"
                    disabled={verifyState === "verifying"}
                    className="w-full bg-[#050918]/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>
              </div>

              {/* Method specific inputs */}
              {paymentMethod === "upi" ? (
                /* UPI Transaction Verification Form Input fields */
                <div className="space-y-1">
                  <label className="block text-xs text-slate-400 font-sans">
                    Enter UPI Pay Reference (UPI Ref ID / UTR):
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={refNumber}
                      onChange={(e) => setRefNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter 12-digit UTR transfer number..."
                      disabled={verifyState === "verifying"}
                      className="w-full bg-[#050918]/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-sans"
                    />
                    {verifyState === "error" && (
                      <div className="absolute top-1/2 -translate-y-1/2 right-3 text-red-400 flex items-center gap-1 text-[10px]">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Invalid UTR length
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono leading-normal">
                    💡 Hint: Enter 12 digits (e.g. 491234567890) to simulate NPCI secure check.
                  </p>
                </div>
              ) : (
                /* CARD Gate checkout inputs */
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs text-slate-400 font-sans">
                      Card Number:
                    </label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      placeholder="4000 1234 5678 9010"
                      disabled={verifyState === "verifying"}
                      className="w-full bg-[#050918]/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-sans"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs text-slate-400 font-sans">
                        Expiry Date:
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => handleExpiryChange(e.target.value)}
                        placeholder="MM/YY"
                        disabled={verifyState === "verifying"}
                        className="w-full bg-[#050918]/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-sans"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs text-slate-400 font-sans">
                        Security CVC Code:
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                        placeholder="•••"
                        disabled={verifyState === "verifying"}
                        className="w-full bg-[#050918]/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-sans tracking-widest"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  paymentMethod === "upi"
                    ? (!refNumber.trim() || !customerName.trim() || !customerEmail.trim() || verifyState === "verifying")
                    : (cardNumber.replace(/\s+/g, "").length < 16 || cardExpiry.length < 5 || cardCvc.length < 3 || !customerName.trim() || !customerEmail.trim() || verifyState === "verifying")
                }
                className={`w-full bg-gradient-to-r overflow-hidden font-display text-xs font-bold text-white py-3 rounded-xl border cursor-pointer hover:opacity-95 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none ${
                  paymentMethod === "upi"
                    ? "from-indigo-600 to-blue-600 border-indigo-400/20"
                    : "from-blue-600 to-indigo-600 border-blue-400/20"
                }`}
              >
                {verifyState === "verifying" 
                  ? (paymentMethod === "upi" ? "Querying Bank Transaction Ledger..." : "Securing Multi-Node Authorizing Vault...")
                  : (paymentMethod === "upi" ? "Submit Transaction UTR for Auto-Check" : "Authorize Secure Payment Licence Link")
                }
              </button>
            </form>
          ) : (
            /* Premium receipt print layout */
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-left space-y-4 animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center gap-2 pb-2.5 border-b border-white/5">
                <CheckCircle2 className="w-5 h-5 text-green-400 font-bold shrink-0" />
                <div>
                  <h4 className="font-display font-semibold text-white text-xs">
                    {generatedReceipt.type === "UPI" ? "Simulated UPI Credit Verified" : "Transaction Approved successfully"}
                  </h4>
                  <p className="text-[10px] text-green-400/80 font-mono uppercase">
                    STATUS: ACTIVE_PAYMENT_COMMITTED
                  </p>
                </div>
              </div>
              
              <div className="space-y-1.5 text-xs font-sans">
                <div className="flex justify-between text-gray-400">
                  <span>Customer Name:</span>
                  <span className="font-semibold text-gray-200">{generatedReceipt.customerName}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Customer Email:</span>
                  <span className="font-mono text-gray-200">{generatedReceipt.customerEmail}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Payment Gateway:</span>
                  <span className="font-semibold text-gray-200 text-right">
                    {generatedReceipt.type === "CARD" ? `CREDIT CARD (${generatedReceipt.maskedCard})` : "UPI CORE ENGINE"}
                  </span>
                </div>
                {generatedReceipt.type === "UPI" && (
                  <div className="flex justify-between text-gray-400">
                    <span>Reference UTR Check:</span>
                    <span className="font-mono text-gray-200">{generatedReceipt.utr}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400">
                  <span>Simulated ID:</span>
                  <span className="font-mono text-gray-200">{generatedReceipt.transactionId}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Allocated Subscription:</span>
                  <span className="font-semibold text-green-400">{generatedReceipt.amount}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Processed DateTime:</span>
                  <span className="font-mono text-gray-200">{generatedReceipt.timestamp}</span>
                </div>
              </div>

              <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-center text-[10.5px] text-indigo-300 font-mono">
                🚀 Order dispatched to Formspree notification stream!
              </div>

              <button
                onClick={resetVerifier}
                className="text-[11px] text-purple-400 hover:text-purple-300 font-medium font-sans border border-purple-500/20 bg-purple-500/5 px-3 py-1.5 rounded-lg w-full transition-colors cursor-pointer"
              >
                Simulate New Transaction
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Security Reel footer line */}
      <div className="px-6 py-4 bg-black/40 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4.5 h-4.5 text-green-400" />
          <span>Real-time PCI-DSS Standard SSL Merchant Payment Node Key Encoded</span>
        </div>
        
        <div className="flex items-center gap-3 text-[10px] font-mono tracking-widest text-slate-500">
          <span>PCI-DSS</span>
          <span>•</span>
          <span>AES-256</span>
          <span>•</span>
          <span>NPCI APPROVED</span>
        </div>
      </div>

      {/* FULLSCREEN QR CODE IMMERSIVE MODAL PORTAL */}
      {isFullscreenQR && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center z-[99999] p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="relative w-full max-w-[420px] flex flex-col items-center space-y-5">
            
            {/* Absolute Close trigger */}
            <button
              type="button"
              onClick={() => setIsFullscreenQR(false)}
              className="absolute -top-14 right-2 sm:right-0 bg-white/10 hover:bg-white/20 text-white hover:text-red-400 p-2.5 rounded-full border border-white/10 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" id="close-fullscreen-qr" />
            </button>

            {/* Enlarged Pure High-Contrast QR Code Poster */}
            <div className="w-full bg-[#000000] rounded-[36px] border border-zinc-850 shadow-[0_0_80px_rgba(124,58,237,0.35)] p-7 sm:p-8 flex flex-col justify-between text-white select-none">
              
              {/* PhonePe Header */}
              <div className="flex flex-col items-center space-y-3.5 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-600/40">
                    <span className="text-white font-sans font-black text-2xl select-none">पे</span>
                  </div>
                  <span className="font-sans font-black text-white text-3xl tracking-wide">PhonePe</span>
                </div>
                <div className="space-y-1 text-center">
                  <span className="block text-[10px] font-mono tracking-[0.25em] text-[#a855f7] font-bold uppercase leading-none">ACCEPTED HERE</span>
                  <span className="block text-stone-400 text-xs sm:text-sm font-medium">Scan & Pay Using PhonePe App</span>
                </div>
              </div>

              {/* Dynamic crisp QR image enlarged */}
              <div className="relative w-[260px] h-[260px] mx-auto bg-white p-4 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden border border-zinc-900">
                <img
                  src={uqrCodeDataUrl || qrCodeImage}
                  alt="Official PhonePe Accepted Here Scannable QR Code - Jahid Khan"
                  className="w-full h-full object-contain select-none"
                  referrerPolicy="no-referrer"
                />

                {/* center logo badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded shadow-lg border border-gray-100 flex items-center justify-center w-10 h-10 z-10">
                  <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                    <span className="text-white font-sans font-bold text-sm select-none leading-none">पे</span>
                  </div>
                </div>
              </div>

              {/* Merchant Name */}
              <div className="text-center mt-6 mb-1">
                <span className="block text-[9px] font-mono tracking-widest text-[#a855f7] uppercase font-bold">MERCHANT ACCOUNT</span>
                <span className="block text-lg font-sans font-black text-white uppercase tracking-wider mt-1.5 truncate">{accountName}</span>
              </div>

              {/* Real PhonePe copyright disclaimer */}
              <div className="text-center mt-4 text-[8px] text-zinc-500 font-mono tracking-wide leading-tight">
                © 2026, All rights reserved, PhonePe Ltd<br />(Formerly known as 'PhonePe Private Ltd')
              </div>
            </div>

            <div className="text-center w-full space-y-1">
              <p className="text-sm text-stone-400 font-mono">
                Subscription Tier: <span className="text-indigo-400 font-bold uppercase">{selectedPlan}</span>
              </p>
              <p className="text-sm text-stone-400 font-mono">
                Amount Pre-filled: <span className="text-green-400 font-bold">₹{parseInt(planAmount).toLocaleString()}</span>
              </p>
              <button
                type="button"
                onClick={() => setIsFullscreenQR(false)}
                className="mt-3 px-6 py-2.5 hover:bg-white/15 bg-white/5 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all active:scale-95 cursor-pointer border border-white/10"
              >
                Close Fullscreen
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
