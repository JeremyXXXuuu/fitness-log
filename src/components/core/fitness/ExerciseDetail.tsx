import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
} from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { ExerciseSelect } from "@/db/exercises";
import { ExerciseService } from "@/db/exercises";
import { useColorScheme } from "@/lib/useColorScheme";
import { NAV_THEME } from "@/lib/constants";

interface ExerciseDetailProps {
  visible: boolean;
  exercise_id: string;
  onSelect?: (exercise: ExerciseSelect) => void;
  onBack: () => void;
}

export default function ExerciseDetail({
  visible,
  exercise_id,
  onSelect,
  onBack,
}: ExerciseDetailProps) {
  const [exercise, setExercise] = useState<ExerciseSelect | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const screenWidth = Dimensions.get("window").width;
  const { isDarkColorScheme } = useColorScheme();
  const theme = isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light;

  // Load exercise details
  useEffect(() => {
    const loadExercise = async () => {
      try {
        const exercise = await ExerciseService.getExerciseByUUId(exercise_id);
        if (!exercise) {
          console.error("Exercise not found");
          return;
        }
        setExercise(exercise);
      } catch (error) {
        console.error("Failed to load exercise:", error);
      }
    };
    loadExercise();
  }, [exercise_id]);

  if (!exercise) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const parsedInstructions = JSON.parse(
    exercise.instructions as string,
  ) as string[];
  const parsedPrimaryMuscles = JSON.parse(
    exercise.primaryMuscles as string,
  ) as string[];
  const parsedSecondaryMuscles = JSON.parse(
    exercise.secondaryMuscles as string,
  ) as string[];
  const parsedImages = JSON.parse(exercise.images as string) as string[];
  const imageUrls = parsedImages.map(
    img =>
      `https://raw.githubusercontent.com/JeremyXXXuuu/exercise-db/main/exercises/${img}`,
  );

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onBack}
    >
      <View
        className="h-full w-full px-2 pt-16"
        style={{ flex: 1, backgroundColor: theme.background }}
      >
        <View className="flex-row justify-between items-center mb-6 px-4">
          <Button
            variant="link"
            onPress={onBack}
          >
            <Text>Back</Text>
          </Button>
          {onSelect && (
            <Button
              size="sm"
              onPress={() => onSelect(exercise)}
            >
              <Text>Select</Text>
            </Button>
          )}
        </View>

        <ScrollView className="px-4">
          <Text className="text-2xl font-bold mb-4">{exercise.name}</Text>
          {imageUrls.length > 0 && (
            <View className="mb-6">
              <Image
                source={{ uri: imageUrls[selectedImageIndex] }}
                className="w-full h-64 rounded-lg mb-2"
                resizeMode="contain"
              />
              {imageUrls.length > 1 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="h-20"
                >
                  {imageUrls.map((url, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setSelectedImageIndex(index)}
                      className={`mr-2 border-2 rounded-md ${
                        selectedImageIndex === index
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      <Image
                        source={{ uri: url }}
                        style={{ width: 60, height: 60 }}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          )}

          <View className="p-4 rounded-lg mb-4">
            <Text className="font-semibold mb-2">Details</Text>
            <Text>Category: {exercise.category}</Text>
            {exercise.equipment && <Text>Equipment: {exercise.equipment}</Text>}
            {exercise.level && <Text>Level: {exercise.level}</Text>}
            {exercise.mechanic && <Text>Mechanic: {exercise.mechanic}</Text>}
          </View>

          <View className="mb-4">
            <Text className="font-semibold mb-2">Primary Muscles:</Text>
            {parsedPrimaryMuscles.map((muscle, index) => (
              <Text key={index}>• {muscle}</Text>
            ))}
          </View>

          {parsedSecondaryMuscles.length > 0 && (
            <View className="mb-4">
              <Text className="font-semibold mb-2">Secondary Muscles:</Text>
              {parsedSecondaryMuscles.map((muscle, index) => (
                <Text key={index}>• {muscle}</Text>
              ))}
            </View>
          )}

          <View className="mb-4">
            <Text className="font-semibold mb-2">Instructions:</Text>
            {parsedInstructions.map((instruction, index) => (
              <Text
                key={index}
                className="mb-2"
              >
                {index + 1}. {instruction}
              </Text>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
