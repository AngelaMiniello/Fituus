import MealCard from "./MealCard";
import { Plus, Repeat2 } from "lucide-react-native";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRef, useState } from "react";
import { isAxiosError } from "axios";
import api from "@/service/api";
import { useDailyProgress } from "@/context/DailyProgress";

type MealSectionProps = {
  title: string;
  meals: any[];
  onDelete: (id:number)=>void;
  onAdd: ()=>void;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  onRepeated: () => void | Promise<void>;
};

export default function MealSection({ title, meals, onDelete, onAdd, mealType, onRepeated}: MealSectionProps){
  const [repeating, setRepeating] = useState(false);
  const pending = useRef(false);
  const { fetchDailyProgress } = useDailyProgress();
  const repeat = async () => {
    if (pending.current) return;
    pending.current = true;
    setRepeating(true);
    try {
      await api.post("/meals/repeat-last", { mealType, utcOffsetMinutes: new Date().getTimezoneOffset() });
      await Promise.all([onRepeated(), fetchDailyProgress()]);
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error) ? error.response?.data?.message : undefined;
      Alert.alert("Repeat meal", message || "Could not repeat this meal. Please try again.");
    } finally { pending.current = false; setRepeating(false); }
  };
  return(
    <View className="w-full p-5 mb-4 border rounded-3xl bg-[#F2F2F2]/90 border-white/60">
      <Text style={{ fontFamily: "Chillax-Semibold" }} className="text-xl text-gray-900 font-chillax-semibold">{title}</Text>

         {meals.length === 0 ? (

        <Text style={{ fontFamily: "Chillax-Regular" }} className="mt-3 text-sm text-zinc-600">
          No meals added yet
        </Text>

      ) : (

        meals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            onDelete={onDelete}
          />
        ))

      )}
      
       <TouchableOpacity onPress={onAdd} activeOpacity={0.7} className="flex-row items-center justify-center w-full py-3 mt-3 rounded-2xl bg-[#7999D9]/20">
          <Plus size={18} color="#4769A8" />
          <Text style={{ fontFamily: "Chillax-Medium", marginLeft: 8 }} className="text-md font-chillax-semibold text-[#4769A8]">Add food</Text>
        </TouchableOpacity>
        {meals.length === 0 && <TouchableOpacity onPress={() => void repeat()} disabled={repeating} activeOpacity={0.7}
          accessibilityRole="button" accessibilityLabel={`Repeat last ${mealType}`} accessibilityState={{ disabled: repeating, busy: repeating }}
          className="flex-row items-center justify-center w-full py-3 mt-2 border border-[#7999D9]/30 rounded-2xl">
          {repeating ? <ActivityIndicator size="small" color="#4769A8" /> : <Repeat2 size={17} color="#4769A8" />}
          <Text style={{ fontFamily: "Chillax-Medium" }} className="ml-2 text-xs text-[#4769A8]">{repeating ? "Repeating..." : `Repeat last ${mealType}`}</Text>
        </TouchableOpacity>}
    </View>

  );

}
