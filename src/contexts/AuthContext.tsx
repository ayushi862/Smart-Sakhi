import React, { createContext, useContext, useEffect, useState } from "react";

interface UserData {
  email: string;
  fullName: string;
  phone: string;
  role: "buyer" | "seller";
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  signUp: (email: string, fullName: string, phone: string, role: "buyer" | "seller") => void;
  signIn: (email: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = "smart_sakhi_users";
const CURRENT_USER_KEY = "smart_sakhi_current_user";

const getStoredUsers = (): Record<string, UserData> => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  const signUp = (email: string, fullName: string, phone: string, role: "buyer" | "seller") => {
    const users = getStoredUsers();
    const userData: UserData = { email, fullName, phone, role };
    users[email] = userData;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const signIn = (email: string) => {
    const users = getStoredUsers();
    const found = users[email];
    if (!found) {
      throw new Error("No account found with this email. Please sign up first.");
    }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found));
    setUser(found);
  };

  const signOut = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
