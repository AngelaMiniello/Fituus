import React from "react";
import QuickAdd from "../modals/QuickAdd";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { House, NotebookPen, Plus, ChartColumn, CircleStarIcon } from "lucide-react-native";

export default function BottomNavbar() {
  const [quickAddOpen, setQuickAddOpen] = React.useState(false);
  const [navbarHeight, setNavbarHeight] = React.useState(80);
  const router = useRouter();
  const pathname = usePathname();
  const tabs = [
    { path: "/", label: "Home", icon: House },
    { path: "/diary", label: "Diary", icon: NotebookPen },
    { path: "/progress", label: "Progress", icon: ChartColumn },
    { path: "/wins", label: "Wins", icon: CircleStarIcon },
  ] as const;
  const tab = (item: typeof tabs[number]) => {
    const active = pathname === item.path || (item.path === "/" && pathname === "/home");
    const Icon = item.icon;
    return (
      <TouchableOpacity key={item.path} onPress={() => router.push(item.path as any)} activeOpacity={0.7}
        accessibilityRole="tab" accessibilityState={{ selected: active }}
        className={`items-center justify-center px-3 py-2 rounded-2xl ${active ? "bg-white/15" : "bg-transparent"}`}>
        <Icon size={22} color={active ? "#FFFFFF" : "#E4ECFA"} strokeWidth={active ? 2.2 : 1.7} />
        <Text style={{ fontFamily: active ? "Chillax-Semibold" : "Chillax-Regular" }} className={`mt-1 text-[10px] ${active ? "text-white" : "text-[#E4ECFA]"}`}>{item.label}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <>
      <View onLayout={({ nativeEvent }) => setNavbarHeight(nativeEvent.layout.height)} className="absolute bottom-0 left-0 right-0 z-50 pt-2 pb-4 bg-[#7999D9]">
        <View className="flex-row items-center justify-around px-2">
          {tab(tabs[0])}
          {tab(tabs[1])}
          <View className="relative items-center justify-center -top-6">
            <TouchableOpacity onPress={() => setQuickAddOpen(true)} activeOpacity={0.85}
              accessibilityRole="button" accessibilityLabel="Add water, food or exercise"
              className="items-center justify-center w-16 h-16 border-4 border-[#7999D9] rounded-full bg-[#F2F2F2]">
              <Plus size={32} color="#577CC2" />
            </TouchableOpacity>
          </View>
          {tab(tabs[2])}
          {tab(tabs[3])}
        </View>
      </View>
      {quickAddOpen && <QuickAdd bottomOffset={navbarHeight + 20} onClose={() => setQuickAddOpen(false)} />}
    </>
  );
}
