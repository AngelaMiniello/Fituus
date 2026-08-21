import { useRouter, useLocalSearchParams  } from "expo-router";
import { useState } from "react";
import chillax from "../../assets/fonts/fonts";//ver lo de la font
import { updateProfile } from "../service/authService";
import { Flame, Scale, Dumbbell } from "lucide-react-native";
import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from "react-native";

type Goal =
  | "Lose Weight"
  | "Maintain Weight"
  | "Gain Muscle"
;

export default function RegisterGoalsView() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token?: string }>();
  
  const [goal, setGoal] = useState<Goal | "">("");//choose activity settings

  const handleSubmit = async () => {
    try {
      await updateProfile({  goal  });

      router.push("/home");
    } catch (error) {
      console.error(error);
    }
  };
  
  const options = [
    {
    value: "Lose Weight",
    icon: Flame,
    },
    {
    value: "Maintain Weight",
    icon: Scale,
    },
    {
    value: "Gain Muscle",
    icon: Dumbbell,
    },
  ] as const;

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

        {/* Brand Header */}
        <View className="mt-4 mb-8">
            <Text className="font-bold text-gray-900 text-md">fittuus</Text>
        </View>

        <View className="my-auto">
            {/* Header text */}
            <View>
              <Text className="mb-4 text-3xl font-light leading-tight tracking-wide text-gray-900">
                Add your goal
              </Text>

              <Text className="mb-8 leading-relaxed text-md text-zinc-500">
                This information will help us calculate customed metrics like calories,
                hydration and daily objectives.
              </Text>
            </View>
      
            {/* Dynamic Cards list */}
            <View className="flex-col gap-3">
              {options.map((option) => {
                const Icon = option.icon;
                const isSelected = goal === option.value;
                const accentColor = isSelected ? "#7999D9" : "#374151";

                return (
                  <View
                    key={option.value}
                    className="overflow-hidden border rounded-3xl bg-pink-300/60 border-white/20"
                  >

                    <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setGoal(option.value)}
                    className={`w-full p-6 items-center justify-center ${
                      isSelected ? "bg-white/40" : "bg-transparent"
                    }`}
                  >

                    <View className="flex-row items-center justify-center gap-4">
                      <Icon
                        size={22}
                        color={accentColor}
                      />
                  
                      <Text
                        className={`text-lg font-semibold capitalize ${
                          isSelected ? "text-[#7999D9]" : "text-gray-900"
                        }`}
                      >
                        {option.value}
                      </Text>
                    </View>

                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>

            {/* Footer Buttons */}
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
                onPress={handleSubmit}
              >
                <Text className="font-semibold text-white">Continue</Text>
              </TouchableOpacity>
            </View>

        </View>
        
      </ScrollView>
    </ImageBackground>
  );
}