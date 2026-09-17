import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Search, Star, MapPin, Users, Phone, Filter, ChefHat } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CATERING_TYPES = ["all", "wedding", "corporate", "birthday", "pooja", "kitty_party", "bulk_tiffin"];

const typeMeta: Record<string, { emoji: string; label: string }> = {
  all:          { emoji: "🎉", label: "All Catering" },
  wedding:      { emoji: "💍", label: "Wedding" },
  corporate:    { emoji: "🏢", label: "Corporate" },
  birthday:     { emoji: "🎂", label: "Birthday" },
  pooja:        { emoji: "🪔", label: "Pooja / Havan" },
  kitty_party:  { emoji: "👯", label: "Kitty Party" },
  bulk_tiffin:  { emoji: "🍱", label: "Bulk Tiffin" },
};

const INDIAN_STATES = [
  "All States","Delhi","Maharashtra","Gujarat","Rajasthan","Punjab",
  "Tamil Nadu","Karnataka","West Bengal","Uttar Pradesh","Kerala",
];

const CATERERS = [
  {
    id:"c1", name:"Savita Sharma Catering", chef:"Savita Sharma",
    city:"Jaipur", state:"Rajasthan", type:"wedding",
    specialty:"Rajasthani & North Indian Wedding Catering",
    desc:"Full wedding catering — dal baati, gatte ki sabzi, churma, sweets. Serving 50–2000 guests.",
    pricePerPlate:250, minGuests:50, rating:4.9, reviews:87,
    image:"https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags:["Veg","FSSAI Certified","Rajasthani Cuisine"],
  },
  {
    id:"c2", name:"Sunita Jadhav Events", chef:"Sunita Jadhav",
    city:"Pune", state:"Maharashtra", type:"corporate",
    specialty:"Corporate Lunch & Office Catering",
    desc:"Healthy office lunch boxes and corporate event catering. Min 20 orders/day. Veg & non-veg options.",
    pricePerPlate:150, minGuests:20, rating:4.7, reviews:63,
    image:"https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags:["Veg & Non-Veg","Corporate","Hygienic"],
  },
  {
    id:"c3", name:"Gurpreet Kaur Catering", chef:"Gurpreet Kaur",
    city:"Amritsar", state:"Punjab", type:"wedding",
    specialty:"Punjabi Wedding & Langar Catering",
    desc:"Authentic Punjabi catering — dal makhani, paneer, rice, rotis, kheer. 100–1000 guests.",
    pricePerPlate:200, minGuests:100, rating:4.9, reviews:112,
    image:"https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags:["Veg","Punjabi Cuisine","FSSAI Certified"],
  },
  {
    id:"c4", name:"Meena Patel Catering", chef:"Meena Patel",
    city:"Ahmedabad", state:"Gujarat", type:"pooja",
    specialty:"Pooja, Havan & Religious Event Catering",
    desc:"Pure veg satvik food for pooja, havan, and religious gatherings. 25–500 guests.",
    pricePerPlate:120, minGuests:25, rating:4.8, reviews:54,
    image:"https://images.pexels.com/photos/3184192/pexels-photo-3184192.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags:["Pure Veg","Satvik","No Onion No Garlic"],
  },
  {
    id:"c5", name:"Rekha Patil Birthday Catering", chef:"Rekha Patil",
    city:"Mumbai", state:"Maharashtra", type:"birthday",
    specialty:"Birthday Parties & Kids Events",
    desc:"Fun birthday catering with snacks, mini meals, cake cutting setup. 20–200 guests.",
    pricePerPlate:180, minGuests:20, rating:4.8, reviews:41,
    image:"https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags:["Veg & Non-Veg","Kids Friendly","Birthday Special"],
  },
  {
    id:"c6", name:"Vijayalakshmi Catering", chef:"Vijayalakshmi",
    city:"Madurai", state:"Tamil Nadu", type:"wedding",
    specialty:"South Indian Wedding & Sadhya Catering",
    desc:"Traditional Tamil Nadu sadhya on banana leaf — rice, sambar, rasam, 10 curries, payasam.",
    pricePerPlate:220, minGuests:50, rating:4.9, reviews:76,
    image:"https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags:["Pure Veg","South Indian","Banana Leaf Sadhya"],
  },
  {
    id:"c7", name:"Nirmala Gupta Bulk Tiffin", chef:"Nirmala Gupta",
    city:"Lucknow", state:"Uttar Pradesh", type:"bulk_tiffin",
    specialty:"Bulk Tiffin for Offices & Hostels",
    desc:"Daily bulk tiffin — 2 sabzi, dal, rice, roti. Min 30 tiffins/day. Monthly subscription available.",
    pricePerPlate:80, minGuests:30, rating:4.8, reviews:93,
    image:"https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags:["Veg","Daily Delivery","Monthly Plan"],
  },
  {
    id:"c8", name:"Anita Das Kitty Party", chef:"Anita Das",
    city:"Kolkata", state:"West Bengal", type:"kitty_party",
    specialty:"Kitty Party & Ladies Gathering Catering",
    desc:"Special kitty party menus — Bengali snacks, finger foods, sweets, tea. 15–80 guests.",
    pricePerPlate:200, minGuests:15, rating:4.7, reviews:38,
    image:"https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags:["Veg & Non-Veg","Bengali Cuisine","Snacks & Sweets"],
  },
];

const Catering = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("All States");
  const [showFilters, setShowFilters] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const filtered = CATERERS.filter((c) => {
    const matchType = typeFilter === "all" || c.type === typeFilter;
    const matchState = stateFilter === "All States" || c.state === stateFilter;
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.specialty.toLowerCase().includes(search.toLowerCase());
    return matchType && matchState && matchSearch;
  });

  const handleBook = (caterer: typeof CATERERS[0]) => {
    if (!user) { navigate("/auth", { state: { from: "/catering" } }); return; }
    addItem({ id: caterer.id, title: caterer.name, price: caterer.pricePerPlate, image_url: caterer.image, category: "catering" });
    toast({ title: `${caterer.name} added to cart! 🎉` });
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
          <span className="text-xl">🎉</span>
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold">Catering Services 🎉</h1>
          <p className="text-muted-foreground text-sm">Wedding, corporate, birthday & event catering by women home chefs across India</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 my-5">
        {[
          { value: "500+", label: "Caterers", emoji: "👩🍳" },
          { value: "28", label: "States", emoji: "🗺️" },
          { value: "50–2000", label: "Guest Capacity", emoji: "👥" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-purple-500/5 border border-purple-500/20 p-3 text-center">
            <p className="text-lg">{s.emoji}</p>
            <p className="font-extrabold text-purple-600 font-heading">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search caterers, cuisine, city..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
            <Button variant="ghost" size="sm" className="w-full rounded-xl text-xs" onClick={() => { setStateFilter("All States"); }}>Clear</Button>
          </div>
        </motion.div>
      )}

      {/* Type pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATERING_TYPES.map((t) => (
          <Button key={t} size="sm" variant={typeFilter === t ? "default" : "outline"}
            onClick={() => setTypeFilter(t)}
            className={typeFilter === t ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0" : ""}>
            {typeMeta[t].emoji} {typeMeta[t].label}
          </Button>
        ))}
      </div>

      {/* Cards */}
      {!filtered.length ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No caterers found. Try different filters!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((caterer, i) => (
            <motion.div key={caterer.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-200 group h-full flex flex-col">
                <div className="aspect-video overflow-hidden relative">
                  <img src={caterer.image} alt={caterer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { const t = e.target as HTMLImageElement; if (!t.dataset.fallback) { t.dataset.fallback="1"; t.src="https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=400"; }}} />
                  <Badge className="absolute top-2 left-2 text-xs bg-white/90 text-foreground dark:bg-black/70 dark:text-white">
                    {typeMeta[caterer.type].emoji} {typeMeta[caterer.type].label}
                  </Badge>
                </div>
                <CardContent className="p-4 flex flex-col flex-1">
                  <h3 className="font-heading font-bold">{caterer.name}</h3>
                  <p className="text-xs text-purple-600 font-semibold mt-0.5">{caterer.specialty}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{caterer.desc}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {caterer.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600">{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{caterer.city}</span>
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{caterer.rating}</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />Min {caterer.minGuests}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                    <div>
                      <p className="text-purple-600 font-extrabold text-lg">₹{caterer.pricePerPlate}<span className="text-xs font-normal text-muted-foreground">/plate</span></p>
                    </div>
                    <Button size="sm" className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:opacity-90"
                      onClick={() => handleBook(caterer)}>
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 text-center py-10 rounded-3xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="text-2xl font-heading font-extrabold mb-2">Offer Catering Services?</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">List your catering service and get bookings for weddings, corporate events & more</p>
        <Button size="lg" className="rounded-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg hover:opacity-90 px-8"
          onClick={() => navigate("/join-seller")}>
          Register as Caterer 🚀
        </Button>
      </div>
    </div>
  );
};

export default Catering;
