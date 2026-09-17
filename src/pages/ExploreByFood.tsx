import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { MapPin, Star, ChefHat, ArrowRight, ShoppingCart } from "lucide-react";

const STATES_DATA = [
  {
    state: "Punjab", emoji: "🌾", color: "from-yellow-500 to-orange-500",
    famousDishes: ["Makki di Roti & Sarson da Saag", "Amritsari Kulcha", "Butter Chicken", "Lassi"],
    chefs: [
      { name: "Gurpreet Kaur", specialty: "Punjabi Tiffin", city: "Amritsar", rating: 4.9, price: 90 },
      { name: "Harjinder Kaur", specialty: "Homemade Pickles", city: "Ludhiana", rating: 4.8, price: 120 },
    ],
  },
  {
    state: "Gujarat", emoji: "🟡", color: "from-amber-400 to-yellow-500",
    famousDishes: ["Dhokla", "Thepla", "Undhiyu", "Fafda-Jalebi"],
    chefs: [
      { name: "Meena Patel", specialty: "Gujarati Tiffin", city: "Ahmedabad", rating: 4.9, price: 70 },
      { name: "Rekha Shah", specialty: "Farsan & Snacks", city: "Surat", rating: 4.8, price: 150 },
    ],
  },
  {
    state: "Kerala", emoji: "🌴", color: "from-green-500 to-teal-500",
    famousDishes: ["Appam & Fish Curry", "Kerala Sadya", "Puttu & Kadala", "Prawn Moilee"],
    chefs: [
      { name: "Lakshmi Nair", specialty: "Kerala Meals", city: "Kochi", rating: 5.0, price: 100 },
      { name: "Suma Menon", specialty: "Cooking Classes", city: "Trivandrum", rating: 4.9, price: 500 },
    ],
  },
  {
    state: "West Bengal", emoji: "🐟", color: "from-pink-500 to-rose-500",
    famousDishes: ["Rasgulla", "Hilsa Fish Curry", "Mishti Doi", "Kathi Roll"],
    chefs: [
      { name: "Priya Banerjee", specialty: "Bengali Sweets", city: "Kolkata", rating: 5.0, price: 180 },
      { name: "Anita Das", specialty: "Fish Curry Tiffin", city: "Kolkata", rating: 4.8, price: 85 },
    ],
  },
  {
    state: "Rajasthan", emoji: "🏜️", color: "from-orange-500 to-red-500",
    famousDishes: ["Dal Baati Churma", "Laal Maas", "Gatte ki Sabzi", "Ker Sangri"],
    chefs: [
      { name: "Savita Sharma", specialty: "Rajasthani Thali", city: "Jaipur", rating: 4.9, price: 120 },
      { name: "Kamla Devi", specialty: "Catering Services", city: "Udaipur", rating: 4.9, price: 350 },
    ],
  },
  {
    state: "Maharashtra", emoji: "🥙", color: "from-violet-500 to-purple-600",
    famousDishes: ["Vada Pav", "Puran Poli", "Misal Pav", "Modak"],
    chefs: [
      { name: "Sunita Jadhav", specialty: "Maharashtrian Tiffin", city: "Pune", rating: 4.8, price: 80 },
      { name: "Rekha Patil", specialty: "Homemade Sweets", city: "Mumbai", rating: 4.9, price: 200 },
    ],
  },
  {
    state: "Tamil Nadu", emoji: "🫔", color: "from-cyan-500 to-blue-500",
    famousDishes: ["Idli & Dosa", "Chettinad Chicken", "Pongal", "Filter Coffee"],
    chefs: [
      { name: "Meenakshi Iyer", specialty: "South Indian Tiffin", city: "Chennai", rating: 4.9, price: 70 },
      { name: "Vijayalakshmi", specialty: "Chettinad Catering", city: "Madurai", rating: 4.8, price: 300 },
    ],
  },
  {
    state: "Uttar Pradesh", emoji: "🍛", color: "from-red-500 to-pink-500",
    famousDishes: ["Lucknowi Biryani", "Chaat & Golgappa", "Petha", "Bedai Sabzi"],
    chefs: [
      { name: "Nirmala Gupta", specialty: "Awadhi Tiffin", city: "Lucknow", rating: 4.9, price: 85 },
      { name: "Shanti Verma", specialty: "Homemade Sweets", city: "Agra", rating: 4.7, price: 250 },
    ],
  },
  {
    state: "Andhra Pradesh", emoji: "🌶️", color: "from-red-600 to-orange-600",
    famousDishes: ["Hyderabadi Biryani", "Pesarattu", "Gongura Pickle", "Pulihora"],
    chefs: [
      { name: "Padmavathi Reddy", specialty: "Andhra Tiffin", city: "Vijayawada", rating: 4.9, price: 75 },
      { name: "Sarada Devi", specialty: "Gongura Pickles", city: "Guntur", rating: 5.0, price: 130 },
    ],
  },
  {
    state: "Karnataka", emoji: "☕", color: "from-brown-500 to-amber-700",
    famousDishes: ["Bisi Bele Bath", "Mysore Pak", "Ragi Mudde", "Filter Coffee"],
    chefs: [
      { name: "Kavitha Rao", specialty: "Karnataka Meals", city: "Bangalore", rating: 4.8, price: 90 },
      { name: "Usha Gowda", specialty: "Mysore Sweets", city: "Mysore", rating: 4.9, price: 220 },
    ],
  },
  {
    state: "Himachal Pradesh", emoji: "🏔️", color: "from-blue-400 to-indigo-500",
    famousDishes: ["Dham", "Siddu", "Chha Gosht", "Aktori"],
    chefs: [
      { name: "Pushpa Thakur", specialty: "Himachali Homestay Meals", city: "Manali", rating: 4.9, price: 1200 },
      { name: "Kamla Sharma", specialty: "Mountain Cooking Class", city: "Shimla", rating: 4.8, price: 600 },
    ],
  },
  {
    state: "Goa", emoji: "🌊", color: "from-teal-400 to-cyan-500",
    famousDishes: ["Fish Curry Rice", "Prawn Balchão", "Bebinca", "Vindaloo"],
    chefs: [
      { name: "Maria Fernandes", specialty: "Goan Seafood Catering", city: "Panaji", rating: 4.9, price: 400 },
      { name: "Conceição D'Souza", specialty: "Goan Cooking Class", city: "Margao", rating: 5.0, price: 700 },
    ],
  },
  {
    state: "Jharkhand", emoji: "🌿", color: "from-green-600 to-emerald-500",
    famousDishes: ["Litti Chokha", "Rugra", "Dhuska", "Chilka Roti"],
    chefs: [
      { name: "Sunita Mahto", specialty: "Jharkhandi Tiffin", city: "Ranchi", rating: 4.8, price: 75 },
      { name: "Parvati Oraon", specialty: "Tribal Food & Cooking Class", city: "Jamshedpur", rating: 4.9, price: 400 },
    ],
  },
];

const ExploreByFood = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const selected = STATES_DATA.find((s) => s.state === selectedState);

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold mb-3 border border-orange-500/20">
          🗺️ EXPLORE INDIA BY FOOD
        </span>
        <h1 className="text-4xl font-heading font-extrabold mb-2">Every State, A New Flavour 🍽️</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Discover authentic regional dishes, order from local home chefs, book tiffin services & catering across India
        </p>
      </div>

      {/* State Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
        {STATES_DATA.map((item, i) => (
          <motion.div
            key={item.state}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <button
              onClick={() => setSelectedState(selectedState === item.state ? null : item.state)}
              className={`w-full text-left rounded-2xl border p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                selectedState === item.state
                  ? "border-orange-500 bg-orange-500/10 shadow-lg"
                  : "border-border/50 bg-card hover:border-orange-500/40"
              }`}
            >
              <div className="text-3xl mb-2">{item.emoji}</div>
              <h3 className={`font-heading font-bold text-sm bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                {item.state}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{item.famousDishes[0]}</p>
              <div className={`mt-2 text-xs font-semibold bg-gradient-to-r ${item.color} bg-clip-text text-transparent flex items-center gap-1`}>
                {item.chefs.length} chefs <ArrowRight className="h-3 w-3" />
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      {/* State Detail Panel */}
      {selected && (
        <motion.div
          key={selected.state}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-orange-500/20 bg-card p-6 mb-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">{selected.emoji}</span>
            <div>
              <h2 className={`text-2xl font-heading font-extrabold bg-gradient-to-r ${selected.color} bg-clip-text text-transparent`}>
                {selected.state}
              </h2>
              <p className="text-muted-foreground text-sm">Famous dishes & local home chefs</p>
            </div>
          </div>

          {/* Famous Dishes */}
          <div className="mb-6">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <span>🍽️</span> Famous Dishes
            </h3>
            <div className="flex flex-wrap gap-2">
              {selected.famousDishes.map((dish) => (
                <Badge key={dish} variant="secondary" className="text-xs px-3 py-1 rounded-full">
                  {dish}
                </Badge>
              ))}
            </div>
          </div>

          {/* Home Chefs */}
          <div>
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <ChefHat className="h-4 w-4 text-orange-500" /> Home Chefs & Services
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {selected.chefs.map((chef) => (
                <Card key={chef.name} className="border-border/50 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-sm">{chef.name}</p>
                        <p className="text-xs text-orange-500 font-semibold mt-0.5">{chef.specialty}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{chef.city}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-semibold">{chef.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-orange-500 font-bold text-sm">₹{chef.price}</p>
                        <Link to={`/marketplace?cat=tiffin`}>
                          <Button size="sm" className="mt-2 text-xs rounded-xl bg-gradient-to-r from-orange-500 to-primary text-white border-0 hover:opacity-90">
                            <ShoppingCart className="h-3 w-3 mr-1" /> Order
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <Link to={`/marketplace?state=${selected.state}`}>
              <Button className="rounded-xl font-bold bg-gradient-to-r from-orange-500 to-primary text-white border-0 hover:opacity-90">
                View All {selected.state} Products <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* CTA */}
      <div className="text-center py-10 rounded-3xl bg-gradient-to-r from-orange-500/10 via-primary/10 to-secondary/10 border border-orange-500/20">
        <div className="text-4xl mb-3">👩🍳</div>
        <h3 className="text-2xl font-heading font-extrabold mb-2">Are you a home chef?</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          List your regional food, tiffin or catering service and reach customers across India
        </p>
        <Link to="/join-seller">
          <Button size="lg" className="rounded-2xl font-bold bg-gradient-to-r from-orange-500 to-primary text-white border-0 shadow-lg hover:opacity-90 px-8">
            Start Selling Your Food 🚀
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ExploreByFood;
