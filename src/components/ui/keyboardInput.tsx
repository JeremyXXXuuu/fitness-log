import React, { useEffect, useRef, useState } from "react";
import { View, Animated } from "react-native";
import { Text } from "./text";
import { useKeyboard } from "./keyboardProvider";
import { TouchableOpacity as GHTouchableOpacity } from "react-native-gesture-handler";

interface CustomKeyboardInputProps {
  id: string;
  placeholder?: string;
  onSubmit?: (value: string) => void;
  value?: string;
  onChange?: (value: string) => void;
}

const CustomKeyboardInput: React.FC<CustomKeyboardInputProps> = ({
  id,
  placeholder,
  onSubmit,
  value: externalValue,
  onChange,
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

  console.log("inputValues", inputValues);

  const cursorOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    registerInput(id);
    return () => unregisterInput(id);
  }, [id, registerInput, unregisterInput]);

  useEffect(() => {
    if (!isKeyboardVisible && currentValue) {
      onChange?.(currentValue);
      onSubmit?.(currentValue);
    }
  }, [isKeyboardVisible, currentValue, onChange, onSubmit]);

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
    <View className="w-full items-center my-2.5">
      <GHTouchableOpacity
        className="w-4/5 p-4 border border-gray-300 rounded bg-gray-50"
        onPress={handlePressInput}
      >
        <View className="flex-row justify-center items-center">
          <Text
            className={`text-base text-center ${!inputValues[id] ? "text-gray-400" : "text-gray-900"}`}
          >
            {inputValues[id] || placeholder}
          </Text>
          {isKeyboardVisible && (
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
      </GHTouchableOpacity>
    </View>
  );
};

export default CustomKeyboardInput;
