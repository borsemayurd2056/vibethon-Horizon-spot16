import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanSearch, ShieldCheck, ShieldAlert, Sparkles, Send } from "lucide-react";
import Layout from "@/components/Layout";
import { updateUserProgress } from "@/lib/progress";

const spamKeywords = ["win", "free", "click", "prize", "offer", "buy now", "limited", "congratulations", "winner", "claim", "cash", "money", "urgent", "act now", "subscribe", "discount"];

const Simulation = () => {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<null | { isSpam: boolean; confidence: number }>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const analyze = () => {
    if (!message.trim()) return;
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      const lower = message.toLowerCase();
      const matchCount = spamKeywords.filter((k) => lower.includes(k)).length;
      const confidence = Math.min(98, Math.max(15, matchCount * 18 + Math.random() * 10));
      const isSpam = matchCount >= 2 || confidence > 55;
      setResult({ isSpam, confidence: Math.round(confidence) });
      updateUserProgress((progress) => {
        const simulationsRun = progress.simulationsRun + 1;
        return {
          ...progress,
          simulationsRun,
          points: progress.completedTopicIds.length * 100 + progress.quizAttempts * 50 + progress.gamesPlayed * 30 + simulationsRun * 20,
        };
      });
      setAnalyzing(false);
    }, 1800);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-4 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-accent" /> AI Simulation Lab
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Spam <span className="text-gradient">Detection</span> 🔍
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">Enter a message and let the AI classify it as Spam or Not Spam using keyword analysis.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-8 w-full max-w-lg">
          <div className="flex items-center gap-3 mb-6">
            <ScanSearch className="w-6 h-6 text-primary" />
            <h2 className="font-display text-lg font-semibold">Message Analyzer</h2>
          </div>

          <label className="block text-sm text-muted-foreground mb-2">Enter Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='e.g. "Congratulations! You have won a free prize. Click here to claim now!"'
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:glow-input transition-all mb-6 resize-none"
          />

          <button
            onClick={analyze}
            disabled={analyzing || !message.trim()}
            className="w-full gradient-primary text-primary-foreground py-3 rounded-xl font-semibold glow-primary hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
            ) : (
              <>
                <Send className="w-5 h-5" /> Analyze
              </>
            )}
          </button>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 200 }}
                className={`mt-6 p-6 rounded-xl border text-center ${
                  result.isSpam ? "bg-destructive/10 border-destructive/30" : "bg-accent/10 border-accent/30"
                }`}
              >
                {result.isSpam ? (
                  <ShieldAlert className="w-10 h-10 text-destructive mx-auto mb-2" />
                ) : (
                  <ShieldCheck className="w-10 h-10 text-accent mx-auto mb-2" />
                )}
                <p className="font-display text-2xl font-bold mb-1">
                  {result.isSpam ? "🚨 Spam Detected" : "✅ Not Spam"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Confidence: <span className="font-semibold text-foreground">{result.confidence}%</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* How it works */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass rounded-2xl p-6 w-full max-w-lg mt-6">
          <h3 className="font-display text-sm font-semibold mb-3 text-muted-foreground">HOW IT WORKS</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>1. The analyzer scans your message for common spam keywords</p>
            <p>2. A confidence score is calculated based on keyword matches</p>
            <p>3. Messages with 2+ spam keywords are classified as spam</p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Simulation;
