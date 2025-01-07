import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Animated, Platform, SafeAreaView, View } from "react-native";
import CustomKeyboard from "./keyboard";
import { Button } from "./button";
import { Text } from "./text";
import RPEKeyboard from "./rpe-keyboard";
import { useWorkoutStore } from "@/store/workoutStore";
import { useHaptic } from "@/lib/useHaptic";

interface KeyboardContextProps {
  activeInputId: string | null;
  registerInput: (id: string) => void;
  unregisterInput: (id: string) => void;
  setActiveInputId: (id: string | null) => void;
  focusNext: (currentId: string) => void;
  currentValue: string;
  inputValues: Record<string, string>;
  setInputValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleKeyPress: (key: string) => void;
  isKeyboardVisible: boolean;
  deleteInput: (id: string) => void;
  setKeyboardType: React.Dispatch<React.SetStateAction<"numbers" | "rpe">>;
  checkSetIsComplete: (targetSetId: string) => boolean;
}

const KeyboardContext = createContext<KeyboardContextProps | null>(null);

export const KeyboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeInputId, setActiveInputId] = useState<string | null>(null);
  const [currentValue, setCurrentValue] = useState("");
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const inputOrder: string[] = [];
  const [keyboardType, setKeyboardType] = useState<"numbers" | "rpe">(
    "numbers",
  );
  const [hasStartedNewInput, setHasStartedNewInput] = useState(false);

  const { updateSetById } = useWorkoutStore();
  const haptic_light = useHaptic("light");
  const haptic_medium = useHaptic("medium");

  const registerInput = (id: string) => {
    if (!inputOrder.includes(id)) inputOrder.push(id);
  };

  const unregisterInput = (id: string) => {
    const index = inputOrder.indexOf(id);
    if (index > -1) inputOrder.splice(index, 1);
  };

  const deleteInput = (id: string) => {
    unregisterInput(id);
    setInputValues(prev => {
      const newValues = { ...prev };
      delete newValues[id];
      return newValues;
    });
  };

  const focusNext = (currentId: string) => {
    const currentIndex = inputOrder.indexOf(currentId);
    const nextIndex = (currentIndex + 1) % inputOrder.length; // Loop back to the first input
    setActiveInputId(inputOrder[nextIndex]);
  };

  const parseInputId = (id: string) => {
    const [exerciseId, setId, field] = id.split("-");
    return { exerciseId, setId, field };
  };

  const handleKeyPress = (key: string, value?: string) => {
    if (!activeInputId) return;

    haptic_light?.();

    switch (key) {
      case "rpe-input": {
        if (!value) return;
        const newValue = value;
        setCurrentValue(newValue);
        setInputValues(prev => ({ ...prev, [activeInputId]: newValue }));

        const { exerciseId, setId, field } = parseInputId(activeInputId);
        updateSetById(exerciseId, { id: setId, [field]: parseFloat(newValue) });
        return;
      }

      case "rpe":
        setKeyboardType("rpe");
        break;

      case "numbers":
        setKeyboardType("numbers");
        break;

      case "backspace": {
        if (!hasStartedNewInput) {
          setHasStartedNewInput(true);
          setInputValues(prev => ({ ...prev, [activeInputId]: "" }));
        } else {
          const newValue = currentValue.slice(0, -1);
          setCurrentValue(newValue);

          const { exerciseId, setId, field } = parseInputId(activeInputId);
          updateSetById(exerciseId, {
            id: setId,
            [field]: parseFloat(newValue),
          });
          setInputValues(prev => ({ ...prev, [activeInputId]: newValue }));
        }
        break;
      }

      case "clear": {
        haptic_medium?.();
        setCurrentValue("");
        setInputValues(prev => ({ ...prev, [activeInputId]: "" }));

        const { exerciseId, setId, field } = parseInputId(activeInputId);
        updateSetById(exerciseId, { id: setId, [field]: 0 });
        break;
      }

      case "next":
      case "hide":
      case "done": {
        setHasStartedNewInput(false);
        if (key === "done") {
          setActiveInputId(null);
        } else if (key === "next") {
          focusNext(activeInputId);
        } else {
          setActiveInputId(null);
        }
        break;
      }

      default: {
        console.log("default", hasStartedNewInput);
        const newValue = hasStartedNewInput ? currentValue + key : key;
        const numValue = parseFloat(newValue);

        if (numValue > 9999) {
          haptic_medium?.();
          return;
        }

        setHasStartedNewInput(true);
        setCurrentValue(newValue);
        setInputValues(prev => ({ ...prev, [activeInputId]: newValue }));

        const { exerciseId, setId, field } = parseInputId(activeInputId);
        updateSetById(exerciseId, { id: setId, [field]: numValue });
      }
    }
  };

  const checkSetIsComplete = (targetSetId: string) => {
    // Combine current inputValues and pendingUpdates
    const allValues = { ...inputValues };
    const setValues: Record<string, string> = {};

    // Filter and collect only values for the target setId
    Object.entries(allValues).forEach(([id, value]) => {
      const [_, setId, field] = id.split("-");
      if (setId === targetSetId) {
        setValues[field] = value;
      }
    });

    // Check if weight and reps are filled (rpe is optional)
    const isComplete = !!(
      setValues.weight &&
      setValues.weight !== "" &&
      setValues.reps &&
      setValues.reps !== ""
    );
    return isComplete;
  };

  const handleDone = () => {
    setActiveInputId(null);
  };

  useEffect(() => {
    if (activeInputId) {
      setHasStartedNewInput(false);
      setCurrentValue(""); // Clear current value but don't update stored value
    }
  }, [activeInputId]); // Remove inputValues from dependencies

  const isKeyboardVisible = activeInputId !== null;
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isKeyboardVisible ? 0 : 300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isKeyboardVisible, slideAnim]);

  const KEYBOARD_HEIGHT = Platform.OS === "ios" ? 240 : 250; // Estimated height including safe area

  return (
    <KeyboardContext.Provider
      value={{
        activeInputId,
        registerInput,
        unregisterInput,
        setActiveInputId,
        focusNext,
        currentValue,
        inputValues,
        setInputValues,
        handleKeyPress,
        isKeyboardVisible,
        deleteInput,
        setKeyboardType,
        checkSetIsComplete,
      }}
    >
      <View
        style={{
          flex: 1,
          paddingBottom: isKeyboardVisible ? KEYBOARD_HEIGHT : 0,
        }}
      >
        {children}
      </View>
      {isKeyboardVisible && (
        <Animated.View
          className="w-full bg-gray-900 rounded-t-3xl"
          style={{
            position: "absolute",
            bottom: 0, // Positioned at the bottom of the screen
            left: 0, // Align with the left edge
            right: 0, // Align with the right edge
            transform: [{ translateY: slideAnim }], // Animated transform
          }}
        >
          <SafeAreaView>
            <Button
              className="rounded-lg"
              onPress={handleDone}
            >
              <Text className="text-white font-medium">Done</Text>
            </Button>
            {keyboardType === "numbers" ? (
              <CustomKeyboard onKeyPress={handleKeyPress} />
            ) : (
              <RPEKeyboard onKeyPress={handleKeyPress} />
            )}
          </SafeAreaView>
        </Animated.View>
      )}
    </KeyboardContext.Provider>
  );
};

export const useKeyboard = () => {
  const context = useContext(KeyboardContext);
  if (!context)
    throw new Error("useKeyboard must be used within a KeyboardProvider");
  return context;
};
