import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { isAuthenticated } from "@/lib/auth";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name.trim())) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem(
        "aiml_user",
        JSON.stringify({ email, name: isLogin ? email.split("@")[0] : name.trim() }),
      );
      toast({ title: isLogin ? "Welcome back!" : "Account created!", description: "Redirecting to dashboard..." });
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.18),transparent_40%),radial-gradient(circle_at_45%_75%,rgba(20,184,166,0.16),transparent_45%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:38px_38px] opacity-40" />

      <div className="relative z-10 min-h-screen px-4 sm:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-end mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-sm subtext-color hover:text-foreground transition-colors">
              Back to Home <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-center min-h-[78vh]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:flex justify-center"
            >
              <div className="glass rounded-3xl p-10 w-full max-w-md border border-white/15 shadow-[0_22px_60px_rgba(6,14,32,0.45)]">
                <div className="w-20 h-20 rounded-full bg-white mx-auto mb-8 flex items-center justify-center ring-4 ring-white/10">
                  <img src="/logo.png" alt="AIML PlayLab logo" className="w-12 h-12 rounded-full object-cover" />
                </div>
                <h2 className="font-display text-4xl leading-tight font-semibold text-gradient mb-4">
                  Join AIML PlayLab
                </h2>
                <p className="subtext-color text-lg leading-relaxed">
                  Create an account to start exploring personalized AI/ML paths, practicing with games, and building your future.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full max-w-xl mx-auto"
            >
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-5 lg:hidden">
                  <img src="/logo.png" alt="AIML PlayLab logo" className="w-10 h-10 rounded-lg object-cover ring-1 ring-white/20" />
                  <span className="font-display text-xl font-bold text-gradient">AIML PlayLab</span>
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold heading-color mb-2">
                  {isLogin ? "Welcome back" : "Create your account"}
                </h1>
                <p className="subtext-color">
                  {isLogin
                    ? "Sign in to continue your AI learning journey."
                    : "Sign up today and start discovering your potential."}
                </p>
              </div>

              <div className="flex mb-8 bg-muted/40 rounded-xl p-1">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${isLogin ? "gradient-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${!isLogin ? "gradient-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium heading-color mb-2">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-input/70 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:glow-input transition-all"
                      required={!isLogin}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium heading-color mb-2">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-input/70 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:glow-input transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium heading-color mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-input/70 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:glow-input transition-all"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 glow-primary disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
                  ) : (
                    <>
                      {isLogin ? "Sign In" : "Sign Up"} <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline font-medium">
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
