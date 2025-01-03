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
  pendingUpdates: Record<string, string>;
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
  const [pendingUpdates, setPendingUpdates] = useState<Record<string, string>>(
    {},
  );

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

  const handleKeyPress = (key: string, value?: string) => {
    if (!activeInputId) return;

    if (key === "rpe-input" && value) {
      const newValue = value;
      setCurrentValue(newValue);
      setInputValues(prev => ({ ...prev, [activeInputId]: newValue }));
      setPendingUpdates(prev => ({ ...prev, [activeInputId]: newValue }));
      return;
    }

    if (key === "rpe") {
      setKeyboardType("rpe");
    } else if (key === "numbers") {
      setKeyboardType("numbers");
    } else if (key === "backspace") {
      const newValue = currentValue.slice(0, -1);
      setCurrentValue(newValue);
      setInputValues(prev => ({ ...prev, [activeInputId]: newValue }));
      setPendingUpdates(prev => ({ ...prev, [activeInputId]: newValue }));
    } else if (key === "clear") {
      setCurrentValue("");
      setInputValues(prev => ({ ...prev, [activeInputId]: "" }));
      setPendingUpdates(prev => ({ ...prev, [activeInputId]: "" }));
    } else if (key === "next") {
      focusNext(activeInputId);
    } else if (key === "hide") {
      setActiveInputId(null);
    } else if (key === "done") {
      handleDone();
    } else {
      const newValue = currentValue + key;
      setCurrentValue(newValue);
      setInputValues(prev => ({ ...prev, [activeInputId]: newValue }));
      setPendingUpdates(prev => ({ ...prev, [activeInputId]: newValue }));
    }
  };

  const { updateSetById } = useWorkoutStore();

  const checkSetIsComplete = (targetSetId: string) => {
    // Combine current inputValues and pendingUpdates
    const allValues = { ...inputValues, ...pendingUpdates };
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
    // if (activeInputId) {
    //   const [_, setId] = activeInputId.split("-");
    //   if (!checkSetIsComplete(setId)) {
    //     return; // Don't close keyboard if current set is incomplete
    //   }
    // }

    // Trigger all pending updates before closing keyboard
    Object.entries(pendingUpdates).forEach(([id, value]) => {
      const [exerciseId, setId, field] = id.split("-");
      updateSetById(exerciseId, { id: setId, [field]: parseFloat(value) });
    });
    setPendingUpdates({});
    setActiveInputId(null);
  };

  useEffect(() => {
    if (activeInputId) {
      setCurrentValue(inputValues[activeInputId] || "");
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
        pendingUpdates,
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
            // backgroundColor: "#000",
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
