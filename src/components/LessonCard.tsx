import { CheckCircle2, ChevronRight } from "lucide-react";

type LessonCardProps = {
  title: string;
  icon: React.ElementType;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
};

const LessonCard = ({ title, icon: Icon, isActive, isCompleted, onClick }: LessonCardProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-300 ease-in-out hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        isActive
          ? "border-primary/60 bg-primary/15 text-foreground shadow-[0_0_24px_rgba(99,102,241,0.25)]"
          : "border-border/70 bg-background/40 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
      }`}
    >
      <div className="flex items-center gap-3">
        {isCompleted ? <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" /> : <Icon className="h-5 w-5 shrink-0" />}
        <span className="truncate">{title}</span>
        <ChevronRight className={`ml-auto h-4 w-4 shrink-0 transition-transform ${isActive ? "translate-x-0.5" : ""}`} />
      </div>
    </button>
  );
};

export default LessonCard;
