import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Wishlist from "./pages/Wishlist";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Marketplace from "./pages/Marketplace";
import SellerDashboard from "./pages/SellerDashboard";
import JoinAsSeller from "./pages/JoinAsSeller";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Learn from "./pages/Learn";
import AiSuggestions from "./pages/AiSuggestions";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import ExploreByFood from "./pages/ExploreByFood";
import ChefProfile from "./pages/ChefProfile";
import Catering from "./pages/Catering";
import Homestays from "./pages/Homestays";
import CookingClasses from "./pages/CookingClasses";
import TiffinSubscribe from "./pages/TiffinSubscribe";
import Payment from "./pages/Payment";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <LanguageProvider>
    <CartProvider>
    <WishlistProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/join-seller" element={<JoinAsSeller />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/ai-suggestions" element={<AiSuggestions />} />
              <Route path="/help" element={<Help />} />
              <Route path="/explore-food" element={<ExploreByFood />} />
              <Route path="/chef/:chefId" element={<ChefProfile />} />
              <Route path="/tiffin-subscribe/:chefId" element={<ProtectedRoute><TiffinSubscribe /></ProtectedRoute>} />
              <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
              <Route path="/catering" element={<Catering />} />
              <Route path="/homestays" element={<Homestays />} />
              <Route path="/cooking-classes" element={<CookingClasses />} />
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/seller" element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
    </WishlistProvider>
    </CartProvider>
    </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
