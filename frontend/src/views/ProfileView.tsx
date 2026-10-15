import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight, Settings, Scale } from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";
import GoalsDashboard from "@/components/ui/GoalsDashboard";

export default function ProfileView() {
  const { userData } = useAuth();
  const router = useRouter();
  const user = userData?.user;
  return (
    <ImageBackground source={require("../../assets/images/public/bg-organic-blue.png")} resizeMode="cover" className="flex-1 bg-[#DDEAF4]">
      <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
        <Text style={{ fontFamily: "Chillax-Medium" }} className="mt-2 text-xs tracking-widest text-slate-600">A LITTLE SPACE FOR YOU</Text>
        <View className="flex-row items-center justify-between mt-2 mb-6">
          <Text style={{ fontFamily: "Chillax-Bold" }} className="text-3xl text-gray-900">Profile</Text>
          <TouchableOpacity onPress={() => router.push("/config")} accessibilityRole="button" accessibilityLabel="Open settings" className="items-center justify-center rounded-full w-11 h-11 bg-white/80"><Settings size={22} color="#111827" /></TouchableOpacity>
        </View>
        <View className="items-center p-5 mb-5 border border-white/60 rounded-[28px] bg-white/75">
          <View className="items-center justify-center w-16 h-16 mb-3 rounded-full bg-[#98BDED]/60"><Text style={{ fontFamily: "Chillax-Semibold" }} className="text-2xl text-gray-900">{user?.name?.[0]?.toUpperCase() || "?"}</Text></View>
          <Text style={{ fontFamily: "Chillax-Semibold" }} className="text-xl text-center text-gray-900">{user?.name || "Your profile"}</Text>
          <Text style={{ fontFamily: "Chillax-Regular" }} className="mt-1 text-xs text-center text-slate-600">{user?.email}</Text>
          <View className="flex-row self-stretch mt-5">
            <View className="items-center flex-1"><Text style={{ fontFamily: "Chillax-Semibold" }} className="text-lg text-gray-900">{user?.weight ?? "—"} kg</Text><Text style={{ fontFamily: "Chillax-Regular" }} className="mt-1 text-xs text-slate-600">Profile weight</Text></View>
            <View className="items-center flex-1 border-l border-slate-200"><Text style={{ fontFamily: "Chillax-Semibold" }} className="text-lg text-gray-900">{user?.height ?? "—"} cm</Text><Text style={{ fontFamily: "Chillax-Regular" }} className="mt-1 text-xs text-slate-600">Height</Text></View>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.push("/wins" as any)} accessibilityRole="button" className="flex-row items-center p-4 mb-5 rounded-[28px] bg-[#7797D9]/60">
          <Image source={require("../../assets/achievements/daily-check-in.png")} className="w-16 h-16 mr-3" resizeMode="contain" />
          <View className="flex-1"><Text style={{ fontFamily: "Chillax-Semibold" }} className="text-lg text-gray-900">Daily wins</Text><Text style={{ fontFamily: "Chillax-Regular" }} className="mt-1 text-xs leading-5 text-slate-600">Little habits. Medals made for you.</Text></View><ChevronRight size={18} color="#111827" />
        </TouchableOpacity>
        <GoalsDashboard />
        <TouchableOpacity onPress={() => router.push("/config")} className="flex-row items-center p-4 mt-5 rounded-3xl bg-[#7797D9]/60">
          <Settings size={22} color="#111827" /><View className="flex-1 ml-3"><Text style={{ fontFamily: "Chillax-Semibold" }} className="text-sm text-gray-900">Settings</Text><Text style={{ fontFamily: "Chillax-Regular" }} className="mt-1 text-xs text-slate-600">Edit goals and manage your account</Text></View><ChevronRight size={18} color="#111827" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/progress")} className="flex-row items-center p-4 mt-3 rounded-3xl bg-[#E3AA88]/60">
          <Scale size={22} color="#111827" /><Text style={{ fontFamily: "Chillax-Medium" }} className="flex-1 ml-3 text-sm text-gray-900">View your weight progress</Text><ChevronRight size={18} color="#111827" />
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}
