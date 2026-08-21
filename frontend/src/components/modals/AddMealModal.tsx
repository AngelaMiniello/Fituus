import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";
import api from "../../service/api"; // Instancia de Axios configurada
import FoodSearchResult from "../ui/FoodSearchResult";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MealModalProps {
  visible: boolean; // Controla la visibilidad desde el padre
  onClose: () => void;
  onSuccess: () => void;
  mealType?: string;
}

const MEAL_TYPES = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "snack", label: "Snack" },
];

export default function MealModal({  onClose, onSuccess, mealType, visible }: MealModalProps) {
  
  const [query, setQuery] = useState("");
  const [foods, setFoods] = useState<any[]>([]);
  const [selectedMealType, setSelectedMealType] = useState( mealType || "breakfast" );
  const [quantity, setQuantity] = useState<string>("100");
  const [loading, setLoading] = useState(false);
  
  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const response = await api.get("/meals/search", {
        params: { query },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFoods(response.data);
    } catch (error) {
      console.error("Error buscando comida:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
   <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="justify-end flex-1 bg-black/60"
      >
        <Pressable className="flex-1" onPress={onClose} />

        <View className="w-full max-h-[85%] p-6 rounded-t-[32px] bg-zinc-900 border-t border-zinc-800 flex-col">
          {/* Grabber indicator */}
          <View className="w-16 h-1 mx-auto mb-6 rounded-full bg-zinc-700" />

          <Text className="mb-5 text-2xl font-bold text-white">Add food</Text>

          {/* Input Búsqueda */}
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search food..."
            placeholderTextColor="#71717a"
            className="w-full p-4 mb-3 text-white border rounded-2xl bg-zinc-800 border-zinc-700"
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />

          {/* Input Cantidad */}
          <View className="mb-3">
            <TextInput
              value={String(quantity)}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholder="Quantity"
              placeholderTextColor="#71717a"
              className="w-full p-4 text-white border rounded-2xl bg-zinc-800 border-zinc-700"
            />
            <Text className="mt-1 ml-2 text-sm text-zinc-400">
              Quantity (g)
            </Text>
          </View>

          {/* Selector de Comida (reemplazo nativo para <select>) */}
          {!mealType && (
            <View className="flex-row justify-between gap-2 my-2">
              {MEAL_TYPES.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setSelectedMealType(item.id)}
                  className={`flex-1 py-3 items-center rounded-xl border ${
                    selectedMealType === item.id
                      ? "bg-[#7999D9] border-[#7999D9]"
                      : "bg-zinc-800 border-zinc-700"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      selectedMealType === item.id
                        ? "text-white"
                        : "text-zinc-400"
                    }`}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Botón Buscar */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSearch}
            disabled={loading}
            className="w-full py-4 mt-2 font-medium items-center rounded-2xl bg-[#7999D9]"
          >
            <Text className="font-semibold text-white">
              {loading ? "Searching..." : "Search"}
            </Text>
          </TouchableOpacity>

          {/* LISTA SCROLLEABLE (Reemplazo de div overflow-y-auto) */}
          <View className="flex-1 mt-4">
            <FlatList
              data={foods}
              keyExtractor={(item) =>
                item.fdcId ? String(item.fdcId) : String(Math.random())
              }
              renderItem={({ item }) => (
                <FoodSearchResult
                  food={item}
                  onFoodAdded={onSuccess}
                  mealType={selectedMealType}
                  quantity={Number(quantity) || 0}
                />
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}