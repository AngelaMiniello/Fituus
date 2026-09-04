import { useRouter, useLocalSearchParams  } from "expo-router";
import { useState } from "react";
import { updateProfile } from "../service/authService";
import { Flame, Scale, Dumbbell } from "lucide-react-native";
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, ActivityIndicator } from "react-native";
import { useAuth } from "@/context/AuthContext";

type Goal =
  | "Lose Weight"
  | "Maintain Weight"
  | "Gain Muscle"
;

export default function RegisterGoalsView() {
  const router = useRouter();
  const { userData, setUserData } = useAuth();

  // 1. Recibimos todos los parámetros acumulados en los pasos anteriores
  const params = useLocalSearchParams<{
    token?: string;
    weight?: string;
    height?: string;
    gender?: string;
    activityLevel?: string;
  }>();

  const [goal, setGoal] = useState<Goal | "">("");//choose activity settings
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
  try {
    setLoading(true);

    if (!params.token) {
      console.error("❌ No se encontró el token en los parámetros.");
      return;
    }

    // 1. Consolidamos los datos de todos los pasos
    const finalProfileData = {
      weight: params.weight ? Number(params.weight) : undefined,
      height: params.height ? Number(params.height) : undefined,
      gender: params.gender,
      activityLevel: params.activityLevel,
      goal,
    };

    // 2. Guardamos la respuesta del backend
    const updatedUser = await updateProfile(finalProfileData, params.token);

    // 3. Sincronizamos la sesión global
    await setUserData({
      token: params.token,
      user: updatedUser?.user || updatedUser,
    });

    // 4. Redirigimos al inicio
    router.push("/");

  } catch (error) {
    console.error("❌ Error al guardar datos finales:", error);
  } finally {
    setLoading(false);
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
      source={require("../../assets/images/public/bg.png")} // Ajusta la ruta a la imagen local
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
                    className="overflow-hidden border rounded-3xl bg-pink-300/70 border-white/20"
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
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text className="font-semibold text-gray-900">Skip</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                className="px-8 py-4 rounded-full bg-[#7999D9]"
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text className="font-semibold text-white">Finish</Text>
              )}
              </TouchableOpacity>
            </View>

        </View>
        
      </ScrollView>
    </ImageBackground>
  );
}