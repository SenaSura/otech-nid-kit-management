import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ShieldCheck,
  Loader2,
  Sparkles,
  Server,
  Activity,
  History,
  UserRound
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  
  const navigate = useNavigate();

  const slides = [
    {
      title: "Real-time Asset Tracking",
      desc: "Monitor National ID registration kits dynamically across 23 cities and 21 regional zones.",
      icon: Activity,
      color: "text-red-400"
    },
    {
      title: "Secure Access Control",
      desc: "Enterprise-grade authorization ensuring secure data synchronization and asset records integrity.",
      icon: ShieldCheck,
      color: "text-emerald-400"
    },
    {
      title: "Incident & Maintenance Lifecycle",
      desc: "File repairs, track incident response times, and allocate replacement modules seamlessly.",
      icon: Server,
      color: "text-amber-400"
    },
    {
      title: "Audit & Transit Trails",
      desc: "Full transparency logs recording transfer history, handler reassignments, and audit trails.",
      icon: History,
      color: "text-blue-400"
    }
  ];

  // Auto-play slideshow on the left side
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
    const body = isRegistering ? { name, email, password } : { email, password };

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Unable to authenticate.");
        }
        return data;
      })
      .then(({ user }) => {
        localStorage.setItem("otech_user", JSON.stringify(user));
        navigate("/", { replace: true });
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setIsSubmitting(false));
  };

  const switchMode = () => {
    setIsRegistering((current) => !current);
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-6 overflow-hidden relative">
      
      {/* Dynamic Animated Ambient Background Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-950/20 rounded-full blur-[120px] animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-950/25 rounded-full blur-[150px] animate-pulse duration-[10000ms]" />
      
      <div className="w-full max-w-6xl bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-slate-800/80 overflow-hidden grid lg:grid-cols-2 min-h-[640px]">
        
        {/* Left Side: Advanced Interactive Carousel */}
        <div className="hidden lg:flex bg-gradient-to-b from-slate-950 to-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden border-r border-slate-800/40">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-[80px]" />
          
          <div className="flex items-center gap-3 z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center font-black text-xl shadow-lg shadow-red-500/20">
              O
            </div>
            <div>
              <h2 className="font-bold text-base leading-none tracking-tight">OTech Asset</h2>
              <p className="text-[10px] text-red-500 font-semibold tracking-widest uppercase mt-0.5">Management Suite</p>
            </div>
          </div>

          <div className="my-auto z-10 space-y-8">
            <div className="relative h-48 flex items-end">
              {slides.map((slide, index) => {
                const IconComponent = slide.icon;
                return (
                  <div
                    key={index}
                    className={`absolute inset-0 flex flex-col justify-end transition-all duration-700 transform ${
                      index === activeSlide 
                        ? "opacity-100 translate-y-0 scale-100" 
                        : "opacity-0 translate-y-8 scale-95 pointer-events-none"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className={`p-3 rounded-2xl bg-slate-800/80 border border-slate-700/50 ${slide.color} shadow-inner`}>
                        <IconComponent size={28} />
                      </div>
                      <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Core Capability</span>
                    </div>
                    <h3 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                      {slide.title}
                    </h3>
                    <p className="mt-3 text-slate-400 text-sm leading-relaxed max-w-md">
                      {slide.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Slideshow dot indicators */}
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeSlide ? "w-8 bg-red-500" : "w-2 bg-slate-700 hover:bg-slate-600"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 z-10 pt-6 border-t border-slate-800/30">
            <span>Federal ID Deployment v1.2</span>
            <span>Ethiopian NID Registry</span>
          </div>
        </div>

        {/* Right Side: High-End Glass Form */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative bg-slate-900/30">
          <div className="my-auto space-y-8">
            <div>
              <div className="flex items-center gap-2 text-red-500 font-semibold text-xs uppercase tracking-widest mb-1.5">
                <Sparkles size={14} /> Security Gateway
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight leading-none">
                {isRegistering ? "Create Your Identity" : "Identity Sign-In"}
              </h1>
              <p className="text-slate-400 mt-2 text-sm">
                {isRegistering ? "Create an account for the Asset Management Console." : "Access the National Asset Management Console."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegistering && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 focus-within:border-red-500/80 focus-within:ring-1 focus-within:ring-red-500/25 transition-all">
                    <UserRound size={18} className="text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent outline-none ml-3 text-sm text-slate-100 placeholder-slate-600"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 focus-within:border-red-500/80 focus-within:ring-1 focus-within:ring-red-500/25 transition-all">
                  <Mail size={18} className="text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="name@otech.gov.et or admin"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent outline-none ml-3 text-sm text-slate-100 placeholder-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3.5 focus-within:border-red-500/80 focus-within:ring-1 focus-within:ring-red-500/25 transition-all">
                  <Lock size={18} className="text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent outline-none ml-3 text-sm text-slate-100 placeholder-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {!isRegistering && <div className="flex justify-between items-center text-xs pt-1">
                <label className="flex items-center gap-2.5 text-slate-400 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="rounded bg-slate-950 border-slate-800 text-red-600 focus:ring-0 focus:ring-offset-0 transition"
                  />
                  <span className="group-hover:text-slate-300 transition-colors">Keep session active</span>
                </label>
                <a href="#" className="text-red-500 hover:text-red-400 font-medium transition-colors">
                  Reset Token?
                </a>
              </div>}

              {error && <p role="alert" className="text-sm text-red-400 bg-red-950/40 border border-red-900/50 rounded-xl px-4 py-3">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white py-4 rounded-2xl font-bold tracking-wide transition shadow-lg shadow-red-500/10 hover:shadow-red-500/20 active:scale-[0.98] transform flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-800 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-slate-300" />
                    {isRegistering ? "Creating Account..." : "Verifying Identity..."}
                  </>
                ) : (
                  isRegistering ? "Create Account" : "Authenticate Session"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500">
              {isRegistering ? "Already have an account?" : "Need an account?"}{" "}
              <button type="button" onClick={switchMode} className="text-red-500 hover:text-red-400 font-semibold">
                {isRegistering ? "Sign in" : "Create one"}
              </button>
            </p>
          </div>

          <div className="mt-8 text-center text-xs text-slate-600">
            © 2026 OTech Solutions. All rights reserved.
          </div>
        </div>

      </div>
    </div>
  );
}