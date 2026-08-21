import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store"; // Reemplaza a js-cookie
import { IUserSession } from "../types/types";

interface AuthContextType {
  userData: IUserSession | null;
  setUserData: (data: IUserSession | null) => void;
  handleLogout: () => void;
  isLoading:  boolean;
}

const AuthContext = createContext<AuthContextType>({
  userData: null,
  setUserData: () => {},
  handleLogout: () => {},
  isLoading: true
});

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [userData, setUserData] = useState<IUserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 👈 Estado de carga inicial
  
  // EFECTO 1: Guardo cuando el usuario cambia (Unificado a "user_session")
  useEffect(() => {
  const loadSession = async () => {
    try {
      const sessionData = await SecureStore.getItemAsync("user_session");

      if (sessionData) {
        setUserData(JSON.parse(sessionData));
      }
    } catch (error) {
      console.error("Error recuperando sesión:", error);
      setUserData(null);
    } finally {
      // 👈 2. IMPORTANTE: Cuando termina de leer (haya encontrado sesión o no), quitamos el loading
      setIsLoading(false);
    }
  };

  loadSession();
}, []);

  // EFECTO 2: Recupero la sesión al cargar la página (Unificado a "user_session")
  useEffect(() => {
    const loadSession = async () => {
      try {
        // Leo de SecureStore
        const sessionData = await SecureStore.getItemAsync("user_session");

        if (sessionData) {
          setUserData(JSON.parse(sessionData));
        }
      } catch (error) {
        console.error("Error recuperando sesión:", error);
        setUserData(null);
      }
    };

    loadSession();
  }, []);

  // LOGOUT: Limpia el mismo nombre "user_session"
  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("user_session");
      setUserData(null);
      router.replace("/login"); // Se recomienda 'replace' para no permitir volver atrás con el botón físico
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
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);