import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, ArrowLeft, Smartphone, CreditCard,
  Building2, Wallet, Lock, ShieldCheck, Loader2
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", emoji: "📱", icon: Smartphone, desc: "Pay via any UPI app" },
  { id: "card", label: "Card", emoji: "💳", icon: CreditCard, desc: "Credit / Debit card" },
  { id: "netbanking", label: "Net Banking", emoji: "🏦", icon: Building2, desc: "All major banks" },
  { id: "wallet", label: "Wallet", emoji: "👛", icon: Wallet, desc: "Paytm, PhonePe & more" },
];

const UPI_APPS = [
  { id: "gpay", name: "Google Pay", color: "from-blue-500 to-green-500", logo: "G" },
  { id: "phonepe", name: "PhonePe", color: "from-purple-600 to-indigo-600", logo: "P" },
  { id: "paytm", name: "Paytm", color: "from-blue-400 to-cyan-500", logo: "P" },
  { id: "bhim", name: "BHIM UPI", color: "from-orange-500 to-red-500", logo: "B" },
];

const BANKS = [
  "State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank",
  "Kotak Mahindra Bank", "Punjab National Bank", "Bank of Baroda", "Canara Bank",
];

const WALLETS = [
  { id: "paytm", name: "Paytm", color: "bg-blue-500" },
  { id: "phonepe", name: "PhonePe", color: "bg-purple-600" },
  { id: "amazonpay", name: "Amazon Pay", color: "bg-orange-500" },
  { id: "mobikwik", name: "MobiKwik", color: "bg-blue-400" },
];

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clear } = useCart();
  const { toast } = useToast();

  const amount = Number(searchParams.get("amount") ?? 0);
  const type = searchParams.get("type") ?? "order";
  const chef = searchParams.get("chef") ?? "";
  const plan = searchParams.get("plan") ?? "";
  const meals = searchParams.get("meals") ?? "";

  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [selectedUpiApp, setSelectedUpiApp] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [orderId] = useState(`SS${Date.now().toString().slice(-8)}`);

  const formatCard = (val: string) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const canPay = () => {
    if (method === "upi") return selectedUpiApp !== "" || upiId.includes("@");
    if (method === "card") return card.number.replace(/\s/g, "").length === 16 && card.name && card.expiry.length === 5 && card.cvv.length === 3;
    if (method === "netbanking") return selectedBank !== "";
    if (method === "wallet") return selectedWallet !== "";
    return false;
  };

  const handlePay = async () => {
    if (!canPay()) { toast({ title: "Please complete payment details", variant: "destructive" }); return; }
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2200));
    if (type !== "tiffin") clear();
    setProcessing(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="container py-16 text-center max-w-md mx-auto">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
          <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-14 w-14 text-green-500" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="text-2xl font-heading font-extrabold mb-1">Payment Successful! 🎉</h1>
          <p className="text-muted-foreground mb-1">₹{amount.toLocaleString("en-IN")} paid successfully</p>
          <p className="text-xs text-muted-foreground mb-6">Order ID: <span className="font-mono font-bold text-foreground">{orderId}</span></p>

          <Card className="border-green-500/20 mb-6 text-left">
            <CardContent className="p-4 space-y-2">
              {type === "tiffin" ? (
                <>
                  <p className="text-sm font-semibold">🍱 Tiffin Subscription Confirmed</p>
                  <p className="text-xs text-muted-foreground">Plan: {plan} · {meals} meals</p>
                  <p className="text-xs text-muted-foreground">Chef will contact you within 2 hours to confirm delivery schedule.</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold">🛒 Order Placed Successfully</p>
                  <p className="text-xs text-muted-foreground">Your food order is confirmed. Estimated delivery: 30–60 mins.</p>
                </>
              )}
              <div className="flex items-center gap-1 mt-2">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-600 font-semibold">Secured by Smart Sakhi Pay</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Link to="/marketplace" className="flex-1">
              <Button variant="outline" className="w-full rounded-xl">Back to Market</Button>
            </Link>
            <Link to="/seller" className="flex-1">
              <Button className="w-full rounded-xl font-bold bg-gradient-to-r from-orange-500 to-primary text-white border-0">My Orders</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-md">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-heading font-extrabold">Secure Payment</h1>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <Lock className="h-3 w-3" /> 256-bit SSL encrypted
          </div>
        </div>
      </div>

      {/* Amount Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-orange-500/10 to-primary/10 border border-orange-500/20 p-4 mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Amount to Pay</p>
          <p className="text-3xl font-heading font-extrabold text-orange-500">₹{amount.toLocaleString("en-IN")}</p>
          {type === "tiffin" && <p className="text-xs text-muted-foreground mt-0.5">{plan} tiffin plan · {meals} meals</p>}
        </div>
        <ShieldCheck className="h-10 w-10 text-green-500 opacity-60" />
      </div>

      {/* Payment Method Tabs */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {PAYMENT_METHODS.map((m) => (
          <button key={m.id} onClick={() => setMethod(m.id)}
            className={`rounded-2xl border-2 p-2.5 text-center transition-all ${
              method === m.id ? "border-orange-500 bg-orange-500/5" : "border-border hover:border-orange-500/30"
            }`}>
            <div className="text-xl mb-1">{m.emoji}</div>
            <p className="text-xs font-semibold">{m.label}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={method} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}>

          {/* UPI */}
          {method === "upi" && (
            <Card className="border-border/50 mb-4">
              <CardContent className="p-5 space-y-4">
                <p className="font-semibold text-sm">Pay via UPI App</p>
                <div className="grid grid-cols-4 gap-2">
                  {UPI_APPS.map((app) => (
                    <button key={app.id} onClick={() => setSelectedUpiApp(app.id)}
                      className={`rounded-2xl border-2 p-2 text-center transition-all ${
                        selectedUpiApp === app.id ? "border-orange-500 bg-orange-500/5" : "border-border hover:border-orange-500/30"
                      }`}>
                      <div className={`h-8 w-8 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center mx-auto mb-1`}>
                        <span className="text-white font-bold text-sm">{app.logo}</span>
                      </div>
                      <p className="text-xs font-semibold leading-tight">{app.name.split(" ")[0]}</p>
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/50" /></div>
                  <div className="relative flex justify-center"><span className="bg-background px-3 text-xs text-muted-foreground">or enter UPI ID</span></div>
                </div>
                <div>
                  <Label className="text-xs">UPI ID</Label>
                  <Input className="mt-1" placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Card */}
          {method === "card" && (
            <Card className="border-border/50 mb-4">
              <CardContent className="p-5 space-y-4">
                <p className="font-semibold text-sm">Credit / Debit Card</p>
                <div>
                  <Label className="text-xs">Card Number</Label>
                  <Input className="mt-1 font-mono tracking-widest" placeholder="1234 5678 9012 3456"
                    value={card.number} onChange={(e) => setCard((c) => ({ ...c, number: formatCard(e.target.value) }))} />
                </div>
                <div>
                  <Label className="text-xs">Cardholder Name</Label>
                  <Input className="mt-1" placeholder="Name on card"
                    value={card.name} onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Expiry (MM/YY)</Label>
                    <Input className="mt-1 font-mono" placeholder="MM/YY"
                      value={card.expiry} onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))} />
                  </div>
                  <div>
                    <Label className="text-xs">CVV</Label>
                    <Input className="mt-1 font-mono" placeholder="•••" maxLength={3} type="password"
                      value={card.cvv} onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) }))} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" /> Your card details are encrypted and secure
                </div>
              </CardContent>
            </Card>
          )}

          {/* Net Banking */}
          {method === "netbanking" && (
            <Card className="border-border/50 mb-4">
              <CardContent className="p-5 space-y-3">
                <p className="font-semibold text-sm">Select Your Bank</p>
                <div className="grid grid-cols-2 gap-2">
                  {BANKS.map((bank) => (
                    <button key={bank} onClick={() => setSelectedBank(bank)}
                      className={`rounded-xl border-2 px-3 py-2.5 text-left text-xs font-semibold transition-all ${
                        selectedBank === bank ? "border-orange-500 bg-orange-500/5 text-orange-600" : "border-border hover:border-orange-500/30"
                      }`}>
                      <Building2 className="h-3 w-3 mb-1 opacity-60" />
                      {bank}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Wallet */}
          {method === "wallet" && (
            <Card className="border-border/50 mb-4">
              <CardContent className="p-5 space-y-3">
                <p className="font-semibold text-sm">Select Wallet</p>
                <div className="grid grid-cols-2 gap-3">
                  {WALLETS.map((w) => (
                    <button key={w.id} onClick={() => setSelectedWallet(w.id)}
                      className={`rounded-2xl border-2 p-3 flex items-center gap-2 transition-all ${
                        selectedWallet === w.id ? "border-orange-500 bg-orange-500/5" : "border-border hover:border-orange-500/30"
                      }`}>
                      <div className={`h-8 w-8 rounded-xl ${w.color} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white font-bold text-xs">{w.name[0]}</span>
                      </div>
                      <span className="text-sm font-semibold">{w.name}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Pay Button */}
      <Button
        size="lg"
        className="w-full rounded-xl font-bold bg-gradient-to-r from-orange-500 to-primary text-white border-0 hover:opacity-90 disabled:opacity-50"
        onClick={handlePay}
        disabled={processing || !canPay()}
      >
        {processing ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" /> Processing Payment...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> Pay ₹{amount.toLocaleString("en-IN")} Securely
          </span>
        )}
      </Button>

      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-green-500" />
        <span>Secured by Smart Sakhi Pay · 100% Safe & Encrypted</span>
      </div>
    </div>
  );
};

export default Payment;
