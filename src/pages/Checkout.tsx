import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { Button } from "../components/ui/button";
import { auth, db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";
import { ShieldCheck, ArrowLeft, Lock, Loader2 } from "lucide-react";

export const Checkout = () => {
  const { items, getSummary, clearCart } = useCartStore();
  const { subtotal } = getSummary();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
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
      
      toast.success("Order request saved. Redirecting to WhatsApp...");
      
      clearCart();
      
      // Delay redirect slightly to show toast
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        navigate("/");
      }, 1500);

    } catch (error: any) {
      toast.error(error.message || "Failed to process order.");
    } finally {
      setLoading(false);
    }
  };



  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center text-white/50 tracking-widest uppercase mb-8">
        No items to checkout. <Link to="/shop" className="text-gold-500 underline">Return to shop.</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <button 
        onClick={() => navigate('/cart')} 
        className="text-white/60 hover:text-gold-500 flex items-center gap-2 mb-8 text-sm uppercase tracking-widest transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Cart
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* CHECKOUT FORM */}
        <div className="bg-dark-900 border border-white/10 rounded-3xl p-8 lg:p-12 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <h2 className="text-3xl font-light tracking-widest uppercase mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
            Secure Form <Lock className="w-6 h-6 text-gold-500" />
          </h2>
          
          <form onSubmit={handleCheckout} className="space-y-6">
            <h3 className="text-xl font-medium tracking-wide text-white/80">Contact Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="firstName" placeholder="First Name *" required onChange={handleChange} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors" />
              <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="email" name="email" value={formData.email} placeholder="Email Address *" required onChange={handleChange} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors" />
              <input type="tel" name="phone" placeholder="Phone Number *" required onChange={handleChange} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors" />
            </div>
            
            <h3 className="text-xl font-medium tracking-wide text-white/80 mt-8 pt-4 border-t border-white/10">Shipping Address</h3>
            <input type="text" name="address" placeholder="Street Address *" required onChange={handleChange} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors" />
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="city" placeholder="City *" required onChange={handleChange} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors" />
              <input type="text" name="state" placeholder="State/Province" onChange={handleChange} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors" />
            </div>
            <input type="text" name="zip" placeholder="ZIP / Postal Code" onChange={handleChange} className="w-full max-w-xs bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors" />

            <div className="mt-12">
              <Button type="submit" size="lg" disabled={loading} className="w-full rounded-xl py-6 tracking-widest text-lg font-bold uppercase group">
                {loading ? (
                  <>
                    Processing... <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                  </>
                ) : (
                  <>
                    Place Order <ShieldCheck className="w-5 h-5 ml-2 group-hover:text-black transition-colors" />
                  </>
                )}
              </Button>
            </div>

          </form>
        </div>

        {/* ORDER SUMMARY */}
        <div className="space-y-8">
          <div className="bg-[#111] border border-gold-500/20 rounded-3xl p-8 sticky top-32">
            <h3 className="text-xl font-light tracking-widest uppercase mb-6 border-b border-white/10 pb-4">Order Summary</h3>
            
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar mb-6">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 items-center border-b border-white/5 pb-4">
                  <div className="w-16 h-16 bg-black rounded-lg border border-white/10 flex-shrink-0 p-1">
                    <img src={item.images ? item.images[0] : ""} className="w-full h-full object-cover rounded" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white text-sm tracking-wide">{item.name}</h4>
                    <span className="text-xs text-white/40 uppercase">Qty: {item.quantity}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm tracking-wide bg-black/50 p-6 rounded-2xl border border-white/5">
              <div className="flex justify-between text-white/60">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>VIP Insured Shipping</span>
                <span className="text-gold-500 font-bold text-xs uppercase">Free</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-white/10 mt-4 text-2xl">
                <span className="font-light text-white">Total</span>
                <span className="font-bold text-gold-500">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
