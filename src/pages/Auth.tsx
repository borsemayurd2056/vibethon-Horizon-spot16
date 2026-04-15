import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, User } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { continueAsGuest, isAuthenticated, signInWithOAuth, signInWithSupabase, signUpWithSupabase } from "@/lib/auth";
import { logUserActivity } from "@/lib/progress";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleOAuth = async (provider: "google" | "github") => {
    setLoadingProvider(provider);
    try {
      await signInWithOAuth(provider);
      toast({ title: "Redirecting...", description: `Continuing with ${provider === "google" ? "Google" : "GitHub"}.` });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Authentication failed";
      toast({ title: "Authentication error", description: message, variant: "destructive" });
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleEmailAuth = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password.trim() || (mode === "signup" && !name.trim())) return;

    setFormLoading(true);
    try {
      if (mode === "signup") {
        await signUpWithSupabase(name.trim(), email.trim(), password);
        logUserActivity("auth", `Signed up with email ${email.trim()}`);
      } else {
        await signInWithSupabase(email.trim(), password);
        logUserActivity("auth", `Logged in with email ${email.trim()}`);
      }
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Authentication failed";
      toast({ title: "Authentication error", description: message, variant: "destructive" });
    } finally {
      setFormLoading(false);
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    navigate("/", { replace: true });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: "url('/auth-bg.png')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          filter: "blur(4px)",
          transform: "scale(1.08)",
        }}
      />
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
                  Sign in with one click to access quizzes, games, simulations, and your AI learning dashboard.
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
                <h1 className="font-display text-3xl md:text-4xl font-bold heading-color mb-2">Welcome to AIML PlayLab</h1>
                <p className="subtext-color">Sign up, log in, use OAuth, or continue as guest.</p>
              </div>

              <div className="flex mb-4 bg-muted/40 rounded-xl p-1">
                <button
                  onClick={() => setMode("login")}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${mode === "login" ? "gradient-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Login
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${mode === "signup" ? "gradient-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-3 mb-4">
                {mode === "signup" && (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-input/70 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-input/70 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-input/70 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={formLoading || Boolean(loadingProvider)}
                  className="w-full btn-primary py-3 glow-primary disabled:opacity-50"
                >
                  {formLoading ? "Please wait..." : mode === "signup" ? "Create Account" : "Login"}
                </button>
              </form>

              <div className="flex items-center gap-3 py-1 mb-4">
                <span className="h-px flex-1 bg-white/15" />
                <span className="text-xs text-muted-foreground">OR</span>
                <span className="h-px flex-1 bg-white/15" />
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleOAuth("google")}
                  disabled={Boolean(loadingProvider) || formLoading}
                  className="w-full px-4 py-3 rounded-xl bg-white text-black font-semibold border border-white/50 hover:bg-white/90 transition-all disabled:opacity-60 flex items-center justify-center gap-3"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                    <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.8-5.4 3.8-3.2 0-5.9-2.7-5.9-5.9s2.7-5.9 5.9-5.9c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.7 3.7 14.6 3 12 3 7 3 3 7 3 12s4 9 9 9c5.2 0 8.6-3.6 8.6-8.7 0-.6-.1-1.1-.2-1.6H12z"/>
                  </svg>
                  {loadingProvider === "google" ? "Connecting..." : "Continue with Google"}
                </button>
                <button
                  onClick={() => handleOAuth("github")}
                  disabled={Boolean(loadingProvider) || formLoading}
                  className="w-full px-4 py-3 rounded-xl bg-[#111827] text-white font-semibold border border-white/15 hover:bg-[#1f2937] transition-all disabled:opacity-60 flex items-center justify-center gap-3"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                    <path d="M12 .5C5.65.5.5 5.66.5 12.02c0 5.09 3.29 9.4 7.86 10.93.58.11.79-.26.79-.57 0-.28-.01-1.03-.02-2.02-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.78 2.7 1.27 3.36.97.1-.75.4-1.27.72-1.56-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.19a10.94 10.94 0 0 1 5.79 0c2.21-1.5 3.18-1.19 3.18-1.19.63 1.58.23 2.75.11 3.04.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.77 1.06.77 2.14 0 1.54-.01 2.78-.01 3.16 0 .31.21.69.8.57A11.53 11.53 0 0 0 23.5 12C23.5 5.66 18.35.5 12 .5z"/>
                  </svg>
                  {loadingProvider === "github" ? "Connecting..." : "Continue with GitHub"}
                </button>
                <button
                  onClick={handleGuest}
                  disabled={Boolean(loadingProvider) || formLoading}
                  className="w-full px-4 py-3 rounded-xl bg-transparent text-foreground font-semibold border border-primary/35 hover:bg-primary/10 transition-all disabled:opacity-60"
                >
                  Continue as Guest
                </button>
              </div>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Secure OAuth login powered by Supabase Auth.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
