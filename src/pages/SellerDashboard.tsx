import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Package, ChefHat, ShoppingBag, Star, TrendingUp } from "lucide-react";

const FOOD_CATEGORIES = [
  { value: "homemade",        label: "🏠 Home Kitchen" },
  { value: "pickle",          label: "🫙 Pickles & Achar" },
  { value: "spices",          label: "🌶️ Spices & Masala" },
  { value: "sweets",          label: "🍮 Sweets & Mithai" },
  { value: "snacks",          label: "🥨 Snacks & Namkeen" },
  { value: "bakery",          label: "🥐 Bakery" },
  { value: "tiffin",          label: "🍱 Tiffin Service" },
  { value: "catering",        label: "🎉 Catering" },
  { value: "cooking_class",   label: "👩🍳 Cooking Classes" },
  { value: "homestay",        label: "🏡 Homestay" },
  { value: "food_experience", label: "🌟 Food Experience" },
];

const emptyForm = { title: "", description: "", price: "", category: "homemade", image_url: "" };

const SellerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: products, isLoading } = useQuery({
    queryKey: ["seller-products", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*")
        .eq("seller_id", user!.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: soldData } = useQuery({
    queryKey: ["seller-sold", user?.id],
    queryFn: async () => {
      const { data: prods } = await supabase.from("products").select("id").eq("seller_id", user!.id);
      if (!prods?.length) return { totalSold: 0, totalRevenue: 0 };
      const productIds = prods.map((p) => p.id);
      const { data: orderItems } = await supabase.from("order_items").select("quantity, price").in("product_id", productIds);
      const totalSold = orderItems?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
      const totalRevenue = orderItems?.reduce((sum, i) => sum + i.price * i.quantity, 0) ?? 0;
      return { totalSold, totalRevenue };
    },
    enabled: !!user,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title, description: form.description,
        price: parseFloat(form.price), category: form.category,
        image_url: form.image_url || null, seller_id: user!.id, is_active: true,
      };
      if (editingProduct) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: editingProduct ? "Product updated!" : "Food product added to marketplace!" });
      resetForm();
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product deleted" });
    },
  });

  const resetForm = () => { setForm(emptyForm); setEditingProduct(null); setDialogOpen(false); };

  const openEdit = (p: any) => {
    setEditingProduct(p);
    setForm({ title: p.title, description: p.description || "", price: String(p.price), category: p.category, image_url: p.image_url || "" });
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const ext = file.name.split(".").pop();
    const path = `${user.email}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); return; }
    const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: publicUrl }));
    toast({ title: "Image uploaded!" });
  };

  const getCatLabel = (val: string) => FOOD_CATEGORIES.find((c) => c.value === val)?.label ?? val;

  if (!user) {
    return (
      <div className="container py-16 text-center">
        <ChefHat className="h-16 w-16 mx-auto text-orange-500 mb-4" />
        <h2 className="text-2xl font-heading font-bold mb-2">Sakhi Seller Dashboard</h2>
        <p className="text-muted-foreground mb-6">Login to manage your food products and orders</p>
        <Link to="/auth"><Button size="lg" className="rounded-xl font-bold bg-gradient-to-r from-orange-500 to-primary text-white border-0">Login / Sign Up</Button></Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
            <ChefHat className="h-7 w-7 text-orange-500" /> Sakhi Dashboard 👩🍳
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your food products, tiffin & catering services</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { if (!o) resetForm(); setDialogOpen(o); }}>
          <DialogTrigger asChild>
            <Button className="rounded-xl font-bold bg-gradient-to-r from-orange-500 to-primary text-white border-0">
              <Plus className="h-4 w-4 mr-1" /> Add Food Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Food Product"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
              <div>
                <Label>Product / Service Title</Label>
                <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required placeholder="e.g. Homemade Mango Pickle, Daily Veg Tiffin" className="mt-1" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Ingredients, quantity, delivery area..." className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Price (₹)</Label>
                  <Input type="number" min="1" step="1" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required className="mt-1" />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {FOOD_CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Product Image</Label>
                <Input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1" />
                <p className="text-xs text-muted-foreground mt-1">Or paste image URL below</p>
                <Input value={form.image_url} onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))} placeholder="https://..." className="mt-1" />
                {form.image_url && (
                  <img src={form.image_url} alt="Preview" className="mt-2 h-24 w-24 rounded-lg object-cover border" />
                )}
              </div>
              <Button type="submit" className="w-full rounded-xl font-bold bg-gradient-to-r from-orange-500 to-primary text-white border-0" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving..." : editingProduct ? "Update Product" : "Add to Food Marketplace"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      {!isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Package, value: products?.length ?? 0, label: "Products Listed", color: "text-primary", bg: "bg-primary/10" },
            { icon: ShoppingBag, value: soldData?.totalSold ?? 0, label: "Orders Received", color: "text-orange-500", bg: "bg-orange-500/10" },
            { icon: TrendingUp, value: `₹${(soldData?.totalRevenue ?? 0).toLocaleString("en-IN")}`, label: "Total Revenue", color: "text-green-600", bg: "bg-green-500/10" },
            { icon: Star, value: "4.8★", label: "Avg. Rating", color: "text-yellow-500", bg: "bg-yellow-500/10" },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="flex items-center gap-3 py-4">
                <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className={`text-2xl font-heading font-extrabold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isLoading ? (
        <p className="text-muted-foreground">Loading your food products...</p>
      ) : !products?.length ? (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
          <ChefHat className="h-14 w-14 mx-auto text-orange-500 mb-3" />
          <p className="font-semibold text-lg mb-1">No food products yet</p>
          <p className="text-muted-foreground text-sm mb-4">Add your first food product to start selling on the marketplace</p>
          <Button onClick={() => setDialogOpen(true)} className="rounded-xl font-bold bg-gradient-to-r from-orange-500 to-primary text-white border-0">
            <Plus className="h-4 w-4 mr-1" /> Add Your First Food Product
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p) => (
            <Card key={p.id} className="overflow-hidden hover:shadow-md transition-shadow">
              {p.image_url && (
                <div className="aspect-video overflow-hidden">
                  <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                </div>
              )}
              <CardHeader className="pb-2 pt-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-bold line-clamp-2">{p.title}</CardTitle>
                  <span className="text-xs bg-orange-500/10 text-orange-600 px-2 py-0.5 rounded-full capitalize shrink-0">
                    {getCatLabel(p.category)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {p.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{p.description}</p>}
                <p className="text-orange-500 font-bold text-lg">₹{p.price}</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="flex-1 rounded-lg" onClick={() => openEdit(p)}>
                    <Edit className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" className="rounded-lg" onClick={() => deleteMutation.mutate(p.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
