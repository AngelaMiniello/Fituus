import api from "@/service/api";

import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import {  View,  Text,  ScrollView,  TouchableOpacity,  Modal,  TextInput,  KeyboardAvoidingView,  Platform } from "react-native";
import { Flame, Beef, Droplets, Footprints, Dumbbell, Moon, ChevronRight, X } from "lucide-react-native";
import { useGoals } from "../context/GoalsContext";

export default function ConfigPage() {
  const { goals, setGoals } = useGoals();
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [inputValue, setInputValue] = useState("");

  const settingsCards = [
    {
      title: "Calorías",
      value: `${goals?.dailyCalories || 0} kcal`,
      rawValue: goals?.dailyCalories,
      description: "Objetivo diario",
      icon: Flame,
      field: "dailyCalories",
    },
    {
      title: "Proteína",
      value: `${goals?.proteinGoal || 0} g`,
      rawValue: goals?.proteinGoal,
      description: "Objetivo diario",
      icon: Beef,
      field: "proteinGoal",
    },
    {
      title: "Agua",
      value: `${goals?.waterGoal || 0} ml`,
      rawValue: goals?.waterGoal,
      description: "Objetivo diario",
      icon: Droplets,
      field: "waterGoal",
    },
    {
      title: "Pasos",
      value: `${goals?.stepsGoal || 0}`,
      rawValue: goals?.stepsGoal,
      description: "Meta diaria",
      icon: Footprints,
      field: "stepsGoal",
    },
    {
      title: "Ejercicio",
      value: `${goals?.workoutsPerWeekGoal || 0} días`,
      rawValue: goals?.workoutsPerWeekGoal,
      description: "Por semana",
      icon: Dumbbell,
      field: "workoutsPerWeekGoal",
    },
    {
      title: "Sueño",
      value: `${goals?.sleepGoal || 0} hs`,
      rawValue: goals?.sleepGoal,
      description: "Objetivo diario",
      icon: Moon,
      field: "sleepGoal",
    },
  ];

  const handleSave = async () => {
    try {
      const token = SecureStore.getItemAsync("token");

      await api.put( "/goals",
        {
          [selectedCard.field]: Number(inputValue),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setGoals((prev: any) => ({
        ...prev,
        [selectedCard.field]: Number(inputValue),
      }));

      setSelectedCard(null);

    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView className="flex-1 px-4 py-6 bg-zinc-950">

        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-white"> Config </Text>
          <Text className="mt-1 text-sm text-zinc-400"> Manage your objectives and preferences </Text>
        </View>

      {/* Cards */}
      <View className="p-5 border rounded-3xl bg-zinc-900 border-zinc-800 hover:border-[#7999D9] hover:bg-zinc-800">
        <Text className="mb-2 text-xl font-semibold text-white"> Goals </Text>
        <Text className="mb-4 text-sm text-zinc-400"> Personalize your daily goals </Text>

          {settingsCards.map((card) => {

              const Icon = card.icon;

              return (
                <TouchableOpacity
                  key={card.title}
                  className="flex items-center w-full py-3 border-b border-zinc-800 last:border-b-0"
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedCard(card);
                    setInputValue(String(card.rawValue || ""));
                  }}
                >
                  {/* Contenedor del Icono */}
                  <View className="flex items-center gap-3 mr-4">
                    <View className="flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-800">

                      <Icon
                        size={24}
                        className="text-[#7999D9]"
                      />
                    </View>
                  </View>

                  <ChevronRight size={14} className="text-[#7999D9] mr-4"/> 
                  
                  {/* Textos de la Card */}
                  <View className="flex flex-col text-left">
                    <Text className="mb-1 text-lg font-semibold text-white">
                      {card.title}
                    </Text>

                    <View className="flex items-baseline gap-2">
                      <Text className="text-sm text-zinc-400">
                        {card.description} : 
                      </Text>

                      <Text className="font-bold text-white text-md">
                        {card.value}
                      </Text>
                    </View>
                  </View>

                </TouchableOpacity>
              );
          })}
      </View>

      {/* Modal Nativo */}
      {selectedCard && (
        <Modal
          visible={selectedCard !== null}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSelectedCard(null)}
        >
        
          {/* Fondo oscuro del modal */}
          <View className="justify-end flex-1 bg-black/60">

            {/* Contenido del Modal */}
            <View className="w-full p-6 border-t bg-zinc-900 rounded-t-3xl border-zinc-800">

              <View className="flex items-center justify-between mb-6">
                <Text className="text-2xl font-bold text-white"> Editar {selectedCard.title} </Text>

                <TouchableOpacity onPress={() => setSelectedCard(null)}>
                  <X className="text-zinc-400" />
                </TouchableOpacity>
              </View>

              {/* Input Nativo */}
              <TextInput
                keyboardType="numeric" // Abre el teclado numérico directamente en el celular
                value={inputValue}
                onChangeText={(text: string) => setInputValue(text)} // onChangeText es el estándar en Native
                className="w-full p-4 text-lg text-white border outline-none rounded-2xl bg-zinc-800 border-zinc-700 focus:border-[#7999D9]"
              />

              <TouchableOpacity
                onPress={handleSave}
                activeOpacity={0.8}
                className="w-full p-4 mt-5 text-lg font-semibold text-white transition rounded-2xl bg-[#7999D9] hover:opacity-90">
                Guardar cambios
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
      )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}