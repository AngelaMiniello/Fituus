import { Droplets, Footprints, Dumbbell, Flame, Weight,} from "lucide-react-native";
import React from "react";
import { View, Text, ScrollView } from "react-native";
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
  const caloriesBurned = dailyProgress?.caloriesBurned || 0;
  
  // Lista de ejercicios reales
  const exerciseEntries = dailyProgress?.exercises || [];
  const totalCalories = dailyProgress?.caloriesBurned || 0;

  // PESO (Tomado del perfil del usuario en AuthContext)
  const currentWeight = userData?.user?.weight || 0;
  const targetWeight = (userData?.user as any)?.targetWeight || null;

  return (
    <ScrollView className="flex-1 bg-black" contentContainerStyle={{ padding: 12, paddingBottom: 150, gap: 16}}>
      
      {/* 1. CARD AGUA */}
      <View className="p-5 shadow-xl rounded-3xl bg-zinc-900">
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-xl font-semibold text-white">Hidratación</Text>
            <Text className="mt-1 text-sm text-zinc-400">Consumo registrado</Text>
          </View>
          <View className="p-3 rounded-2xl bg-cyan-500/10">
            <Droplets size={22} color="#22d3ee" />
          </View>
        </View>

        <View className="items-center mt-8">
          <ProgressRing percentage={waterPercentage} color="#67e8f9">
            <Text className="text-4xl font-bold text-white">
              {(waterConsumed / 1000).toFixed(1)}L
            </Text>
            <Text className="text-sm text-zinc-400">
              de {(waterGoal / 1000).toFixed(1)}L
            </Text>
          </ProgressRing>
        </View>
      </View>

      {/* 2. CARD PASOS */}
      <View className="p-5 shadow-xl rounded-3xl bg-zinc-900">
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-xl font-semibold text-white">Pasos</Text>
            <Text className="mt-1 text-sm text-zinc-400">Pasos registrados</Text>
          </View>
          <View className="p-3 rounded-2xl bg-[#F2B47E]/10">
            <Footprints size={22} color="#F2B47E" />
          </View>
        </View>

        <View className="items-center mt-8">
          <ProgressRing percentage={stepsPercentage} color="#F2B47E">
            <Text className="text-4xl font-bold text-white">
              {stepsDone.toLocaleString()}
            </Text>
            <Text className="text-sm text-zinc-400">
              de {stepsGoal.toLocaleString()}
            </Text>
          </ProgressRing>
        </View>
      </View>

      {/* 3. CARD EJERCICIO */}
      <View className="p-5 shadow-xl rounded-3xl bg-zinc-900">
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-xl font-semibold text-white">Ejercicio</Text>
            <Text className="mt-1 text-sm text-zinc-400">Actividad del día</Text>
          </View>
          <View className="p-3 rounded-2xl bg-[#D9667B]/10">
            <Dumbbell size={22} color="#D9667B" />
          </View>
        </View>

        <View className="items-center mt-8">
          <ProgressRing percentage={exercisePercentage} color="#D9667B">
            <Text className="text-4xl font-bold text-white">{exerciseMinutes}</Text>
            <Text className="text-sm text-zinc-400">de {exerciseGoal} min</Text>
          </ProgressRing>
        </View>

        {/* Lista de Ejercicios */}
        {exerciseEntries.length > 0 && (
          <View className="gap-3 mt-6">
            {exerciseEntries.map((exercise: any, index: number) => (
              <View
                key={index}
                className="flex-row items-center justify-between p-4 rounded-2xl bg-zinc-800/70"
              >
                <View>
                  <Text className="font-medium text-white">{exercise.type}</Text>
                  <Text className="text-sm text-zinc-400">{exercise.minutes} min</Text>
                </View>
                <View className="items-end">
                  <Text className="font-semibold text-[#D9667B]">
                    {exercise.calories} kcal
                  </Text>
                  <Text className="text-xs text-zinc-500">quemadas</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Total Calorías */}
        <View className="p-4 mt-5 rounded-2xl bg-[#D9667B]">
          <View className="flex-row items-center justify-between">
            <Text className="text-zinc-200">Calorías totales</Text>
            <Text className="text-lg font-bold text-white">
              {totalCalories} kcal
            </Text>
          </View>
        </View>
      </View>

      {/* 4. CARD PESO */}
      <View className="p-5 shadow-xl rounded-3xl bg-zinc-900">
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-xl font-semibold text-white">Último peso</Text>
            <Text className="mt-1 text-sm text-zinc-400">Registro más reciente</Text>
          </View>
          <View className="p-3 rounded-2xl bg-[#6289D9]/10">
            <Weight size={22} color="#6289D9" />
          </View>
        </View>

        <View className="items-center justify-center mt-10">
          <View className="items-center justify-center px-8 py-6 rounded-full bg-[#6289D9] w-44 h-44">
            <Text className="text-5xl font-bold text-center text-white">{currentWeight}</Text>
            <Text className="mt-1 text-center text-zinc-200">kg</Text>
          </View>

          <View className="items-center px-5 py-3 mt-6 rounded-2xl bg-zinc-800/70">
            <Text className="text-sm text-zinc-400">Última actualización</Text>
            <Text className="mt-1 font-medium text-white">DATE</Text>
          </View>

          <View className="flex-row gap-3 mt-6">
            <View className="px-4 py-2 rounded-xl bg-[#6289D9]">
              <Text className="text-sm font-medium text-white">LOST WEIGHT</Text>
            </View>
            <View className="px-4 py-2 rounded-xl bg-[#6289D9]">
              <Text className="text-sm font-medium text-white">{targetWeight}</Text>
            </View>
          </View>
        </View>
      </View>

    </ScrollView>
  );
}