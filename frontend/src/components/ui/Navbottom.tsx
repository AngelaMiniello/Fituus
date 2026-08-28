import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { House, NotebookPen, Plus, ChartColumn, Ellipsis } from "lucide-react-native";

export default function BottomNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  // Helper para saber si la ruta está activa
  const isActive = (path: string) => pathname === path;

  return (
    <View className="absolute bottom-0 left-0 right-0 z-50 pt-2 pb-5 border-t bg-zinc-900 border-zinc-800">
      <View className="flex-row items-center justify-around px-2">
        
        {/* Panel */}
        <TouchableOpacity
          onPress={() => router.push("/")}
          activeOpacity={0.7}
          className="items-center gap-1"
        >
          <House size={22} color={isActive("/") ? "#FFFFFF" : "#9CA3AF"} />
          <Text className={`text-xs ${isActive("/") ? "text-white font-medium" : "text-zinc-400"}`}>
            Panel
          </Text>
        </TouchableOpacity>

        {/* Diario */}
        <TouchableOpacity
          onPress={() => router.push("/diary")}
          activeOpacity={0.7}
          className="items-center gap-1"
        >
          <NotebookPen size={22} color={isActive("/diary") ? "#FFFFFF" : "#9CA3AF"} />
          <Text className={`text-xs ${isActive("/diary") ? "text-white font-medium" : "text-zinc-400"}`}>
            Diario
          </Text>
        </TouchableOpacity>

        {/* Botón Central Flotante */}
        <View className="relative items-center justify-center -top-6">
          <TouchableOpacity
            onPress={() => {
              /* acción del botón + (Ej: abrir Modal de comida) */
            }}
            activeOpacity={0.85}
            className="w-16 h-16 items-center justify-center bg-[#6289D9] rounded-full shadow-lg border-4 border-black"
          >
            <Plus size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Progreso */}
        <TouchableOpacity
          onPress={() => router.push("/progress")}
          activeOpacity={0.7}
          className="items-center gap-1"
        >
          <ChartColumn size={22} color={isActive("/progress") ? "#FFFFFF" : "#9CA3AF"} />
          <Text className={`text-xs ${isActive("/progress") ? "text-white font-medium" : "text-zinc-400"}`}>
            Progreso
          </Text>
        </TouchableOpacity>

        {/* Más */}
        <TouchableOpacity
          onPress={() => router.push("/more")}
          activeOpacity={0.7}
          className="items-center gap-1"
        >
          <Ellipsis size={22} color={isActive("/more") ? "#FFFFFF" : "#9CA3AF"} />
          <Text className={`text-xs ${isActive("/more") ? "text-white font-medium" : "text-zinc-400"}`}>
            Más
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}