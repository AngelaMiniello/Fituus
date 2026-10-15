import { Trash2 } from "lucide-react-native";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

type MealCardProps = {
  meal: any;
  onDelete: (id: number) => void;
};

export default function MealCard({ meal, onDelete }: MealCardProps) {
  const router = useRouter();

  const renderRightActions = () => (
    <TouchableOpacity
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Eliminar ${meal.name}`}
      onPress={() => onDelete(meal.id)}
      className="items-center justify-center w-20 bg-[#D9738E] rounded-2xl"
    >
      <Trash2 size={20} color="#111827" />
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView>
      <View className="relative mt-3 mb-3 overflow-hidden rounded-2xl">
        <Swipeable renderRightActions={renderRightActions}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push(`/meal/${meal.id}` as any)}
            className="w-full p-3 bg-white/70 rounded-2xl"
          >
            <Text style={{ fontFamily: "Chillax-Regular" }} className="text-gray-900">{meal.name}</Text>
          </TouchableOpacity>
        </Swipeable>
      </View>
    </GestureHandlerRootView>
  );
}
