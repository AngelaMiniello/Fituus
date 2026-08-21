import api from "../service/api";
import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface Goals {
  dailyCalories: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  waterGoal: number;
  stepsGoal: number;
  workoutsPerWeekGoal: number;
  sleepGoal: number;
}

interface GoalsContextType {
  goals: Goals | null;
  setGoals: React.Dispatch<React.SetStateAction<Goals | null>>;
  fetchGoals: () => Promise<void>;
}

const GoalsContext = createContext<GoalsContextType | null>(null);

export function GoalsProvider({ children,}: { children: React.ReactNode;}) {
  
  const [goals, setGoals] = useState<Goals | null>(null);
  const { userData, isLoading } = useAuth();

 const fetchGoals = async () => {
    // 🛑 Si AuthContext todavía está leyendo el SecureStore, frenamos acá
    if (isLoading) return;

    // 🛑 Si ya terminó de buscar y no hay token, reseteamos las metas
    if (!userData?.token) {
      setGoals(null);
      return;
    }

    try {
      const res = await api.get("/goals");
      setGoals(res.data);
    } catch (error: any) {
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
    }
  };

  // 🚀 EL CAMBIO IMPORTANTE ESTÁ ACÁ ABAJO:
  useEffect(() => {
    fetchGoals();
  }, [isLoading, userData?.token]);

  return (
    <GoalsContext.Provider value={{ goals, setGoals, fetchGoals }}>
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