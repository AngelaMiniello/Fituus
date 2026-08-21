import React, { useState } from "react";
import api from "../../service/api";//conect con el back?
import { X } from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";
import { Modal, View, Text, TouchableOpacity, Pressable, TouchableWithoutFeedback,} from "react-native";
import * as SecureStore from "expo-secure-store";

interface GenderModalProps {
  onClose: () => void;
  onGenderAdded: (gender: string)  => void;
}

export default function GenderModal({ onClose, onGenderAdded}: GenderModalProps) {
  const [gender, setGender] = useState("");//string because <input> always works with text
  
  const genders = [
    "Female",
    "Male",
    "Other",
    "Prefer not to say",
  ];

  //function to add genre
  const handleAddGenre = async () => {
    try {
      // Obtengo el token de forma asíncrona desde SecureStore
      const token = await SecureStore.getItemAsync("token");

      // NOTA: Si guarde toda la sesión junta con la clave "user_session", sería así:
      // const session = await SecureStore.getItemAsync("user_session");
      // const token = session ? JSON.parse(session).token : null;

      await api.patch(
        "user/profile/metrics",
        {
          gender: gender,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onGenderAdded(gender);
      onClose();
    } catch (error) {
      console.error("Error al actualizar género:", error);
    }
  };
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
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

          <View className="w-full overflow-hidden border bg-zinc-900 rounded-2xl border-zinc-800">
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              style={{ color: "#ffffff" }} // Color del texto en iOS/Android
              dropdownIconColor="#7999D9"  // Color de la flechita desplegable en Android
            >
              {genders.map((item) => (
                <Picker.Item 
                  key={item} 
                  label={item} 
                  value={item} 
                  // Nota: en Android el color del item de la lista desplegable se define con la prop 'color'
                  color="#ffffff" 
                />
              ))}
            </Picker>
          </View>

          {/* Botón de Confirmación */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleAddGenre}
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