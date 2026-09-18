import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Search, Star, MapPin, Users, Filter, Wifi, Coffee, UtensilsCrossed, CheckCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const HOMESTAY_TYPES = ["all", "hills", "beach", "village", "city", "heritage", "farm"];

const typeMeta: Record<string, { emoji: string; label: string }> = {
  all:      { emoji: "🏡", label: "All Homestays" },
  hills:    { emoji: "🏔️", label: "Hills" },
  beach:    { emoji: "🌊", label: "Beach" },
  village:  { emoji: "🌾", label: "Village" },
  city:     { emoji: "🏙️", label: "City" },
  heritage: { emoji: "🏛️", label: "Heritage" },
  farm:     { emoji: "🌿", label: "Farm Stay" },
};

const INDIAN_STATES = [
  "All States","Kerala","Himachal Pradesh","Goa","Rajasthan","Uttarakhand",
  "Karnataka","Maharashtra","West Bengal","Tamil Nadu","Assam",
];

const HOMESTAYS = [
  {
    id:"h1", name:"Pushpa's Mountain Retreat",
    host:"Pushpa Thakur", city:"Manali", state:"Himachal Pradesh", type:"hills",
    desc:"Cozy mountain homestay with stunning Himalayan views. All 3 meals included — authentic Himachali food. Perfect for couples & families.",
    pricePerNight:1200, guests:4, rating:4.9, reviews:67,
    image:"https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400",
    amenities:["3 Meals Included","WiFi","Hot Water","Mountain View","Bonfire"],
    mealHighlight:"Himachali dham, siddu, fresh trout fish",
    tags:["Meals Included","Family Friendly","Scenic View"],
  },
  {
    id:"h2", name:"Kerala Backwater Homestay",
    host:"Lakshmi Nair", city:"Alleppey", state:"Kerala", type:"beach",
    desc:"Traditional Kerala home on the backwaters. Authentic Kerala meals — appam, fish curry, sadya. Houseboat rides available.",
    pricePerNight:2500, guests:6, rating:4.9, reviews:89,
    image:"https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg?auto=compress&cs=tinysrgb&w=400",
    amenities:["Kerala Meals","Houseboat Ride","AC Rooms","WiFi","Ayurvedic Massage"],
    mealHighlight:"Appam, fish curry, Kerala sadya, puttu",
    tags:["Backwater View","Meals Included","Ayurvedic"],
  },
  {
    id:"h3", name:"Rajasthani Haveli Stay",
    host:"Kamla Devi", city:"Udaipur", state:"Rajasthan", type:"heritage",
    desc:"Stay in a 200-year-old haveli with royal Rajasthani hospitality. Dal baati churma, laal maas, and traditional sweets served daily.",
    pricePerNight:1800, guests:4, rating:4.8, reviews:54,
    image:"https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
    amenities:["Rajasthani Meals","Heritage Property","Rooftop Dining","Cultural Shows","WiFi"],
    mealHighlight:"Dal baati churma, gatte ki sabzi, ker sangri",
    tags:["Heritage","Meals Included","Cultural Experience"],
  },
  {
    id:"h4", name:"Goa Beach Cottage",
    host:"Maria Fernandes", city:"Candolim", state:"Goa", type:"beach",
    desc:"Charming beach cottage 5 mins from the sea. Goan home-cooked breakfast included — poha, bebinca, fresh coconut water.",
    pricePerNight:2000, guests:3, rating:4.8, reviews:72,
    image:"https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400",
    amenities:["Breakfast Included","Beach Access","AC","WiFi","Bicycle"],
    mealHighlight:"Goan breakfast, fish curry rice, bebinca",
    tags:["Beach View","Breakfast Included","Peaceful"],
  },
  {
    id:"h5", name:"Bengal Village Farmstay",
    host:"Priya Banerjee", city:"Shantiniketan", state:"West Bengal", type:"farm",
    desc:"Peaceful village farmstay near Shantiniketan. Authentic Bengali home cooking — rice, fish curry, mishti doi, rasgulla.",
    pricePerNight:900, guests:4, rating:4.7, reviews:43,
    image:"https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg?auto=compress&cs=tinysrgb&w=400",
    amenities:["Bengali Meals","Farm Tour","Organic Garden","Cultural Activities","WiFi"],
    mealHighlight:"Fish curry, shorshe ilish, mishti doi, rasgulla",
    tags:["Farm Stay","Meals Included","Cultural"],
  },
  {
    id:"h6", name:"Coorg Coffee Estate Stay",
    host:"Kavitha Rao", city:"Madikeri", state:"Karnataka", type:"farm",
    desc:"Stay on a working coffee estate in Coorg. South Indian meals, coffee plantation tours, trekking. Pure nature experience.",
    pricePerNight:1500, guests:5, rating:4.9, reviews:61,
    image:"https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400",
    amenities:["South Indian Meals","Coffee Tour","Trekking","Nature Walks","WiFi"],
    mealHighlight:"Akki roti, pandi curry, filter coffee, payasam",
    tags:["Coffee Estate","Meals Included","Trekking"],
  },
  {
    id:"h7", name:"Uttarakhand Eco Homestay",
    host:"Kamla Sharma", city:"Munsiyari", state:"Uttarakhand", type:"hills",
    desc:"Eco-friendly homestay in the Kumaon Himalayas. Organic local food, bird watching, Himalayan treks.",
    pricePerNight:1100, guests:4, rating:4.8, reviews:38,
    image:"https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg?auto=compress&cs=tinysrgb&w=400",
    amenities:["Organic Meals","Bird Watching","Himalayan Trek","Bonfire","Solar Power"],
    mealHighlight:"Kumaoni thali, bhatt ki churkani, bal mithai",
    tags:["Eco Friendly","Meals Included","Himalayan View"],
  },
  {
    id:"h8", name:"Tamil Nadu Village Home",
    host:"Meenakshi Iyer", city:"Thanjavur", state:"Tamil Nadu", type:"village",
    desc:"Traditional Brahmin household in temple town Thanjavur. Authentic Tamil meals on banana leaf, temple visits, classical music.",
    pricePerNight:800, guests:3, rating:4.9, reviews:49,
    image:"https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
    amenities:["Tamil Meals","Temple Visits","Classical Music","Cooking Class","WiFi"],
    mealHighlight:"Banana leaf meals, sambar, rasam, payasam",
    tags:["Cultural","Meals Included","Temple Town"],
  },
];

const Homestays = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("All States");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const filtered = HOMESTAYS.filter((h) => {
    const matchType = typeFilter === "all" || h.type === typeFilter;
    const matchState = stateFilter === "All States" || h.state === stateFilter;
    const matchSearch = !search || h.name.toLowerCase().includes(search.toLowerCase()) || h.city.toLowerCase().includes(search.toLowerCase());
    return matchType && matchState && matchSearch;
  });

  const handleBook = (h: typeof HOMESTAYS[0]) => {
    if (!user) { navigate("/auth", { state: { from: "/homestays" } }); return; }
    navigate(`/payment?amount=${h.pricePerNight}&type=homestay`);
    toast({ title: `Booking ${h.name}...` });
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
          <span className="text-xl">🏡</span>
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold">Homestays 🏡</h1>
          <p className="text-muted-foreground text-sm">Authentic local stays with home-cooked meals by women hosts across India</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 my-5">
        {[
          { value: "200+", label: "Homestays", emoji: "🏡" },
          { value: "18", label: "States", emoji: "🗺️" },
          { value: "Meals", label: "Always Included", emoji: "🍽️" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-teal-500/5 border border-teal-500/20 p-3 text-center">
            <p className="text-lg">{s.emoji}</p>
            <p className="font-extrabold text-teal-600 font-heading">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, city, state..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
        {HOMESTAY_TYPES.map((t) => (
          <Button key={t} size="sm" variant={typeFilter === t ? "default" : "outline"}
            onClick={() => setTypeFilter(t)}
            className={typeFilter === t ? "bg-gradient-to-r from-teal-500 to-green-500 text-white border-0" : ""}>
            {typeMeta[t].emoji} {typeMeta[t].label}
          </Button>
        ))}
      </div>

      {/* Cards */}
      {!filtered.length ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No homestays found. Try different filters!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((h, i) => (
            <motion.div key={h.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-200 group h-full flex flex-col">
                <div className="aspect-video overflow-hidden relative">
                  <img src={h.image} alt={h.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { const t = e.target as HTMLImageElement; if (!t.dataset.fallback) { t.dataset.fallback="1"; t.src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400"; }}} />
                  <Badge className="absolute top-2 left-2 text-xs bg-white/90 text-foreground dark:bg-black/70 dark:text-white">
                    {typeMeta[h.type].emoji} {typeMeta[h.type].label}
                  </Badge>
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 dark:bg-black/70 rounded-full px-2 py-0.5">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold">{h.rating}</span>
                  </div>
                </div>
                <CardContent className="p-4 flex flex-col flex-1">
                  <h3 className="font-heading font-bold">{h.name}</h3>
                  <p className="text-xs text-teal-600 font-semibold mt-0.5">by {h.host}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" /> {h.city}, {h.state}
                    <span className="mx-1">·</span>
                    <Users className="h-3 w-3" /> Up to {h.guests} guests
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{h.desc}</p>

                  {/* Meal highlight */}
                  <div className="mt-2 p-2 rounded-xl bg-orange-500/5 border border-orange-500/20">
                    <p className="text-xs font-semibold text-orange-600 flex items-center gap-1">
                      <UtensilsCrossed className="h-3 w-3" /> Meals: {h.mealHighlight}
                    </p>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {h.amenities.slice(0, 3).map((a) => (
                      <span key={a} className="text-xs px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 flex items-center gap-1">
                        <CheckCircle className="h-2.5 w-2.5" /> {a}
                      </span>
                    ))}
                    {h.amenities.length > 3 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">+{h.amenities.length - 3} more</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50 .mt-3">
                    <div>
                      <p className="text-teal-600 font-extrabold text-lg">₹{h.pricePerNight.toLocaleString("en-IN")}<span className="text-xs font-normal text-muted-foreground">/night</span></p>
                      <p className="text-xs text-muted-foreground">{h.reviews} reviews</p>
                    </div>
                    <Button size="sm" className="rounded-xl bg-gradient-to-r from-teal-500 to-green-500 text-white border-0 hover:opacity-90"
                      onClick={() => handleBook(h)}>
                      Book Stay
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 text-center py-10 rounded-3xl bg-gradient-to-r from-teal-500/10 to-green-500/10 border border-teal-500/20">
        <div className="text-4xl mb-3">🏡</div>
        <h3 className="text-2xl font-heading font-extrabold mb-2">Host Guests at Your Home?</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">List your homestay and earn by sharing your home, food and culture with travellers</p>
        <Button size="lg" className="rounded-2xl font-bold bg-gradient-to-r from-teal-500 to-green-500 text-white border-0 shadow-lg hover:opacity-90 px-8"
          onClick={() => navigate("/join-seller")}>
          List Your Homestay 🚀
        </Button>
      </div>
    </div>
  );
};

export default Homestays;
