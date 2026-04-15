import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, CheckCircle2, RotateCcw, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { updateUserProgress } from "@/lib/progress";

const beginnerQuestions = [
  {
    question: "What does AI stand for?",
    options: ["Automated Integration", "Artificial Intelligence", "Advanced Interface", "Analog Input"],
    correctAnswerIndex: 1,
    explanation: "AI stands for Artificial Intelligence, which refers to systems that perform tasks requiring human-like intelligence.",
  },
  {
    question: "Which is a type of Machine Learning?",
    options: ["Supervised Learning", "Quantum Computing", "Blockchain", "Cloud Storage"],
    correctAnswerIndex: 0,
    explanation: "Supervised learning is a core machine learning approach that uses labeled examples for training.",
  },
  {
    question: "What is training data?",
    options: ["Random noise", "Data used to teach a model", "Only test results", "Encrypted logs"],
    correctAnswerIndex: 1,
    explanation: "Training data is the dataset used by a model to learn relationships between inputs and outputs.",
  },
  {
    question: "Which of these is an AI application?",
    options: ["Image recognition", "File compression only", "Word formatting", "Hardware assembly"],
    correctAnswerIndex: 0,
    explanation: "Image recognition is a common AI use case where models identify objects or patterns in images.",
  },
  {
    question: "Which algorithm is commonly used for classification?",
    options: ["Bubble Sort", "Decision Tree", "Binary Search", "Quick Sort"],
    correctAnswerIndex: 1,
    explanation: "Decision Tree is widely used for classification tasks because it learns clear decision rules.",
  },
];

const intermediateQuestions = [
  {
    question: "In supervised learning, labels are:",
    options: ["Unknown", "Target outputs", "Features only", "Always text"],
    correctAnswerIndex: 1,
    explanation: "In supervised learning, labels are the correct target values the model tries to predict.",
  },
  {
    question: "Which metric balances precision and recall?",
    options: ["Accuracy", "F1-score", "MSE", "AUC only"],
    correctAnswerIndex: 1,
    explanation: "F1-score combines precision and recall into one balanced metric.",
  },
  {
    question: "Overfitting happens when a model:",
    options: ["Learns noise in training data", "Has too few parameters", "Uses no data", "Runs too fast"],
    correctAnswerIndex: 0,
    explanation: "Overfitting occurs when the model memorizes training noise and performs poorly on new data.",
  },
  {
    question: "Which split is typically used for model tuning?",
    options: ["Training set", "Validation set", "Production set", "Archive set"],
    correctAnswerIndex: 1,
    explanation: "Validation data is used for tuning hyperparameters without touching the final test set.",
  },
  {
    question: "Which algorithm is often used for clustering?",
    options: ["K-Means", "Linear Regression", "Naive Bayes", "Random Forest Regressor"],
    correctAnswerIndex: 0,
    explanation: "K-Means groups similar samples into clusters based on distance from centroids.",
  },
];

const advancedQuestions = [
  {
    question: "Backpropagation is primarily used to:",
    options: ["Compress datasets", "Update neural network weights", "Select labels manually", "Shuffle features"],
    correctAnswerIndex: 1,
    explanation: "Backpropagation computes gradients and updates weights to reduce prediction error.",
  },
  {
    question: "A high bias model usually:",
    options: ["Underfits data", "Overfits data", "Needs more GPU memory only", "Has perfect generalization"],
    correctAnswerIndex: 0,
    explanation: "High bias means the model is too simple and fails to capture key patterns, causing underfitting.",
  },
  {
    question: "Transformer models rely heavily on:",
    options: ["Convolution only", "Attention mechanisms", "Decision trees", "KNN distance voting"],
    correctAnswerIndex: 1,
    explanation: "Transformers use attention to weigh important tokens and model long-range dependencies.",
  },
  {
    question: "Which helps detect class imbalance effects?",
    options: ["Confusion matrix", "Only mean error", "Only training loss", "File size"],
    correctAnswerIndex: 0,
    explanation: "A confusion matrix reveals per-class performance and highlights imbalance-related errors.",
  },
  {
    question: "Regularization techniques like dropout are used to:",
    options: ["Increase overfitting", "Reduce overfitting", "Remove labels", "Avoid preprocessing"],
    correctAnswerIndex: 1,
    explanation: "Dropout reduces overfitting by randomly deactivating neurons during training.",
  },
];

type QuizLevel = "beginner" | "intermediate" | "advanced";
type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
};

const questionBank: Record<QuizLevel, QuizQuestion[]> = {
  beginner: beginnerQuestions,
  intermediate: intermediateQuestions,
  advanced: advancedQuestions,
};

const levelCards: { level: QuizLevel; label: string; description: string }[] = [
  { level: "beginner", label: "Beginner", description: "Fundamentals of AI and ML concepts" },
  { level: "intermediate", label: "Intermediate", description: "Model evaluation and training insights" },
  { level: "advanced", label: "Advanced", description: "Deep learning and advanced ML reasoning" },
];

const Quiz = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<QuizLevel | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [finished, setFinished] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const questions = selectedLevel ? questionBank[selectedLevel] : [];

  const handleSelect = (idx: number) => {
    setSelectedAnswers((prev) => {
      const next = [...prev];
      next[currentQuestionIndex] = idx;
      return next;
    });
  };

  const startQuizWithLevel = (level: QuizLevel) => {
    setSelectedLevel(level);
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(Array.from({ length: questionBank[level].length }, () => null));
    setFinished(false);
  };

  const submitQuiz = () => {
    if (!questions.length) return;
    const hasUnanswered = selectedAnswers.some((answer) => answer === null);
    if (hasUnanswered) return;

    const finalScore = selectedAnswers.reduce(
      (total, answer, idx) => total + (answer === questions[idx].correctAnswerIndex ? 1 : 0),
      0,
    );
    const finalScorePercent = Math.round((finalScore / questions.length) * 100);
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

    setIsAnalyzing(true);
    window.setTimeout(() => {
      setIsAnalyzing(false);
      setFinished(true);
    }, 1600);
  };

  const next = () => {
    if (!questions.length) return;

    if (currentQuestionIndex + 1 >= questions.length) {
      submitQuiz();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const tryAgain = () => {
    if (!selectedLevel) return;
    setCurrentQuestionIndex(0);
    setSelectedAnswers(Array.from({ length: questionBank[selectedLevel].length }, () => null));
    setFinished(false);
    setIsAnalyzing(false);
  };

  const changeLevel = () => {
    setSelectedLevel(null);
    setQuizStarted(false);
    setFinished(false);
    setIsAnalyzing(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
  };

  const selectedForCurrent = questions.length ? selectedAnswers[currentQuestionIndex] : null;
  const progress = questions.length ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const score = selectedAnswers.reduce(
    (total, answer, idx) => total + (answer === questions[idx].correctAnswerIndex ? 1 : 0),
    0,
  );
  const scorePercent = Math.round((score / questions.length) * 100);
  const adaptiveMessage = scorePercent === 100
    ? "Excellent! 🎉"
    : scorePercent >= 50
      ? "Good, keep improving"
      : "Revise from Learning Section";
  const getAnswerText = (questionIndex: number, answerIndex: number | null) => {
    if (answerIndex === null) return "Not answered";
    return questions[questionIndex]?.options[answerIndex] ?? "Invalid answer";
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl md:text-4xl font-bold mb-8 text-gradient">
          AI/ML Quiz
        </motion.h1>
        <p className="subtext-color text-center -mt-4 mb-8">
          Test Your Mind. Train Your Intelligence
        </p>

        <AnimatePresence mode="wait">
          {!quizStarted ? (
            <motion.div
              key="level-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-4xl"
            >
              <h2 className="font-display text-2xl heading-color text-center mb-2">Choose Your Level</h2>
              <p className="subtext-color text-center mb-8">Select a level to start your quiz challenge.</p>
              <div className="grid md:grid-cols-3 gap-5">
                {levelCards.map((card) => (
                  <button
                    key={card.level}
                    onClick={() => startQuizWithLevel(card.level)}
                    className={`glass rounded-2xl p-6 text-left card-interactive transition-all duration-300 ease-in-out hover:scale-[1.04] cursor-pointer ${
                      selectedLevel === card.level ? "border-primary glow-primary" : ""
                    }`}
                  >
                    <h3 className="font-display text-xl heading-color mb-2">{card.label}</h3>
                    <p className="subtext-color text-sm">{card.description}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : isAnalyzing ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-10 text-center max-w-xl w-full"
            >
              <div className="w-14 h-14 mx-auto mb-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              <h2 className="font-display text-2xl font-bold mb-3">Analyzing your responses...</h2>
              <p className="text-muted-foreground">Generating performance report...</p>
            </motion.div>
          ) : finished ? (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-2xl p-10 text-center max-w-3xl w-full">
              <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold mb-2">Quiz Complete!</h2>
              <p className="text-muted-foreground mb-4">
                You scored <span className="text-accent font-bold">{score}</span> out of <span className="font-bold">{questions.length}</span>
              </p>
              <div className="text-5xl font-display font-bold text-gradient mb-3">{scorePercent}%</div>
              <p className="text-sm text-muted-foreground mb-6">{adaptiveMessage}</p>
              <div className="mb-6 text-left">
                <h3 className="font-display text-xl mb-4">Detailed Analysis</h3>
              </div>
              <div className="mb-6 text-left space-y-4">
                {questions.map((question, idx) => (
                  <motion.div
                    key={question.question}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`rounded-xl border p-4 ${
                      selectedAnswers[idx] === question.correctAnswerIndex
                        ? "border-emerald-400/40 bg-emerald-500/10"
                        : "border-red-400/40 bg-red-500/10"
                    }`}
                  >
                    <p className="font-medium mb-2 text-foreground">
                      Question {idx + 1}: {question.question}
                    </p>
                    <p className={`text-sm ${selectedAnswers[idx] === question.correctAnswerIndex ? "text-emerald-300" : "text-red-300"}`}>
                      <span className="font-semibold">Your Answer:</span> {getAnswerText(idx, selectedAnswers[idx] ?? null)}
                    </p>
                    <p className="text-sm text-emerald-300">
                      <span className="font-semibold">Correct Answer:</span> {question.options[question.correctAnswerIndex]}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      <span className="font-semibold">Explanation:</span> {question.explanation}
                    </p>
                    <div className="mt-3 h-px bg-white/15" />
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate("/learn")}
                  className="btn-secondary px-5 py-3 inline-flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" /> Go to Learn Section
                </button>
                <button
                  onClick={tryAgain}
                  className="btn-primary px-5 py-3 inline-flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Retry Quiz
                </button>
                <button
                  onClick={changeLevel}
                  className="glass px-5 py-3 rounded-xl font-semibold transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white/10"
                >
                  Change Level
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="w-full max-w-lg mb-8">
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div className="h-full gradient-primary rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-right font-medium">
                  Question {Math.min(currentQuestionIndex + 1, questions.length)} / {questions.length}
                </p>
              </div>

              <motion.div key={currentQuestionIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="glass rounded-2xl p-8 max-w-lg w-full">
                <div className="flex items-start gap-3 mb-6">
                  <HelpCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <h2 className="text-lg font-semibold">{questions[currentQuestionIndex].question}</h2>
                </div>

                <div className="space-y-3 mb-6">
                  {questions[currentQuestionIndex].options.map((opt, idx) => {
                    const isSelected = selectedForCurrent === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-300 ease-in-out hover:scale-[1.02] flex items-center gap-3 ${
                          isSelected
                            ? "border-primary bg-primary/15 shadow-[0_0_18px_rgba(108,99,255,0.2)]"
                            : "border-border hover:border-primary/50 hover:bg-primary/5"
                        }`}
                      >
                        <span className="w-7 h-7 rounded-full border border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-sm">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={next}
                  disabled={selectedForCurrent === null}
                  className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {currentQuestionIndex + 1 >= questions.length ? "Submit Quiz" : "Next Question →"}
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default Quiz;
