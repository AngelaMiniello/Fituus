import React from "react";
import { useFocusEffect } from "expo-router";
import { useDailyProgress } from "@/context/DailyProgress";
import { View, ImageBackground, ScrollView, Text } from "react-native";
import HealthOverview from "@/components/ui/HealthOverview";
import NutritionCards from "@/components/ui/NutritionCards";

export default function HomePage() {
  const { fetchDailyProgress } = useDailyProgress();
  useFocusEffect(React.useCallback(() => {
    void fetchDailyProgress();
  }, [fetchDailyProgress]));

  return (
    <ImageBackground
      source={require("../../assets/images/public/bg-organic-blue.png")}
      className="flex-1 bg-[#DDEAF4]"
      resizeMode="cover"
    >
        <ScrollView 
          bounces={false}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, padding: 24, paddingBottom: 120, gap: 20 }}
        >
          <View className="mt-2 mb-1">
            <Text className="text-xs tracking-widest uppercase font-chillax-medium text-zinc-800">Your day, your pace</Text>
            <Text className="mt-2 text-3xl text-gray-800 font-chillax-bold">Today</Text>
            <Text className="mt-2 text-md font-chillax-medium text-zinc-800">Every step counts.</Text>
          </View>
          <NutritionCards />
          <HealthOverview />
        </ScrollView>
    </ImageBackground>
  );
}
