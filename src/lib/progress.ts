const PROGRESS_STORAGE_KEY = "aiml_progress";

export type UserProgress = {
  completedTopicIds: string[];
  quizAttempts: number;
  bestQuizScore: number;
  gamesPlayed: number;
  simulationsRun: number;
  points: number;
};

const defaultProgress: UserProgress = {
  completedTopicIds: [],
  quizAttempts: 0,
  bestQuizScore: 0,
  gamesPlayed: 0,
  simulationsRun: 0,
  points: 0,
};

export const getUserProgress = (): UserProgress => {
  const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
  if (!raw) return defaultProgress;

  try {
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    return {
      completedTopicIds: Array.isArray(parsed.completedTopicIds) ? parsed.completedTopicIds : [],
      quizAttempts: Number(parsed.quizAttempts) || 0,
      bestQuizScore: Number(parsed.bestQuizScore) || 0,
      gamesPlayed: Number(parsed.gamesPlayed) || 0,
      simulationsRun: Number(parsed.simulationsRun) || 0,
      points: Number(parsed.points) || 0,
    };
  } catch {
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
    return defaultProgress;
  }
};

export const saveUserProgress = (progress: UserProgress) => {
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
};

export const updateUserProgress = (updater: (current: UserProgress) => UserProgress) => {
  const current = getUserProgress();
  const next = updater(current);
  saveUserProgress(next);
  return next;
};
