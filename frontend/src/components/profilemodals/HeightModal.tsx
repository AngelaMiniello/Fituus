import { useState } from "react";//handle estados
import { X } from "lucide-react-native";
import { View, Text, TouchableOpacity, Modal, Pressable, KeyboardAvoidingView, Platform, TextInput } from "react-native";

interface HeightModalProps {
  visible?: boolean;
  onClose: () => void;
  onHeightAdded: (height: number)  => void;
}

export default function HeightModal({ onClose, onHeightAdded, visible }: HeightModalProps) {
  const [height, setHeight] = useState("");//string because <input> always works with text

  //function to add height
  const handleAddHeight = () => {
    if (!height || isNaN(Number(height))) return;

    const heightNumber = Number(height);
    onHeightAdded(heightNumber);
    setHeight("");
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
        {/* Fondo interactivo para cerrar al tocar fuera */}
        <Pressable className="flex-1" onPress={onClose} />

        {/* Contenido principal del modal */}
        <View className="w-full p-6 rounded-t-[32px] bg-zinc-900 border-t border-zinc-800">
          
          {/* Header con título y botón de cerrar */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-2xl font-bold text-white">Add Height</Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              className="p-1"
            >
              <X size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Input de Altura */}
          <TextInput
            value={String(height)}
            onChangeText={setHeight}
            placeholder="Add your height (eg. 170)"
            placeholderTextColor="#71717a"
            keyboardType="numeric"
            className="w-full p-4 text-white border rounded-2xl bg-zinc-800 border-zinc-700"
          />

          {/* Botón de Confirmar */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleAddHeight}
            className="w-full py-4 mt-6 items-center rounded-2xl bg-[#7999D9]"
          >
            <Text className="font-semibold text-white">Add Height</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}