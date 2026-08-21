import { useRouter, useLocalSearchParams  } from "expo-router";
import { useState } from "react";
import {  ChevronRight } from "lucide-react-native";
import WeightModal from "../components/profilemodals/WeightModal";
import HeightModal from "../components/profilemodals/HeightModal";
import GenreModal from "../components/profilemodals/GenderModal";
import { updateProfile } from "../service/authService";
import { View, Text, TouchableOpacity, ImageBackground, ScrollView } from "react-native";

export default function RegisterProfileView() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token?: string }>();

  const [activeModal, setActiveModal] = useState< "weight" | "height" | "gender" | null>(null);//modal to add profile settings
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [gender, setGender] = useState<string | undefined>(undefined);

  const handleSubmit = async () => {
    try {
      await updateProfile({ weight, height, gender }, token);

      router.push("/register/activity");
    } catch (error) {
      console.error(error);
    }
  };
  
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
          <Text className="font-bold text-gray-900 text-md font-chillax">fituus</Text>
        </View>

        <View className="my-auto">
          {/* Header */}
          <View>
            <Text className="mb-4 text-3xl font-light leading-tight tracking-wide text-gray-900">
              Add information {"\n"}to your profile
            </Text>

            <Text className="mb-8 leading-relaxed text-md text-zinc-500">
              This information will help us calculate customed metrics like calories,
              hydration and daily objectives.
            </Text>
          </View>
      
          {/* Card */}
          <View className="w-full p-2 border rounded-3xl bg-pink-300/60 border-white/20">

            {/* Weight Row */}
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center justify-between w-full px-4 py-4 border-b border-[#F2F2F2]/40"
              onPress={() => setActiveModal("weight")}
            >
              <Text className="text-lg font-bold text-gray-900">Weight</Text>

              <View className="flex-row items-center gap-2">
                <Text className="font-semibold text-gray-900 text-md">
                  {weight ? `${weight} kg` : "-"}
                </Text>
                <ChevronRight color="#111827" size={20} />
              </View>
            </TouchableOpacity>

            {/* Height Row */}
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center justify-between w-full px-4 py-4 border-b border-[#F2F2F2]/40"
              onPress={() => setActiveModal("height")}
            >

              <Text className="text-lg font-bold text-gray-900">Height</Text>

              <View className="flex-row items-center gap-2">
                <Text className="font-semibold text-gray-900 text-md">
                  {height ? `${height} cm` : "-"}
                </Text>
                <ChevronRight color="#111827" size={20} />
              </View>
            </TouchableOpacity>

            {/* Gender Row */}
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center justify-between w-full px-4 py-4"
              onPress={() => setActiveModal("gender")}
            >

              <Text className="text-lg font-bold text-gray-900">Gender</Text>

              <View className="flex-row items-center gap-2">

                <Text className="font-semibold text-gray-900 text-md">
                  {gender || "-"}
                </Text>

                <ChevronRight color="#111827" size={20} />

              </View>
            </TouchableOpacity>
          </View>

          {/* Footer Buttons */}
          <View className="flex-row items-center justify-between mt-12 mb-6">
            <TouchableOpacity
              activeOpacity={0.7}
              className="px-8 py-4 rounded-full"
              onPress={() => router.push("/register/activity" as any)}
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

      { activeModal === "weight" && (
        <WeightModal
          onClose={() => setActiveModal(null)}
          onWeightAdded={(newWeight) => setWeight(newWeight)}
        />
      )}

      { activeModal === "height" && (
        <HeightModal
          onClose={() => setActiveModal(null)}
          onHeightAdded={(newHeight) => setHeight(newHeight)}
        />
      )}

      { activeModal === "gender" && (
        <GenreModal
          onClose={() => setActiveModal(null)}
          onGenderAdded={(newGender) => setGender(newGender)}
        />
      )}

      </ScrollView>
    </ImageBackground>
  );
}