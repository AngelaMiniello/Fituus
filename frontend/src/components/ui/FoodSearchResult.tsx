import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import api from "@/service/api";

//si uso Expo / React Native puro para la URL del backend

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

      await api.post(
        "/meals",
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
        }
      );

      onFoodAdded();
    } catch (error) {
      console.log("Error al guardar comida:", error);
      Alert.alert("Error", "Could not log this food. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="p-4 mb-3 border rounded-2xl bg-[#E3AA88]/20 border-white">
      <Text style={{ fontFamily: "Chillax-Semibold" }} className="text-base  text-gray-900">
        {food.description}
      </Text>

      <View className="flex-row flex-wrap gap-2 mt-2">
        <Text style={{ fontFamily: "Chillax-Medium" }} className="text-sm  text-zinc-600">
          {Math.round(calories)} kcal
        </Text>
        <Text style={{ fontFamily: "Chillax-Regular" }} className="text-sm text-zinc-600">P: {protein.toFixed(1)}g</Text>
        <Text style={{ fontFamily: "Chillax-Regular" }} className="text-sm text-zinc-600">C: {carbs.toFixed(1)}g</Text>
        <Text style={{ fontFamily: "Chillax-Regular" }} className="text-sm text-zinc-600">F: {fat.toFixed(1)}g</Text>
      </View>

      <TouchableOpacity
        onPress={handleAddFood}
        disabled={loading}
        activeOpacity={0.8}
        className="mt-3 w-full py-3 rounded-full bg-[#7797D9] items-center justify-center"
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={{ fontFamily: "Chillax-Semibold" }} className=" text-center text-gray-900">Add</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
