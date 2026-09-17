import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ShoppingBag, Sparkles, ArrowRight, MapPin, UtensilsCrossed, ChefHat, Heart, Star, Users, TrendingUp, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const STATE_FOODS = [
  { state: "Punjab", dish: "Makki di Roti & Sarson da Saag", emoji: "🌽", color: "from-yellow-500 to-orange-500" },
  { state: "Gujarat", dish: "Dhokla & Thepla", emoji: "🟡", color: "from-amber-400 to-yellow-500" },
  { state: "Kerala", dish: "Appam & Fish Curry", emoji: "🐟", color: "from-green-500 to-teal-500" },
  { state: "Bengal", dish: "Rasgulla & Hilsa Fish", emoji: "🍮", color: "from-pink-500 to-rose-500" },
  { state: "Rajasthan", dish: "Dal Baati Churma", emoji: "🫓", color: "from-orange-500 to-red-500" },
  { state: "Maharashtra", dish: "Vada Pav & Puran Poli", emoji: "🥙", color: "from-violet-500 to-purple-600" },
  { state: "Tamil Nadu", dish: "Idli, Dosa & Sambar", emoji: "🫔", color: "from-cyan-500 to-blue-500" },
  { state: "Uttar Pradesh", dish: "Lucknowi Biryani & Chaat", emoji: "🍛", color: "from-red-500 to-pink-500" },
  { state: "Jharkhand", dish: "Litti Chokha & Rugra", emoji: "🌿", color: "from-green-600 to-emerald-500" },
];

const IMPACT_STATS = [
  { value: "28", label: "States Covered", icon: MapPin, color: "text-green-500" },
  { value: "4.8★", label: "Average Rating", icon: Star, color: "text-yellow-500" },
];

const HOSPITALITY_SERVICES = [
  { icon: "🍱", title: "Tiffin Services", desc: "Daily home-cooked tiffin from local women chefs", link: "/marketplace?cat=tiffin" },
  { icon: "🎉", title: "Catering", desc: "Events, weddings & corporate catering by home chefs", link: "/marketplace?cat=catering" },
  { icon: "🏡", title: "Homestays", desc: "Authentic local stays with home-cooked meals", link: "/marketplace?cat=homestay" },
  { icon: "👩‍🍳", title: "Cooking Classes", desc: "Learn regional recipes from expert home chefs", link: "/marketplace?cat=cooking_class" },
  { icon: "🌶️", title: "Local Food Experiences", desc: "Curated food walks & tasting sessions", link: "/marketplace?cat=food_experience" },
  { icon: "🏠", title: "Home Kitchens", desc: "Order directly from certified home kitchens", link: "/marketplace?cat=homemade" },
];

const Index = () => {
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate("/marketplace", { replace: true });
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-500 text-sm font-semibold mb-6 border border-orange-500/20">
              🍽️ India's #1 FoodTech Platform for Women Entrepreneurs
            </span>
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold leading-tight mb-6">
              <span className="bg-gradient-to-r from-orange-500 via-primary to-secondary bg-clip-text text-transparent">
                Smart Sakhi
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
              Empowering women home chefs, tiffin services, caterers & food entrepreneurs across India.
              Sell your food, grow your kitchen business, explore India by taste.
            </p>
            <p className="text-base text-orange-500/80 font-semibold mb-10">
              Homemade Food · Pickles · Spices · Sweets · Tiffin · Catering · Cooking Classes · Homestays
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/marketplace">
                <Button size="lg" className="font-bold text-base rounded-2xl bg-gradient-to-r from-orange-500 to-primary text-white border-0 shadow-lg hover:opacity-90 hover:scale-105 transition-all px-8">
                  Explore Food Market <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/join-seller">
                <Button size="lg" variant="outline" className="font-bold text-base rounded-2xl border-2 border-orange-500/40 hover:bg-orange-500/10 hover:scale-105 transition-all px-8">
                  Become a Sakhi 👩‍🍳
                </Button>
              </Link>
              <Link to="/explore-food">
                <Button size="lg" variant="outline" className="font-bold text-base rounded-2xl border-2 hover:bg-muted/60 hover:scale-105 transition-all px-8">
                  🗺️ Explore India by Food
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-8 mt-16"
          >
            {IMPACT_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className={`text-3xl font-heading font-extrabold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Explore India by Food */}
      <section className="container py-16">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3 border border-primary/20">
            🗺️ EXPLORE INDIA BY FOOD
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold">Every State, A New Flavour</h2>
          <p className="text-muted-foreground mt-2">Discover authentic regional dishes & order from local home chefs</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATE_FOODS.map((item, i) => (
            <motion.div
              key={item.state}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <Link to={`/explore-food?state=${item.state}`}>
                <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 group overflow-hidden border-border/50">
                  <CardContent className="p-5 text-center relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    <div className="text-4xl mb-3">{item.emoji}</div>
                    <h3 className={`font-heading font-bold text-sm bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>{item.state}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.dish}</p>
                    <div className={`mt-3 text-xs font-semibold bg-gradient-to-r ${item.color} bg-clip-text text-transparent flex items-center justify-center gap-1`}>
                      Order Now <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link to="/explore-food">
            <Button variant="outline" className="rounded-2xl font-bold border-primary/30 hover:bg-primary/10">
              View All 28 States 🗺️ <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Hospitality Services */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold mb-3 border border-secondary/20">
              🏡 HOSPITALITY SERVICES
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold">Beyond Food — Full Hospitality</h2>
            <p className="text-muted-foreground mt-2">Tiffin, catering, homestays, cooking classes & more by women entrepreneurs</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {HOSPITALITY_SERVICES.map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={svc.link}>
                  <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 group border-border/50 h-full">
                    <CardContent className="p-6">
                      <div className="text-3xl mb-3">{svc.icon}</div>
                      <h3 className="font-heading font-bold mb-1">{svc.title}</h3>
                      <p className="text-sm text-muted-foreground">{svc.desc}</p>
                      <div className="mt-3 text-xs font-semibold text-primary flex items-center gap-1">
                        Explore <ArrowRight className="h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Sakhi Impact */}
      <section className="container py-16">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-bold mb-3 border border-green-500/20">
            💚 SMART SAKHI IMPACT
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold">Changing Lives, One Meal at a Time</h2>
          <p className="text-muted-foreground mt-2">Real impact created by women food entrepreneurs on our platform</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: TrendingUp, value: "₹2.4 Cr+", label: "Revenue Generated", desc: "Total earnings by women food sellers", color: "from-green-500 to-teal-500", bg: "bg-green-500/10" },
            { icon: Users, value: "1.2 Lakh+", label: "Happy Customers", desc: "Customers ordering from home kitchens", color: "from-blue-500 to-cyan-500", bg: "bg-blue-500/10" },
            { icon: Award, value: "28", label: "States Covered", desc: "Authentic regional food from every state", color: "from-purple-500 to-pink-500", bg: "bg-purple-500/10" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-border/50 hover:shadow-lg transition-all h-full">
                <CardContent className="p-6 text-center">
                  <div className={`h-14 w-14 rounded-2xl ${item.bg} flex items-center justify-center mx-auto mb-4`}>
                    <item.icon className="h-7 w-7" />
                  </div>
                  <p className={`text-3xl font-heading font-extrabold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>{item.value}</p>
                  <p className="font-bold mt-1 text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Become a Sakhi CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-primary/10 to-secondary/10 pointer-events-none" />
        <div className="container text-center relative">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <div className="text-5xl mb-4">👩‍🍳</div>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-4">Become a Sakhi — Start Your Food Business</h2>
            <p className="text-muted-foreground mb-3 text-lg max-w-xl mx-auto">
              Sell your homemade food, pickles, sweets, tiffin or catering services. Join 12,000+ women already earning on Smart Sakhi.
            </p>
            <p className="text-orange-500 font-semibold mb-8">100% Free · No Commission · Start in 5 Minutes</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/join-seller">
                <Button size="lg" className="font-bold text-base rounded-2xl bg-gradient-to-r from-orange-500 to-primary text-white border-0 shadow-xl hover:opacity-90 hover:scale-105 transition-all px-10">
                  Start Selling Food 🚀
                </Button>
              </Link>
              <Link to="/ai-suggestions">
                <Button size="lg" variant="outline" className="font-bold text-base rounded-2xl border-2 border-primary/30 hover:bg-primary/10 hover:scale-105 transition-all px-8">
                  <Sparkles className="mr-2 h-5 w-5" /> AI Sakhi Assistant
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
