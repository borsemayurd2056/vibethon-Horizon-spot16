import { Brain } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-white/10 py-8 mt-20">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 subtext-color text-sm">
      <div className="flex items-center gap-2">
        <Brain className="w-5 h-5 text-primary" />
        <span className="font-display text-xs heading-color">AIML PlayLab</span>
      </div>
      <p>Built for Vibethon 🚀 | Team PlayLab</p>
    </div>
  </footer>
);

export default Footer;
