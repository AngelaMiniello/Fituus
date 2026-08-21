import api from "../service/api";
import { createContext, useContext, useState, useEffect } from "react";
import { Exercise } from "@/types/types";
import { useAuth } from "./AuthContext";

interface DailyProgress {
  caloriesConsumed: number;
  caloriesBurned:  number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  exerciseMinutes: number;  
  exercises: Exercise[];
}

interface DailyProgressType {
  dailyProgress: DailyProgress | null;
  setDailyProgress: React.Dispatch<React.SetStateAction<DailyProgress | null>>;
  fetchDailyProgress: () => Promise<void>;
}

const DailyProgressContext = createContext<DailyProgressType | null>(null);

export function DailyProgressProvider({ children,}: { children: React.ReactNode;}) {
  const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(null);
  const { userData } = useAuth();

  const fetchDailyProgress = async () => {
     if (!userData?.token) {
      setDailyProgress(null);
      return;
    }
    
    try{
      const res = await api.get("/dailyprogress");
      setDailyProgress(res.data);
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 404) {
        console.log("El usuario no tiene metas registradas aún.");
        setDailyProgress(null);
      } else if (status === 401) {
        // 🔒 Manejamos silenciosamente el 401 si no hay sesión activa aún
        console.log("Usuario deslogueado o token no disponible aún.");
        setDailyProgress(null);
      } else {
        console.error("Error al obtener el progreso diario:", error);
      }
    }
  };

  useEffect(() => {
    fetchDailyProgress();
  }, []);
    
    return (
    <DailyProgressContext.Provider value={{ dailyProgress, setDailyProgress, fetchDailyProgress }}>
      {children}
    </DailyProgressContext.Provider>
  );
}

export function useDailyProgress() {
  const context = useContext(DailyProgressContext);

  if (!context) {
    throw new Error(
      "useGoals must be used inside DailyTotalsContext"
    );
  }

  return context;
}