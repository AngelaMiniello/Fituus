import api from "../../service/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, TouchableOpacity, Modal, Pressable, KeyboardAvoidingView, Platform } from "react-native";

interface WaterModalProps {
  visible: boolean;
  onClose: () => void;
  onWaterAdded: () => void;
}

export default function WaterModal({ onClose, onWaterAdded, visible}: WaterModalProps) {
  //post water
  const handleAddWater = async ( amount: number) => {
    try {
      const token = await AsyncStorage.getItem("token");

      await api.post( "/water",
        {
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onWaterAdded()
      onClose();

    } catch (error) {
      console.error(error);
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
        {/* Presionar afuera cierra el modal */}
        <Pressable className="flex-1" onPress={onClose} />

        <View className="w-full  p-6 rounded-t-[32px] bg-zinc-900">
          <Text className="mb-6 text-2xl font-bold text-white"> Agregar agua </Text>

          <View className="grid grid-cols-2 gap-3">
            {[250, 500, 1000].map((amount) => (
              <TouchableOpacity
                key={amount}
                activeOpacity={0.8}
                onPress={() => handleAddWater(amount)}
                className="py-4 text-white rounded-2xl bg-zinc-800"
              >
                +{amount}ml
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
          onPress={onClose}
          className="w-full py-4 mt-6 font-medium text-white rounded-2xl bg-[#7999D9]">
            Cerrar
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}