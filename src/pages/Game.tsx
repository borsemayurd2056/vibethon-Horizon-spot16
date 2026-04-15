import { motion } from "framer-motion";
import { BrainCircuit, Sigma, ChartLine } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const Game = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Choose Your AI Challenge <span className="text-gradient">🎮</span>
          </h1>
          <p className="text-muted-foreground">Pick a game mode and strengthen your machine learning intuition.</p>
        </motion.div>

        <div className="grid w-full max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link to="/game/scenario" className="group">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.99 }}
              className="glass rounded-2xl p-7 border border-primary/20 shadow-[0_0_0_rgba(99,102,241,0)] transition-all duration-300 group-hover:shadow-[0_0_28px_rgba(99,102,241,0.25)]"
            >
              <BrainCircuit className="w-10 h-10 text-primary mb-4" />
              <h2 className="font-display text-2xl mb-2">AI Scenario Game</h2>
              <p className="text-muted-foreground">Solve real-world AI scenarios and make decisions.</p>
            </motion.div>
          </Link>

          <Link to="/game/knn" className="group">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.99 }}
              className="glass rounded-2xl p-7 border border-cyan-400/20 shadow-[0_0_0_rgba(34,211,238,0)] transition-all duration-300 group-hover:shadow-[0_0_28px_rgba(34,211,238,0.22)]"
            >
              <Sigma className="w-10 h-10 text-cyan-300 mb-4" />
              <h2 className="font-display text-2xl mb-2">KNN Classifier Game</h2>
              <p className="text-muted-foreground">Learn predictions using nearest data points.</p>
            </motion.div>
          </Link>

          <Link to="/game/gradient" className="group">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.99 }}
              className="glass rounded-2xl p-7 border border-fuchsia-400/20 shadow-[0_0_0_rgba(232,121,249,0)] transition-all duration-300 group-hover:shadow-[0_0_28px_rgba(232,121,249,0.22)]"
            >
              <ChartLine className="w-10 h-10 text-fuchsia-300 mb-4" />
              <h2 className="font-display text-2xl mb-2">Gradient Descent Racer</h2>
              <p className="text-muted-foreground">Optimize your model by finding the minimum loss.</p>
            </motion.div>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Game;
