import { useAuth } from "@/context/AuthContext";
import { Link } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import LogoutButton from "@/components/LogoutButton";

export default function Navtop() {
  const { userData } = useAuth();
    
  const initial = userData?.user?.name?.[0]?.toUpperCase() || "?";
    
  return (
    <View className="w-full px-6 py-3 bg-[#7999D9]">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg text-center text-white font-chillax-semibold">
          fituus
        </Text> 
        
        <Link href="/profile" asChild>
          <TouchableOpacity activeOpacity={0.8} accessibilityLabel="Open profile">
            <View className="items-center justify-center border border-white/40 rounded-full bg-white/20 w-9 h-9">
              <Text style={{ fontFamily: "Chillax-Semibold" }} className="text-white">
                {initial}
              </Text>
            </View>
          </TouchableOpacity>
        </Link>
        <LogoutButton />
      </View>
    </View>
  );
}
