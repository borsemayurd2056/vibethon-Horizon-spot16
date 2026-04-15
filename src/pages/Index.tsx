import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Gamepad2, HelpCircle, Sparkles, ScanSearch, Trophy, BarChart3 } from "lucide-react";
import Layout from "@/components/Layout";

const features = [
  { icon: Brain, title: "Interactive Learning", description: "Explore AI/ML concepts with visual explanations and real examples.", color: "text-[#6C63FF]", },
  { icon: Gamepad2, title: "AI Mini Games", description: "Train your own ML model in a fun, interactive game environment.", color: "text-[#00F5D4]", },
  { icon: HelpCircle, title: "Real-time Quiz", description: "Test your AI knowledge with instant feedback and score tracking.", color: "text-[#F59E0B]", },
  { icon: ScanSearch, title: "AI Simulation", description: "Run spam detection and other AI demos with real-time results.", color: "text-secondary", },
  { icon: Trophy, title: "Leaderboard", description: "Compete with peers and climb the ranks on the global leaderboard.", color: "text-[#3B82F6]", },
  { icon: BarChart3, title: "Progress Tracking", description: "Track your learning journey with detailed progress indicators.", color: "text-neon-cyan", },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const Index = () => (
  <Layout>
    {/* Hero */}
    <section className="relative overflow-hidden gradient-hero">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-4 md:left-10 w-56 h-56 md:w-72 md:h-72 bg-[#6C63FF]/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-8 right-4 md:right-10 w-72 h-72 md:w-96 md:h-96 bg-[#00F5D4]/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 text-sm subtext-color">
            <Sparkles className="w-4 h-4 text-accent" /> AI-Powered Learning Platform
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 heading-color">
            Learn AI/ML the <span className="text-gradient">Fun Way</span>
          </h1>
          <p className="text-base md:text-xl subtext-color max-w-2xl mx-auto mb-10">
            Learn, Practice, and Play with Artificial Intelligence
          </p>
        </motion.div>
      </div>
    </section>

    {/* Features */}
    <section className="container mx-auto px-4 py-20">
      <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold text-center mb-12 heading-color">
        Everything You Need to <span className="text-gradient">Master AI/ML</span>
      </motion.h2>
      <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => (
          <Link key={f.title} to="/auth" className="block">
            <motion.div
              variants={item}
              className="glass rounded-2xl p-6 md:p-8 card-interactive group cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.04]"
            >
              <f.icon className={`w-10 h-10 ${f.color} mb-4 group-hover:animate-float`} />
              <h3 className="font-display text-lg font-semibold mb-2 heading-color">{f.title}</h3>
              <p className="subtext-color text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </section>

  </Layout>
);

export default Index;
