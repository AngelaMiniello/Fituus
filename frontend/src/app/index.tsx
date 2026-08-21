import React, { useEffect, useState } from "react";
import { View, ImageBackground, ScrollView, Text } from "react-native";
import HealthOverview from "@/components/ui/HealthOverview";
import NutritionCards from "@/components/ui/NutritionCards";

export default function RegisterOptionsPage() {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const MI_IP_COMPUTADORA = "192.168.0.41";

  useEffect(() => {
    fetch(`http://${MI_IP_COMPUTADORA}:3000/`)
      .then((response) => response.text())
      .then((text) => {
        setData(text);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error conectando al backend:", error);
        setData("Error al conectar 😢");
        setLoading(false);
      });
  }, []);

  return (
    // 1. flex-1 OBLIGATORIO en el View principal
    <View className="flex-1 bg-black">
        {/* 2. ScrollView para que si el contenido es largo se pueda deslizar */}
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          className="p-4"
        >
          <NutritionCards />
          <HealthOverview />
        </ScrollView>
    </View>
  );
}