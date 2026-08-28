import {Trash2} from "lucide-react-native"
import { useRouter } from "expo-router";
import React from "react";
import { Text, Pressable, TouchableOpacity, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle,  withSpring} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

type MealCardProps = {
  meal: any;
  onDelete: (id:number)=>void;
};

export default function MealCard({ meal, onDelete}:MealCardProps){

  const router = useRouter();
  
  // Lo que aparece atrás cuando deslizas a la izquierda
  const renderRightActions = () => {
    return (
    <div className="relative mt-3 mb-3 overflow-hidden rounded-2xl">
      {/* fondo trash */}
      <View className="items-end justify-center w-20 pr-4 bg-zinc-800 rounded-2xl">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onDelete(meal.id)}
        className="p-2"
      >
        <Trash2 size={20} color="#ffffff" />
      </TouchableOpacity>
    </View>

      <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push(`/meal/${meal.id}` as any)}
        className="w-full p-3 bg-zinc-800 rounded-2xl"
      >
        <Text className="text-white">{meal.name}</Text>
      </TouchableOpacity>
    </Swipeable>
    </div>
    );
  }
}