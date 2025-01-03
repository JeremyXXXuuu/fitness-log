import React, { useEffect, useRef, useState } from "react";
import { View, Animated } from "react-native";
import { Text } from "./text";
import { useKeyboard } from "./keyboardProvider";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface CustomKeyboardInputProps {
  id: string;
  onSubmit?: (value: string) => void;
  keyboardType?: "numbers" | "rpe";
  value?: number;
  onChange?: (value: string) => void;
  className?: string;
}

const CustomKeyboardInput: React.FC<CustomKeyboardInputProps> = ({
  id,
  onSubmit,
  keyboardType = "numbers",
  value: externalValue,
  onChange,
  className,
}) => {
  const {
    activeInputId,
    registerInput,
    unregisterInput,
    setActiveInputId,
    inputValues,
    setInputValues,
    isKeyboardVisible,
    setKeyboardType,
    pendingUpdates,
  } = useKeyboard();

  const [isInitialized, setIsInitialized] = useState(false);

  // Set initial value on mount
  useEffect(() => {
    if (!isInitialized && externalValue !== 0) {
      setInputValues(prev => ({
        ...prev,
        [id]: externalValue?.toString() || "",
      }));
      setIsInitialized(true);
    }
  }, [id, externalValue, setInputValues, isInitialized]);

  const cursorOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    registerInput(id);
    return () => unregisterInput(id);
  }, [id, registerInput, unregisterInput]);

  useEffect(() => {
    if (!isKeyboardVisible && pendingUpdates[id]) {
      const value = pendingUpdates[id];
      requestAnimationFrame(() => {
        onChange?.(value);
        onSubmit?.(value);
      });
    }
  }, [isKeyboardVisible, id, pendingUpdates]);

  useEffect(() => {
    if (isKeyboardVisible && activeInputId === id) {
      // Start cursor blinking animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(cursorOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(cursorOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      cursorOpacity.setValue(0);
    }
  }, [isKeyboardVisible, cursorOpacity, activeInputId, id]);

  const handlePressInput = () => {
    console.log("Press input", id);
    setActiveInputId(id);
    setKeyboardType(keyboardType);
  };

  return (
    <View className={cn("w-full items-center", className)}>
      <Button
        variant="outline"
        className="w-16 h-10 rounded-xl"
        onPress={handlePressInput}
      >
        <View className="flex-row justify-center items-center">
          <Text
            className={`text-base text-center`}
            style={{ width: inputValues[id] || externalValue ? "auto" : 0 }}
          >
            {inputValues[id]}
          </Text>
          {isKeyboardVisible && activeInputId === id && (
            <Animated.View
              style={{
                opacity: cursorOpacity,
                backgroundColor: "#000",
                width: 2,
                height: 20,
                marginLeft: 2,
              }}
            />
          )}
        </View>
      </Button>
    </View>
  );
};

export default CustomKeyboardInput;
