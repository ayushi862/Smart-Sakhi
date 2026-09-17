import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChefHat, Send, User, Bot, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = { id: number; role: "user" | "assistant"; text: string };

const SUGGESTIONS = [
  "How do I start a tiffin service from home?",
  "How to price my homemade pickles?",
  "Write a menu description for my food business",
  "Tips to grow my catering business",
  "How to market my home kitchen on WhatsApp?",
  "What food items sell best online?",
];

const getLocalReply = (text: string): string => {
  const q = text.toLowerCase();

  if (q.includes("tiffin") || q.includes("dabba"))
    return "🍱 Starting a Tiffin Service:\n1. Start with 5-10 customers in your area\n2. Offer weekly/monthly subscription plans\n3. Price: ₹70-120/meal depending on your city\n4. Menu: 2 sabzi, dal, rice, 3 rotis daily\n5. Use WhatsApp to take orders & share daily menu\n6. List on Smart Sakhi for wider reach!\n7. Get FSSAI registration for credibility";

  if (q.includes("pickle") || q.includes("achar"))
    return "🫙 Selling Homemade Pickles:\n1. Start with 3 varieties: mango, lemon, mixed veg\n2. Pack in clean glass jars with proper labels\n3. Label: product name, weight, date, ingredients\n4. Price: ₹80-150 per 500g jar\n5. Shelf life: mention clearly (3-6 months)\n6. Sell combo packs of 3 jars for better value\n7. Festival season = 3x pickle sales!";

  if (q.includes("price") || q.includes("pricing") || q.includes("cost") || q.includes("charge"))
    return "💰 Food Pricing Formula:\n1. Material cost × 3 = selling price\n2. Add packaging cost separately\n3. Tiffin: ₹70-120/meal | Catering: ₹150-400/plate\n4. Pickles: ₹80-150/jar | Sweets: ₹300-600/kg\n5. Bakery: ₹80-300/item | Spices: ₹50-150/pack\n6. Never underprice — it reduces trust!\n7. Offer combo deals to increase order value";

  if (q.includes("menu") || q.includes("description") || q.includes("write"))
    return "✍️ Writing Food Descriptions:\n1. Start with the key ingredient: 'Made with pure A2 ghee...'\n2. Mention origin: 'Traditional Rajasthani recipe...'\n3. Add quantity/weight: '500g, serves 4-5 people'\n4. Highlight USP: 'No preservatives, no artificial colors'\n5. End with emotion: 'Just like Dadi's kitchen!'\n\nExample: 'Homemade Mango Pickle — Traditional Rajasthani recipe, sun-dried raw mangoes in pure mustard oil with 12 spices. 500g jar, no preservatives. Tastes just like home! 🫙'";

  if (q.includes("cater") || q.includes("event") || q.includes("wedding"))
    return "🎉 Growing Your Catering Business:\n1. Start with small events: birthdays, kitty parties\n2. Offer 3 packages: Basic (₹150/plate), Standard (₹250), Premium (₹400)\n3. Always do a tasting session before booking\n4. Take 50% advance payment\n5. Build a portfolio with photos of every event\n6. Partner with event planners & decorators\n7. List on Smart Sakhi for corporate & wedding leads";

  if (q.includes("whatsapp") || q.includes("market") || q.includes("promote") || q.includes("social"))
    return "📱 Marketing Your Food Business:\n1. Create WhatsApp Business account with catalog\n2. Post daily menu/product photos every morning\n3. Share in local housing society groups\n4. Ask happy customers for reviews & referrals\n5. Offer ₹20 discount for first-time referrals\n6. Post on Instagram with #homemade #homechef\n7. List on Smart Sakhi marketplace for free!";

  if (q.includes("sweet") || q.includes("mithai") || q.includes("ladoo") || q.includes("barfi"))
    return "🍮 Selling Homemade Sweets:\n1. Festival season (Diwali, Holi, Eid, Rakhi) = 5x sales!\n2. Start with: ladoo, barfi, chakli, namkeen\n3. Use pure ghee — customers pay premium for quality\n4. Pack in gift boxes for festivals (₹300-800/box)\n5. Take advance orders 2 weeks before festivals\n6. Price: ₹300-600/kg depending on ingredients\n7. Offer custom gift hampers for corporate orders";

  if (q.includes("spice") || q.includes("masala"))
    return "🌶️ Selling Spices & Masala:\n1. Grind fresh at home — quality beats packaged brands\n2. Pack in 100g, 200g, 500g sizes\n3. Popular: garam masala, chilli powder, turmeric, biryani masala\n4. Label with: ingredients, weight, best before date\n5. Price: ₹50-150 per pack\n6. Sell combo packs (5 spices) for ₹300-400\n7. Regional specialty masalas sell at premium!";

  if (q.includes("bakery") || q.includes("cake") || q.includes("bread") || q.includes("cookie"))
    return "🥐 Starting a Home Bakery:\n1. Start with: cookies, banana bread, brownies\n2. Get FSSAI registration for credibility\n3. Price: Cookies ₹150-300/dozen | Cakes ₹400-1500\n4. Take custom orders for birthdays & events\n5. Use Instagram to showcase your bakes\n6. Offer free delivery within 3km\n7. Subscription boxes (weekly bakes) = steady income!";

  if (q.includes("homestay") || q.includes("home stay") || q.includes("accommodation"))
    return "🏡 Running a Homestay:\n1. Register on Smart Sakhi + Airbnb + OYO\n2. Offer authentic home-cooked meals as USP\n3. Price: ₹800-2500/night depending on location\n4. Highlight local experiences: cooking class, farm visit\n5. Keep rooms clean, provide WiFi & hot water\n6. Collect reviews after every stay\n7. Festival & holiday seasons = highest bookings!";

  if (q.includes("cooking class") || q.includes("teach") || q.includes("workshop"))
    return "👩🍳 Running Cooking Classes:\n1. Start with regional specialties you know best\n2. Offer: 2hr demo class (₹300-500) or full workshop (₹800-1500)\n3. Batch size: 5-8 students is ideal\n4. Provide printed recipe cards as takeaway\n5. Offer online classes via Zoom for wider reach\n6. Corporate team-building cooking sessions = ₹5000-15000!\n7. List on Smart Sakhi for bookings";

  if (q.includes("fssai") || q.includes("license") || q.includes("registration"))
    return "📋 FSSAI Registration for Home Food:\n1. Basic FSSAI registration is FREE for home businesses\n2. Apply at: https://foscos.fssai.gov.in\n3. Required documents: Aadhaar, address proof, photo\n4. Processing time: 7-15 days\n5. Valid for 1-5 years, renewable\n6. Builds customer trust significantly!\n7. Required for selling on most online platforms";

  if (q.includes("hello") || q.includes("hi") || q.includes("namaste"))
    return "Namaste! 👩🍳 I'm AI Sakhi, your food business assistant!\n\nI can help you with:\n• Starting tiffin, catering or home kitchen\n• Pricing your food products\n• Writing menu descriptions\n• Marketing on WhatsApp & social media\n• FSSAI registration guidance\n• Growing your food business\n\nWhat would you like help with today?";

  if (q.includes("thank"))
    return "You're welcome! 🙏 Best of luck with your food business!\n\nRemember: Great food + good packaging + smart marketing = success! 🍽️\n\nFeel free to ask me anything about your food business on Smart Sakhi! 👩🍳";

  return `🍽️ Tips for "${text}":\n\n1. Start small, test with 5-10 customers first\n2. Focus on quality — word of mouth is powerful for food\n3. Get FSSAI registration for credibility\n4. Use WhatsApp Business for orders & updates\n5. List on Smart Sakhi marketplace for free!\n\nWant specific advice? Ask about:\n• Tiffin service, catering, home bakery\n• Pricing, packaging, marketing\n• Pickles, spices, sweets, snacks`;
};

const AiSuggestions = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      text: "Namaste! 👩🍳 I'm AI Sakhi — your personal food business assistant!\n\nI help women home chefs, tiffin services, caterers & food entrepreneurs grow their business. What would you like to know today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now(), role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    await new Promise((res) => setTimeout(res, 800));
    const reply = getLocalReply(text.trim());
    setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", text: reply }]);
    setLoading(false);
  };

  return (
    <div className="container py-8 max-w-2xl flex flex-col" style={{ height: "calc(100vh - 120px)" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
          <ChefHat className="h-5 w-5 text-orange-500" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold">AI Sakhi Assistant 🍽️</h1>
          <p className="text-xs text-muted-foreground">Food descriptions · Pricing · Menus · Marketing · Business tips</p>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden flex flex-col border-orange-500/20">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-orange-500" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-orange-500 to-primary text-white rounded-tr-sm"
                    : "bg-muted text-foreground rounded-tl-sm"
                }`}>
                  {msg.text}
                </div>
                {msg.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="h-4 w-4 text-secondary" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="flex gap-2 justify-start">
              <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-orange-500" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </CardContent>

        {messages.length === 1 && (
          <div className="px-4 pb-2 flex gap-2 flex-wrap">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-orange-500/30 text-orange-600 hover:bg-orange-500/10 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="p-3 border-t border-border/50 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask about tiffin, pricing, menus, marketing..."
            className="rounded-xl"
            disabled={loading}
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="rounded-xl px-4 bg-gradient-to-r from-orange-500 to-primary text-white border-0 hover:opacity-90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AiSuggestions;
