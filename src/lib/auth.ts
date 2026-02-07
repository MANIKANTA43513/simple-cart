import { supabase } from "@/integrations/supabase/client";

const TOKEN_KEY = "shop_auth_token";
const USER_KEY = "shop_user";

export interface User {
  id: string;
  username: string;
}

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getUser = (): User | null => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setAuth = (token: string, user: User) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Simple hash function for demo (in production use bcrypt on server)
const simpleHash = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

// Generate simple JWT-like token
const generateToken = (userId: string): string => {
  const payload = { userId, exp: Date.now() + 24 * 60 * 60 * 1000 };
  return btoa(JSON.stringify(payload));
};

export const register = async (
  username: string,
  password: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const hashedPassword = await simpleHash(password);

    const { error } = await supabase.from("users").insert({
      username,
      password: hashedPassword,
    });

    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "Username already exists" };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: "Registration failed" };
  }
};

export const login = async (
  username: string,
  password: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const hashedPassword = await simpleHash(password);

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("password", hashedPassword)
      .single();

    if (error || !user) {
      return { success: false, error: "Invalid username/password" };
    }

    // Check if already logged in elsewhere
    if (user.token) {
      return {
        success: false,
        error: "You cannot login on another device.",
      };
    }

    // Generate and save token
    const token = generateToken(user.id);

    const { error: updateError } = await supabase
      .from("users")
      .update({ token })
      .eq("id", user.id);

    if (updateError) {
      return { success: false, error: "Login failed" };
    }

    setAuth(token, { id: user.id, username: user.username });
    return { success: true };
  } catch (err) {
    return { success: false, error: "Login failed" };
  }
};

export const logout = async (): Promise<void> => {
  const user = getUser();
  if (user) {
    await supabase.from("users").update({ token: null }).eq("id", user.id);
  }
  clearAuth();
};
