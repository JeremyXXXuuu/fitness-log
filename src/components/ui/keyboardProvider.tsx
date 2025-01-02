import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Animated, SafeAreaView } from "react-native";
import CustomKeyboard from "./keyboard";
import { Button } from "./button";
import { Text } from "./text";
import RPEKeyboard from "./rpe-keyboard";

interface KeyboardContextProps {
  activeInputId: string | null;
  registerInput: (id: string) => void;
  unregisterInput: (id: string) => void;
  setActiveInput: (id: string | null) => void;
  focusNext: (currentId: string) => void;
  currentValue: string;
  inputValues: Record<string, string>;
  handleKeyPress: (key: string) => void;
  isKeyboardVisible: boolean;
  deleteInput: (id: string) => void;
}

const KeyboardContext = createContext<KeyboardContextProps | null>(null);

export const KeyboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeInputId, setActiveInput] = useState<string | null>(null);
  const [currentValue, setCurrentValue] = useState("");
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const inputOrder: string[] = [];
  const [keyboardType, setKeyboardType] = useState<"numbers" | "rpe">(
    "numbers",
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
    setActiveInput(inputOrder[nextIndex]);
  };

  const handleKeyPress = (key: string) => {
    if (!activeInputId) return;

    if (key === "rpe") {
      setKeyboardType("rpe");
    } else if (key === "numbers") {
      setKeyboardType("numbers");
    } else if (key === "backspace") {
      const newValue = currentValue.slice(0, -1);
      setCurrentValue(newValue);
      setInputValues(prev => ({ ...prev, [activeInputId]: newValue }));
    } else if (key === "clear") {
      setCurrentValue("");
      setInputValues(prev => ({ ...prev, [activeInputId]: "" }));
    } else if (key === "next") {
      focusNext(activeInputId);
    } else if (key === "hide") {
      setActiveInput(null);
    } else {
      const newValue = currentValue + key;
      setCurrentValue(newValue);
      setInputValues(prev => ({ ...prev, [activeInputId]: newValue }));
    }
  };

  const handleDone = () => {
    console.log("done", inputValues);
    setActiveInput(null);
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

  return (
    <KeyboardContext.Provider
      value={{
        activeInputId,
        registerInput,
        unregisterInput,
        setActiveInput,
        focusNext,
        currentValue,
        inputValues,
        handleKeyPress,
        isKeyboardVisible,
        deleteInput,
      }}
    >
      {children}
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
