import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { Button } from "../components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export const Cart = () => {
  const { items, removeItem, updateQuantity, getSummary } = useCartStore();
  const { subtotal } = getSummary();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-light tracking-widest text-white/50 mb-8 uppercase"
        >
          Your cart is empty
        </motion.h2>
        <Link to="/shop">
          <Button size="lg" className="rounded-full tracking-widest uppercase font-bold px-8">
            Discover Watches
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-light tracking-widest uppercase mb-12 border-b border-white/10 pb-6">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-6 bg-dark-900 border border-white/10 p-4 rounded-2xl group hover:border-gold-500/50 transition-colors shadow-lg"
              >
                <div className="w-32 h-32 flex-shrink-0 bg-black rounded-xl overflow-hidden relative border border-white/5">
                  <img src={item.images ? item.images[0] : ""} alt={item.name} className="w-full h-full object-cover p-2 transform group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-medium tracking-wide text-white group-hover:text-gold-400 transition-colors">{item.name}</h3>
                      <p className="text-white/40 uppercase tracking-widest text-xs mt-1">Ref: {item.id.padStart(6, '0')}</p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-white/40 hover:text-red-500 transition-colors p-2"
                      title="Remove"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center gap-4 bg-black border border-white/10 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-2 hover:bg-white/10 rounded-md text-white/80 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium text-lg">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-white/10 rounded-md text-white/80 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-2xl font-semibold tracking-wider text-white">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-dark-900 border border-white/10 rounded-3xl p-8 sticky top-32 shadow-[0_0_30px_rgba(255,215,0,0.05)]">
            <h2 className="text-2xl font-light tracking-widest uppercase mb-8 border-b border-white/10 pb-4">Order Summary</h2>
            
            <div className="space-y-4 text-sm tracking-wide text-white/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Insured Shipping</span>
                <span className="text-gold-500 uppercase font-bold text-xs">Complimentary</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-white/10 mt-4 text-xl">
                <span className="font-light">Total</span>
                <span className="font-bold text-gold-500">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full mt-10 rounded-xl py-6 text-lg tracking-widest uppercase font-bold flex items-center gap-2 group"
              onClick={() => navigate('/checkout')}
            >
              Secure Checkout <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <p className="text-center text-xs text-white/40 mt-6 tracking-wide flex items-center justify-center gap-2">
              All transactions are encrypted and secure.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
