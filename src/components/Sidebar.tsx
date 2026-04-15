import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, LayoutDashboard, BookOpen, Gamepad2, HelpCircle, Cpu, Trophy, Moon, Sun, User, LogOut } from "lucide-react";
import { getStoredUser, isGuestMode, signOutFromSupabase } from "@/lib/auth";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Learn", path: "/learn", icon: BookOpen },
  { label: "Game", path: "/game", icon: Gamepad2 },
  { label: "Quiz", path: "/quiz", icon: HelpCircle },
  { label: "Simulation", path: "/simulation", icon: Cpu },
  { label: "Leaderboard", path: "/leaderboard", icon: Trophy },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getStoredUser();
  const guestMode = isGuestMode();
  const [isLightTheme, setIsLightTheme] = useState(false);
  const visibleNavItems = user
    ? navItems
    : navItems.filter((item) => item.path !== "/dashboard" && item.path !== "/leaderboard");

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
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-slate-950/75 backdrop-blur-md">
      <div className="flex h-full w-full flex-col overflow-y-auto p-4">
        <Link to="/" className="mb-6 flex items-center gap-2 rounded-xl px-2 py-1.5">
          <img src="/logo.png" alt="AIML PlayLab logo" className="h-8 w-8 rounded-lg object-cover ring-1 ring-white/20" />
          <span className="font-display text-lg font-bold text-gradient">AIML PlayLab</span>
        </Link>

        <nav className="space-y-2">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  active
                    ? "gradient-primary text-primary-foreground shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-2 pt-6">
          <button
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground"
          >
            {isLightTheme ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            {isLightTheme ? "Switch to Dark" : "Switch to Light"}
          </button>
          <Link
            to={user ? "/dashboard" : "/auth"}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground"
          >
            <User className="h-4 w-4" />
            {user ? user.name : guestMode ? "Login" : "Login / Register"}
          </Link>
          {user && (
            <button
              onClick={() => void handleSignOut()}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
