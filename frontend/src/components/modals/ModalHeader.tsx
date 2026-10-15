import { Text, TouchableOpacity, View } from "react-native";
import { X } from "lucide-react-native";

export default function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
      <Text
        style={{ flex: 1, marginRight: 12, fontFamily: "Chillax-Semibold", fontSize: 24, color: "#111827" }}
      >
        {title}
      </Text>
      <TouchableOpacity
        onPress={onClose}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Close modal"
        style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(152,189,237,0.3)", alignItems: "center", justifyContent: "center" }}
      >
        <X size={22} color="#111827" />
      </TouchableOpacity>
    </View>
  );
}
