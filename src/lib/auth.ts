const AUTH_STORAGE_KEY = "aiml_user";

export const getStoredUser = () => {
  const rawUser = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const isAuthenticated = () => Boolean(getStoredUser());
