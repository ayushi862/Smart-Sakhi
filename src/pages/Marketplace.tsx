import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Search, Package, Star, Heart, Filter, MapPin, ChefHat } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FOOD_CATEGORIES = [
  "all","homemade","pickle","spices","sweets","snacks","bakery","tiffin","catering",
  "cooking_class","homestay","food_experience",
];

const categoryMeta: Record<string, { emoji: string; label: string }> = {
  all:            { emoji: "🍽️", label: "All Food" },
  homemade:       { emoji: "🏠", label: "Home Kitchen" },
  pickle:         { emoji: "🫙", label: "Pickles" },
  spices:         { emoji: "🌶️", label: "Spices & Masala" },
  sweets:         { emoji: "🍮", label: "Sweets" },
  snacks:         { emoji: "🥨", label: "Snacks" },
  bakery:         { emoji: "🥐", label: "Bakery" },
  tiffin:         { emoji: "🍱", label: "Tiffin" },
  catering:       { emoji: "🎉", label: "Catering" },
  cooking_class:  { emoji: "👩‍🍳", label: "Cooking Classes" },
  homestay:       { emoji: "🏡", label: "Homestays" },
  food_experience:{ emoji: "🌟", label: "Food Experiences" },
};

const INDIAN_STATES = [
  "All States","Andhra Pradesh","Assam","Bihar","Delhi","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra",
  "Manipur","Meghalaya","Odisha","Punjab","Rajasthan","Tamil Nadu","Telangana",
  "Uttar Pradesh","Uttarakhand","West Bengal",
];

type StaticProduct = {
  id: string; title: string; description: string;
  price: number; category: string; image_url: string;
  state?: string; city?: string; rating?: number;
};

const STATIC_PRODUCTS: StaticProduct[] = [
  { id:"f1",  title:"Mango Pickle (Homemade)",      description:"Traditional spicy mango pickle, mustard oil, 500g",    price:120, category:"pickle",   image_url:"https://www.whiskaffair.com/wp-content/uploads/2020/07/Kerala-Style-Mango-Pickle-2-3.jpg",          state:"Rajasthan",   city:"Jaipur",    rating:4.9 },
  { id:"f2",  title:"Mixed Vegetable Pickle",        description:"Carrot, turnip & chilli pickle in mustard oil, 400g",  price:100, category:"pickle",   image_url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmEtOPNdo-EbCCc6KkQh-_uEMSL32a7XFisA&s", state:"Punjab",      city:"Amritsar",  rating:4.7 },
  { id:"f3",  title:"Lemon Pickle",                  description:"Tangy homemade lemon pickle with spices, 300g",        price:90,  category:"pickle",   image_url:"https://recipes.timesofindia.com/photo/57645740.cms",                                               state:"Gujarat",     city:"Ahmedabad", rating:4.8 },
  { id:"f4",  title:"Garam Masala Blend",            description:"Freshly ground aromatic spice mix, 200g",              price:80,  category:"spices",   image_url:"https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=400", state:"Uttar Pradesh",city:"Lucknow",  rating:4.9 },
  { id:"f5",  title:"Turmeric Powder",               description:"Pure organic turmeric powder, 200g",                   price:55,  category:"spices",   image_url:"https://info.ehl.edu/hubfs/EHL-Passugg_Blog_Kurkuma_Titelbild_001.jpg",                            state:"Kerala",      city:"Kochi",     rating:4.8 },
  { id:"f6",  title:"Red Chilli Powder",             description:"Sun-dried & ground red chilli powder, 200g",           price:60,  category:"spices",   image_url:"https://www.neonaturalindustries.com/wp-content/uploads/2022/06/red-chillies.jpg",                  state:"Andhra Pradesh",city:"Guntur", rating:5.0 },
  { id:"f7",  title:"Homemade Besan Ladoo",          description:"Besan ladoo made with pure desi ghee, 500g",           price:200, category:"sweets",   image_url:"https://maayeka.com/wp-content/uploads/2012/08/besan-ke-ladoo-maayeka-blog-1.jpg",                  state:"Rajasthan",   city:"Jodhpur",   rating:4.9 },
  { id:"f8",  title:"Dry Fruit Barfi",               description:"Mixed dry fruit barfi with kaju & pista, 250g",        price:280, category:"sweets",   image_url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaXMArNN40j7xNrV5inep9hT1vCYE4D4mN_A&s",   state:"Maharashtra", city:"Pune",      rating:4.8 },
  { id:"f9",  title:"Rasgulla (12 pcs)",             description:"Soft spongy rasgulla in sugar syrup, homemade",        price:180, category:"sweets",   image_url:"https://danaram.com/cdn/shop/files/Rasgulla_1_kg_Pack_of_12_Cans.jpg?v=1779360083&width=1445",                state:"West Bengal", city:"Kolkata",   rating:5.0 },
  { id:"f10", title:"Homemade Chakli",               description:"Crispy rice flour chakli, perfect tea-time snack",     price:120, category:"snacks",   image_url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF-_4myEIzpr8pAbQ-HJo7C1xs3vZbZmqjLA&s",   state:"Maharashtra", city:"Mumbai",    rating:4.7 },
  { id:"f11", title:"Murukku (Homemade)",            description:"Crunchy sesame murukku, traditional Tamil recipe",     price:100, category:"snacks",   image_url:"https://www.indianhealthyrecipes.com/wp-content/uploads/2021/10/murukku-recipe.jpg",               state:"Tamil Nadu",  city:"Chennai",   rating:4.8 },
  { id:"f12", title:"Mathri & Namkeen Pack",         description:"Crispy mathri with assorted namkeen, 400g",            price:150, category:"snacks",   image_url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm_GoVGxblzVSNL-QnQhURUPzsg7-eYnq7VJP-I16LAA&s=10",                state:"Delhi",       city:"Delhi",     rating:4.6 },
  { id:"f13", title:"Whole Wheat Bread (Homemade)",  description:"Freshly baked whole wheat bread, no preservatives",   price:80,  category:"bakery",   image_url:"https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400", state:"Karnataka",   city:"Bangalore", rating:4.7 },
  { id:"f14", title:"Banana Walnut Cake",            description:"Moist homemade banana walnut cake, 500g",              price:250, category:"bakery",   image_url:"https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400",  state:"Kerala",      city:"Trivandrum",rating:4.9 },
  { id:"f15", title:"Cookies Assorted Box",          description:"Homemade butter cookies, 20 pcs assorted",            price:180, category:"bakery",   image_url:"https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=400",  state:"Maharashtra", city:"Pune",      rating:4.8 },
  { id:"f16", title:"Veg Tiffin (Daily)",            description:"2 sabzi, dal, rice, roti — fresh daily delivery",     price:80,  category:"tiffin",   image_url:"https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400", state:"Gujarat",     city:"Surat",     rating:4.8 },
  { id:"f17", title:"South Indian Tiffin",           description:"Idli, dosa, sambar, chutney — authentic home taste",  price:70,  category:"tiffin",   image_url:"https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=400", state:"Tamil Nadu",  city:"Chennai",   rating:4.9 },
  { id:"f18", title:"Punjabi Tiffin Service",        description:"Dal makhani, sabzi, roti, rice — full Punjabi meal",  price:90,  category:"tiffin",   image_url:"https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400", state:"Punjab",      city:"Ludhiana",  rating:4.7 },
  { id:"f19", title:"Wedding Catering (Veg)",        description:"Full veg catering for 50-500 guests, all cuisines",   price:350, category:"catering", image_url:"https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=400",  state:"Rajasthan",   city:"Jaipur",    rating:4.9 },
  { id:"f20", title:"Corporate Lunch Catering",      description:"Healthy office lunch boxes, min 20 orders/day",       price:120, category:"catering", image_url:"https://images.pexels.com/photos/弁当/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",     state:"Maharashtra", city:"Mumbai",    rating:4.6 },
  { id:"f21", title:"Learn Rajasthani Cooking",      description:"Dal baati, gatte ki sabzi, churma — 3hr class",       price:500, category:"cooking_class", image_url:"https://t3.ftcdn.net/jpg/20/90/76/82/360_F_2090768240_OWY1lNYJYAw5rGWpiFygd9KdbwUkiOKs.jpg", state:"Rajasthan", city:"Udaipur", rating:4.9 },
  { id:"f22", title:"Bengali Sweets Masterclass",    description:"Rasgulla, sandesh, mishti doi — 4hr workshop",        price:600, category:"cooking_class", image_url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl8M7dhWcRp9VaN07AbIl8jHWdPe-Z0wWMPllMnKcIGmatVuTSqcfbcXGB&s=10", state:"West Bengal", city:"Kolkata", rating:5.0 },
  { id:"f23", title:"Cozy Homestay with Meals",      description:"Authentic home stay, 3 meals included, local family", price:1200,category:"homestay", image_url:"https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400", state:"Himachal Pradesh",city:"Manali", rating:4.8 },
  { id:"f24", title:"Kerala Backwater Homestay",     description:"Houseboat stay with Kerala meals, 2 nights",         price:2500,category:"homestay", image_url:"https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg?auto=compress&cs=tinysrgb&w=400", state:"Kerala",      city:"Alleppey", rating:4.9 },
  { id:"f25", title:"Street Food Walk — Delhi",      description:"Guided street food tour, 10 tastings, 3 hours",      price:800, category:"food_experience", image_url:"https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400", state:"Delhi", city:"Delhi", rating:4.8 },
  { id:"f26", title:"Spice Farm Experience",         description:"Visit spice farm, cooking demo, take-home spices",   price:1000,category:"food_experience", image_url:"https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=400", state:"Kerala", city:"Munnar", rating:4.9 },
  { id:"f27", title:"Homemade Ghee (Pure Desi)",     description:"A2 cow milk ghee, bilona method, 500ml",             price:450, category:"homemade", image_url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK52ZW_KJjfZWo58ClqGDAgvJLY4Lx-pvJYCNCFhEhlg&s=10",  state:"Gujarat",     city:"Anand",     rating:5.0 },
  { id:"f28", title:"Organic Jaggery (Gur)",         description:"Pure sugarcane jaggery, no chemicals, 1kg",          price:120, category:"homemade", image_url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVsbGJ5Q0adAdK1YfcYENcS2FBn5uxP_ZNn-hlq5AeKQ&s=10",  state:"Maharashtra", city:"Kolhapur",  rating:4.8 },
];

const Marketplace = () => {
  const [searchParams] = useSearchParams();
  const initCat = searchParams.get("cat") || "all";
  const [category, setCategory] = useState(initCat);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("All States");
  const [priceMax, setPriceMax] = useState("");
  const [minRating, setMinRating] = useState("0");
  const [showFilters, setShowFilters] = useState(false);

  const { t } = useLanguage();
  const { toast } = useToast();
  const { addItem } = useCart();
  const { addToWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: dbProducts, isLoading } = useQuery({
    queryKey: ["products", category, search],
    queryFn: async () => {
      let query = supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false });
      if (category !== "all") query = query.eq("category", category);
      if (search) query = query.ilike("title", `%${search}%`);
      const { data } = await query;
      return data ?? [];
    },
  });

  const baseProducts = (dbProducts && dbProducts.length > 0) ? dbProducts : STATIC_PRODUCTS;
  const products = baseProducts.filter((p) => {
    const matchCat = category === "all" || p.category === category;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    const matchState = stateFilter === "All States" || (p as any).state === stateFilter;
    const matchPrice = !priceMax || p.price <= Number(priceMax);
    const matchRating = !minRating || ((p as any).rating ?? 4.5) >= Number(minRating);
    return matchCat && matchSearch && matchState && matchPrice && matchRating;
  });

  const addToCart = (product: any) => {
    if (!user) { navigate("/auth", { state: { from: "/marketplace" } }); return; }
    addItem(product);
    toast({ title: "Added to cart! 🛒" });
  };

  const handleWishlist = (product: any) => {
    if (!user) { navigate("/auth", { state: { from: "/marketplace" } }); return; }
    addToWishlist(product);
    toast({ title: "Added to Wishlist ❤️" });
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
          <ChefHat className="h-5 w-5 text-orange-500" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold">Food Marketplace 🍽️</h1>
          <p className="text-muted-foreground text-sm">Homemade food, tiffin, catering & hospitality by women across India 🇮🇳</p>
        </div>
      </div>

      {/* Search + Filter toggle */}
      <div className="flex gap-2 mt-4 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search food, tiffin, catering..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button variant="outline" className="rounded-xl gap-2" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="h-4 w-4" /> Filters
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-4 rounded-2xl bg-muted/40 border border-border/50">
          <div>
            <p className="text-xs font-semibold mb-1 text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> State</p>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {INDIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-xs font-semibold mb-1 text-muted-foreground">Max Price (₹)</p>
            <Input type="number" placeholder="e.g. 500" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className="h-9 text-sm" />
          </div>
          <div>
            <p className="text-xs font-semibold mb-1 text-muted-foreground flex items-center gap-1"><Star className="h-3 w-3" /> Min Rating</p>
            <Select value={minRating} onValueChange={setMinRating}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any Rating</SelectItem>
                <SelectItem value="4">4★ & above</SelectItem>
                <SelectItem value="4.5">4.5★ & above</SelectItem>
                <SelectItem value="4.8">4.8★ & above</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button variant="ghost" size="sm" className="w-full rounded-xl text-xs" onClick={() => { setStateFilter("All States"); setPriceMax(""); setMinRating("0"); }}>
              Clear Filters
            </Button>
          </div>
        </motion.div>
      )}

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        {FOOD_CATEGORIES.map((c) => (
          <Button key={c} size="sm" variant={category === c ? "default" : "outline"}
            onClick={() => setCategory(c)}
            className={category === c ? "bg-gradient-to-r from-orange-500 to-primary text-white border-0" : ""}
          >
            {categoryMeta[c].emoji} {categoryMeta[c].label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading delicious food...</div>
      ) : !products?.length ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No products found. Try different filters!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 h-full flex flex-col group">
                <div className="aspect-square bg-muted overflow-hidden relative">
                  <img
                    src={product.image_url || "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400"}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const t = e.target as HTMLImageElement;
                      if (!t.dataset.fallback) { t.dataset.fallback = "1"; t.src = "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400"; }
                    }}
                  />
                  <Badge className="absolute top-2 left-2 text-xs bg-white/90 text-foreground dark:bg-black/70 dark:text-white">
                    {categoryMeta[product.category]?.emoji ?? "🍽️"} {categoryMeta[product.category]?.label ?? product.category}
                  </Badge>
                  <button
                    onClick={() => handleWishlist(product)}
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 dark:bg-black/70 flex items-center justify-center shadow hover:scale-110 transition-transform"
                  >
                    <Heart className={`h-4 w-4 transition-colors ${isWishlisted(product.id) ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-400"}`} />
                  </button>
                </div>
                <CardContent className="p-3 flex flex-col flex-1">
                  <h3 className="font-heading font-bold text-sm mt-1 line-clamp-2">{product.title}</h3>
                  {product.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">{(product as any).rating ?? "4.8"}</span>
                    </div>
                    {(product as any).state && (
                      <div className="flex items-center gap-0.5">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{(product as any).city || (product as any).state}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-orange-500 font-bold mt-auto pt-2 text-base">₹{product.price}</p>
                  <Button size="sm" className="mt-2 w-full bg-gradient-to-r from-orange-500 to-primary text-white border-0 hover:opacity-90"
                    onClick={() => addToCart(product)}>
                    <ShoppingCart className="h-4 w-4 mr-1" /> Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
