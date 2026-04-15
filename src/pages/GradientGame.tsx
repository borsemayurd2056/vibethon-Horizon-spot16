import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MoveLeft, MoveRight, RotateCcw, Radar } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { logUserActivity, updateUserProgress } from "@/lib/progress";

const TRACK_MIN = 0;
const TRACK_MAX = 100;
const STEP = 8;
const WIN_THRESHOLD = 6;

const GradientGame = () => {
  const hiddenMinimum = useMemo(() => 62, []);
  const [position, setPosition] = useState(14);
  const [lastDistance, setLastDistance] = useState(Math.abs(14 - hiddenMinimum));
  const [status, setStatus] = useState("Use controls to begin optimization.");
  const [isWon, setIsWon] = useState(false);
  const [moves, setMoves] = useState(0);

  const currentDistance = Math.abs(position - hiddenMinimum);
  const lossPercent = Math.min(100, Math.round((currentDistance / 50) * 100));

  const updateStatusByPosition = (nextPosition: number) => {
    const nextDistance = Math.abs(nextPosition - hiddenMinimum);

    if (nextDistance <= WIN_THRESHOLD) {
      if (!isWon) {
        updateUserProgress((progress) => {
          const gamesPlayed = progress.gamesPlayed + 1;
          return {
            ...progress,
            gamesPlayed,
            points: progress.completedTopicIds.length * 100 + progress.quizAttempts * 50 + gamesPlayed * 30 + progress.simulationsRun * 20,
          };
        });
        logUserActivity("game", `Completed Gradient Descent Racer in ${moves + 1} moves`);
      }
      setStatus("You found the minimum! 🎯 Model optimized successfully.");
      setIsWon(true);
    } else if (nextDistance < lastDistance) {
      setStatus("Optimizing... Loss decreasing 📉");
    } else if (nextDistance > lastDistance) {
      setStatus("Finding minimum loss... Loss increasing 📈");
    } else {
      setStatus("Loss unchanged. Try a different direction.");
    }

    setLastDistance(nextDistance);
  };

  const moveLeft = () => {
    if (isWon) return;
    const nextPosition = Math.max(TRACK_MIN, position - STEP);
    setPosition(nextPosition);
    setMoves((prev) => prev + 1);
    updateStatusByPosition(nextPosition);
  };

  const moveRight = () => {
    if (isWon) return;
    const nextPosition = Math.min(TRACK_MAX, position + STEP);
    setPosition(nextPosition);
    setMoves((prev) => prev + 1);
    updateStatusByPosition(nextPosition);
  };

  const resetGame = () => {
    setPosition(14);
    setLastDistance(Math.abs(14 - hiddenMinimum));
    setStatus("Use controls to begin optimization.");
    setIsWon(false);
    setMoves(0);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="w-full max-w-3xl mb-5">
          <Link to="/game" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Games
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Gradient Descent Racer <span className="text-gradient">🏁</span>
          </h1>
          <p className="text-muted-foreground">Optimize your model by finding the minimum loss.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-2xl p-8 w-full max-w-3xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-sm">
              <Radar className="w-4 h-4 text-cyan-300" />
              Current Loss: <span className="font-semibold">{lossPercent}%</span>
            </div>
            <div className="text-sm text-muted-foreground">Moves: {moves}</div>
          </div>

          <div className="relative rounded-2xl border border-border/70 bg-background/40 p-6 mb-6 overflow-hidden">
            <div className="h-24 rounded-xl bg-[linear-gradient(to_right,rgba(59,130,246,0.12),rgba(34,211,238,0.08),rgba(167,139,250,0.12))] border border-white/10 relative">
              <div className="absolute inset-y-0 left-1/2 w-px bg-white/15" />
              <motion.div
                className={`absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border-2 ${
                  isWon ? "bg-emerald-400 border-emerald-200 shadow-[0_0_24px_rgba(52,211,153,0.7)]" : "bg-primary border-primary-foreground/60 shadow-[0_0_24px_rgba(99,102,241,0.7)]"
                }`}
                animate={{ left: `calc(${position}% - 14px)` }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
              />
            </div>
          </div>

          <p className={`mb-6 text-sm ${isWon ? "text-emerald-300" : "text-muted-foreground"}`}>
            {status}
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={moveLeft}
              disabled={isWon}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MoveLeft className="w-4 h-4" /> Move Left
            </button>
            <button
              onClick={moveRight}
              disabled={isWon}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Move Right <MoveRight className="w-4 h-4" />
            </button>
            <button
              onClick={resetGame}
              className="inline-flex items-center gap-2 rounded-xl gradient-primary text-primary-foreground px-5 py-2.5 font-semibold glow-primary hover:scale-[1.02] transition-transform"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default GradientGame;
