import { useState } from "react";
import { View, Text, Pressable, TouchableOpacity, StyleSheet } from "react-native";
import { Droplets, Utensils, Dumbbell } from "lucide-react-native";
import ModalHeader from "./ModalHeader";
import WaterModal from "./AddWaterModal";
import MealModal from "./AddMealModal";
import ExerciseModal from "./AddExcersiceModal";
import { useDailyProgress } from "@/context/DailyProgress";

export default function QuickAdd({ onClose, bottomOffset }: { onClose: () => void; bottomOffset: number }) {
  const [selection, setSelection] = useState<"water" | "food" | "exercise" | null>(null);
  const { fetchDailyProgress } = useDailyProgress();
  const options = [
    { id: "water" as const, label: "Add water", icon: Droplets, color: "bg-[#98BDED]/50" },
    { id: "food" as const, label: "Add food", icon: Utensils, color: "bg-[#E3AA88]/40" },
    { id: "exercise" as const, label: "Add exercise", icon: Dumbbell, color: "bg-[#D9738E]/30" },
  ];

  if (selection === "water") return <WaterModal visible onClose={onClose} onWaterAdded={() => {}} />;
  if (selection === "food") return <MealModal visible onClose={onClose} onSuccess={() => {
    void fetchDailyProgress();
  }} />;
  if (selection === "exercise") return <ExerciseModal visible onClose={onClose} onExerciseAdded={() => {
    void fetchDailyProgress();
  }} />;

  return (
    <View style={[StyleSheet.absoluteFillObject, { zIndex: 60 }]}>
      <Pressable accessibilityLabel="Close menu" onPress={onClose} style={StyleSheet.absoluteFillObject} className="bg-black/20" />
      <View style={{ position: "absolute", bottom: bottomOffset, left: 12, right: 12 }} className="p-4 rounded-[28px] bg-[#F2F2F2] border border-white/60">
        <ModalHeader title="Quick add" onClose={onClose} />
        <View className="flex-row">
        {options.map(({ id, label, icon: Icon, color }) => (
          <TouchableOpacity key={id} onPress={() => setSelection(id)} activeOpacity={0.7}
            accessibilityRole="button" className={`flex-1 items-center justify-center px-1 py-3 mx-1 rounded-2xl ${color}`}>
            <Icon size={22} color="#111827" />
            <Text style={{ fontFamily: "Chillax-Medium" }} className="mt-2 text-xs text-center text-gray-900">{label}</Text>
          </TouchableOpacity>
        ))}
        </View>
      </View>
    </View>
  );
}
