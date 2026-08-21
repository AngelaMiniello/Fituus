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
      className="flex-row items-center px-4 py-2 space-x-2 border bg-red-500/10 border-red-500/30 rounded-2xl"
    >
      <LogOut size={18} color="#ef4444" />
    </TouchableOpacity>
  );
}