import { Droplets, Footprints, Dumbbell, Flame, Weight,} from "lucide-react-native";
import React from "react";
import { View, Text } from "react-native";
import { ProgressRing } from "./ProgressRing";
//contexts 
import { useGoals } from "@/context/GoalsContext";
import { useDailyProgress } from "@/context/DailyProgress";
import { useAuth } from "@/context/AuthContext";

export default function HealthOverview() {
  const { goals } = useGoals();
  const { dailyProgress } = useDailyProgress();
  const { userData } = useAuth();
  
  // 1. CÁLCULOS Y VALORES DE CADA MÉTRICA (Con fallbacks seguros)

  // AGUA (en ml)
  const waterGoal = goals?.waterGoal || 2500;
  const waterConsumed = dailyProgress?.water || 0;
  const waterPercentage = Math.min((waterConsumed / waterGoal) * 100, 100);

  // PASOS
  const stepsGoal = goals?.stepsGoal || 10000;
  // Si agrego los pasos a dailyProgress los leo de ahí; por ahora fallback a 0
  const stepsDone = (dailyProgress as any)?.steps || 0; 
  const stepsPercentage = Math.min((stepsDone / stepsGoal) * 100, 100);

  // EJERCICIO (Calorías quemadas / Tiempo)
  // Uso dailyProgress.caloriesBurned como referencia
  const exerciseGoal = (goals as any)?.exerciseGoal || 60; 
  const exerciseMinutes = dailyProgress?.exerciseMinutes || 0;
  const exercisePercentage = Math.min((exerciseMinutes / exerciseGoal) * 100, 100);
  
  
  // Lista de ejercicios reales
  const exerciseEntries = dailyProgress?.exercises || [];
  const totalCalories = dailyProgress?.caloriesBurned || 0;

  // PESO (Tomado del perfil del usuario en AuthContext)
  const currentWeight = userData?.user?.weight || 0;
  const targetWeight = (userData?.user as any)?.targetWeight || null;

  return (
    <View className="gap-5">
      
      {/* 1. CARD AGUA */}
      <View className="p-5 border rounded-3xl bg-white/70 border-white/60">
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-xl text-gray-900 font-chillax-semibold">Hydration</Text>
            <Text className="mt-1 text-sm font-chillax text-zinc-600">Logged intake</Text>
          </View>
          <View className="p-3 rounded-2xl bg-cyan-500/10">
            <Droplets size={22} color="#7999D9" />
          </View>
        </View>

        <View className="items-center mt-8">
          <ProgressRing trackColor="#FFFFFF" percentage={waterPercentage} color="#7999D9">
            <Text className="text-4xl text-gray-900 font-chillax-bold">
              {(waterConsumed / 1000).toFixed(2)} L
            </Text>
            <Text className="text-sm font-chillax text-zinc-600">
              of {(waterGoal / 1000).toFixed(1)}L
            </Text>
          </ProgressRing>
        </View>
      </View>

      {/* 2. CARD PASOS */}
      <View className="p-5 border rounded-3xl bg-white/70 border-white/60">
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-xl text-gray-900 font-chillax-semibold">Steps</Text>
            <Text className="mt-1 text-sm font-chillax text-zinc-600">Registered steps</Text>
          </View>
          <View className="p-3 rounded-2xl bg-[#7999D9]/10">
            <Footprints size={22} color="#7999D9" />
          </View>
        </View>

        <View className="items-center mt-8">
          <ProgressRing trackColor="#FFFFFF" percentage={stepsPercentage} color="#7999D9">
            <Text className="text-4xl text-gray-900 font-chillax-bold">
              {stepsDone.toLocaleString()}
            </Text>
            <Text className="text-sm font-chillax text-zinc-600">
              of {stepsGoal.toLocaleString()}
            </Text>
          </ProgressRing>
        </View>
      </View>

      {/* 3. CARD EJERCICIO */}
      <View className="p-5 border rounded-3xl bg-white/70 border-white/60">
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-xl text-gray-900 font-chillax-semibold">Exercise</Text>
            <Text className="mt-1 text-sm font-chillax text-zinc-600">Today's activity</Text>
          </View>
          <View className="p-3 rounded-2xl bg-[#D9667B]/10">
            <Dumbbell size={22} color="#D9667B" />
          </View>
        </View>

        <View className="items-center mt-8">
          <ProgressRing trackColor="#FFFFFF" percentage={exercisePercentage} color="#D9667B">
            <Text className="text-4xl text-gray-900 font-chillax-bold">{exerciseMinutes}</Text>
            <Text className="text-sm font-chillax text-zinc-600">of {exerciseGoal} min</Text>
          </ProgressRing>
        </View>

        {/* Lista de Ejercicios */}
        {exerciseEntries.length > 0 && (
          <View className="gap-3 mt-6">
            {exerciseEntries.map((exercise: any, index: number) => (
              <View
                key={index}
                className="flex-row items-center justify-between p-4 rounded-2xl bg-white/50"
              >
                <View>
                  <Text className="text-gray-900 font-chillax-medium">{exercise.type}</Text>
                  <Text className="text-sm font-chillax text-zinc-600">{exercise.minutes} min</Text>
                </View>
                <View className="items-end">
                  <Text className="font-chillax-semibold text-[#D9667B]">
                    {exercise.calories} kcal
                  </Text>
                  <Text className="text-xs font-chillax text-zinc-500">burned</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Total Calorías */}
        <View className="p-4 mt-5 rounded-2xl bg-pink-200/70">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-900 font-chillax">Total calories burned</Text>
            <Text className="text-lg text-gray-900 font-chillax-bold">
              {totalCalories} kcal
            </Text>
          </View>
        </View>
      </View>

      {/* 4. CARD PESO */}
      <View className="p-5 border rounded-3xl bg-white/70 border-white/60">
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-xl text-gray-900 font-chillax-semibold">Latest weight</Text>
            <Text className="mt-1 text-sm font-chillax text-zinc-600">Most recent entry</Text>
          </View>
          <View className="p-3 rounded-2xl bg-[#7999D9]/10">
            <Weight size={22} color="#7999D9" />
          </View>
        </View>

        <View className="items-center justify-center mt-10">
          <View className="items-center justify-center px-8 py-6 rounded-full bg-[#7999D9] w-44 h-44">
            <Text className="text-5xl text-center text-gray-900 font-chillax-bold">{currentWeight || "—"}</Text>
            <Text className="mt-1 text-center text-gray-900 font-chillax">kg</Text>
          </View>

          <View className="items-center px-5 py-3 mt-6 rounded-2xl bg-white/50">
            <Text className="text-sm font-chillax text-zinc-600">Profile weight</Text>
          </View>

          {targetWeight != null && <View className="flex-row gap-3 mt-6">
            <View className="px-4 py-2 rounded-xl bg-[#7999D9]">
              <Text className="text-sm text-gray-900 font-chillax-medium">Target weight</Text>
            </View>
            <View className="px-4 py-2 rounded-xl bg-[#7999D9]">
              <Text className="text-sm text-gray-900 font-chillax-medium">{targetWeight} kg</Text>
            </View>
          </View>}
        </View>
      </View>

    </View>
  );
}
