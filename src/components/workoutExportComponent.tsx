import { Alert, Share } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { WorkoutLogService } from "@/db/workout_log";

interface WorkoutExportProps {
  userId: string;
}

export function WorkoutExportComponent({ userId }: WorkoutExportProps) {
  const handleExport = async () => {
    try {
      const workouts =
        await WorkoutLogService.getAllWorkoutLogsByUserId(userId);
      const workoutData = JSON.stringify(workouts, null, 2);

      await Share.share({
        message: workoutData,
        title: "Workout Data Export",
      });
    } catch (error) {
      Alert.alert("Export Failed", "Failed to export workout data");
    }
  };

  return (
    <Button
      onPress={handleExport}
      variant="secondary"
    >
      <Text>Export All WorkoutLogs</Text>
    </Button>
  );
}
