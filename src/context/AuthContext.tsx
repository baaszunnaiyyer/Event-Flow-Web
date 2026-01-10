import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { signInWithPopup, signOut as firebaseSignOut, User, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { api } from "../utils/api";

interface UserData {
  user_id: number;
  name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  country?: string;
  is_private?: boolean;
  availability_day_of_week?: string;
  availability_start_time?: string;
  availability_end_time?: string;
  created_at?: string;
  updated_at?: string;
  timezone?: string;
  status?: string;
}

interface AuthContextType {
  user: UserData | null;
  firebaseUser: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserData = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setLoading(false);
      return;
    }

    setToken(storedToken);
    const response = await api.get<UserData>("/settings");
    if (response.data) {
      setUser(response.data);
    } else {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      refreshUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login with email:", email);
      const response = await api.post<{ token: string; userId: number }>("/auth/login", {
        email,
        password,
      });

      console.log("Login response:", response);

      if (response.error) {
        console.error("Login error response:", response.error);
        return { success: false, error: response.error };
      }

      if (response.data?.token) {
        const tokenValue = response.data.token;
        localStorage.setItem("token", tokenValue);
        setToken(tokenValue);
        await refreshUserData();
        return { success: true };
      }

      return { success: false, error: "Invalid response from server" };
    } catch (error) {
      console.error("Login exception:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setFirebaseUser(result.user);
      
      // Get the Google OAuth credential which contains the ID token for backend verification
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const idToken = credential?.idToken;
      
      if (!idToken) {
        await firebaseSignOut(auth);
        setFirebaseUser(null);
        return { success: false, error: "Failed to get Google authentication token" };
      }

      console.log("Sending Google ID token to backend...");
      const response = await api.post<{ token: string; user: UserData }>("/auth/google", {
        idToken,
      });

      console.log("Backend response:", response);

      if (response.error) {
        await firebaseSignOut(auth);
        setFirebaseUser(null);
        return { success: false, error: response.error };
      }

      if (response.data?.token) {
        const tokenValue = response.data.token;
        localStorage.setItem("token", tokenValue);
        setToken(tokenValue);
        if (response.data.user) {
          setUser(response.data.user);
        } else {
          await refreshUserData();
        }
        return { success: true };
      }

      return { success: false, error: "Invalid response from server" };
    } catch (error: any) {
      console.error("Google login error:", error);
      if (error.code !== "auth/popup-closed-by-user") {
        console.error("Full error details:", error);
      }
      
      // Sign out on any error
      try {
        await firebaseSignOut(auth);
        setFirebaseUser(null);
      } catch (signOutError) {
        console.error("Sign out error:", signOutError);
      }
      
      return {
        success: false,
        error:
          error.code === "auth/popup-closed-by-user"
            ? "Sign-in cancelled"
            : error.message || "Google sign-in failed",
      };
    }
  };

  const logout = async () => {
    try {
      if (firebaseUser) {
        await firebaseSignOut(auth);
      }
    } catch (error) {
      console.error("Firebase logout error:", error);
    }
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setFirebaseUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        token,
        loading,
        login,
        loginWithGoogle,
        logout,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
