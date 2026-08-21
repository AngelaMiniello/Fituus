import {SportShoeIcon, WavesHorizontalIcon, BikeIcon} from "lucide-react-native";
import { useRouter } from "expo-router";

type ExerciseCardProps = {
    exercice: any;
    onDelete: (id:number)=>void;
}

export default function ExerciseCard({ exercice, onDelete}: ExerciseCardProps) {
    const router = useRouter();

    return(
        <div className="w-24 h-24 rounded-full">
            
        </div>
    )
}

