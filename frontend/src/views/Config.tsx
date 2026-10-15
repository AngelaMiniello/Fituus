import { useState } from "react";
import { Alert, ImageBackground, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ArrowLeft, LogOut } from "lucide-react-native";
import { useRouter } from "expo-router";
import api from "@/service/api";
import { useGoals } from "@/context/GoalsContext";
import { useAuth } from "@/context/AuthContext";
import GoalsDashboard from "@/components/ui/GoalsDashboard";
import ModalHeader from "@/components/modals/ModalHeader";
import { GoalField } from "@/lib/goalFields";

export default function ConfigPage() {
  const router = useRouter();
  const { goals, setGoals } = useGoals();
  const { handleLogout } = useAuth();
  const [selected, setSelected] = useState<GoalField | null>(null);
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);
  const close = () => { if (!saving) setSelected(null); };
  const save = async () => {
    if (!selected || saving) return;
    const value = Number(input.trim().replace(",", "."));
    if (!input.trim() || !Number.isFinite(value) || value < 0 || value > selected.max || (selected.integer && !Number.isInteger(value)) || (selected.field === "dailyCalories" && value === 0)) {
      Alert.alert("Check your goal", `Enter ${selected.integer ? "a whole number" : "a number"} between ${selected.field === "dailyCalories" ? 1 : 0} and ${selected.max}.`);
      return;
    }
    setSaving(true);
    try {
      const { data } = await api.put("/goals", { [selected.field]: value });
      setGoals(data);
      setSelected(null);
    } catch {
      Alert.alert("Couldn't save your goal", "Please try again. Your changes haven't been saved.");
    } finally { setSaving(false); }
  };
  return (
    <ImageBackground source={require("../../assets/images/public/bg-organic-blue.png")} resizeMode="cover" className="flex-1 bg-[#DDEAF4]">
      <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
        <TouchableOpacity onPress={() => router.replace("/profile")} className="flex-row items-center py-3 mb-2"><ArrowLeft size={18} color="#F2F2F2" /><Text style={{ fontFamily: "Chillax-Medium" }} className="ml-2 text-sm text-[#F2F2F2]">Profile</Text></TouchableOpacity>
        <Text style={{ fontFamily: "Chillax-Bold" }} className="text-3xl text-gray-900">Settings</Text>
        <Text style={{ fontFamily: "Chillax-Regular" }} className="mt-2 mb-6 text-sm leading-6 text-slate-700">Make your goals work for you.</Text>
        <GoalsDashboard onEdit={field => { setSelected(field); setInput(String(goals?.[field.field] ?? "")); }} />
        <TouchableOpacity onPress={() => Alert.alert("Log out?", "You can log back in anytime.", [{ text: "Cancel", style: "cancel" }, { text: "Log out", style: "destructive", onPress: handleLogout }])} className="flex-row items-center justify-center py-4 mt-6 rounded-full bg-[#D9738E]/50"><LogOut size={18} color="#8A3D53" /><Text style={{ fontFamily: "Chillax-Medium" }} className="ml-2 text-sm text-[#8A3D53]">Log out</Text></TouchableOpacity>
      </ScrollView>
      {selected && <Modal visible transparent animationType="slide" onRequestClose={close}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="justify-end flex-1 bg-black/30">
          <Pressable onPress={close} className="flex-1" />
          <View className="p-6 pb-8 rounded-t-[32px] bg-[#F2F2F2]">
            <ModalHeader title={`Edit ${selected.label.toLowerCase()}`} onClose={close} />
            <Text style={{ fontFamily: "Chillax-Regular" }} className="mb-2 text-sm text-slate-600">{selected.unit}</Text>
            <TextInput autoFocus editable={!saving} keyboardType={selected.integer ? "number-pad" : "decimal-pad"} value={input} onChangeText={setInput} style={{ fontFamily: "Chillax-Regular" }} className="p-4 text-base text-gray-900 border border-[#98BDED]/50 rounded-2xl bg-white" />
            <TouchableOpacity disabled={saving} onPress={() => void save()} className="items-center py-4 mt-5 rounded-full bg-[#7797D9]"><Text style={{ fontFamily: "Chillax-Semibold" }} className="text-base text-gray-900">{saving ? "Saving..." : "Save changes"}</Text></TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>}
    </ImageBackground>
  );
}
