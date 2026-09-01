import React from "react";
import { View, Text, ScrollView, TouchableOpacity,  Modal,  TextInput, KeyboardAvoidingView, Platform} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Flame, Beef, Droplets, Footprints, Dumbbell, Moon, ChevronRight, X } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useState } from "react";
import api from "../service/api";
import { useGoals } from "../context/GoalsContext";

export default function DashboardPage() {
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
      const token = AsyncStorage.getItem("token");

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
      className="flex-1 bg-zinc-950"
    >
      <ScrollView 
        className="flex-1 px-4 py-6"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View className="mt-4 mb-8">
          <Text className="text-3xl font-bold text-white"> Dashboard </Text>
          <Text className="mt-1 text-sm text-zinc-400"> Manage your objectives and preferences </Text>
        </View>

        {/* Weekly insight (Con LinearGradient nativo) */}
        <LinearGradient 
          colors={["#7999D9", "#A0CCF2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="p-5 mb-6 rounded-3xl border border-[#A0CCF2]"
        >
        
          <Text className="mb-2 text-sm text-white"> Weekly Insight </Text>
          <Text className="text-lg font-semibold leading-snug text-white"> Consumiste un 12% más proteína esta semana 💪 </Text>

        </LinearGradient>

        {/* Cards */}
        <View className="p-5 border rounded-3xl bg-zinc-900 border-zinc-800 hover:border-[#7999D9] hover:bg-zinc-800">
          <Text className="mb-2 text-xl font-semibold text-white"> Goals </Text>
          <Text className="mb-4 text-sm text-zinc-400"> Personalize your daily goals </Text>

            {settingsCards.map((card, index) => {

              const Icon = card.icon;
              const isLast = index === settingsCards.length - 1;

              return (
                <TouchableOpacity
                  key={card.title}
                  activeOpacity={0.7}
                  className={`flex-row items-center w-full py-4 ${
                    !isLast ? "border-b border-zinc-800" : ""
                  }`}
                  onPress={() => {
                    setSelectedCard(card);
                    setInputValue(String(card.rawValue || ""));
                  }}
                >

                  {/* Contenedor de Icono */}
                  <View className="flex-row items-center mr-4">
                    <View className="flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-800">

                      <Icon
                        size={24}
                        color="#7999D9"
                      />
                    </View>
                  </View>

                  {/* Flecha */}
                  <ChevronRight size={14} color="#7999D9" style={{ marginRight: 12 }}/> 
                  
                  {/* Textos de la Card */}
                  <View className="flex flex-col text-left">
                    <Text className="mb-1 text-lg font-semibold text-white">  {card.title} </Text>

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

      {/* Modal */}
      {selectedCard && (
        <Modal
          visible={selectedCard !== null}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSelectedCard(null)}
        >
          <View className="fixed inset-0 z-50 flex items-end pb-20 bg-black/50">
            <View className="w-full p-6 border-t bg-zinc-900 rounded-t-3xl border-zinc-800">

              {/* Modal Header */}
              <View className="flex items-center justify-between mb-6">

                <Text className="text-2xl font-bold text-white"> Editar {selectedCard.title} </Text>

                <TouchableOpacity onPress={() => setSelectedCard(null)}>
                  <X className="text-zinc-400" />
                </TouchableOpacity>

              </View>

              {/* Input Numérico */}
              <TextInput
                keyboardType="numeric"
                value={inputValue}
                onChangeText={(text) => setInputValue(text)}
                className="w-full p-4 text-lg text-white border rounded-2xl bg-zinc-800 border-zinc-700"
                placeholderTextColor="#71717a"
              />

            {/* Botón Guardar */}
              <TouchableOpacity
                onPress={handleSave}
                activeOpacity={0.8}
                className="w-full p-4 mt-5 rounded-2xl bg-[#7999D9]"
              >
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