import { motion } from "framer-motion";

const LoadingSpinner = ({ label = "Loading..." }: { label?: string }) => (
  <div className="flex flex-col items-center gap-3">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
      className="relative w-11 h-11"
    >
      <div className="absolute inset-0 rounded-full border-2 border-white/20" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#00F5D4] border-r-[#6C63FF] glow-primary" />
    </motion.div>
    <span className="text-sm subtext-color font-medium">{label}</span>
  </div>
);

export default LoadingSpinner;
