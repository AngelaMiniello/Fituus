import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useGoals } from "@/context/GoalsContext";
import { goalFields, GoalField } from "@/lib/goalFields";

export default function GoalsDashboard({ onEdit }: { onEdit?: (field: GoalField) => void }) {
  const { goals, loading, error, fetchGoals } = useGoals();
  return (
    <View className="p-5 border border-white/60 rounded-[28px] bg-white/75">
      <Text style={{ fontFamily: "Chillax-Semibold" }} className="text-xl text-gray-900">Your goals</Text>
      <Text style={{ fontFamily: "Chillax-Regular" }} className="mt-2 mb-3 text-xs leading-5 text-slate-600">{onEdit ? "Tap a goal to make it your own." : "Your daily targets, all in one place."}</Text>
      {loading ? <ActivityIndicator color="#7797D9" className="my-6" /> : error || !goals ? (
        <View className="py-3">
          <Text style={{ fontFamily: "Chillax-Regular" }} className="text-sm text-slate-600">We couldn't load your goals.</Text>
          <TouchableOpacity onPress={() => void fetchGoals()} className="items-center py-3 mt-3 rounded-full bg-[#98BDED]/40"><Text style={{ fontFamily: "Chillax-Medium" }}>Try again</Text></TouchableOpacity>
        </View>
      ) : goalFields.map((item, index) => {
        const Icon = item.icon;
        const content = <>
          <View style={{ backgroundColor: item.color }} className="items-center justify-center w-10 h-10 mr-3 rounded-2xl"><Icon size={21} color="#111827" strokeWidth={1.6} /></View>
          <View className="flex-1"><Text style={{ fontFamily: "Chillax-Medium" }} className="text-sm text-gray-900">{item.label}</Text><Text style={{ fontFamily: "Chillax-Regular" }} className="mt-1 text-xs text-slate-600">{goals[item.field] ?? "—"} {item.unit}</Text></View>
          {onEdit && <ChevronRight size={18} color="#64748B" />}
        </>;
        const classes = `flex-row items-center py-3 ${index < goalFields.length - 1 ? "border-b border-slate-200/60" : ""}`;
        return onEdit ? <TouchableOpacity key={item.field} onPress={() => onEdit(item)} accessibilityRole="button" className={classes}>{content}</TouchableOpacity> : <View key={item.field} className={classes}>{content}</View>;
      })}
    </View>
  );
}
