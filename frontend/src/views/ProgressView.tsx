import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, ImageBackground, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { Plus, Scale } from "lucide-react-native";
import api from "@/service/api";
import { useAuth } from "@/context/AuthContext";
import ModalHeader from "@/components/modals/ModalHeader";
import WeightChart from "@/components/ui/WeightChart";
import { WeightRecord } from "@/lib/weightCurve";
import { isAxiosError } from "axios";

async function fetchHistory() {
  try {
    const { data } = await api.get<{ entries: WeightRecord[] }>("/user/weight-history");
    if (!Array.isArray(data.entries)) throw new Error("Invalid weight history response");
    return { entries: data.entries, unavailable: false };
  } catch (error) {
    // Older API deployments do not yet have the weight-history route.
    if (isAxiosError(error) && error.response?.status === 404) {
      return { entries: [] as WeightRecord[], unavailable: true };
    }
    throw error;
  }
}

const example: WeightRecord[] = [67, 66.6, 65.1, 64].map((weight, i) => ({ id: i, weight, recordedAt: new Date(Date.UTC(2026, 0, 1 + i * 7)).toISOString() }));

export default function ProgressView() {
  const { userData, setUserData } = useAuth();
  const [entries, setEntries] = useState<WeightRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [weight, setWeight] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const result = await fetchHistory();
    setEntries(result.entries);
    setUnavailable(result.unavailable);
    setError(false);
  }, []);
  useFocusEffect(useCallback(() => {
    let active = true;
    setLoading(true);
    fetchHistory().then(result => {
      if (active) { setEntries(result.entries); setUnavailable(result.unavailable); setError(false); }
    }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []));

  const save = async () => {
    const value = Number(weight.trim().replace(",", "."));
    if (!Number.isFinite(value) || value <= 0 || value >= 1000) {
      Alert.alert("Check your weight", "Enter a valid weight in kg.");
      return;
    }
    if (saving) return;
    setSaving(true);
    let recorded = false;
    try {
      const { data } = await api.post<{ entry: WeightRecord }>("/user/weight-history", { weight: value });
      recorded = true;
      setEntries(previous => [...previous, data.entry]);
      setError(false);
      setModalOpen(false);
      setWeight("");
      if (userData) await setUserData({ ...userData, user: { ...userData.user, weight: value } });
    } catch {
      Alert.alert(recorded ? "Weight saved" : "Could not save", recorded ? "Your weight was saved, but your profile could not refresh. Reopen the app to refresh it." : "Please try again. Your entry has not been saved.");
    } finally { setSaving(false); }
  };

  const first = entries[0];
  const latest = entries[entries.length - 1];
  const change = latest && first ? Math.round((latest.weight - first.weight) * 100) / 100 : 0;
  const current = latest?.weight ?? userData?.user.weight;
  return (
    <ImageBackground source={require("../../assets/images/public/bg-organic-blue.png")} resizeMode="cover" className="flex-1 bg-[#DDEAF4]">
      <ScrollView bounces={false} overScrollMode="never" showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
        <Text style={{ fontFamily: "Chillax-Medium" }} className="mt-2 text-xs tracking-widest text-slate-600">YOUR JOURNEY, YOUR PACE</Text>
        <Text style={{ fontFamily: "Chillax-Bold" }} className="mt-2 text-3xl text-gray-900">Progress</Text>
        <Text style={{ fontFamily: "Chillax-Regular" }} className="mt-2 mb-6 text-sm leading-6 text-slate-700">A little perspective on your weight over time.</Text>
        {loading ? <View className="items-center py-16"><ActivityIndicator color="#7797D9" /></View> : error ? (
          <View className="p-5 rounded-3xl bg-white/80">
            <Text style={{ fontFamily: "Chillax-Medium" }} className="text-base text-gray-900">We couldn't load your progress.</Text>
            <TouchableOpacity onPress={() => { setLoading(true); void load().catch(() => setError(true)).finally(() => setLoading(false)); }} className="items-center py-3 mt-4 rounded-full bg-[#98BDED]/50"><Text style={{ fontFamily: "Chillax-Medium" }} className="text-gray-900">Try again</Text></TouchableOpacity>
          </View>
        ) : (
          <>
            <View className="p-5 border border-white/60 rounded-[28px] bg-white/80">
              <View className="flex-row items-center justify-between mb-5">
                <View><Text style={{ fontFamily: "Chillax-Regular" }} className="text-xs text-slate-600">Latest weight</Text><Text style={{ fontFamily: "Chillax-Bold" }} className="mt-1 text-3xl text-gray-900">{current ?? "—"} <Text style={{ fontFamily: "Chillax-Regular" }} className="text-sm">kg</Text></Text></View>
                <View className="items-center justify-center w-12 h-12 rounded-2xl bg-[#E3AA88]/30"><Scale size={24} color="#8A5435" /></View>
              </View>
              {entries.length >= 2 ? (
                <>
                  <WeightChart entries={entries} />
                  <View className="flex-row justify-between pt-4 mt-5 border-t border-slate-200">
                    <View><Text style={{ fontFamily: "Chillax-Regular" }} className="text-xs text-slate-600">Starting weight</Text><Text style={{ fontFamily: "Chillax-Semibold" }} className="mt-1 text-base text-gray-900">{first.weight} kg</Text></View>
                    <View className="items-end"><Text style={{ fontFamily: "Chillax-Regular" }} className="text-xs text-slate-600">Change since first entry</Text><Text style={{ fontFamily: "Chillax-Semibold" }} className="mt-1 text-base text-gray-900">{change > 0 ? "+" : ""}{change} kg</Text></View>
                  </View>
                </>
              ) : (
                <>
                  <Text style={{ fontFamily: "Chillax-Semibold" }} className="text-xl text-gray-900">Here you'll see your progress.</Text>
                  <Text style={{ fontFamily: "Chillax-Regular" }} className="mt-2 text-sm leading-6 text-slate-600">{unavailable ? "Here's a preview of how your weight history will look. Your personal history is currently unavailable." : entries.length === 1 ? "Your starting weight is recorded. Add another entry to see how it changes." : "Log your first weight to start. Once you have two entries, your own curve will appear here."}</Text>
                  <View className="px-3 pt-4 pb-3 mt-5 rounded-2xl bg-[#F2F2F2]/80">
                    <Text style={{ fontFamily: "Chillax-Medium" }} className="mb-3 text-[10px] tracking-wide text-slate-500">EXAMPLE · NOT YOUR DATA</Text>
                    <WeightChart entries={example} example />
                  </View>
                </>
              )}
            </View>
            {unavailable ? (
              <View className="p-4 mt-5 rounded-2xl bg-white/70">
                <Text style={{ fontFamily: "Chillax-Regular" }} className="text-sm leading-6 text-slate-600">Weight logging isn't available right now. You can still explore the example above.</Text>
                <TouchableOpacity onPress={() => { setLoading(true); void load().catch(() => setError(true)).finally(() => setLoading(false)); }} className="items-center py-3 mt-3 rounded-full bg-[#98BDED]/50">
                  <Text style={{ fontFamily: "Chillax-Medium" }} className="text-sm text-gray-900">Try again</Text>
                </TouchableOpacity>
              </View>
            ) : <TouchableOpacity onPress={() => setModalOpen(true)} activeOpacity={0.8} className="flex-row items-center justify-center py-4 mt-5 rounded-full bg-[#7797D9]">
              <Plus size={20} color="#111827" /><Text style={{ fontFamily: "Chillax-Semibold" }} className="ml-2 text-base text-gray-900">Log weight</Text>
            </TouchableOpacity>}
            <Text style={{ fontFamily: "Chillax-Regular" }} className="px-2 mt-5 text-xs leading-5 text-center text-slate-600">Weight can fluctuate day to day. Your history helps you see the bigger picture.</Text>
            {entries.length > 0 && <View className="p-5 mt-6 rounded-3xl bg-white/70">
              <Text style={{ fontFamily: "Chillax-Semibold" }} className="mb-3 text-lg text-gray-900">Recent entries</Text>
              {entries.slice(-5).reverse().map(entry => <View key={entry.id} className="flex-row justify-between py-3 border-b border-white"><Text style={{ fontFamily: "Chillax-Regular" }} className="text-sm text-slate-600">{new Date(entry.recordedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</Text><Text style={{ fontFamily: "Chillax-Medium" }} className="text-sm text-gray-900">{entry.weight} kg</Text></View>)}
            </View>}
          </>
        )}
      </ScrollView>
      {modalOpen && <Modal visible transparent animationType="slide" onRequestClose={() => { if (!saving) setModalOpen(false); }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 justify-end bg-black/30">
          <Pressable className="flex-1" onPress={() => { if (!saving) setModalOpen(false); }} />
          <View className="p-6 pb-8 rounded-t-[32px] bg-[#F2F2F2]">
            <ModalHeader title="Log weight" onClose={() => { if (!saving) setModalOpen(false); }} />
            <Text style={{ fontFamily: "Chillax-Regular" }} className="mb-2 text-sm text-slate-600">Current weight (kg)</Text>
            <TextInput autoFocus value={weight} onChangeText={setWeight} keyboardType="decimal-pad" placeholder="e.g. 64.5" placeholderTextColor="#64748B" editable={!saving} style={{ fontFamily: "Chillax-Regular" }} className="p-4 text-gray-900 border border-[#98BDED]/50 rounded-2xl bg-white" />
            <TouchableOpacity onPress={() => void save()} disabled={saving} className="items-center py-4 mt-5 rounded-full bg-[#7797D9]">
              <Text style={{ fontFamily: "Chillax-Semibold" }} className="text-base text-gray-900">{saving ? "Saving..." : "Save weight"}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>}
    </ImageBackground>
  );
}
