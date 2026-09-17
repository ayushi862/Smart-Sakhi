import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Star, MapPin, Phone, Clock, ShoppingCart, Heart, ChefHat,
  Award, Users, Package, ArrowLeft, CheckCircle, Calendar
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Static chef data — in production this would come from Supabase
const CHEFS: Record<string, {
  id: string; name: string; city: string; state: string; specialty: string;
  bio: string; rating: number; reviews: number; ordersCompleted: number;
  experience: string; avatar: string; coverImage: string; phone: string;
  badges: string[]; available: boolean;
  menu: { id: string; name: string; desc: string; price: number; category: string; image: string; veg: boolean }[];
  reviewsList: { name: string; rating: number; comment: string; date: string }[];
  gallery: string[];
}> = {
  "gurpreet-kaur": {
    id: "gurpreet-kaur",
    name: "Gurpreet Kaur",
    city: "Amritsar", state: "Punjab",
    specialty: "Punjabi Tiffin & Catering",
    bio: "I have been cooking authentic Punjabi food for over 15 years. My tiffin service started in 2018 and now serves 80+ customers daily. Every meal is made with love, pure desi ghee and fresh ingredients sourced from local farms.",
    rating: 4.9, reviews: 234, ordersCompleted: 3200, experience: "15 years",
    avatar: "https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=200",
    coverImage: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
    phone: "+91 98765 43210",
    badges: ["FSSAI Certified", "Top Seller", "500+ Reviews"],
    available: true,
    menu: [
      { id: "gk1", name: "Daily Veg Tiffin", desc: "2 sabzi, dal, rice, 3 rotis — fresh every day", price: 90, category: "tiffin", image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400", veg: true },
      { id: "gk2", name: "Punjabi Thali (Special)", desc: "Dal makhani, paneer, sabzi, rice, 4 rotis, salad, pickle", price: 150, category: "tiffin", image: "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400", veg: true },
      { id: "gk3", name: "Mango Pickle (500g)", desc: "Traditional Punjabi mango pickle in mustard oil", price: 120, category: "pickle", image: "https://www.whiskaffair.com/wp-content/uploads/2020/07/Kerala-Style-Mango-Pickle-2-3.jpg", veg: true },
      { id: "gk4", name: "Catering (per plate)", desc: "Full Punjabi meal for events — min 50 plates", price: 180, category: "catering", image: "https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=400", veg: true },
    ],
    reviewsList: [
      { name: "Rahul Sharma", rating: 5, comment: "Best tiffin in Amritsar! Dal makhani tastes exactly like home. Highly recommend!", date: "2 days ago" },
      { name: "Priya Singh", rating: 5, comment: "Gurpreet ji's food is amazing. Very hygienic and always on time. 10/10!", date: "1 week ago" },
      { name: "Amit Verma", rating: 4, comment: "Great food, generous portions. The pickle is outstanding!", date: "2 weeks ago" },
    ],
    gallery: [
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=400",
    ],
  },
  "meenakshi-iyer": {
    id: "meenakshi-iyer",
    name: "Meenakshi Iyer",
    city: "Chennai", state: "Tamil Nadu",
    specialty: "South Indian Tiffin & Cooking Classes",
    bio: "Authentic South Indian home cooking passed down through 3 generations. I specialize in traditional Tamil Nadu recipes — from crispy dosas to aromatic sambar. My cooking classes have trained 200+ students.",
    rating: 4.9, reviews: 189, ordersCompleted: 2800, experience: "12 years",
    avatar: "https://images.pexels.com/photos/3184192/pexels-photo-3184192.jpeg?auto=compress&cs=tinysrgb&w=200",
    coverImage: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800",
    phone: "+91 87654 32109",
    badges: ["FSSAI Certified", "Cooking Expert", "200+ Students"],
    available: true,
    menu: [
      { id: "mi1", name: "South Indian Tiffin", desc: "Idli, dosa, sambar, 2 chutneys — authentic home taste", price: 70, category: "tiffin", image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=400", veg: true },
      { id: "mi2", name: "Full Meals (Sadhya)", desc: "Rice, sambar, rasam, 3 curries, papad, pickle, payasam", price: 130, category: "tiffin", image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400", veg: true },
      { id: "mi3", name: "Cooking Class (2hr)", desc: "Learn dosa, idli, sambar from scratch — take recipe cards home", price: 500, category: "cooking_class", image: "https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=400", veg: true },
      { id: "mi4", name: "Sambar Powder (200g)", desc: "Freshly ground authentic Tamil Nadu sambar powder", price: 80, category: "spices", image: "https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=400", veg: true },
    ],
    reviewsList: [
      { name: "Kavitha R", rating: 5, comment: "The dosas are perfectly crispy and the sambar is divine. Just like my mother's cooking!", date: "3 days ago" },
      { name: "Suresh M", rating: 5, comment: "Took the cooking class — learned so much! Meenakshi is a wonderful teacher.", date: "1 week ago" },
      { name: "Ananya P", rating: 4, comment: "Tiffin is always fresh and on time. The sambar powder is excellent too!", date: "3 weeks ago" },
    ],
    gallery: [
      "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
      "https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=400",
    ],
  },
};

const categoryColor: Record<string, string> = {
  tiffin: "bg-orange-500/10 text-orange-600",
  pickle: "bg-yellow-500/10 text-yellow-600",
  spices: "bg-red-500/10 text-red-600",
  catering: "bg-purple-500/10 text-purple-600",
  cooking_class: "bg-blue-500/10 text-blue-600",
};

const ChefProfile = () => {
  const { chefId } = useParams<{ chefId: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"menu" | "reviews" | "gallery">("menu");
  const [wishlisted, setWishlisted] = useState(false);

  const chef = chefId ? CHEFS[chefId] : null;

  if (!chef) {
    return (
      <div className="container py-16 text-center">
        <ChefHat className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-heading font-bold mb-2">Chef not found</h2>
        <Link to="/explore-food"><Button className="rounded-xl">Browse Chefs</Button></Link>
      </div>
    );
  }

  const handleAddToCart = (item: typeof chef.menu[0]) => {
    if (!user) { navigate("/auth", { state: { from: `/chef/${chefId}` } }); return; }
    addItem({ id: item.id, title: item.name, price: item.price, image_url: item.image, category: item.category });
    toast({ title: `${item.name} added to cart! 🛒` });
  };

  const handleSubscribe = () => {
    if (!user) { navigate("/auth", { state: { from: `/chef/${chefId}` } }); return; }
    navigate(`/tiffin-subscribe/${chefId}`);
  };

  return (
    <div className="min-h-screen">
      {/* Cover */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img src={chef.coverImage} alt={chef.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 h-9 w-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button onClick={() => setWishlisted(!wishlisted)} className="absolute top-4 right-4 h-9 w-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors">
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
        </button>
      </div>

      <div className="container max-w-3xl -mt-16 relative pb-12">
        {/* Chef Info Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border/50 shadow-xl mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-20 w-20 rounded-2xl overflow-hidden border-4 border-background shadow-lg flex-shrink-0">
                  <img src={chef.avatar} alt={chef.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h1 className="text-2xl font-heading font-extrabold">{chef.name}</h1>
                      <p className="text-orange-500 font-semibold text-sm">{chef.specialty}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {chef.city}, {chef.state}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" /> {chef.experience} experience
                        </div>
                      </div>
                    </div>
                    {chef.available && (
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1 inline-block" />
                        Available
                      </Badge>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {chef.badges.map((b) => (
                      <span key={b} className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20 flex items-center gap-1">
                        <Award className="h-3 w-3" /> {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-border/50">
                {[
                  { icon: Star, value: `${chef.rating}★`, label: "Rating", color: "text-yellow-500" },
                  { icon: Users, value: chef.reviews, label: "Reviews", color: "text-blue-500" },
                  { icon: Package, value: `${(chef.ordersCompleted / 1000).toFixed(1)}k+`, label: "Orders", color: "text-green-500" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className={`text-xl font-heading font-extrabold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Bio */}
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{chef.bio}</p>

              {/* Action buttons */}
              <div className="flex gap-3 mt-5 flex-wrap">
                <Button onClick={handleSubscribe} className="flex-1 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-primary text-white border-0 hover:opacity-90">
                  <Calendar className="h-4 w-4 mr-2" /> Subscribe to Tiffin
                </Button>
                <Button variant="outline" className="rounded-xl border-orange-500/30 hover:bg-orange-500/10" onClick={() => window.open(`tel:${chef.phone}`)}>
                  <Phone className="h-4 w-4 mr-2" /> Call Chef
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 bg-muted/40 p-1 rounded-2xl">
          {(["menu", "reviews", "gallery"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                activeTab === tab ? "bg-background shadow text-orange-500" : "text-muted-foreground hover:text-foreground"
              }`}>
              {tab === "menu" ? "🍽️ Menu" : tab === "reviews" ? "⭐ Reviews" : "📸 Gallery"}
            </button>
          ))}
        </div>

        {/* Menu Tab */}
        {activeTab === "menu" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {chef.menu.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <Card className="border-border/50 hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm">{item.name}</h3>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${item.veg ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}>
                          {item.veg ? "🟢 Veg" : "🔴 Non-veg"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.desc}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${categoryColor[item.category] ?? "bg-muted text-muted-foreground"}`}>
                        {item.category}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-orange-500 font-bold">₹{item.price}</p>
                      <Button size="sm" className="mt-1 rounded-xl text-xs bg-gradient-to-r from-orange-500 to-primary text-white border-0 hover:opacity-90"
                        onClick={() => handleAddToCart(item)}>
                        <ShoppingCart className="h-3 w-3 mr-1" /> Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20 mb-4">
              <div className="text-center">
                <p className="text-4xl font-heading font-extrabold text-orange-500">{chef.rating}</p>
                <div className="flex gap-0.5 justify-center mt-1">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`h-4 w-4 ${s <= Math.floor(chef.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{chef.reviews} reviews</p>
              </div>
              <div className="flex-1 space-y-1">
                {[5,4,3].map((star) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs w-4">{star}★</span>
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: star === 5 ? "80%" : star === 4 ? "15%" : "5%" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {chef.reviewsList.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-sm">{r.name}</p>
                        <div className="flex gap-0.5 mt-0.5">
                          {[1,2,3,4,5].map((s) => (
                            <Star key={s} className={`h-3 w-3 ${s <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{r.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{r.comment}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Gallery Tab */}
        {activeTab === "gallery" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-3">
            {chef.gallery.map((img, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
                className="aspect-square rounded-2xl overflow-hidden">
                <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Sticky bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border/50 md:hidden z-40">
          <div className="flex gap-3 max-w-3xl mx-auto">
            <Button onClick={handleSubscribe} className="flex-1 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-primary text-white border-0">
              <Calendar className="h-4 w-4 mr-2" /> Subscribe Tiffin
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={() => setActiveTab("menu")}>
              View Menu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChefProfile;
