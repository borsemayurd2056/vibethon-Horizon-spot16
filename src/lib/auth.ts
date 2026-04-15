import { getSupabaseClient } from "@/lib/supabase";
import type { Provider, Session } from "@supabase/supabase-js";

const AUTH_STORAGE_KEY = "aiml_user";
const GUEST_MODE_KEY = "aiml_guest_mode";
type StoredUser = { email: string; name: string };

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
export const isGuestMode = () => localStorage.getItem(GUEST_MODE_KEY) === "true";

const getNameFromEmail = (email: string) => email.split("@")[0] || "User";
const supabase = getSupabaseClient();

const toStoredUser = (session: Session): StoredUser | null => {
  const email = session.user.email;
  if (!email) return null;
  const metaName = session.user.user_metadata?.full_name as string | undefined;
  return {
    email,
    name: metaName || getNameFromEmail(email),
  };
};

const persistSessionUser = (session: Session | null) => {
  if (!session) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }
  const user = toStoredUser(session);
  if (!user) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
};

export const initializeAuthSession = async () => {
  const { data } = await supabase.auth.getSession();
  persistSessionUser(data.session);
};

export const subscribeToAuthChanges = (onChange?: (isLoggedIn: boolean) => void) => {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    persistSessionUser(session);
    onChange?.(Boolean(session));
  });
  return () => data.subscription.unsubscribe();
};

export const signInWithOAuth = async (provider: Provider) => {
  localStorage.removeItem(GUEST_MODE_KEY);
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });
  if (error) throw error;
};

export const signInWithSupabase = async (email: string, password: string) => {
  localStorage.removeItem(GUEST_MODE_KEY);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const user: StoredUser = {
    email: data.user?.email ?? email,
    name: getNameFromEmail(data.user?.email ?? email),
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  return user;
};

export const signUpWithSupabase = async (name: string, email: string, password: string) => {
  localStorage.removeItem(GUEST_MODE_KEY);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name.trim() },
    },
  });
  if (error) throw error;

  const profileName = (data.user?.user_metadata?.full_name as string | undefined) || name.trim() || getNameFromEmail(email);
  const user: StoredUser = { email: data.user?.email ?? email, name: profileName };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  return user;
};

export const continueAsGuest = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.setItem(GUEST_MODE_KEY, "true");
};

export const signOutFromSupabase = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(GUEST_MODE_KEY);
};
