import { useAuth } from "@/context/AuthContext";
import { Link } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import LogoutButton from "@/components/LogoutButton";

export default function Navtop() {
  const { userData } = useAuth();
    
  const initial = userData?.user?.name?.[0]?.toUpperCase() || "?";
    
  return (
    <View className="w-full px-3 py-2 bg-zinc-900">
      <View className="flex-row items-center justify-between">
        <Text className="text-base text-center font-chillax text-slate-50">
          fituus
        </Text> 
        
        <Link href="/dashboard" asChild>
          <TouchableOpacity activeOpacity={0.8}>
            <View className="flex items-center justify-center bg-[#88B6F2] rounded-full w-9 h-9">
              <Text className="font-semibold text-white">
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