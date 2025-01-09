import React, { useState, useEffect, useMemo } from "react";
import { View, FlatList, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { ExerciseService } from "@/db/exercises";
import { ExerciseSelect } from "@/db/exercises";
import ExerciseDetail from "./ExerciseDetail";
import CustomExerciseForm from "./CustomExerciseForm";
import { Button } from "@/components/ui/button";
import { useColorScheme } from "@/lib/useColorScheme";
import { NAV_THEME } from "@/lib/constants";
import Fuse from "fuse.js";

interface ExerciseSearchProps {
  visible: boolean;
  onSelect: (exercise: ExerciseSelect) => void;
  onClose: () => void;
}

export default function ExerciseSearch({
  visible,
  onSelect,
  onClose,
}: ExerciseSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ExerciseSelect[]>([]);
  const [exercises, setExercises] = useState<ExerciseSelect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] =
    useState<ExerciseSelect | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);

  const { isDarkColorScheme } = useColorScheme();
  const theme = isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light;

  // Configure Fuse options
  const fuseOptions = {
    keys: ["name", "force", "category", "primaryMuscles", "equipment"],
    threshold: 0.3,
    includeScore: true,
  };

  // Create Fuse instance
  const fuse = useMemo(() => new Fuse(exercises, fuseOptions), [exercises]);

  // Load all exercises initially
  useEffect(() => {
    const loadExercises = async () => {
      setIsLoading(true);
      try {
        const loadedExercises = await ExerciseService.getAllExercises();
        setExercises(loadedExercises);
        setResults(loadedExercises);
      } catch (error) {
        console.error("Failed to load exercises:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadExercises();
  }, []);

  // Handle search with Fuse.js
  useEffect(() => {
    if (!query.trim()) {
      setResults(exercises);
      return;
    }

    const searchResults = fuse.search(query);
    setResults(searchResults.map(result => result.item));
  }, [query, fuse]);

  if (showCustomForm) {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={visible}
        onRequestClose={onClose}
      >
        <SafeAreaView
          className="h-full w-full pt-12"
          style={{ backgroundColor: theme.background }}
        >
          <CustomExerciseForm
            onSuccess={exercise => {
              onSelect(exercise as ExerciseSelect);
              setShowCustomForm(false);
            }}
            onBack={() => setShowCustomForm(false)}
          />
        </SafeAreaView>
      </Modal>
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        className="h-full w-full pt-16 px-4"
        style={{ backgroundColor: theme.background }}
      >
        <View className="flex-row justify-between items-center mb-6 px-4">
          <Text className="text-xl font-bold">Select Exercise</Text>
          <Button
            variant="link"
            onPress={onClose}
          >
            <Text>Close</Text>
          </Button>
        </View>

        <View className="flex-row justify-between mb-4 items-center">
          <Input
            value={query}
            onChangeText={setQuery}
            placeholder="Search exercises..."
            className="flex-1 mr-2"
          />
          <Button
            size="sm"
            onPress={() => setShowCustomForm(true)}
          >
            <Text>Create</Text>
          </Button>
        </View>

        {isLoading ? (
          <Text className="text-center">Loading exercises...</Text>
        ) : (
          <FlatList
            data={results}
            keyExtractor={item => item.uuid}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedExercise(item)}
                className="p-3 border-b border-gray-200"
              >
                <Text className="text-lg">{item.name}</Text>
                <Text className="text-sm text-gray-500">{item.category}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        {selectedExercise && (
          <ExerciseDetail
            visible={!!selectedExercise}
            exercise_id={selectedExercise.uuid}
            onSelect={onSelect}
            onBack={() => setSelectedExercise(null)}
          />
        )}
      </View>
    </Modal>
  );
}
