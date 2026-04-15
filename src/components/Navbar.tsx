import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Moon, Sun, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getStoredUser, isGuestMode, signOutFromSupabase } from "@/lib/auth";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Learn", path: "/learn" },
  { label: "Game", path: "/game" },
  { label: "Quiz", path: "/quiz" },
  { label: "Simulation", path: "/simulation" },
  { label: "Leaderboard", path: "/leaderboard" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getStoredUser();
  const guestMode = isGuestMode();
  const visibleNavItems = user
    ? navItems
    : navItems.filter((item) => item.path !== "/dashboard" && item.path !== "/leaderboard");
  const showLandingHeaderActions = location.pathname === "/";

  useEffect(() => {
    const savedTheme = localStorage.getItem("aiml_theme");
    const shouldUseLight = savedTheme === "light";
    document.documentElement.classList.toggle("light", shouldUseLight);
    setIsLightTheme(shouldUseLight);
  }, []);

  const toggleTheme = () => {
    const nextIsLight = !isLightTheme;
    setIsLightTheme(nextIsLight);
    document.documentElement.classList.toggle("light", nextIsLight);
    localStorage.setItem("aiml_theme", nextIsLight ? "light" : "dark");
  };

  const handleSignOut = async () => {
    await signOutFromSupabase();
    navigate("/auth", { replace: true });
  };

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 glass-strong border-b border-white/10">
      <div className="container mx-auto flex items-center justify-between h-16 md:h-[72px] px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <img src="/logo.png" alt="AIML PlayLab logo" className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/20" />
          <span className="font-display text-lg font-bold text-gradient">AIML PlayLab</span>
        </Link>

        {showLandingHeaderActions && (
          <div className="hidden lg:flex items-center gap-2">
            <Link
              to="/"
              className="group relative px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ease-in-out gradient-primary text-primary-foreground glow-primary"
            >
              Home
            </Link>
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center subtext-color hover:text-foreground hover:bg-primary/20 transition-all duration-300"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {isLightTheme ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            {user ? (
              <>
                <span className="text-xs text-muted-foreground max-w-[140px] truncate ml-2">{user.name}</span>
                <button
                  onClick={() => void handleSignOut()}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium subtext-color hover:text-foreground hover:bg-white/5 transition-all duration-300"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="ml-2 inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium subtext-color hover:text-foreground hover:bg-white/5 transition-all duration-300"
              >
                <LogIn className="w-3.5 h-3.5" />
                Login
              </Link>
            )}
          </div>
        )}

        {/* Mobile toggle */}
        <button className="lg:hidden text-foreground p-2 rounded-lg hover:bg-white/5 transition-colors" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-strong border-t border-white/10"
          >
            <div className="flex flex-col p-4 gap-2">
              {visibleNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    location.pathname === item.path
                      ? "gradient-primary text-primary-foreground glow-primary"
                      : "subtext-color hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={toggleTheme}
                className="px-4 py-3 rounded-xl text-sm font-medium subtext-color hover:text-foreground hover:bg-white/5 flex items-center gap-2 transition-all duration-300"
              >
                {isLightTheme ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                {isLightTheme ? "Switch to Dark" : "Switch to Light"}
              </button>
              <Link
                to={user ? "/dashboard" : "/auth"}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-medium subtext-color hover:text-foreground hover:bg-white/5 flex items-center gap-2 transition-all duration-300"
              >
                <User className="w-4 h-4" /> {user ? `Profile (${user.name})` : guestMode ? "Login" : "Login / Register"}
              </Link>
              {user && (
                <button
                  onClick={() => {
                    setOpen(false);
                    void handleSignOut();
                  }}
                  className="px-4 py-3 rounded-xl text-sm font-medium subtext-color hover:text-foreground hover:bg-white/5 flex items-center gap-2 text-left transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
