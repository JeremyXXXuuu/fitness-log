import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExerciseService, ExerciseInsert } from "@/db/exercises";
import { equipment, primaryMuscles, category } from "@/db/types";
import RNPickerSelect from "react-native-picker-select";
import { useColorScheme } from "@/lib/useColorScheme";
import { NAV_THEME } from "@/lib/constants";

interface CustomExerciseFormProps {
  onSuccess: (exercise: ExerciseInsert) => void;
  onBack: () => void;
}

export default function CustomExerciseForm({
  onSuccess,
  onBack,
}: CustomExerciseFormProps) {
  const { isDarkColorScheme } = useColorScheme();
  const theme = isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light;

  const [formData, setFormData] = useState<Partial<ExerciseInsert>>({
    name: "",
    category: "strength",
    equipment: "body only",
    primaryMuscles: JSON.stringify([]),
    instructions: JSON.stringify([]),
    secondaryMuscles: JSON.stringify([]),
    images: JSON.stringify([]),
  });

  const pickerStyle = {
    inputIOSContainer: { pointerEvents: "none" as const },
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 4,
      color: theme.text,
      marginBottom: 10,
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      color: theme.text,
      marginBottom: 10,
    },
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      alert("Exercise name is required");
      return;
    }

    const newExercise: ExerciseInsert = {
      ...formData,
      id: formData.name.replace(/\s/g, "_"),
      updatedAt: new Date().toISOString(),
      isSynced: 0,
      isUserCreated: 1,
    } as ExerciseInsert;

    try {
      await ExerciseService.createUserCustomExercise(newExercise);
      onSuccess(newExercise);
    } catch (error) {
      console.error("Failed to create exercise:", error);
      alert("Failed to create exercise");
    }
  };

  return (
    <ScrollView className="flex-1 p-4">
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity onPress={onBack}>
          <Text>← Back</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold">Create Custom Exercise</Text>
      </View>

      <Input
        className="mb-4"
        placeholder="Exercise Name"
        value={formData.name}
        onChangeText={text => setFormData(prev => ({ ...prev, name: text }))}
      />

      <View className="mb-4">
        <Text className="mb-2">Category</Text>
        <RNPickerSelect
          value={formData.category}
          onValueChange={value =>
            setFormData(prev => ({ ...prev, category: value }))
          }
          items={Object.values(category).map(cat => ({
            label: cat,
            value: cat,
          }))}
          style={pickerStyle}
          darkTheme={isDarkColorScheme}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      <View className="mb-4">
        <Text className="mb-2">Equipment</Text>
        <RNPickerSelect
          value={formData.equipment}
          onValueChange={value =>
            setFormData(prev => ({ ...prev, equipment: value }))
          }
          items={Object.values(equipment).map(eq => ({
            label: eq,
            value: eq,
          }))}
          style={pickerStyle}
          darkTheme={isDarkColorScheme}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      <View className="mb-4">
        <Text className="mb-2">Primary Muscle</Text>
        <RNPickerSelect
          value={JSON.parse(formData.primaryMuscles || "[]")[0]}
          onValueChange={value =>
            setFormData(prev => ({
              ...prev,
              primaryMuscles: JSON.stringify([value]),
            }))
          }
          items={Object.values(primaryMuscles).map(muscle => ({
            label: muscle,
            value: muscle,
          }))}
          style={pickerStyle}
          darkTheme={isDarkColorScheme}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      <Button onPress={handleSubmit}>
        <Text>Create Exercise</Text>
      </Button>
    </ScrollView>
  );
}
