import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { authAPI } from "@/services/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "pg_owner" | "admin"; // Stay consistent with backend casing
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await authAPI.getMe();
      // Expanded extraction to handle different backend response structures
      const userData = res.data?.data?.user || res.data?.data || res.data?.user;

      if (userData) {
        setUser(userData);
      } else {
        throw new Error("No user data found");
      }
    } catch (err) {
      console.error("Auth initialization failed:", err);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      
      const userData = res.data?.data?.user || res.data?.user;
      const accessToken = res.data?.data?.accessToken || res.data?.accessToken;
      const refreshToken = res.data?.data?.refreshToken || res.data?.refreshToken;

      if (!userData || !accessToken) throw new Error("Invalid server response");

      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      return userData; 
    } catch (error) {
      setUser(null);
      throw error; 
    } finally {
      setLoading(false);
    }
  };

  const register = useCallback(async (data: any) => {
    setLoading(true);
    try {
      const res = await authAPI.register(data);
      // Ensure we handle the response correctly based on your API structure
      const responseData = res.data?.data || res.data;
      const { user: userData, accessToken, refreshToken } = responseData;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        setUser(userData);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.clear(); // Clear everything to be safe
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated: !!user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};