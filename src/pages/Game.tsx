import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Zap, BarChart3 } from "lucide-react";
import Layout from "@/components/Layout";
import { updateUserProgress } from "@/lib/progress";

const Game = () => {
  const [hours, setHours] = useState("");
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const train = () => {
    const h = parseFloat(hours);
    if (isNaN(h) || h < 0) return;
    setLoading(true);
    setPrediction(null);
    setTimeout(() => {
      // Simple linear model: marks = 10 * hours + 5 + noise
      const marks = Math.min(100, Math.max(0, Math.round(10 * h + 5 + (Math.random() * 10 - 5))));
      setPrediction(marks);
      updateUserProgress((progress) => {
        const gamesPlayed = progress.gamesPlayed + 1;
        return {
          ...progress,
          gamesPlayed,
          points: progress.completedTopicIds.length * 100 + progress.quizAttempts * 50 + gamesPlayed * 30 + progress.simulationsRun * 20,
        };
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Train Your Model <span className="text-gradient">🎮</span>
          </h1>
          <p className="text-muted-foreground">Enter study hours and let the AI predict your marks!</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-8 w-full max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <Gamepad2 className="w-6 h-6 text-accent" />
            <h2 className="font-display text-lg font-semibold">Model Trainer</h2>
          </div>

          <label className="block text-sm text-muted-foreground mb-2">Study Hours</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="e.g. 5"
            className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:glow-input transition-all mb-6"
          />

          <button
            onClick={train}
            disabled={loading || !hours}
            className="w-full gradient-primary text-primary-foreground py-3 rounded-xl font-semibold glow-primary hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <Zap className="w-5 h-5" />
              </motion.div>
            ) : (
              <>
                <Zap className="w-5 h-5" /> Train Model
              </>
            )}
          </button>

          <AnimatePresence>
            {prediction !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="mt-6 p-6 rounded-xl bg-accent/10 border border-accent/20 text-center"
              >
                <BarChart3 className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Predicted Marks</p>
                <p className="font-display text-4xl font-bold text-accent">{prediction}%</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Game;
