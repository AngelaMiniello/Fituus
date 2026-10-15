import api from "../../service/api";
import ModalHeader from "./ModalHeader";
import { useDailyProgress } from "@/context/DailyProgress";
import { View, Text, TouchableOpacity, Modal, Pressable, KeyboardAvoidingView, Platform } from "react-native";

interface WaterModalProps {
  visible?: boolean;
  onClose: () => void;
  onWaterAdded: () => void;
}

export default function WaterModal({ onClose, onWaterAdded, visible}: WaterModalProps) {
  const { fetchDailyProgress } = useDailyProgress();
  //post water
  const handleAddWater = async ( amount: number) => {
    try {
      await api.post( "/water",
        {
          amount,
        }
      );

      onClose();
      void fetchDailyProgress();
      onWaterAdded();

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
        className="justify-end flex-1 bg-black/30"
      >
        {/* Presionar afuera cierra el modal */}
        <Pressable className="flex-1" onPress={onClose} />

        <View className="w-full p-6 border border-white/60 rounded-t-[32px] bg-[#F2F2F2] pb-8">
          <ModalHeader title="Add water" onClose={onClose} />

          <View style={{ flexDirection: "row", columnGap: 8 }}>
            {[250, 500, 1000].map((amount) => (
              <TouchableOpacity
                key={amount}
                activeOpacity={0.8}
                onPress={() => handleAddWater(amount)}
                style={{ flex: 1, minWidth: 0 }}
                className="py-4 border border-white rounded-2xl bg-[#98BDED]/50"
              >
                <Text style={{ fontFamily: "Chillax-Medium" }} className="text-center text-gray-900">+{amount} ml</Text>
              </TouchableOpacity>
            ))}
          </View>


        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
