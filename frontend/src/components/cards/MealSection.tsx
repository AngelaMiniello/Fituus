import MealCard from "./MealCard";
import { Plus } from "lucide-react-native";

type MealSectionProps = {
  title: string;
  meals: any[];
  onDelete: (id:number)=>void;
  onAdd: ()=>void;
};

export default function MealSection({ title, meals, onDelete, onAdd}: MealSectionProps){
  return(
    <div className="w-full p-5 text-left transition border rounded-3xl bg-zinc-900 border-zinc-800 hover:border-[#7999D9]">
      <h4 className="text-xl font-semibold text-white"> {title} </h4>

         {meals.length === 0 ? (

        <p className="mt-3 text-sm text-zinc-500">
          No meals added yet
        </p>

      ) : (

        meals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            onDelete={onDelete}
          />
        ))

      )}
      
       <button onClick={onAdd} className="flex items-center justify-center gap-2 w-full py-3 mt-3 text-sm font-medium transition rounded-2xl bg-[#7999D9]/15 text-[#A0CCF2] hover:bg-[#7999D9]/25">
          <Plus size={18} />
          Agregar comida
        </button>
    </div>

  );

}