import { getSupabaseClient } from "@/lib/supabase";

const AUTH_STORAGE_KEY = "aiml_user";
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

const getNameFromEmail = (email: string) => email.split("@")[0] || "User";

export const signInWithSupabase = async (email: string, password: string) => {
  const supabase = getSupabaseClient();
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
  const supabase = getSupabaseClient();
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

export const signOutFromSupabase = async () => {
  const supabase = getSupabaseClient();
  await supabase.auth.signOut();
  localStorage.removeItem(AUTH_STORAGE_KEY);
};
