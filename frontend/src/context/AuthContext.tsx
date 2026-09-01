import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { IUserSession } from "../types/types";
import { setAuthToken } from "@/service/api";

interface AuthContextType {
  userData: IUserSession | null;
  setUserData: (data: IUserSession | null) => void;
  handleLogout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  userData: null,
  setUserData: () => {},
  handleLogout: () => {},
  isLoading: true,
});

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [userData, setUserDataState] = useState<IUserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. CARGA INICIAL: Recuperar sesión al abrir la app
  useEffect(() => {
    const loadSession = async () => {
      try {
        const sessionData = await SecureStore.getItemAsync("user_session");

        if (sessionData) {
          const parsedSession: IUserSession = JSON.parse(sessionData);
          setUserDataState(parsedSession);
          setAuthToken(parsedSession.token); //Sincronizamos con api.ts en RAM
        }
      } catch (error) {
        console.error("Error recuperando sesión:", error);
        setUserDataState(null);
        setAuthToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  // 2. SET USER DATA: Guardar en React state, SecureStore y RAM
  const setUserData = async (data: IUserSession | null) => {
    setUserDataState(data);

    if (data) {
      setAuthToken(data.token); // Instantáneo en RAM para el interceptor
      await SecureStore.setItemAsync("user_session", JSON.stringify(data));
    } else {
      setAuthToken(null);
      await SecureStore.deleteItemAsync("user_session");
    }
  };

  // 3. LOGOUT
  const handleLogout = async () => {
    try {
      await setUserData(null); // Limpia estado, RAM y SecureStore
      router.replace("/login");
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        handleLogout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);