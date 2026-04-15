import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import Layout from "@/components/Layout";
import { updateUserProgress } from "@/lib/progress";

const questions = [
  { q: "What does AI stand for?", options: ["Automated Integration", "Artificial Intelligence", "Advanced Interface", "Analog Input"], answer: 1 },
  { q: "Which is a type of Machine Learning?", options: ["Supervised Learning", "Quantum Computing", "Blockchain", "Cloud Storage"], answer: 0 },
  { q: "What does a neural network mimic?", options: ["Internet", "Human Brain", "Operating System", "Database"], answer: 1 },
  { q: "What is training data?", options: ["Random noise", "Data used to teach a model", "Test results", "User input"], answer: 1 },
  { q: "Which algorithm is used for classification?", options: ["Bubble Sort", "Decision Tree", "Binary Search", "Quick Sort"], answer: 1 },
];

const Quiz = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === questions[current].answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      const finalScorePercent = Math.round((score / questions.length) * 100);
      updateUserProgress((progress) => {
        const quizAttempts = progress.quizAttempts + 1;
        const bestQuizScore = Math.max(progress.bestQuizScore, finalScorePercent);
        return {
          ...progress,
          quizAttempts,
          bestQuizScore,
          points: progress.completedTopicIds.length * 100 + quizAttempts * 50 + progress.gamesPlayed * 30 + progress.simulationsRun * 20,
        };
      });
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAnswered(false);
  };

  const progress = ((current + (answered ? 1 : 0)) / questions.length) * 100;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl md:text-4xl font-bold mb-8 text-gradient">
          AI/ML Quiz
        </motion.h1>

        {/* Progress */}
        <div className="w-full max-w-lg mb-8">
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div className="h-full gradient-primary rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-right">
            {Math.min(current + (answered ? 1 : 0), questions.length)} / {questions.length}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {finished ? (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-2xl p-10 text-center max-w-md w-full">
              <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold mb-2">Quiz Complete!</h2>
              <p className="text-muted-foreground mb-4">
                You scored <span className="text-accent font-bold">{score}</span> out of <span className="font-bold">{questions.length}</span>
              </p>
              <div className="text-5xl font-display font-bold text-gradient mb-6">{Math.round((score / questions.length) * 100)}%</div>
              <button onClick={restart} className="gradient-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform inline-flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> Retry
              </button>
            </motion.div>
          ) : (
            <motion.div key={current} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="glass rounded-2xl p-8 max-w-lg w-full">
              <div className="flex items-start gap-3 mb-6">
                <HelpCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <h2 className="text-lg font-semibold">{questions[current].q}</h2>
              </div>

              <div className="space-y-3 mb-6">
                {questions[current].options.map((opt, idx) => {
                  let cls = "border-border hover:border-primary/50 hover:bg-primary/5";
                  if (answered) {
                    if (idx === questions[current].answer) cls = "border-accent bg-accent/10";
                    else if (idx === selected) cls = "border-destructive bg-destructive/10";
                  } else if (idx === selected) {
                    cls = "border-primary bg-primary/10";
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-3 ${cls}`}
                    >
                      <span className="w-7 h-7 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm">{opt}</span>
                      {answered && idx === questions[current].answer && <CheckCircle2 className="w-5 h-5 text-accent ml-auto" />}
                      {answered && idx === selected && idx !== questions[current].answer && <XCircle className="w-5 h-5 text-destructive ml-auto" />}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={next}
                  className="w-full gradient-primary text-primary-foreground py-3 rounded-xl font-semibold hover:scale-[1.02] transition-transform"
                >
                  {current + 1 >= questions.length ? "See Results" : "Next Question →"}
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default Quiz;
