import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, AppState, Image, ImageBackground, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Sparkles } from "lucide-react-native";
import api from "@/service/api";
import { dailyWins } from "@/lib/dailyWins";
import { useDailyProgress } from "@/context/DailyProgress";
import { useAuth } from "@/context/AuthContext";

const medals = {
  "check-in": require("../../assets/achievements/daily-check-in.png"),
  food: require("../../assets/achievements/first-bite.png"),
  water: require("../../assets/achievements/hydration-hero.png"),
};

export default function WinsView() {
  const router = useRouter();
  const { userData } = useAuth();
  const { dailyProgress } = useDailyProgress();
  const [snapshot, setSnapshot] = useState<{ meals: number; water: number; waterGoal: number | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [today, setToday] = useState(new Date());
  const request = useRef(0);
  const day = useRef(new Date().toDateString());
  const load = useCallback(async () => {
    const id = ++request.current;
    setLoading(true);
    try {
      const [food, water, goals] = await Promise.all([
        api.get<{ meals: unknown[] }>("/meals/today"),
        api.get<{ amount: number }[]>("/water/today"),
        api.get<{ waterGoal: number | null }>("/goals"),
      ]);
      if (!Array.isArray(food.data.meals) || !Array.isArray(water.data)) throw new Error("Invalid daily progress");
      if (id !== request.current) return;
      const target = Number(goals.data.waterGoal);
      setSnapshot({ meals: food.data.meals.length, water: water.data.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0), waterGoal: target > 0 ? target : null });
      setToday(new Date());
      day.current = new Date().toDateString();
      setError(false);
    } catch {
      if (id === request.current) setError(true);
    } finally { if (id === request.current) setLoading(false); }
  }, [userData?.user.id]);

  useFocusEffect(useCallback(() => {
    void load();
    const subscription = AppState.addEventListener("change", state => { if (state === "active") void load(); });
    // Refresh after midnight as well as when returning to this screen.
    const timer = setInterval(() => {
      if (day.current !== new Date().toDateString()) {
        day.current = new Date().toDateString();
        void load();
      }
    }, 60000);
    return () => { request.current++; subscription.remove(); clearInterval(timer); };
  }, [load]));
  // Quick add can be used without leaving this screen.
  const latestProgress = useRef(dailyProgress);
  useEffect(() => {
    if (latestProgress.current !== dailyProgress) { latestProgress.current = dailyProgress; void load(); }
  }, [dailyProgress, load]);

  const wins = dailyWins(snapshot?.meals ?? 0, snapshot?.water ?? 0, snapshot?.waterGoal ?? null);
  const completed = wins.filter(win => win.complete).length;

  return (
    <ImageBackground source={require("../../assets/images/public/bg-organic-blue.png")} resizeMode="cover" className="flex-1 bg-[#DDEAF4]">
      <ScrollView bounces={false} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={loading && snapshot !== null} onRefresh={() => void load()} tintColor="#7797D9" />} contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
        <TouchableOpacity onPress={() => router.replace("/profile")} className="flex-row items-center py-3 mb-2"><ArrowLeft size={18} color="#F2F2F2" /><Text style={{ fontFamily: "Chillax-Medium" }} className="ml-2 text-sm text-[#F2F2F2]">Profile</Text></TouchableOpacity>
        <Text style={{ fontFamily: "Chillax-Medium" }} className="text-[12px] tracking-[2px] text-slate-700">SMALL HABITS. LITTLE VICTORIES.</Text>
        <Text style={{ fontFamily: "Chillax-Bold" }} className="mt-2 text-3xl text-gray-900">Daily wins</Text>
        <Text style={{ fontFamily: "Chillax-Medium" }} className="mt-2 leading-6 text-md text-slate-800">Three little ways to care for yourself today.</Text>

        <View className="flex-row items-center justify-center mb-5 mt-7">
          <Image source={medals.food} className="w-20 h-20" resizeMode="contain" />
          <Image source={medals["check-in"]} className="w-24 h-24 mx-1" resizeMode="contain" />
          <Image source={medals.water} className="w-20 h-20" resizeMode="contain" />
        </View>

        <View className="p-5 border border-white/70 rounded-[28px] bg-white/70">
          <View className="flex-row flex-wrap items-center justify-between mb-5">
            <View className="flex-row items-center mb-2 mr-2"><Sparkles size={19} color="#8A5435" /><Text style={{ fontFamily: "Chillax-Semibold" }} className="ml-2 text-lg text-gray-900">Your daily board</Text></View>
            <View className="flex-row items-center px-3 py-2 mb-2 rounded-full bg-[#98BDED]/25"><CalendarDays size={14} color="#4769A8" /><Text style={{ fontFamily: "Chillax-Medium" }} className="ml-2 text-[10px] text-[#4769A8]">{today.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</Text></View>
          </View>
          {loading && !snapshot ? <ActivityIndicator className="my-8" color="#7797D9" /> : error ? (
            <View className="py-4"><Text style={{ fontFamily: "Chillax-Regular" }} className="text-sm text-slate-600">We couldn't check today's wins. Try again to see your progress.</Text><TouchableOpacity onPress={() => void load()} className="items-center py-3 mt-4 rounded-full bg-[#98BDED]/40"><Text style={{ fontFamily: "Chillax-Medium" }}>Try again</Text></TouchableOpacity></View>
          ) : <>
            <View className="flex-row items-center justify-between mb-3">
              <Text style={{ fontFamily: "Chillax-Medium" }} className="text-xs text-slate-600">{completed} of 3 completed</Text>
              <Text style={{ fontFamily: "Chillax-Medium" }} className="text-xs text-[#4769A8]">{completed === 3 ? "A lovely little trio!" : "One step at a time"}</Text>
            </View>
            <View className="flex-row mb-5">{wins.map((win, i) => <View key={win.id} style={{ backgroundColor: win.complete ? win.color : "#FFFFFF", marginLeft: i === 0 ? 0 : 6 }} className="flex-1 h-2 rounded-full" />)}</View>
            {wins.map(win => <View key={win.id} className="p-4 mb-3 rounded-3xl" style={{ backgroundColor: win.tint }}>
              <View className="flex-row items-center">
                <Image source={medals[win.id as keyof typeof medals]} style={{ opacity: win.complete ? 1 : 0.5 }} className="w-16 h-16 mr-3" resizeMode="contain" accessibilityLabel={`${win.title} medal${win.complete ? ", earned today" : ", not yet earned"}`} />
                <View className="flex-1">
                  <Text style={{ fontFamily: "Chillax-Semibold" }} className="text-gray-900 text-md">{win.title}</Text>
                  <Text style={{ fontFamily: "Chillax-Medium" }} className="mt-1 text-[12px] leading-5 text-slate-800">{win.description}</Text>
                </View>
                {win.complete && <View className="items-center justify-center w-6 h-6 ml-2 rounded-full bg-white/70"><Check size={15} color="#374151" /></View>}
              </View>
              <View className="h-2 mt-3 overflow-hidden rounded-full bg-white/75" accessible accessibilityLabel={`${win.title}: ${Math.round(win.progress * 100)} percent complete`}><View className="h-full rounded-full" style={{ width: `${win.progress * 100}%`, backgroundColor: win.color }} /></View>
              <Text style={{ fontFamily: "Chillax-Medium" }} className="mt-2 text-[12px] text-slate-700">{win.complete ? "Earned today · " : ""}{win.detail}</Text>
              {!win.complete && <TouchableOpacity accessibilityRole="button" onPress={() => router.push(win.id === "water" && !win.target ? "/config" : "/diary")} className="flex-row items-center self-start py-2 mt-1">
                <Text style={{ fontFamily: "Chillax-Semibold" }} className="mr-2 text-sm text-gray-900">{win.id === "food" ? "Log a meal" : !win.target ? "Set water goal" : "Log water"}</Text><ArrowRight size={14} color="#111827" />
              </TouchableOpacity>}
            </View>)}
            <Text style={{ fontFamily: "Chillax-Regular" }} className="mt-2 text-[12px] leading-5 text-center text-slate-700">A fresh board every day.{"\n"} No pressure to finish them all.</Text>
          </>}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
