import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Sigma } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { logUserActivity, updateUserProgress } from "@/lib/progress";

type KnnScenario = {
  id: string;
  title: string;
  dataset: { hours: number; result: "Pass" | "Fail" }[];
  queryHours: number;
  options: ("Pass" | "Fail")[];
  correctAnswer: "Pass" | "Fail";
  nearestNeighbors: { hours: number; result: "Pass" | "Fail" }[];
  explanation: string;
};

const knnScenarios: KnnScenario[] = [
  {
    id: "knn-1",
    title: "Study Performance Dataset A",
    dataset: [
      { hours: 2, result: "Fail" },
      { hours: 3, result: "Fail" },
      { hours: 6, result: "Pass" },
      { hours: 8, result: "Pass" },
    ],
    queryHours: 5,
    options: ["Pass", "Fail"],
    correctAnswer: "Pass",
    nearestNeighbors: [
      { hours: 6, result: "Pass" },
      { hours: 3, result: "Fail" },
      { hours: 8, result: "Pass" },
    ],
    explanation: "For 5 study hours, the nearest points mostly belong to Pass, so KNN predicts Pass.",
  },
  {
    id: "knn-2",
    title: "Study Performance Dataset B",
    dataset: [
      { hours: 1, result: "Fail" },
      { hours: 2, result: "Fail" },
      { hours: 4, result: "Fail" },
      { hours: 7, result: "Pass" },
    ],
    queryHours: 3,
    options: ["Pass", "Fail"],
    correctAnswer: "Fail",
    nearestNeighbors: [
      { hours: 2, result: "Fail" },
      { hours: 4, result: "Fail" },
      { hours: 1, result: "Fail" },
    ],
    explanation: "Neighbors around 3 hours are mostly Fail labels, so the majority vote is Fail.",
  },
  {
    id: "knn-3",
    title: "Study Performance Dataset C",
    dataset: [
      { hours: 3, result: "Fail" },
      { hours: 5, result: "Pass" },
      { hours: 6, result: "Pass" },
      { hours: 9, result: "Pass" },
    ],
    queryHours: 4,
    options: ["Pass", "Fail"],
    correctAnswer: "Pass",
    nearestNeighbors: [
      { hours: 5, result: "Pass" },
      { hours: 3, result: "Fail" },
      { hours: 6, result: "Pass" },
    ],
    explanation: "Two of the three nearest neighbors are Pass, so KNN classifies 4 hours as Pass.",
  },
];

const KnnGame = () => {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<"Pass" | "Fail" | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const scenario = knnScenarios[scenarioIndex];
  const isCorrect = selectedAnswer === scenario.correctAnswer;

  const handleCheck = () => {
    if (!selectedAnswer || revealed) return;
    setIsAnalyzing(true);
    window.setTimeout(() => {
      setIsAnalyzing(false);
      setRevealed(true);
      if (selectedAnswer === scenario.correctAnswer) {
        setScore((prev) => prev + 1);
      }
    }, 700);
  };

  const nextScenario = () => {
    if (scenarioIndex + 1 < knnScenarios.length) {
      setScenarioIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setRevealed(false);
      return;
    }
    updateUserProgress((progress) => {
      const gamesPlayed = progress.gamesPlayed + 1;
      return {
        ...progress,
        gamesPlayed,
        points: progress.completedTopicIds.length * 100 + progress.quizAttempts * 50 + gamesPlayed * 30 + progress.simulationsRun * 20,
      };
    });
    logUserActivity("game", `Completed KNN Classifier Game with score ${score}/${knnScenarios.length}`);
    setIsFinished(true);
  };

  const reset = () => {
    setScenarioIndex(0);
    setSelectedAnswer(null);
    setRevealed(false);
    setIsAnalyzing(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="w-full max-w-2xl mb-5">
          <Link to="/game" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Games
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            KNN Classifier Game <span className="text-gradient">🧠</span>
          </h1>
          <p className="text-muted-foreground">Learn how nearest neighbors drive ML predictions.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-2xl p-8 w-full max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-primary">Scenario {scenarioIndex + 1} / {knnScenarios.length}</p>
            <div className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-sm">
              <Trophy className="w-4 h-4 text-yellow-300" />
              <span className="font-semibold">{score}</span>/<span>{knnScenarios.length}</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isFinished ? (
              <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-primary/20 bg-primary/10 p-6 text-center">
                <p className="text-muted-foreground mb-2">Classification Complete</p>
                <p className="font-display text-4xl text-accent mb-3">{score}/{knnScenarios.length}</p>
                <button onClick={reset} className="gradient-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold glow-primary hover:scale-[1.02] transition-transform">
                  Play Again
                </button>
              </motion.div>
            ) : (
              <motion.div key={scenario.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display text-xl mb-4">{scenario.title}</h2>
                <div className="rounded-xl border border-border/70 bg-background/40 p-4 mb-5">
                  <p className="text-sm font-semibold mb-2">Dataset</p>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    {scenario.dataset.map((row, idx) => (
                      <p key={`${row.hours}-${idx}`}>({row.hours} hours -> {row.result})</p>
                    ))}
                  </div>
                </div>

                <p className="mb-4 text-foreground">
                  If a student studies <span className="text-primary font-semibold">{scenario.queryHours} hours</span>, what will be the result?
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {scenario.options.map((option) => {
                    const selected = selectedAnswer === option;
                    const correct = revealed && option === scenario.correctAnswer;
                    const wrong = revealed && selected && option !== scenario.correctAnswer;
                    return (
                      <button
                        key={option}
                        onClick={() => setSelectedAnswer(option)}
                        disabled={revealed || isAnalyzing}
                        className={`rounded-xl border py-3 px-4 font-medium transition-all ${
                          correct
                            ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-200"
                            : wrong
                              ? "border-red-400/60 bg-red-500/15 text-red-200"
                              : selected
                                ? "border-primary bg-primary/15"
                                : "border-border hover:border-primary/50 hover:bg-primary/5"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {isAnalyzing && <p className="mt-4 text-sm text-muted-foreground">Finding nearest data points...</p>}

                {!revealed ? (
                  <button
                    onClick={handleCheck}
                    disabled={!selectedAnswer || isAnalyzing}
                    className="w-full mt-6 gradient-primary text-primary-foreground py-3 rounded-xl font-semibold glow-primary hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Predict with KNN
                  </button>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 rounded-xl border p-4 ${isCorrect ? "border-emerald-400/40 bg-emerald-500/10" : "border-red-400/40 bg-red-500/10"}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-300" /> : <XCircle className="w-5 h-5 text-red-300" />}
                      <p className={`font-semibold ${isCorrect ? "text-emerald-300" : "text-red-300"}`}>
                        Correct prediction: {scenario.correctAnswer}
                      </p>
                    </div>
                    <div className="rounded-lg bg-black/20 p-3 mb-3">
                      <p className="text-sm font-semibold flex items-center gap-2 mb-1"><Sigma className="w-4 h-4" /> Nearest neighbors</p>
                      <p className="text-sm text-muted-foreground">
                        {scenario.nearestNeighbors.map((n) => `(${n.hours}h -> ${n.result})`).join(", ")}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">{scenario.explanation}</p>
                    <button onClick={nextScenario} className="mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 transition-colors text-sm font-medium">
                      {scenarioIndex + 1 === knnScenarios.length ? "Finish Game" : "Next Scenario"}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </Layout>
  );
};

export default KnnGame;
