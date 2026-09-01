import { useState } from "react";//handle estados
import { X } from "lucide-react-native";
import { View, Text, TouchableOpacity, Modal, Pressable, KeyboardAvoidingView, Platform, TextInput } from "react-native";

interface WeightModalProps {
  visible?: boolean;
  onClose: () => void;
  onWeightAdded: (weight: number)  => void;
}

export default function WeightModal({ onClose, onWeightAdded, visible }: WeightModalProps) {
  const [weight, setWeight] = useState("");//string because <input> always works with text

  //function to add weight
  const handleAddWeight = async () => {
    if (!weight || isNaN(Number(weight))) return;

    const weightNumber = Number(weight);
    
   // Le pasa el valor capturado al estado local del RegisterProfileView
    onWeightAdded(weightNumber);
    setWeight(""); 
    onClose();
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
        {/* Presionar en el área superior oscura cierra el modal */}
        <Pressable className="flex-1" onPress={onClose} />

        {/* Tarjeta inferior (Bottom Sheet) */}
        <View className="w-full p-6 rounded-t-[32px] bg-zinc-900 border-t border-zinc-800">
          
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-2xl font-bold text-white">Add Weight</Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              className="p-1"
            >
              <X size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Input de Peso */}
          <TextInput
            value={String(weight)}
            onChangeText={setWeight}
            placeholder="Current weight"
            placeholderTextColor="#71717a"
            keyboardType="numeric"
            className="w-full p-4 text-white border rounded-2xl bg-zinc-800 border-zinc-700"
          />

          {/* Botón Guardar */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleAddWeight}
            className="w-full py-4 mt-6 items-center rounded-2xl bg-[#7999D9]"
          >
            <Text className="font-semibold text-white">Add Weight</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}