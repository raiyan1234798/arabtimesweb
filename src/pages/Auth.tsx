import { useState, useEffect, useRef } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged,
  signInWithPopup,
  signInWithPhoneNumber,
  type ConfirmationResult
} from "firebase/auth";
import { auth, googleProvider, RecaptchaVerifier } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Lock, Mail, User, ArrowRight, Sparkles, ShieldCheck, Clock, Phone, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const recaptchaVerifierRef = useRef<InstanceType<typeof RecaptchaVerifier> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in
      }
    });
    return () => {
      unsubscribe();
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;
    };
  }, []);

  const setupRecaptcha = () => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
      });
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Welcome back to the Circle");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Welcome to Arab Times");
      }
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Signed in with Google");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = recaptchaVerifierRef.current!;
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(confirmation);
      setShowOtp(true);
      toast.success("Verification code sent");
    } catch (error: any) {
      toast.error(error.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !confirmationResult) return;
    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      toast.success("Phone verified successfully");
      navigate("/");
    } catch (error: any) {
      toast.error("Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 bg-dark-950 relative overflow-hidden">
      <div id="recaptcha-container"></div>
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,215,0,0.03)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(255,215,0,0.03)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Side: Branding/Value Prop */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-5xl font-light tracking-widest text-white leading-tight uppercase">
              The <span className="text-gold-500 font-medium">Arab Times</span> <br /> 
              Collector's Circle
            </h1>
            <p className="text-white/60 text-lg font-light tracking-wide max-w-md">
              Join an exclusive community of horological enthusiasts. Secure your dream timepiece and manage your collection with ease.
            </p>
          </div>

          <div className="space-y-6 pt-6">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-gold-500/50 transition-colors">
                 <ShieldCheck className="w-5 h-5 text-gold-500" />
              </div>
              <div>
                <h4 className="text-white font-medium tracking-wide">Secure Membership</h4>
                <p className="text-white/40 text-sm italic">Industry-standard encryption for your data.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-gold-500/50 transition-colors">
                 <Clock className="w-5 h-5 text-gold-500" />
              </div>
              <div>
                <h4 className="text-white font-medium tracking-wide">First Access</h4>
                <p className="text-white/40 text-sm italic">Be the first to see our newest arrivals.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-gold-500/50 transition-colors">
                 <Sparkles className="w-5 h-5 text-gold-500" />
              </div>
              <div>
                <h4 className="text-white font-medium tracking-wide">Private Concierge</h4>
                <p className="text-white/40 text-sm italic">Dedicated support for your acquisition needs.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Auth Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#111] border border-white/10 p-8 md:p-12 rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold-500/5 blur-[80px] rounded-full pointer-events-none" />

          <div className="text-center mb-8">
            <h2 className="text-2xl font-light tracking-[0.2em] text-white uppercase mb-3 text-balance">
              {showOtp ? "Verify Phone" : (isLogin ? "Member Login" : "Join the Circle")}
            </h2>
            <div className="h-0.5 w-12 bg-gold-500 mx-auto" />
          </div>

          {!showOtp && (
            <div className="flex bg-black/50 p-1 rounded-2xl border border-white/5 mb-8">
              <button 
                onClick={() => setAuthMethod("email")}
                className={`flex-1 py-3 rounded-xl text-xs uppercase tracking-widest transition-all ${authMethod === "email" ? "bg-gold-500 text-black font-bold" : "text-white/40 hover:text-white"}`}
              >
                Email
              </button>
              <button 
                onClick={() => setAuthMethod("phone")}
                className={`flex-1 py-3 rounded-xl text-xs uppercase tracking-widest transition-all ${authMethod === "phone" ? "bg-gold-500 text-black font-bold" : "text-white/40 hover:text-white"}`}
              >
                Phone
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {showOtp ? (
              <motion.form 
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleOtpVerify} 
                className="space-y-6"
              >
                <div className="relative group">
                  <input 
                    type="text" 
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="Enter 6-digit Code" 
                    className="w-full bg-black border border-white/10 rounded-2xl px-4 py-4 pl-12 text-white focus:outline-none focus:border-gold-500 transition-all text-center tracking-[1em]"
                    required 
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full rounded-2xl py-6 tracking-widest uppercase font-bold text-lg mt-4 group">
                  {loading ? "Verifying..." : "Verify & Enter"}
                </Button>
                <button type="button" onClick={() => setShowOtp(false)} className="w-full text-center text-white/40 text-xs uppercase tracking-widest hover:text-gold-500 pt-2">
                  Request New Code
                </button>
              </motion.form>
            ) : authMethod === "email" ? (
              <motion.form 
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleEmailAuth} 
                className="space-y-6"
              >
                {!isLogin && (
                  <div className="relative group">
                    <input 
                      type="text" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Full Name" 
                      className="w-full bg-black border border-white/10 rounded-2xl px-4 py-4 pl-12 text-white focus:outline-none focus:border-gold-500 transition-all placeholder:text-white/20"
                      required 
                    />
                    <User className="absolute left-4 top-4.5 w-5 h-5 text-white/40 group-focus-within:text-gold-500 transition-colors" />
                  </div>
                )}

                <div className="relative group">
                  <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email Address" 
                    className="w-full bg-black border border-white/10 rounded-2xl px-4 py-4 pl-12 text-white focus:outline-none focus:border-gold-500 transition-all placeholder:text-white/20"
                    required 
                  />
                  <Mail className="absolute left-4 top-4.5 w-5 h-5 text-white/40 group-focus-within:text-gold-500 transition-colors" />
                </div>

                <div className="relative group">
                  <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password" 
                    className="w-full bg-black border border-white/10 rounded-2xl px-4 py-4 pl-12 text-white focus:outline-none focus:border-gold-500 transition-all placeholder:text-white/20"
                    required 
                  />
                  <Lock className="absolute left-4 top-4.5 w-5 h-5 text-white/40 group-focus-within:text-gold-500 transition-colors" />
                </div>

                <Button type="submit" disabled={loading} className="w-full rounded-2xl py-6 tracking-widest uppercase font-bold text-lg mt-4 group">
                  <span className="flex items-center justify-center gap-3">
                    {loading ? "Processing..." : (isLogin ? "Enter the Circle" : "Become a Member")}
                    {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </span>
                </Button>
              </motion.form>
            ) : (
              <motion.form 
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handlePhoneSubmit} 
                className="space-y-6"
              >
                <div className="relative group">
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 00000 00000" 
                    className="w-full bg-black border border-white/10 rounded-2xl px-4 py-4 pl-12 text-white focus:outline-none focus:border-gold-500 transition-all placeholder:text-white/20"
                    required 
                  />
                  <Smartphone className="absolute left-4 top-4.5 w-5 h-5 text-white/40 group-focus-within:text-gold-500 transition-colors" />
                </div>
                <Button type="submit" disabled={loading} className="w-full rounded-2xl py-6 tracking-widest uppercase font-bold text-lg mt-4 group">
                  <span className="flex items-center justify-center gap-3">
                    {loading ? "Sending..." : "Send Verification Code"}
                    {!loading && <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                  </span>
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Social Auth */}
          {!showOtp && (
            <div className="mt-8 space-y-4">
               <div className="flex items-center gap-4 py-2">
                 <div className="h-px bg-white/10 flex-grow" />
                 <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Or continue with</span>
                 <div className="h-px bg-white/10 flex-grow" />
               </div>
               <button 
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/90 transition-all active:scale-95 disabled:opacity-50"
               >
                 <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                 <span className="uppercase tracking-widest text-xs">Google Account</span>
               </button>
            </div>
          )}

          <div className="mt-10 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-white/40 hover:text-gold-500 transition-colors text-sm tracking-widest uppercase font-medium"
            >
              {isLogin ? "Don't have an account? Join us" : "Already a member? Sign in"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

