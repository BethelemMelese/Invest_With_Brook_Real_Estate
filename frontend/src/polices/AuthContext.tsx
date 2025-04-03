import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api/axiosConfig";

// Define Auth Context
interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const checkAuth = async () => {
    try {
      localStorage.removeItem("token");
      const response = await api.get("/admin/auth");
      setIsAuthenticated(response.data.isAuthenticated);
      setUserId(response.data.userId);
    } catch (error) {
      setIsAuthenticated(false);
      setUserId(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
