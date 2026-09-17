import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Search, Star, MapPin, Clock, Users, Filter, CheckCircle, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

const CLASS_TYPES = ["all", "regional", "baking", "pickles_preserves", "sweets", "tiffin_business", "online", "kids"];

const typeMeta: Record<string, { emoji: string; label: string }> = {
  all:               { emoji: "👩🍳", label: "All Classes" },
  regional:          { emoji: "🗺️", label: "Regional Cuisine" },
  baking:            { emoji: "🥐", label: "Baking" },
  pickles_preserves: { emoji: "🫙", label: "Pickles & Preserves" },
  sweets:            { emoji: "🍮", label: "Sweets & Mithai" },
  tiffin_business:   { emoji: "🍱", label: "Tiffin Business" },
  online:            { emoji: "💻", label: "Online Classes" },
  kids:              { emoji: "👧", label: "Kids Cooking" },
};

const INDIAN_STATES = [
  "All States","Delhi","Maharashtra","Gujarat","Rajasthan","Punjab",
  "Tamil Nadu","Karnataka","West Bengal","Uttar Pradesh","Kerala","Goa",
];

const CLASSES = [
  {
    id:"cl1", name:"Rajasthani Cooking Masterclass",
    chef:"Savita Sharma", city:"Udaipur", state:"Rajasthan", type:"regional",
    desc:"Learn dal baati churma, gatte ki sabzi, ker sangri and laal maas in a 3-hour hands-on class. Recipe cards included.",
    price:500, duration:"3 hours", batchSize:8, rating:4.9, reviews:43,
    image:"https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=400",
    includes:["Recipe Cards","Ingredients","Certificate","Lunch"],
    schedule:"Weekends 10AM–1PM",
    tags:["Hands-on","Certificate","Lunch Included"],
  },
  {
    id:"cl2", name:"Bengali Sweets Masterclass",
    chef:"Priya Banerjee", city:"Kolkata", state:"West Bengal", type:"sweets",
    desc:"Make rasgulla, sandesh, mishti doi and chomchom from scratch. Learn the secrets of Bengali mithai in 4 hours.",
    price:600, duration:"4 hours", batchSize:6, rating:5.0, reviews:38,
    image:"https://images.pexels.com/photos/3184192/pexels-photo-3184192.jpeg?auto=compress&cs=tinysrgb&w=400",
    includes:["Recipe Cards","All Ingredients","Sweets to Take Home","Certificate"],
    schedule:"Saturdays 11AM–3PM",
    tags:["Sweets","Take Home","Certificate"],
  },
  {
    id:"cl3", name:"South Indian Tiffin Class",
    chef:"Meenakshi Iyer", city:"Chennai", state:"Tamil Nadu", type:"regional",
    desc:"Master idli, dosa, sambar, chutneys and filter coffee. Perfect for starting a tiffin service. 2-hour class.",
    price:500, duration:"2 hours", batchSize:8, rating:4.9, reviews:56,
    image:"https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=400",
    includes:["Recipe Cards","Breakfast Served","Certificate"],
    schedule:"Daily 8AM–10AM",
    tags:["Tiffin Business","Certificate","Breakfast"],
  },
  {
    id:"cl4", name:"Homemade Pickle & Preserve Workshop",
    chef:"Gurpreet Kaur", city:"Amritsar", state:"Punjab", type:"pickles_preserves",
    desc:"Learn 5 types of pickles — mango, lemon, mixed veg, garlic, green chilli. Packaging and labelling tips included.",
    price:400, duration:"3 hours", batchSize:10, rating:4.8, reviews:29,
    image:"https://www.whiskaffair.com/wp-content/uploads/2020/07/Kerala-Style-Mango-Pickle-2-3.jpg",
    includes:["Recipe Cards","Jars to Take Home","Packaging Tips","Certificate"],
    schedule:"Sundays 10AM–1PM",
    tags:["Pickles","Take Home","Business Tips"],
  },
  {
    id:"cl5", name:"Home Bakery Startup Class",
    chef:"Rekha Patil", city:"Pune", state:"Maharashtra", type:"baking",
    desc:"Bake bread, cakes, cookies and muffins. Learn pricing, packaging and how to start a home bakery business.",
    price:700, duration:"4 hours", batchSize:6, rating:4.8, reviews:34,
    image:"https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400",
    includes:["Recipe Cards","Baked Goods to Take Home","Business Guide","Certificate"],
    schedule:"Saturdays 9AM–1PM",
    tags:["Baking","Business","Take Home"],
  },
  {
    id:"cl6", name:"Tiffin Business Masterclass",
    chef:"Nirmala Gupta", city:"Lucknow", state:"Uttar Pradesh", type:"tiffin_business",
    desc:"Complete guide to starting a profitable tiffin service — menu planning, pricing, FSSAI registration, WhatsApp marketing.",
    price:800, duration:"5 hours", batchSize:12, rating:4.9, reviews:47,
    image:"https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
    includes:["Business Workbook","FSSAI Guide","Marketing Templates","Lunch","Certificate"],
    schedule:"First Sunday of month 10AM–3PM",
    tags:["Business","FSSAI","Marketing"],
  },
  {
    id:"cl7", name:"Kerala Cooking Online Class",
    chef:"Suma Menon", city:"Trivandrum", state:"Kerala", type:"online",
    desc:"Live online class — appam, fish curry, Kerala sadya, payasam. Join from anywhere in India. Zoom session.",
    price:300, duration:"2 hours", batchSize:20, rating:4.8, reviews:62,
    image:"https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=400",
    includes:["Recipe PDF","Live Demo","Q&A Session","Recording Access"],
    schedule:"Wednesdays 6PM–8PM",
    tags:["Online","Live","Recording"],
  },
  {
    id:"cl8", name:"Kids Cooking Fun Class",
    chef:"Anita Das", city:"Kolkata", state:"West Bengal", type:"kids",
    desc:"Fun cooking class for kids aged 6–14. Make sandwiches, lemonade, cookies and simple Indian snacks safely.",
    price:350, duration:"2 hours", batchSize:8, rating:4.9, reviews:51,
    image:"https://images.pexels.com/photos/3184192/pexels-photo-3184192.jpeg?auto=compress&cs=tinysrgb&w=400",
    includes:["Apron & Chef Hat","Recipe Cards","Snacks to Take Home","Certificate"],
    schedule:"Weekends 10AM–12PM",
    tags:["Kids","Fun","Certificate"],
  },
];

const CookingClasses = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("All States");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { addItem } = useCart();

  const filtered = CLASSES.filter((c) => {
    const matchType = typeFilter === "all" || c.type === typeFilter;
    const matchState = stateFilter === "All States" || c.state === stateFilter;
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.chef.toLowerCase().includes(search.toLowerCase());
    return matchType && matchState && matchSearch;
  });

  const handleBook = (cls: typeof CLASSES[0]) => {
    if (!user) { navigate("/auth", { state: { from: "/cooking-classes" } }); return; }
    addItem({ id: cls.id, title: cls.name, price: cls.price, image_url: cls.image, category: "cooking_class" });
    toast({ title: `${cls.name} added to cart! 👩🍳` });
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
          <span className="text-xl">👩🍳</span>
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold">Cooking Classes 👩🍳</h1>
          <p className="text-muted-foreground text-sm">Learn regional recipes, baking, pickles & food business from expert home chefs</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 my-5">
        {[
          { value: "150+", label: "Classes", emoji: "📚" },
          { value: "2–5 hrs", label: "Duration", emoji: "⏱️" },
          { value: "Certificate", label: "On Completion", emoji: "🏆" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-blue-500/5 border border-blue-500/20 p-3 text-center">
            <p className="text-lg">{s.emoji}</p>
            <p className="font-extrabold text-blue-600 font-heading">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search classes, chef, cuisine..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button variant="outline" className="rounded-xl gap-2" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="h-4 w-4" /> Filters
        </Button>
      </div>

      {showFilters && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3 mb-4 p-4 rounded-2xl bg-muted/40 border border-border/50">
          <div>
            <p className="text-xs font-semibold mb-1 text-muted-foreground">State</p>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>{INDIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button variant="ghost" size="sm" className="w-full rounded-xl text-xs" onClick={() => setStateFilter("All States")}>Clear</Button>
          </div>
        </motion.div>
      )}

      {/* Type pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CLASS_TYPES.map((t) => (
          <Button key={t} size="sm" variant={typeFilter === t ? "default" : "outline"}
            onClick={() => setTypeFilter(t)}
            className={typeFilter === t ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0" : ""}>
            {typeMeta[t].emoji} {typeMeta[t].label}
          </Button>
        ))}
      </div>

      {/* Cards */}
      {!filtered.length ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No classes found. Try different filters!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((cls, i) => (
            <motion.div key={cls.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-200 group h-full flex flex-col">
                <div className="aspect-video overflow-hidden relative">
                  <img src={cls.image} alt={cls.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { const t = e.target as HTMLImageElement; if (!t.dataset.fallback) { t.dataset.fallback="1"; t.src="https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=400"; }}} />
                  <Badge className="absolute top-2 left-2 text-xs bg-white/90 text-foreground dark:bg-black/70 dark:text-white">
                    {typeMeta[cls.type].emoji} {typeMeta[cls.type].label}
                  </Badge>
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 dark:bg-black/70 rounded-full px-2 py-0.5">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold">{cls.rating}</span>
                  </div>
                </div>
                <CardContent className="p-4 flex flex-col flex-1">
                  <h3 className="font-heading font-bold">{cls.name}</h3>
                  <p className="text-xs text-blue-600 font-semibold mt-0.5">by {cls.chef}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{cls.city}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{cls.duration}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />Max {cls.batchSize}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{cls.desc}</p>

                  {/* Schedule */}
                  <div className="mt-2 flex items-center gap-1 text-xs text-blue-600 font-semibold">
                    <Calendar className="h-3 w-3" /> {cls.schedule}
                  </div>

                  {/* Includes */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {cls.includes.slice(0, 3).map((inc) => (
                      <span key={inc} className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 flex items-center gap-1">
                        <CheckCircle className="h-2.5 w-2.5" /> {inc}
                      </span>
                    ))}
                    {cls.includes.length > 3 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">+{cls.includes.length - 3} more</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50 mt-3">
                    <div>
                      <p className="text-blue-600 font-extrabold text-lg">₹{cls.price}<span className="text-xs font-normal text-muted-foreground">/person</span></p>
                      <p className="text-xs text-muted-foreground">{cls.reviews} reviews</p>
                    </div>
                    <Button size="sm" className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:opacity-90"
                      onClick={() => handleBook(cls)}>
                      Book Class
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 text-center py-10 rounded-3xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
        <div className="text-4xl mb-3">👩🍳</div>
        <h3 className="text-2xl font-heading font-extrabold mb-2">Teach Your Food Skills?</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">List your cooking class and earn by teaching your regional recipes to food lovers</p>
        <Button size="lg" className="rounded-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg hover:opacity-90 px-8"
          onClick={() => navigate("/join-seller")}>
          List Your Cooking Class 🚀
        </Button>
      </div>
    </div>
  );
};

export default CookingClasses;
