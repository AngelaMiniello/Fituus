import { useState } from "react";//manejo estados
import api from "../../service/api";//conecto con el back
import { X } from "lucide-react-native";
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
      
      onExerciseAdded();
      onClose();
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
        className="justify-end flex-1 bg-black/60"
      >
        {/* Presionar afuera cierra el modal */}
        <Pressable className="flex-1" onPress={onClose} />

        {/* Contenido del Bottom Sheet / Modal */}
        <View className="w-full p-6 rounded-t-[32px] bg-zinc-900">
          <Text className="mb-5 text-2xl font-bold text-white">  Agregar ejercicio </Text>

          {/* Input Nombre */}
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Nombre del ejercicio"
            placeholderTextColor="#71717a"
            className="w-full p-4 mb-3 text-white border rounded-2xl bg-zinc-800 border-zinc-700"
          />

          {/* Input Duración */}
          <TextInput
            value={duration}
            onChangeText={setDuration}
            placeholder="Duración (minutos)"
            placeholderTextColor="#71717a"
            keyboardType="numeric"
            className="w-full p-4 mb-3 text-white border rounded-2xl bg-zinc-800 border-zinc-700"
          />

          {/* Input Calorías */}
          <TextInput
            value={caloriesBurned}
            onChangeText={setCaloriesBurned}
            placeholder="Calorías quemadas"
            placeholderTextColor="#71717a"
            keyboardType="numeric"
            className="w-full p-4 mb-4 text-white border rounded-2xl bg-zinc-800 border-zinc-700"
          />

          {/* Botón Guardar */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleAddExercise}
            disabled={loading}
            className="w-full py-4 font-medium rounded-2xl bg-[#7999D9] items-center mb-2"
          >
            <Text className="font-semibold text-white">
              {loading ? "Guardando..." : "Add Exercise"}
            </Text>
          </TouchableOpacity>

          {/* Botón Cerrar */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClose}
            className="items-center w-full py-4 rounded-2xl bg-zinc-800"
          >
            <Text className="font-medium text-zinc-400">Cerrar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}