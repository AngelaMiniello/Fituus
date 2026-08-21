import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Si usas Expo / React Native puro para la URL del backend
const API_URL = process.env.EXPO_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL;

type FoodProps = {
  food: any;
  onFoodAdded: () => void;
  mealType: string;
  quantity: number;
};

export default function FoodSearchResult({ food, onFoodAdded, mealType, quantity }: FoodProps) {
  const [loading, setLoading] = useState(false);

  // Cálculo de nutrientes
  const baseCalories =
    food.foodNutrients?.find((n: any) => n.nutrientName === "Energy")?.value || 0;
  const calories = (baseCalories * Number(quantity || 0)) / 100;

  const baseProtein =
    food.foodNutrients?.find((n: any) => n.nutrientName === "Protein")?.value || 0;
  const protein = (baseProtein * Number(quantity || 0)) / 100;

  const baseCarbs =
    food.foodNutrients?.find(
      (n: any) => n.nutrientName === "Carbohydrate, by difference"
    )?.value || 0;
  const carbs = (baseCarbs * Number(quantity || 0)) / 100;

  const baseFat =
    food.foodNutrients?.find((n: any) => n.nutrientName === "Total lipid (fat)")?.value || 0;
  const fat = (baseFat * Number(quantity || 0)) / 100;

  const handleAddFood = async () => {
    try {
      setLoading(true);

      // En React Native leemos el token guardado en AsyncStorage
      const token = await AsyncStorage.getItem("token");

      await axios.post(
        `${API_URL}/meals`,
        {
          name: food.description,
          calories,
          protein,
          carbs,
          fat,
          mealType,
          quantity,
          baseCalories,
          baseProtein,
          baseCarbs,
          baseFat,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onFoodAdded();
    } catch (error) {
      console.log("Error al guardar comida:", error);
      Alert.alert("Error", "No se pudo registrar el alimento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="p-4 mb-3 border rounded-2xl bg-zinc-800 border-zinc-700">
      <Text className="text-base font-semibold text-white">
        {food.description}
      </Text>

      <View className="flex-row gap-4 mt-2">
        <Text className="text-sm font-medium text-zinc-400">
          {Math.round(calories)} kcal
        </Text>
        <Text className="text-sm text-zinc-400">P: {protein.toFixed(1)}g</Text>
        <Text className="text-sm text-zinc-400">C: {carbs.toFixed(1)}g</Text>
        <Text className="text-sm text-zinc-400">F: {fat.toFixed(1)}g</Text>
      </View>

      <TouchableOpacity
        onPress={handleAddFood}
        disabled={loading}
        activeOpacity={0.8}
        className="mt-3 w-full py-3 rounded-xl bg-[#7999D9] items-center justify-center"
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text className="font-semibold text-center text-white">Add</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}