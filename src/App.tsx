import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { CustomCursor } from "./components/ui/CustomCursor";
import { Loader2 } from "lucide-react";

import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { ProductDetails } from "./pages/ProductDetails";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Auth } from "./pages/Auth";

const AdminLogin = lazy(() => import("./pages/admin/Login").then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard").then(m => ({ default: m.AdminDashboard })));
import { AdminRoute } from "./components/AdminRoute";

const AdminFallback = () => (
  <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center gap-4">
    <Loader2 className="w-6 h-6 text-gold-400/50 animate-spin" />
    <span className="text-[10px] tracking-[0.4em] uppercase text-white/20">Loading...</span>
  </div>
);

const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <CustomCursor />
      <Navbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(255,215,0,0.3)'
          }
        }} 
      />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="login" element={<Auth />} />
        </Route>
        
        {/* Admin Routes without main Navbar/Footer layout */}
        <Route path="/admin">
          <Route index element={<Suspense fallback={<AdminFallback />}><AdminRoute><AdminDashboard /></AdminRoute></Suspense>} />
          <Route path="login" element={<Suspense fallback={<AdminFallback />}><AdminLogin /></Suspense>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
