import React from "react";
import { Text, View } from "react-native";
import { Beef, Cuboid, Flame, Sparkles, Wheat } from "lucide-react-native";
import { useGoals } from "@/context/GoalsContext";
import { useDailyProgress } from "@/context/DailyProgress";
import { ProgressRing } from "./ProgressRing";

const palette = {
  pink: "#D9738E",
  blue: "#7797D9",
  sky: "#98BDED",
  peach: "#E3AA88",
  surface: "#F2F2F2",
  ink: "#111827",
  muted: "#4B5563",
};

export default function NutritionCards() {
  const { goals } = useGoals();
  const { dailyProgress } = useDailyProgress();

  if (!goals || !dailyProgress) return null;

  const calorieGoal = goals.dailyCalories ?? 0;
  const consumed = dailyProgress.caloriesConsumed ?? 0;
  const caloriesLeft = calorieGoal - consumed;
  const remainingPercentage = calorieGoal > 0
    ? Math.max(0, Math.min((caloriesLeft / calorieGoal) * 100, 100))
    : 0;
  const macros = [
    { label: "Proteins", value: dailyProgress.protein ?? 0, goal: goals.proteinGoal ?? 0, icon: Beef, color: palette.pink },
    { label: "Carbs", value: dailyProgress.carbs ?? 0, goal: goals.carbsGoal ?? 0, icon: Wheat, color: palette.blue },
    { label: "Fats", value: dailyProgress.fat ?? 0, goal: goals.fatGoal ?? 0, icon: Cuboid, color: palette.peach },
  ];

  return (
    <View>
      <View className="rounded-[28px] p-5 bg-white/70">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text style={{ fontFamily: "Chillax-Medium" }} className="text-[10px] leading-4 tracking-[1.5px] text-[#4B5563]">FUEL YOUR ENERGY</Text>
            <Text style={{ fontFamily: "Chillax-Semibold" }} className="mt-1 text-2xl leading-8 text-gray-900">Calories</Text>
          </View>
          <View className="w-[46px] h-[46px] rounded-xl bg-[#98BDED]/30 items-center justify-center">
            <Flame size={23} color={palette.ink} strokeWidth={1.7} />
          </View>
        </View>

        <View className="items-center my-6">
          <ProgressRing percentage={remainingPercentage} color={palette.blue}
            trackColor="#FFFFFF" size={190} strokeWidth={11}>
            <Text style={{ fontFamily: "Chillax-Bold" }} className="text-4xl leading-[46px] text-gray-900">{Math.abs(caloriesLeft)}</Text>
            <Text style={{ fontFamily: "Chillax-Regular" }} className="text-sm leading-[19px] text-[#4B5563]">{caloriesLeft < 0 ? "kcal over target" : "kcal left"}</Text>
          </ProgressRing>
        </View>

        <View className="flex-row flex-wrap -mx-1">
          <View className="flex-1 min-w-[110px] flex-row items-center p-3 m-1 rounded-[18px] bg-[#98BDED]/30">
            <Sparkles size={17} color={palette.muted} />
            <View className="flex-1 ml-2">
              <Text style={{ fontFamily: "Chillax-Medium" }} className="text-[14px] leading-4 text-[#4B5563]">Objetive</Text>
              <Text style={{ fontFamily: "Chillax-Semibold" }} className="text-[16px] leading-[23px] text-gray-900">{calorieGoal} <Text style={{ fontFamily: "Chillax-Medium" }} className="text-[12px] text-[#4B5563]">kcal</Text></Text>
            </View>
          </View>
          <View className="flex-1 min-w-[110px] flex-row items-center p-3 m-1 rounded-[18px] bg-[#98BDED]/30">
            <Flame size={17} color={palette.muted} />
            <View className="flex-1 ml-2">
              <Text style={{ fontFamily: "Chillax-Medium" }} className="text-[14px] leading-4 text-[#4B5563]">Consumed</Text>
              <Text style={{ fontFamily: "Chillax-Semibold" }} className="text-[16px] leading-[23px] text-gray-900">{consumed} <Text style={{ fontFamily: "Chillax-Medium" }} className="text-[12px] text-[#4B5563]">kcal</Text></Text>
            </View>
          </View>
        </View>
      </View>

      <View className="rounded-[28px] p-5 mt-5 bg-white/70">
        <Text style={{ fontFamily: "Chillax-Medium" }} className="text-[10px] leading-4 tracking-[1.5px] text-[#4B5563]">YOUR BALANCE</Text>
        <Text style={{ fontFamily: "Chillax-Semibold" }} className="mt-1 text-2xl leading-8 text-gray-900">Macronutrients</Text>
        <Text style={{ fontFamily: "Chillax-Medium" }} className="text-sm leading-[19px] text-[#4B5563] mt-[5px] mb-1">Here’s your nutrition breakdown for today.</Text>
        {macros.map((macro) => {
          const Icon = macro.icon;
          const percentage = macro.goal > 0
            ? Math.max(0, Math.min((macro.value / macro.goal) * 100, 100))
            : 0;
          return (
            <View key={macro.label} className="mt-[18px] p-1">
              <View className="flex-row flex-wrap items-center justify-between gap-2">
                <View className="flex-row items-center mb-2 mr-2">
                  <View className="w-8 h-8 rounded-xl items-center justify-center mr-[9px]" style={{ backgroundColor: macro.color }}>
                    <Icon size={17} color={palette.ink} strokeWidth={1.7} />
                  </View>
                  <Text style={{ fontFamily: "Chillax-Medium" }} className="text-[14px] leading-5 text-gray-900">{macro.label}</Text>
                </View>
                <Text style={{ fontFamily: "Chillax-Semibold" }} className="mb-2 text-sm leading-5 text-gray-900">{macro.value} <Text style={{ fontFamily: "Chillax-Regular" }} className="text-[12px] text-[#4B5563]">/ {macro.goal} g</Text></Text>
              </View>
              <View className="h-[9px] rounded-[9px] bg-white overflow-hidden">
                <View className="h-full rounded-[9px]" style={{ backgroundColor: macro.color, width: `${percentage}%` }} />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
