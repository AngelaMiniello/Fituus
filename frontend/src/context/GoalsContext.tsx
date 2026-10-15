import api from "../service/api";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface Goals {
  dailyCalories: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  waterGoal: number;
  stepsGoal: number;
  workoutsPerWeek: number;
  sleepGoal: number;
}

interface GoalsContextType {
  goals: Goals | null;
  setGoals: React.Dispatch<React.SetStateAction<Goals | null>>;
  fetchGoals: () => Promise<void>;
  loading: boolean;
  error: boolean;
}

const GoalsContext = createContext<GoalsContextType | null>(null);

export function GoalsProvider({ children,}: { children: React.ReactNode;}) {
  
  const [goals, setGoals] = useState<Goals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { userData, isLoading } = useAuth();

 const fetchGoals = async () => {
    // 🛑 si AuthContext todavía está leyendo el SecureStore, freno acá
    if (isLoading) return;

    // 🛑 si ya terminó de buscar y no hay token, reseteo las metas
    if (!userData?.token) {
      setGoals(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);
    try {
      const res = await api.get("/goals");
      setGoals(res.data);
    } catch (error: any) {
      setError(true);
      const status = error?.response?.status;

      if (status === 404) {
        console.log("El usuario no tiene metas registradas aún.");
        setGoals(null);
      } else if (status === 401) {
        console.log("Usuario deslogueado o token no disponible aún.");
        setGoals(null);
      } else {
        console.error("Error al obtener las metas:", error);
      }
    } finally { setLoading(false); }
  };

  //EL CAMBIO IMPORTANTE ESTÁ ACÁ ABAJO
  useEffect(() => {
    fetchGoals();
  }, [isLoading, userData?.token]);

  return (
    <GoalsContext.Provider value={{ goals, setGoals, fetchGoals, loading, error }}>
      {children}
    </GoalsContext.Provider>
  );
}

export function useGoals() {
  const context = useContext(GoalsContext);

  if (!context) {
    throw new Error(
      "useGoals must be used inside GoalsProvider"
    );
  }

  return context;
}
