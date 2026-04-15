import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BookOpen, Gamepad2, HelpCircle, Trophy, TrendingUp, Award,
  ArrowRight, Star, Zap, Target
} from "lucide-react";
import Layout from "@/components/Layout";
import { getStoredUser } from "@/lib/auth";
import { getUserProgress } from "@/lib/progress";

const TOTAL_TOPICS = 10;
const QUIZ_GOAL = 10;
const SIMULATION_GOAL = 5;

const badges = [
  { name: "Beginner", icon: Star, earned: true, description: "Completed first module" },
  { name: "Intermediate", icon: Zap, earned: true, description: "Finished 5 quizzes" },
  { name: "Expert", icon: Award, earned: false, description: "Master all levels" },
];

const quickActions = [
  { label: "Continue Learning", path: "/learn", icon: BookOpen, gradient: "from-primary to-secondary" },
  { label: "Retry Quiz", path: "/quiz", icon: HelpCircle, gradient: "from-secondary to-accent" },
  { label: "Play Game", path: "/game", icon: Gamepad2, gradient: "from-accent to-primary" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const Dashboard = () => {
  const user = getStoredUser() ?? { name: "Learner", email: "" };
  const progress = getUserProgress();
  const learningProgress = Math.round((progress.completedTopicIds.length / TOTAL_TOPICS) * 100);
  const quizScore = progress.bestQuizScore;
  const gamesProgress = Math.min(100, progress.gamesPlayed * 10);
  const rankValue = progress.points > 0 ? Math.max(1, 100 - Math.floor(progress.points / 100)) : 0;
  const rankProgress = progress.points > 0 ? Math.min(100, Math.round((progress.points / 2000) * 100)) : 0;
  const stats = [
    { label: "Learning Progress", value: `${learningProgress}%`, icon: BookOpen, color: "text-primary", progress: learningProgress },
    { label: "Quiz Score", value: `${quizScore}%`, icon: HelpCircle, color: "text-accent", progress: quizScore },
    { label: "Games Played", value: `${progress.gamesPlayed}`, icon: Gamepad2, color: "text-neon-pink", progress: gamesProgress },
    { label: "Rank", value: `${rankValue}`, icon: Trophy, color: "text-secondary", progress: rankProgress },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Welcome back, <span className="text-gradient">{user.name}</span> 👋
          </h1>
          <p className="text-muted-foreground">Track your progress and continue your AI/ML journey.</p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <motion.div key={s.label} variants={item} className="glass rounded-2xl p-5 hover:border-primary/30 transition-all group hover:scale-[1.02]">
              <div className="flex items-center gap-3 mb-3">
                <s.icon className={`w-5 h-5 ${s.color}`} />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <p className="font-display text-2xl font-bold mb-3">{s.value}</p>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full gradient-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${s.progress}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> Quick Actions
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {quickActions.map((a) => (
                <Link key={a.label} to={a.path}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass rounded-2xl p-6 text-center hover:border-primary/30 transition-all cursor-pointer"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.gradient} flex items-center justify-center mx-auto mb-3`}>
                      <a.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <p className="text-sm font-medium">{a.label}</p>
                    <ArrowRight className="w-4 h-4 text-muted-foreground mx-auto mt-2" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div>
            <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" /> Badges
            </h2>
            <div className="glass rounded-2xl p-5 space-y-4">
              {badges.map((b) => (
                <div key={b.name} className={`flex items-center gap-3 ${b.earned ? "" : "opacity-40"}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${b.earned ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"}`}>
                    <b.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.description}</p>
                  </div>
                  {b.earned && <span className="ml-auto text-xs text-accent font-medium">Earned ✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8">
          <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-secondary" /> Progress Overview
          </h2>
          <div className="glass rounded-2xl p-6">
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { label: "Modules Completed", current: progress.completedTopicIds.length, total: TOTAL_TOPICS },
                { label: "Quiz Attempts", current: progress.quizAttempts, total: QUIZ_GOAL },
                { label: "Simulations Run", current: progress.simulationsRun, total: SIMULATION_GOAL },
              ].map((p) => (
                <div key={p.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">{p.label}</span>
                    <span className="font-medium">{p.current}/{p.total}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full gradient-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (p.current / p.total) * 100)}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;
