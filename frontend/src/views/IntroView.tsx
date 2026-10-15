import { useRef, useState } from "react";
import { FlatList, ImageBackground, ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ArrowRight, Beef, Bike, Check, Droplets, Dumbbell, Flame, Footprints, Heart, Utensils, Wheat } from "lucide-react-native";

import { INTRO_STORAGE_KEY } from "@/lib/onboarding";
const pages = [
  { id: "food", eyebrow: "NOURISH YOUR DAY", title: "Small bites.\nBetter habits.", description: "Log your meals and get a clear picture of your calories and nutrients. All in one place.", icon: Utensils, color: "#E3AA88" },
  { id: "water", eyebrow: "MAKE ROOM FOR YOU", title: "A little water.\nA little care.", description: "Keep track of every glass and see your daily hydration goal come closer, sip by sip.", icon: Droplets, color: "#98BDED" },
  { id: "movement", eyebrow: "YOUR PACE, YOUR PROGRESS", title: "Every move\ncounts.", description: "Record your workouts, follow your daily activity and build a routine that feels like you.", icon: Dumbbell, color: "#D9738E" },
];

function Preview({ page }: { page: typeof pages[number] }) {
  const Icon = page.icon;
  return (
    <View className="relative items-center pt-7 pb-4 px-3">
      <View style={{ backgroundColor: page.color }} className="absolute top-3 w-56 h-56 rounded-full opacity-30" />
      <View className="w-full p-5 border border-white rounded-[28px] bg-white/90">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text style={{ fontFamily: "Chillax-Medium" }} className="text-[10px] tracking-widest text-slate-500">YOUR DAILY SNAPSHOT</Text>
            <Text style={{ fontFamily: "Chillax-Semibold" }} className="mt-1 text-lg text-gray-900">
              {page.id === "food" ? "Nutrition" : page.id === "water" ? "Hydration" : "Movement"}
            </Text>
          </View>
          <View style={{ backgroundColor: page.color }} className="items-center justify-center w-12 h-12 rounded-2xl">
            <Icon size={26} color="#111827" strokeWidth={1.6} />
          </View>
        </View>
        {page.id === "food" ? (
          <>
            <View className="flex-row items-center p-3 rounded-2xl bg-[#E3AA88]/25">
              <Flame size={23} color="#8A5435" />
              <View className="ml-3">
                <Text style={{ fontFamily: "Chillax-Semibold" }} className="text-xl text-gray-900">Your daily balance</Text>
                <Text style={{ fontFamily: "Chillax-Regular" }} className="text-xs text-slate-600">Meals, calories & macros</Text>
              </View>
            </View>
            <View className="flex-row mt-4">
              {[{ icon: Beef, name: "Protein", color: "#D9738E" }, { icon: Wheat, name: "Carbs", color: "#7797D9" }, { icon: Heart, name: "Fats", color: "#E3AA88" }].map(({ icon: MacroIcon, name, color }) => (
                <View key={name} className="flex-1 items-center">
                  <View style={{ backgroundColor: color }} className="items-center justify-center w-11 h-11 rounded-2xl">
                    <MacroIcon size={22} color="#111827" strokeWidth={1.6} />
                  </View>
                  <Text style={{ fontFamily: "Chillax-Medium" }} className="mt-2 text-xs text-slate-600">{name}</Text>
                </View>
              ))}
            </View>
          </>
        ) : page.id === "water" ? (
          <>
            <View className="items-center py-2">
              <View className="items-center justify-center w-32 h-32 border-[8px] border-[#98BDED] rounded-full bg-[#98BDED]/15">
                <Droplets size={34} color="#4769A8" strokeWidth={1.6} />
                <Text style={{ fontFamily: "Chillax-Semibold" }} className="mt-1 text-lg text-gray-900">Sip by sip</Text>
              </View>
            </View>
            <View className="flex-row justify-center mt-3">
              {["+250 ml", "+500 ml"].map(label => <View key={label} className="px-4 py-2 mx-1 rounded-full bg-[#98BDED]/35"><Text style={{ fontFamily: "Chillax-Medium" }} className="text-xs text-[#4769A8]">{label}</Text></View>)}
            </View>
          </>
        ) : (
          <>
            {[{ icon: Footprints, label: "A walk at your pace", detail: "Time for yourself" }, { icon: Bike, label: "A ride or a workout", detail: "Track your movement" }].map(({ icon: ActivityIcon, label, detail }) => (
              <View key={label} className="flex-row items-center p-3 mb-2 rounded-2xl bg-[#D9738E]/15">
                <ActivityIcon size={25} color="#8A3D53" strokeWidth={1.6} />
                <View className="flex-1 ml-3">
                  <Text style={{ fontFamily: "Chillax-Medium" }} className="text-xs text-gray-900">{label}</Text>
                  <Text style={{ fontFamily: "Chillax-Regular" }} className="mt-1 text-[10px] text-slate-600">{detail}</Text>
                </View>
                <Check size={17} color="#8A3D53" />
              </View>
            ))}
          </>
        )}
      </View>
    </View>
  );
}

export default function IntroView() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const list = useRef<FlatList<typeof pages[number]>>(null);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const finish = async (destination: "/register" | "/login") => {
    if (leaving) return;
    setLeaving(true);
    try {
      await AsyncStorage.setItem(INTRO_STORAGE_KEY, "true");
    } catch (error) {
      console.error("Could not save intro preference:", error);
    }
    router.replace(destination);
  };

  return (
    <ImageBackground source={require("../../assets/images/public/bg-organic-blue.png")} resizeMode="cover" className="flex-1 bg-[#DDEAF4]">
      <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
        <Text style={{ fontFamily: "Chillax-Semibold" }} className="text-xl text-gray-900">fituus</Text>
        <TouchableOpacity onPress={() => void finish("/register")} disabled={leaving} className="px-3 py-3" accessibilityRole="button">
          <Text style={{ fontFamily: "Chillax-Medium" }} className="text-sm text-slate-600">Skip</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={list} data={pages} horizontal pagingEnabled bounces={false} overScrollMode="never"
        showsHorizontalScrollIndicator={false} keyExtractor={item => item.id}
        extraData={width} getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        onMomentumScrollEnd={event => setIndex(Math.max(0, Math.min(pages.length - 1, Math.round(event.nativeEvent.contentOffset.x / width))))}
        renderItem={({ item }) => (
          <ScrollView style={{ width }} bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingBottom: 12 }}>
            <Preview page={item} />
            <View className="mt-4">
              <Text style={{ fontFamily: "Chillax-Medium" }} className="text-[10px] tracking-[2px] text-slate-600">{item.eyebrow}</Text>
              <Text style={{ fontFamily: "Chillax-Bold" }} className="mt-3 text-3xl leading-[38px] text-gray-900">{item.title}</Text>
              <Text style={{ fontFamily: "Chillax-Regular" }} className="mt-3 text-sm leading-6 text-slate-700">{item.description}</Text>
            </View>
          </ScrollView>
        )}
      />
      <View className="px-6 pb-5 pt-3">
        <View className="flex-row justify-center mb-5">
          {pages.map((page, i) => <TouchableOpacity key={page.id} onPress={() => { list.current?.scrollToIndex({ index: i }); setIndex(i); }} accessibilityRole="button" accessibilityLabel={`Intro ${i + 1} of ${pages.length}`} accessibilityState={{ selected: index === i }} className="p-2"><View className={`h-2 rounded-full ${i === index ? "w-6 bg-[#7797D9]" : "w-2 bg-white/90"}`} /></TouchableOpacity>)}
        </View>
        <TouchableOpacity disabled={leaving} activeOpacity={0.8} accessibilityRole="button"
          onPress={() => { if (index === pages.length - 1) { void finish("/register"); } else { list.current?.scrollToIndex({ index: index + 1 }); setIndex(index + 1); } }}
          className="flex-row items-center justify-center py-4 rounded-full bg-[#7797D9]">
          <Text style={{ fontFamily: "Chillax-Semibold" }} className="text-base text-gray-900">{index === pages.length - 1 ? "Get started" : "Continue"}</Text>
          <ArrowRight size={19} color="#111827" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => void finish("/login")} disabled={leaving} accessibilityRole="button" className="items-center pt-4 pb-2">
          <Text style={{ fontFamily: "Chillax-Medium" }} className="text-xs text-slate-700">Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
