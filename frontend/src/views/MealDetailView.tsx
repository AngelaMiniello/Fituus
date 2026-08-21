import { useEffect, useState } from "react";
import api from "../service/api";
import { useRouter, useLocalSearchParams  } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";

export default function MealDetailView(){
  
  const params = useLocalSearchParams ();
  const router = useRouter();
  const [meal, setMeal] = useState<any>(null);
  const [quantity, setQuantity] = useState("");
  
  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get(
          `/meals/${params.id}`,
          {
            headers:{
              Authorization:`Bearer ${token}`
            }
          }
        );

        setMeal(res.data);
        setQuantity(res.data.quantity);
        
      } catch(error){
        console.log(error);
      }

    };

    fetchMeal();

  }, []);

  if(!meal){
    return <p className="text-white">Details not found</p>;
  }

  const handleUpdateMeal = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.put(
        `/meals/${params.id}`,
          {
            quantity
          },
          {
            headers:{
              Authorization:`Bearer ${token}`
            }
          }
      );

      router.push("/diary");

      } catch(error){
      console.log(error);
      }
  };

  //recalcular macros visualmente
  const quantityNumber = Number(quantity) || 0;

  const calories = (meal?.baseCalories * quantityNumber) / 100;

  const protein = (meal?.baseProtein * quantityNumber) / 100;

  const carbs = (meal?.baseCarbs * quantityNumber) / 100;

  const fat = (meal?.baseFat * quantityNumber) / 100;
  
  return(
    <ScrollView 
      className="flex-1 bg-zinc-950" 
      contentContainerStyle={{ flexGrow: 1, padding: 24 }}
    >
      {/* Título de la comida */}
      <Text className="mb-6 text-3xl font-bold text-white">
        {meal.name}
      </Text>

      {/* Tarjetas de Macronutrientes */}
      <View className="flex-col gap-4 mb-6">
        <View className="p-4 rounded-2xl bg-zinc-900">
          <Text className="text-white">Calories: {Math.round(calories)}</Text>
        </View>

        <View className="p-4 rounded-2xl bg-zinc-900">
          <Text className="text-white">Protein: {meal.protein}g</Text>
        </View>

        <View className="p-4 rounded-2xl bg-zinc-900">
          <Text className="text-white">Carbs: {meal.carbs}g</Text>
        </View>

        <View className="p-4 rounded-2xl bg-zinc-900">
          <Text className="text-white">Fat: {meal.fat}g</Text>
        </View>
      </View>

      {/* Input de Cantidad */}
      <View className="mb-6">
        <TextInput
          keyboardType="numeric"
          value={quantity.toString()}
          onChangeText={(value) => setQuantity(value === "" ? "" : value)}
          placeholder="0"
          placeholderTextColor="#71717a"
          className="w-full p-4 text-white border rounded-2xl bg-zinc-900 border-zinc-800"
        />
        <Text className="mt-2 ml-2 text-sm text-zinc-400">Quantity (g)</Text>
      </View>

      {/* Botones de Acción */}
      <View className="flex-col items-center mb-6">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleUpdateMeal}
          className="w-full py-4 font-medium items-center justify-center rounded-2xl bg-[#7999D9]"
        >
          <Text className="font-medium text-white">Save changes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push("/diary")}
          className="flex-row items-center gap-2 mt-4"
        >
          <ArrowLeft size={18} color="#a1a1aa" />
          <Text className="text-zinc-400">Diary</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}