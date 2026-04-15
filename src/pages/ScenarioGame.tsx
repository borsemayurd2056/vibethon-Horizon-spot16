import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, CheckCircle2, XCircle, Trophy, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { updateUserProgress } from "@/lib/progress";

type Scenario = {
  id: string;
  title: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

const scenarios: Scenario[] = [
  {
    id: "house-price",
    title: "Predict House Price",
    prompt: "Which feature is most important?",
    options: ["Location", "Size", "Number of Rooms", "Age"],
    correctAnswer: "Location",
    explanation: "Location strongly influences demand, neighborhood quality, and resale value, so it usually dominates price prediction.",
  },
  {
    id: "student-performance",
    title: "Predict Student Performance",
    prompt: "Which feature is most important?",
    options: ["Daily Study Time", "Favorite Subject", "Shoe Size", "Pen Color"],
    correctAnswer: "Daily Study Time",
    explanation: "Study time directly impacts preparation and understanding, making it the most predictive feature here.",
  },
  {
    id: "movie-recommendation",
    title: "Movie Recommendation",
    prompt: "Which feature is most important?",
    options: ["User Watch History", "Poster Color", "Movie Length", "Release Day"],
    correctAnswer: "User Watch History",
    explanation: "Past watch behavior captures user preferences best, which is why recommender systems rely on it heavily.",
  },
];

const ScenarioGame = () => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentScenario = scenarios[currentScenarioIndex];
  const isCorrect = selectedOption === currentScenario.correctAnswer;

  const handleCheckAnswer = () => {
    if (!selectedOption || revealed) return;
    setIsAnalyzing(true);
    window.setTimeout(() => {
      setIsAnalyzing(false);
      setRevealed(true);
      setAnsweredCount((prev) => prev + 1);
      if (selectedOption === currentScenario.correctAnswer) {
        setScore((prev) => prev + 1);
      }
    }, 700);
  };

  const handleNextScenario = () => {
    if (currentScenarioIndex + 1 < scenarios.length) {
      setCurrentScenarioIndex((prev) => prev + 1);
      setSelectedOption(null);
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
    setIsFinished(true);
  };

  const resetGame = () => {
    setCurrentScenarioIndex(0);
    setSelectedOption(null);
    setRevealed(false);
    setScore(0);
    setAnsweredCount(0);
    setIsFinished(false);
    setIsAnalyzing(false);
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
            AI Scenario Game <span className="text-gradient">🎮</span>
          </h1>
          <p className="text-muted-foreground">Solve real-world AI scenarios and make decisions.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-8 w-full max-w-2xl"
        >
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <BrainCircuit className="w-6 h-6 text-accent" />
              <h2 className="font-display text-lg font-semibold">Scenario Challenge</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-sm">
              <Trophy className="w-4 h-4 text-yellow-300" />
              <span className="font-semibold">{score}</span>/<span>{scenarios.length}</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isFinished ? (
              <motion.div
                key="final-score"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-primary/20 bg-primary/10 p-6 text-center"
              >
                <p className="text-sm text-muted-foreground mb-2">Game Complete</p>
                <p className="font-display text-4xl font-bold text-accent mb-2">{score}/{scenarios.length}</p>
                <p className="text-muted-foreground mb-5">
                  You answered {answeredCount} scenarios and learned feature importance reasoning.
                </p>
                <button
                  onClick={resetGame}
                  className="gradient-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold glow-primary hover:scale-[1.02] transition-transform"
                >
                  Play Again
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={currentScenario.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
              >
                <div className="rounded-xl border border-border/70 bg-background/40 p-5 mb-6">
                  <p className="text-xs text-primary mb-1">Scenario {currentScenarioIndex + 1} / {scenarios.length}</p>
                  <h3 className="font-display text-2xl mb-2">{currentScenario.title}</h3>
                  <p className="text-muted-foreground">{currentScenario.prompt}</p>
                </div>

                <div className="space-y-3">
                  {currentScenario.options.map((option) => {
                    const isSelected = selectedOption === option;
                    const isRightOption = option === currentScenario.correctAnswer;
                    const showCorrect = revealed && isRightOption;
                    const showWrong = revealed && isSelected && !isRightOption;

                    return (
                      <button
                        key={option}
                        onClick={() => setSelectedOption(option)}
                        disabled={revealed || isAnalyzing}
                        className={`w-full text-left rounded-xl border px-4 py-3 transition-all ${
                          showCorrect
                            ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-200"
                            : showWrong
                              ? "border-red-400/60 bg-red-500/15 text-red-200"
                              : isSelected
                                ? "border-primary bg-primary/15 shadow-[0_0_18px_rgba(108,99,255,0.2)]"
                                : "border-border hover:border-primary/50 hover:bg-primary/5"
                        } ${revealed || isAnalyzing ? "cursor-default" : "hover:scale-[1.01]"}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {isAnalyzing && <p className="mt-5 text-sm text-muted-foreground">Analyzing scenario...</p>}

                {!revealed ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={!selectedOption || isAnalyzing}
                    className="w-full mt-6 gradient-primary text-primary-foreground py-3 rounded-xl font-semibold glow-primary hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Check Answer
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 rounded-xl border p-4 ${
                      isCorrect ? "border-emerald-400/40 bg-emerald-500/10" : "border-red-400/40 bg-red-500/10"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                          <p className="font-semibold text-emerald-300">Correct Answer: {currentScenario.correctAnswer}</p>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-300" />
                          <p className="font-semibold text-red-300">Correct Answer: {currentScenario.correctAnswer}</p>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{currentScenario.explanation}</p>
                    <button
                      onClick={handleNextScenario}
                      className="mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 transition-colors text-sm font-medium"
                    >
                      {currentScenarioIndex + 1 === scenarios.length ? "Finish Game" : "Next Scenario"}
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

export default ScenarioGame;
