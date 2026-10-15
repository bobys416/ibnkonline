"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  roles: string[];
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: AuthUser }>;
  register: (
    fullName: string,
    email: string,
    password: string,
    phone?: string
  ) => Promise<{ success: boolean; error?: string; alreadyExists?: boolean; user?: AuthUser }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const SESSION_KEY = "buymecart.session";
const AUTH_EVENT = "buymecart:auth-changed";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from localStorage and verify with server
  const loadStoredSession = useCallback(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const parsed = JSON.parse(raw);
      if (parsed && (parsed.id || parsed.userId) && parsed.email) {
        setUser({
          id: parsed.id || parsed.userId,
          email: parsed.email,
          fullName: parsed.fullName || parsed.email.split("@")[0],
          phone: parsed.phone,
          avatarUrl: parsed.avatarUrl,
          roles: Array.isArray(parsed.roles) ? parsed.roles : ["customer"],
        });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStoredSession();

    // Listen to custom cross-component auth events and cross-tab storage changes
    function handleAuthEvent() {
      loadStoredSession();
    }

    function handleStorage(e: StorageEvent) {
      if (e.key === SESSION_KEY) {
        loadStoredSession();
      }
    }

    window.addEventListener(AUTH_EVENT, handleAuthEvent);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(AUTH_EVENT, handleAuthEvent);
      window.removeEventListener("storage", handleStorage);
    };
  }, [loadStoredSession]);

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: AuthUser }> => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          setIsLoading(false);
          return {
            success: false,
            error: json.error || "Invalid email or password.",
          };
        }

        const authenticatedUser: AuthUser = {
          id: json.data.user.id,
          email: json.data.user.email,
          fullName: json.data.user.fullName,
          phone: json.data.user.phone,
          avatarUrl: json.data.user.avatarUrl,
          roles: json.data.user.roles || ["customer"],
        };

        // Save session locally with access token
        localStorage.setItem(
          SESSION_KEY,
          JSON.stringify({
            ...authenticatedUser,
            accessToken: json.data.accessToken,
          })
        );

        setUser(authenticatedUser);
        setIsLoading(false);
        window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: authenticatedUser }));

        return { success: true, user: authenticatedUser };
      } catch (err) {
        setIsLoading(false);
        return {
          success: false,
          error: "Unable to connect to authentication service. Check network connection.",
        };
      }
    },
    []
  );

  const register = useCallback(
    async (
      fullName: string,
      email: string,
      password: string,
      phone?: string
    ): Promise<{ success: boolean; error?: string; alreadyExists?: boolean; user?: AuthUser }> => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone ? phone.trim() : undefined,
            password,
            confirmPassword: password,
            acceptTerms: true,
          }),
        });

        const json = await res.json();
        if (res.status === 409 || json.data?.hasExistingAccount) {
          setIsLoading(false);
          return {
            success: false,
            alreadyExists: true,
            error: json.error || "An account with this email already exists. Please log in.",
          };
        }

        if (!res.ok || !json.success) {
          setIsLoading(false);
          return {
            success: false,
            error: json.error || "Could not complete registration. Please check your details.",
          };
        }

        const registeredUser: AuthUser = {
          id: json.data.user.id,
          email: json.data.user.email,
          fullName: json.data.user.fullName,
          phone: json.data.user.phone,
          roles: json.data.user.roles || ["customer"],
        };

        // Save session locally with access token
        localStorage.setItem(
          SESSION_KEY,
          JSON.stringify({
            ...registeredUser,
            accessToken: json.data.accessToken,
          })
        );

        setUser(registeredUser);
        setIsLoading(false);
        window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: registeredUser }));

        return { success: true, user: registeredUser };
      } catch (err) {
        setIsLoading(false);
        return {
          success: false,
          error: "Network error during registration. Please try again.",
        };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Continue client cleanup regardless of server response
    }
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setIsLoading(false);
    window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: null }));
  }, []);

  const refresh = useCallback(async () => {
    loadStoredSession();
  }, [loadStoredSession]);

  const value: AuthContextValue = {
    user,
    isAuthenticated: Boolean(user && user.id),
    isLoading,
    login,
    register,
    logout,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

