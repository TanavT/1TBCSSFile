import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export interface User {
  _id: string;
  username: string;
  winrates?: any;
  elo?: any;
  friendList?: string[];
  challenges?: any[];
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_SERVER}/account/me`, {
        withCredentials: true,
      })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth within the bounds of AuthProvider");
  }
  return ctx;
}
