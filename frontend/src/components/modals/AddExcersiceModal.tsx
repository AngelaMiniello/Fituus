import { useState } from "react";//manejo estados
import api from "../../service/api";//conecto con el back
import ModalHeader from "./ModalHeader";
import { View, Text, TouchableOpacity, Platform, Pressable, Modal, TextInput, KeyboardAvoidingView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ExerciseModalProps {
  visible?: boolean; // Controla la visibilidad desde el padre
  onClose: () => void;
  onExerciseAdded: () => void;
}

export default function ExerciseModal({ onClose, onExerciseAdded, visible}: ExerciseModalProps) {

  const [name, setName] = useState("");
  const [duration, setDuration] = useState<string>("30");
  const [caloriesBurned, setCaloriesBurned] = useState<string>("300");
  const [loading, setLoading] = useState(false);

  //function to add exercise
  const handleAddExercise = async () => {
    try {
      setLoading(true);
      // AsyncStorage es asíncrono
      const token = await AsyncStorage.getItem("token");

      await api.post(
        "/exercises",
        {
          name,
          duration: Number(duration),
          caloriesBurned: Number(caloriesBurned),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Exercise created");

      // Limpiar formulario
      setName("");
      
      onClose();
      onExerciseAdded();
    } catch (error) {
      console.error("Error al crear ejercicio:", error);
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
      {/* Evita que el teclado tape los inputs en iOS */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="justify-end flex-1 bg-black/30"
      >
        {/* Presionar afuera cierra el modal */}
        <Pressable className="flex-1" onPress={onClose} />

        {/* Contenido del Bottom Sheet / Modal */}
        <View className="w-full p-6 border border-white/60 rounded-t-[32px] bg-[#F2F2F2]">
          <ModalHeader title="Add exercise" onClose={onClose} />

          {/* Input Nombre */}
          <TextInput style={{ fontFamily: "Chillax-Regular" }}
            value={name}
            onChangeText={setName}
            placeholder="Exercise name"
            placeholderTextColor="#71717a"
            className="w-full p-4 mb-3 text-gray-900 border rounded-2xl bg-white border-[#98BDED]/50"
          />

          {/* Input Duración */}
          <TextInput style={{ fontFamily: "Chillax-Regular" }}
            value={duration}
            onChangeText={setDuration}
            placeholder="Duration (minutes)"
            placeholderTextColor="#71717a"
            keyboardType="numeric"
            className="w-full p-4 mb-3 text-gray-900 border rounded-2xl bg-white border-[#98BDED]/50"
          />

          {/* Input Calorías */}
          <TextInput style={{ fontFamily: "Chillax-Regular" }}
            value={caloriesBurned}
            onChangeText={setCaloriesBurned}
            placeholder="Calories burned"
            placeholderTextColor="#71717a"
            keyboardType="numeric"
            className="w-full p-4 mb-4 text-gray-900 border rounded-2xl bg-white border-[#98BDED]/50"
          />

          {/* Botón Guardar */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleAddExercise}
            disabled={loading}
            className="w-full py-4 rounded-full bg-[#7797D9] items-center mb-2"
          >
            <Text style={{ fontFamily: "Chillax-Semibold" }} className=" text-gray-900">
              {loading ? "Saving..." : "Add Exercise"}
            </Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
