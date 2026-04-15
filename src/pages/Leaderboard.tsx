import { motion } from "framer-motion";
import { Trophy, Medal, Crown, TrendingUp } from "lucide-react";
import Layout from "@/components/Layout";

const leaderboardData = [
  { rank: 1, name: "Arjun Patel", score: 2850, avatar: "AP" },
  { rank: 2, name: "Sarah Chen", score: 2720, avatar: "SC" },
  { rank: 3, name: "Ravi Kumar", score: 2680, avatar: "RK" },
  { rank: 4, name: "Emily Zhao", score: 2510, avatar: "EZ" },
  { rank: 5, name: "You", score: 2340, avatar: "YO" },
  { rank: 6, name: "Jordan Lee", score: 2200, avatar: "JL" },
  { rank: 7, name: "Priya Singh", score: 2150, avatar: "PS" },
  { rank: 8, name: "Alex Turner", score: 2050, avatar: "AT" },
  { rank: 9, name: "Mina Okada", score: 1980, avatar: "MO" },
  { rank: 10, name: "Carlos Ruiz", score: 1900, avatar: "CR" },
];

const rankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="w-5 h-5 text-accent" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-muted-foreground" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-neon-pink" />;
  return <span className="text-sm font-bold text-muted-foreground w-5 text-center">{rank}</span>;
};

const rankBg = (rank: number) => {
  if (rank === 1) return "border-accent/30 bg-accent/5";
  if (rank === 2) return "border-muted-foreground/30 bg-muted/30";
  if (rank === 3) return "border-neon-pink/30 bg-neon-pink/5";
  return "";
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } };

const Leaderboard = () => (
  <Layout>
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
          <span className="text-gradient">Leaderboard</span> 🏆
        </h1>
        <p className="text-muted-foreground">Top performers in the AIML PlayLab community</p>
      </motion.div>

      {/* Top 3 Podium */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex justify-center items-end gap-4 mb-10">
        {[leaderboardData[1], leaderboardData[0], leaderboardData[2]].map((u, idx) => {
          const heights = ["h-28", "h-36", "h-24"];
          const sizes = ["w-14 h-14", "w-18 h-18", "w-14 h-14"];
          return (
            <motion.div key={u.rank} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + idx * 0.15 }} className="flex flex-col items-center">
              <div className={`${sizes[idx]} w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-sm gradient-primary mb-2 ${u.rank === 1 ? "ring-2 ring-yellow-400 ring-offset-2 ring-offset-background" : ""}`}>
                {u.avatar}
              </div>
              <p className="text-sm font-semibold mb-1 truncate max-w-[80px]">{u.name}</p>
              <p className="text-xs text-muted-foreground mb-2">{u.score} pts</p>
              <div className={`${heights[idx]} w-20 rounded-t-xl gradient-primary flex items-end justify-center pb-2`}>
                <span className="font-display text-lg font-bold text-primary-foreground">#{u.rank}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Full Table */}
      <motion.div variants={container} initial="hidden" animate="show" className="glass rounded-2xl overflow-hidden max-w-2xl mx-auto">
        <div className="grid grid-cols-[60px_1fr_100px] gap-2 px-5 py-3 text-xs text-muted-foreground font-semibold uppercase border-b border-border">
          <span>Rank</span><span>Player</span><span className="text-right">Score</span>
        </div>
        {leaderboardData.map((u) => (
          <motion.div
            key={u.rank}
            variants={item}
            className={`grid grid-cols-[60px_1fr_100px] gap-2 px-5 py-3.5 items-center border-b border-border/50 last:border-0 transition-colors hover:bg-muted/30 ${rankBg(u.rank)} ${u.name === "You" ? "bg-primary/5 border-primary/20" : ""}`}
          >
            <div className="flex items-center">{rankIcon(u.rank)}</div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">{u.avatar}</div>
              <span className={`text-sm font-medium ${u.name === "You" ? "text-primary" : ""}`}>{u.name}</span>
              {u.name === "You" && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">You</span>}
            </div>
            <div className="text-right flex items-center justify-end gap-1">
              <TrendingUp className="w-3 h-3 text-accent" />
              <span className="text-sm font-semibold">{u.score}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </Layout>
);

export default Leaderboard;
