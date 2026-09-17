import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChefHat, Calendar, CheckCircle, ArrowLeft, ArrowRight,
  Clock, MapPin, Utensils, Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const PLANS = [
  {
    id: "weekly",
    label: "Weekly Plan",
    duration: "7 days",
    emoji: "📅",
    pricePerMeal: 90,
    meals: 7,
    discount: 0,
    popular: false,
    description: "Perfect to try before committing",
  },
  {
    id: "monthly",
    label: "Monthly Plan",
    duration: "30 days",
    emoji: "🗓️",
    pricePerMeal: 80,
    meals: 30,
    discount: 11,
    popular: true,
    description: "Most popular — save 11% per meal",
  },
  {
    id: "quarterly",
    label: "3-Month Plan",
    duration: "90 days",
    emoji: "🏆",
    pricePerMeal: 70,
    meals: 90,
    discount: 22,
    popular: false,
    description: "Best value — save 22% per meal",
  },
];

const MEAL_TYPES = [
  { id: "veg", label: "Veg Only", emoji: "🥦" },
  { id: "nonveg", label: "Non-Veg", emoji: "🍗" },
  { id: "mixed", label: "Mixed", emoji: "🍱" },
];

const DELIVERY_SLOTS = [
  { id: "morning", label: "Morning", time: "7:00 AM – 9:00 AM", emoji: "🌅" },
  { id: "lunch", label: "Lunch", time: "12:00 PM – 1:00 PM", emoji: "☀️" },
  { id: "dinner", label: "Dinner", time: "7:00 PM – 8:00 PM", emoji: "🌙" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CHEF_NAMES: Record<string, string> = {
  "gurpreet-kaur": "Gurpreet Kaur",
  "meenakshi-iyer": "Meenakshi Iyer",
};

const STEPS = ["Plan", "Preferences", "Delivery", "Confirm"];

const TiffinSubscribe = () => {
  const { chefId } = useParams<{ chefId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [step, setStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [mealType, setMealType] = useState("veg");
  const [deliverySlot, setDeliverySlot] = useState("lunch");
  const [activeDays, setActiveDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [address, setAddress] = useState({ line: "", city: "", pincode: "", phone: "" });
  const [startDate, setStartDate] = useState("");
  const [done, setDone] = useState(false);

  const plan = PLANS.find((p) => p.id === selectedPlan)!;
  const slot = DELIVERY_SLOTS.find((s) => s.id === deliverySlot)!;
  const chefName = chefId ? (CHEF_NAMES[chefId] ?? "Home Chef") : "Home Chef";
  const totalMeals = selectedPlan === "weekly" ? activeDays.length : selectedPlan === "monthly" ? activeDays.length * 4 : activeDays.length * 13;
  const totalPrice = totalMeals * plan.pricePerMeal;

  const toggleDay = (day: string) => {
    setActiveDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const validateStep = () => {
    if (step === 2) {
      if (!address.line || !address.city || !address.pincode || !address.phone) return "Please fill all delivery details";
      if (!/^\d{6}$/.test(address.pincode)) return "Pincode must be 6 digits";
      if (!startDate) return "Please select a start date";
    }
    return null;
  };

  const next = () => {
    const err = validateStep();
    if (err) { toast({ title: err, variant: "destructive" }); return; }
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  };

  const handleConfirm = () => {
    navigate(`/payment?amount=${totalPrice}&type=tiffin&chef=${chefId}&plan=${selectedPlan}&meals=${totalMeals}`);
  };

  if (done) {
    return (
      <div className="container py-16 text-center max-w-md mx-auto">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <CheckCircle className="h-20 w-20 mx-auto text-green-500 mb-4" />
        </motion.div>
        <h1 className="text-2xl font-heading font-extrabold mb-2">Subscription Confirmed! 🍱</h1>
        <p className="text-muted-foreground mb-6">Your tiffin subscription with {chefName} starts on {startDate}. You'll receive a confirmation call shortly.</p>
        <Link to="/marketplace"><Button className="rounded-xl font-bold bg-gradient-to-r from-orange-500 to-primary text-white border-0">Back to Marketplace</Button></Link>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate(-1)} className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-heading font-extrabold">Subscribe to Tiffin 🍱</h1>
          <p className="text-sm text-muted-foreground">by {chefName}</p>
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-1 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              i === step ? "bg-gradient-to-r from-orange-500 to-primary text-white" :
              i < step ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
            }`}>
              {i < step ? <CheckCircle className="h-3 w-3" /> : null}
              {s}
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-1 rounded ${i < step ? "bg-green-500" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>

          {/* STEP 0 — Plan Selection */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-heading font-bold text-lg flex items-center gap-2"><Calendar className="h-5 w-5 text-orange-500" /> Choose Your Plan</h2>
              {PLANS.map((p) => (
                <button key={p.id} onClick={() => setSelectedPlan(p.id)}
                  className={`w-full text-left rounded-2xl border-2 p-4 transition-all relative ${
                    selectedPlan === p.id ? "border-orange-500 bg-orange-500/5" : "border-border hover:border-orange-500/40"
                  }`}>
                  {p.popular && (
                    <span className="absolute -top-2.5 left-4 text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-primary text-white font-bold">
                      Most Popular
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{p.emoji}</span>
                      <div>
                        <p className="font-bold">{p.label}</p>
                        <p className="text-xs text-muted-foreground">{p.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-orange-500 font-extrabold text-lg">₹{p.pricePerMeal}<span className="text-xs font-normal text-muted-foreground">/meal</span></p>
                      {p.discount > 0 && <p className="text-xs text-green-600 font-semibold">Save {p.discount}%</p>}
                    </div>
                  </div>
                  {selectedPlan === p.id && <CheckCircle className="absolute top-3 right-3 h-5 w-5 text-orange-500" />}
                </button>
              ))}
            </div>
          )}

          {/* STEP 1 — Meal Preferences */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-heading font-bold text-lg flex items-center gap-2"><Utensils className="h-5 w-5 text-orange-500" /> Meal Preferences</h2>

              <div>
                <p className="font-semibold text-sm mb-3">Meal Type</p>
                <div className="grid grid-cols-3 gap-3">
                  {MEAL_TYPES.map((m) => (
                    <button key={m.id} onClick={() => setMealType(m.id)}
                      className={`rounded-2xl border-2 p-3 text-center transition-all ${
                        mealType === m.id ? "border-orange-500 bg-orange-500/5" : "border-border hover:border-orange-500/40"
                      }`}>
                      <div className="text-2xl mb-1">{m.emoji}</div>
                      <p className="text-xs font-semibold">{m.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-semibold text-sm mb-3">Delivery Days</p>
                <div className="flex gap-2 flex-wrap">
                  {DAYS.map((day) => (
                    <button key={day} onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                        activeDays.includes(day) ? "border-orange-500 bg-orange-500/10 text-orange-600" : "border-border text-muted-foreground hover:border-orange-500/40"
                      }`}>
                      {day}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">{activeDays.length} days/week selected</p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border/50">
                <p className="text-sm font-semibold mb-1">Plan Summary</p>
                <p className="text-xs text-muted-foreground">{plan.label} · {activeDays.length} days/week · {mealType} meals</p>
                <p className="text-orange-500 font-bold mt-1">≈ {totalMeals} meals · ₹{totalPrice.toLocaleString("en-IN")} total</p>
              </div>
            </div>
          )}

          {/* STEP 2 — Delivery Details */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-heading font-bold text-lg flex items-center gap-2"><MapPin className="h-5 w-5 text-orange-500" /> Delivery Details</h2>

              <div>
                <p className="font-semibold text-sm mb-3 flex items-center gap-2"><Clock className="h-4 w-4 text-orange-500" /> Delivery Slot</p>
                <div className="grid grid-cols-3 gap-3">
                  {DELIVERY_SLOTS.map((s) => (
                    <button key={s.id} onClick={() => setDeliverySlot(s.id)}
                      className={`rounded-2xl border-2 p-3 text-center transition-all ${
                        deliverySlot === s.id ? "border-orange-500 bg-orange-500/5" : "border-border hover:border-orange-500/40"
                      }`}>
                      <div className="text-xl mb-1">{s.emoji}</div>
                      <p className="text-xs font-bold">{s.label}</p>
                      <p className="text-xs text-muted-foreground">{s.time}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label>Delivery Address *</Label>
                  <Input className="mt-1" placeholder="House no., Street, Area" value={address.line}
                    onChange={(e) => setAddress((a) => ({ ...a, line: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>City *</Label>
                    <Input className="mt-1" placeholder="City" value={address.city}
                      onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Pincode *</Label>
                    <Input className="mt-1" placeholder="6-digit" maxLength={6} value={address.pincode}
                      onChange={(e) => setAddress((a) => ({ ...a, pincode: e.target.value.replace(/\D/g, "") }))} />
                  </div>
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input className="mt-1" placeholder="10-digit mobile" value={address.phone}
                    onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))} />
                </div>
                <div>
                  <Label>Start Date *</Label>
                  <Input className="mt-1" type="date" value={startDate} min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setStartDate(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Confirm */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-heading font-bold text-lg flex items-center gap-2"><Star className="h-5 w-5 text-orange-500" /> Confirm Subscription</h2>

              <Card className="border-orange-500/20">
                <CardContent className="p-5 space-y-3">
                  {[
                    { label: "Chef", value: chefName },
                    { label: "Plan", value: `${plan.label} (${plan.duration})` },
                    { label: "Meal Type", value: MEAL_TYPES.find(m => m.id === mealType)?.label ?? mealType },
                    { label: "Days", value: activeDays.join(", ") },
                    { label: "Delivery Slot", value: `${slot.label} (${slot.time})` },
                    { label: "Start Date", value: startDate },
                    { label: "Total Meals", value: `${totalMeals} meals` },
                    { label: "Price/Meal", value: `₹${plan.pricePerMeal}` },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="font-semibold text-right max-w-[60%]">{row.value}</span>
                    </div>
                  ))}
                  <div className="border-t border-border/50 pt-3 flex justify-between">
                    <span className="font-bold">Total Amount</span>
                    <span className="text-xl font-extrabold text-orange-500">₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/20 text-xs text-green-700 flex items-start gap-2">
                <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>You can pause or cancel your subscription anytime. First delivery on your selected start date.</span>
              </div>

              <Button onClick={handleConfirm} size="lg" className="w-full rounded-xl font-bold bg-gradient-to-r from-orange-500 to-primary text-white border-0 hover:opacity-90">
                Proceed to Payment ₹{totalPrice.toLocaleString("en-IN")} →
              </Button>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {step < 3 && (
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(s => s - 1)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          )}
          <Button className="flex-1 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-primary text-white border-0" onClick={next}>
            Next <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default TiffinSubscribe;
