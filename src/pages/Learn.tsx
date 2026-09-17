import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Play, BookOpen, ChefHat } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FOOD_CATEGORIES = ["all", "cooking", "tiffin", "bakery", "pickles", "sweets", "spices", "catering", "business"];

const categoryMeta: Record<string, { emoji: string; label: string }> = {
  all:      { emoji: "🍽️", label: "All" },
  cooking:  { emoji: "👩🍳", label: "Cooking" },
  tiffin:   { emoji: "🍱", label: "Tiffin" },
  bakery:   { emoji: "🥐", label: "Bakery" },
  pickles:  { emoji: "🫙", label: "Pickles" },
  sweets:   { emoji: "🍮", label: "Sweets" },
  spices:   { emoji: "🌶️", label: "Spices" },
  catering: { emoji: "🎉", label: "Catering" },
  business: { emoji: "💼", label: "Food Business" },
};

const FOOD_VIDEOS = [
  {
    id: "fv1", category: "pickles",
    title: "Homemade Mango Pickle Recipe",
    description: "Traditional aam ka aachar recipe — perfect to sell from home",
    video_url: "https://youtu.be/nOKKZLFoUso",
    thumbnail_url: "https://elephantsandthecoconuttrees.com/wp-content/uploads/2021/09/Instant-mango-pickle-from-Kerala-2.png",
  },
  {
    id: "fv2", category: "pickles",
    title: "Lemon Pickle Business Recipe",
    description: "Make tangy lemon pickle in bulk for selling",
    video_url: "https://youtu.be/nOKKZLFoUso",
    thumbnail_url: "https://recipes.timesofindia.com/photo/57645740.cms",
  },
  {
    id: "fv3", category: "sweets",
    title: "Besan Ladoo Business Recipe",
    description: "Make perfect besan ladoos to sell during festivals",
    video_url: "https://youtu.be/5OpXp1FynZg",
    thumbnail_url: "https://i.ytimg.com/vi/5OpXp1FynZg/sddefault.jpg?v=6139b081",
  },
  {
    id: "fv4", category: "sweets",
    title: "Dry Fruit Barfi for Festivals",
    description: "Premium dry fruit barfi recipe — high margin sweet to sell",
    video_url: "https://youtu.be/5OpXp1FynZg",
    thumbnail_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaXMArNN40j7xNrV5inep9hT1vCYE4D4mN_A&s",
  },
  {
    id: "fv5", category: "spices",
    title: "Homemade Masala Powder",
    description: "Grind and package your own masala blends to sell",
    video_url: "https://youtu.be/-1s_wp6EMu8",
    thumbnail_url: "https://i.ytimg.com/vi/-1s_wp6EMu8/maxresdefault.jpg",
  },
  {
    id: "fv6", category: "spices",
    title: "Garam Masala from Scratch",
    description: "Authentic garam masala blend — freshly ground at home",
    video_url: "https://youtu.be/-1s_wp6EMu8",
    thumbnail_url: "https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "fv7", category: "cooking",
    title: "South Indian Tiffin Recipes",
    description: "Idli, dosa, sambar — authentic recipes for tiffin service",
    video_url: "https://youtu.be/nOKKZLFoUso",
    thumbnail_url: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "fv8", category: "cooking",
    title: "Punjabi Dal Makhani Recipe",
    description: "Restaurant-style dal makhani for your tiffin service",
    video_url: "https://youtu.be/nOKKZLFoUso",
    thumbnail_url: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "fv9", category: "cooking",
    title: "Rajasthani Dal Baati Churma",
    description: "Traditional Rajasthani recipe — great for catering & events",
    video_url: "https://youtu.be/nOKKZLFoUso",
    thumbnail_url: "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "fv10", category: "tiffin",
    title: "How to Start a Tiffin Service",
    description: "Complete guide to starting a profitable tiffin business from home",
    video_url: "https://youtu.be/2fG9EX6dzp0",
    thumbnail_url: "https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "fv11", category: "tiffin",
    title: "Tiffin Packaging & Labelling",
    description: "How to pack and label your tiffin professionally",
    video_url: "https://youtu.be/2fG9EX6dzp0",
    thumbnail_url: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "fv12", category: "bakery",
    title: "Whole Wheat Bread at Home",
    description: "Bake healthy whole wheat bread — no preservatives, great to sell",
    video_url: "https://youtu.be/nOKKZLFoUso",
    thumbnail_url: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "fv13", category: "bakery",
    title: "Eggless Banana Cake Recipe",
    description: "Moist eggless banana cake — popular home bakery item",
    video_url: "https://youtu.be/nOKKZLFoUso",
    thumbnail_url: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "fv14", category: "bakery",
    title: "Butter Cookies for Home Bakery",
    description: "Classic butter cookies — easy to make and sell in bulk",
    video_url: "https://youtu.be/nOKKZLFoUso",
    thumbnail_url: "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "fv15", category: "catering",
    title: "How to Start Catering Business",
    description: "Step-by-step guide to starting a home catering service",
    video_url: "https://youtu.be/2fG9EX6dzp0",
    thumbnail_url: "https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "fv16", category: "catering",
    title: "Bulk Cooking Tips for Events",
    description: "How to cook for 50-500 people efficiently",
    video_url: "https://youtu.be/2fG9EX6dzp0",
    thumbnail_url: "https://images.pexels.com/photos/3184192/pexels-photo-3184192.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "fv17", category: "business",
    title: "Start a Home Food Business in India",
    description: "FSSAI registration, pricing, packaging — complete guide",
    video_url: "https://youtu.be/2fG9EX6dzp0",
    thumbnail_url: "https://i.ytimg.com/vi/2fG9EX6dzp0/maxresdefault.jpg",
  },
  {
    id: "fv18", category: "business",
    title: "WhatsApp Business for Food Sellers",
    description: "Use WhatsApp Business to take orders and grow your food business",
    video_url: "https://www.youtube.com/shorts/_jNtiLmp7PI?feature=share",
    thumbnail_url: "https://prod.superblogcdn.com/site_cuid_cl9pmahic552151jpq6mko9ans/images/29-1732184130152-compressed.jpg",
  },
  {
    id: "fv19", category: "business",
    title: "Food Product Photography at Home",
    description: "Take mouth-watering food photos with just your phone",
    video_url: "https://youtu.be/a9rJB3VKA74",
    thumbnail_url: "https://i.ytimg.com/vi/a9rJB3VKA74/hq720.jpg",
  },
  {
    id: "fv20", category: "business",
    title: "FSSAI Registration for Home Chefs",
    description: "How to get FSSAI license for your home food business — free & easy",
    video_url: "https://youtu.be/2fG9EX6dzp0",
    thumbnail_url: "https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

const Learn = () => {
  const [category, setCategory] = useState("all");
  const { t } = useLanguage();

  const { data: dbContent } = useQuery({
    queryKey: ["learning-content"],
    queryFn: async () => {
      const { data } = await supabase.from("learning_content").select("*").order("created_at", { ascending: false });
      return (data ?? []).filter((item: any) => FOOD_CATEGORIES.includes(item.category));
    },
  });

  const content = [
    ...(dbContent ?? []),
    ...FOOD_VIDEOS,
  ].filter((c) => category === "all" || c.category === category);

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
          <ChefHat className="h-5 w-5 text-orange-500" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold">Learn Food Skills 🍽️</h1>
          <p className="text-muted-foreground text-sm">Free video tutorials to grow your food business</p>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap mt-5 mb-6">
        {FOOD_CATEGORIES.map((c) => (
          <Button
            key={c}
            size="sm"
            variant={category === c ? "default" : "outline"}
            onClick={() => setCategory(c)}
            className={category === c ? "bg-gradient-to-r from-orange-500 to-primary text-white border-0" : ""}
          >
            {categoryMeta[c].emoji} {categoryMeta[c].label}
          </Button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {content.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 group">
            <div className="aspect-video bg-muted relative overflow-hidden">
              {item.thumbnail_url ? (
                <img
                  src={item.thumbnail_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    if (!t.dataset.fallback) { t.dataset.fallback = "1"; t.src = "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400"; }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="h-12 w-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="h-5 w-5 text-white ml-0.5" />
                </div>
              </div>
            </div>

            <CardContent className="p-4">
              <Badge variant="secondary" className="text-xs mb-2 bg-orange-500/10 text-orange-600 border-orange-500/20">
                {categoryMeta[item.category]?.emoji ?? "🍽️"} {categoryMeta[item.category]?.label ?? item.category}
              </Badge>
              <h3 className="font-heading font-bold text-sm leading-snug">{item.title}</h3>
              {item.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
              )}
              <a href={item.video_url} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white">
                  <Play className="h-3 w-3 mr-1" /> {t.learn.watchVideo}
                </Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Learn;
