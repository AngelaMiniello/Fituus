import MealCard from "./MealCard";
import { Plus } from "lucide-react-native";
import { View, Text, TouchableOpacity } from "react-native";

type MealSectionProps = {
  title: string;
  meals: any[];
  onDelete: (id:number)=>void;
  onAdd: ()=>void;
};

export default function MealSection({ title, meals, onDelete, onAdd}: MealSectionProps){
  return(
    <View className="w-full p-5 mb-4 border rounded-3xl bg-[#F2F2F2]/90 border-white/60">
      <Text style={{ fontFamily: "Chillax-Semibold" }} className="text-xl text-gray-900 font-chillax-semibold">{title}</Text>

         {meals.length === 0 ? (

        <Text style={{ fontFamily: "Chillax-Regular" }} className="mt-3 text-sm text-zinc-600">
          No meals added yet
        </Text>

      ) : (

        meals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            onDelete={onDelete}
          />
        ))

      )}
      
       <TouchableOpacity onPress={onAdd} activeOpacity={0.7} className="flex-row items-center justify-center w-full py-3 mt-3 rounded-2xl bg-[#7999D9]/20">
          <Plus size={18} color="#4769A8" />
          <Text style={{ fontFamily: "Chillax-Medium", marginLeft: 8 }} className="text-md font-chillax-semibold text-[#4769A8]">Add food</Text>
        </TouchableOpacity>
    </View>

  );

}
