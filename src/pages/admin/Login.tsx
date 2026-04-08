import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Lock, User } from "lucide-react";
import toast from "react-hot-toast";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "";

export const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email !== ADMIN_EMAIL) {
      toast.error("Access Denied: You are not authorized to access the governing panel.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Identity Verified. Welcome back.");
      navigate("/admin");
    } catch (error: any) {
      toast.error(error.message || "Authentication stalled. Verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user.email === ADMIN_EMAIL) {
        toast.success("Admin Identity Verified via Google.");
        navigate("/admin");
      } else {
        toast.error("Unauthorized: This Google account does not have admin privileges.");
        await auth.signOut();
      }
    } catch (error: any) {
      toast.error(error.message || "Google authentication failed.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.05)_0%,rgba(5,5,5,1)_100%)] pointer-events-none" />
      
      <div className="w-full max-w-md bg-[#111] border border-white/10 p-10 rounded-3xl relative z-10 shadow-[0_0_50px_rgba(255,215,0,0.02)]">
        <div className="text-center mb-10">
          <div className="bg-dark-900 border border-gold-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(255,215,0,0.1)]">
            <Lock className="w-6 h-6 text-gold-500" />
          </div>
          <h1 className="text-2xl font-light tracking-widest text-white uppercase mb-2">Admin Identity</h1>
          <p className="text-white/40 text-sm tracking-wide">Enter credentials to govern the boutique.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative group">
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email" 
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 pl-12 text-white focus:outline-none focus:border-gold-500 transition-colors"
              required 
            />
            <User className="absolute left-4 top-4 w-5 h-5 text-white/40 group-focus-within:text-gold-500 transition-colors" />
          </div>

          <div className="relative group">
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Passcode" 
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 pl-12 text-white focus:outline-none focus:border-gold-500 transition-colors"
              required 
            />
            <Lock className="absolute left-4 top-4 w-5 h-5 text-white/40 group-focus-within:text-gold-500 transition-colors" />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-xl py-6 tracking-widest uppercase font-bold text-lg mt-8 shadow-lg hover:shadow-gold-500/20 transition-all"
          >
            {loading ? "Authenticating..." : "Authenticate"}
          </Button>
        </form>

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm uppercase tracking-tighter">
            <span className="bg-[#111] px-4 text-white/40">Or continue with</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full mt-8 bg-white text-black flex items-center justify-center gap-3 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-100 transition-all disabled:opacity-50"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Admin Google Sign-In
        </button>
      </div>
    </div>
  );
};

