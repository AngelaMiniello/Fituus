import NutritionCards from "@/components/ui/NutritionCards";
import HealthOverview from "@/components/ui/HealthOverview";
import { View } from "react-native";

export default function Home() {
  return(
    <View className="w-full">
      <NutritionCards/>
      <HealthOverview/>
    </View>
  );
}