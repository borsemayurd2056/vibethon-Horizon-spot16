import { getStoredUser, isGuestMode } from "@/lib/auth";

const PROGRESS_STORAGE_KEY_PREFIX = "aiml_progress";
const LEGACY_PROGRESS_STORAGE_KEY = "aiml_progress";
let guestSessionProgress: UserProgress | null = null;
let guestSessionActivity: ActivityEntry[] = [];

export type ActivityEntry = {
  id: string;
  type: "learn" | "quiz" | "game" | "simulation" | "auth";
  message: string;
  createdAt: string;
};

export type UserProgress = {
  completedTopicIds: string[];
  quizAttempts: number;
  bestQuizScore: number;
  gamesPlayed: number;
  simulationsRun: number;
  points: number;
  activityHistory: ActivityEntry[];
};

const defaultProgress: UserProgress = {
  completedTopicIds: [],
  quizAttempts: 0,
  bestQuizScore: 0,
  gamesPlayed: 0,
  simulationsRun: 0,
  points: 0,
  activityHistory: [],
};

const getProgressStorageKey = () => {
  const user = getStoredUser();
  if (user?.email) return `${PROGRESS_STORAGE_KEY_PREFIX}:${user.email.toLowerCase()}`;
  return LEGACY_PROGRESS_STORAGE_KEY;
};

export const getUserProgress = (): UserProgress => {
  if (isGuestMode()) {
    if (!guestSessionProgress) guestSessionProgress = { ...defaultProgress };
    if (!guestSessionActivity.length) guestSessionActivity = [];
    guestSessionProgress.activityHistory = guestSessionActivity;
    return guestSessionProgress;
  }

  const storageKey = getProgressStorageKey();
  const raw = localStorage.getItem(storageKey);
  const legacyRaw = storageKey !== LEGACY_PROGRESS_STORAGE_KEY ? localStorage.getItem(LEGACY_PROGRESS_STORAGE_KEY) : null;
  if (!raw && !legacyRaw) return defaultProgress;

  try {
    const parsed = JSON.parse(raw ?? legacyRaw ?? "{}") as Partial<UserProgress>;
    return {
      completedTopicIds: Array.isArray(parsed.completedTopicIds) ? parsed.completedTopicIds : [],
      quizAttempts: Number(parsed.quizAttempts) || 0,
      bestQuizScore: Number(parsed.bestQuizScore) || 0,
      gamesPlayed: Number(parsed.gamesPlayed) || 0,
      simulationsRun: Number(parsed.simulationsRun) || 0,
      points: Number(parsed.points) || 0,
      activityHistory: Array.isArray(parsed.activityHistory) ? parsed.activityHistory : [],
    };
  } catch {
    localStorage.removeItem(storageKey);
    return defaultProgress;
  }
};

export const saveUserProgress = (progress: UserProgress) => {
  if (isGuestMode()) {
    guestSessionProgress = progress;
    guestSessionActivity = progress.activityHistory;
    return;
  }
  localStorage.setItem(getProgressStorageKey(), JSON.stringify(progress));
};

export const updateUserProgress = (updater: (current: UserProgress) => UserProgress) => {
  const current = getUserProgress();
  const next = updater(current);
  saveUserProgress(next);
  return next;
};

export const logUserActivity = (type: ActivityEntry["type"], message: string) => {
  updateUserProgress((current) => {
    const entry: ActivityEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      message,
      createdAt: new Date().toISOString(),
    };
    return {
      ...current,
      activityHistory: [entry, ...current.activityHistory].slice(0, 25),
    };
  });
};
