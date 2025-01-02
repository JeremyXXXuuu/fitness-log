import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { Text } from "./text";
import { useKeyboard } from "./keyboardProvider";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface CustomKeyboardInputProps {
  id: string;
  onSubmit?: (value: string) => void;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const CustomKeyboardInput: React.FC<CustomKeyboardInputProps> = ({
  id,
  onSubmit,
  value: externalValue,
  onChange,
  className,
}) => {
  const {
    activeInputId,
    registerInput,
    unregisterInput,
    setActiveInput,
    currentValue,
    inputValues,
    isKeyboardVisible,
  } = useKeyboard();

  const cursorOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    registerInput(id);
    return () => unregisterInput(id);
  }, [id, registerInput, unregisterInput]);

  useEffect(() => {
    if (!isKeyboardVisible && currentValue) {
      onChange?.(currentValue);
      onSubmit?.(inputValues[id]);
    }
  }, [isKeyboardVisible, currentValue, onChange, onSubmit, inputValues, id]);

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
    setActiveInput(id);
  };

  return (
    <View className={cn("w-full items-center", className)}>
      <Button
        variant="outline"
        className="w-20 h-10 rounded-xl"
        onPress={handlePressInput}
      >
        <View className="flex-row justify-center items-center">
          <Text
            className={`text-base text-center`}
            style={{ width: inputValues[id] ? "auto" : 0 }}
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
