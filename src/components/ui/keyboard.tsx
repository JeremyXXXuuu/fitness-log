import React from "react";
import { View } from "react-native";
import { Text } from "./text";
import { Button } from "./button";

interface CustomKeyboardProps {
  onKeyPress: (key: string) => void;
}

const CustomKeyboard: React.FC<CustomKeyboardProps> = ({ onKeyPress }) => {
  return (
    <View className="flex-row p-1 h-full">
      <View className="w-[70%] h-full flex-[3] flex-row flex-wrap justify-between">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0"].map(key => (
          <Button
            key={key}
            className="w-[32%] aspect-[2] m-0.5 justify-center items-center"
            onPress={() => onKeyPress(key)}
          >
            <Text>{key}</Text>
          </Button>
        ))}
        <Button
          className="w-[32%] aspect-[2] m-0.5 justify-center items-center"
          onPress={() => onKeyPress("backspace")}
        >
          <Text>⌫</Text>
        </Button>
      </View>
      <View className="w-[30%]">
        <Button
          className="m-0.5 justify-center items-center"
          onPress={() => onKeyPress("clear")}
        >
          <Text className="text-center">Clear</Text>
        </Button>
        <Button
          className="m-0.5 justify-center items-center "
          onPress={() => onKeyPress("rpe")}
        >
          <Text className="text-center">RPE</Text>
        </Button>
        <Button
          className="m-0.5 justify-center items-center"
          onPress={() => onKeyPress("-")}
        >
          <Text className="text-center">-</Text>
        </Button>
        <Button
          className="m-0.5 justify-center items-center"
          onPress={() => onKeyPress("+")}
        >
          <Text className="text-center">+</Text>
        </Button>
      </View>
    </View>
  );
};

export default CustomKeyboard;
