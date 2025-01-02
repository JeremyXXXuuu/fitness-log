import React from "react";
import { View } from "react-native";
import { Text } from "./text";
import { Button } from "./button";

interface CustomKeyboardProps {
  onKeyPress: (key: string) => void;
}

const CustomKeyboard: React.FC<CustomKeyboardProps> = ({ onKeyPress }) => {
  return (
    <View className="flex-row p-2 mb-3">
      <View className="flex-[3] flex-row flex-wrap justify-center">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"].map(key => (
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
      <View className="flex-1 justify-center px-2 space-y-2">
        <Button
          className="p-4"
          onPress={() => onKeyPress("clear")}
        >
          <Text className="text-center">Clear</Text>
        </Button>
        <Button
          className="p-4"
          onPress={() => onKeyPress("clear")}
        >
          <Text className="text-center">RPE</Text>
        </Button>
        <Button
          className="p-4"
          onPress={() => onKeyPress("clear")}
        >
          <Text className="text-center">-</Text>
        </Button>
        <Button
          className="p-4"
          onPress={() => onKeyPress("clear")}
        >
          <Text className="text-center">+</Text>
        </Button>
        {/* <Button
          className="p-4"
          onPress={() => onKeyPress("hide")}
        >
          <Text className="text-center">Hide</Text>
        </Button> */}
        <Button
          className="p-4"
          onPress={() => onKeyPress("next")}
        >
          <Text className="text-center">Next</Text>
        </Button>
      </View>
    </View>
  );
};

export default CustomKeyboard;
