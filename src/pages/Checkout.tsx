import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { Button } from "../components/ui/button";
import { auth, db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged, type User } from "firebase/auth";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2 } from "lucide-react";

const inputClass = "w-full bg-transparent border border-white/[0.06] px-4 py-3.5 text-sm text-white tracking-wider font-light focus:outline-none focus:border-white/20 placeholder:text-white/10 transition-colors";

export const Checkout = () => {
  const { items, getSummary, clearCart } = useCartStore();
  const { subtotal } = getSummary();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u?.email) setFormData(prev => ({ ...prev, email: u.email || "" }));
    });
    return () => unsub();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.address || !formData.phone) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: (item.images && item.images.length > 0) ? item.images[0] : ""
      }));

      const orderData = {
        userId: user?.uid || "guest",
        customer: formData,
        items: orderItems,
        subtotal,
        status: "pending",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "orders"), orderData);

      // WhatsApp Redirect Logic
      const whatsappNumber = "+917397026980";
      let message = `*New Order Request from Arab Times*%0A%0A`;
      message += `*Customer:* ${formData.firstName} ${formData.lastName}%0A`;
      message += `*Phone:* ${formData.phone}%0A`;
      message += `*Email:* ${formData.email}%0A%0A`;
      message += `*Shipping Address:*%0A`;
      message += `${formData.address}%0A`;
      message += `${formData.city}${formData.state ? `, ${formData.state}` : ""}${formData.zip ? ` - ${formData.zip}` : ""}%0A%0A`;
      message += `*Items:*%0A`;

      orderItems.forEach((item, index) => {
        message += `${index + 1}. *${item.name}*%0A`;
        message += `   ID: ${item.id}%0A`;
        message += `   Rate: ₹${item.price.toLocaleString('en-IN')}%0A`;
        message += `   Qty: ${item.quantity}%0A`;
        message += `   Image: ${item.image}%0A%0A`;
      });

      message += `*Total Amount: ₹${subtotal.toLocaleString('en-IN')}*%0A%0A`;
      message += `Please confirm my order. Thank you!`;

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

      toast.success("Redirecting to WhatsApp...");
      clearCart();

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        navigate("/");
      }, 1500);

    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to process order.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center px-6">
        <div>
          <p className="text-white/20 text-sm tracking-wider mb-4">No items to checkout.</p>
          <Link to="/shop" className="text-[11px] tracking-[0.3em] uppercase text-gold-400/60 hover:text-gold-400 border-b border-gold-400/20 pb-1 transition-colors">
            Return to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-28 md:pt-36 pb-24">

        <button
          type="button"
          onClick={() => navigate('/cart')}
          className="text-white/15 hover:text-white/40 flex items-center gap-2 mb-12 text-[10px] tracking-[0.3em] uppercase transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Cart
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-20">

          {/* ─── Form ─── */}
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-light tracking-wide text-white/80 mb-10 pb-6 border-b border-white/[0.04]">
              Checkout
            </h2>

            <form onSubmit={handleCheckout} className="space-y-8">
              {/* Contact */}
              <div>
                <p className="text-[10px] tracking-[0.4em] uppercase text-white/20 mb-5">Contact</p>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" name="firstName" placeholder="First Name *" required onChange={handleChange} className={inputClass} />
                  <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} className={inputClass} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <input type="email" name="email" value={formData.email} placeholder="Email *" required onChange={handleChange} className={inputClass} />
                  <input type="tel" name="phone" placeholder="Phone *" required onChange={handleChange} className={inputClass} />
                </div>
              </div>

              {/* Address */}
              <div>
                <p className="text-[10px] tracking-[0.4em] uppercase text-white/20 mb-5">Shipping Address</p>
                <input type="text" name="address" placeholder="Street Address *" required onChange={handleChange} className={`${inputClass} mb-3`} />
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input type="text" name="city" placeholder="City *" required onChange={handleChange} className={inputClass} />
                  <input type="text" name="state" placeholder="State" onChange={handleChange} className={inputClass} />
                </div>
                <input type="text" name="zip" placeholder="ZIP / Postal Code" onChange={handleChange} className={`${inputClass} max-w-[200px]`} />
              </div>

              <div className="pt-4">
                <Button type="submit" size="lg" disabled={loading} className="w-full rounded-none py-6 tracking-[0.3em] text-[11px] uppercase font-medium">
                  {loading ? (
                    <span className="flex items-center gap-2">Processing <Loader2 className="w-4 h-4 animate-spin" /></span>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* ─── Summary ─── */}
          <div>
            <div className="sticky top-32 bg-[#060606] p-8 md:p-10">
              <h3 className="font-display text-lg font-light tracking-wider text-white/50 mb-8 pb-4 border-b border-white/[0.04]">
                Order Summary
              </h3>

              <div className="space-y-5 max-h-[40vh] overflow-y-auto no-scrollbar mb-8">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-[#0a0a0a] flex-shrink-0">
                      <img src={item.images ? item.images[0] : ""} alt={item.name} className="w-full h-full object-contain p-1.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white/60 text-sm font-light tracking-wide truncate">{item.name}</h4>
                      <span className="text-[10px] text-white/20 tracking-wider">Qty: {item.quantity}</span>
                    </div>
                    <p className="text-white/50 text-sm font-light tracking-wider flex-shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm pt-6 border-t border-white/[0.04]">
                <div className="flex justify-between text-white/25">
                  <span className="tracking-wider font-light">Subtotal</span>
                  <span className="text-white/40">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-white/25">
                  <span className="tracking-wider font-light">Shipping</span>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-gold-400/40">Complimentary</span>
                </div>
                <div className="flex justify-between pt-5 border-t border-white/[0.04] mt-3">
                  <span className="font-display text-lg text-white/50">Total</span>
                  <span className="font-display text-xl text-gold-400/70 tracking-wider">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
