const Footer = () => (
  <footer className="border-t border-white/10 py-8 mt-20">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 subtext-color text-sm">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="AIML PlayLab logo" className="w-6 h-6 rounded-md object-cover ring-1 ring-white/20" />
        <span className="font-display text-xs heading-color">AIML PlayLab</span>
      </div>
      <p>Built for Vibethon 🚀 | Team Horizon</p>
    </div>
  </footer>
);

export default Footer;
