import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Cpu, GitBranch, Layers, CheckCircle2, Circle, Network, Database, BarChart3, Bot, Workflow, Eye } from "lucide-react";
import Layout from "@/components/Layout";
import { getUserProgress, logUserActivity, updateUserProgress } from "@/lib/progress";
import LessonCard from "@/components/LessonCard";
import Modal from "@/components/Modal";

type Topic = {
  id: string;
  title: string;
  icon: React.ElementType;
  content: string;
  highlights: string[];
  level: "beginner" | "intermediate" | "advanced";
};

const topics: Topic[] = [
  { id: "intro", title: "Introduction to AI", icon: Brain, level: "beginner", content: "Artificial Intelligence (AI) is the simulation of human intelligence by machines. It includes learning, reasoning, problem-solving, perception, and language understanding.", highlights: ["Pattern Recognition", "Decision Making", "Natural Language", "Computer Vision"] },
  { id: "ml-basics", title: "Machine Learning Basics", icon: Cpu, level: "beginner", content: "Machine Learning is a subset of AI that enables systems to learn from data without being explicitly programmed. Instead of writing rules, you feed data to algorithms.", highlights: ["Data-Driven", "Algorithms", "Training", "Prediction"] },
  { id: "data-types", title: "Types of Data", icon: Database, level: "beginner", content: "Understanding data types is crucial in ML. Data can be structured (tables), unstructured (images, text), or semi-structured (JSON, XML).", highlights: ["Structured", "Unstructured", "Features", "Labels"] },
  { id: "supervised", title: "Supervised Learning", icon: GitBranch, level: "intermediate", content: "In Supervised Learning, the model learns from labeled data — inputs paired with correct outputs. Common tasks include classification and regression.", highlights: ["Labeled Data", "Classification", "Regression", "Training Labels"] },
  { id: "unsupervised", title: "Unsupervised Learning", icon: Layers, level: "intermediate", content: "Unsupervised Learning works with unlabeled data. The model discovers hidden patterns and structures on its own.", highlights: ["No Labels", "Clustering", "Pattern Discovery", "Anomaly Detection"] },
  { id: "evaluation", title: "Model Evaluation", icon: BarChart3, level: "intermediate", content: "Evaluating ML models involves metrics like accuracy, precision, recall, and F1-score. Cross-validation helps prevent overfitting.", highlights: ["Accuracy", "Precision", "Recall", "F1-Score"] },
  { id: "neural-nets", title: "Neural Networks", icon: Network, level: "advanced", content: "Neural networks are computing systems inspired by the brain. Deep learning uses multiple layers to learn hierarchical representations of data.", highlights: ["Neurons", "Layers", "Backpropagation", "Deep Learning"] },
  { id: "nlp", title: "Natural Language Processing", icon: Bot, level: "advanced", content: "NLP enables machines to understand, interpret, and generate human language. Applications include chatbots, translation, and sentiment analysis.", highlights: ["Tokenization", "Transformers", "Sentiment", "LLMs"] },
  { id: "cv", title: "Computer Vision", icon: Eye, level: "advanced", content: "Computer Vision enables machines to interpret visual information. CNNs are the backbone of image classification, object detection, and segmentation.", highlights: ["CNNs", "Object Detection", "Image Classification", "Segmentation"] },
  { id: "pipelines", title: "ML Pipelines", icon: Workflow, level: "advanced", content: "An ML pipeline automates the workflow from data collection to deployment. It includes data preprocessing, training, evaluation, and serving.", highlights: ["ETL", "Feature Engineering", "AutoML", "Deployment"] },
];

const levels = ["beginner", "intermediate", "advanced"] as const;
const levelLabels = { beginner: "🟢 Beginner", intermediate: "🟡 Intermediate", advanced: "🔴 Advanced" };

const Learn = () => {
  const initialCompleted = new Set(getUserProgress().completedTopicIds);
  const [activeLevel, setActiveLevel] = useState<typeof levels[number]>("beginner");
  const [active, setActive] = useState(topics[0].id);
  const [completed, setCompleted] = useState<Set<string>>(initialCompleted);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const filtered = topics.filter((t) => t.level === activeLevel);
  const current = filtered.find((t) => t.id === active) || filtered[0];
  const completedCount = topics.filter((t) => completed.has(t.id)).length;
  const totalProgress = Math.round((completedCount / topics.length) * 100);

  const toggleComplete = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      updateUserProgress((progress) => {
        const completedTopicIds = Array.from(next);
        return {
          ...progress,
          completedTopicIds,
          points: completedTopicIds.length * 100 + progress.quizAttempts * 50 + progress.gamesPlayed * 30 + progress.simulationsRun * 20,
        };
      });
      logUserActivity("learn", `${next.has(id) ? "Completed" : "Unmarked"} topic: ${topics.find((topic) => topic.id === id)?.title ?? id}`);
      return next;
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 text-gradient">Learn AI/ML</h1>
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground text-sm">Overall Progress</p>
            <div className="flex-1 max-w-xs h-2 rounded-full bg-muted overflow-hidden">
              <motion.div className="h-full gradient-primary rounded-full" animate={{ width: `${totalProgress}%` }} />
            </div>
            <span className="text-sm font-semibold text-primary">{totalProgress}%</span>
          </div>
        </motion.div>

        {/* Level Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {levels.map((l) => (
            <button
              key={l}
              onClick={() => { setActiveLevel(l); setActive(topics.filter((t) => t.level === l)[0]?.id); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeLevel === l ? "gradient-primary text-primary-foreground glow-primary" : "glass text-muted-foreground hover:text-foreground"}`}
            >
              {levelLabels[l]}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-72 flex-shrink-0">
            <div className="glass rounded-2xl p-4 space-y-2">
              {filtered.map((t) => (
                  <LessonCard
                    key={t.id}
                    title={t.title}
                    icon={t.icon}
                    isActive={active === t.id}
                    isCompleted={completed.has(t.id)}
                    onClick={() => {
                      setActive(t.id);
                      setSelectedTopic(t);
                    }}
                  />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-2xl p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <current.icon className="w-8 h-8 text-primary" />
                  <h2 className="font-display text-2xl font-bold">{current.title}</h2>
                  {completed.has(current.id) && <span className="ml-auto text-xs bg-accent/20 text-accent px-3 py-1 rounded-full font-medium">Completed ✓</span>}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">{current.content}</p>
                <div className="flex flex-wrap gap-3 mb-6">
                  {current.highlights.map((h) => (
                    <span key={h} className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">{h}</span>
                  ))}
                </div>
                <button
                  onClick={() => toggleComplete(current.id)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    completed.has(current.id) ? "bg-accent/20 text-accent border border-accent/30" : "gradient-primary text-primary-foreground glow-primary hover:scale-[1.02]"
                  }`}
                >
                  {completed.has(current.id) ? <><CheckCircle2 className="w-4 h-4" /> Completed</> : <><Circle className="w-4 h-4" /> Mark as Completed</>}
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <Modal
          isOpen={Boolean(selectedTopic)}
          onClose={() => setSelectedTopic(null)}
          title={selectedTopic?.title ?? "Lesson"}
          footer={selectedTopic && (
            <>
              <button
                onClick={() => {
                  setActive(selectedTopic.id);
                  setSelectedTopic(null);
                }}
                className="rounded-xl gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(56,189,248,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Start Learning
              </button>
              <button
                onClick={() => {
                  toggleComplete(selectedTopic.id);
                }}
                className="rounded-xl border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary/20 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Mark as Completed
              </button>
            </>
          )}
        >
          <p className="mb-5 leading-relaxed text-muted-foreground">
            {selectedTopic?.content}
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedTopic?.highlights.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default Learn;
