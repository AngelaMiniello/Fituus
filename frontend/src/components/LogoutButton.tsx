import React from "react";
import { TouchableOpacity } from "react-native";
import { LogOut } from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";

export default function LogoutButton() {
  const { handleLogout } = useAuth();

  return (
    <TouchableOpacity
      onPress={handleLogout}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Log out"
      className="items-center justify-center px-4 py-2 border border-white/30 bg-white/15 rounded-2xl"
    >
      <LogOut size={18} color="#FFFFFF" />
    </TouchableOpacity>
  );
}
