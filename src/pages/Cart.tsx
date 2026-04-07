import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ArrowRight, ArrowLeft } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { Button } from "../components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export const Cart = () => {
  const { items, removeItem, updateQuantity, getSummary } = useCartStore();
  const { subtotal } = getSummary();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="font-display text-3xl md:text-4xl font-light text-white/40 mb-4 tracking-wide">Your cart is empty</h2>
          <p className="text-white/15 text-sm mb-10 tracking-wider">Discover our collection of luxury timepieces</p>
          <Link to="/shop">
            <Button className="rounded-none tracking-[0.3em] uppercase text-[11px] px-10 py-5">
              Browse Collection
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-28 md:pt-36 pb-24">

        {/* Header */}
        <div className="flex items-center justify-between mb-12 md:mb-16 pb-6 border-b border-white/[0.04]">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/15 mb-2">Shopping</p>
            <h1 className="font-display text-3xl md:text-4xl font-light text-white/90 tracking-wide">Cart</h1>
          </div>
          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="text-[10px] tracking-[0.3em] uppercase text-white/20 hover:text-white/50 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Continue Shopping
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* ─── Items ─── */}
          <div className="lg:col-span-2 space-y-0">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-6 py-8 border-b border-white/[0.04] group"
                >
                  {/* Image */}
                  <Link to={`/product/${item.id}`} className="w-28 h-28 md:w-36 md:h-36 bg-[#060606] flex-shrink-0">
                    <img
                      src={item.images ? item.images[0] : ""}
                      alt={item.name}
                      className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-700"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <Link to={`/product/${item.id}`} className="font-display text-base md:text-lg text-white/80 font-light tracking-wide hover:text-white/100 transition-colors">
                            {item.name}
                          </Link>
                          <p className="text-[10px] tracking-[0.2em] uppercase text-white/15 mt-1">
                            Ref: {item.id.substring(0, 8).toUpperCase()}
                          </p>
                        </div>
                        <button
                          type="button"
                          title="Remove item"
                          onClick={() => removeItem(item.id)}
                          className="text-white/10 hover:text-red-400/60 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center gap-4 border border-white/[0.06]">
                        <button
                          type="button"
                          title="Decrease quantity"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-2.5 text-white/30 hover:text-white/60 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-light text-white/60">{item.quantity}</span>
                        <button
                          type="button"
                          title="Increase quantity"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2.5 text-white/30 hover:text-white/60 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <p className="font-display text-lg md:text-xl text-white/70 font-light tracking-wider">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ─── Summary ─── */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-[#060606] p-8 md:p-10">
              <h2 className="font-display text-lg font-light tracking-wider text-white/60 mb-8 pb-4 border-b border-white/[0.04]">
                Summary
              </h2>

              <div className="space-y-4 text-sm mb-8">
                <div className="flex justify-between text-white/30">
                  <span className="font-light tracking-wider">Subtotal</span>
                  <span className="text-white/60">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-white/30">
                  <span className="font-light tracking-wider">Shipping</span>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-gold-400/50">Complimentary</span>
                </div>
                <div className="flex justify-between pt-6 border-t border-white/[0.04]">
                  <span className="font-display text-lg text-white/60 font-light">Total</span>
                  <span className="font-display text-xl text-gold-400/80 font-light tracking-wider">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full rounded-none py-6 text-[11px] tracking-[0.3em] uppercase font-medium group"
                onClick={() => navigate("/checkout")}
              >
                Checkout <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <p className="text-center text-[10px] text-white/10 mt-6 tracking-wider">
                Secure & encrypted transaction
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
