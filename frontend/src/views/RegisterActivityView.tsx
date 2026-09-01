import { useRouter, useLocalSearchParams  } from "expo-router";
import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from "react-native";

type ActivityLevel =
  | "sedentary"
  | "lightly active"
  | "moderately active"
  | "active"
  | "very active";

export default function RegisterActivityView() {
  const router = useRouter();
  
  // 1. Leemos los parámetros que enviamos desde RegisterProfileView
  const { token, weight, height, gender } = useLocalSearchParams<{
    token?: string;
    weight?: string;
    height?: string;
    gender?: string;
  }>();

  const [activityLevel, setActivityLevel] = useState<ActivityLevel | "">("");//choose activity settings

  // 2. Pasamos todo junto a /register/goals (con o sin nivel de actividad)
  const handleNext = () => {
    router.push({
      pathname: "/register/goals",
      params: {
        token,
        weight,
        height,
        gender,
        activityLevel,
      },
    } as any);
  };
  
  const options: ActivityLevel[] = [ "sedentary", "lightly active", "moderately active", "active", "very active" ];

  return (
    <ImageBackground
      source={require("../../assets/images/public/bgreg1.png")} // Ajusta la ruta a la imagen local
      className="flex-1 bg-black"
      resizeMode="cover"
    >

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 32 }}
        showsVerticalScrollIndicator={false}
      >

        {/* Icon */}
        <View className="mt-4 mb-8">
          <Text className="font-bold text-gray-900 text-md">fituus</Text>
        </View>

        <View className="my-auto">
          {/* Header */}
          <View>
            <Text className="mb-4 text-3xl font-light leading-tight tracking-wide text-gray-900">
              Add your {"\n"}activity level
            </Text>

            <Text className="mb-8 leading-relaxed text-md text-zinc-500">
              This information will help us calculate customed metrics like calories,
              hydration and daily objectives.
            </Text>
          </View>
      
          {/* Card */}
          <View className="w-full p-4 border rounded-3xl bg-pink-300/60 border-white/20">
          {options.map((option) => {
            const isSelected = activityLevel === option;

            return (
              <TouchableOpacity
                key={option}
                activeOpacity={0.8}
                onPress={() => setActivityLevel(option)}
                className={`w-full rounded-xl px-2 py-4 my-1 items-center justify-center ${
                  isSelected ? "bg-white/40" : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-lg font-semibold capitalize ${
                    isSelected ? "text-[#7999D9]" : "text-gray-900"
                  }`}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
          </View>

          <View className="flex-row items-center justify-between mt-12 mb-6">
          <TouchableOpacity
            activeOpacity={0.7}
            className="px-8 py-4 rounded-full"
            onPress={() => router.push("/register/goals")}
          >
            <Text className="font-semibold text-gray-900">Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            className="px-8 py-4 rounded-full bg-[#7999D9]"
            onPress={handleNext}
          >
            <Text className="font-semibold text-white">Continue</Text>
          </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}