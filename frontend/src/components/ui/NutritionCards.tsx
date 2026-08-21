import { Flame, Beef, Wheat, Droplets, Sparkles, Cuboid } from "lucide-react-native";
import { useGoals } from "@/context/GoalsContext";
import { useDailyProgress } from "@/context/DailyProgress";
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { ProgressRing } from "./ProgressRing";

export default function NutritionCards() {

  const { goals } = useGoals();
  const { dailyProgress } = useDailyProgress();
  
  if (!goals || !dailyProgress) {
    return null;
  }

  const macros = [
    {
      label: "Proteins",
      value: dailyProgress?.protein ?? 0,
      goal: goals?.proteinGoal ?? 0,
      icon: Beef,
    },
    {
      label: "Carbs",
      value: dailyProgress.carbs ?? 0,
      goal: goals?.carbsGoal ?? 0,
      icon: Wheat
    },
    {
      label: "Fats",
      value: dailyProgress.fat ?? 0,
      goal: goals?.fatGoal ?? 0,
      icon: Cuboid
    },
  ];

  const caloriesLeft =
    (goals?.dailyCalories ?? 0) -
    (dailyProgress?.caloriesConsumed ?? 0);
  
  return (
    <View className="gap-4 p-3 pb-2">
      
      {/* 1. CALORIES CARD */}
      <View className="p-5 shadow-xl rounded-3xl bg-zinc-900">
        <Text className="text-xl font-semibold text-white">Calories</Text>

        {/* Goal vs Consumed */}
        <View className="flex-row items-center justify-around my-6 text-sm">
          
          <View className="flex-row items-center gap-3">
            <Sparkles size={20} color="#F2B47E" />
            <View className="ml-2">
              <Text className="text-xs text-zinc-400">Goal</Text>
              <Text className="font-semibold text-white">
                {goals?.dailyCalories ?? 0}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3">
            <Flame size={20} color="#F2B47E" />
            <View className="ml-2">
              <Text className="text-xs text-zinc-400">Consumed</Text>
              <Text className="font-semibold text-white">
                {dailyProgress?.caloriesConsumed ?? 0}
              </Text>
            </View>
          </View>

        </View>
        
        {/* Anillo de Calorías Restantes (Usa el ProgressRing dinámico) */}
        <View className="items-center justify-center mt-2">
          <ProgressRing 
            percentage={caloriesLeft} 
            color="#F2B47E" 
            size={160}
            strokeWidth={12}
          >
            <View className="items-center">
              <Text className="text-3xl font-bold text-white">
                {caloriesLeft}
              </Text>
              <Text className="text-xs text-zinc-400">cal. left</Text>
            </View>
          </ProgressRing>
        </View>
      </View>

      {/* 2. MACROS CARD */}
      <View className="p-6 shadow-xl rounded-3xl bg-zinc-900">
        <Text className="text-xl font-semibold text-white">Macros</Text>

        <View className="gap-5 mt-6">
          {macros.map((macro) => {
            const Icon = macro.icon;
            const percentage = macro.goal
              ? Math.min((macro.value / macro.goal) * 100, 100)
              : 0;

            return (
              <View key={macro.label}>
                {/* Header de la barra */}
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center gap-2">
                    <Icon size={18} color="#FFFFFF" />
                    <Text className="font-medium text-white">
                      {macro.label}
                    </Text>
                  </View>

                  <Text className="text-sm text-zinc-300">
                    {macro.value}g / {macro.goal}g
                  </Text>
                </View>

                {/* Barra de progreso de cada Macro */}
                <View className="h-3 overflow-hidden rounded-full bg-zinc-700">
                  <View
                    className="h-full rounded-full bg-[#D9667B]"
                    style={{ width: `${percentage}%` }}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>

    </View>
  );
}