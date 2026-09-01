import React, { useState } from "react";
import { X } from "lucide-react-native";
import { Modal, View, Text, TouchableOpacity, Pressable, TouchableWithoutFeedback,} from "react-native";

interface GenderModalProps {
  visible?: boolean;
  onClose: () => void;
  onGenderAdded: (gender: string)  => void;
}

export default function GenderModal({ onClose, onGenderAdded, visible }: GenderModalProps) {
  const [gender, setGender] = useState("Female");//string because <input> always works with text
  
  const genders = [
    "Female",
    "Male",
    "Other",
    "Prefer not to say",
  ];

  //function to add genre
  const handleAddGender = () => {
    if (!gender) return;

    onGenderAdded(gender);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >

      {/* Fondo oscuro overlay (cierra el modal si tocan afuera) */}
      <Pressable
        className="justify-end flex-1 bg-black/60"
        onPress={onClose}
      >
        {/* Detiene la propagación del tap al tocar dentro de la tarjeta */}
        <TouchableWithoutFeedback>
          <View className="w-full p-6 rounded-t-[32px] bg-zinc-900 border-t border-zinc-800">
            {/* Header del Modal */}
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-2xl font-bold text-white">Add Gender</Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onClose}
                className="p-1"
              >
                <X size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>

          {/* Opciones Seleccionables */}
          <View className="gap-2">
            {genders.map((item) => {
              const isSelected = gender === item;
              return (
                <TouchableOpacity
                  key={item}
                  activeOpacity={0.8}
                  onPress={() => setGender(item)}
                  className={`w-full p-4 rounded-2xl border ${
                    isSelected
                      ? "bg-[#7999D9] border-[#7999D9]"
                      : "bg-zinc-800 border-zinc-700"
                  }`}
                >
                  <Text
                    className={`font-semibold text-center ${
                      isSelected ? "text-white" : "text-zinc-300"
                    }`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          
          {/* Botón de Confirmación */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleAddGender}
              className="items-center justify-center w-full py-4 mt-6 rounded-2xl bg-[#7999D9]"
            >
              <Text className="text-base font-medium text-white">
                Add Gender
              </Text>
            </TouchableOpacity>
            
          </View>
        </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  );
}